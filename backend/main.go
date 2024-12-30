package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type UserData struct {
	URL string `json:"url"`
}

type PostDetails struct {
	Cid         string `json:"cid"`
	Playlist    string `json:"playlist"`
	Thumbnail   string `json:"thumbnail"`
	LikeCount   int    `json:"likeCount"`
	ReplyCount  int    `json:"replyCount"`
	RepostCount int    `json:"repostCount"`
	AspectRatio *AspectRatio
}

type AspectRatio struct {
	Height int `json:"height"`
	Width  int `json:"width"`
}

// EnsureDirectories ensures the root videos directory and post-specific subdirectory exist.
func EnsureDirectories(postID string) (string, error) {
	rootDir := "videos"

	if _, err := os.Stat(rootDir); os.IsNotExist(err) {
		fmt.Println("Creating root directory:", rootDir)
		err := os.Mkdir(rootDir, 0755)
		if err != nil {
			return "", fmt.Errorf("failed to create root directory: %v", err)
		}
	}

	postDir := filepath.Join(rootDir, postID)
	fmt.Println("Ensuring post-specific directory:", postDir)

	if _, err := os.Stat(postDir); os.IsNotExist(err) {
		err := os.Mkdir(postDir, 0755)
		if err != nil {
			return "", fmt.Errorf("failed to create post directory: %v", err)
		}
		fmt.Println("Created post directory:", postDir)
	}

	return postDir, nil
}

func process(w http.ResponseWriter, r *http.Request) {
	var input UserData

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		fmt.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if input.URL == "" {
		fmt.Println("Error: URL is missing in the request")
		http.Error(w, "URL is required", http.StatusBadRequest)
		return
	}

	fmt.Println("Received URL:", input.URL)
	profile, postID, err := extractPostDetails(input.URL)
	if err != nil {
		fmt.Println("Error extracting post details:", err)
		http.Error(w, "Invalid URL format", http.StatusBadRequest)
		return
	}

	postDetails, err := FetchPostMetadata(profile, postID)
	if err != nil {
		fmt.Println("Error fetching post metadata:", err)
		http.Error(w, fmt.Sprintf("Error fetching metadata: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Printf("Fetched Post Metadata: %+v\n", postDetails)

	resolutions, err := fetchAvailableResolutions(postDetails.Playlist)
	if err != nil {
		fmt.Println("Error fetching resolutions:", err)
		http.Error(w, fmt.Sprintf("Error fetching resolutions: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Println("Available resolutions:", resolutions)

	response := map[string]interface{}{
		"profile":     profile,
		"postID":      postID,
		"thumbnail":   postDetails.Thumbnail,
		"likeCount":   postDetails.LikeCount,
		"replyCount":  postDetails.ReplyCount,
		"repostCount": postDetails.RepostCount,
		"resolutions": resolutions,
	}

	fmt.Printf("Response sent to frontend: %+v\n", response)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func fetchAvailableResolutions(playlistURL string) ([]string, error) {
	fmt.Println("Fetching master playlist:", playlistURL)

	// Fetch the master .m3u8 file
	resp, err := http.Get(playlistURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch .m3u8 file: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("master playlist returned status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read .m3u8 file: %v", err)
	}

	lines := strings.Split(string(body), "\n")
	var resolutions []string

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.Contains(line, "RESOLUTION=") {
			// Extract the resolution value
			resolutionStr := strings.Split(line, "RESOLUTION=")[1]
			resolutionParts := strings.Split(resolutionStr, ",")[0] // Ignore other attributes
			resolutions = append(resolutions, resolutionParts)
		}
	}

	fmt.Println("Available resolutions:", resolutions)
	return resolutions, nil
}

func download(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Profile    string `json:"profile"`
		PostID     string `json:"postID"`
		Resolution string `json:"resolution"`
		Format     string `json:"format"` // New field for desired format
	}

	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		fmt.Printf("Error decoding request body: %v\n", err)
		return
	}

	// Validate required fields
	if input.Profile == "" || input.PostID == "" || input.Resolution == "" {
		http.Error(w, "Profile, PostID, and Resolution are required", http.StatusBadRequest)
		fmt.Printf("Missing parameters: Profile=%s, PostID=%s, Resolution=%s\n", input.Profile, input.PostID, input.Resolution)
		return
	}

	// Default format to MP4 if not provided
	if input.Format == "" {
		input.Format = "mp4"
	}

	// Validate format
	if input.Format != "mp4" && input.Format != "ts" {
		http.Error(w, "Invalid format. Only 'mp4' and 'ts' are supported.", http.StatusBadRequest)
		fmt.Printf("Invalid format: %s\n", input.Format)
		return
	}

	fmt.Printf("Processing video for Profile: %s, PostID: %s, Resolution: %s, Format: %s\n",
		input.Profile, input.PostID, input.Resolution, input.Format)

	// Fetch metadata
	postDetails, err := FetchPostMetadata(input.Profile, input.PostID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching metadata: %v", err), http.StatusInternalServerError)
		fmt.Printf("Error fetching metadata: %v\n", err)
		return
	}

	// Paths for processing
	tempDir := filepath.Join("videos", input.PostID)
	videoPath := filepath.Join(tempDir, fmt.Sprintf("%s.mp4", input.PostID))
	trimmedVideoPath := filepath.Join(tempDir, fmt.Sprintf("%s_trimmed.mp4", input.PostID))
	finalFileName := fmt.Sprintf("%s_linuxlock.org.%s", input.PostID, input.Format)
	finalFilePath := filepath.Join(tempDir, finalFileName)

	// Process the video
	err = processM3U8(postDetails.Playlist, input.Resolution, input.PostID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error processing video: %v", err), http.StatusInternalServerError)
		fmt.Printf("Error processing m3u8: %v\n", err)
		return
	}

	// Trim the video and convert to the desired format
	err = trimVideo(videoPath, trimmedVideoPath, "00:00:00.5", input.Format)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error trimming video: %v", err), http.StatusInternalServerError)
		fmt.Printf("Error trimming video: %v\n", err)
		return
	}

	// Rename the trimmed video file to the final name
	err = os.Rename(trimmedVideoPath, finalFilePath)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error renaming video file: %v", err), http.StatusInternalServerError)
		fmt.Printf("Error renaming video file: %v\n", err)
		return
	}
	fmt.Printf("Trimmed video renamed successfully: %s\n", finalFilePath)

	// Respond with the final video URL
	response := map[string]string{
		"status":   "success",
		"message":  "Video processed successfully",
		"filename": fmt.Sprintf("http://localhost:4000/videos/%s/%s", input.PostID, finalFileName),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func trimVideo(inputPath, outputPath, startTime, format string) error {
	// Normalize paths for FFmpeg
	ffmpegInputPath := filepath.ToSlash(inputPath)
	ffmpegOutputPath := filepath.ToSlash(outputPath)

	// Determine FFmpeg codec and extension
	var codec string
	if format == "mp4" {
		codec = "libx264"
	} else if format == "ts" {
		codec = "mpegts"
		ffmpegOutputPath = strings.Replace(ffmpegOutputPath, ".mp4", ".ts", 1)
	}

	fmt.Printf("Trimming video: inputPath=%s, outputPath=%s, format=%s\n", ffmpegInputPath, ffmpegOutputPath, format)

	// Ensure the input file exists
	if _, err := os.Stat(ffmpegInputPath); os.IsNotExist(err) {
		return fmt.Errorf("input file does not exist: %s", ffmpegInputPath)
	}

	// Run FFmpeg command
	cmd := exec.Command(
		"ffmpeg", "-y", "-i", ffmpegInputPath, "-ss", startTime,
		"-c:v", codec, "-preset", "fast", "-crf", "23",
		"-c:a", "aac", "-strict", "experimental", ffmpegOutputPath,
	)

	// Capture FFmpeg output
	var stdOut, stdErr strings.Builder
	cmd.Stdout = &stdOut
	cmd.Stderr = &stdErr

	err := cmd.Run()
	if err != nil {
		fmt.Printf("FFmpeg stdout: %s\n", stdOut.String())
		fmt.Printf("FFmpeg stderr: %s\n", stdErr.String())
		return fmt.Errorf("failed to trim and re-encode video: %v", err)
	}

	fmt.Printf("FFmpeg stdout: %s\n", stdOut.String())
	fmt.Printf("Video trimmed and re-encoded successfully: %s\n", ffmpegOutputPath)
	return nil
}

func processM3U8(playlistURL, resolution, postID string) error {
	// Define temporary directory for this post
	tempDir := filepath.Join("videos", postID)
	fmt.Println("Ensuring temporary directory for the post:", tempDir)

	// Ensure the post directory exists
	err := os.MkdirAll(tempDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create temporary directory: %v", err)
	}

	fmt.Println("Fetching master playlist:", playlistURL)

	// Fetch the master .m3u8 file
	resp, err := http.Get(playlistURL)
	if err != nil {
		return fmt.Errorf("failed to fetch .m3u8 file: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("master playlist returned status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read .m3u8 file: %v", err)
	}

	fmt.Println("Master playlist content:\n", string(body))

	// Parse the .m3u8 file
	lines := strings.Split(string(body), "\n")
	fmt.Println("Parsing master playlist for resolution:", resolution)

	var resolutionURL string
	baseURL := playlistURL[:strings.LastIndex(playlistURL, "/")+1] // Extract base URL
	fmt.Println("Base URL for playlist:", baseURL)

	// Separate resolution into width and height
	resolutionParts := strings.Split(resolution, "x")
	if len(resolutionParts) != 2 {
		return fmt.Errorf("invalid resolution format: %s", resolution)
	}
	targetWidth := resolutionParts[0]
	targetHeight := resolutionParts[1]

	// Iterate through lines to find the desired resolution and its URL
	for i := 0; i < len(lines)-1; i++ {
		line := strings.TrimSpace(lines[i])
		fmt.Printf("Processing line %d: %s\n", i, line)

		if strings.Contains(line, "RESOLUTION=") {
			resolutionStr := strings.Split(line, "RESOLUTION=")[1]
			resolutionParts := strings.Split(resolutionStr, ",")[0]
			width, height, found := strings.Cut(resolutionParts, "x")
			if !found {
				fmt.Printf("Skipping line %d: Invalid resolution format in line\n", i)
				continue
			}

			if width == targetWidth && height == targetHeight {
				if i+1 < len(lines) {
					nextLine := strings.TrimSpace(lines[i+1])
					if nextLine != "" && !strings.HasPrefix(nextLine, "#") {
						resolutionURL = nextLine
						break
					}
				}
			}
		}
	}

	if resolutionURL == "" {
		return fmt.Errorf("resolution %s not found in .m3u8 file", resolution)
	}

	if !strings.HasPrefix(resolutionURL, "http") {
		resolutionURL = baseURL + resolutionURL
	}

	fmt.Println("Full resolution-specific URL:", resolutionURL)

	// Process resolution-specific .m3u8 file
	err = downloadSegments(resolutionURL, tempDir)
	if err != nil {
		return fmt.Errorf("failed to process resolution %s: %v", resolution, err)
	}

	return nil
}

func downloadSegments(resolutionURL, tempDir string) error {
	fmt.Println("Fetching resolution-specific .m3u8 file:", resolutionURL)

	// Fetch the resolution-specific .m3u8 file
	resp, err := http.Get(resolutionURL)
	if err != nil {
		return fmt.Errorf("failed to fetch resolution-specific .m3u8 file: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("resolution-specific .m3u8 returned status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read resolution-specific .m3u8 file: %v", err)
	}

	lines := strings.Split(string(body), "\n")
	baseURL := resolutionURL[:strings.LastIndex(resolutionURL, "/")+1]
	fmt.Println("Base URL for segments:", baseURL)

	var segmentFiles []string
	for i, line := range lines {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "#") && line != "" {
			if !strings.HasPrefix(line, "http") {
				line = baseURL + line
			}

			segmentPath := filepath.Join(tempDir, fmt.Sprintf("segment-%d.ts", i))
			segmentFiles = append(segmentFiles, segmentPath)

			fmt.Printf("Downloading segment %d: %s\n", i, line)

			resp, err := http.Get(line)
			if err != nil {
				return fmt.Errorf("failed to download segment %d: %v", i, err)
			}
			defer resp.Body.Close()

			out, err := os.Create(segmentPath)
			if err != nil {
				return fmt.Errorf("failed to create segment file: %v", err)
			}
			defer out.Close()

			_, err = io.Copy(out, resp.Body)
			if err != nil {
				return fmt.Errorf("failed to save segment %d: %v", i, err)
			}
		}
	}

	// Combine segments into MP4
	err = combineSegments(segmentFiles, tempDir, filepath.Base(tempDir))
	if err != nil {
		return fmt.Errorf("failed to combine segments: %v", err)
	}

	return nil
}

func combineSegments(segmentFiles []string, postDir, postID string) error {
	// Path to `segments.txt`
	segmentsTxtPath := filepath.Join(postDir, "segments.txt")

	// Create the `segments.txt` file
	listFile, err := os.Create(segmentsTxtPath)
	if err != nil {
		return fmt.Errorf("failed to create segments.txt file: %v", err)
	}
	defer listFile.Close()

	// Write segment file entries
	for _, segment := range segmentFiles {
		relativePath := filepath.Base(segment)
		listFile.WriteString(fmt.Sprintf("file '%s'\n", relativePath))
	}

	// Output MP4 file path
	outputFile := filepath.Join(postDir, fmt.Sprintf("%s.mp4", postID))

	// Normalize paths for FFmpeg
	ffmpegSegmentsPath := filepath.ToSlash(segmentsTxtPath)
	ffmpegOutputPath := filepath.ToSlash(outputFile)

	// Ensure the directory exists
	if _, err := os.Stat(postDir); os.IsNotExist(err) {
		if err := os.MkdirAll(postDir, 0755); err != nil {
			return fmt.Errorf("failed to create output directory: %v", err)
		}
	}

	// Construct the FFmpeg command
	cmd := exec.Command("ffmpeg", "-f", "concat", "-safe", "0", "-i", ffmpegSegmentsPath, "-c", "copy", ffmpegOutputPath)

	// Capture FFmpeg's standard output and error for debugging
	var stdOut, stdErr strings.Builder
	cmd.Stdout = &stdOut
	cmd.Stderr = &stdErr

	// Log paths and FFmpeg command
	fmt.Printf("segments.txt path: %s\n", ffmpegSegmentsPath)
	fmt.Printf("Output video path: %s\n", ffmpegOutputPath)
	fmt.Printf("Running FFmpeg command: %s\n", strings.Join(cmd.Args, " "))

	// Run the FFmpeg command
	err = cmd.Run()
	if err != nil {
		fmt.Printf("FFmpeg stdout: %s\n", stdOut.String())
		fmt.Printf("FFmpeg stderr: %s\n", stdErr.String())
		return fmt.Errorf("failed to run FFmpeg: %v", err)
	}

	fmt.Printf("FFmpeg stdout: %s\n", stdOut.String())
	fmt.Printf("Video combined successfully: %s\n", outputFile)

	return nil
}

// Serve video files from a "videos" directory
func serveVideos(w http.ResponseWriter, r *http.Request) {
	// Extract the requested file name from the URL path after "/videos/"
	requestedPath := strings.TrimPrefix(r.URL.Path, "/videos/")
	requestedPath = filepath.ToSlash(requestedPath)     // Normalize path separators
	videoPath := filepath.Join("videos", requestedPath) // Build the full file path

	// Debug logs
	fmt.Printf("Requested video: %s\n", requestedPath)
	fmt.Printf("Resolved video path: %s\n", videoPath)

	// Check if the file exists
	if _, err := os.Stat(videoPath); os.IsNotExist(err) {
		fmt.Printf("Error: File not found at %s\n", videoPath)
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	fmt.Printf("File found: %s\n", videoPath)

	// Extract the file name to use as the default download name
	fileName := filepath.Base(videoPath)

	// Set headers for serving the file
	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", fileName))

	fmt.Printf("Serving video: %s with Content-Disposition: attachment; filename=%s\n", videoPath, fileName)

	// Serve the file directly
	http.ServeFile(w, r, videoPath)
}

func extractPostDetails(url string) (string, string, error) {
	re := regexp.MustCompile(`/profile/([^/]+)/post/([^/]+)`)
	matches := re.FindStringSubmatch(url)
	if len(matches) < 3 {
		return "", "", fmt.Errorf("invalid URL format")
	}
	Profile := matches[1]
	PostID := matches[2]
	FetchPostMetadata(Profile, PostID)
	return Profile, PostID, nil

}

// fetchPostMetadata fetches the metadata for the given profile and postID.
func FetchPostMetadata(profile, postID string) (*PostDetails, error) {
	apiURL := fmt.Sprintf("https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://%s/app.bsky.feed.post/%s&depth=0", profile, postID)
	fmt.Println("Fetching metadata from URL:", apiURL)

	// Make the API request
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch metadata: %v", err)
	}
	defer resp.Body.Close()

	// Check for non-200 status codes
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API returned status: %v, response: %s", resp.StatusCode, string(body))
	}

	// Parse the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}
	fmt.Println("Raw API response:", string(body))

	var response map[string]interface{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	// Extract post details
	postDetails := &PostDetails{
		Cid:         safeExtract(response, []string{"thread", "post", "embed", "cid"}).(string),
		Playlist:    safeExtract(response, []string{"thread", "post", "embed", "playlist"}).(string),
		Thumbnail:   safeExtract(response, []string{"thread", "post", "embed", "thumbnail"}).(string),
		LikeCount:   int(safeExtract(response, []string{"thread", "post", "likeCount"}).(float64)),
		ReplyCount:  int(safeExtract(response, []string{"thread", "post", "replyCount"}).(float64)),
		RepostCount: int(safeExtract(response, []string{"thread", "post", "repostCount"}).(float64)),
		AspectRatio: &AspectRatio{
			Height: int(safeExtract(response, []string{"thread", "post", "embed", "aspectRatio", "height"}).(float64)),
			Width:  int(safeExtract(response, []string{"thread", "post", "embed", "aspectRatio", "width"}).(float64)),
		},
	}

	return postDetails, nil
}

// Recursive function to extract nested values
func safeExtract(m map[string]interface{}, keys []string) interface{} {
	current := m
	for i, key := range keys {
		value, exists := current[key]
		if !exists {
			fmt.Printf("Key path not found: %v (missing key: %s)\n", keys[:i+1], key)
			return nil
		}
		if i == len(keys)-1 {
			return value
		}
		if nextMap, ok := value.(map[string]interface{}); ok {
			current = nextMap
		} else {
			fmt.Printf("Key path %v is not a map at %s\n", keys[:i+1], key)
			return nil
		}
	}
	return nil
}

func startCleanupTask() {
	go func() {
		for {
			time.Sleep(15 * time.Minute) // Cleanup interval

			files, err := os.ReadDir("videos")
			if err != nil {
				fmt.Println("Error reading videos directory:", err)
				continue
			}

			for _, file := range files {
				if file.IsDir() {
					dirPath := filepath.Join("videos", file.Name())
					info, err := os.Stat(dirPath)
					if err != nil {
						fmt.Println("Error getting file info:", err)
						continue
					}

					if time.Since(info.ModTime()) > 30*time.Minute {
						fmt.Println("Deleting expired folder:", dirPath)
						os.RemoveAll(dirPath)
					}
				}
			}
		}
	}()
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/process", process).Methods("POST")
	r.HandleFunc("/download", download).Methods("POST")
	r.PathPrefix("/videos/").HandlerFunc(serveVideos).Methods("GET")

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://5e00-2409-40d4-111d-9f89-b9e7-de7-4431-d014.ngrok-free.app"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	}).Handler(r)

	fmt.Println("Server is running on port 4000")

	// Start the cleanup task
	startCleanupTask()

	http.ListenAndServe(":4000", corsHandler)
}

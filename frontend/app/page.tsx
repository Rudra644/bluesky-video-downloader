"use client";

import { useState } from "react";

export default function Home() {
  const [metadata, setMetadata] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(
    null
  );
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4"); // Default format is MP4
  const [postURL, setPostURL] = useState<string>(""); // To store input URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async () => {
    if (!postURL) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);
    setSelectedResolution(null);

    try {
      const res = await fetch("http://localhost:4000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: postURL }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const data = await res.json();
      setMetadata(data);
      setSelectedResolution(data.resolutions[0]); // Default to the first resolution
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!metadata || !selectedResolution) {
      setError("Please select a resolution first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: metadata.profile,
          postID: metadata.postID,
          resolution: selectedResolution,
          format: selectedFormat, // Send the selected format
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process video");
      }

      const data = await res.json();

      // Trigger the download automatically
      const link = document.createElement("a");
      link.href = data.filename; // Ensure this points to the correct video URL
      link.download = `${metadata.postID}.${selectedFormat}`; // Set the default name based on format
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      setError(error.message || "An error occurred during processing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto", // Center align content
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Bluesky Video Downloader
      </h1>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          value={postURL}
          placeholder="Enter Bluesky post URL"
          onChange={(e) => setPostURL(e.target.value)}
          style={{
            flex: "2",
            padding: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />

        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={{
            flex: "1",
            padding: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <option value="mp4">MP4</option>
          <option value="ts">MPEG TS</option>
        </select>

        <button
          onClick={fetchMetadata}
          style={{
            padding: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Process
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {metadata && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <p>
            <strong>Thumbnail:</strong>
          </p>
          <img
            src={metadata.thumbnail}
            alt="Thumbnail"
            width="200"
            style={{ marginBottom: "1rem" }}
          />
          <p>
            <strong>Likes:</strong> {metadata.likeCount}
          </p>
          <p>
            <strong>Replies:</strong> {metadata.replyCount}
          </p>
          <p>
            <strong>Reposts:</strong> {metadata.repostCount}
          </p>
          <p>
            <strong>Resolutions:</strong>
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {metadata.resolutions.map((res: string) => (
              <button
                key={res}
                onClick={() => setSelectedResolution(res)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    selectedResolution === res ? "#0070f3" : "#ddd",
                  color: selectedResolution === res ? "white" : "black",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {res}
              </button>
            ))}
          </div>

          <button
            onClick={downloadVideo}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  );
}

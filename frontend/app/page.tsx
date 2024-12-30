"use client";

import { useState } from "react";

export default function Home() {
  const [metadata, setMetadata] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (url: string) => {
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
        body: JSON.stringify({ url }),
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
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to process video");
        }

        const data = await res.json();

        // Trigger the download automatically
        const link = document.createElement("a");
        link.href = data.filename; // Ensure this points to the correct video URL
        link.download = "video.mp4"; // Optional: Set a default name
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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Bluesky Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter Bluesky post URL"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const url = (e.target as HTMLInputElement).value;
            fetchMetadata(url);
          }
        }}
        style={{
          width: "100%",
          padding: "1rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {metadata && (
        <div style={{ marginTop: "1rem" }}>
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
          <div style={{ display: "flex", gap: "10px" }}>
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

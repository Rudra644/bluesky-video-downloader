"use client";

import { useState } from "react";
import { SyncLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageSquare, Repeat } from "lucide-react";
import { fetchMetadata, downloadVideo } from "@/api/bskyDownloader";
import Image from "next/image";
import { formatNumber } from "@/utils/formatNumber";

// Define types inline
/*************  ✨ Codeium Command 🌟  *************/
type Metadata = {
  profile: string;
  postID: string;
  title: string;
  thumbnail: string;
  resolutions: string[];
  likeCount: number;
  replyCount: number;
  repostCount: number;
};

export default function VideoDownloader() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4");
  const [postURL, setPostURL] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchMetadata = async () => {
    if (!postURL) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setMetadata(null);
    setSelectedResolution(null);

    try {
      const data: Metadata = await fetchMetadata(postURL);
      setMetadata(data);

      // Automatically select the highest resolution
      const highestResolution = data.resolutions.sort(
        (a: string, b: string) => parseInt(b) - parseInt(a)
      )[0];
      setSelectedResolution(highestResolution);
    } catch (error: any | string) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata || !selectedResolution) {
      setError("Please select a resolution first");
      return;
    }

    setDownloadLoading(true);
    setError(null);

    try {
      const response = await downloadVideo({
        profile: metadata.profile,
        postID: metadata.postID,
        resolution: selectedResolution,
        format: selectedFormat,
      });

      const { filename } = response; // Ensure backend returns correct filename
      const link = document.createElement("a");
      link.href = filename; // Use the exact filename provided by the backend
      link.download = filename.split("/").pop(); // Extract the desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      setError(error.message || "An error occurred during processing");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchMetadata();
  };

  return (
    <div className="max-w-screen-lg w-full mx-auto bg-card text-foreground rounded-lg shadow-lg p-2 sm:p-6">
      {/* Input Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:gap-4 items-center justify-center mb-8">
        <Input
          type="text"
          value={postURL}
          placeholder="Paste Bluesky Post Link: https://bsky.app/profile/linuxlock.bsky.social/post/3lerbmbhs447"
          onChange={(e) => setPostURL(e.target.value)}
          className="flex-2 h-12 text-foreground placeholder-muted-foreground border border-muted rounded-md"
        />
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="h-12 w-full sm:w-32 border border-muted rounded-md text-foreground hover:bg-muted">
              <SelectValue placeholder="Select Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="ts">MPEG TS</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            disabled={loading}
            className={`h-12 w-full sm:w-32 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center justify-center ${
              loading && "cursor-not-allowed opacity-70"
            }`}
          >
            {loading ? <SyncLoader color="#fff" size={8} /> : "Process"}
          </Button>
        </div>
      </form>

      {error && <p className="text-center text-destructive">{error}</p>}

      {/* Metadata Section */}
      {loading || metadata ? (
        <Card className="w-full mx-auto bg-card text-card-foreground shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton height={200} className="rounded-md" />
              ) : metadata && ( // Add null check here
                <Image
                  src={metadata.thumbnail}
                  alt="Thumbnail"
                  width={500}
                  height={300}
                  className="w-full h-auto md:max-h-[260px] rounded-md shadow"
                />
              )}
            </div>
           {/* Metadata and Actions */}
           <div className="w-full md:w-1/2 flex flex-col justify-between">
             {/* Title */}
             <div className="mb-8">
               {loading ? (
                 <Skeleton width="80%" height={30} />
               ) : (
                 <h2 className="text-2xl font-semibold text-foreground">{metadata?.title}</h2>
               )}
             </div>
           
             {/* Stats */}
             <div className="flex justify-between mb-4 text-muted-foreground">
               {["likeCount", "replyCount", "repostCount"].map((stat, index) => (
                 <div key={index} className="flex items-center gap-2">
                   {loading ? (
                     <Skeleton width={50} height={20} />
                   ) : (
                     <>
                       {stat === "likeCount" && <Heart className="text-red-500 hover:text-red-600" size={24} />}
                       {stat === "replyCount" && <MessageSquare className="text-gray-500 hover:text-gray-600" size={24} />}
                       {stat === "repostCount" && <Repeat className="text-blue-500 hover:text-blue-600" size={24} />}
                       <span className="text-lg">{metadata && formatNumber(metadata[stat as keyof Metadata] as number)}</span>
                     </>
                   )}
                 </div>
               ))}
             </div>
           
             {/* Resolution Selector */}
             <div className="mb-4">
               {loading ? (
                 <Skeleton height={40} />
               ) : (
                 <Select value={selectedResolution || ""} onValueChange={setSelectedResolution}>
                   <SelectTrigger className="w-full h-12 border border-muted text-foreground hover:bg-muted rounded-md">
                     <SelectValue placeholder="Select Resolution" />
                   </SelectTrigger>
                   <SelectContent>
                     {metadata?.resolutions.map((res: string) => (
                       <SelectItem key={res} value={res}>
                         {res}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               )}
             </div>

              {/* Download Button */}
              {loading ? (
                <Skeleton height={48} />
              ) : (
                <Button
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className={`w-full h-12 bg-green-500 text-green-50 hover:bg-green-600 rounded-md flex items-center justify-center ${
                    downloadLoading && "cursor-not-allowed opacity-70"
                  }`}
                >
                  {downloadLoading ? <SyncLoader color="#fff" size={6} /> : "Download"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

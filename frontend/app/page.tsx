"use client";

import VideoDownloader from "@/components/bsky/downloader/videoDownloader";
import HowItWorks from "@/components/bsky/downloader/howItWorks";
import Features from "@/components/bsky/downloader/features";
import Navbar from "@/components/global/navbar";

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto pt-48 px-4">
        <h1 className="text-5xl font-bold text-center mb-4">
          Bluesky Video Downloader
        </h1>
        <p className="text-md text-center text-muted- max-w-screen-md mx-auto text-foreground mb-8">
          Download Bsky videos in seconds with this free and easy-to-use tool.
          Simply paste the URL of the Bsky video you want to download and click
          the "Process" button.
        </p>
        <VideoDownloader />
      </div>
    <div className="container mx-auto mt-12 px-4">
      <Features />
      </div>
            {/* Full-width grey background for HowItWorks */}
            <div className="bg-gray-100">
        <div className="container mx-auto mt-12 pt-12 px-4">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}

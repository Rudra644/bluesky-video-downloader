"use client";

import Head from "next/head";
import VideoDownloader from "@/components/bsky/downloader/videoDownloader";
import HowItWorks from "@/components/bsky/downloader/howItWorks";
import Features from "@/components/bsky/downloader/features";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";

export default function Page() {
  return (
    <>
      <Head>
        <title>Bluesky Video Downloader - Fast & Free</title>
        <meta
          name="description"
          content="Fast and Free Bluesky Video Downloader that allows you to Download Bluesky Videos in HD at the highest speed instantly."
        />
        <meta
          name="keywords"
          content="Bluesky Video Downloader, Bsky Video Download, Bluesky Downloader, Download Bluesky Videos"
        />
        <meta property="og:title" content="Bluesky Video Downloader - Fast & Free" />
        <meta
          property="og:description"
          content="Download Bluesky videos instantly with our free tool. Paste the link, click process, and get your video in seconds."
        />
        <meta property="og:image" content="/images/bluesky-downloader.png" />
        <meta property="og:url" content="https://linuxlock.org/bluesky-downloader" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Bluesky Video Downloader",
              url: "https://linuxlock.org/bsky-downloader",
              description:
                "Fast and Free Bluesky Video Downloader that allows you to Download Bluesky Videos in HD at the highest speed instantly.",
            }),
          }}
        />
      </Head>
      <div className="overflow-x-hidden">
        <Navbar />
        <div className="container mx-auto pt-36 px-4">
          <h1 className="text-5xl font-bold text-center mb-4">
            Bluesky Video Downloader - Free & Fast
          </h1>
          <p className="text-md text-center text-muted- max-w-screen-md mx-auto text-foreground mb-8">
            Download Bsky videos in seconds with this free and easy-to-use tool.
            Simply paste the URL of the Bsky video you want to download and click
            the &quot;Process&quot; button.
          </p>
          <VideoDownloader />
        </div>
        <div className="container mx-auto p-4 mt-20 flex flex-col items-center justify-center">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-orange-500 mr-4"></i>
            <p className="text-gray-600 text-lg font-bold italic">**We do not support or encourage the downloading of copyrighted content.**</p>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            We are not affiliated or endorsed by Bsky Social. We do not host any videos or images on our servers. All rights belong to their respective owners.
          </p>
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
        <Footer />
      </div>
    </>
  );
}

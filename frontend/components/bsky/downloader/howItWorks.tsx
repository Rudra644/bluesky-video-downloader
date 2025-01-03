"use client";

export default function HowItWorks() {
  return (
    <section className="bg-gray-100 py-4">
      <div className="container mx-auto max-w-screen-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          Download Your Favorite Bluesky Videos for Free
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-10">
          Say goodbye to buffering and missed moments! With our easy-to-use
          Bluesky Video Downloader, you can save your favorite videos directly
          to your device and enjoy them offline anytime.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            How it Works:
          </h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-3">
            <li>
              <strong>Step 1:</strong> Copy the link to the Bluesky video you
              want to download.
            </li>
            <li>
              <strong>Step 2:</strong> Paste the link into our downloader tool.
            </li>
            <li>
              <strong>Step 3:</strong> Choose your preferred video quality
              (HD, SD, or more).
            </li>
            <li>
              <strong>Step 4:</strong> Click the &quot;Download&quot; button and let us
              handle the rest!
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 text-primary">
              Why Choose Our Tool?
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-3">
              <li>
                <strong>Unlimited Downloads:</strong> No restrictions. Download
                as many videos as you want.
              </li>
              <li>
                <strong>High-Quality Downloads:</strong> Save videos in full HD
                or the resolution of your choice.
              </li>
              <li>
                <strong>Completely Free:</strong> No hidden charges or
                subscriptions.
              </li>
              <li>
                <strong>Privacy Ensured:</strong> Your data stays private—we
                don’t track or store your activity.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 text-primary">
              Benefits of Downloading Bluesky Videos
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-3">
              <li>
                <strong>Offline Viewing:</strong> Watch videos anytime,
                anywhere, even without internet access.
              </li>
              <li>
                <strong>Create Collections:</strong> Save your favorite clips
                and build a library of Bluesky moments.
              </li>
              <li>
                <strong>No More Buffering:</strong> Download videos for smooth,
                uninterrupted playback.
              </li>
              <li>
                <strong>Multi-Device Access:</strong> Save videos to share and
                enjoy across all your devices.
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium">Is this tool free to use?</h4>
              <p className="text-muted-foreground">
                Yes, our downloader is completely free with no hidden charges.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium">
                What video formats are supported?
              </h4>
              <p className="text-muted-foreground">
                Currently, we support MP4 and MPEG TS formats.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium">
                Can I download videos in high quality?
              </h4>
              <p className="text-muted-foreground">
                Absolutely! You can choose HD or the best available quality for
                your downloads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

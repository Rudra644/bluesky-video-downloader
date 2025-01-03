import { CloudLightningIcon, FastForwardIcon, LockIcon, MusicIcon } from "lucide-react"

const features = [
  {
    name: 'Lightning Fast Downloads',
    description:
      'MDownload your Bsky videos in a flash. Our tool is optimized for speed, so you can spend less time waiting and more time enjoying.',
    icon: FastForwardIcon,
  },
  {
    name: 'Secure & Reliable',
    description:
      'Our website is developed with the latest security protocols to ensure a safe and secure downloading experience.',
    icon: LockIcon,
  },
  {
    name: 'High-Quality Downloads',
    description:
      'Our tool supports a wide range of video formats (MP4, MPEG-TS, etc.) and ensures high-quality, offering Full HD 1080p, 4K and 8K.',
    icon: CloudLightningIcon,
  },
  {
    name: 'Smooth & Seamless',
    description:
      'Download your BlueSky videos effortlessly. Our downloader is completely free and free of intrusive pop-up ads.',
    icon: MusicIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-primary">Download faster</h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
           Why Should You Use the Bsky Video Downloader on our website?
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
          It&apos;s easy and fast forward process to download bluesky social media videos. Just, enter the video URL, select the format, and click download.
          It&apos;s a simple tool to save online videos offline on your device.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

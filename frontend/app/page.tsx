"use client";

import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import Link from "next/link";

export default function Home() {
  return (
    
    <main className="bg-white dark:bg-gray-900">
      <Navbar ></Navbar>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary to-blue-500 text-white mt-12 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="sm:w-3/4 mx-auto text-4xl lg:text-6xl font-bold">
          Revolutionize & Speed Up Your Workflow with our Utilities
          </h1>
          <p className="sm:w-3/4 mx-auto mt-4 text-lg lg:text-xl">
            Linux Lock is a one stop in today&apos;s fast-paced world where efficiency is key.
            Our collection of online tools is designed to streamline your workflow and help you accomplish more in less time.
            Wether you&apos;re a student, a professional, or simply someone who wants to save time, Linux Lock has got you covered.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/bluesky-downloader"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-gray-100 transition"
            >
              Bluesky Video Downloader
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white">
            Why Choose Linux Lock?
          </h2>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
            Explore the tools and features that make your web experience
            seamless.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Video Downloader
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Save Bluesky videos instantly and in high quality.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Post Analytics
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gain insights into post performance and trends.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Bookmark Manager
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Organize and manage your favorite Bluesky posts effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    <Footer></Footer>
    </main>
  );
}

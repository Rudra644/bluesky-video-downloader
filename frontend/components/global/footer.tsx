"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 lg:px-20 overflow-x-hidden">
        {/* Flex container for mobile and desktop */} 
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-gray-600 dark:text-gray-400 md:justify-end">
            <Link
              href="/"
              className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
               Privacy Policy
            </Link>
            <Link
              href="/features"
              className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/pricing"
              className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Copyright
            </Link>
          </nav>

          {/* Copyright Text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left md:order-first">
            &copy; {new Date().getFullYear()} Linux Lock. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
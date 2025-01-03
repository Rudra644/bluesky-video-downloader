"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

// Features data for dropdown
// const features: { title: string; href: string; description: string }[] = [
//   {
//     title: "Video Download",
//     href: "/features/video-download",
//     description: "Download videos directly from Bluesky posts with ease.",
//   },
//   {
//     title: "Post Insights",
//     href: "/features/post-insights",
//     description: "Analyze and gather insights from Bluesky posts.",
//   },
//   {
//     title: "Bookmark Posts",
//     href: "/features/bookmark",
//     description: "Save and organize your favorite Bluesky posts.",
//   },
// ];

export default function Navbar() {
  // const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0">
      <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-12">
        {/* Logo Container */}
        <div className="flex-1">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Linux Lock"
              width={400} // Replace with actual width
              height={100} // Replace with actual height
              className="h-16 w-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Navigation Menu Container */}
        <div className="flex-1 hidden md:flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-8">
              {/* Features Dropdown */}
              {/* <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {features.map((feature) => (
                      <ListItem
                        key={feature.title}
                        href={feature.href}
                        title={feature.title}
                      >
                        {feature.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              {/* Pricing Link */}
              {/* <NavigationMenuItem>
                <a
                  href="/pricing"
                  className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Pricing
                </a>
              </NavigationMenuItem> */}

              {/* Documentation Link */}
              {/* <NavigationMenuItem>
                <a
                  href="/docs"
                  className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Documentation
                </a>
              </NavigationMenuItem> */}

              {/* Documentation Link */}
              <NavigationMenuItem>
                <a
                  href="/bluesky-downloader"
                  className="px-4 py-2 text-md font-medium text-gray-800 dark:text-white rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Bluesky Downloader
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Hamburger Menu */}
        {/* <button
          className="md:hidden text-gray-800 dark:text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button> */}

        {/* Mobile Navigation */}
        {/* {mobileMenuOpen && (
          <nav className="absolute left-0 top-16 w-full bg-white dark:bg-gray-900 shadow-md md:hidden">
            <ul className="flex flex-col space-y-2 px-4 py-4">
              <li>
                <a
                  href="/features"
                  className="block text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="block text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="block text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded-md"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </nav>
        )} */}
      </div>
    </header>
  );
}

// Reusable ListItem Component
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <a
        ref={ref}
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </li>
  );
});
ListItem.displayName = "ListItem";

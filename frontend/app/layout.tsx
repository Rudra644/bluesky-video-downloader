export const metadata = {
  title: "BlueSky Video Downloader",
  description: "Fetch metadata and download videos from BlueSky",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

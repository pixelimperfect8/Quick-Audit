import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick Audit",
  description: "Transaction document management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts — Proxima Nova (replace XXXXXXX with your project ID) */}
        <link rel="stylesheet" href="https://use.typekit.net/tzj8xwf.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Talking Buddha",
  description:
    "Ask a question and receive a calm reflection inspired by Buddhist teachings.",
  metadataBase: new URL("https://talkingbuddha.co.uk"),
  openGraph: {
    title: "The Talking Buddha",
    description:
      "Ask a question and receive a calm reflection inspired by Buddhist teachings.",
    url: "https://talkingbuddha.co.uk",
    siteName: "The Talking Buddha",
    images: [
      {
        url: "/buddha-bg.png",
        width: 1200,
        height: 630,
        alt: "The Talking Buddha",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Talking Buddha",
    description:
      "Ask a question and receive a calm reflection inspired by Buddhist teachings.",
    images: ["/buddha-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
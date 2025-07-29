
import "./css/globals.css";
import { Roboto_Flex } from "next/font/google";
import LayoutWrapper from "./components/layout/layoutwrapper";
import IdleLogoutWrapper from "./components/layout/IdleLogoutWrapper";

const roboto_flex = Roboto_Flex({
  subsets: ['latin'],
})

export const metadata = {
  metadataBase: new URL("https://www.nilam.io"),
  title: "Nilam Insights Private Limited - Protect Your Land & Prevent Encroachments",
  description: "Nilam Insights provides Physical Land Inspection, Periodic Land Assurance, Environmental Damage Prevention, and Encroachment Protection.",
  keywords: [
    "Physical Land Inspection",
    "Periodic Land Assurance",
    "Environmental Damage",
    "Document Mismanagement",
    "Lack of Oversight",
    "Encroachment",
    "Maintenance Neglect",
    "Misuse",
    "Legal Disputes",
    "Tax Non-Compliance",
    "Real Estate land Surveillance Service"
  ],
  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon-32x32.png",
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    title: "NILAM - Protect Your Land",
    description: "Prevent encroachments and secure your Land with periodic inspections and legal assurance.",
    url: "https://www.nilam.io",
    siteName: "NILAM.IO",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nilam Insights Private Limited - Protect Your Land",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilam Insights Private Limited - A company to help your land safety",
    description: "Prevent encroachments and secure your Land with periodic inspections and legal assurance.",
    creator: "@Nilam_IO",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto_flex.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <IdleLogoutWrapper />
        <LayoutWrapper>
          {children}</LayoutWrapper>
      </body>
    </html>
  );
}

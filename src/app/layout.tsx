import type { Metadata } from "next";
import { StoreHydrator } from "@/components/layout/store-hydrator";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Motch — Find the car that fits you",
    template: "%s · Motch",
  },
  description:
    "Tell Motch how you drive and discover the cars that make sense for your life.",
  applicationName: "Motch",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="flex min-h-full flex-col">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { Web3Provider } from "./Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShibaVille",
  description: "a fully on-chain strategy game built on BSC-Chain",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>{props.children}</Web3Provider>
      </body>
    </html>
  );
}

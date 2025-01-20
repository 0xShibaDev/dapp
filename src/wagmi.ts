import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [bsc],
    transports: {
      // RPC URL for each chain
      [bsc.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },

    // Required API Keys
    walletConnectProjectId: projectId,

    // Required App Info
    appName: "ShibaVille",

    // Optional App Info
    appDescription: "a fully on-chain strategy game built on BSC-Chain",
    appUrl: "https://shibaville.io", // your app's url
    appIcon: "https://shibaville.io/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

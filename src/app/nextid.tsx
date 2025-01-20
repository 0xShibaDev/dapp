"use client";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { wagmiContractConfig } from "./contracts";
import Image from "next/image";
import type { NextPage } from "next";

interface MyComponentProps {
  image: boolean;
}

const NextTokenId: NextPage<MyComponentProps> = ({ image }) => {
  const [tokenId, setTokenId] = useState<number | null>(null);

  // Watch for Transfer event and increment tokenId
  useWatchContractEvent({
    ...wagmiContractConfig,
    eventName: "Transfer",
    onLogs(logs) {
      console.log("Transfer event detected:", logs);
      setTokenId((prev) => (prev !== null ? prev + 1 : null));
    },
  });

  // Fetch the next token ID from the contract
  const { data, isLoading, isError } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getNextId",
    args: [],
  });

  // Update tokenId when `data` changes
  useEffect(() => {
    if (data) {
      const newTokenId = parseInt(data.toString());
      setTokenId(newTokenId);
    }
  }, [data]);

  const baseUrl = "https://api.shibaville.io/ville/image/";

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error reading contract data</p>;

  return (
    <div>
      {tokenId !== null && (
        <div className="tokenIdBox">
          <p>
            NEXT TOKEN ID #<strong className="boldtext">{tokenId}</strong>
          </p>
          {image && (
            <Image
              src={baseUrl + tokenId}
              width={400}
              height={400}
              alt="NextTokenId"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NextTokenId;

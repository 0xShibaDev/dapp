"use client";

import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useReadContract } from "wagmi";
import { wagmiContractConfig } from "./contracts";
import { BaseError } from "viem";
import ModalComponent from "./popup";
import NextTokenId from "./nextid";

function App() {
  const [amount, setAmount] = useState(1);

  // Memoize contract arguments to avoid unnecessary re-renders
  const contractArgs = useMemo(() => [BigInt(amount)] as const, [amount]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: price,
    error,
    isPending,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "calculatePrice",
    args: contractArgs,
  });

  // Calculate the current price from the returned contract data
  const currentPrice = price ? parseFloat(price.toString()) / 1e18 : null;

  const {
    data: hash,
    isPending: txPending,
    writeContract,
  } = useWriteContract();

  async function mintNft() {
    if (amount > 1) {
      writeContract({
        ...wagmiContractConfig,
        functionName: "mintBatch",
        args: [BigInt(amount)],
        value: BigInt(price || 1),
      });
    } else {
      writeContract({
        ...wagmiContractConfig,
        functionName: "mint",
        args: [],
        value: BigInt(price || 1),
      });
    }
    handleOpenModal();
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const DisplayMintButton = () => {
    const { isConnecting, isDisconnected } = useAccount();

    if (isConnecting) return <div>Connecting...</div>;
    if (isDisconnected) return <div>Disconnected...</div>;

    return (
      <div>
        <button className="mintbtn" onClick={mintNft} disabled={isPending}>
          MINT
        </button>
      </div>
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="backbone">
        <div className="main">
          <div className="header">
            <div className="logo">
              <Image
                className="logoImg"
                src="/logo.png"
                alt="Shibaville"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="welcome">
              <p>
                Hi there, My name is <strong>0xShiba</strong>, and I’m excited
                to introduce you to <strong>ShibaVille</strong>.
              </p>
              <p>
                a fully on-chain strategy game where your skills and strategy
                determine your success.
              </p>
              <p>
                This game is designed for players who want transparency,
                fairness, and complete control over their experience.
              </p>
            </div>
          </div>
          <div>
            <hr />
            <div className="header-bot">
              <div className="nextToken">
                <NextTokenId image={false} />
              </div>
              <div className="links">
                <Link
                  className="discordbtn"
                  href="https://api.shibaville.io/"
                  target="blank"
                >
                  METADATA
                </Link>
                <Link
                  className="discordbtn"
                  href="https://shibaville.gitbook.io/shibaville-docs"
                  target="blank"
                >
                  DOCS
                </Link>
                <Link
                  className="discordbtn"
                  href="https://github.com/0xShibaDev"
                  target="blank"
                >
                  GIT
                </Link>
              </div>
            </div>
            <hr />
          </div>
          <div className="spacer">
            <hr />
          </div>
          <div className="features">
            <h2>What Makes ShibaVille Unique?</h2>
            <div className="featurecard">
              <h3>Fair and Transparent NFT Minting</h3>
              <p>
                In ShibaVille, the traits of every <strong>VilleNFT</strong> are
                visible before minting. That means you know exactly what you’re
                paying for no hidden surprises, no rolling the dice.
              </p>
            </div>
            <div className="card">
              <h3>Gold Token Economy</h3>
              <ul>
                <li>
                  <strong>Gold Tokens</strong> are the core of the ShibaVille
                  economy. But here’s the twist: they’re earned, not sold or
                  given.
                </li>
                <li>
                  Only players with <strong>VilleNFTs</strong> and a{" "}
                  <strong>Gold Mine</strong> can mine Gold.
                </li>
                <li>
                  Only players with <strong>Top PVP rank</strong> claim reward
                  in Gold.
                </li>
                <li>
                  Not even the developers have a Gold allocation, we have to
                  earn it just like everyone else.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>The token economy is designed to keep things fair:</h3>
              <ul>
                <li>
                  <strong>1%</strong> of Gold will be used to provide initial
                  liquidity, matching up to <strong>50%</strong> of the seed
                  funds raised.
                </li>
                <li>
                  The other <strong>99%</strong> of Gold is mined in-game,
                  creating a player-driven economy where everyone has an equal
                  opportunity.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>Modular and Decentralized Game Design</h3>
              <ul>
                <li>
                  No developer has special access or control over your game.
                </li>
                <li>
                  When we add new features, they come as separate contracts,
                  leaving older versions untouched.
                </li>
                <li>
                  You can choose to interact with new features or stick to the
                  core game without any disruption.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>Freedom to Play Your Way</h3>
              <p>
                While I’m responsible for building the game client, you’re free
                to create your own scripts to interact with the game. Want to
                automate your strategy? Build your own tools and take your
                gameplay to the next level.
              </p>
            </div>
          </div>
          <hr />
          <div className="features">
            <h2>ShibaVille Core Gameplay</h2>
            <p>
              Let’s dive deeper into the heart of ShibaVille and see what makes
              it such an engaging and strategy-driven game. Imagine you’re
              building your dream town, defending it, and conquering others, all
              while balancing resources, strategy, and skill.
            </p>
            <div className="mechanics">
              <h3>Buildings: The Heart of Your Ville</h3>
              <p>
                Buildings are the backbone of your town. Each building has a
                specific purpose:
              </p>
              <ul>
                <li>
                  <strong>Resource Buildings</strong>: Generate resources like
                  wood, stone, or food. These are the lifeblood of your Ville,
                  fueling everything else.
                </li>
                <li>
                  <strong>Military Buildings</strong>: Train and house your army
                  units. These are your defenders and conquerors, crucial for
                  both offense and defense.
                </li>
                <li>
                  <strong>Civic Buildings</strong>: These buildings ensure your
                  Ville thrives and prospers by boosting various aspects like
                  happiness, knowledge and security
                </li>
              </ul>
            </div>
            <div className="mechanics">
              <h3>Resources: The Building Blocks</h3>
              <p>
                Your town’s economy runs on resources. You’ll need to gather and
                manage them wisely. Whether you’re building up your
                infrastructure or preparing for battle, every resource counts.
                And remember, conquering other towns lets you claim a percentage
                of their unprotected resources, more on that in a bit!
              </p>
            </div>
            <div className="mechanics">
              <h3>The Stash: Your Treasure Trove</h3>
              <p>
                All the resources you generate go into your resource stash. But
                be warned! <strong>only what you claim is truly safe.</strong>{" "}
                Unclaimed resources are up for grabs if someone conquers your
                town. Claim often, and keep your stash protected!
              </p>
            </div>
            <div className="mechanics">
              <h3>Army Units: Defenders and Invaders</h3>
              <p>
                Your military isn’t just for show—it’s your primary tool for
                defense and offense. Use your units to:
              </p>
              <ul>
                <li>
                  <strong>Defend Your Ville</strong>: Keep invaders at bay and
                  protect your resources.
                </li>
                <li>
                  <strong>Conquer Other Villes</strong>: Launch strategic
                  attacks to claim a percentage of their unclaimed resources and
                  Gold.
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="plan">
            <h2>Project Timeline</h2>
            <div className="stage">
              <h3>Current Stage: Seed</h3>
              <p>We’re raising funds through VilleNFT minting to:</p>
              <ul>
                <li>1. Core contracts development.</li>
                <li>2. Initiate liquidity for the Gold Token.</li>
                <li>3. Add new members to the team.</li>
              </ul>
            </div>
            <div className="stage">
              <h3>Next Stage: Launch Gold Market and Deploy Game Contracts</h3>
              <p>Once the core contracts is ready, we’ll:</p>
              <ul>
                <li>1. Deploy the Gold market.</li>
                <li>2. Audit/tests the game core contracts.</li>
                <li>
                  3. Deploy the game contracts, allowing you to start playing
                  and trading Gold.
                </li>
              </ul>
            </div>
            <div className="stage">
              <h3>After That: Game Client and Script Libraries</h3>
              <p>
                We’ll roll out the official game client and libraries for
                players to create custom scripts, automate gameplay, and enhance
                their experience.
              </p>
            </div>
          </div>
          <hr />
          <div className="minting" id="minting">
            <h2>Ready to Mint?</h2>

            <Link
              href="https://bscscan.com/address/0x413950db739e8b3845b3bbab0c2d74a0b92bd5a0"
              target="blank"
            >
              Contract(ERC721): 0x413950db739e8b3845b3bbab0c2d74a0b92bd5a0
            </Link>

            <div className="mint">
              <div className="text">
                <div className="info">
                  <p>Metadata: Revealed</p>
                  <p>
                    Increment for each NFT mint:<strong>0.0001 BNB</strong>
                  </p>
                  <p>
                    Limit per transaction: <strong>50 NFT</strong>
                  </p>
                </div>
              </div>
              <div className="mintbox">
                <NextTokenId image={true} />
                <div className="amount">
                  <button
                    className="addbtn"
                    onClick={() => setAmount(Math.max(amount - 1, 1) || 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Math.min(50, parseInt(e.target.value)) || 1)
                    }
                    max={50}
                  />
                  <button
                    className="addbtn"
                    onClick={() => setAmount(Math.min(50, amount + 1) || 1)}
                  >
                    +
                  </button>
                </div>
                <div className="price">
                  <p>{currentPrice} BNB</p>
                </div>
                <div className="mintsection">
                  <ConnectKitButton theme={"retro"} />
                  <DisplayMintButton />
                </div>
                <ModalComponent isOpen={isModalOpen} onClose={handleCloseModal}>
                  <h2>Transaction state</h2>
                  {txPending ? (
                    <div>
                      <p>Waiting for payment..</p>
                      <p>Function: {amount > 1 ? "mintBatch()" : "mint()"}</p>
                      <div>
                        <p>Villes: {amount}</p>
                        <p>Total BNB: {currentPrice}</p>
                      </div>
                    </div>
                  ) : (
                    <div>Canceled!</div>
                  )}
                  {hash && <div>Transaction Hash: {hash}</div>}
                  {isConfirming && <div>Waiting for confirmation...</div>}
                  {isConfirmed && (
                    <div>
                      <p>Transaction confirmed.</p>
                      <p>Thank you!</p>
                    </div>
                  )}
                  {error && (
                    <div>
                      Error:{" "}
                      {(error as BaseError).shortMessage || error.message}
                    </div>
                  )}
                  <button onClick={handleCloseModal}>Close</button>
                </ModalComponent>
              </div>
            </div>
          </div>
          <hr />
          <div className="last">
            <h2>Join the ShibaVille Community</h2>
            <p>
              ShibaVille is more than a game, it’s a collaborative journey.
              Whether you’re here to strategize, compete, or build, there’s a
              place for you in our world.
            </p>
          </div>
          <div className="socials">
            <Link
              className="discordbtn"
              href="https://discord.gg/BwWB9HkFPy"
              target="blank"
            >
              Discord server
            </Link>
          </div>
        </div>
        <div className="footer">
          <Link href="https://x.com/ShibaVille_io" target="blank">
            <strong>X</strong>
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;

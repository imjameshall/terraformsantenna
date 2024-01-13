import { TransactionExecutionError } from "viem";
import { createPublicClient, http, parseAbi, Hash } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useState, useEffect, useCallback } from "react";

import { mainnet } from "viem/chains";
const abiTFAntenna = parseAbi([
  "constructor()",
  "function turnAntennaOn(uint256 tokenId)",
  "function turnAntennaOff(uint256 tokenId)",
]);
const abiTF = parseAbi([
  "constructor()",
  "function enterDream(uint256 tokenId)",
  "function setTokenURIAddress(uint[] memory tokens, uint index)",
]);

const ALCHEMY = process.env.NEXT_PUBLIC_ALCHEMY_URI;

const Tuner = () => {
  const CONTRACT_ADDRESS_TF = "0x4e1f41613c9084fdb9e34e11fae9412427480e56";
  const CONTRACT_ADDRESS_TF_ANTENNA =
    "0x331512A28A4cF80221aF949B5d43041fF0FC7f01";
  const [supplyData, setSupplyData] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [upgradeParcels, setUpgradeParcels] = useState("");

  const [upgradeHash, setUpgradeHash] = useState<Hash>();
  const [antennaOnHash, setAntennaOnHash] = useState<Hash>();
  const [antennaOffHash, setAntennaOffHash] = useState<Hash>();
  const [dayDreamHash, setDayDreamHash] = useState<Hash>();

  const [upgradeParcelText, setUpgradeParcelText] = useState("");
  const [enteringDayDreamText, setEnteringDayDreamText] = useState("");
  const [turnAntennaOnText, setTurnAntennaOnText] = useState("");
  const [turnAntennaOffText, setTurnAntennaOffText] = useState("");

  const [walletAddress, setWallet] = useState("");

  const [allowListed, setAllowListed] = useState(false);

  const { address } = useAccount();
  const { chain, chains } = useNetwork();

  const { data: walletClient, isError, isLoading } = useWalletClient();

  const client = createPublicClient({
    chain,
    transport: http(ALCHEMY),
  });

  useEffect(() => {
    (async () => {
      if (upgradeHash) {
        const receipt = await client.waitForTransactionReceipt({
          hash: upgradeHash,
        });
        setUpgradeParcelText(
          `Complete: Check the transaction details <a href='https://etherscan.io/tx/${receipt.transactionHash}'>here</a>.`
        );
      }
    })();
  }, [client, upgradeHash]);

  useEffect(() => {
    (async () => {
      if (antennaOnHash) {
        const receipt = await client.waitForTransactionReceipt({
          hash: antennaOnHash,
        });
        setTurnAntennaOnText(
          `Complete: Check the transaction details <a href='https://etherscan.io/tx/${receipt.transactionHash}'>here</a>.`
        );
      }
    })();
  }, [client, antennaOnHash]);

  useEffect(() => {
    (async () => {
      if (antennaOffHash) {
        const receipt = await client.waitForTransactionReceipt({
          hash: antennaOffHash,
        });
        setTurnAntennaOffText(
          `Complete: Check the transaction details <a href='https://etherscan.io/tx/${receipt.transactionHash}'>here</a>.`
        );
      }
    })();
  }, [client, antennaOffHash]);

  useEffect(() => {
    (async () => {
      if (dayDreamHash) {
        const receipt = await client.waitForTransactionReceipt({
          hash: dayDreamHash,
        });
        setEnteringDayDreamText(
          `Complete: Check the transaction details <a href='https://etherscan.io/tx/${receipt.transactionHash}'>here</a>.`
        );
      }
    })();
  }, [client, dayDreamHash]);

  const enterDaydream = useCallback(
    async function () {
      if (walletClient) {
        try {
          const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS_TF,
            abi: abiTF,
            functionName: "enterDream",
            args: [BigInt(mintAmount)],
          });
          setDayDreamHash(hash);
          setEnteringDayDreamText("Waiting for TXN to complete...");
        } catch (e) {
          console.log(e);
          setEnteringDayDreamText("ERROR: Please check console");
        }
      }
    },
    [walletClient, mintAmount]
  );

  const turnAntennaOff = useCallback(
    async function () {
      if (walletClient) {
        try {
          const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS_TF_ANTENNA,
            abi: abiTFAntenna,
            functionName: "turnAntennaOff",
            args: [BigInt(mintAmount)],
          });
          setAntennaOffHash(hash);
          setTurnAntennaOffText("Waiting for TXN to complete...");
        } catch (e) {
          console.log(e);
          setTurnAntennaOffText("ERROR: Please check console");
        }
      }
    },
    [walletClient, mintAmount]
  );

  const turnAntennaOn = useCallback(
    async function () {
      if (walletClient) {
        try {
          const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS_TF_ANTENNA,
            abi: abiTFAntenna,
            functionName: "turnAntennaOn",
            args: [BigInt(mintAmount)],
          });
          setAntennaOnHash(hash);
          setTurnAntennaOnText("Waiting for TXN to complete...");
        } catch (e) {
          console.log(e);
          setTurnAntennaOnText("ERROR: Please check console");
        }
      }
    },
    [walletClient, mintAmount]
  );

  const upgradeParcelsToV2 = useCallback(
    async function () {
      if (walletClient) {
        try {
          const ids = upgradeParcels.split(",").map((x) => {
            return BigInt(x);
          });
          const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS_TF,
            abi: abiTF,
            functionName: "setTokenURIAddress",
            args: [ids, BigInt(2)],
          });
          setUpgradeHash(hash);
          setUpgradeParcelText("Waiting for TXN to complete...");
        } catch (e) {
          console.log(e);
          setUpgradeParcelText("ERROR: Please check console");
        }
      }
    },
    [walletClient, upgradeParcels]
  );

  useEffect(() => {
    if (address) {
      setWallet(address);
    }
  }, [address, setWallet, setAllowListed]);

  return (
    <div>
      <main className="relative md:max-w-3xl md:ml-4 mr-auto">
        <div className="flex flex-col min-h-screen lg:flex-row lg:items-center lg:p-8">
          <div className="flex flex-col flex-grow bg-white">
            <section className="flex-grow flex flex-col justify-center p-12 pt-5">
              <div className="">
                <h1 className="text-center sm:font-light text-2xl sm:text-3xl md:text-4xl text-primary-md mt-6">
                  TERRAFORMS ANTENNA INFO
                </h1>
                <p className="text-center sm:text-md text-beta-md mt-3 leading-relaxed">
                      This is a page meant to help people navigate how to get antenna mode onto their Terraform parcel. For more information about Terraforms and mathcastles, please join the <a href='https://discord.com/invite/mathcastles' target='_blank'>discord</a> or follow them on <a href='https://twitter.com/mathcastles' target='_blank'>Twitter</a>.
                    </p>

                    <p className="text-center text-beta-md my-3 leading-relaxed">Want to help on the site? The code can be found here: <a href='https://github.com/imjameshall/terraformsantenna' target="_blank">https://github.com/imjameshall/terraformsantenna</a></p>
                {true && (
                  <div className="">
                    <div className="Tuner my-10">
                      <div>
                        <div
                          style={{
                            maxWidth: walletAddress.length > 0 ? 320 : 175,
                            margin: "auto",
                          }}
                        >
                          <ConnectButton />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h1>Step 0</h1>
                  <p className="text-center sm:text-xl text-beta-md mt-3 leading-relaxed">
                    The first step is to move your parcel into V2.
                    <br />
                    <br /> What is V2? It allows you to see all the new work
                    that will be coming in the future on the art piece.
                    <br />
                    <br />
                  </p>
                  <ul>
                    <li>
                      <b>V0</b>: Originally launched Terraform version.
                    </li>
                    <li>
                      <b>V1</b>: Terraforms version that will run off the EVM on
                      its own in 50 years.
                    </li>
                    <li>
                      <b>V2</b>: Where the party is.
                    </li>
                  </ul>

                  <div className="my-2 m-auto text-center">
                    <p className="text-center sm:text-xl text-beta-md mt-3 leading-relaxed">
                      Enter your parcel IDs to upgrade to V2, comma separated:
                    </p>
                    <div className="my-6">
                      <input
                        readOnly={walletAddress.length == 0}
                        className="lock w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="text"
                        value={upgradeParcels}
                        placeholder={
                          walletAddress.length > 0
                            ? "Enter your Parcel IDs"
                            : "Connect your wallet"
                        }
                        onChange={(e) =>
                          setUpgradeParcels(
                            (e.target as HTMLInputElement).value
                          )
                        }
                      />
                    </div>
                  </div>
                  <p className="text-center text-beta-md mt-3 leading-relaxed">
                    We will be calling this function on the Terraforms contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x4e1f41613c9084fdb9e34e11fae9412427480e56#writeContract#F16"
                      target="_blank"
                    >
                      https://etherscan.io/address/0x4e1f41613c9084fdb9e34e11fae9412427480e56#writeContract#F16
                    </a>{" "}
                  </p>
                  <br />
                  <button
                    id="upgradeButton"
                    disabled={walletAddress.length == 0}
                    onClick={upgradeParcelsToV2}
                    className=" m-auto flex items-center shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                  >
                    Upgrade Parcels {upgradeParcels}
                  </button>
                  <br />

                  <div className="text-center">{upgradeParcelText}</div>
                </div>

                <div>
                  <h1>Step 1</h1>
                  <p className="text-center sm:text-xl text-beta-md mt-3 leading-relaxed">
                    So first we need to enter into daydream mode.
                    <br />
                    <br /> <b>KEEP IN MIND THIS IS IRRESVERSIBLE!</b>
                    <br />
                    <br />
                    Put in your parcel below, and then press the Enter Daydream
                    mode.
                  </p>
                  <div className="my-6">
                    <input
                      className="lock w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="text"
                      value={mintAmount}
                      placeholder={
                        walletAddress.length > 0
                          ? "Enter your Parcel ID"
                          : "Connect your wallet"
                      }
                      onChange={(e) =>
                        setMintAmount((e.target as HTMLInputElement).value)
                      }
                    />
                  </div>
                  <button
                    id="mintButton"
                    disabled={walletAddress.length == 0}
                    onClick={enterDaydream}
                    className=" m-auto flex items-center shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                  >
                    Enter Daydream for parcel {mintAmount}
                  </button>
                  <p className="text-center text-beta-md mt-3 leading-relaxed">
                    We will be calling this function on the Terraforms contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x4e1f41613c9084fdb9e34e11fae9412427480e56#writeContract#F6"
                      target="_blank"
                    >
                      https://etherscan.io/address/0x4e1f41613c9084fdb9e34e11fae9412427480e56#writeContract#F6
                    </a>{" "}
                  </p>
                  <br />
                  <div className="text-center">{enteringDayDreamText}</div>
                </div>

                <div className="my-5">
                  <h1>Step 2</h1>
                  <p className="text-center sm:text-xl text-beta-md mt-3 leading-relaxed pb-4">
                    Then we need to turn the antenna ON, press below.
                  </p>

                  <button
                    id="mintButton"
                    disabled={walletAddress.length == 0}
                    onClick={turnAntennaOn}
                    className=" m-auto flex items-center shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                  >
                    Turn Antenna On for parcel {mintAmount}
                  </button>
                  <p className="text-center text-beta-md mt-3 leading-relaxed">
                    We will be calling this function on the Terraforms Antenna
                    proxy contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x331512a28a4cf80221af949b5d43041ff0fc7f01#writeProxyContract#F20"
                      target="_blank"
                    >
                      https://etherscan.io/address/0x331512a28a4cf80221af949b5d43041ff0fc7f01#writeProxyContract#F20
                    </a>{" "}
                  </p>
                  <br />

                  <div className="text-center">{turnAntennaOnText}</div>
                </div>

                <div className="my-5">
                  <h1>Turn Off</h1>
                  <p className="text-center sm:text-xl text-beta-md mt-3 leading-relaxed pb-4">
                    If you want to turn your antenna off, press this here.
                  </p>

                  <button
                    id="mintButton"
                    disabled={walletAddress.length == 0}
                    onClick={turnAntennaOff}
                    className=" m-auto flex items-center shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                  >
                    Turn Antenna Off for parcel {mintAmount}
                  </button>
                  <p className="text-center text-beta-md mt-3 leading-relaxed">
                    We will be calling this function on the Terraforms Antenna
                    proxy contract:{" "}
                    <a
                      href="https://etherscan.io/address/0x331512a28a4cf80221af949b5d43041ff0fc7f01#writeProxyContract#F19"
                      target="_blank"
                    >
                      https://etherscan.io/address/0x331512a28a4cf80221af949b5d43041ff0fc7f01#writeProxyContract#F19
                    </a>{" "}
                  </p>
                  <br />
                  <div className="text-center">{turnAntennaOffText}</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tuner;

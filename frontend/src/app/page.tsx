"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Landing } from "../components/landing";
import etherRPC from "./ethersRPC";
import { web3auth } from "../lib/web3auth";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        const provider = web3auth.provider;

        if (!provider) {
          return;
        }
        const addresses = await etherRPC.getAccounts(provider);
        if (addresses.length > 0) {
          setAddress(addresses[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  return (
    <Landing />
  );
};

export default Home;
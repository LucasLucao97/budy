"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image'

import { IProvider } from "@web3auth/base";
import ethersRPC from "../app/ethersRPC";
import { web3auth } from "../lib/web3auth";
import styles from '../public/DefaultHeader.module.css';

function DefaultHeader() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    console.log(web3authProvider)
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const pathname = usePathname();
  if (pathname === "/debug") return null;

  const loggedInView = (
    <div className={styles.buttonContainer}>
      <button onClick={logout} className={styles.button}>
        Log Out
      </button>
    </div>
  );

  const unloggedInView = (
    <div className={styles.buttonContainer}>
      <button onClick={login} className={styles.button}>
        Login
      </button>
    </div>
  );

  return (
    <>
      <div
        className={styles.header}>
        <Link href="/">
          <div
            className={styles.logoContainer}
          >
            <Image src="/images/budy.png" width={50} height={50} alt="Budy Logo" />
            <h1 className={styles.title}>Budy</h1>
          </div>
        </Link>
        <div>{loggedIn ? loggedInView : unloggedInView}</div>
      </div>
    </>
  );
}

export default DefaultHeader;

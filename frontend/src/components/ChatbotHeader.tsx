'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { IProvider } from '@web3auth/base';
import { web3auth } from '../lib/web3auth';
import styles from '../public/Header.module.css';
import { useWeb3Auth } from '@/context/Web3AuthContext'; // Importa el contexto
import ethersRPC from '@/app/ethersRPC';

function ChatbotHeader() {
  const { provider, loggedIn, login, logout } = useWeb3Auth(); // Usa el contexto

  const pathname = usePathname();
  if (pathname === '/debug') return null;

  const getBalanceUser = async () => {
    if (!provider) {
      console.error('Provider no disponible');
      return;
    }
    const balance = await ethersRPC.getBalance(provider);
    console.log(balance);
    return balance;
  };

  const loggedInView = (
    <div className={styles.buttonContainer}>
      <button onClick={logout} className={styles.button}>
        Log Out
      </button>
      <button onClick={getBalanceUser}></button>
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
      <div className={styles.header}>
        <Link href="/chatbot">
          <div className={styles.logoContainer}>
            <Image src="/images/budy.png" width={50} height={50} alt="Budy Logo" />
            <h1 className={styles.title}>Budy</h1>
          </div>
        </Link>
        <div>{loggedIn ? loggedInView : unloggedInView}</div>
      </div>
    </>
  );
}

export default ChatbotHeader;

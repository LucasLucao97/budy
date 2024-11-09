'use client';
import type { NextPage } from 'next';
import styles from './Profile.module.css';
import { useWeb3Auth } from '@/context/Web3AuthContext';
import ethersRPC from '../ethersRPC';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { useState } from 'react';

const Profile: NextPage = () => {
  const { provider } = useWeb3Auth();
  const [privateKeyBudy, setProviderBudyNew] = useState();

  const getAddressBudy = async () => {
    if (!provider) {
      console.error('Provider no disponible');
      return;
    }

    const address = await ethersRPC.getAccounts(provider);
    const web3Budy = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
    const sha3 = web3Budy.utils.sha3(address) ?? '';
    const account = web3Budy.eth.accounts.privateKeyToAccount(sha3);
    const addressUser = account.address;
    const privateKey = account.privateKey;

    //const contract = new web3Budy.eth.Contract(ABI, contractAddress);

    const providerBudy = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, providerBudy);
    const addressBudy = wallet.address;
    return addressBudy;
  };

  const transferBudy = async () => {
    const addressBudy = await getAddressBudy();
    const amounty = '0.2';
    try {
      const response = await fetch('http://localhost:3001/api/transferBudy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amounty, to: addressBudy }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log('Transacción procesada exitosamente:', data);
    } catch (error) {
      console.error('Error al procesar la transferencia:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.leftTop}>Guarda tu Información en Budy</div>
        <div className={styles.centerTop}>
          <img src="images/proicons_pdf-2.svg" alt="pdf-download" />
        </div>
        <div className={styles.rightTop}>Compártela con tus médicos</div>
      </div>
      <div className={styles.medium}>
        <button onClick={transferBudy}>Recarga BudyTokens</button>
      </div>
      <div className={styles.bottom}>
        <div className={styles.leftBottom}>
          <img src="images/perro.jpg" alt="perro" className={styles.perro} />
          <div>
            <div className={styles.fecha}>18/10/24</div>
            <img src="images/gridicons_share.svg" alt="share" className={styles.share} />
          </div>
        </div>
        <div className={styles.centerBottom}>
          <img src="images/perro.jpg" alt="perro" className={styles.perro} />
          <div>
            <div className={styles.fecha}>18/10/24</div>
            <img src="images/gridicons_share.svg" alt="share" className={styles.share} />
          </div>
        </div>
        <div className={styles.rightBottom}>
          <img src="images/perro.jpg" alt="perro" className={styles.perro} />
          <div>
            <div className={styles.fecha}>18/10/24</div>
            <img src="images/gridicons_share.svg" alt="share" className={styles.share} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

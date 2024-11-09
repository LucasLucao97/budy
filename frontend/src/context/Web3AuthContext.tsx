'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { IProvider } from '@web3auth/base';
import { web3auth } from '@/lib/web3auth';
import web3, { Web3 } from 'web3';
import ethersRPC from '@/app/ethersRPC';

interface Web3AuthContextProps {
  provider: IProvider | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
}

const Web3AuthContext = createContext<Web3AuthContextProps | undefined>(undefined);

export const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addressUser, setAddressUser] = useState('');
  const [privateKey, setPrivateKey] = useState('');

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

  const getAddressBudy = async () => {
    if (!provider) {
      console.error('Provider no disponible');
      return;
    }
    const address = await ethersRPC.getAccounts(provider);
    return address;
  };
  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    const web3Budy = new Web3(
      'https://node.l1marketplace.com/ext/bc/7gmrCuAKCEX8DUhZEyNURzLi1SAx8JYW4jpzN7wsGSiGZa5Qb/rpc',
    );
    const addressBUDY = getAddressBudy();
    const sha3 = web3Budy.utils.sha3(await addressBUDY) ?? '';
    const account = web3Budy.eth.accounts.privateKeyToAccount(sha3);
    setAddressUser(account.address);
    setPrivateKey(account.privateKey);
    setLoggedIn(true);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  return (
    <Web3AuthContext.Provider value={{ provider, login, logout, loggedIn }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth debe ser utilizado dentro de un Web3AuthProvider');
  }
  return context;
};

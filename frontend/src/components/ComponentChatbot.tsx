"use client";

import React, { useState } from 'react';
import { Send, Paperclip, Lock, FileText } from 'lucide-react';
import axios from 'axios';
import { useWeb3Auth } from '@/context/Web3AuthContext';
import ethersRPC from '@/app/ethersRPC';
import {ethers} from 'ethers';
import { encryptMessages } from '@/utils/encryption';
import "../public/Chatbot.css";
import Web3 from 'web3';
const contractAddress = '0xCDA3D0dE0bbC89dD0Aa6A913FE4d95e9Fc34218E'
const ABI = [ { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ERC721EnumerableForbiddenBatchMint", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" } ], "name": "ERC721IncorrectOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ERC721InsufficientApproval", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC721InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" } ], "name": "ERC721InvalidOperator", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "ERC721InvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC721InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC721InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ERC721NonexistentToken", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "ERC721OutOfBoundsIndex", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256" } ], "name": "BatchMetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256" } ], "name": "MetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "uri", "type": "string" } ], "name": "safeMint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "_nextTokenId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_addr", "type": "address" } ], "name": "getAllMyTokens", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "price", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "tokenByIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "tokenOfOwnerByIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export default function ComponentChatbot() {
  const { provider } = useWeb3Auth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const expressApi = process.env.NEXT_PUBLIC_API;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messageToSend = pdfFile ? 'PDF subido, enviando para procesar...' : input;

    if (messageToSend.trim()) {
      const userMessage: Message = { text: messageToSend, sender: 'user' };
      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setInput('');
      setPdfFile(null);

      try {
        let response;

        if (pdfFile) {
          const formData = new FormData();
          formData.append('file', pdfFile);
          
          console.log(expressApi)
          response = await axios.post(`http://${expressApi}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const botMessage: Message = { text: `Resumen del PDF:\n\n${response.data.summary}`, sender: 'bot' };
          setMessages([...newMessages, botMessage]);
        } else {
          response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
              contents: [
                {
                  parts: [
                    {
                      text: input,
                    },
                  ],
                },
              ],
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data.candidates && response.data.candidates.length > 0) {
            const botResponse = response.data.candidates[0].content.parts[0].text;
            const botMessage: Message = { text: botResponse, sender: 'bot' };
            setMessages([...newMessages, botMessage]);
          } else {
            const errorMessage: Message = { text: 'No se recibió respuesta válida del bot.', sender: 'bot' };
            setMessages([...newMessages, errorMessage]);
          }
        }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    }
  };

  const handleEncryptMessages = async () => {
    if (!provider) {
      console.error("Provider no disponible");
      return;
    }

    try {
      const address = await ethersRPC.getAccounts(provider);
      const web3Budy = new Web3('https://node.l1marketplace.com/ext/bc/7gmrCuAKCEX8DUhZEyNURzLi1SAx8JYW4jpzN7wsGSiGZa5Qb/rpc');
      const sha3 = web3Budy.utils.sha3(address) ?? '';
      const account = web3Budy.eth.accounts.privateKeyToAccount(sha3)
      const addressUser = account.address;
      const privateKey = account.privateKey;

      console.log(account)

      const encryptedMessages = encryptMessages(
        messages.map(msg => msg.text),
        address[0]
      );

      const formData = new FormData();
      formData.append("encryptedMessages", encryptedMessages);

      setUploading(true);
      const uploadRequest = await axios.post("/api/files", formData);
      const response = uploadRequest.data;

      console.log("Mensajes encriptados subidos con éxito:", response);

      const urlResponse = response.url;

      const providerBudy = new ethers.JsonRpcProvider('https://node.l1marketplace.com/ext/bc/7gmrCuAKCEX8DUhZEyNURzLi1SAx8JYW4jpzN7wsGSiGZa5Qb/rpc')
      const wallet = new ethers.Wallet(privateKey, providerBudy)
      const getBalance = await providerBudy.getBalance(wallet.address)
      console.log(getBalance)
      const contract = new ethers.Contract(contractAddress, ABI, wallet);

      const tx = await contract.safeMint(urlResponse, {value: ethers.parseEther('3.0')});

      const receipt = await tx.wait();
      console.log(receipt);
      setUploading(false);

    } catch (error) {
      console.error("Error al encriptar y subir los mensajes:", error);
      setUploading(false);
    }
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPdfFile(file);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div className='message bot block'></div>
      </div>
      {pdfFile && (
        <div className="pdf-file-info">
          <FileText size={16} /> {pdfFile.name}
        </div>
      )}

      <button onClick={handleEncryptMessages} className="encrypt-button" disabled={uploading}>
        {uploading ? "Subiendo..." : <><Lock size={16} /> Encriptar Mensajes</>}
      </button>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="chat-input"
        />
        <label htmlFor="file-upload" className="file-upload-label">
          <Paperclip />
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        <button type="submit" className="send-button">
          <Send />
        </button>
      </form>
    </div>
  );
}

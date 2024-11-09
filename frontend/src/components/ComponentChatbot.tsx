'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Lock, FileText } from 'lucide-react';
import axios from 'axios';
import { useWeb3Auth } from '@/context/Web3AuthContext';
import ethersRPC from '@/app/ethersRPC';
import { ethers } from 'ethers';
import { encryptMessages } from '@/utils/encryption';
import '../public/Chatbot.css';
import Web3 from 'web3';
import { ABI, BUDY_CONTRACT } from '@/constants';

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

          console.log(expressApi);
          response = await axios.post(`http://${expressApi}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const botMessage: Message = {
            text: `Resumen del PDF:\n\n${response.data.summary}`,
            sender: 'bot',
          };
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
            },
          );

          if (response.data.candidates && response.data.candidates.length > 0) {
            const botResponse = response.data.candidates[0].content.parts[0].text;
            const botMessage: Message = { text: botResponse, sender: 'bot' };
            setMessages([...newMessages, botMessage]);
          } else {
            const errorMessage: Message = {
              text: 'No se recibió respuesta válida del bot.',
              sender: 'bot',
            };
            setMessages([...newMessages, errorMessage]);
          }
        }
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      }
    }
  };

  const handleEncryptMessages = async () => {
    if (!provider) {
      console.error('Provider no disponible');
      return;
    }

    try {
      const address = await ethersRPC.getAccounts(provider);
      const web3Budy = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
      const sha3 = web3Budy.utils.sha3(address) ?? '';
      const account = web3Budy.eth.accounts.privateKeyToAccount(sha3);
      const addressUser = account.address;
      const privateKey = account.privateKey;

      console.log(account);

      const encryptedMessages = encryptMessages(
        messages.map((msg) => msg.text),
        address[0],
      );

      const formData = new FormData();
      formData.append('encryptedMessages', encryptedMessages);

      setUploading(true);
      const uploadRequest = await axios.post('/api/files', formData);
      const response = uploadRequest.data;

      console.log('Mensajes encriptados subidos con éxito:', response);

      const urlResponse = response.url;

      const providerBudy = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const wallet = new ethers.Wallet(privateKey, providerBudy);
      const getBalance = await providerBudy.getBalance(wallet.address);
      console.log(getBalance);
      const contract = new ethers.Contract(BUDY_CONTRACT, ABI, wallet);

      const tx = await contract.mint(urlResponse, { value: ethers.parseEther('0.1') });

      const receipt = await tx.wait();
      console.log(receipt);
      setUploading(false);
    } catch (error) {
      console.error('Error al encriptar y subir los mensajes:', error);
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
        <div className="message bot block"></div>
      </div>
      {pdfFile && (
        <div className="pdf-file-info">
          <FileText size={16} /> {pdfFile.name}
        </div>
      )}

      <div className="input-container">
        <button onClick={handleEncryptMessages} className="encrypt-button" disabled={uploading}>
          {uploading ? (
            'Subiendo...'
          ) : (
            <>
              <Lock size={16} /> Encriptar Mensajes
            </>
          )}
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
    </div>
  );
}

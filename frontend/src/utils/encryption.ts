import CryptoJS from 'crypto-js';

// Función para encriptar mensajes
export const encryptMessages = (messages: string[], userAddress: string) => {
  if (!userAddress) {
    throw new Error("Address no proporcionado");
  }

  // Concatenar todos los mensajes en una cadena
  const combinedMessages = messages.join(' ');

  // Encriptar usando el address como clave
  const encrypted = CryptoJS.AES.encrypt(combinedMessages, userAddress).toString();

  return encrypted;
};

// Función para desencriptar mensajes
export const decryptMessages = (encryptedData: string, userAddress: string) => {
  if (!userAddress) {
    throw new Error("Address no proporcionado");
  }

  // Desencriptar usando el address como clave
  const decrypted = CryptoJS.AES.decrypt(encryptedData, userAddress);

  // Convertir los bytes desencriptados a texto plano
  const plainText = decrypted.toString(CryptoJS.enc.Utf8);

  if (!plainText) {
    throw new Error("No se pudo desencriptar correctamente el mensaje.");
  }

  return plainText;
};

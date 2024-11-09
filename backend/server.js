const express = require('express');
const fileUpload = require('express-fileupload');
const pdf = require('pdf-parse');
const axios = require('axios');
const cors = require('cors');
const {Web3} = require('web3');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json()); 

const apiKey = process.env.API_KEY;

app.post('/api/process-pdf', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  const pdfFile = req.files.file;

  try {
    const data = await pdf(pdfFile.data);
    const text = data.text;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Resume el siguiente texto de una manera amigable para el usuario...: ${text}`,
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

    const summary = response.data.candidates[0].content.parts[0].text;
    res.json({ summary });
  } catch (error) {
    console.error('Error al procesar el PDF:', error);
    res.status(500).send('Error al procesar el PDF.');
  }
});

app.post('/api/transferBudy', async (req, res) => {
  let amount = req.body.amounty;
  let addressTo = req.body.to;
  console.log(amount, addressTo)
  // Validaciones
  if (typeof amount !== 'string' || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'El monto debe ser un número positivo.' });
  }

  if (typeof addressTo !== 'string' || addressTo.trim() === '') {
    return res.status(400).json({ error: 'La dirección debe ser una cadena no vacía.' });
  }

  const privKey = process.env.PRKEY; // Clave privada de Genesis
  const addressFrom = process.env.ADDRESSFROM; // Dirección desde la que se envía
  const web3 = new Web3(process.env.URL_NODE);

  console.log(`Attempting to make transaction from ${addressFrom} to ${addressTo} of ${amount}`);

  try {
    // Obtener el balance de la dirección
    const balance = await web3.eth.getBalance(addressFrom);
    const ethBalance = BigInt(balance); // Convertir balance a BigInt

    // Obtener el gas estimado
    const gasEstimate = await web3.eth.estimateGas({
      from: addressFrom,
      to: addressTo,
      value: web3.utils.toWei(amount, 'ether'),
    });

    // Obtener el precio del gas
    const gasPrice = BigInt(await web3.eth.getGasPrice()); // Convertir gasPrice a BigInt

    // Convertir el monto a Wei y calcular el costo total en BigInt
    const amountInWei = BigInt(web3.utils.toWei(amount, 'ether'));
    const totalCost = amountInWei + (gasEstimate * gasPrice);

    if (totalCost > ethBalance) {
      return res.status(400).json({ error: 'Fondos insuficientes para cubrir la transacción.' });
    }

    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: addressFrom,
        to: addressTo,
        value: amountInWei.toString(), // Asegúrate de enviar como string
        gas: gasEstimate,
        gasPrice: gasPrice.toString(), // Asegúrate de enviar como string
      },
      privKey
    );

    // Enviar la transacción firmada
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );

    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
    res.status(200).json({ message: 'Transacción procesada exitosamente.', transactionHash: createReceipt.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la transferencia.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

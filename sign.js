import { PrivateKey, BadKeyError } from "@hashgraph/sdk";
import inquirer from "inquirer";
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { recoverPersonalSignature, personalSign } from '@metamask/eth-sig-util';
import Wallet from 'ethereumjs-wallet'

import { signMsg, verifyMsg } from "./lib.js";
import { Keypair } from '@solana/web3.js';

export const sign = () => inquirer
  .prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select Network:',
      choices: ['Public Key (ECDSA, ED25519)', 'Solana Public Key (Wallet Address)', 'Ethereum Address'],
    },
    {
      type: 'input',
      name: 'message',
      message: 'Enter message:',
    },
    {
      type: 'password',
      name: 'privKey',
      message: 'Enter private key:',
    },
  ])
  .then(async (answers) => {
    const network = answers.network;
    const message = answers.message;
    const privKey = answers.privKey;
    if (network === "Public Key (ECDSA, ED25519)") {
      // default ecdsa sign
      const pubKey = PrivateKey.fromString(privKey).publicKey.toString('hex');
      const signature = await signMsg(message, privKey);
      const isValid = await verifyMsg(message, signature, pubKey);
      if (isValid) {
        console.log(`Your signature for ${message}:`, signature);
      } else {
        console.log('Error - invalid signature');
      }
    } else if (network === "Ethereum Address") {
      const account = Wallet.default.fromPrivateKey(Buffer.from(privKey, 'hex'));
      const pk = account.getPrivateKeyString().substring(2);
      const pubKey = account.getAddressString();
      const signature = personalSign({ privateKey: Buffer.from(pk, 'hex'), data: message });
      const res = recoverPersonalSignature({ data: message, signature });
      const isValid = pubKey === res;
      if (isValid) {
        // console.log(`Your signature for ${message}:`, Buffer.from(signature).toString('hex'));
        console.log(`Your signature for ${message}:`, signature);
      } else {
        console.log('Error - invalid signature');
      }
    } else {
      // solana sign
      const account = Keypair.fromSecretKey(bs58.decode(privKey))
      const msg = Buffer.from(message, 'utf8');
      const signature = nacl.sign.detached(msg, account.secretKey);
      const isValid = await verifyMsg(message, signature, account.publicKey.toBuffer());
      if (isValid) {
        console.log(`Your signature for ${msg}:`, Buffer.from(signature).toString('hex'));
      } else {
        console.log('Error - invalid signature');
      }

    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log(`Error - Prompt couldn't be rendered in the current environment`);
    } else if (error instanceof BadKeyError) {
      console.log('Error: Invalid key');
    } else {
      console.log(error);
    }
  });

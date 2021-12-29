import { PrivateKey } from "@hashgraph/sdk";
import { signMsg, verifyMsg } from "./lib.js";
import nacl from 'tweetnacl';
import { recoverPersonalSignature, personalSign } from '@metamask/eth-sig-util';
import Wallet from 'ethereumjs-wallet'

import { Keypair } from '@solana/web3.js';

// Test Hedera address
async function testHedera() {
    const msg = "Testing 123";
    const privKey = PrivateKey.generateED25519();
    const signature = await signMsg(msg, privKey.toStringRaw());
    const isValid = await verifyMsg(msg, signature, privKey.publicKey.toStringRaw());
    console.log('ED25519 is valid:', isValid);
}

testHedera();

// Test Soalana address
async function testSolana() {
    const message = "Testing 123";
    let account = Keypair.generate();
    const msg = Buffer.from(message, 'utf8');
    const signature = nacl.sign.detached(msg, account.secretKey);
    const isValid = await verifyMsg(message, signature, account.publicKey.toBuffer());
    console.log('Solana is valid:', isValid);
}

testSolana();

// Test Ethereum address
async function testEthereum() {
    const message = "Testing 123";
    const account = Wallet.default.generate();
    const privKey = account.getPrivateKeyString().substring(2);
    const pubKey = account.getAddressString();
    const signature = personalSign({ privateKey: Buffer.from(privKey, 'hex'), data: message });
    const res = recoverPersonalSignature({ data: message, signature });
    const isValid = pubKey === res;
    console.log('Ethereum is valid:', isValid);
}

testEthereum();

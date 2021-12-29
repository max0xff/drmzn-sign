import { PrivateKey } from "@hashgraph/sdk";
import { signMsg, verifyMsg } from "./lib.js";
import nacl from 'tweetnacl';

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

// Test Hedera address
async function testSolana() {
    const message = "Testing 123";
    let account = Keypair.generate();
    const msg = Buffer.from(message, 'utf8');
    const signature = nacl.sign.detached(msg, account.secretKey);
    const isValid = await verifyMsg(message, signature, account.publicKey.toBuffer());
    console.log('Solana is valid:', isValid);
}

testSolana();

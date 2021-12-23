import { PrivateKey } from "@hashgraph/sdk";
import { signMsg, verifyMsg } from "./lib.js";

// Test Hedera address
async function testHedera() {
    const msg = "Testing 123";
    const privKey = PrivateKey.generateED25519();
    const signature = await signMsg(msg, privKey.toStringRaw());
    const isValid = await verifyMsg(msg, signature, privKey.publicKey.toStringRaw());
    console.log('is valid:', isValid);
}

testHedera();

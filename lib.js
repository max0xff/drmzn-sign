import * as ed from '@noble/ed25519';
import { PrivateKey, PublicKey } from "@hashgraph/cryptography";

/**
 * Sign message with private key
 * @param {string} msg message to be signed
 * @param {string} privKey private key as string
 * @returns {Promise} the signature as string
 */
export async function signMsg(msg, privKey) {
  const privateKey = PrivateKey.fromString(privKey).toBytes();
  const msgHash = Buffer.from(msg, 'utf8').toString('hex');
  const signature = await ed.sign(msgHash, privateKey);
  return signature;
}

/**
 * Verify if message is signed with private key
 * @param {string} msg message to be verified
 * @param {string} signature signature
 * @param {string} pubKey public key as string
 * @returns {Promise} is signature valid boolean
 */
export async function verifyMsg(msg, signature, pubKey) {
  const msgHash = Buffer.from(msg, 'utf8').toString('hex');
  const publicKey = PublicKey.fromString(pubKey).toBytes();
  const isSigned = await ed.verify(signature, msgHash, publicKey);
  return isSigned;
}

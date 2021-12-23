import * as ed from '@noble/ed25519';
import {
  Client,
  PrivateKey,
  PublicKey,
  AccountId,
  TokenAssociateTransaction,
  ReceiptStatusError,
  BadKeyError
} from '@hashgraph/sdk';

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

/**
 * Associate account with token in Hedera network
 * @param {string} clientId 
 * @param {string} tokenId 
 * @param {string} privKey 
 */
export async function assocToken(network, clientId, tokenId, privKey) {
  let client;
  try {
    const pk = PrivateKey.fromString(privKey);
    if (network === 'Mainnet') {
      client = Client.forMainnet().setOperator(clientId, pk);  
    } else if (network === 'Previewnet') {
      client = Client.forPreviewnet().setOperator(clientId, pk);  
    } else {
      client = Client.forTestnet().setOperator(clientId, pk);  
    }
    // const client = Client.forTestnet().setOperator(clientId, pk);
    // Associate a token to an account and freeze the unsigned transaction for signing
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(AccountId.fromString(clientId))
      .setTokenIds([tokenId])
      .freezeWith(client);
    // Sign with the private key of the account that is being associated to a token 
    const signTx = await transaction.sign(pk);
    // Submit the transaction to a Hedera network    
    const txResponse = await signTx.execute(client);
    // Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
    // Get the transaction consensus status
    const transactionStatus = receipt.status;
    return "The transaction consensus status: " + transactionStatus.toString();
  } catch (error) {
    if (error instanceof BadKeyError) {
      console.log('Error: Invalid private key');
    } else if (error instanceof ReceiptStatusError) {
      console.log(error.message);
    } else {
      console.log('Unknown Error');
      console.log(error);
    }
  }
}

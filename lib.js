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
 * @returns {string} the signature as string
 */
export function signMsg(message, privKey) {
  const privateKey = PrivateKey.fromString(privKey);
  const msg = Buffer.from(message, 'utf8')
  const signature = privateKey.sign(msg);
  return Buffer.from(signature).toString('hex');
}

/**
 * Verify if message is signed with private key
 * @param {string} msg message to be verified
 * @param {string} signature signature
 * @param {string} pubKey public key as string
 * @returns {Promise} is signature valid boolean
 */
export function verifyMsg(message, signature, pubKey) {
  const publicKey = PublicKey.fromString(pubKey);
  const msg = Buffer.from(message, 'utf8');
  const sign = Buffer.from(signature, 'hex');
  const isSigned = publicKey.verify(msg, sign);
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

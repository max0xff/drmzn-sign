import inquirer from "inquirer";
import { BadKeyError } from '@hashgraph/sdk';

import { assocToken } from "./lib.js";

export const token = () => inquirer
  .prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Select Network',
      choices: ['Mainnet', 'Previewnet', 'Testnet']
    },
    {
      type: 'input',
      name: 'accountId',
      message: 'Enter accoint id (ex: 0.0.123456):',
    },
    {
      type: 'input',
      name: 'tokenId',
      message: 'Enter token id (ex: 0.0.123456):',
    },
    {
      type: 'password',
      name: 'privKey',
      message: 'Enter private key:',
    },
  ])
  .then(async (answers) => {
    const network = answers.network;
    const accountId = answers.accountId;
    const tokenId = answers.tokenId;
    const privKey = answers.privKey;
    const status = await assocToken(network, accountId, tokenId, privKey);
    if (status) {
      console.log(status);
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

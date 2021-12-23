import { BadKeyError } from "@hashgraph/cryptography";
import inquirer from "inquirer";

import { signMsg, verifyMsg } from "./lib.js";

inquirer
  .prompt([
    {
      type: 'input',
      name: 'msg',
      message: 'Enter message:',
    },
    {
      type: 'input',
      name: 'signature',
      message: 'Enter signature:',
    },
    {
      type: 'input',
      name: 'pubKey',
      message: 'Enter public key:',
    },
  ])
  .then(async (answers) => {
    const msg = answers.msg;
    const signature = answers.signature;
    const pubKey = answers.pubKey;
    const isValid = await verifyMsg(msg, signature, pubKey);
    if (isValid) {
      console.log('Valid signature!');
    } else {
      console.log('Invalid signature!');
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log(`Error - Prompt couldn't be rendered in the current environment`);
    } else if (error instanceof BadKeyError) {
      console.log('Error: Invalid private key');
    } else {
      console.log(error);
    }
  });

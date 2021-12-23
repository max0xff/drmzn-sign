import { PrivateKey, BadKeyError } from "@hashgraph/cryptography";
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
      type: 'password',
      name: 'privKey',
      message: 'Enter private key:',
    },
  ])
  .then(async (answers) => {
    const msg = answers.msg;
    const privKey = answers.privKey;
    const pubKey = PrivateKey.fromString(privKey).publicKey.toString('hex');
    const signature = await signMsg(msg, privKey);
    const isValid = await verifyMsg(msg, signature, pubKey);
    if (isValid) {
      console.log(`Your signature for ${msg}:`, signature);
    } else {
      console.log('Error - invalid signature');
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log(`Error - Prompt couldn't be rendered in the current environment`);
    } else if (error instanceof BadKeyError) {
      console.log('Error: Invalid private key');
    } else {
      console.log('Error');
      console.log(error);
    }
  });

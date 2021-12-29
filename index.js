import inquirer from "inquirer";
import { BadKeyError } from "@hashgraph/sdk";

import { verify } from "./verify.js";
import { sign } from "./sign.js";
import { token } from "./token.js";

inquirer
  .prompt([
    {
      type: 'list',
      name: 'app',
      message: 'Select action:',
      choices: ['Sign message with private key', 'Verify signature with public key', 'Associate account with token on Hedera Network'],
    }
  ])
  .then(async (answers) => {
    console.log(answers.app)
    if (answers.app === 'Sign message with private key') {
      sign();
    } else if (answers.app === 'Verify signature with public key') {
      verify();
    } else if (answers.app === 'Associate account with token') {
      token();
    } else {
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

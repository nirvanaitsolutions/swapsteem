import { writeFile } from 'fs';
import { argv } from 'yargs';
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';
const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  steemconnectConfig: {
    clientId: "${process.env.STEEM_CONNECT_CLIENT_ID || 'https://swapsteem-api.herokuapp.com'}",
    scope: ['custom_json','vote']
  },
  API_URL: "${process.env.API_URL || 'https://swapsteem-api.herokuapp.com'}",
  SKIP_WHITE_LIST: ${process.env.SKIP_WHITE_LIST ? JSON.parse(process.env.SKIP_WHITE_LIST) : false}
};
`
console.log('envConfigFile', envConfigFile)
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
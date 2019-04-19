import { SteemConnectConfig } from '../app/steemconnect/steemconnect.module';
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  steemconnectConfig: {
    clientId: 'steemlinked.app',
    scope: ['custom_json']
  },
  API_URL: 'https://swapsteem-api.herokuapp.com',
  SKIP_WHITE_LIST: false
};
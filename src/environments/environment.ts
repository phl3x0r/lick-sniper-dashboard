/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // your firebase setup goes here
  firebase: {
    apiKey: "AIzaSyAAoYX9ihJRQSnPSdKXMfqzYONcFvgobk4",
    authDomain: "lick-sniper-log.firebaseapp.com",
    projectId: "lick-sniper-log",
    storageBucket: "lick-sniper-log.appspot.com",
    messagingSenderId: "789504113574",
    appId: "1:789504113574:web:b5bf2530352e2b04bc6d67",
    measurementId: "G-KG8PLYZV8S",
  },
  // as list of trade logs. should match the aliases used in trade-sync
  collection: "trades",
  // enable this to use mocked data (avoids reads from firestore)
  useMockData: false,
  // use local cache, saves reads from firestore
  useCache: true,
};

// import * as functions from "firebase-functions";
import { readConfig } from "./Config";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

(async () => {
  console.log(await readConfig());
})();

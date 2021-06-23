// import * as functions from "firebase-functions";
import { readConfig } from "./Config";
import { scrape } from "./Scrape";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

(async () => {
  const config: Config = await readConfig();
  const p = await scrape(config);
  // console.log(p);
  console.log(JSON.stringify(p, null, 4));
})();

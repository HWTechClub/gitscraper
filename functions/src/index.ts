import * as functions from "firebase-functions";
import { readConfig } from "./Config";
import { scrape } from "./Scrape";
import { join } from "path";

import admin from "firebase-admin";

async function getData() {
  const config: Config = await readConfig(join(__dirname, "../gitscraper.json"));
  const p = await scrape(config);

  return {
    [config.id]: p,
  };
}

async function writeData(data: { [key: string]: ScrapedData }) {
  try {
    admin.initializeApp();

    console.log("Firebase Admin initialized.");

    const db = admin.database();
    const user = "UserA";
    const ref = db.ref(`/`);

    console.log("Writing to DB.");

    const userRef = ref.child(user);
    await userRef.set(data);
  } catch (error) {
    console.error(error);
  }
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const Scrape = functions.https.onRequest(async (request, response) => {
  console.log("Scraping Data.");
  const data = await getData();
  console.log("Scraping Done.");
  console.log("Writing Data");
  await writeData(data);
  console.log("Finish.");
  response.send("Finish");
  admin.app().delete();
});

(async () => {
  const data = await getData();
  console.log(data);
})();

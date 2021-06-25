import "../functions/src/types";
import { readConfig } from "../functions/src/Config";
import { scrape } from "../functions/src/Scrape";
import { objectGet } from "../functions/src/Utils";
import { join } from "path";

test("Plain Selectors", async () => {
  const config: Config = await readConfig(join(__dirname, "./gitscraper.test.json"));
  const p = await scrape(config);

  const data = {
    [config.id]: p,
  };

  const testPlainSelectors = [
    { path: "faraz/full_name", expected: "Faraz Shaikh" },
    { path: "faraz/username", expected: "FarazzShaikh" },
    { path: "faraz/details/location", expected: "Dubai, UAE" },
  ];

  const t = testPlainSelectors.every((s) => {
    const path = s.path.split("/");
    const o = objectGet(data, path, 0)[0];
    return o.data === s.expected;
  });

  expect(t).toBe(true);
});

test("Plain Selectors with Attributes", async () => {
  const config: Config = await readConfig(join(__dirname, "./gitscraper.test.json"));
  const p = await scrape(config);

  const data = {
    [config.id]: p,
  };

  const testPlainSelectors = [
    {
      path: "faraz/full_name[class,itemprop]",
      expected: ["p-name vcard-fullname d-block overflow-hidden", "name"],
    },
    {
      path: "faraz/details/location[itemprop,aria-label]",
      expected: ["homeLocation", "Home location: Dubai, UAE"],
    },
  ];

  const t = testPlainSelectors.every((s) => {
    const base = s.path.split("[")[0].split("/");
    const o = objectGet(data, base, 0)[0];
    const attr = s.path.match(/\[(.*?)\]/)![1].split(",");
    return attr.every((a, i) => s.expected[i] === o.attributes[a]);
  });

  expect(t).toBe(true);
});

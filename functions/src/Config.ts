/**
 * Functions to deal with reading the config file
 *
 * Config file path `/gitscraper.json`
 */

import { promises as fs, existsSync } from "fs";
import * as path from "path";

const deepMapKeys = (obj: any, fn: any): any =>
  Array.isArray(obj)
    ? obj.map((val) => deepMapKeys(val, fn))
    : typeof obj === "object"
    ? Object.keys(obj).reduce((acc, current) => {
        const key = fn(current);
        const val = obj[current];
        // @ts-ignore
        acc[key] = val !== null && typeof val === "object" ? deepMapKeys(val, fn) : val;
        return acc;
      }, {})
    : obj;

const deepForeach = (obj: any, fn: any) => {
  Object.keys(obj).forEach((key) => {
    fn(key);

    if (typeof obj[key] === "object") {
      deepForeach(obj[key], fn);
    }
  });
};

function deepMap(obj: any, cb: any): any {
  var out = {};

  Object.keys(obj).forEach(function (k) {
    var val;

    if (obj[k] !== null && typeof obj[k] === "object") {
      val = deepMap(obj[k], cb);
    } else {
      val = cb(obj[k], k);
    }

    // @ts-ignore
    out[k] = val;
  });

  return out;
}

/**
 * Reads and parses a config file. The file must be called
 * `gitscraper.json` and be in the root directory.
 * @returns {Config} A config object
 */
export async function readConfig(): Promise<Config> {
  const p = path.resolve(__dirname, "../gitscraper.json");

  if (existsSync(p)) {
    const config: Config = JSON.parse(await fs.readFile(p, "utf8"));
    return config;
  } else {
    throw new Error(`Config File does not exist.`);
  }
}

/**
 * Functions to deal with reading the config file
 *
 * Config file path `/gitscraper.json`
 */

import { promises as fs, existsSync } from "fs";
import * as path from "path";

const defaultSelectors = {};

/**
 * Reads and parses a config file. The file must be called
 * `gitscraper.json` and be in the root directory.
 * @returns {Config} A config object
 */
export async function readConfig(): Promise<Config> {
  // Get the path of the config file
  const p = path.resolve(__dirname, "../gitscraper.json");

  // if file exists...
  if (existsSync(p)) {
    // ...fetch it as JSON
    const config: Config = JSON.parse(await fs.readFile(p, "utf8"));
    // ...check if the properties exists
    if (config.user === undefined) throw new Error(`You must specify a user in the config file.`);
    if (config.selectors === undefined) config.selectors = defaultSelectors;
    // ...return the config
    return config;
  } else {
    throw new Error(`Config File does not exist.`);
  }
}

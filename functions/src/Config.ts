/**
 * Functions to deal with reading the config file
 *
 * Config file path `/gitscraper.json`
 */

import { promises as fs, existsSync } from "fs";

/**
 * Reads and parses a config file. The file must be called
 * `gitscraper.json` and be in the root directory.
 * @returns {Config} A config object
 */
export async function readConfig(path: string): Promise<Config> {
  const p = path;

  if (existsSync(p)) {
    const config: Config = JSON.parse(await fs.readFile(p, "utf8"));
    return config;
  } else {
    throw new Error(`Config File does not exist.`);
  }
}

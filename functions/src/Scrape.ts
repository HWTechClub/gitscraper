import cheerio from "cheerio";
import { request } from "https";
import { URL } from "whatwg-url";

import { deepMap, getAllAttributes } from "./Utils";

/**
 * Gets the profile page using a https GET request
 * @private
 * @param config Configuration object
 * @returns Response body as string
 */
function _getPage(config: Config): Promise<string> {
  const u = new URL(config.url);

  // Https request options
  const options = {
    hostname: u.hostname,
    path: u.pathname,
    method: "GET",
    port: "443",
    headers: {
      Accept: "text/html",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36",
    },
  };

  // Promises wrapper around callback based API
  return new Promise((resolve, reject) => {
    // Body of the response
    let body: string;

    // Make the request
    const req = request(options, (res) => {
      // Reject the promise if request isn't a success
      if (res.statusCode !== 200) {
        reject("http GET returned status code: " + res.statusCode);
      }

      // Assemble body
      res.setEncoding("utf8");
      res
        .on("data", function (d) {
          body += d;
        })
        .on("end", function () {
          // Resolve the promise with body if everything
          // goes right
          return resolve(body);
        });
    });

    // Reject the promise if theres an error
    req.on("error", (error) => {
      reject(error);
    });

    // End the transaction
    req.end();
  });
}

/**
 * Scrapes the GitHub profile page for tags refrenced
 * by the selectors property of the config file.
 *
 * @param config Configuration object
 * @returns An array of tags and thir values
 */
export async function scrape(config: Config): Promise<ScrapedData> {
  const page: string = await _getPage(config);
  const $ = cheerio.load(page);

  const o: ScrapedData = deepMap(config.endpoints, (endpoint: string, key: string) => {
    const nodes = $(endpoint).get();
    const results: NodeData[] = [];

    const key_split = key.split("[");

    nodes.forEach((n) => {
      if (n.type === "tag") {
        const node = $(n);
        const nodeData: NodeData = {
          //@ts-ignore
          tag: n.name,
          data: undefined,
          attributes: {},
        };

        //@ts-ignore
        if (["img", "video"].includes(n.name)) {
          if (node.attr("src")) nodeData.attributes["src"] = node.attr("src");
          //@ts-ignore
        } else if (n.name === "a") {
          if (node.attr("href")) nodeData.attributes["href"] = node.attr("href");
        }

        nodeData.data = node.text().trim();

        if (key_split[1]) {
          const attrs = key_split[1].split("]")[0].split(",");

          for (let i = 0; i < attrs.length; i++) {
            const a = attrs[i];

            if (a === "*") {
              const all = getAllAttributes(n);
              all.forEach((_a: any) => {
                nodeData.attributes[_a.name] = _a.value;
              });
              break;
            }

            if (node.attr(a)) nodeData.attributes[a] = node.attr(a);
          }
        }

        results.push(nodeData);
      }
    });

    const key_actual = key_split[0];

    return {
      val: results,
      key: key_actual,
    };
  });

  return o;
}

import cheerio from "cheerio";
import { request } from "https";

/**
 * Gets the profile page using a https GET request
 * @private
 * @param config Configuration object
 * @returns Response body as string
 */
function _getPage(config: Config): Promise<string> {
  // Https request options
  const options = {
    hostname: "github.com",
    path: `/${config.user}`,
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
export async function scrape(config: Config): Promise<Result[]> {
  // Get page as HTML string
  const page: string = await _getPage(config);

  //Load the page with cheerio
  const $ = cheerio.load(page);

  const results: Result[] = [];
  // ...For each selector
  for (let selector in config.selectors) {
    const obj = config.selectors[selector];

    // ...get the element from the HTML
    const element = $(obj);

    // ...checks if there is atleast one result
    if (element.length) {

      // ...create a result
      const result: Result = {
        name: selector,
        //@ts-ignore
        type: element[0].name,
      };

      // ...get the data
      if (["img", "video"].includes(result.type)) {
        result.data = element.attr("src");
      } else if (result.type === "a") {
        result.data = element.attr("href");
      } else {
        result.data = element.text().trim();
      }

      // ...regex to check for empty string
      if (/^\s*$/.test(result.data!)) {
        result.data = undefined;
      }

      // ...push the result into the array
      results.push(result);
    }

    // ...if no results are found, the selector name is returned with undefined data
    else {
      const result: Result = {
        //@ts-ignore
        name: selector,
        type: selector.split('_')[0],
        data: undefined,
      };

      // ...push the result into the array
      results.push(result);
    }

  }

  // Return the result
  return results;
}

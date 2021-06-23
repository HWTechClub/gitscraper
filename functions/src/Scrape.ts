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
export async function scrape(config: Config): Promise<Result> {
  // Get page as HTML string
  const page: string = await _getPage(config);
  const $ = cheerio.load(page);
  const scrapedData: Result = {};

  // For each selector =
  for (const selector in config.selectors) {
    // get all the elements found in the page
    // basically document.querySelectorAll()
    const img = $(config.selectors[selector])
      .get()
      // For each node found...
      .map((n): Data => {
        let data: Data = {
          tag: undefined,
          data: undefined,
          attrs: undefined,
        };

        // ...If it is a tag then get its data
        if (n.type === "tag") {
          //@ts-ignore
          if (["img", "video"].includes(n.name)) {
            //@ts-ignore
            data.tag = n.name;
            data.data = $(n).attr("src") || undefined;

            //@ts-ignore
          } else if (n.name === "a") {
            //@ts-ignore
            data.tag = n.name;
            data.data = $(n).attr("href") || undefined;
            if (!data.attrs) {
              data.attrs = {};
              var innerText = $(n).text().trim()
              if (innerText) data.attrs!['innerText'] = innerText;
            }
          } else {
            //@ts-ignore
            data.tag = n.name;
            data.data = $(n).text().trim().replace(/\s+/g, " ") || undefined;
          }
        }

        // If there are custom attributes requested
        // then construct them
        const customAttrs = selector.match("\\[(.*)]");
        if (customAttrs) {
          if (!data.attrs) data.attrs = {};

          const attributeNames = customAttrs[0].substring(customAttrs[0].lastIndexOf("[") + 1, customAttrs[0].lastIndexOf("]")).split(",");

          attributeNames.forEach((attribute) => {
            const a = $(n).attr(attribute);
            if (a) {
              data.attrs![attribute] = a;
            }
          });
        }
        
        return data;
      });

    scrapedData[selector] = img;
  }

  return scrapedData;
}

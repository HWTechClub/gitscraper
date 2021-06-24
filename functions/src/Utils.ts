// https://stackoverflow.com/a/35056218
export function deepMap(obj: any, cb: any) {
  var out = {};

  Object.keys(obj).forEach(function (k) {
    var val, key;

    if (obj[k] !== null && typeof obj[k] === "object") {
      val = deepMap(obj[k], cb);
    } else {
      const r = cb(obj[k], k);
      val = r.val;
      key = r.key;
    }

    // @ts-ignore
    out[key || k] = val;
  });

  return out;
}

// https://github.com/cheeriojs/cheerio/issues/786#issuecomment-362007466
export function getAllAttributes(node: any) {
  return node.attributes || Object.keys(node.attribs).map((name) => ({ name, value: node.attribs[name] }));
}

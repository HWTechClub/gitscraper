interface Endpoint {
  [key: string]: string | Endpoint;
}

type Config = {
  url: string;
  id: string;
  endpoints: Endpoint;
};

type NodeData = {
  tag?: string;
  data?: string;
  attributes: {
    [key: string]: string | undefined;
  };
};

type ScrapedData = {
  [key: string]: NodeData[];
};

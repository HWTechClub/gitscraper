type Config = {
  user: string;
  selectors: {
    [key: string]: string;
  };
};

type Data = {
  tag?: string;
  data?: string;
  attrs?: {
    [key: string]: string;
  };
};

type Result = {
  [key: string]: Data[];
};

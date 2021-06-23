type Config = {
  user: string;
  selectors: {
    [key: string]: string;
  };
};

type Result = {
  type: string;
  name: string;
  data?: string;
};

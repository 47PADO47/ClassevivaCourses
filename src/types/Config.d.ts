import { PingerOptions } from "./Pinger";

type User = {
    name: string;
    key?: string;
};
  
type Config = {
  users?: User[];
  DS_HOOK: string;
  CVV_PROXY?: string;
  pinger: PingerOptions;
  debug: boolean;
  staticHost: string;
  dashboardPath: string;
}

export {
    User,
    Config,
}
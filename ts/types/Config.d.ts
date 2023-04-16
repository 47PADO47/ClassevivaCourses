import { PingerOptions } from "./Pinger";

type User = {
    name: string;
    key?: string;
};
  
type Config = {
  users: User[];
  DB_URL: string;
  DS_HOOK: string;
  CVV_PROXY?: string;
  pinger: PingerOptions;
  debug: boolean;
  staticHost: string;
}

export {
    User,
    Config,
}
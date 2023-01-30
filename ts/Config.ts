import { PingerOptions } from "Pinger";

export type User = {
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
}
  
const Config = Object.freeze<Config>({
    users: [
        {
            name: 'PB',
        },
        {
            name: 'PP',
        },
    ],
    DB_URL: '',
    DS_HOOK: 'https://discord.com/api/webhooks/1063121370889850971/w9AXRSkQVL5DRHQ0h65rT_pdVf748AZn-rFSYNoj-RjCBAkHE6Sb0marJHjBxCrNMOzw',
    pinger: {
        domains: [],
        timeout: 2000,
    },
    debug: true,
})

export default Config;
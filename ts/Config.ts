import { Config } from "./types/Config";

const config: Config = {
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
        domains: [
            {
                url: '/',
            }
        ],
        timeout: 10*1000,
    },
    debug: true,
    staticHost: 'https://webcvv.pages.dev/',
};

//if (config.debug) config.staticHost = prompt('static host:');

export default Object.freeze<Config>(config);
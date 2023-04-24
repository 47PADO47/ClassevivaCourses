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
    DS_HOOK: '{discord_webhook}',
    pinger: {
        domains: [
            {
                url: '/',
            }
        ],
        timeout: 10*1000,
    },
    debug: true,
    staticHost: '{static_host}',
};

if (config.debug) config.staticHost = prompt('static host:') || config.staticHost;

export default Object.freeze<Config>(config);
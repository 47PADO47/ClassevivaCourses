import { Config } from "./types/Config";

const config: Config = {
    debug: false,
    staticHost: '{static_host}',
    dashboardPath: 'src/dashboard.html',
};

if (config.debug) config.staticHost = prompt('static host:') || config.staticHost;

export default Object.freeze<Config>(config);
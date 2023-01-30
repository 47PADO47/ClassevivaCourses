import Logger from "Logger";

type Url = {
    url: string;
    method?: string;
  }
  
type PingerOptions = {
    domains: Url[],
    timeout?: number,
}
  
class Pinger {
    options: PingerOptions;
    constructor(private debug: boolean) {
        this.debug = debug;
        this.options;
    };
  
    init (options: PingerOptions): void {
        this.options = options;
        for (const domain of this.options.domains) {
            setInterval(async () => await this.ping({
                url: domain.url,
                method: domain.method,
            }), this.options.timeout || 5000);
        };
  
        Logger.success('Pinger initialized');
    };
    
    async ping(urlOptions: Url) {
        try {
            const response = await fetch(urlOptions.url, {
                method: urlOptions.method || 'GET',
            });
    
            if (this.debug) {
                Logger.info(`Pinger::ping(${Logger._formatArgs(urlOptions)}) called`);
                Logger.info(`Response status:`, response.status, response.statusText);
            };
            
            return response.ok;
        } catch (error) {
            return false;
        }
    };
};

export {
    Pinger,
    PingerOptions,
};
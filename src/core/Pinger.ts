import { PingerOptions, Url } from "@/types/Pinger";
  
class Pinger {
    options: PingerOptions;
    constructor(options?: PingerOptions) {
        this.options = options || {};
    };
  
    init (options: PingerOptions = this.options): void {
        if (!options.domains) return;

        for (const domain of options.domains) {
            setInterval(async () => await this.ping({
                url: domain.url,
                method: domain.method,
            }), this.options.timeout || 5000);
        };
  
        window.logger.success('Pinger initialized');
    };
    
    async ping(urlOptions: Url) {
        try {
            const response = await fetch(urlOptions.url, {
                method: urlOptions.method || 'GET',
            });

            window.logger.info(`Pinger::ping(${window.logger._formatArgs(urlOptions)}) called`);
            window.logger.info(`Response status:`, response.status, response.statusText);
            
            return response.ok;
        } catch (error) {
            return false;
        }
    };
};

export default Pinger;
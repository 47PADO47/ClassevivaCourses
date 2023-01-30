import Logger from "Logger";

class CookieManager {
    document: Document;
    constructor(private debug: boolean) {
        this.debug = debug;
    };
  
    init (document: Document): void {
        this.document = document;
        Logger.success('CookieManager initialized');
    };
  
    getCookie(name: string): string {
        if (!this.document) return;
        if (this.debug) Logger.info(`CookieManager::getCookie(${name}) called`);
  
        let value = "; " + this.document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) {
          return parts.pop().split(";").shift();
        }
    };
    
    setCookie({ name, value, expiration }: {name: string, value: string, expiration?: number}) {
        if (!this.document) return;
        if (this.debug) Logger.info(`CookieManager::setCookie(${Logger._formatArgs(arguments)}) called`);
  
        let expires = "";
        if (expiration) {
          let date = new Date();
          date.setTime(date.getTime() + expiration * 24 * 60 * 60 * 1000);
          expires = "; expires=" + date.toUTCString();
        }
        this.document.cookie = name + "=" + value + expires + "; path=/";
    };
  
    deleteCookie(name: string) {
        if (!this.getCookie(name)) return;
        this.setCookie({ name: name, value: "", expiration: -1 });
    };
};

export default CookieManager;
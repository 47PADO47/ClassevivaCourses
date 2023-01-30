import Logger from "Logger";
import Config, { User } from "Config";

class KeyManager {
    #users: User[];
    constructor(private debug: boolean) {
        this.debug = debug;
        this.#users = [];
    };
  
    init (users: User[]) {
        Object.assign(this.#users, users);
        Logger.success('KeyManager initialized');
    }
  
    generateKey() {
        if (this.debug) Logger.success('KeyManager::generateKey() called');
        return this.getRandomString(this.getRandomInt(10, 20));
    }
    
    getRandomInt(min: number, max: number) {
        if (this.debug) Logger.info(`KeyManager::getRandomInt(${min}, ${max}) called`);
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    getRandomString(length: number) {
        if (this.debug) Logger.info(`KeyManager::getRandomString(${length}) called`);
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
  
    async updateKeys(notify: (opts: {message: string; useContent?: boolean}) => Promise<unknown>) {
        if (this.debug) Logger.info('KeyManager::updateKeys() called');
        for (const user of this.#users) {
            if (user.key) return;
  
            user.key = this.generateKey();
            await notify({
              message: `Updated user: ${Logger.codeblock(JSON.stringify(user), 'json')}`,
              useContent: true
            });
            if (this.debug) Logger.success('Updated keys notification sent');
        }
    };
  
    isValid(key: string) {
        if (this.debug) Logger.info(`KeyManager::isValid(${key}) called`);
        return !!this.#users.find(u => u.key === key);
    }
}

export default KeyManager;
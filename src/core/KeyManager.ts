import { User } from "../types/Config";

class KeyManager {
    #users: User[];
    constructor() {
        this.#users = [];
    };
  
    init (users: User[]) {
        Object.assign(this.#users, users);
        window.logger.success('KeyManager initialized');
    }
  
    generateKey() {
        window.logger.success('KeyManager::generateKey() called');
        return this.getRandomString(this.getRandomInt(10, 20));
    }
    
    getRandomInt(min: number, max: number) {
        window.logger.info(`KeyManager::getRandomInt(${min}, ${max}) called`);
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    getRandomString(length: number) {
        window.logger.info(`KeyManager::getRandomString(${length}) called`);
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
  
    async updateKeys(notify: (opts: {message: string; useContent?: boolean}) => Promise<unknown>) {
        window.logger.info('KeyManager::updateKeys() called');
        for (const user of this.#users) {
            if (user.key) return;
  
            user.key = this.generateKey();
            await notify({
              message: `Updated user: ${window.logger.codeblock(JSON.stringify(user), 'json')}`,
              useContent: true
            });
            window.logger.success('Updated keys notification sent');
        }
    };
  
    isValid(key: string) {
        window.logger.info(`KeyManager::isValid(${key}) called`);
        return !!this.#users.find(u => u.key === key);
    }
}

export default KeyManager;
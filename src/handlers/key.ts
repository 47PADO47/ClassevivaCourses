import Handler from "@/core/Handler";
import { User } from "@/types/Config";
import { buttonPressCallbackData } from "@/types/Utils";

class KeyHandler extends Handler {
    constructor() {
        super({
            name: "Key"
        });
    };

    async handle({ inputs }: buttonPressCallbackData): Promise<boolean> {
        if (!window.config.users) return false;
        
        if (!inputs) return false;
        const { value: key } = inputs[0];

        const res = await window.keyManager.isValid(key);
        if (!res) {
            const message = 'Failed to validate key';

            window.notificationManager.documentAlert({
                type: 'danger',
                message,
            });
            window.logger.error(message);

            return false;

        };

        window.cookieManager.setCookie({
            name: 'key',
            value: key
        });

        const user = window.config.users.find((u: User) => u.key === key);
        if (!user) return false;

        const message = `Successfully validated key (${key}) for user ${user.name}`;

        window.notificationManager.notify({
            message: window.logger.codeblock(message),
            useContent: true,
            alert: {
                type: 'success',
                message,
                dimissable: true,
            },
            logType: 'success',
        });
        alert(`Welcome back ${user.name}`);

        return true;
    };

    getForm() {
        return [
            {
                name: 'key',
                id: 'key',
            }
        ];
    }
};

export default KeyHandler;
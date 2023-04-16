import Handler from "core/Handler";
import { ExtendedElement } from "../types";
import { User } from "../types/Config";
import { buttonPressCallbackData } from "../types/Utils";

class KeyHandler extends Handler {
    constructor(public buttonId?: string) {
        super({
            name: "Key"
        });
        if (!buttonId) this.buttonId = this.createForm();
    };

    async handle({ button }: buttonPressCallbackData) {
        const input: ExtendedElement = document.getElementById(button.id.split('_').pop());
        console.log(input);
        const key = input.value;

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

    private createForm() {
        return window.utils.createForm([{
            name: 'key',
            id: 'key',
        }]);
    }
};

export default KeyHandler;
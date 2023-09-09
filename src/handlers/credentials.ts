import Handler from "core/Handler";
import { ClassOptions } from "types/Classeviva";
import { buttonPressCallbackData, CredentialsInput } from "../types/Utils";

class CredentialsHandler extends Handler {
    constructor(public buttonId?: string) {
        super({
            name: "Credentials"
        });

        if (!buttonId) this.buttonId = this.createForm();
    };

    
    async handle({ button, inputs }: buttonPressCallbackData) {
        const credentials: ClassOptions = {};
        
        const credentialsInputs = inputs as CredentialsInput[];
        credentialsInputs.map((e) => credentials[e.id] = e.value);
    
        const { result } = await window.classeviva.login(credentials);
        if (window.classeviva.user.type !== 'S') return false;
    
        if (!result) return false; // && cause !== 'sus'
        
        const message = `You have successfully logged in as ${window.classeviva.user.nome} ${window.classeviva.user.cognome}`
    
        alert(message);
        window.notificationManager.documentAlert({
            type: 'success',
            message,
            dimissable: true,
        });
        window.logger.success('Logged in successfully', window.classeviva.user);
        
        return true;
    }

    private createForm() {
        return window.utils.createForm([
            {
                name: 'username',
                id: 'uid',
            },
            {
                name: 'password',
                id: 'pwd',
                type: 'password',
            },
        ]);
    }
};

export default CredentialsHandler;
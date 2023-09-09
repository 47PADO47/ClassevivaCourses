import { ExtendedElement } from "../types";
import { HandlerOptions } from "../types/Handler";
import { buttonPressCallbackData, FormOptions } from "../types/Utils";

class Handler {
    name: string;
    buttonId: string;
    element?: ExtendedElement<HTMLButtonElement>;
    constructor(options: HandlerOptions) {
        this.name = options.name.endsWith('Handler')
            ? options.name
            : options.name + 'Handler';

        this.buttonId = window.utils.createForm(options.form ?? this.getForm());

        if (options.useElement) this.element = document.getElementById(this.buttonId) as ExtendedElement<HTMLButtonElement>;
        if (options.handle) this.handle = options.handle;

        window.logger.success(`Handler "${this.name}" initialized 🧪`);
    };

    getForm(): FormOptions[] {
        return [];
    };

    handle<T>(_data: buttonPressCallbackData | T) {
        throw new Error("Method not implemented ❌");
    }

    async registerInteraction(element: ExtendedElement<HTMLButtonElement>) {
        element.addEventListener('click', async () => {
            try {
                window.utils.updateButton(true, element);
                await this.handle({});
                window.utils.updateButton(false, element);
            } catch (error) {
                window.logger.error(`Handler "${this.name}" encountered and error executing interaction`, error);
            }
        });
        return this;
    }
}

export default Handler;
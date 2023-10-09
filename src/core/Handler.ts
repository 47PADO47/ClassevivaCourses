import { ExtendedElement } from "@/types";
import { HandlerDisplayOptions, HandlerOptions } from "@/types/Handler";
import { buttonPressCallbackData, FormOptions } from "@/types/Utils";

abstract class Handler {
    name: string;
    buttonId: string;
    element?: ExtendedElement<HTMLButtonElement>;
    constructor(options: HandlerOptions) {
        this.name = options.name.endsWith('Handler')
            ? options.name
            : options.name + 'Handler';
        this.buttonId = "";

        if (options.handle) this.handle = options.handle;

        if (!options.manualDisplay) this.display(options);
        window.logger.success(`Handler "${this.name}" initialized 🧪`);
    };

    display(options: HandlerDisplayOptions) {
        this.buttonId = window.utils.createForm(options.form ?? this.getForm());

        if (options.useElement) {
            this.element = document.getElementById(this.buttonId) as ExtendedElement<HTMLButtonElement>;
            this.registerInteraction();
        }

        return this;
    }

    getForm(..._data: any[]): FormOptions[] {
        return [];
    }

    handle<T>(_data: buttonPressCallbackData | T) {
        throw new Error("Method not implemented ❌");
    }

    private async registerInteraction() {
        if (!this.element) return;

        this.element.addEventListener('click', async () => {
            if (!this.element) return;
            try {
                window.utils.updateButton(true, this.element);
                await this.handle({});
                window.utils.updateButton(false, this.element);
            } catch (error) {
                window.logger.error(`Handler "${this.name}" encountered and error executing interaction`, error);
            }
        });
        
        return this;
    }
}

export default Handler;
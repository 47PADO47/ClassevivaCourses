import { ExtendedElement } from "../types";
import { HandlerOptions } from "../types/Handler";
import { buttonPressCallbackData } from "../types/Utils";

class Handler {
    name: string;
    constructor(options: HandlerOptions) {
        this.name = options.name.endsWith('Handler')
            ? options.name
            : options.name + 'Handler';
        if (options.handle) this.handle = options.handle;

        window.logger.success(`Handler "${this.name}" initialized 🧪`);
    };

    handle<T>(_data: buttonPressCallbackData | T) {
        throw new Error("Method not implemented ❌");
    }

    async registerInteraction(element: ExtendedElement) {
        element.addEventListener('click', async () => await this.handle({}));
        return this;
    }
}

export default Handler;
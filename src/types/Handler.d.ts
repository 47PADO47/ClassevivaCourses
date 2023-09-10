import { FormOptions, waitForButtonPressCallback } from "./Utils";

type HandlerDisplayOptions = {
    form?: FormOptions[];
    useElement?: boolean;
}

type HandlerOptions = HandlerDisplayOptions & {
    name: string;
    manualDisplay?: boolean;
    
    handle?: waitForButtonPressCallback;
};

export {
    HandlerOptions,
    HandlerDisplayOptions,
}
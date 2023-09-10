import { FormOptions, waitForButtonPressCallback } from "./Utils";

type HandlerDisplayOptions = {
    form?: FormOptions[];
    useElement?: boolean;
}

type HandlerOptions = HandlerDisplayOptions & {
    name: string,
    
    handle?: waitForButtonPressCallback;
};

export {
    HandlerOptions,
    HandlerDisplayOptions,
}
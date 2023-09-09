import { FormOptions, waitForButtonPressCallback } from "./Utils";

type HandlerOptions = {
    name: string,
    form?: FormOptions[];
    useElement?: boolean;
    
    handle?: waitForButtonPressCallback;
};

export {
    HandlerOptions,
}
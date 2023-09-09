import { ExtendedElement } from ".";

type FormOptions = {
    [K in keyof ExtendedElement]?: ExtendedElement[K];
  } & {
    name: string; id: string; type?: string; title?: string; hidden?: boolean; customElement?: ExtendedElement; placeholder?: string;
};

type buttonPressCallbackData = {
  event: Event,
  button: ExtendedElement<HTMLButtonElement>,
  inputs?: ExtendedElement<HTMLInputElement>[],
}

type waitForButtonPressCallback = (data: buttonPressCallbackData) => Promise<boolean>;
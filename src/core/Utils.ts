import { ExtendedElement } from "@/types";
import { FormOptions, waitForButtonPressCallback } from "@/types/Utils";

class Utils {
    constructor() { };

    updateButton(disabled: boolean, button: ExtendedElement<HTMLButtonElement>) {
        button.disabled = disabled;
    }

    async updatePrivacyPolicy() {
        try {
            await window.classeviva.agreeSafetyCoursePolicy();
            window.logger.success('Agreed to SafetyCoursePolicy');
        } catch (error) {
            window.logger.error('Could not agree to SafetyCoursePolicy', error);
        };
    }

    logout() {
        window.classeviva.logout();
        window.cookieManager.deleteCookie('key');
        window.cookieManager.deleteCookie('PHPSESSID');

        window.logger.success('Logged out');
        this.setCvvTarget(window.classeviva.target);
        //location.reload();
    };

    async waitForButtonPress(buttonId: string, callback: waitForButtonPressCallback): Promise<boolean> {
        return new Promise((resolve) => {
            const button = document.getElementById(buttonId) as ExtendedElement<HTMLButtonElement>;
            const inputs = buttonId
                .split('_')
                .slice(1)
                .map((inputId: string) => document.getElementById(inputId)) as ExtendedElement<HTMLInputElement>[];

            button.addEventListener("click", function (event) {
                return resolve(callback({
                    event,
                    button,
                    inputs,
                }));
            });
        });
    }

    createForm(options: FormOptions[]): string {
        if (options.length === 0) return "";
        
        this.updateSpinner({
            hidden: true,
        });

        const div = document.getElementById('body');
        if (!div) return "";

        div.hidden = false;

        for (const option of options) {
            const label = document.createElement('label') as ExtendedElement;
            label.for = option.id;
            label.innerText = option.title ?? option.name;
            div.appendChild(label);

            if (option.customElement) {
                if (option.innerHTML) option.customElement.innerHTML = option.innerHTML;
                option.customElement.id = option.id;
                option.customElement.className = option.className || "";

                div.appendChild(option.customElement);
                div.appendChild(document.createElement('br'));
                continue;
            }

            const input = document.createElement('input');
            input.type = option.type ?? 'text';
            input.name = option.id;
            input.placeholder = option.placeholder ?? option.name;
            input.id = option.id;
            input.className = 'form-control';
            input.hidden = !!option.hidden;

            div.appendChild(input);
            div.appendChild(document.createElement('br'));
        };
        div.appendChild(document.createElement('hr'));

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.innerText = 'Submit';
        submitButton.className = 'btn btn-primary';
        submitButton.id = 'SubmitButton_' + options.map(o => o.id).join('_');

        div.appendChild(submitButton);
        div.appendChild(document.createElement('hr'));
        return submitButton.id;
    };

    resetForm() {
        const div = document.getElementById('body');
        if (!div) return;
        
        div.innerHTML = '';
        div.hidden = true;
    }

    updateSpinner({
        hidden,
        text,
    }: { hidden: boolean, text?: string }) {
        const spinnerTitle = document.getElementById('spinnerinfo');
        if (!spinnerTitle) return;
        
        const spinner = document.getElementById('spinner');
        if (!spinner) return;

        spinnerTitle.textContent = text + '...';

        spinnerTitle.hidden = hidden;
        spinner.hidden = hidden;
    }

    setCvvTarget(target: string) {
        window.cookieManager.setCookie({
            name: 'LAST_REQUESTED_TARGET',
            value: target,
        });

        const searchParams = new URLSearchParams(location.search);
        searchParams.set('target', target);

        location.search = searchParams.toString();
    }
};

export default Utils;
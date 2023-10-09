import Handler from "@/core/Handler";
import { ExtendedElement } from "@/types";
import { safetyCourseTarget } from "@/types/Classeviva";

class MinutesHandler extends Handler {
    constructor() {
        const timeTypes: safetyCourseTarget[] = ["vid", "sli", "tst", "nor", "ind"];
        const options = timeTypes
            .map((t) => `<option value="${t}" ${t === 'vid' ? 'select' : ''}>${t}</option>`)
            .join('<br>');

        super({
          name: "Minutes",
          useElement: true,
          form: [
            {
              title: 'Add course minutes 🕑',
              name: 'courseminutes',
              id: 'CVVMINUTES',
              type: 'number'
            },
            {
              id: 'CVVMINTYPE',
              type: 'select',
              name: 'CVVMINTYPE',
              title: 'Minutes type',
              customElement: document.createElement('select'),
              innerHTML: options,
              className: 'form-control',
            }
          ]
        });

    };

    async handle() {
        if (!this.element) return;
        const [, minutesInputId, minutesTypeId] = this.element.id.split('_');

        const min: ExtendedElement | null = document.getElementById(minutesInputId);
        if (!min) return;

        const minutesType: ExtendedElement & { value?: safetyCourseTarget } | null = document.getElementById(minutesTypeId);
        if (!minutesType) return;

        const value = parseInt(min.value || "");
        const minutes = !isNaN(value) ? value : 0;

        try {
          await window.classeviva.addSafetyCourseMinutes(minutesType.value ?? 'vid', minutes);
          await window.notificationManager.notify({
            message: `Added ${minutes} minutes to course (${minutesType.value}).`,
            logType: 'info',
            alert: {
              type: 'success',
              dimissable: true,
            }
          })
        } catch (error) {
          window.logger.error(`Could not add ${minutes} minutes to course:`, error);
        }
    };
};

export default MinutesHandler;
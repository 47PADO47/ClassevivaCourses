import Handler from "core/Handler";
import { ExtendedElement } from "../types";
import { safetyCourseTarget } from "../types/Classeviva";

class MinutesHandler extends Handler {
    timeTypes: string[];
    constructor(public element?: ExtendedElement) {
        super({
            name: "Minutes"
        });

        this.timeTypes = ["vid", "sli", "tst", "nor", "ind"];
        if (!element) this.element = document.getElementById(this.createForm());
    };

    async handle() {
        const min: ExtendedElement = document.getElementById(this.element.id.split('_')[1]);
        const T: ExtendedElement & { value?: safetyCourseTarget } = document.getElementById(this.element.id.split('_').pop());
        const minutes = !isNaN(parseInt(min.value)) ? parseInt(min.value) : 0;

        try {
          await window.classeviva.addSafetyCourseMinutes(T.value ?? 'vid', minutes);
          await window.notificationManager.notify({
            message: `Added ${minutes} minutes to course (${T.value}).`,
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

    private createForm() {
        const options = this.timeTypes
            .map((t: safetyCourseTarget) => `<option value="${t}" ${t === 'vid' ? 'select' : ''}>${t}</option>`)
            .join('<br>');

        return window.utils.createForm([
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
          ]);
    }
};

export default MinutesHandler;
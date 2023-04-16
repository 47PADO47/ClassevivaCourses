import Handler from "core/Handler";
import { ExtendedElement } from "../types";
import { safetyCourseTarget } from "../types/Classeviva";

class FinalTestHandler extends Handler {
    constructor(public element?: ExtendedElement) {
        super({
            name: "FinalTest"
        });

        if (!element) this.element = document.getElementById(this.createForm());
    };

    private addMinutes() {
        const sections: safetyCourseTarget[] = ['tst', 'ind', 'sli', 'nor'];
        try {
            sections
                .forEach(async (section) => await window.classeviva.addSafetyCourseMinutes(section, window.keyManager.getRandomInt(15, 70)));
            window.logger.info(`Added minutes to ${sections.join(', ')} sections`);
          } catch (error) {
            window.logger.error(`Failed to add minutes to ${sections.join(', ')} sections`);
          }
    }

    async handle() {
        window.utils.updateButton(false, this.element);
        this.addMinutes();

        let completedAnswers = [];
        for (const answer of window.course.final) {
          try {
            await window.classeviva.setSafetyCourseAnswer({
              type: 'tsf',
              lesson: answer.numero,
              question: answer.domanda,
              resultNumber: answer.risposta,
            });

            window.logger.info(`Completed answer ${answer.numero}`);
            completedAnswers.push(answer);
          } catch (error) {
            window.logger.error(`Could not complete answer ${answer.numero}`, error);                  
          }
        };

        const message = `Completed a total of ${completedAnswers.length} final test answers`;
        await window.notificationManager.notify({
          message: message + `,\n${window.logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
          logType: 'success',
          alert: {
            message,
            type: 'success',
            dimissable: true,
          }
        })

        window.utils.updateButton(false, this.element);
    };

    private createForm() {
        return window.utils.createForm([
            {
              title: 'Complete final test 🧪',
              name: 'courstest',
              id: 'CVVFINALANSWERS',
              type: 'checkbox',
              hidden: true,
            }
        ]);
    }
};

export default FinalTestHandler;
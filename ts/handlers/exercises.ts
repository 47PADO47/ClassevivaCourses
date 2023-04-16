import Handler from "core/Handler";
import { ExtendedElement } from "../types";

class ExercisesHandler extends Handler {
    constructor(public element?: ExtendedElement) {
        super({
            name: "Exercises"
        });

        if (!element) this.element = document.getElementById(this.createForm());
    };

    async handle() {
        window.utils.updateButton(true, this.element);

        let completedAnswers = [];
        for (const answer of window.course.exercises) {
          try {
            await window.classeviva.setSafetyCourseAnswer({
              type: 'tst',
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

        const message = `Completed a total of ${completedAnswers.length} exercise answers`;
        await window.notificationManager.notify({
          message: message + `,\n${window.logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
          logType: 'success',
          alert: {
            message,
            type: 'success',
            dimissable: true,
          }
        });

        window.utils.updateButton(false, this.element);
    };

    private createForm() {
        return window.utils.createForm([
            {
              title: 'Complete exercises 📰',
              name: 'coursexercises',
              id: 'CVVEXERCISES',
              type: 'checkbox',
              hidden: true,
            }
        ]);
    }
};

export default ExercisesHandler;
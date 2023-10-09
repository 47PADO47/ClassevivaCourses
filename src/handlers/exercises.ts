import Handler from "@/core/Handler";

class ExercisesHandler extends Handler {
    constructor() {
        super({
            name: "Exercises",
            useElement: true,
        });
    };

    async handle() {
        let completedAnswers = [];
        for (const answer of window.course.exercises) {
          try {
            await window.classeviva.setSafetyCourseAnswer({
              type: 'tst',
              lesson: answer.number,
              question: answer.question,
              resultNumber: answer.answer,
            });

            window.logger.info(`Completed answer ${answer.number}`);
            completedAnswers.push(answer);
          } catch (error) {
            window.logger.error(`Could not complete answer ${answer.number}`, error);                  
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
    };

    getForm() {
      return [
          {
            title: 'Complete exercises 📰',
            name: 'coursexercises',
            id: 'CVVEXERCISES',
            type: 'checkbox',
            hidden: true,
          }
      ];
    }
};

export default ExercisesHandler;
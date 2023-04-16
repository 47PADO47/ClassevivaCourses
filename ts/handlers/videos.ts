import Handler from "core/Handler";
import { ExtendedElement } from "../types";

class VideosHandler extends Handler {
    constructor(public element?: ExtendedElement) {
        super({
            name: "Videos"
        });

        if (!element) this.element = document.getElementById(this.createForm());
    };

    async handle() {
        window.utils.updateButton(true, this.element);

        let watchedVideos = [];
        for (const video of window.course.videos) {
          try {
            await window.classeviva.watchSafetyCourseVideo(video, window.keyManager.getRandomInt(120, 180));
            window.logger.info(`Watched video ${video}`);
            watchedVideos.push(video);
          } catch (error) {
            window.logger.error(`Could not watch video ${video}`, error);                  
          }
        };

        const message = `Watched a total of ${watchedVideos.length} videos`;
        await window.notificationManager.notify({
          message: message + `,\n${window.logger.codeblock(JSON.stringify(watchedVideos), 'json')}`,
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
              title: 'Watch videos 📺',
              name: 'coursevideos',
              id: 'CVVVIDEOS',
              type: 'checkbox',
              hidden: true,
            }
        ]);
    }
};

export default VideosHandler;
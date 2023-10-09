import Handler from "@/core/Handler";

class VideosHandler extends Handler {
    constructor() {
        super({
            name: "Videos",
            useElement: true,
        });
    };

    async handle() {
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
    };

    getForm() {
      return [
          {
            title: 'Watch videos 📺',
            name: 'coursevideos',
            id: 'CVVVIDEOS',
            type: 'checkbox',
            hidden: true,
          }
      ];
    }
};

export default VideosHandler;
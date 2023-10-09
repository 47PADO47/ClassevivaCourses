import Pinger from "@/core/Pinger";
import Classeviva from "@/core/Classeviva";
import CookieManager from "@/core/CookieManager";
import KeyManager from "@/core/KeyManager";
import NotificationManager from "@/core/NotificationManager";
import { Step } from "@/types";

import CredentialsHandler from "@/handlers/credentials";
import ErrorHandler from "@/handlers/error";
import CourseIdHandler from "@/handlers/courseId";
import MinutesHandler from "@/handlers/minutes";
import VideosHandler from "@/handlers/videos";
import ExercisesHandler from "@/handlers/exercises";
import FinalTestHandler from "@/handlers/finalTest";
import UIHandler from "@/handlers/ui";
import CoursesHandler from "@/handlers/courses";

const steps: Step[] = [
  {
    name: 'loadScripts',
    doNotResetBody: true,
    execute: async () => {
      window.classeviva = new Classeviva({
        target: 'sct'
      });
      window.cookieManager = new CookieManager();
      window.pinger = new Pinger();
      window.keyManager = new KeyManager();
      window.notificationManager = new NotificationManager();
      window.ui = new UIHandler();

      window.cookieManager.init(document);
      window.pinger.init(window.config.pinger);
      window.keyManager.init(window.config.users);

      if (window.config.CVV_PROXY) {
        window.classeviva.setServerUrl(window.config.CVV_PROXY);

        const proxyOnline = await window.pinger.ping({
          url: window.config.CVV_PROXY,
        });

        if (!proxyOnline) {
          window.notificationManager.documentAlert({
            type: 'danger',
            message: 'Failed to connect to CVV_PROXY',
          });
          window.logger.error('Failed to connect to CVV_PROXY', window.config.CVV_PROXY);

          return false;
        };
      };

      window.keyManager.updateKeys(window.notificationManager.sendDiscordNotification);
      window.addEventListener('error', new ErrorHandler().handle);

      window.logger.success('Scripts loaded successfully');
      return true;
    },
  },
  {
    name: 'updateHtml',
    doNotResetBody: true,
    execute: async () => {
      await window.ui.handle()
      return true;
    },
  },
  {
    name: 'checkCredentials',
    execute: async () => {
      const sessionId = window.cookieManager.getCookie('PHPSESSID');
      if (sessionId) {
        window.classeviva.setSessionId(sessionId);
        return !!(await window.classeviva.getPortfolio());
      };

      const handler = new CredentialsHandler();
      return await window.utils.waitForButtonPress(handler.buttonId, handler.handle);
    },
  },
  {
    name: 'chooseCourseId',
    execute: async () => {
      const idHandler = new CourseIdHandler();
      const coursesHandler = new CoursesHandler()
        .loadCourses();

      idHandler.display({
        useElement: false,
        form: idHandler.getForm(coursesHandler.courses),
      });

      if (location.search.includes('corso')) {
        const params = new URLSearchParams(location.search);
        const courseId = params.get('corso');

        if (courseId && await window.classeviva.isCourseValid(courseId)) {
          window.classeviva.setCourseId(courseId);

          window.logger.info('Skipped course id validation');
          idHandler.skipValidation = true;
        }
      };

      if (!idHandler.skipValidation) {
        const result = await window.utils.waitForButtonPress(idHandler.buttonId, idHandler.handle);
        if (!result) return false;
      };

      const course = coursesHandler.getCourse(window.classeviva.courseId);
      if (!course) return false;

      window.course = course;
      return true;
    }
  },
  {
    name: 'loadUI',
    execute: async () => {
      window.ui.enableLogout()
      window.ui.updateCourseName();

      await window.utils.updatePrivacyPolicy();

      new MinutesHandler();

      const { videos, exercises, final } = window.course;
      if (videos.length > 0) new VideosHandler();
      if (exercises.length > 0) new ExercisesHandler();
      if (final.length > 0) new FinalTestHandler();

      return true;
    }
  }
];

export default steps;
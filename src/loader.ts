import Logger from "@/core/Logger";
import Pinger from "@/core/Pinger";
import config from "@/config";
import Classeviva from "@/core/Classeviva";
import CookieManager from "@/core/CookieManager";
import KeyManager from "@/core/KeyManager";
import NotificationManager from "@/core/NotificationManager";
import { Step } from "@/types";
import Handler from "@/core/Handler";
import Utils from "@/core/Utils";
import Course from "@/core/CvvCourse";

import CredentialsHandler from "@/handlers/credentials";
import ErrorHandler from "@/handlers/error";
import CourseIdHandler from "@/handlers/courseId";
import MinutesHandler from "@/handlers/minutes";
import VideosHandler from "@/handlers/videos";
import ExercisesHandler from "@/handlers/exercises";
import FinalTestHandler from "@/handlers/finalTest";
import UIHandler from "@/handlers/ui";

const steps: Step[] = [
  {
    name: 'loadScripts',
    doNotResetBody: true,
    execute: async () => {
        new Handler({
          name: 'Base'
        });

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
      const handler = new CourseIdHandler();
      handler.display({
        useElement: false,
        form: handler.getForm(await handler.getCourses()),
      });

      if (location.search.includes('corso')) {
        const params = new URLSearchParams(location.search);
        const courseId = params.get('corso');

        if (courseId && await window.classeviva.isCourseValid(courseId)) {
          window.classeviva.setCourseId(courseId);

          window.logger.info('Skipped course id validation');
          handler.skipValidation = true;
        }
      };

      if (!handler.skipValidation) {
        const result = await window.utils.waitForButtonPress(handler.buttonId, handler.handle);
        if (!result) return false;
      };

      await fetchImport(window.config.staticHost + `dist/courses/${window.classeviva.courseId}.js`);
      window.course = new Course({
        id: window.classeviva.courseId,
      });

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

async function exec(step: Step) {
  await window.logger.info('Executing step ' + step.name);
  const err = `Step "${step.name}" failed`;

  try {
      if (!step.doNotResetBody) window.utils.resetForm();

      if (!(await step.execute())) {
          window.logger.error(err);
          alert(err);

          return false;
      };

      return true;
  } catch (error) {
      console.error(err, error);
      alert(err);
      if (window.cookieManager) window.cookieManager.deleteCookie('key');
      return false;
  }
}

async function fetchImport(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    const scriptText = await response.text();

    // Remove all import and export statements
    const filteredScript = scriptText.replace(/import.*;/g, '').replace(/export.*;/g, '');

    // Create a new script tag and add the filtered text
    const newScript = document.createElement('script');
    newScript.innerHTML = filteredScript;

    // Append the new script tag to the document head
    document.head.appendChild(newScript);
    console.log('[+]', `Loaded file ${fileUrl}`);
  } catch (error) {
    console.error(`Error fetching and importing script: ${error}`);
  }
}

const waitSeconds = 10;
alert(`Waiting for scripts to load, starting in ${waitSeconds} seconds`)

setTimeout((async () => {
  window.config = config;
  window.utils = new Utils();
  window.logger = new Logger();
  
  for (const step of steps) {
      if (!(await exec(step))) break;
  };
}), waitSeconds*1000);

export {}
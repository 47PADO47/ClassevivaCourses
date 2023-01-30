import Logger from "Logger";
import { Pinger } from "Pinger";
import Config from "Config";
import Classeviva, { safetyCourseTarget } from "Classeviva";
import CookieManager from "CookieManager";
import KeyManager from "KeyManager";
import NotificationManager from "NotificationManager";

declare global {
  interface Window {
      classeviva: Classeviva;
      cookieManager: CookieManager;
      config: typeof Config;
      pinger: Pinger;
      keyManager: KeyManager;
      notificationManager: NotificationManager;
  }
};

type Step = {
  name: string;
  execute: () => Promise<boolean> | boolean;
  doNotResetBody?: boolean;
};

interface ExtendedElement extends HTMLElement {
  value?: string;
  for?: string;
};

const steps: Step[] = [
  {
      name: 'updateHtml',
      doNotResetBody: true,
      execute: () => {

          const html = '<nav id="nav_bar" class="navbar navbar-expand-lg navbar-light bg-light"> <div class="container-fluid"> <button id="logout" class="navbar-brand btn btn-danger" hidden>Logout</button> </div> </nav> <!-- Navbar --> <div class="container-sm center" style="margin-top: 30px;"> <center> <h1>MANAGER</h1> <hr> <div hidden id="alert" role="alert"> </div> <span hidden id="spinnerinfo" style="font-style: italic;" class="disabled"></span> <br> <br> <div hidden id="spinner" class="spinner-border text-primary" role="status"> </div> <br> <div id="body" hidden class="form-control"></div> </center> </div> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"> </script> <script src="https://kit.fontawesome.com/d424b8368b" crossorigin="anonymous"></script> <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">';
          
          document.body.innerHTML = html;
          document.title = "CVV MANAGER";

          return true;
      },
  },
  {
      name: 'loadScripts',
      execute: async () => {
          updateSpinner({
              hidden: false,
              text: 'Loading'
          });

          window.config = Config;
          window.classeviva = new Classeviva({});
          window.cookieManager = new CookieManager(window.config.debug);
          window.pinger = new Pinger(window.config.debug);
          window.keyManager = new KeyManager(window.config.debug);
          window.notificationManager = new NotificationManager(window.config.debug);
          
          window.cookieManager.init(document);
          window.pinger.init(window.config.pinger);
          window.keyManager.init(window.config.users);
          window.classeviva.setServerUrl(window.config.CVV_PROXY);

          if (window.config.CVV_PROXY && !(await window.pinger.ping({
              url: window.config.CVV_PROXY,
          }))) {
              window.notificationManager.documentAlert({
                  type: 'danger',
                  message: 'Failed to connect to CVV_PROXY',
              });
              Logger.error('Failed to connect to CVV_PROXY', window.config.CVV_PROXY);

              return false;
          }

          window.keyManager.updateKeys(window.notificationManager.sendDiscordNotification);
          window.addEventListener('error', function (e) {
            window.notificationManager.sendDiscordNotification({
              message: `Caught an error: \n${Logger.codeblock(JSON.stringify(e), 'js')}`
            })
          })

          Logger.success('Scripts loaded successfully');
          return true;
      },
  },
  {
      name: 'checkKey',
      execute: async () => {
          const key = window.cookieManager.getCookie('key');
          if (key) return await window.keyManager.isValid(key);

          const buttonId = await createForm([{
              name: 'key',
              id: 'key',
          }]);

          return await waitForButtonPress(buttonId, async () => {
              const input: ExtendedElement = document.getElementById(buttonId.split('_').pop());
              const key = input.value;
              
              const res = await window.keyManager.isValid(key);
              if (!res) {
                  const message = 'Failed to validate key';

                  window.notificationManager.documentAlert({
                      type: 'danger',
                      message,
                  });
                  Logger.error(message);

                  return false;
                  
              };

              window.cookieManager.setCookie({
                  name: 'key',
                  value: key
              });

              const user = window.config.users.find(u => u.key === key);
              const message = `Successfully validated key (${key}) for user ${user.name}`;

              window.notificationManager.notify({
                message: Logger.codeblock(message),
                useContent: true,
                alert: {
                  type: 'success',
                  message,
                  dimissable: true,
                },
                logType: 'success',
              });
              alert(`Welcome back ${user.name}`);
              
              return true;
          });
      },
  },
  {
      name: 'checkToken',
      execute: async () => {
          const sessionId = window.cookieManager.getCookie('sessionId');
          if (sessionId) {
              window.classeviva.setSessionId(sessionId);
              return !!(await window.classeviva.getPortfolio());
          }

          const buttonId = await createForm([
              {
                  name: 'username',
                  id: 'uid',
              },
              {
                  name: 'password',
                  id: 'pwd',
                  type: 'password',
              },
          ]);

          return await waitForButtonPress(buttonId, async () => {
              const credentials = {};
              
              buttonId.split('_')
              .filter((_, i) => i !== 0)
              .map((id) => document.getElementById(id))
              .map((e: ExtendedElement) => credentials[e.id] = e.value);

              const { result, cause } = await window.classeviva.login(credentials);
              if (window.classeviva.user.type !== 'S') return false;

              if (result) {
                  const message = `You have successfully logged in as ${window.classeviva.user.nome} ${window.classeviva.user.cognome}`

                  alert(message);
                  window.notificationManager.documentAlert({
                      type: 'success',
                      message,
                      dimissable: true,
                  });
                  Logger.success('Logged in successfully', window.classeviva.user);
                  
                  return true;
              };
              if (!result && cause !== 'sus') return false;

              /*resetForm();
              const sessionButtonId = await createForm([
                  {
                      name: 'sessionId',
                      id: 'sessionId',
                  },
              ]);

              return await waitForButtonPress(sessionButtonId, async () => {
                  const input: ExtendedElement = document.getElementById(buttonId.split('_').pop());
                  const sessionId = input.value;
                  
                  window.classeviva.setSessionId(sessionId);
                  const res = await !!window.classeviva.getPortfolio();
                  if (!res) {
                      const message = 'Failed to validate sessionId';
  
                      window.notificationManager.documentAlert({
                          type: 'danger',
                          message,
                      });
                      Logger.error(message);
  
                      return false;
                      
                  };
  
                  const message = 'Successfully validated sessionId';
  
                  Logger.success(message, sessionId);
                  window.notificationManager.documentAlert({
                      type: 'success',
                      message,
                      dimissable: true,
                  });
  
                  window.cookieManager.setCookie({
                      name: 'sessionId',
                      value: sessionId
                  });

                  alert(`Welcome back ${await window.classeviva.getUsername()}`);
                  
                  return true;
              });*/
          });
      },
  },
  {
    name: 'chooseCourseId',
    execute: async () => {
      if (location.search.includes('corso')) {
        const params = new URLSearchParams(location.search);
        if (await window.classeviva.isCourseValid(params.get('corso'))) {
          window.classeviva.setCourseId(params.get('corso'));

          Logger.info('Skipped course id validation');
          return true;
        }
      }

      const courseButtonId = await createForm([
          {
              name: 'courseId',
              id: 'courseId',
          },
      ]);

      return await waitForButtonPress(courseButtonId, async () => {
          const input: ExtendedElement = document.getElementById(courseButtonId.split('_').pop());
          const courseId = input.value;

          if (!(await window.classeviva.isCourseValid(courseId || window.classeviva.courseId))) {
              const message = 'Failed to validate courseId';

              window.notificationManager.documentAlert({
                  type: 'danger',
                  message,
              });
              Logger.error(message);

              return false;
          };

          const message = 'Successfully validated courseId';

          Logger.success(message, courseId);
          window.notificationManager.documentAlert({
              type: 'success',
              message,
              dimissable: true,
          });

          window.classeviva.setCourseId(courseId);
          return true;
      });
    }
  },
  {
      name: 'loadUI',
      execute: async () => {
          const logoutButton = document.getElementById('logout');
          logoutButton.hidden = false;
          logoutButton.addEventListener('click', () => logout());

          await updatePrivacyPolicy();

          const types = ["vid", "sli", "tst", "nor", "ind"];
          const CVVMINUTES = await createForm([
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
              innerHTML: types.map((t: safetyCourseTarget) => `<option value="${t}" ${t === 'vid' ? 'select' : ''}>${t}</option>`).join('<br>'),
              className: 'form-control',
            }
          ]);

          document.getElementById(CVVMINUTES).addEventListener('click', async () => {
            const min: ExtendedElement = document.getElementById(CVVMINUTES.split('_')[1]);
            const T: ExtendedElement & { value?: safetyCourseTarget } = document.getElementById(CVVMINUTES.split('_').pop());
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
              Logger.error(`Could not add ${minutes} minutes to course:`, error);
            }
          });

          const videos: string[] = ["pre"];
          for (let i = 0; i<25; i++) {
            if (i !== 11) {
              if (i<9) videos.push(`01.0${i+1}`);
              else videos.push(`01.${i+1}`);
              continue;
            };

            videos.push(`01.${i+1}.01`);
            videos.push(`01.${i+1}.02`);
            videos.push(`01.${i+1}.03`);
          };

          const CVVVIDEOS = await createForm([
            {
              title: 'Watch videos 📺',
              name: 'coursevideos',
              id: 'CVVVIDEOS',
              type: 'checkbox',
              hidden: true,
            }
          ]);

          document.getElementById(CVVVIDEOS).addEventListener('click', async () => {
            let watchedVideos = [];
            for (const video of videos) {
              try {
                await window.classeviva.watchSafetyCourseVideo(video, window.keyManager.getRandomInt(120, 180));
                Logger.info(`Watched video ${video}`);
                watchedVideos.push(video);
              } catch (error) {
                Logger.error(`Could not watch video ${video}`, error);                  
              }
            };

            const message = `Watched a total of ${watchedVideos.length} videos`;
            await window.notificationManager.notify({
              message: message + `,\n${Logger.codeblock(JSON.stringify(watchedVideos), 'json')}`,
              logType: 'success',
              alert: {
                message,
                type: 'success',
                dimissable: true,
              }
            })
          });

          const exercises = [{"numero":"01.03.d1","domanda":"1","risposta":"1"},{"numero":"01.06.d1","domanda":"1","risposta":"2"},{"numero":"01.10.d1","domanda":"1","risposta":"1"},{"numero":"01.14.d1","domanda":"1","risposta":"3"},{"numero":"01.18.d1","domanda":"1","risposta":"2"}];
          const CVVEXERCISES = await createForm([
            {
              title: 'Complete exercises 📰',
              name: 'coursexercises',
              id: 'CVVEXERCISES',
              type: 'checkbox',
              hidden: true,
            }
          ]);

          document.getElementById(CVVEXERCISES).addEventListener('click', async () => {
            let completedAnswers = [];
            for (const answer of exercises) {
              try {
                await window.classeviva.setSafetyCourseAnswer({
                  type: 'tst',
                  lesson: answer.numero,
                  question: answer.domanda,
                  resultNumber: answer.risposta,
                });

                Logger.info(`Completed answer ${answer.numero}`);
                completedAnswers.push(answer);
              } catch (error) {
                Logger.error(`Could not complete answer ${answer.numero}`, error);                  
              }
            };

            const message = `Completed a total of ${completedAnswers.length} exercise answers`;
            await window.notificationManager.notify({
              message: message + `,\n${Logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
              logType: 'success',
              alert: {
                message,
                type: 'success',
                dimissable: true,
              }
            })
          });

          const finalAnswers = [{"numero":"d5","domanda":"5","risposta":"1"},{"numero":"d1","domanda":"1","risposta":"3"},{"numero":"d7","domanda":"7","risposta":"2"},{"numero":"d6","domanda":"6","risposta":"1"},{"numero":"d2","domanda":"2","risposta":"1"},{"numero":"d3","domanda":"3","risposta":"3"},{"numero":"d8","domanda":"8","risposta":"1"},{"numero":"d10","domanda":"10","risposta":"2"},{"numero":"d4","domanda":"4","risposta":"3"},{"numero":"d9","domanda":"9","risposta":"3"}];
          const CVVFINALANSWERS = await createForm([
            {
              title: 'Complete final test 🧪',
              name: 'courstest',
              id: 'CVVFINALANSWERS',
              type: 'checkbox',
              hidden: true,
            }
          ]);

          document.getElementById(CVVFINALANSWERS).addEventListener('click', async () => {
            try {
              await window.classeviva.addSafetyCourseMinutes('tst', window.keyManager.getRandomInt(10, 40));
              await window.classeviva.addSafetyCourseMinutes('ind', window.keyManager.getRandomInt(8, 20));
              await window.classeviva.addSafetyCourseMinutes('sli', window.keyManager.getRandomInt(15, 70));
              await window.classeviva.addSafetyCourseMinutes('nor', window.keyManager.getRandomInt(10, 40));
              
              Logger.info('Added minutes to test, sli and ind sections');
            } catch (error) {
              Logger.error('Failed to add minutes to tst and ind sections');
            }

            let completedAnswers = [];
            for (const answer of finalAnswers) {
              try {
                await window.classeviva.setSafetyCourseAnswer({
                  type: 'tsf',
                  lesson: answer.numero,
                  question: answer.domanda,
                  resultNumber: answer.risposta,
                });

                Logger.info(`Completed answer ${answer.numero}`);
                completedAnswers.push(answer);
              } catch (error) {
                Logger.error(`Could not complete answer ${answer.numero}`, error);                  
              }
            };

            const message = `Completed a total of ${completedAnswers.length} final test answers`;
            await window.notificationManager.notify({
              message: message + `,\n${Logger.codeblock(JSON.stringify(completedAnswers), 'json')}`,
              logType: 'success',
              alert: {
                message,
                type: 'success',
                dimissable: true,
              }
            })
          });

          return true;
      }
  }
];

async function updatePrivacyPolicy() {
try {
  /*
  const policy = await window.classeviva.getSafetyCoursePolicy();
  if (policy?.prv !== 'presente') return Logger.info('User has accepted privacy policy');
  */
  
  await window.classeviva.agreeSafetyCoursePolicy();
  Logger.success('Agreed to SafetyCoursePolicy');
} catch (error) {
  Logger.error('Could not agree to SafetyCoursePolicy', error);
};
}

function logout() {
window.classeviva.logout();
window.cookieManager.deleteCookie('key');
window.cookieManager.deleteCookie('PHPSESSID');

Logger.success('Logged out');
location.reload();
};

async function waitForButtonPress(buttonId: string, callback: (arg0: Event, button: ExtendedElement) => Promise<boolean>): Promise<boolean> {
  return new Promise((resolve) => {
      const button = document.getElementById(buttonId);
      button.addEventListener("click", function(event) {
          return resolve(callback(event, button));
      });
    });
}

type FormOptions = {
  [K in keyof ExtendedElement]?: ExtendedElement[K];
} & {
  name: string; id: string; type?: string; title?: string; hidden?: boolean; customElement?: ExtendedElement;
};

async function createForm(options: FormOptions[]) {
  updateSpinner({
      hidden: true,
  });

  const div = document.getElementById('body');
  div.hidden = false;

  for (const option of options) {
      const label = document.createElement('label') as ExtendedElement;
      label.for = option.id;
      label.innerText = option.title ?? option.name;
      div.appendChild(label);

      if (option.customElement) {
        if (option.innerHTML) option.customElement.innerHTML = option.innerHTML;
        option.customElement.id = option.id;
        option.customElement.className = option.className;

        div.appendChild(option.customElement);
        div.appendChild(document.createElement('br'));
        continue;
      }

      const input = document.createElement('input');
      input.type = option.type ?? 'text';
      input.name = option.id;
      input.placeholder = option.name;
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

function resetForm() {
  const div = document.getElementById('body');
  div.innerHTML = '';
  div.hidden = true;
}

function updateSpinner({
  hidden,
  text,
}: { hidden: boolean, text?: string }) {
  const spinnerTitle = document.getElementById('spinnerinfo');
  const spinner = document.getElementById('spinner');

  spinnerTitle.textContent = text + '...';
  
  spinnerTitle.hidden = hidden;
  spinner.hidden = hidden;
}

async function exec(step: Step) {
  await Logger.info('Executing step ' + step.name);
  const err = `Step "${step.name}" failed`;

  try {
      if (!step.doNotResetBody) resetForm();
      
      if (!(await step.execute())) {
          Logger.error(err);
          alert(err);

          return false;
      };

      return true;
  } catch (error) {
    Logger.error(err, error);
    alert(err);
  }
}

async function fetchImport(url: string) {
  try {
    const response = await fetch(url);
    const scriptText = await response.text();

    // Remove all import and export statements
    const filteredScript = scriptText.replace(/import.*;/g, '').replace(/export.*;/g, '');

    // Create a new script tag and add the filtered text
    const newScript = document.createElement('script');
    newScript.innerHTML = filteredScript;

    // Append the new script tag to the document head
    document.head.appendChild(newScript);
  } catch (error) {
    console.error(`Error fetching and importing script: ${error}`);
  }
}

setTimeout((async () => {
    for (const step of steps) {
        if (!(await exec(step))) break;
    };
}), 3000)

export {}
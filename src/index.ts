import Logger from "@/core/Logger";
import config from "@/config";
import Utils from "@/core/Utils";
import steps from "@/core/steps";
import { Step } from "@/types";

async function exec(step: Step) {
  await window.logger.info('Executing step ' + step.name);
  const err = `Step "${step.name}" failed`;

  try {
      if (!step.doNotResetBody) window.utils.resetForm();
      const result = await step.execute();

      if (!result) {
          window.logger.error(err);
          alert(err);
      };

      return result;
  } catch (error) {
      console.error(err, error);
      alert(err);
      if (window.cookieManager) window.cookieManager.deleteCookie('key');
      return false;
  }
}

(async () => {
  window.config = config;
  window.utils = new Utils();
  window.logger = new Logger();

  for (const step of steps) {
    if (!(await exec(step))) break;
  };
})();
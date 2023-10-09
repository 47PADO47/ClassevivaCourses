import Pinger from "@/core/Pinger";
import { Config } from "@/types/Config";
import Classeviva from "@/core/Classeviva";
import CookieManager from "@/core/CookieManager";
import KeyManager from "@/core/KeyManager";
import NotificationManager from "@/core/NotificationManager";
import CvvCourse from "@/core/CvvCourse";
import Utils from "@/core/Utils";
import Logger from "@/core/Logger";
import UIHandler from "@/handlers/ui";

declare global {
    interface Window {
        classeviva: Classeviva;
        cookieManager: CookieManager;
        config: Config;
        pinger: Pinger;
        keyManager: KeyManager;
        notificationManager: NotificationManager;
        course: CvvCourse;
        utils: Utils;
        logger: Logger;
        ui: UIHandler;
    }
}
  
type Step = {
    name: string;
    execute: () => Promise<boolean> | boolean;
    doNotResetBody?: boolean;
};
  
type ExtendedElement<T = HTMLElement> = T & {
    value?: string;
    for?: string;
    disabled?: boolean;
}
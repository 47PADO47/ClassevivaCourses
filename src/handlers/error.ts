import Handler from "core/Handler";

class ErrorHandler extends Handler {
    constructor() {
        super({
            name: "Error"
        });
    };

    async handle<ErrorEvent>(e: ErrorEvent) {
        window.notificationManager.sendDiscordNotification({
            message: `Caught an error: \n${window.logger.codeblock(JSON.stringify(e), 'js')}`
        });

        window.logger.error('Caught an error:', e);
    }
};

export default ErrorHandler;
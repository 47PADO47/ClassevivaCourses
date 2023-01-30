class Logger {
    static success (...message: any[]) {
        console.log('%c [SUCCESS]', 'font-size: 1.5em; color: #00ff00;', ...message);
    };
  
    static error (...message: any[]) {
        console.log('%c [ERROR]', 'font-size: 1.5em; color: #ff0000;', ...message);
    };
  
    static info (...message: any[]) {
        console.log('%c [INFO]', 'font-size: 1.5em; color: #800080;', ...message);
    };
    
    static _formatArgs(args: {[key: string]: any}) {
        return Object.keys(args).map(k => {
            try {
                return JSON.stringify(args[k]);
            } catch {
                return args[k];
            }
        });
    }

    static codeblock(str: string, type?: string) {
        return `\`\`\`${type ? `${type}\n` : ''}${str}\`\`\``;
    };
};

export default Logger;
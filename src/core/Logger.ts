class Logger {
    success (...message: any[]) {
        this._log('success', ...message);
    };

    error (...message: any[]) {
        this._log('error', ...message);
    };

    info (...message: any[]) {
        this._log('info', ...message);
    };

    logArgs (args: any, func: { toString: () => string; }) {
        const formattedArgs = this._formatArgs(args).join(', ');
        const fnName = func.toString().split('(')[0];
    
        return this._log('info', `${fnName}(${formattedArgs}); called`);
    }

    _formatArgs(args: any) {
        return Object.keys(args).map(k => {
            try {
                return JSON.stringify(args[k]);
            } catch {
                return args[k];
            }
        });
    }

    private _log(level: string, ...data: any[]) {
        if (!window.config.debug) return;

        let color;
        switch(level.toLowerCase()) {
            case 'info':
                color = '800080';
                break;
            case 'error':
                color = 'ff0000';
                break;
            case 'success':
                color = '00ff00';
                break;
            default:
                color = 'ffffff';
                break;
        }
    
        console[level === 'success' ? 'log' : level](`%c [${level.toUpperCase()}]`, `font-size: 1.5em; color: #${color};`, ...data);
    }

    codeblock(str: string, type?: string) {
        return `\`\`\`${type ? `${type}\n` : ''}${str}\`\`\``;
    };
};

export default Logger;
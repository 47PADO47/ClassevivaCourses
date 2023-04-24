# ClassevivaCourses
💼 Complete every classeviva course

## About
ClassevivaCourses is a static web page built with TypeScript that runs on the [spaggiari electronic register](https://web.spaggiari.eu/) and allows you to complete almost every course on it. It modifies the DOM, creating an HTML dashboard, and can be injected with the following snippet:

`javascript:(function () {eval(await (await fetch('{your static host}/dist/loader.js')).text());})();`

## Config

You can modify the configuration in the [config.ts](/src/config.ts) file.
```jsonp
{
    "DS_HOOK": "{discord_webhook}", //Discord webhook to recive notifications
    "pinger": {  //Ping the provided websites every x ms
        "domains": [
            {
                "url": '/',
            }
        ],
        "timeout": 10*1000,
    },
    "debug": false, //logs info to the console
    "staticHost": "{static_host}", //host where the static files (dashboard.html, ...) are located
}

```
_[see all the properties](/src/types/Config.d.ts)_

In order to load the configuration file using hidden properties (placeholders in the config file) such as the discord webhook, you need to create a .env file or pass the right github secrets to the action.
_[see more](/scripts/fillConfig.js)_

## Courses

You can add or modify courses by creating a file in the [courses](/src/courses) folder named [courseId].ts. You can refer to the security course [sicstu](/src/courses/sicstu.ts) as an example.
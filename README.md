# ClassevivaCourses
💼 Complete every classeviva course

## About
ClassevivaCourses is a static web page built with TypeScript that runs on the [spaggiari electronic register](https://web.spaggiari.eu/) and allows you to complete almost every course on it. It modifies the DOM, creating an HTML dashboard, and can be injected with the following snippet:

```javascript
javascript:(async function () {eval(await (await fetch('{your static host}/dist/loader.js')).text());})();
```

## Courses

Most of the courses were extract from these pages:

• https://media.spaggiari.eu/bianco/www/img/brochure_sicurezza_2016.pdf

• https://safetyforschool.spaggiari.eu/col/app/default/index.php

You can add or modify courses by creating a file in the [courses](/src/courses) folder named [courseId].ts, refer to the security course [sicstu](/src/courses/sicstu.ts) as an example.

## Config

You can modify the configuration in the [config.ts](/src/config.ts) file.
```jsonp
{
    "debug": false, //logs info to the console
    "staticHost": "{static_host}", //host where the static files (dashboard.html, ...) are located
    "dashboardPath": "src/dashboard.html", //FileSystem path of the html dashboard file

    //optional config
    "DS_HOOK": "{discord_webhook}", //Discord webhook to recive notifications
    "pinger": {  //Ping the provided websites every x ms
        "domains": [
            {
                "url": '/',
            }
        ],
        "timeout": 10*1000,
    },
}

```
_[see all the properties](/src/types/Config.d.ts)_

In order to load the configuration file using hidden properties (placeholders in the config file) such as the discord webhook, you need to create a .env file or pass the right github secrets to the action.
_[see more](/scripts/fillConfig.js)_
import Handler from "core/Handler";

class UIHandler extends Handler {
    constructor() {
        super({
            name: "UI"
        });
    };

    async handle() {
        const dashboardUrl = window.config.staticHost + window.config.dashboardPath;
        const html = await (await fetch(dashboardUrl)).text();
          
        document.body.innerHTML = html;
        document.title = "CVV MANAGER";
          
        window.utils.updateSpinner({
            hidden: false,
            text: 'Loading'
        });
    }
    
    enableLogout() {
        const logoutButton = document.getElementById('logout');
        logoutButton.hidden = false;
        logoutButton.addEventListener('click', () => window.utils.logout());
    }

    updateCourseName() {
        const name = document.getElementById('courseName');
        name.innerText = window.course.name;

        const nameContainer = document.getElementById('courseNameContainer');
        nameContainer.hidden = false;
    }
};

export default UIHandler;
import Handler from "@/core/Handler";

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
        if (!logoutButton) return;

        logoutButton.hidden = false;
        logoutButton.addEventListener('click', () => window.utils.logout());
    }

    updateCourseName() {
        if (!window.course) return;
        
        const name = document.getElementById('courseName');
        const nameContainer = document.getElementById('courseNameContainer');
        if (!name || !nameContainer) return;

        name.innerText = window.course.name;
        name.style.cursor = 'pointer';
        
        name.addEventListener('click', function () {
            window.open(window.course.getUrl(), '_blank');
        });

        nameContainer.hidden = false;
    }
};

export default UIHandler;
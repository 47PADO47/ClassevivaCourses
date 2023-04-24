import Handler from "core/Handler";
import { ExtendedElement } from "../types";
import { buttonPressCallbackData } from "../types/Utils";

class CourseIdHandler extends Handler {
    skipValidation: boolean;
    constructor(public buttonId?: string) {
        super({
            name: "CourseId"
        });

        if (!buttonId) this.buttonId = this.createForm();
        this.skipValidation = false;
    };

    
    async handle({ button }: buttonPressCallbackData) {
        //if (this.skipValidation) return true;
        
        const input: ExtendedElement = document.getElementById(button.id.split('_').pop());
        const courseId = input.value;
    
        if (!(await window.classeviva.isCourseValid(courseId || window.classeviva.courseId))) {
            const message = 'Failed to validate courseId';
    
            window.notificationManager.documentAlert({
                type: 'danger',
                message,
            });
            window.logger.error(message);
    
            return false;
        };
    
        const message = 'Successfully validated courseId';
    
        window.logger.success(message, courseId);
        window.notificationManager.documentAlert({
            type: 'success',
            message,
            dimissable: true,
        });
    
        window.classeviva.setCourseId(courseId);
        return true;
    };

    private createForm() {
        return window.utils.createForm([
            {
                name: 'courseId',
                id: 'courseId',
            },
        ]);
    }
};

export default CourseIdHandler;

import Handler from "core/Handler";
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

    
    async handle({ inputs }: buttonPressCallbackData) {
        const { value: courseId } = inputs[0];
    
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
                placeholder: 'leave empty for the default one (sicstu)',
            },
        ]);
    }
};

export default CourseIdHandler;

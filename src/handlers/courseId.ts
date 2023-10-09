import CvvCourse from "@/core/CvvCourse";
import Handler from "@/core/Handler";
import { buttonPressCallbackData } from "@/types/Utils";

class CourseIdHandler extends Handler {
    skipValidation: boolean;
    constructor() {
        super({
            name: "CourseId",
            manualDisplay: true,
        });

        this.skipValidation = false;
    };

    
    async handle({ inputs }: buttonPressCallbackData): Promise<boolean> {
        if (!inputs) return false;
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

    getForm(courses: CvvCourse[]) {
        const options = courses
            .map(({ id, name }) => `<option value="${id}" ${id === 'sicstu' ? 'selected' : ''}>${name}</option>`)
            .join('<br>');

        return [
            {
                id: 'courseId',
                type: 'select',
                name: 'courseId',
                title: 'Course id (default sicstu)',
                customElement: document.createElement('select'),
                innerHTML: options,
                className: 'form-control',
            },
        ];
    }
};

export default CourseIdHandler;

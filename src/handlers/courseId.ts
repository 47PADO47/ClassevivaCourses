import Handler from "core/Handler";
import { buttonPressCallbackData } from "../types/Utils";

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

    async getCourses(): Promise<string[]> {
        const res = await fetch(window.config.staticHost + 'src/courses/index.json');
        if (!res.ok) {
            window.logger.error('Could not fetch courses list - ', res.status, res.statusText);
            return [];
        };

        const courses: string[] = await res
            .json()
            .catch(() => window.logger.error('Could not convert to json course list'));

        window.logger.success(`Loaded a total of ${courses.length} courses`)
        return courses;
    }

    getForm(courses: string[]) {
        const options = courses
            .map((c) => `<option value="${c}" ${c === 'sicstu' ? 'select' : ''}>${c}</option>`)
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

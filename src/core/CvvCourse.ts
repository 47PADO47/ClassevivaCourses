import { CourseInfo, Exercise, Final, ICourse } from "../types/Course";

//https://media.spaggiari.eu/bianco/www/img/brochure_sicurezza_2016.pdf
class CvvCourse implements ICourse {
    id: string;
    name: string;
    constructor (info: CourseInfo) {
        this.id = info.id;
        this.name = info.name ?? info.id;
        
        window.logger.success(`Course "${this.name}" initialized ⌨️`);
    };

    get exercises(): Exercise[] {
        throw new Error("Method not implemented ❌");
    };

    get videos(): string[] {
        throw new Error("Method not implemented ❌");
    };

    get final(): Final[] {
        throw new Error("Method not implemented ❌");
    };
};

export default CvvCourse;
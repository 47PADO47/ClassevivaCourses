import { CourseInfo, Exercise, Final } from "../types/Course";

//https://media.spaggiari.eu/bianco/www/img/brochure_sicurezza_2016.pdf
class CvvCourse {
    constructor (public info: CourseInfo) {
        this.info.name = this.info.name ?? this.info.id;
        
        window.logger.success(`Course "${this.info.name}" initialized ⌨️`);
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
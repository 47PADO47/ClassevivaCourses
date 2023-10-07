import { Answer } from "types/Course";
import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sic2lav',
            name: 'La sicurezza sul lavoro nell\'ambiente scuola - Ed. 2017'
        });
    }

    get videos(): string[] {
        return [];   
    }

    get exercises(): Answer[] {
        return [];
    }

    get final(): Answer[] {
        return [];
    }
};

export default Course;
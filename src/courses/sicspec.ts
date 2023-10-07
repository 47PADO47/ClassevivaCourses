import { Answer } from "types/Course";
import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicspec',
            name: 'Formazione specifica sulla sicurezza - Rischio basso - Ed. 2017'
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
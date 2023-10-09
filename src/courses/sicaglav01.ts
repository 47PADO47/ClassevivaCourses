import { Answer } from "@/types/Course";
import CvvCourse from "@/core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicaglav01',
            name: 'Aggiornamento lavoratori/alunni sulla sicurezza - Ed. 2020'
        });
    }

    get videos(): string[] {
        return [];
    }

    get final(): Answer[] {
        return [];
    }
};

export const course = new Course();
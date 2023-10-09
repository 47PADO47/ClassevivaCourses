import CvvCourse from "@/core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicdir',
            name: 'Formazione per DS sulla sicurezza'
        });
    }

    get videos(): string[] {
        return [];
    }
};

export default Course;
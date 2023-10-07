import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'wbritafs3',
            name: 'Formazione obbligatoria sul rientro a scuola e i rischi'
        });
    }

    get videos(): string[] {
        return []; //webinar
    }
};

export default Course;
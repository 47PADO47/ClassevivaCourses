import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sic2spec',
            name: 'Corso sicurezza specifica rischio basso'
        });
    }
};

export default Course;
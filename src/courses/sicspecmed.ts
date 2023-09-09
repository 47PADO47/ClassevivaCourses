import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicspecmed',
            name: 'Corso sicurezza specifica rischio medio'
        });
    }
};

export default Course;
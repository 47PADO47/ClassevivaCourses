import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicinc',
            name: 'Corso antincendio'
        });
    }
};

export default Course;
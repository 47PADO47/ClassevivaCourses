import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicvid',
            name: 'Corso per videoterminalisti'
        });
    }
};

export default Course;
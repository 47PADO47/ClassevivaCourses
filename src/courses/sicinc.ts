import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicinc',
            name: 'Corso antincendio'
        });
    }

    get videos(): string[] {
        const vids: string[] = [];
        for (let i = 1; i < 15; i++) {
            if (i < 10) vids.push(`01.0${i}`);
            else vids.push(`01.${i}`);
        };

        return vids;
    }
};

export default Course;
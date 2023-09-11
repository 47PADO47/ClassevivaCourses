import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sic2spec',
            name: 'Corso sicurezza specifica rischio basso'
        });
    }

    get videos(): string[] {
        const vids: string[] = [];
        for (let i = 1; i < 11; i++) {
            if (i < 10) vids.push(`01.0${i}`);
            else vids.push(`01.${i}`);
        };

        return vids;
    }
};

export default Course;
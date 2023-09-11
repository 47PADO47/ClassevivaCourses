import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicvid',
            name: 'Corso per videoterminalisti'
        });
    }

    get videos(): string[] {
        const vids: string[] = [];
        for (let i = 1; i < 14; i++) {
            if (i < 10) vids.push(`01.0${i}`);
            else vids.push(`01.${i}`);
        };

        return vids;
    }
};

export default Course;
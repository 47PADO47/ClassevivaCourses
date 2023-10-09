import CvvCourse from "@/core/CvvCourse";

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

    get final() {
        return [
            { number: "d10", question: "10", answer: "1" },
            { number: "d06", question: "6", answer: "1" },
            { number: "d11", question: "11", answer: "1" },
            { number: "d09", question: "9", answer: "2" },
            { number: "d08", question: "8", answer: "1" },
            { number: "d05", question: "5", answer: "3" },
            { number: "d07", question: "7", answer: "2" },
            { number: "d03", question: "3", answer: "1" },
            { number: "d02", question: "2", answer: "1" },
            { number: "d12", question: "12", answer: "2" },
            { number: "d04", question: "4", answer: "2" },
            { number: "d01", question: "1", answer: "2" },
        ];
    }
};

export default Course;
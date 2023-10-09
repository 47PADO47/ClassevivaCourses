import CvvCourse from "@/core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicvid',
            name: 'Corso per videoterminalisti'
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

    get exercises() {
        return [
            { number: "01.03.d1", question: "1", answer: "3" },
            { number: "01.06.d1", question: "1", answer: "1" },
            { number: "01.10.d1", question: "1", answer: "1" },
            { number: "01.14.d1", question: "1", answer: "1" },
            { number: "01.01.d1", question: "1", answer: "2" },
            { number: "01.01.d2", question: "2", answer: "1" },
            { number: "01.02.d1", question: "1", answer: "2" },
            { number: "01.02.d2", question: "2", answer: "3" },
            { number: "01.03.d2", question: "2", answer: "2" },
            { number: "01.04.d1", question: "1", answer: "1" },
            { number: "01.04.d2", question: "2", answer: "2" },
            { number: "01.05.d1", question: "1", answer: "1" },
            { number: "01.05.d2", question: "2", answer: "3" },
            { number: "01.06.d2", question: "2", answer: "3" },
            { number: "01.07.d1", question: "1", answer: "1" },
            { number: "01.07.d2", question: "2", answer: "2" },
            { number: "01.08.d1", question: "1", answer: "3" },
            { number: "01.08.d2", question: "2", answer: "3" },
            { number: "01.09.d1", question: "1", answer: "3" },
            { number: "01.09.d2", question: "2", answer: "3" },
            { number: "01.10.d2", question: "2", answer: "3" },
            { number: "01.11.d1", question: "1", answer: "1" },
            { number: "01.11.d2", question: "2", answer: "2" },
            { number: "01.13.d1", question: "1", answer: "1" },
            { number: "01.13.d2", question: "2", answer: "3" },
            { number: "01.12.d1", question: "1", answer: "1" },
            { number: "01.12.d2", question: "2", answer: "2" },
            { number: "01.14.d2", question: "2", answer: "2" },
        ];
    }

    get final() {
        return [
            { number: "d11", question: "11", answer: "2" },
            { number: "d13", question: "13", answer: "1" },
            { number: "d2", question: "2", answer: "3" },
            { number: "d5", question: "5", answer: "3" },
            { number: "d6", question: "6", answer: "3" },
            { number: "d15", question: "15", answer: "1" },
            { number: "d3", question: "3", answer: "2" },
            { number: "d14", question: "14", answer: "3" },
            { number: "d16", question: "16", answer: "3" },
            { number: "d1", question: "1", answer: "3" },
            { number: "d7", question: "7", answer: "3" },
            { number: "d10", question: "10", answer: "1" },
            { number: "d8", question: "8", answer: "1" },
            { number: "d12", question: "12", answer: "2" },
            { number: "d9", question: "9", answer: "3" },
            { number: "d4", question: "4", answer: "1" },
        ];
    };
};

export const course = new Course();
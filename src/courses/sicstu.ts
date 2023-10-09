import CvvCourse from "@/core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicstu',
            name: 'Corso per studenti equiparati a lavoratori'
        });
    }

    get exercises() {
        return [
            { number: "01.03.d1", question: "1", answer: "1" },
            { number: "01.06.d1", question: "1", answer: "2" },
            { number: "01.10.d1", question: "1", answer: "1" },
            { number: "01.14.d1", question: "1", answer: "3" },
            { number: "01.18.d1", question: "1", answer: "2" }
        ];
    }

    get videos() {
        const vids: string[] = ["pre"];
        for (let i = 0; i < 25; i++) {
            if (i !== 11) {
                if (i < 9) vids.push(`01.0${i + 1}`);
                else vids.push(`01.${i + 1}`);
                continue;
            };

            vids.push(`01.${i + 1}.01`);
            vids.push(`01.${i + 1}.02`);
            vids.push(`01.${i + 1}.03`);
        };

        return vids;
    };

    get final() {
        return [
            { number: "d5", question: "5", answer: "1" },
            { number: "d1", question: "1", answer: "3" },
            { number: "d7", question: "7", answer: "2" },
            { number: "d6", question: "6", answer: "1" },
            { number: "d2", question: "2", answer: "1" },
            { number: "d3", question: "3", answer: "3" },
            { number: "d8", question: "8", answer: "1" },
            { number: "d10", question: "10", answer: "2" },
            { number: "d4", question: "4", answer: "3" },
            { number: "d9", question: "9", answer: "3" }
        ];
    }
};

export const course = new Course();
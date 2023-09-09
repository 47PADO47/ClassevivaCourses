import CvvCourse from "../core/CvvCourse";

class Course extends CvvCourse {
    constructor() {
        super({
            id: 'sicstu',
            name: 'Corso per studenti equiparati a lavoratori'
        });
    }

    get exercises() {
        return [
            { "numero": "01.03.d1", "domanda": "1", "risposta": "1" },
            { "numero": "01.06.d1", "domanda": "1", "risposta": "2" },
            { "numero": "01.10.d1", "domanda": "1", "risposta": "1" },
            { "numero": "01.14.d1", "domanda": "1", "risposta": "3" },
            { "numero": "01.18.d1", "domanda": "1", "risposta": "2" }
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
            { "numero": "d5", "domanda": "5", "risposta": "1" },
            { "numero": "d1", "domanda": "1", "risposta": "3" },
            { "numero": "d7", "domanda": "7", "risposta": "2" },
            { "numero": "d6", "domanda": "6", "risposta": "1" },
            { "numero": "d2", "domanda": "2", "risposta": "1" },
            { "numero": "d3", "domanda": "3", "risposta": "3" },
            { "numero": "d8", "domanda": "8", "risposta": "1" },
            { "numero": "d10", "domanda": "10", "risposta": "2" },
            { "numero": "d4", "domanda": "4", "risposta": "3" },
            { "numero": "d9", "domanda": "9", "risposta": "3" }
        ];
    }
};

export default Course;
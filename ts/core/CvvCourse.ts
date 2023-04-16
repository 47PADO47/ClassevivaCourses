import { Exercise, Final } from "../types/Course";

class CvvCourse {
    constructor (public id: string) {
        this.id = id;
    };

    get exercises(): Exercise[] {
        throw new Error("Method not implemented ❌");
    };

    get videos(): string[] {
        throw new Error("Method not implemented ❌");
    };

    get final(): Final[] {
        throw new Error("Method not implemented ❌");
    };
};

export default CvvCourse;
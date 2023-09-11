import { safetyCoursePage } from "types/Classeviva";
import { CourseInfo, Answer, ICourse } from "../types/Course";

//https://media.spaggiari.eu/bianco/www/img/brochure_sicurezza_2016.pdf
class CvvCourse implements ICourse {
    id: string;
    name: string;
    constructor (info: CourseInfo) {
        this.id = info.id;
        this.name = info.name ?? info.id;
        
        window.logger.success(`Course "${this.name}" initialized ⌨️`);
    };

    get exercises(): Answer[] {
        throw new Error("Method not implemented ❌");
    };

    get videos(): string[] {
        throw new Error("Method not implemented ❌");
    };

    get final(): Answer[] {
        throw new Error("Method not implemented ❌");
    };

    getUrl(view: safetyCoursePage = 'ind') {
        const query = new URLSearchParams({
            corso: this.id, //course id
            p: 'sxs', //referer
            view, //course page
        }).toString();

        return `https://safetyforschool.spaggiari.eu/col/app/default/corso.php?${query}`;
    }
};

export default CvvCourse;
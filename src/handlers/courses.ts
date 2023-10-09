import CvvCourse from "@/core/CvvCourse";
import Handler from "@/core/Handler";
import ModuleManager from "@/core/ModuleManager";

class CoursesHandler extends Handler {
    moduleManager: ModuleManager;
    courses: CvvCourse[];
    constructor() {
        super({
            name: "Courses"
        });
        this.moduleManager = new ModuleManager();
        this.courses = [];
    };

    private isCourse(module: NodeModule) {
        const { course } = module.exports;
        return !!course && course instanceof CvvCourse;
    }

    public loadCourses() {
        this.courses = this.moduleManager
            .getModules()
            .filter((m) => this.isCourse(m))
            .map(({ exports }) => exports.course);
        return this;
    }

    public getCourse(id: string): CvvCourse | undefined {
        return this.courses.find(c => c.id === id);
    }
};

export default CoursesHandler;
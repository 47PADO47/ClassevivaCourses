interface ICourse {
    id: string;
    name: string;
}

type CourseInfo = {
    id: string;
    name?: string;
}

type Exercise = {
    numero: string;
    domanda: string;
    risposta: string;
};

type Final = {
    numero: string;
    domanda: string;
    risposta: string;
};

export {
    ICourse,
    CourseInfo,
    Exercise,
    Final,
}
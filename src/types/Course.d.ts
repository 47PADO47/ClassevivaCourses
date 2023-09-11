interface ICourse {
    id: string;
    name: string;
}

type CourseInfo = {
    id: string;
    name?: string;
}

type Answer = {
    number: string;
    question: string;
    answer: string;
};

export {
    ICourse,
    CourseInfo,
    Answer,
}
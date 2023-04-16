interface ClassOptions {
    cid?: string;
    uid?: string;
    pwd?: string;
    pin?: string;
    target?: string;
  }
  
  interface ClassUser {
    cid: string;
    cognome: string;
    nome: string;
    id: number;
    type: string;
  }
  
  interface FetchOptions {
    url: string;
    path?: string;
    method?: string;
    body?: string;
    headers?: HeadersInit;
    json?: boolean;
  }
  
  type prodotto =
    | "set"
    | "cvv"
    | "oas"
    | "ldt"
    | "sdg"
    | "acd"
    | "vrd"
    | "e2c"
    | "cvp";
  
  type safetyCourseTarget = "vid" | "sli" | "tst" | "nor" | "ind";
  
  type safetyCourseAnswer = {
    lesson: number | string;
    question: number | string;
    resultNumber: number | string;
    type: "tst" | "tsf";
  };
  
  export type {
    FetchOptions,
    ClassOptions,
    ClassUser,
    prodotto,
    safetyCourseAnswer,
    safetyCourseTarget,
  }
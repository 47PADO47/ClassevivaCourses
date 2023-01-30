import Logger from "Logger";

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
  prodotto,
  safetyCourseAnswer,
  safetyCourseTarget,
}

class Classeviva {
  private readonly data: ClassOptions;
  private token: string;
  authorized: boolean;
  private baseUrl: (path?: string) => string;
  private headers: { [key: string]: string };
  public user: ClassUser;
  public serverUrl: string;
  public courseId: string;
  /**
   * Web api class constructor
   * @param {ClassOptions} [loginData] Login data
   * @param {string} [loginData.cid] Customer ID (???)
   * @param {string} [loginData.uid] User ID (username)
   * @param {string} [loginData.pwd] User Password
   * @param {string} [loginData.pin] PIN (???)
   * @param {string} [loginData.target] Target (???)
   */
  constructor(
    loginData: ClassOptions = {
      cid: "",
      uid: "",
      pwd: "",
      pin: "",
      target: "",
    }) {
    this.data = loginData;
    this.token = "";
    this.authorized = false;
    this.serverUrl = 'https://web.spaggiari.eu/';
    this.courseId = 'sicstu';

    this.baseUrl = (path: string = "fml") =>
      `${this.serverUrl}${path}/app/default/`;
    this.headers = {
      "Origin": 'https://web.spaggiari.eu/',
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33",
    };

    this.user = {
      cid: "",
      cognome: "",
      nome: "",
      id: 0,
      type: "",
    };
  }

  setServerUrl(url: string) {
    if (!url) return;
    this.serverUrl = url;
    Logger.info('Set server url to:', url);
  }

  setCourseId(id: string) {
    if (!id) return;
    this.courseId = id;
    Logger.info('Set course id to:', id);
  }

  async login(data: ClassOptions = this.data): Promise<{ result: boolean; cause: string; } | { result: boolean; cause?: undefined; }> {
    const url = `${this.baseUrl("auth-p7")}AuthApi4.php?a=aLoginPwd`;
    const body = new URLSearchParams(Object.entries(data)).toString();

    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://web.spaggiari.eu/home/app/default/login.php",
        "Origin": "https://web.spaggiari.eu",
      },
    });

    if (response.status === 403) return {
      result: false,
      cause: 'sus'
    }

    const json = await response
      .json()
      .catch(() => this.error("Could not parse JSON"));

    if (json?.error && json.error?.length > 0) return this.error(json.error);  
    if (!json?.data?.auth?.accountInfo) return this.error("Login failed (no account info)");
    this.user = json.data.auth.accountInfo;
    this.authorized = true;

    return {
      result: this.authorized,
    };
  }

  logout() {
    if (!this.authorized) {
        this.error("Already logged out");
        return false;
    }
    
    this.token = "";
    this.authorized = false;
    this.user = {
      cid: "",
      cognome: "",
      nome: "",
      id: 0,
      type: "",
    };
    return !this.authorized;
  }

  async getAgenda(
    start: Date = new Date(),
    end: Date = new Date(),
    nascondiAuleVirtuale: boolean = false
  ): Promise<any> {
    const query = new URLSearchParams({
      classe_id: "",
      gruppo_id: "",
      nascondi_av: nascondiAuleVirtuale ? "1" : "0",
      start: this.msToUnix(start).toString(),
      end: this.msToUnix(end).toString(),
    });

    const response = await this.fetch({
      url: `agenda_studenti.php?ope=get_events&${query.toString()}`,
      path: "fml",
      method: "GET",
      json: false,
    });
    const data = response === "null" ? [] : JSON.parse(response);

    return data;
  }

  async getPortfolio(): Promise<any> {
    const data = await this.fetch({ url: "get_pfolio.php", path: "tools" });
    return data ?? {};
  }

  async exportXmlAgenda(
    start: Date = new Date(),
    end: Date = new Date(),
    formato: "xml" | "xls" = "xml"
  ): Promise<any> {
    
    const date = new Date();
    const query = new URLSearchParams({
      stampa: ":stampa:",
      report_name: "",
      tipo: "agenda",
      data: `${date.getDay()}+${date.getMonth() + 1}+${date
        .getFullYear()
        .toString()
        .substring(2)}`,
      autore_id: this.user.id.toString(),
      tipo_export: "EVENTI_AGENDA_STUDENTI",
      quad: ":quad:",
      materia_id: "",
      classe_id: ":classe_id:",
      gruppo_id: ":gruppo_id:",
      ope: "RPT",
      dal: `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
      al: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
      formato,
    });

    const response = await this.fetch({
      url: `xml_export.php?${query.toString()}`,
      method: "GET",
      json: false,
    });

    return response;
  }

  async getUnreadMessages(): Promise<number | undefined> {
    const response = await this.fetch({
      url: "SocMsgApi.php?a=acGetUnreadCount",
      path: "sps",
    });
    return response?.OAS?.unread?.totCount ?? undefined;
  }

  async getUsername(): Promise<{ name?: string; username?: string }> {
    const response = await this.fetch({
      url: "get_username.php",
      path: "tools",
    });
    return response ?? {};
  }

  async getDocumentionList(
    prodotto: prodotto | "" = "",
    cerca: string = ""
  ): Promise<any> {
    const response = await this.fetch({
      url: `documentazione.xhr.php?act=get_faq_autocomplete&prodotto=${prodotto}&find=${cerca}`,
      path: "acc",
    });
    return response ?? {};
  }

  async getDocumentationUrl(prodotto: prodotto, id: number): Promise<string> {
    return `${this.baseUrl("acc")}documentazione.php?prodotto=${prodotto}&cerca=d:${id}`;
  }

  async getAvatar(): Promise<any> {
    const response = await this.fetch({
      url: "get_avatar.php",
      path: "tools",
    });
    return response ?? {};
  }

  async getAcGooBApiKey(): Promise<string> {
    const response = await this.fetch({
      url: "SocMsgApi.php?a=acGooBApiK",
      path: "sps",
    });
    return response?.OAS?.gooBApiK ?? "";
  }

  async getRubrica(): Promise<any> {
    const response = await this.fetch({
      url: "SocMsgApi.php?a=acGetRubrica",
      path: "sps",
    });
    return response?.OAS?.targets ?? {};
  }

  async getMessages(): Promise<any> {
    const query = new URLSearchParams({
      anyt: "0",
      ctx: "",
      hmid: "0",
      ignpf: "0",
      mid: "0",
      mmid: "0",
      mpp: "20",
      nosp: "0",
      nwth: "0",
      p: "1",
      search: "",
      unreadOnly: "0",
      _stkx: "",
    });

    const response = await this.fetch({
      url: "SocMsgApi.php?a=acGetMsgPag",
      path: "sps",
      method: "POST",
      body: query.toString(),
    });
    return response?.OAS?.rows ?? [];
  }

  async getBacheca(nascondiNonAttive: boolean = false): Promise<any> {
    const query = new URLSearchParams({
      action: "get_comunicazioni",
      cerca: "",
      ncna: nascondiNonAttive ? "1" : "0",
      tipo_com: "",
    });

    const response = await this.fetch({
      url: `bacheca_personale.php?${query.toString()}`,
      path: "sif",
    });

    return response ?? {};
  }

  async readComunications(ids: string[]): Promise<boolean> {
    const query = new URLSearchParams({
      action: "read_all",
      id_relazioni: ids.toString(),
    });

    const response = await this.fetch({
      url: `bacheca_personale.php?${query}`,
      path: "sif",
      method: "GET",
      json: false,
    });
    return response === "OK";
  }

  async getDocumentUrl(params: string, doctype: number = 1) {
    const query = new URLSearchParams({
      a: "RA-RICAVA",
      doctype: doctype.toString(),
      sessione: "S3",
      params,
    });

    const response = await this.fetch({
      url: `pubblicazioni.php?${query.toString()}`,
      path: "sol",
    });

    return response ?? {};
  }

  // need to find a way to get only json
  /*async getRecuperi(quad: number) {
        const response = await this.fetch(
            `scrutinio_singolo_recuperi.php?quad=${quad}`,
            'sol',
            'GET',
            undefined,
            {
                'Accept': 'application/json'
            },
            false
        );

        return response ?? {}
    };*/

  async getAccountInfo() {
    const response = await this.fetch({
      url: "OtpApi.php?a=recStatus",
      path: "auth",
    });

    return response ?? {};
  }

  async getSetLessons(year: number = new Date().getFullYear()) {
    if (!this.user.id) return this.error("User not logged in via psw (no uid)");

    const query = new URLSearchParams({
      ope: "popup_studente",
      id_studente: this.user.id.toString(),
      anno_scol: year.toString(),
    });

    const response = await this.fetch({
      url: `lezioni_cvv.php?${query.toString()}`,
      path: "set",
      headers: {
        "Referer": `https://web.spaggiari.eu/set/app/default/curriculum.php`,
      }
    });

    return response ?? {};
  }

  async getSafetyCoursePolicy() {
    const response = await this.fetchSafetyCourse(new URLSearchParams({
      act: "getPrivacyProgramma",
    }), false);

    return response ?? {};
  };

  async getSafetyCourseExecutive() {
    const response = await this.fetchSafetyCourse(new URLSearchParams({
      act: "getNomeDirigente",
    }), false);

    return response ?? "";
  };

  async watchSafetyCourseVideo(lession: string | "pre", length: number) {
    await this.fetchSafetyCourse(new URLSearchParams({
      act: "regTempo",
      tipo: "vid",
      durata: length.toString(),
      duratatot: length.toString(),
      lezione: lession.toString(),
    }), false);
  };

  async addSafetyCourseMinutes(target: safetyCourseTarget, minutes: number) {
    for (let i = 0; i < minutes; i++) {
      await this.fetchSafetyCourse(new URLSearchParams({
        act: "regTempo",
        tipo: "reg",
        durata: "1",
        duratatot: "0",
        lezione: target,
      }), false);
    }
  }

  async setSafetyCourseAnswer(answerData: safetyCourseAnswer) {
    await this.fetchSafetyCourse(new URLSearchParams({
      act: "checkTest",
      lezione: answerData.lesson.toString(),
      domanda: answerData.question.toString(),
      esito: answerData.resultNumber.toString(),
      tipo: answerData.type,
    }));
  }

  async agreeSafetyCoursePolicy() {
    await this.fetchSafetyCourse(new URLSearchParams({
      act: "accettaPrivacyProgramma",
      accetta_privacy: "checked",
      accetta_programma: "checked",
    }), false);
  };

  private async fetchSafetyCourse(query: URLSearchParams, json: boolean = true) {
    const response = await this.fetch({
      url: `corso.xhr.php`,
      path: "col",
      method: "POST",
      body: query.toString(),
      headers: {
        "Referer": `https://web.spaggiari.eu/col/app/default/corso.php?corso=${this.courseId}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json,
    });

    return response;
  };

  async isCourseValid(id: string) {
    return (await fetch(`https://web.spaggiari.eu/col/app/default/corso.php?corso=${id}`, {
      headers: {
        Cookie: this.token,
      },
      redirect: 'manual'
    })).status === 200;
  }

  getMethods(): string[] {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(prop => prop !== "constructor");
  }

  public setSessionId(cookie: string): void {
    if (!cookie) return;

    if (!cookie.startsWith("PHPSESSID=")) {
      cookie = `PHPSESSID=${cookie}`;
    }

    if (!cookie.endsWith(";")) cookie += ";";

    this.token = cookie + `webrole=gen; webidentity=${this.user.type}${this.user.id};prefCountry=it;prefLang=it;LAST_REQUESTED_TARGET=cvv;`;
    this.authorized = true;
  }

  public msToUnix(ms: Date | number): number {
    const num = typeof ms === "number" ? ms : ms.getTime();
    return Math.floor(num / 1000);
  }

  private error(message: string): Promise<never> {
    return Promise.reject(message);
  }

  private async fetch({
    url,
    path,
    method = "GET",
    body,
    headers: head = {},
    json = true,
  }: FetchOptions): Promise<any> {
    if (!this.authorized) return this.error("Not logged in ❌");

    const headers: HeadersInit = Object.assign(this.headers, {
      Cookie: this.token,
      ...head,
    });
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };
    if (body && method !== "GET") options.body = body;

    const response: Response = await fetch(`${this.baseUrl(path)}${url}`, options);
    if (!response.ok) return this.error(`Response not ok (${response.status} - ${response.statusText})`);

    const data = json
      ? await response.json().catch(() => this.error("Could not parse JSON"))
      : await response.text().catch(() => this.error("Could not parse Text"));

    if (data?.error && data?.error?.length > 0) return this.error(data?.error || "Unknown error");

    return data;
  }
}

export default Classeviva;
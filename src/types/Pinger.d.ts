type Url = {
    url: string;
    method?: string;
}
  
type PingerOptions = {
    domains: Url[],
    timeout?: number,
}

export {
    Url,
    PingerOptions,
}
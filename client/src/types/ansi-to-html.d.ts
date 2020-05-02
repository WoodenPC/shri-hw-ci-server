declare module 'ansi-to-html' {
  export interface IOptions {
    fg?: string;
    bg?: string;
    newLine?: boolean;
    escaleXML?: boolean;
    stream?: boolean;
    colors?: Array<string> | { [code: number]: string };
  }
  class Filter {
    constructor(options: IOptions) {}
    toHtml: (input: any) => string;
  }
  export = Filter;
}

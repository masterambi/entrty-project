import { Plugin } from "vite";

interface IHtmlInjectorParams {
  cdnFontList: string[];
}
export const fontInjector = ({ cdnFontList }: IHtmlInjectorParams): Plugin => {
  return {
    name: "font-injector",
    transformIndexHtml(html) {
      console.log("<====== Font Injector Kredivo Plugin ======>\n");
      const linkRelPreloadString = cdnFontList.map((v) => {
        console.log("Injecting ===> ", v);
        const parts = v.split(".");
        const extension = parts[parts.length - 1];
        return `<link rel="preload" as="font" type="font/${extension}" href="${v}" crossorigin="anonymous">\n`;
      });
      return html.replace("<!--FONT-PRELOAD-->", linkRelPreloadString.join(""));
    },
  };
};

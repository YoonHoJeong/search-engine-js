import * as Cheerio from "cheerio";
import { UrlUtil } from "./util/UrlUtil";


export class Parser {
    constructor(private readonly html: string) {
    }
    getTitle() {
        const $ = Cheerio.load(this.html);
        const title = $('title').text();
        return title;
    }
    getNextUrls({ origin, html }: { origin: string; html: string; }) {
        const $ = Cheerio.load(html);
        const links = $('a');
        const nextUrls: string[] = [];
        links.each((_, element) => {
            const href = $(element).attr('href');
            if (!href) {
                return;
            }
            const absoluteUrl = UrlUtil.getAbsoluteUrl(origin, href);
            if (absoluteUrl) {
                nextUrls.push(absoluteUrl);
            }
        });
        return nextUrls;
    }
    getMetaData() {
        const $ = Cheerio.load(this.html);
        const description = $('meta[name="description"]').attr('content');
        const keywords = $('meta[name="keywords"]').attr('content');

        return { description, keywords };
    }
    getHeadings() {
        const $ = Cheerio.load(this.html);
        const headingElems = $('h1, h2, h3, h4, h5, h6');
        const headings = headingElems.map((_, element) => {
            return $(element).text();
        }).get();
        return headings;
    }
}

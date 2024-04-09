import * as Cheerio from "cheerio";

export type CrawlData = {
    nextUrls: string[];
    text: string[];
}

interface ICrawler {
    crawl(url: string): Promise<CrawlData>
}

const getAbsoluteUrl = (originUrl: string, href: string): string | null => {
    if (href.startsWith('#')) {
        return null;
    }
    if (href.startsWith('http')) {
        return href;
    }
    const url = new URL(originUrl);
    const absoluteUrl = new URL(href, url.origin);
    if (absoluteUrl.host === url.host) {
        return absoluteUrl.href;
    }
    return null;
};


export class Crawler implements ICrawler {
    constructor(private originUrl: string, private crawlData: CrawlData = { nextUrls: [], text: [] }) { }
    getNextUrls(html: string) {
        const $ = Cheerio.load(html);
        const links = $('a');
        const nextUrls: string[] = [];
        links.each((_, element) => {
            const href = $(element).attr('href');
            if (!href) {
                return;
            }
            const absoluteUrl = getAbsoluteUrl(this.originUrl, href);
            if (absoluteUrl) {
                nextUrls.push(absoluteUrl)
            }
        });
        return nextUrls
    }
    getKeywords(html: string) {
        const $ = Cheerio.load(html);
        const text = $('body').text();
        return text.split(' ');
    }
    async crawl(): Promise<CrawlData> {
        console.log("crawl", this.originUrl);
        const html = await fetch(this.originUrl).then(res => res.text())

        return {
            nextUrls: this.getNextUrls(html),
            text: this.getKeywords(html)
        }
    }
}


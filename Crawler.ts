import * as Cheerio from "cheerio";
import { Indexer, IndexerImpl } from "./Indexer";
import { UrlUtil } from "./util/UrlUtil";

export type CrawlData = {
    nextUrls: string[];
    text: string[];
}

interface Crawler {
    isEmpty(): boolean;
    stopCrawl(): boolean;
    startCrawl(): Promise<boolean>;
}

export class CrawlerImpl implements Crawler {
    constructor(initialUrls: string[]) {
        this.queue = initialUrls;
    }
    private isRunning: boolean = false;
    private queue: string[] = [];
    private visitedUrls: Set<string> = new Set();

    private getNextUrls({ origin, html }: { origin: string, html: string }) {
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
                nextUrls.push(absoluteUrl)
            }
        });
        return nextUrls
    }

    private async crawl() {
        if (!this.isRunning) {
            return;
        }
        const url = this.queue.shift();
        console.log("crawl", url);
        if (!url) {
            return;
        }
        this.visitedUrls.add(url);
        const html = await fetch(url).then(res => res.text());
        const nextUrls = this.getNextUrls({
            origin: url, html
        });

        this.queue.push(...nextUrls);
        const indexer = new IndexerImpl();
        const index = indexer.index(html);
        console.log("index size:", index.size);
    }

    async startCrawl(): Promise<boolean> {
        if (this.isRunning) {
            return true
        }
        this.isRunning = true;

        while (this.isRunning && !this.isEmpty()) {
            await this.crawl();
            console.log("queue size:", this.queue.length);
            console.log("visited size:", this.visitedUrls.size);
        }
        return true
    }

    stopCrawl(): boolean {
        this.isRunning = false;
        return true;
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}


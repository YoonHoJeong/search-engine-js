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
    private readonly maxQueueSize: number = 10;

    private async crawl() {
        if (!this.isRunning) {
            return;
        }
        if (this.visitedUrls.size > this.maxQueueSize) {
            return;
        }
        const url = this.queue.shift();
        console.log("crawl", url);
        if (!url) {
            return;
        }
        this.visitedUrls.add(url);
        const html = await fetch(url).then(res => res.text());
        const indexer = new IndexerImpl(url, html);
        const { nextUrls, indexedData } = indexer.index();
        console.log(" indexedData", indexedData);

        this.queue.push(...nextUrls);
    }

    async startCrawl(): Promise<boolean> {
        if (this.isRunning) {
            return true
        }
        this.isRunning = true;

        while (this.isRunning && !this.isEmpty() && this.visitedUrls.size < this.maxQueueSize) {
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


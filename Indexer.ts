import { Parser } from "./Parser";

export interface Indexer {
    index(origin: string, content: string): { nextUrls: string[], indexedData: IndexedData }
}

export class IndexerImpl implements Indexer {
    private readonly parser: Parser;
    constructor(private readonly origin: string, private readonly content: string) {
        this.parser = new Parser(content);
    }

    public index(): { nextUrls: string[], indexedData: IndexedData } {
        const indexedData: IndexedData = new Map();
        const nextUrls = this.parser.getNextUrls({
            origin: this.origin,
            html: this.content
        });
        const title = this.parser.getTitle();
        const meta = this.parser.getMetaData();
        const headings = this.parser.getHeadings();
        indexedData.set('title', new Set([title]));
        if (meta.description) {
            indexedData.set('description', new Set([meta.description]));
        }
        if (meta.keywords) {
            indexedData.set('keywords', new Set(meta.keywords.split(',').map(keyword => keyword.trim())));
        }
        indexedData.set('headings', new Set(headings));
        return {
            nextUrls,
            indexedData
        };
    }
}

export type IndexedData = Map<string, Set<string>>;

import FileHandler from "./FileHandler";
import { Parser } from "./Parser";

// indexing해서 저장하기
export interface Indexer {
    index(origin: string, content: string): { nextUrls: string[] }
}
export class IndexerImpl implements Indexer {
    private readonly parser: Parser;
    constructor(private readonly origin: string, private readonly content: string) {
        this.parser = new Parser(content);
    }

    public index(): { nextUrls: string[] } {
        const indexedData: IndexedData = {
            title: new Set(),
            description: new Set(),
            keywords: new Set(),
            headings: new Set(),
        }
        const nextUrls = this.parser.getNextUrls({
            origin: this.origin,
            html: this.content
        });
        const title = this.parser.getTitle();
        const meta = this.parser.getMetaData();
        const headings = this.parser.getHeadings();
        indexedData.title = new Set([title]);
        if (meta.description) {
            indexedData.description = new Set([meta.description]);
        }
        if (meta.keywords) {
            indexedData.keywords = new Set(meta.keywords.split(',').map(keyword => keyword.trim()));
        }
        indexedData.headings = new Set(headings);
        this.saveIndex(this.origin, indexedData);
        return {
            nextUrls,
        };
    }

    private saveIndex(origin: string, indexedData: IndexedData) {
        console.log('###saveIndex', origin);
        const fileHandler = new FileHandler();
        fileHandler.saveIndex(origin, indexedData);
    }
}

type IndexedDataKey = 'title' | 'description' | 'keywords' | 'headings';
export type IndexedData = Record<IndexedDataKey, Set<string>>;

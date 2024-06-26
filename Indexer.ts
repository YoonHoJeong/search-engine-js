import DatabaseRepo from "./DatabaseRepo";
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
            title: [],
            description: [],
            keywords: [],
            headings: [],
        }
        const nextUrls = this.parser.getNextUrls({
            origin: this.origin,
            html: this.content
        });
        const title = this.parser.getTitle();
        const meta = this.parser.getMetaData();
        const headings = this.parser.getHeadings();
        indexedData.title = [title];
        if (meta.description) {
            indexedData.description = [meta.description];
        }
        if (meta.keywords) {
            indexedData.keywords = meta.keywords.split(',').map(keyword => keyword.trim());
        }
        indexedData.headings = headings;
        this.saveIndex(this.origin, indexedData);
        return {
            nextUrls,
        };
    }

    private saveIndex(origin: string, indexedData: IndexedData) {
        console.log('###saveIndex', origin);
        DatabaseRepo.writeIndex(origin, indexedData);
    }
}

type IndexedDataKey = 'title' | 'description' | 'keywords' | 'headings';
export type IndexedData = Record<IndexedDataKey, Array<string>>;
export const IndexedData = (() => {
    const serialize = (indexedData: IndexedData) => {
        // 'Set' to serializable
        const serializedIndexedData = Object.entries(indexedData).reduce((acc, [key, value]) => {
            if (value instanceof Set) {
                acc[key] = Array.from(value);
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as any);

        return JSON.stringify(serializedIndexedData);
    }
    const deserialize = (serializedIndexedData: string) => {
        return JSON.parse(serializedIndexedData);
    }

    const merge = (currentIndexedData: IndexedData, newIndexedData: IndexedData) => {
        const mergedIndexedData: IndexedData = { ...currentIndexedData };
        Object.entries(newIndexedData).forEach(([key, value]) => {
            mergedIndexedData[key as IndexedDataKey] = [...mergedIndexedData[key as IndexedDataKey], ...value];
        });
        return mergedIndexedData;
    }

    return {
        serialize,
        deserialize,
        merge,
    }
})()


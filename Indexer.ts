export interface Indexer {
    index(content: string): IndexedData
}

export class IndexerImpl implements Indexer {
    constructor() {
    }

    public index(content: string): IndexedData {
        const indexMap: IndexedData = new Map();
        const words = content.split(' ');
        words.forEach(word => {
            if (!indexMap.has(word)) {
                indexMap.set(word, new Set());
            }
        });
        return indexMap;
    }
}

export type IndexedData = Map<string, Set<string>>;

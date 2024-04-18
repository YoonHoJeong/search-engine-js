import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { IndexedData } from './Indexer';
import { Database } from "bun:sqlite";

class FileHandler {
    private indexDir = 'indexing';
    private indexFile = 'index.json';
    private indexPath = `${this.indexDir}/${this.indexFile}`;
    private db = new Database(':memory:');

    private serialize(indexedData: IndexedData) {
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

    saveIndex(origin: string, indexedData: IndexedData) {
        const dataToSave = {
            [origin]: this.serialize(indexedData)
        }
        console.log("dataToSave", dataToSave);
        try {
            const currentData = JSON.parse(readFileSync(this.indexPath, 'utf8'));
            const mergedData = {
                ...currentData,
                ...dataToSave
            }
            writeFileSync(this.indexPath, JSON.stringify(mergedData));
        } catch (error) {
            // ENOENT: No such file or directory
            if (!(error instanceof Error)) {
                return
            }
            console.log("파일이 없습니다. 파일을 생성합니다.")
            mkdirSync(this.indexDir, { recursive: true });
            writeFileSync(this.indexPath, JSON.stringify(dataToSave));
        }
    }
}

export default FileHandler
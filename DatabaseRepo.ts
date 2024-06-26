import { Database } from "bun:sqlite"
import { IndexedData } from "./Indexer";

export default class DatabaseRepo {
    private static INDEXED_DATA_TABLE_NAME = 'indexed_data';
    private static db = new Database('./index.sqlite', { create: true });
    constructor() { }

    static async ensureTableExists(tableName: string) {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                origin TEXT UNIQUE,
                indexed_data TEXT
            );
        `;
        this.db.exec(createTableQuery);
    }

    static async serializeIndexedData(indexedData: IndexedData) {
        return IndexedData.serialize(indexedData);
    }

    static async writeIndex(origin: string, indexedData: IndexedData) {
        await this.ensureTableExists(this.INDEXED_DATA_TABLE_NAME);
        const serializedIndexedData = await this.serializeIndexedData(indexedData);

        const rowExisted = this.db.prepare(`SELECT * FROM ${this.INDEXED_DATA_TABLE_NAME} WHERE origin = ?`);
        const result = rowExisted.get(origin);
        if (result) {
            // 이미 origin에 대한 데이터가 있으면, 데이터를 update.
            const currentIndexedData = IndexedData.deserialize((result as any)['indexed_data']);
            const newIndexedData = IndexedData.merge(currentIndexedData, indexedData);
            const serializedNewIndexedData = await this.serializeIndexedData(newIndexedData);
            const query = this.db.prepare(`UPDATE ${this.INDEXED_DATA_TABLE_NAME} SET indexed_data = ? WHERE origin = ?`);
            query.run(serializedNewIndexedData, origin);
        } else {
            // row가 없다면, 데이터를 insert.
            const query = this.db.prepare(`INSERT INTO ${this.INDEXED_DATA_TABLE_NAME} (origin, indexed_data) VALUES (?, ?)`);
            query.run(origin, serializedIndexedData);
        }
    }

    static async getIndexedData(origin: string): Promise<IndexedData> {
        await this.ensureTableExists(this.INDEXED_DATA_TABLE_NAME);
        const query = this.db.prepare(`SELECT * FROM ${this.INDEXED_DATA_TABLE_NAME} WHERE origin = ?`);
        const result = query.get(origin);
        const indexedData = (result as any)['indexed_data'];
        const deserializedIndexedData = IndexedData.deserialize(indexedData);
        return deserializedIndexedData;
    }
}

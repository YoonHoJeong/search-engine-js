/**
 * 크롤러
 * 1. crawl
 * 2. full text indexes 데이터 베이스에 저장
 * 3. page rank에 따라서, 더 높은 우선순위를 갖도록
 */

import fs from 'fs';
import { Crawler } from './Crawler';

interface PageRank {
    [url: string]: {
        rank: number;
    };
}


const pageRank: PageRank = {};

const storeDB = (): void => {
    console.log("### DB 저장");
    const json = JSON.stringify(pageRank);
    fs.writeFileSync('./pageRank.json', json);
};

const main = async (): Promise<void> => {
    const urlsToCrawl: string[] = [
        'https://www.naver.com',
        'https://www.google.com',
        'https://www.daum.net',
    ];
    while (urlsToCrawl.length > 0) {
        const url = urlsToCrawl.shift();
        if (url) {
            const crawler = new Crawler(url)
            const data = await crawler.crawl()
            urlsToCrawl.push(...data.nextUrls)
        }
    }
};

main();

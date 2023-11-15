// 간단한 검색 엔진의 원리
/**
 * 1. 특정 페이지에 있는 <a> 태그를 추출
 * 2. <a> 태그에 걸려있는 페이지 접근
 * 3. 해당 페이지 정보 인덱싱
 * 4. 정보를 DB에 저장
 * 5. 1~4 반복
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const initialUrl = 'https://www.naver.com';

const pageRank = {}


const getAbsoluteUrl = (originUrl, href) => {
    if (href.startsWith('#')) {
        return null
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
}

const crawlQueue = [];
let currentQueueIndex = 0;
let crawlCount = 0;

// 1. 특정 페이지에 있는 <a> 태그를 추출
// 2. <a> 태그에 걸려있는 페이지 접근
const crawl = async (url) => {
    if (crawlCount > 10) {
        return;
    }
    crawlCount += 1;
    if (!pageRank[url]) {
        pageRank[url] = {
            rank: 1,
        }
    } else {
        pageRank[url].rank += 1;
    }
    console.log("crawl:", url)

    const html = await axios.get(url).then(res => res.data);
    const $ = cheerio.load(html);
    const links = $('a');

    links.each((_, element) => {
        const href = $(element).attr('href');
        const absoluteUrl = getAbsoluteUrl(url, href);
        if (absoluteUrl) {
            crawlQueue.push(absoluteUrl);
        }
    })

    if (crawlQueue[currentQueueIndex]) {
        crawl(crawlQueue[currentQueueIndex]);
        currentQueueIndex += 1;

        if (currentQueueIndex % 10 === 0) {
            storeDB();
        }
    } else {
        console.log("### 크롤링 종료", pageRank)
    }
}

const storeDB = () => {
    console.log("### DB 저장")
    const json = JSON.stringify(pageRank);
    fs.writeFileSync('./pageRank.json', json);
}

crawl(initialUrl);
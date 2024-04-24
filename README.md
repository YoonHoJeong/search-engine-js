# search engine with ts
1. crawl
2. data storage
3. indexing
4. search algorithm
5. ranking

## 1. Crawler
1. 웹 페이지를 방문
1. html 긁어오기
1. 다음에 크롤링할 nextUrls 가져오기

## 2. Data Storage
- 데이터 CRUD 역할

## 3. Indexing
- 어떤 정보를 읽어오고
  1. head > title
  1. meta > description
  1. meta > keywords
  1. headings - h1, h2, h3
- 어떤 방법으로 정보를 Indexing할 것인지
- normalize

## 4. Search Algorithm
- 사용자 쿼리에 가장 관련성이 높은 결과 반환하기
  - TF-IDF, BM25

## 5. Ranking
- 페이지 순위 매기기
  - PageRank
  - 컨텐츠 품질


# References
1. https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko

## google 검색
1. 크롤링: Google은 크롤러라는 자동화된 프로그램을 사용하여 인터넷에서 찾은 페이지로부터 텍스트, 이미지, 동영상을 다운로드합니다.
1. 색인 생성: Google은 페이지의 텍스트, 이미지, 동영상 파일을 분석하고 대규모 데이터베이스인 Google 색인에 이 정보를 저장합니다.
1. 검색결과 게재: 사용자가 Google에서 검색하면 Google에서는 사용자의 검색어와 관련된 정보를 반환합니다.


### 크롤링
1. URL 검색
  - 모든 페이지가 등록되는 중앙 레지스트리가 있지 않음.
  - 새 페이지와 업데이트된 페이지를 검색해서 페이지 목록에 추가해야 함
  - 사용자가 페이지 목록(site map)을 제공해서 발견하는 페이지도 있음

### 색인 생성
1. 페이지 내용 분석
  -  <title> 요소 및 Alt 속성, 이미지, 동영상 등 텍스트 콘텐츠 및 핵심 콘텐츠 태그와 속성을 처리하고 분석
1. 클러스터링
  - 페이지가 인터넷에 있는 다른 페이지와 중복되는지 아니면 표준 페이지인지 판단
  - 먼저 인터넷에서 찾은 비슷한 콘텐츠의 페이지를 그룹으로 묶은 다음(클러스터링이라고도 함)한 다음 이 그룹을 가장 잘 대표하는 페이지를 선택
1. 표준 페이지와 그 콘텐츠에 관한 신호를 수집
  - 페이지의 언어, 콘텐츠가 속하는 국가, 페이지의 사용성


# Plan
- [x] Indexing 방식 리서치 (24/04/18)
  - 정보는 계속해서 추가하고,
  - index를 저장하는건 sqlite에 하자
    - bun은 자체 bun:sqlite가 있음
- 24/04/24
  - bun:sqlite 연결, indexed data 저장
    - DatabaseRepo class
      - 고수준 method 추가
    - [Q] Database에 어떻게 저장하는게 좋은건가?
      - DB Schema를 잘 짜는 법
      - Search Engine에서의 DB

# Study notes

## Bun - SQLite
1. Typescript - `using` keyword
  - TS 5.2 부터 생김. using 키워드를 사용하면 해당 객체는 해당 스코프에서만 생명 주기를 갖는다.
  - Symbol.dispose를 구현하면, 해당 스코프를 벗어날 때 원하는 작업을 호출할 수 있음.
  - 파일 connection, DB Connection을 관리하는데 매우 유용해짐
2. Serialize
  - 복잡한 데이터 구조들을 전송가능한 형태로 변환하는 과정
    - 네트워크, 파일 전송 과정에서 원하는 데이터를 유지하기 위해
      -> 데이터 일관성과 무결성
  - ex, 객체의 인스턴스를 JSON 형태로 변환
3. in-memory Database
  - 디스크에 데이터를 저장하지 않고, RAN 내에서 전체 데이터베이스를 운영하는 방식
  - 해당 프로그램과 생명 주기가 같아서, 프로그램이 종료되면 데이터베이스도 사라진다.
4. prepare
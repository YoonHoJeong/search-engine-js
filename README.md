# search engine with ts
1. crawl
2. data storage
3. indexing
4. search algorithm
5. ranking

# search engine 목표
> 스타를 목표로 새로운 Google을 구축해보고 싶을 수도 있습니다. 하지만 수십억 개의 웹 페이지를 크롤링하려면 모든 데이터를 저장할 수 있는 용량은 말할 것도 없고 엄청난 양의 인프라와 컴퓨팅 파워가 필요합니다. - [how to create a serach engine](https://www.elastic.co/kr/blog/how-to-create-a-search-engine)

1. 이 정보/콘텐츠를 찾는 이유
  - 어떤 정보를 추가해둘 것인가?
  - 좁은 범위의 데이터 소스를 가졌지만, 좀 더 풍부한 search engine
  - **음식 - 회사 점심 의사결정 트리를 만들기 위해 사용할만한 맛집 리뷰들을 전부 모아본다**
    - 블로그, 리뷰, 망고플레이트 등 전부다
1. 관련성이 있는지 판단하기 위해 어떤 정보를 알아야 하나요?
  - '속도', '맛', '건강' 3가지 factor
    - 방법은 아직 잘 모르겠는데 embedding을 추출, 각 단어별 위 factor와 연관된 단어를 찾을 수 있으면 좋을 듯
1. 어떤 결과가 다른 결과보다 더 나은지 어떻게 판단할 것인가?
  - 결과를 검색하는건 위 3가지 factor. 다 같은 점수를 가질 수는 없을 것 같고, 사용자가 원하는 3가지 지표에 대한 점수가 있다.
1. 가능한 한 유용하도록 결과를 어떻게 제시할 것인가?


## 1. Crawler
1. 웹 페이지를 방문, html 긁어오는 역할 수행
1. 긁어올 데이터 - 지도 앱의 식당 리뷰들(특정 지역)
  - google
  - kakao
  - naver

## 2. Database
- 어떤 Database를 사용할 것인가?
  - elastic search

## 3. Indexing
> 도서관에서와 마찬가지로 콘텐츠의 색인이 없으면 모든 콘텐츠가 어디에 있는지 알 수 없습니다. 인덱스는 데이터 소스에서 정보를 효율적으로 검색할 수 있도록 정리하고 저장하여 이를 수행합니다. 검색 엔진이 제대로 작동하려면 콘텐츠를 빠르게 식별하고, 순위를 매기고, 제공할 수 있어야 합니다. - [how to create a serach engine](https://www.elastic.co/kr/blog/how-to-create-a-search-engine)
- 키워드: 페이지에서 찾은 단어 및 구문
- 임베딩: 텍스트 데이터를 나타내는 다차원 벡터
- 메타데이터: 페이지에 포함된 제목, 설명 및 기타 구조화된 데이터
- 콘텐츠 분석: 페이지의 주제, 엔티티 및 전반적인 의미에 대한 이해
- 백링크: 콘텐츠를 가리키는 다른 웹사이트의 링크

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
- 24/04/26
  - data source를 어디서 얻으면 좋을까? 어떤 검색 엔진을 만들면 좋을까?
  - internal vs external
    

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

## Kagi(open source search engine)
- external, internal(자체 구축) 두가지 data src를 씀
- data source (external)
  - anonymized API calls to traditional search indexes like Google, Yandex, Mojeek and Brave, specialized search engines like Marginalia, and sources of vertical information like Wolfram Alpha, Apple, Wikipedia, Open Meteo, Yelp, TripAdvisor and other APIs.
- data source (internal)
  - coming from our web index (internal name - Teclis) and news index (internal name - TinyGem). Kagi's indexes provide unique results that help you discover non-commercial websites and "small web" discussions surrounding a particular topic. Kagi's Teclis and TinyGem indexes are both available as an API.

## small webs
- [small-web](https://blog.kagi.com/small-web) [ben hoyt - the small web is beautiful](https://benhoyt.com/writings/the-small-web-is-beautiful/)
  - 비상업적으로 올리는 웹페이지의 글들
  - size가 작은 웹 사이트들

# references 
1. [how to create a search engine](https://www.elastic.co/kr/blog/how-to-create-a-search-engine)

# 귀여운 js 검색 엔진
- [x] base url에서 출발, <a> tags 방문, 태그된 횟수로 pageRank 생성하기
- [ ] 해당 페이지에서 가장 많이 등장하는 키워드를 저장, 해당 키워드에 대한 pageRank 생성하기
- [ ] bun + ts
- [ ] 실제로 크롤링을 하는 g


1. 크롤링
  - 알고 있는 페이지에서 시작
  - robots.txt
2. 인덱싱
  - 텍스트, 이미지, 비디오, 페이지 타이틀, meta 데이터 등을 분석
  - 페이지에 대한 키워드를 저장
3. Ranking
  - 사용자가 검색하면, 검색 엔진은 인덱싱 테이블에서 적절한 페이지를 찾는다.
  - 200여 개의 ranking factor가 있음
    - Page Rank

- 인덱스 테이블 구조
  1. key - record identifier - additional info (freq, context, updated)

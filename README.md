# Pre-rendering Practice

## 1. 페이지 구성해 보기

## 1-1) [home page](https://github.com/HyeonJu-C/pre-rendering-practice/blob/main/pages/index.js)

```
- isFeatured 프로퍼티가 true로 설정된 이벤트 데이터 필요

- 현재 구현 사항으로는 이벤트의 isFeatured 속성을 바꿀 수 없기 때문에, home page에서 필요로 하는 데이터는 static data라고 생각했다.

❇️ getStaticProps을 이용해 이벤트 데이터를 컴포넌트에 전달
```

## 1-2) [all events page](https://github.com/HyeonJu-C/pre-rendering-practice/blob/main/pages/events/index.js)

```
- home page와 마찬가지로, 현재 구현사항으로 이벤트를 추가하는 작업을 하지 않기 때문에, all events 데이터는 static data라고 생각했다.

❇️ getStaticProps을 이용해 이벤트 데이터를 컴포넌트에 전달
```

## 1-3) [event detail page](https://github.com/HyeonJu-C/pre-rendering-practice/blob/main/pages/events/[eventId].js)

```
- 각 이벤트의 디테일 데이터도 static data라 판단했다.

- 뿐만 아니라 이벤트 데이터 자체가 적은 양이기 때문에, 모든 이벤트 페이지에 대해 pre-rendering을 준비하는 것도 나쁘지 않다고 생각했다.

❇️ getStaticProps을 이용해 이벤트 데이터를 컴포넌트에 전달

❇️ getStaticPaths을 이용해 pre-rendering할 페이지 경로 전달
```

## 1-4) [filtered events page](https://github.com/HyeonJu-C/pre-rendering-practice/blob/main/pages/events/[...slug].js)

```
- 이벤트 데이터가 static data 이긴 하지만, 이 page에 접근할 수 있는 경로가 무수히 많았다.

- 따라서 아래의 두 가지 방법을 생각했다.

- 2022/1, 2021/12와 같이 유효한 경로에 대해서만 pre-rendering을 준비하고, 유효하지 않은 경로에 대해서는 fallback 컴포넌트를 반환하는 방법

- client data fetching을 이용해서 요청이 발생했을 때 데이터를 불러오고 페이지를 rendering하는 방법

❇️ client side data fetching을 이용해 요청이 발생하면 데이터 불러오기
```

## 2. 강의 내용 정리

## 2-1) home page

```
- home page는 SEO를 고려해서 만들어야 한다.

- home page는 방문자에게 즉각적으로 보이는 것이 좋다.

- home page에서 보여주고 있는 데이터가 dynamic 하지 않다.

❗ 데이터가 낮은 빈도로 변경된다면, revalidate 옵션을 이용해서 특정 기간마다 새로운 페이지를 반환하도록 만들 수 있다.
```

## 2-2) event detail page

```
- detail page는 보통 static data로 구성되기 때문에, SSR 보다는 SSG 형식을 취하는 경우가 많다.

❗ detail page는 SEO의 관점에서 home page 보다도 훨씬 중요할 수 있다.

❗ 미리 생성해야 할 페이지가 수천 개라면 중요한 페이지만 사전에 생성하고, 다른 페이지는 fallback으로 보여줄 수 있다.
```

## 2-3) filtered events page

```
- SEO가 중요하고, 필터링 할 연도가 많지 않으면 SSG를 사용할 수 있다.

- SEO가 중요하고, 필터링 할 연도가 많다면 SSR을 사용할 수 있다.

- SEO가 중요하지 않다면, client side data fetching을 사용할 수 있다.
```

## 3. 에러 해결

```js
useEffect(() => {
  const getData = async () => {
    return await getFilteredEvents({
      year: numYear,
      month: numMonth,
    });
  };

  setIsLoading(true);
  getData() //
    .then(setFilteredEvents)
    .finally(() => setIsLoading(false));
}, [numYear, numMonth]);
```

```
- numYear, numMonth 값은 useRouter로 받아오기 때문에 useEffect의 dependency에 추가해 주지 않으면 값이 null인 상태로 getData 함수를 실행하게 된다.

+) useRouter 훅의 동작 원리 참조

+) 🤦‍♀️ esLint를 사용하면 이런 에러는 빨리 잡아낼 수 있다.
```

import { useEffect } from "react";
import { useQueries, UseQueryResult } from "react-query";
import { Lazy } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getTvSeries, IGetTvSeries } from "../api";
import { makeImagePath } from "../utils";
import { Banner, Main, Overview, Section, SliderTitle, Title, Wrapper } from "./Home";
import { SearchItem } from "./Search";

// Import Swiper styles
import 'swiper/css';
import "swiper/css/lazy";
import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import BigTvSeries from "../Components/BigTvSeries";

const genres = [{
  "id": 10759,
  "name": "액션 & 어드벤처"
},
{
  "id": 16,
  "name": "애니메이션"
},
{
  "id": 35,
  "name": "코미디"
},
{
  "id": 80,
  "name": "범죄"
},
{
  "id": 99,
  "name": "다큐멘터리"
},
{
  "id": 18,
  "name": "드라마"
},
{
  "id": 10751,
  "name": "가족"
},
{
  "id": 10762,
  "name": "키즈"
},
{
  "id": 9648,
  "name": "미스터리"
},
{
  "id": 10763,
  "name": "뉴스"
},
{
  "id": 10764,
  "name": "리얼리티"
},
{
  "id": 10765,
  "name": "공상과학 & 판타지"
},
{
  "id": 10766,
  "name": "연속극"
},
{
  "id": 10767,
  "name": "토크"
},
{
  "id": 10768,
  "name": "전쟁 & 정치"
},
{
  "id": 37,
  "name": "서부"
}];

const breakpoints = {
  688:{
    slidesPerView:4
  },
  992:{
    slidesPerView:5
  },
  1312:{
    slidesPerView:6
  }
};

function Tv(){
  const results = useQueries([
    {queryKey:["tv","popular"],queryFn:()=>getTvSeries("popular")},
    {queryKey:["tv","top_rated"],queryFn:()=>getTvSeries("top_rated")},
  ]) as UseQueryResult<IGetTvSeries>[];
  const isLoading = results.some(item => item.isLoading);
  const bigTvMatch = useMatch("/tv/:movieId");
  const navigate = useNavigate();
  const onBoxClicked = (movieId:number) => {
    setTimeout(()=>navigate(`/tv/${movieId}`),50);
    document.body.classList.add("stop-scroll");
  };
  useEffect(()=>{
    
  },[results]);
  return (
    <Wrapper>
      {!(isLoading) ? <>
      <Banner bgPhoto={makeImagePath(results[0].data?.results[0].backdrop_path || "")}>
        <Title>{results[0].data?.results[0].name}</Title>
        <Overview>{results[0].data?.results[0].overview}</Overview>
      </Banner>
      <Main>
        <Section>
          <SliderTitle>지금 인기있는 드라마</SliderTitle>
          <Swiper modules={[Lazy]} slidesPerView={3} spaceBetween={10} breakpoints={breakpoints} lazy={true} className="tvPopularSwiper">
          {results[0].data?.results.slice(1).map(tv=>
            <SwiperSlide key={tv.id}>
              <SearchItem layoutId={tv.id+""} onClick={()=>onBoxClicked(tv.id)}>
                <img data-src={makeImagePath(tv.poster_path || "", "w500")} className="swiper-lazy" />
              </SearchItem>
            </SwiperSlide>
          )}
          </Swiper>
        </Section>
        <Section>
          <SliderTitle>최고 평점 드라마</SliderTitle>
          <Swiper modules={[Lazy]} slidesPerView={3} spaceBetween={10} breakpoints={breakpoints} lazy={true} className="tvTopRatedSwiper">
          {results[1].data?.results.slice(1).map(tv=>
            <SwiperSlide key={tv.id}>
              <SearchItem layoutId={tv.id+""} onClick={()=>onBoxClicked(tv.id)}>
                <img data-src={makeImagePath(tv.poster_path || "", "w500")} className="swiper-lazy" />
              </SearchItem>
            </SwiperSlide>
          )}
          </Swiper>
        </Section>
      </Main>
      </>
      : "loading..." }
      <AnimatePresence onExitComplete={()=>document.body.classList.remove("stop-scroll")}>
        {bigTvMatch ? <BigTvSeries clickedId={bigTvMatch?.params.movieId!}></BigTvSeries> : null}
      </AnimatePresence>
    </Wrapper>
    
  );
}
export default Tv;
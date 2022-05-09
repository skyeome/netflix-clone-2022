import { useEffect } from "react";
import { useQueries, UseQueryResult } from "react-query";
import { Lazy } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getTvSeries, IGetTvSeries } from "../api";
import { makeImagePath } from "../utils";
import { Banner, genreType, Main, Overview, Section, SliderTitle, Title, ViewBtn, Wrapper } from "./Home";
import { SearchItem } from "./Search";

// Import Swiper styles
import 'swiper/css';
import "swiper/css/lazy";
import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import BigTvSeries from "../Components/BigTvSeries";
import { Genres } from "../Components/BigMovie";
import { boxVariants } from "../Components/Slider";

const genres:genreType = {
  10759:"액션 & 어드벤처",
  16:"애니메이션",
  35:"코미디",
  80:"범죄",
  99:"다큐멘터리",
  18:"드라마",
  10751:"가족",
  10762:"키즈",
  9648:"미스터리",
  10763:"뉴스",
  10764:"리얼리티",
  10765:"공상과학 & 판타지",
  10766:"연속극",
  10767:"토크",
  10768:"전쟁 & 정치",
  37:"서부",
};
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
        {results[0].data?.results[0].genre_ids ? <Genres>{results[0].data?.results[0].genre_ids.map(g=><span key={g}>{genres[g]}</span>)}</Genres> : null}
        <Title>{results[0].data?.results[0].name}</Title>
        <Overview>{results[0].data?.results[0].overview}</Overview>
        <div>
          <ViewBtn 
          variants={boxVariants}
          initial="normal"
          transition={{type:"tween"}}
          onTap={()=>onBoxClicked(results[0].data?.results[0].id!)}
          layoutId={results[0].data?.results[0].id+""}>자세히 보기</ViewBtn>
        </div>
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
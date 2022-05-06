import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearch } from "../api";
import { makeImagePath } from "../utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { AnimatePresence, motion } from "framer-motion";
import BigMovie from "../Components/BigMovie";
import { SliderTitle } from "./Home";
import BigTvSeries from "../Components/BigTvSeries";


const Wrapper = styled.div`
  padding:0 30px;
  //display: flex;
`;

const TopSpace = styled.div`
  padding:100px 0 0;
`;

const Section = styled.section`
  margin-bottom:3rem;
`;
const Titles = styled.div`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom:3em;
  li{
    padding:6px 10px;
    margin:5px 5px 5px 0;
    background-color: ${props=>props.theme.black.lighter};
    border-radius: 20px;
    font-size:13px;
    @media screen and (min-width: 43rem) {
      padding:6px 9px;
      font-size:14px;
    }
    @media screen and (min-width: 62rem) {
      padding:8px 12px;
      font-size:14px;
    }
    @media screen and (min-width: 82rem) {
      padding:.8em 1.2em;
      font-size:0.9em;
    }
  }
`;
export const SearchItem = styled(motion.div)`

  img{
    max-width: 100%;
    vertical-align: top;
  }
`;
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

function Search(){
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const {data,isLoading} = useQuery<IGetSearch>(["search",keyword],()=>getSearch(keyword!),{enabled:!!keyword});
  const bigMovieMatch = useMatch("/search/movie/:movieId");
  const bigTvMatch = useMatch("/search/tv/:tvId");
  const navigate = useNavigate();
  const onBoxClicked = (movieId:number,keyword:string) => {
    setTimeout(()=>navigate(`/search/movie/${movieId}?keyword=${keyword}`),50);
    document.body.classList.add("stop-scroll");
  };
  const onTvBoxClicked = (tvId:number, keyword:string) => {
    setTimeout(()=>navigate(`/search/tv/${tvId}?keyword=${keyword}`),50);
    document.body.classList.add("stop-scroll");
  };
  return (<>
    <TopSpace />
    <Wrapper>
      {isLoading ? "loading..." : <>
        <SliderTitle>연관 검색어</SliderTitle>
        <Titles>{data?.results.filter(item=>item.media_type === "movie").map(item=><li key={"word"+item.id}>{item.title}</li>)}</Titles>
        <main>
          <Section>
            <SliderTitle>영화</SliderTitle>
            <Swiper slidesPerView={3} spaceBetween={10} breakpoints={breakpoints} className="movieSwiper">
              {data?.results.filter(item=>item.media_type === "movie").map(item=><SwiperSlide key={"result"+item.id}><SearchItem layoutId={item.id+""} onClick={()=>onBoxClicked(item.id,keyword!)}>{item.poster_path !== null ? <img src={makeImagePath(item.poster_path || "","w500")} alt={item.title} /> : item.title}</SearchItem></SwiperSlide>)}
            </Swiper>
          </Section>
          <Section>
            <SliderTitle>TV 시리즈</SliderTitle>
            <Swiper slidesPerView={3} spaceBetween={10} breakpoints={breakpoints} className="tvSwiper">
              {data?.results.filter(item=>item.media_type === "tv").map(item=><SwiperSlide key={"result"+item.id}><SearchItem layoutId={item.id+""} onClick={()=>onTvBoxClicked(item.id,keyword!)}>{item.poster_path !== null ? <img src={makeImagePath(item.poster_path || "","w500")} alt={item.title} /> : null}</SearchItem></SwiperSlide>)}
            </Swiper>
          </Section>
        </main>
      </>}
    </Wrapper>
    <AnimatePresence onExitComplete={()=>document.body.classList.remove("stop-scroll")}>
      {bigMovieMatch ? <BigMovie clickedId={bigMovieMatch?.params.movieId!}></BigMovie> : null}
    </AnimatePresence>
    <AnimatePresence onExitComplete={()=>document.body.classList.remove("stop-scroll")}>
      {bigTvMatch ? <BigTvSeries clickedId={bigTvMatch?.params.tvId!}></BigTvSeries> : null}
    </AnimatePresence>
    </>
  )
}
export default Search;
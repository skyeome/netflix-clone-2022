import { motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieCredits, getMovieDetail, IGetMovieDetail, IMovieCredits, Result } from "../api";
import { makeImagePath } from "../utils";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar,Lazy } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/lazy";
import "swiper/css/scrollbar";
import { breakpoints, SearchItem } from "../Routes/Search";
import { SliderTitle } from "../Routes/Home";

export const Overlay = styled(motion.div)`
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background-color:rgba(0,0,0,.5);
  opacity: 0;
  z-index: 100;
`;
export const MovieModal = styled(motion.div)`
  position:absolute;
  width:100vw;
  max-width:640px;
  height: calc(100vh - 100px);
  background-color:${props=>props.theme.black.darker};
  top:60px;
  left:0;
  right:0;
  margin:0 auto;
  border-radius: 10px;
  overflow: auto;
  z-index: 100;
  @media screen and (min-width: 43rem) {
    width:92vw;
    top:60px;
  }
  @media screen and (min-width: 62rem) {
    width:88vw;
    top:80px;
  }
  @media screen and (min-width: 82rem) {
    width:80vw;
    top:100px;
  }
`;

export const HomeLink = styled.a`
  position: absolute;
  top:20px;
  right:20px;
  stroke: white;
`;

export const ScrollArea = styled.div``;

export const BigCover = styled.div<{bgPhoto:string}>`
  background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,.4), rgba(0,0,0,1)), url(${props=>props.bgPhoto}) center center/cover no-repeat;
  padding-top:56.25%;
  width: 100%;
  position: relative;
`;

export const BigTitle = styled.div`
  position: absolute;
  bottom:20px;
  left:30px;
  width: calc(100% - 60px);
  h3{
    font-size: 1.25rem;
    margin-bottom: 0.8rem;
    @media screen and (min-width: 43rem) {
      font-size: 1.3rem;
    }
    @media screen and (min-width: 62rem) {
      font-size: 1.6rem;
    }
    @media screen and (min-width: 82rem) {
      font-size: 2em;
    }
  }
  h4{
    font-size: 0.9em;
    margin-bottom:8px;
    font-weight: 300;
    color:${props=>props.theme.white.darker};
    @media screen and (min-width: 43rem) {
      font-size: 1rem;
    }
    @media screen and (min-width: 62rem) {
      font-size: 1rem;
    }
    @media screen and (min-width: 82rem) {
      font-size: 1.1em;
    }
  }
`;

export const BigContent = styled.div`
  padding:20px 30px;
  blockquote{
    border-left:2px solid #0b57ef;
    padding:12px 0 12px 20px;
    line-height: 1.5;
    font-weight:300;
    color:rgba(255,255,255,.8);
    font-style: italic;
    margin-bottom:2em;
    font-size: 15px;
    @media screen and (min-width: 43rem) {
      font-size: 16px;
    }
    @media screen and (min-width: 62rem) {
      font-size: 18px;
    }
    @media screen and (min-width: 82rem) {
      font-size: 20px;
    }
  }
`;

export const Genres = styled.div`
  display: flex;
  margin-bottom:1rem;
  span{
    font-size: 13px;
    font-weight: 300;
    padding: 6px 8px;
    display: block;
    background-color: rgba(255,255,255,.2);
    border-radius: 3px;
    margin:0 2px;
  }
`;

export const BigOverView = styled.p`
  font-size: 13px;
  line-height:1.5;
  font-weight: 300;
  margin-bottom:1.2em;
  @media screen and (min-width: 43rem) {
    font-size: 14px;
  }
  @media screen and (min-width: 62rem) {
    font-size: 16px;
  }
  @media screen and (min-width: 82rem) {
    font-size: 18px;
  }
`;
export const SmallTitle = styled.h3`
  font-size: 15px;
  line-height:1.5;
  font-weight: 400;
  margin-bottom:1.2em;
  @media screen and (min-width: 43rem) {
    font-size: 16px;
  }
  @media screen and (min-width: 62rem) {
    font-size: 18px;
  }
  @media screen and (min-width: 82rem) {
    font-size: 20px;
  }
`;
export const ActorName = styled.p`
  font-weight:400;
  font-size:14px;
  margin:.5em 0 0;
  line-height:1.4;
`;
export const CharacterName = styled.p`
  font-weight:300;
  color:rgba(255,255,255,.5);
  font-size:13px;
  line-height:1.4;
`;

interface IBigMovieProps{
  clickedId:string;
}

function BigMovie({clickedId}:IBigMovieProps){
  const {scrollY} = useViewportScroll();
  const {data:detail,isLoading:bigIsLoading} = useQuery<IGetMovieDetail>(["movie","detail"],()=> getMovieDetail(clickedId),{enabled:!!clickedId});
  const {data:credits,isLoading:creditsLoading} = useQuery<IMovieCredits>(["movie","credit"],()=> getMovieCredits("movie",clickedId),{enabled:!!clickedId});
  const onOverlayClick = () => window.history.back();
  return <>
    <Overlay onClick={onOverlayClick} animate={{opacity:1}} exit={{opacity:0}} />
    <MovieModal layoutId={clickedId} style={{top:scrollY.get() + 66}}>
      <ScrollArea>
        {detail ? <>
          <BigCover bgPhoto={makeImagePath(detail.backdrop_path || "", "w500")} >
            <BigTitle>
              {detail.genres ? <Genres>{detail?.genres.map(g=><span key={g.id}>{g.name}</span>)}</Genres> : null}
              <h3>{detail.title}</h3>
              {detail.original_title ? <h4>{detail?.original_title} ・ {detail?.release_date.toString().substring(0,4)}</h4>:null}
              <p>⭐️ {detail?.vote_average}</p>
            </BigTitle>
            {detail?.homepage !== "" ? <>
            <HomeLink href={detail?.homepage} target="_blank" rel="noreferrer"><img src={`${process.env.PUBLIC_URL}/home.svg`} /></HomeLink>
            </> : null}
          </BigCover>
          <BigContent>
            <blockquote>{detail?.tagline}</blockquote>
            <SmallTitle>줄거리</SmallTitle>
            <BigOverView>{detail.overview}</BigOverView>
            {detail?.homepage !== "" ? <>
            🏠 <a href={detail?.homepage} target="_blank" rel="noreferrer">{detail?.homepage}</a>
            </> : null}
          </BigContent>
        </> : null}
        {credits ? <>
          <BigContent>
            <SmallTitle>출연</SmallTitle>
            <Swiper
              slidesPerView={3}
              spaceBetween={8}
              modules={[Scrollbar,Lazy]}
              breakpoints={breakpoints}
              lazy={true} 
              className="creditsSwiper"
            >
              {credits.cast.slice(0,9).map(person => 
              <SwiperSlide key={person.id}>
                <SearchItem>
                  <div>
                    {person.profile_path ? <img data-src={makeImagePath(person.profile_path || "","w500")} alt={person.name} className="swiper-lazy" /> : null}
                  </div>
                  <div>
                    <ActorName>{person.name}</ActorName>
                    <CharacterName>{person.character}</CharacterName>
                  </div>
                </SearchItem>
              </SwiperSlide>)}
            </Swiper>
          </BigContent>
          
        </> : null}
      </ScrollArea>
    </MovieModal>
  </>;
};
export default BigMovie;
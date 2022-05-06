import { motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail, Result } from "../api";
import { makeImagePath } from "../utils";

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
  background-color:${props=>props.theme.black.darker};
  top:60px;
  left:0;
  right:0;
  margin:0 auto;
  border-radius: 10px;
  overflow: hidden;
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

interface IBigMovieProps{
  clickedId:string;
}

function BigMovie({clickedId}:IBigMovieProps){
  const {scrollY} = useViewportScroll();
  const {data:detail,isLoading:bigIsLoading} = useQuery<IGetMovieDetail>(["movie","detail"],()=> getMovieDetail(clickedId),{enabled:!!clickedId});
  const onOverlayClick = () => window.history.back();
  return <>
    <Overlay onClick={onOverlayClick} animate={{opacity:1}} exit={{opacity:0}} />
    <MovieModal layoutId={clickedId} style={{top:scrollY.get() + 66}}>
      {detail ? <>
        <BigCover bgPhoto={makeImagePath(detail.backdrop_path || "", "w500")} >
          <BigTitle>
            {detail.genres ? <Genres>{detail?.genres.map(g=><span key={g.id}>{g.name}</span>)}</Genres> : null}
            <h3>{detail.title}</h3>
            {detail.original_title ? <h4>{detail?.original_title} ・ {detail?.release_date.toString().substring(0,4)}</h4>:null}
            <p>⭐️ {detail?.vote_average}</p>
          </BigTitle>
        </BigCover>
        <BigContent>
          <blockquote>{detail?.tagline}</blockquote>
          <BigOverView>{detail.overview}</BigOverView>
          {detail?.homepage !== "" ? <>
          🏠 <a href={detail?.homepage} target="_blank" rel="noreferrer">{detail?.homepage}</a>
          </> : null}
        </BigContent>
      </> : null}
    </MovieModal>
  </>;
};
export default BigMovie;
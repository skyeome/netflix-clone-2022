import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies, IGetMoviesTopRated } from "../api";
import { makeImagePath } from "../utils";
import Slider, { boxVariants } from "../Components/Slider";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import BigMovie, { Genres } from "../Components/BigMovie";



export const Wrapper = styled.div`
  overflow-x: hidden;
  padding:0 0 60px;
`;

const Loader = styled.div`
  height:20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{bgPhoto:string}>`
  height: clamp(30rem, 75vh ,36rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding:15px;
  padding-bottom:4rem;
  background-image: linear-gradient( rgba(19, 16, 16,0.25),rgba(0,0,0,1) 70%), url(${props=>props.bgPhoto});
  background-position: top center;
  background-size:160%;
  background-repeat: no-repeat;
  @media screen and (min-width: 43rem) {
    height: clamp(43rem, 100vh ,62rem);
    justify-content: center;
    padding:20px;
    padding-bottom:0px;
    background-image: linear-gradient(rgb(19, 16, 16,0),rgba(19, 16, 16,.7), rgba(0,0,0,1)), url(${props=>props.bgPhoto});
    background-size:cover;
  }
  @media screen and (min-width: 62rem) {
    padding:30px;
  }
  @media screen and (min-width: 82rem) {
    padding:60px;
  }
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  @media screen and (min-width: 43rem) {
    font-size: 3rem;
  }
  @media screen and (min-width: 62rem) {
    font-size: 4rem;
  }
  @media screen and (min-width: 82rem) {
    font-size: 66px;
  }
`;

export const Overview = styled.p`
  font-size: 13px;
  line-height:1.5;
  max-width: 540px;
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

export const ViewBtn = styled(motion.div)`
  cursor: pointer;
  display: inline-block;
  padding:.8em 1.2em;
  margin-top:2em;
  background-color: white;
  border-radius: 8px;
  color:${props=>props.theme.black.lighter};
`;

export const Main = styled.main`
  margin-top:0;
  @media screen and (min-width: 43rem) {
    margin-top:-150px;
  }
  @media screen and (min-width: 62rem) {
    
  }
  @media screen and (min-width: 82rem) {
    
  }
`;

export const Section = styled.section`
  padding:0 15px;
  margin-bottom:3rem;
  @media screen and (min-width: 43rem) {
    padding:0 20px;
  }
  @media screen and (min-width: 62rem) {
    padding:0 30px;
  }
  @media screen and (min-width: 82rem) {
    padding:0 60px;
  }
`;


export const SliderTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1em;
  @media screen and (min-width: 43rem) {
    font-size: 1.5rem;
  }
  @media screen and (min-width: 62rem) {
    font-size: 2rem;
  }
  @media screen and (min-width: 82rem) {
    font-size: 3rem;
  }
`;

export type genreType = {
  [key:number]:string;
}

const genres:genreType = {
  28 : "액션",
  12 : "모험",
  16 : "애니메이션",
  35 : "코미디",
  80 : "범죄",
  99 : "다큐멘터리",
  18 : "드라마",
  10751 : "가족",
  14 : "판타지",
  36 : "역사",
  27 : "공포",
  10402 : "음악",
  9648 : "미스터리",
  10749 : "로맨스",
  878 : "SF",
  10770 : "TV 영화",
  53 : "스릴러",
  10752 : "전쟁",
  37 : "서부",
};

function Home(){
  const {data,isLoading} = useQuery<IGetMovies>(["movies","nowPlaying"],()=>getMovies("now_playing"));
  const {data:topRated, isLoading:topIsLoading} = useQuery<IGetMoviesTopRated>(["movies","topRated"],()=>getMovies("top_rated"));
  const bigMovieMatch = useMatch("/movies/:movieId");
  const navigation = useNavigate();
  const onBoxClicked = (movieId:number) => {
    setTimeout(()=>navigation(`/movies/${movieId}`),50);
    document.body.classList.add("stop-scroll");
  };
  return <Wrapper>
    {isLoading && topIsLoading ? <Loader>Loading...</Loader> : <>
      <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        {data?.results[0].genre_ids ? <Genres>{data?.results[0].genre_ids.map(g=><span key={g}>{genres[g]}</span>)}</Genres> : null}
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
        <div>
          <ViewBtn 
          variants={boxVariants}
          initial="normal"
          transition={{type:"tween"}}
          onTap={()=>onBoxClicked(data?.results[0].id!)}
          layoutId={data?.results[0].id+""}>자세히 보기</ViewBtn>
        </div>
      </Banner>
      <Main>
        <Section>
          <SliderTitle>극장 동시상영</SliderTitle>
          <Slider data={data!} />
        </Section>
        <Section>
          <SliderTitle>최고 평점 영화</SliderTitle>
          <Slider data={topRated!} />
        </Section>
        <AnimatePresence onExitComplete={()=>document.body.classList.remove("stop-scroll")}>
          {bigMovieMatch ? <BigMovie clickedId={bigMovieMatch?.params.movieId!}></BigMovie> : null}
        </AnimatePresence>
      </Main>
    </>}
    
  </Wrapper>;

}
export default Home;

function onBoxClicked(id: any): void {
  throw new Error("Function not implemented.");
}

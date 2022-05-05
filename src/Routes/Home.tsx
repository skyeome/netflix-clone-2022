import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies, IGetMoviesTopRated } from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";
import { AnimatePresence } from "framer-motion";
import { useMatch } from "react-router-dom";
import BigMovie from "../Components/BigMovie";



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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding:15px;
  background-image: linear-gradient(rgb(19, 16, 16,0),rgba(19, 16, 16,.7), rgba(0,0,0,1)), url(${props=>props.bgPhoto});
  background-size:cover;
  @media screen and (min-width: 43rem) {
    padding:20px;
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

export const Main = styled.main`
  margin-top:-150px;
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




function Home(){
  const {data,isLoading} = useQuery<IGetMovies>(["movies","nowPlaying"],()=>getMovies("now_playing"));
  const {data:topRated, isLoading:topIsLoading} = useQuery<IGetMoviesTopRated>(["movies","topRated"],()=>getMovies("top_rated"));
  const bigMovieMatch = useMatch("/movies/:movieId");
  return <Wrapper>
    {isLoading && topIsLoading ? <Loader>Loading...</Loader> : <>
      <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
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
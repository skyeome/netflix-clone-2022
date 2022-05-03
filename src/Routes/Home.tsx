import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";



const Wrapper = styled.div`
  overflow-x: hidden;
  padding:0 0 60px;
`;

const Loader = styled.div`
  height:20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto:string}>`
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

const Title = styled.h2`
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

const Overview = styled.p`
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

const Section = styled.section`
  padding:0 15px;
  margin-top:-150px;
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


const SliderTitle = styled.h3`
  font-size: 2rem;
  margin-bottom:20px;
`;



function Home(){
  const {data,isLoading} = useQuery<IGetMovies>(["movies","nowPlaying"],getMovies);

  return <Wrapper>
    {isLoading ? <Loader>Loading...</Loader> : <>
      <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
      </Banner>
      <Section>
        <SliderTitle>극장 동시상영</SliderTitle>
        <Slider data={data!} />
      </Section>
    </>}
  </Wrapper>;
}
export default Home;
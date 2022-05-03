import { AnimatePresence, motion, PanInfo, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail, IGetMovies } from "../api";
import { makeImagePath } from "../utils";
(function() {
  var throttle = function(type:string, name:string, obj?:any) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle("resize", "optimizedResize");
})();

const SlideWrap = styled.div`
  position:relative;
  padding-top: 33%;
`;

const Row = styled(motion.div)`
  display:grid;
  gap:6px;
  grid-template-columns: repeat(3,1fr);
  position: absolute;
  top:0;
  width: 100%;
  @media screen and (min-width: 43rem) {
    grid-template-columns: repeat(4,1fr);
  }
  @media screen and (min-width: 62rem) {
    grid-template-columns: repeat(5,1fr);
  }
  @media screen and (min-width: 82rem) {
    grid-template-columns: repeat(6,1fr);
  }
`;

const Box = styled(motion.div)`
  border-radius: 5px;
  cursor: pointer;
  &:first-child{
    transform-origin: center left;
  }
  &:last-child{
    transform-origin: center right;
  }
`;

const Thumbnail = styled.div`
  aspect-ratio: 1 / 1.5;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
    -webkit-user-drag: none;
  }
`;

const Info = styled(motion.div)`
  opacity: 0;
  padding:20px;
  background-color:${props=>props.theme.black.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background-color:rgba(0,0,0,.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{}>`
  position:absolute;
  width:80vw;
  max-width:640px;
  height:80vh;
  background-color:${props=>props.theme.black.darker};
  left:0;
  right:0;
  margin:0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

const BigCover = styled.div<{bgPhoto:string}>`
  background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,.4), rgba(0,0,0,1)), url(${props=>props.bgPhoto}) center center/cover no-repeat;
  padding-top:56.25%;
  width: 100%;
  position: relative;
`;

const BigTitle = styled.div`
  position: absolute;
  bottom:20px;
  left:30px;
  width: calc(100% - 60px);
  h3{
    font-size: 2em;
    margin-bottom: 0.8rem;
  }
  h4{
    font-size: 1.1em;
    font-weight: 300;
    color:${props=>props.theme.white.darker};
  }
`;

const BigContent = styled.div`
  padding:20px 30px;
`;

const Genres = styled.div`
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

const BigOverView = styled.p`
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
let padding = 30;
const rowVariants = {
  hidden:(isBack:boolean)=>{
    return ({
      x:!isBack ? window.innerWidth - padding : -window.innerWidth + padding,
    })
  },
  visible:{
    x:0,
  },
  exit:(isBack:boolean)=>{ 
    return ({
      x:!isBack ? -window.innerWidth + padding : window.innerWidth - padding
    })
  }
};
const boxVariants = {
  normal:{
    scale:1
  },
  hover:{
    zIndex:99,
    scale:1.2,
    y:-60,
    transition:{
      type:"tween",
      delay:.4,
      duration:.3
    }
  }
};

const infoVariants = {
  hover:{
    opacity:1
  }
}

const breakpoints = {
  mobile:{slidePerView: 3, padding:30},
  tablet:{slidePerView: 4, padding:40},
  laptop:{slidePerView: 5, padding:60},
  pc:{slidePerView: 6, padding:120},
}

interface ISliderProps{
  data: IGetMovies;
}

function Slider({data}:ISliderProps){
  const [offset,setOffset] = useState(3);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie=>movie.id + "" === bigMovieMatch.params.movieId);
  const {data:detail,isLoading} = useQuery<IGetMovieDetail>(["movie","detail"],()=> getMovieDetail(bigMovieMatch?.params.movieId),{enabled:!!clickedMovie});
  const {scrollY} = useViewportScroll();
  const [index,setIndex] = useState(0);
  const [leaving,setLeaving] = useState(false);
  const [isBack,setIsBack] = useState(false);
  const increaseIndex = () => {
    if(data){
      if(leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev=> maxIndex <= prev ? 0 : prev+1);
    }
    
  }
  const decreaseIndex = () => {
    if(data){
      if(leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev=> prev<=0 ? maxIndex : prev-1);
    }
  };
  const toggleLeaving = () => setLeaving((prev)=>!prev);
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    
    if(info.velocity.x < -100){
      setIsBack(false);
      increaseIndex();
    }
    if(info.velocity.x > 100) {
      setIsBack(true);
      decreaseIndex();
    }
  };
  const navigation = useNavigate();
  const onOverlayClick = () => window.history.back();
  const onBoxClicked = (movieId:number) => {
    navigation(`movies/${movieId}`);
    document.body.classList.add("stop-scroll");
  };
  useEffect(()=>{
    const resizeHandler = () => {
      if(window.innerWidth <= 688){
        setOffset(breakpoints["mobile"].slidePerView);
        padding = breakpoints["mobile"].padding;
      }
      if(window.innerWidth > 688){
        setOffset(breakpoints["tablet"].slidePerView);
        padding = breakpoints["tablet"].padding;
      }
      if(window.innerWidth > 992){
        setOffset(breakpoints["laptop"].slidePerView);
        padding = breakpoints["laptop"].padding;
      }
      if(window.innerWidth > 1312){
        setOffset(breakpoints["pc"].slidePerView);
        padding = breakpoints["pc"].padding;
      }
    }
    resizeHandler();
    
    
    // handle event
    window.addEventListener("optimizedResize", resizeHandler);
    return ()=>{
      // handle event
      window.removeEventListener("optimizedResize", resizeHandler);
    }
  },[]);
  return (
  <>
  <SlideWrap>
    <AnimatePresence custom={isBack} initial={false} onExitComplete={toggleLeaving}>
      <Row 
        custom={isBack}
        drag="x"
        dragSnapToOrigin
        onDragEnd={handleDragEnd}
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{type:"tween", duration:1}}
        key={index}>
        {data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie=>
        <Box 
          key={movie.id} 
          variants={boxVariants}
          initial="normal"
          whileHover="hover"
          transition={{type:"tween"}}
          onTap={()=>onBoxClicked(movie.id)}
          layoutId={movie.id+""} 
        >
          <Thumbnail>
            <img src={makeImagePath(movie.poster_path || "","w500")} alt={movie.title} />
          </Thumbnail>
          <Info variants={infoVariants} >
            <h4>{movie.title}</h4>
          </Info>
        </Box>)}
      </Row>
    </AnimatePresence>
  </SlideWrap>
  <AnimatePresence onExitComplete={()=>document.body.classList.remove("stop-scroll")}>
    {bigMovieMatch && !isLoading ? 
    <>
      <Overlay onClick={onOverlayClick} animate={{opacity:1}} exit={{opacity:0}} />
      <BigMovie layoutId={bigMovieMatch.params.movieId} style={{top:scrollY.get() + 100}}>
        {clickedMovie ? <>
          <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path || "", "w500")} >
            <BigTitle>
              <Genres>{detail?.genres.map(g=><span key={g.id}>{g.name}</span>)}</Genres>
              <h3>{clickedMovie.title}</h3>
              <h4>{detail?.original_title} ・ {detail?.release_date.toString().substring(0,4)}</h4>
              <p>⭐️ {detail?.vote_average}</p>
            </BigTitle>
          </BigCover>
          <BigContent>
            <blockquote>{detail?.tagline}</blockquote>
            <BigOverView>{clickedMovie.overview}</BigOverView>
            🏠 <a href={detail?.homepage} target="_blank" rel="noreferrer">{detail?.homepage}</a>
          </BigContent>
        </> : null}
      </BigMovie>
    </> : null}
  </AnimatePresence>
  </>
  );
}
export default Slider;
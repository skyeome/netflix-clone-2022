import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMovies, IGetMoviesTopRated } from "../api";
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
  padding-top: 50%;
  @media screen and (min-width: 43rem) {
    padding-top: 38%;
  }
  @media screen and (min-width: 62rem) {
    padding-top: 36%;
  }
  @media screen and (min-width: 82rem) {
    padding-top: 33%;
  }
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
//let offset = 3;
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
  mobile:{slidePerView: 3, padding:30, top: 60},
  tablet:{slidePerView: 4, padding:40, top: 80},
  laptop:{slidePerView: 5, padding:60, top: 80},
  pc:{slidePerView: 6, padding:120, top: 100},
}

interface ISliderProps{
  data: IGetMovies | IGetMoviesTopRated;
}

function Slider({data}:ISliderProps){
  const [offset, setOffset] = useState(3);
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
  const onBoxClicked = (movieId:number) => {
    setTimeout(()=>navigation(`/movies/${movieId}`),50);
    document.body.classList.add("stop-scroll");
  };
  useEffect(()=>{
    const resizeHandler = () => {
      if(window.innerWidth <= 688){
        //offset = breakpoints["mobile"].slidePerView;
        setOffset(breakpoints["mobile"].slidePerView);
        padding = breakpoints["mobile"].padding;
      }
      if(window.innerWidth > 688){
        //offset = breakpoints["tablet"].slidePerView;
        setOffset(breakpoints["tablet"].slidePerView);
        padding = breakpoints["tablet"].padding;
      }
      if(window.innerWidth > 992){
        //offset = breakpoints["laptop"].slidePerView;
        setOffset(breakpoints["laptop"].slidePerView);
        padding = breakpoints["laptop"].padding;
      }
      if(window.innerWidth > 1312){
        //offset = breakpoints["pc"].slidePerView;
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
  </>
  );
}
export default Slider;
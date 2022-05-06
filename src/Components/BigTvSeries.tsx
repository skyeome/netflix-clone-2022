import { useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { getTvDetail, IGetTvDetail } from "../api";
import { makeImagePath } from "../utils";
import { BigContent, BigCover, BigOverView, BigTitle, Genres, MovieModal, Overlay } from "./BigMovie";

interface IBigTvProps{
  clickedId:string;
}

function BigTvSeries({clickedId}:IBigTvProps){
  const {scrollY} = useViewportScroll();
  const {data:detail,isLoading:bigIsLoading} = useQuery<IGetTvDetail>(["tv","detail"],()=> getTvDetail(clickedId),{enabled:!!clickedId});
  const onOverlayClick = () => window.history.back();
  return <>
  <Overlay onClick={onOverlayClick} animate={{opacity:1}} exit={{opacity:0}} />
  <MovieModal layoutId={clickedId} style={{top:scrollY.get() + 66}}>
    {detail ? <>
      <BigCover bgPhoto={makeImagePath(detail.backdrop_path || "", "w500")} >
        <BigTitle>
          <Genres>{detail?.genres.map(g=><span key={g.id}>{g.name}</span>)}</Genres>
          <h3>{detail.name}</h3>
          <h4>{detail?.original_name} ・ {detail?.first_air_date.toString().substring(0,4)}</h4>
          <p>⭐️ {detail?.vote_average}</p>
        </BigTitle>
      </BigCover>
      <BigContent>
        <blockquote>{detail?.tagline}</blockquote>
        <BigOverView>{detail?.overview}</BigOverView>
        {detail?.homepage !== "" ? <>
        🏠 <a href={detail?.homepage} target="_blank" rel="noreferrer">{detail?.homepage}</a>
        </> : null}
      </BigContent>
    </> : null}
  </MovieModal>
</>;
}
export default BigTvSeries;
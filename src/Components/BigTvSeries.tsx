import { useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import {
  getMovieCredits,
  getTvDetail,
  IGetTvDetail,
  IMovieCredits,
} from "../api";
import { breakpoints, SearchItem } from "../Routes/Search";
import { makeImagePath } from "../utils";
import {
  ActorName,
  BigContent,
  BigCover,
  BigOverView,
  BigTitle,
  CharacterName,
  Genres,
  HomeLink,
  MovieModal,
  Overlay,
  ScrollArea,
  SmallTitle,
} from "./BigMovie";
import styled from "styled-components";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Lazy } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/lazy";
import "swiper/css/scrollbar";
import { useLocation, useNavigate } from "react-router-dom";

const Episode = styled.div`
  display: flex;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.black.lighter};
  border-radius: 10px;
  @media screen and (min-width: 82rem) {
    align-items: center;
  }
`;
const StillImg = styled.div`
  flex: 4;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    vertical-align: top;
    @media screen and (min-width: 43rem) {
      font-size: 1rem;
      width: auto;
      height: auto;
      max-width: 100%;
    }
  }
`;
const EpisodeTxt = styled.div`
  flex: 6;
  padding: 0.8em 1.5em;
  h5 {
    font-weight: 400;
    font-size: 1rem;
    margin-bottom: 0.8rem;
    @media screen and (min-width: 43rem) {
      font-size: 1rem;
    }
    @media screen and (min-width: 62rem) {
      font-size: 1rem;
    }
    @media screen and (min-width: 82rem) {
      font-size: 1.2em;
    }
  }
  p {
    font-size: 0.9em;
    margin-bottom: 8px;
    font-weight: 300;
    color: ${(props) => props.theme.white.darker};
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

interface IBigTvProps {
  clickedId: string;
}

interface RouteState {
  state: {
    type: string;
  };
}

function BigTvSeries({ clickedId }: IBigTvProps) {
  const {
    state: { type },
  } = useLocation() as RouteState;
  const { scrollY } = useViewportScroll();
  const { data: detail, isLoading: bigIsLoading } = useQuery<IGetTvDetail>(
    ["tv", "detail"],
    () => getTvDetail(clickedId),
    { enabled: !!clickedId }
  );
  const { data: credits, isLoading: creditsIsLoading } =
    useQuery<IMovieCredits>(["tv", "credits"], () =>
      getMovieCredits("tv", clickedId)
    );
  const navigate = useNavigate();
  const onOverlayClick = () => navigate("/tv", { state: { type: type } });
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <MovieModal
        layoutId={clickedId + type}
        style={{ top: scrollY.get() + 66 }}
      >
        <ScrollArea>
          {detail ? (
            <>
              <BigCover
                bgPhoto={makeImagePath(detail.backdrop_path || "", "w500")}
              >
                <BigTitle>
                  <Genres>
                    {detail?.genres.map((g) => (
                      <span key={g.id}>{g.name}</span>
                    ))}
                  </Genres>
                  <h3>{detail.name}</h3>
                  <h4>
                    {detail?.original_name} ・{" "}
                    {detail?.first_air_date.toString().substring(0, 4)}
                  </h4>
                  <p>⭐️ {detail?.vote_average}</p>
                </BigTitle>
                {detail?.homepage !== "" ? (
                  <>
                    <HomeLink
                      href={detail?.homepage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={`${process.env.PUBLIC_URL}/home.svg`} />
                    </HomeLink>
                  </>
                ) : null}
              </BigCover>
              <BigContent>
                {detail.tagline ? (
                  <blockquote>{detail?.tagline}</blockquote>
                ) : null}
                {detail?.overview ? (
                  <>
                    <SmallTitle>줄거리</SmallTitle>
                    <BigOverView>{detail?.overview}</BigOverView>
                  </>
                ) : null}
                <SmallTitle>회차 정보</SmallTitle>
                <Episode>
                  <StillImg>
                    {detail.last_episode_to_air.still_path ? (
                      <img
                        src={makeImagePath(
                          detail.last_episode_to_air.still_path || "",
                          "w500"
                        )}
                      />
                    ) : (
                      <img
                        src={process.env.PUBLIC_URL + "/video-icon-image.jpg"}
                        alt="no thumbnail"
                      />
                    )}
                  </StillImg>
                  <EpisodeTxt>
                    <h5>
                      {detail.last_episode_to_air.episode_number}화{" "}
                      {detail.last_episode_to_air.name
                        ? " ・ " + detail.last_episode_to_air.name
                        : null}
                    </h5>
                    <p>
                      방영일 :{" "}
                      {new Date(
                        detail.last_episode_to_air.air_date
                      ).toLocaleDateString()}
                    </p>
                    <p>{detail.last_episode_to_air.runtime}분</p>
                  </EpisodeTxt>
                </Episode>
              </BigContent>
            </>
          ) : null}
          {credits ? (
            <>
              <BigContent>
                <SmallTitle>출연</SmallTitle>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={8}
                  modules={[Scrollbar, Lazy]}
                  breakpoints={breakpoints}
                  lazy={true}
                  className="creditsSwiper"
                >
                  {credits.cast.slice(0, 9).map((person) => (
                    <SwiperSlide key={person.id}>
                      <SearchItem>
                        <div>
                          {person.profile_path ? (
                            <img
                              data-src={makeImagePath(
                                person.profile_path || "",
                                "w500"
                              )}
                              alt={person.name}
                              className="swiper-lazy"
                            />
                          ) : null}
                        </div>
                        <div>
                          <ActorName>{person.name}</ActorName>
                          <CharacterName>{person.character}</CharacterName>
                        </div>
                      </SearchItem>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </BigContent>
            </>
          ) : null}
        </ScrollArea>
      </MovieModal>
    </>
  );
}
export default BigTvSeries;

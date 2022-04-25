//import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { Link, Route, Routes, useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";


const Container = styled.div`
  padding:0 20px;
  max-width: 480px;
  margin:0 auto;
`;

const Title = styled.h1`
  font-size:48px;
`;
const Header = styled.header`
  height:10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const Loader = styled.div`
  text-align: center;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${props=>props.theme.colors.boxBg};
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const TabWrap = styled.ul`
  display: flex;
  padding:8px;
  margin: 10px 0;
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.borderRadius};
`;
const TabItem = styled.li<{isActive:boolean}>`
  width:50%;
  text-align: center;
  background-color: ${props => props.isActive ? props.theme.colors.main : "transparent"};
  border-radius: 6px;
  color:${props=>props.isActive ? props.theme.colors.cardBg : props.theme.colors.cardText};
  a{
    display: block;
    padding: 10px;
    color: inherit;
  }
`;
const TabCnt = styled.div`
  height: 300px;
`;
const GoBack = styled.button`
  color:${props=>props.theme.colors.text};
  background:transparent;
  border:0;
  font-size:48px;
  position: absolute;
  left: 0;
  top:15px;
`;
interface Params {
  id:string;
}
interface RouteState {
  state:{
    name: string;
  }
}

export interface IInfoData {
  id:                 string;
  name:               string;
  symbol:             string;
  rank:               number;
  is_new:             boolean;
  is_active:          boolean;
  type:               string;
  tags:               Tag[];
  team:               Team[];
  description:        string;
  message:            string;
  open_source:        boolean;
  started_at:         Date;
  development_status: string;
  hardware_wallet:    boolean;
  proof_type:         string;
  org_structure:      string;
  hash_algorithm:     string;
  links:              Links;
  links_extended:     LinksExtended[];
  whitepaper:         Whitepaper;
  first_data_at:      Date;
  last_data_at:       Date;
}

export interface Links {
  explorer:    string[];
  facebook:    string[];
  reddit:      string[];
  source_code: string[];
  website:     string[];
  youtube:     string[];
}

export interface LinksExtended {
  url:    string;
  type:   string;
  stats?: Stats;
}

export interface Stats {
  subscribers?:  number;
  contributors?: number;
  stars?:        number;
  followers?:    number;
}

export interface Tag {
  id:           string;
  name:         string;
  coin_counter: number;
  ico_counter:  number;
}

export interface Team {
  id:       string;
  name:     string;
  position: string;
}

export interface Whitepaper {
  link:      string;
  thumbnail: string;
}

export interface IPriceData {
  id:                 string;
  name:               string;
  symbol:             string;
  rank:               number;
  circulating_supply: number;
  total_supply:       number;
  max_supply:         number;
  beta_value:         number;
  first_data_at:      Date;
  last_updated:       Date;
  quotes:             Quotes;
}

export interface Quotes {
  USD: Usd;
}

export interface Usd {
  price:                  number;
  volume_24h:             number;
  volume_24h_change_24h:  number;
  market_cap:             number;
  market_cap_change_24h:  number;
  percent_change_15m:     number;
  percent_change_30m:     number;
  percent_change_1h:      number;
  percent_change_6h:      number;
  percent_change_12h:     number;
  percent_change_24h:     number;
  percent_change_7d:      number;
  percent_change_30d:     number;
  percent_change_1y:      number;
  ath_price:              number;
  ath_date:               Date;
  percent_from_price_ath: number;
}


function Coin(){
  const {id} = useParams() as unknown as Params;
  const {state} = useLocation() as RouteState;
  const priceMatch = useMatch("/:id/price");
  const chartMatch = useMatch("/:id/chart");
  const {isLoading:infoLoading, data:infoData} = useQuery<IInfoData>(["info",id], ()=> fetchCoinInfo(id));
  const {isLoading:priceLoading, data:priceData} = useQuery<IPriceData>(["price",id], ()=> fetchCoinTickers(id),{refetchInterval:5000});
  const loading = infoLoading || priceLoading;
  const navigate = useNavigate();
  return (
  <Container>
    <Helmet>
        <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
    </Helmet>
    <Header>
      <GoBack onClick={()=>navigate(-1)}>&larr;</GoBack>
      <Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</Title>
    </Header>
    {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <TabWrap>
            <TabItem isActive={chartMatch !== null}>
              <Link to="chart">Chart</Link>
            </TabItem>
            <TabItem isActive={priceMatch !== null}>
              <Link to="price">Price</Link>
            </TabItem>
          </TabWrap>
          <TabCnt>
            <Routes>
              <Route path="price" element={<Price coinId={id} />} />
              <Route path="chart" element={<Chart coinId={id} />} />
            </Routes>
          </TabCnt>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>$ {priceData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceData?.max_supply}</span>
            </OverviewItem>
          </Overview>
        </>
      )}
  </Container>);
}
export default Coin;
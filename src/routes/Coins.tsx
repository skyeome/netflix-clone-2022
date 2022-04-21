import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
`;
const CoinList = styled.ul``;
const CoinItem = styled.li`
  border-radius: ${props=>props.theme.borderRadius};
  margin-bottom: 10px;
  background-color: ${props=>props.theme.colors.text};
  color:${props=>props.theme.colors.bg};
  a{
    display: block;
    padding:20px;
    transition:color .2s ease;
  }
  &:hover{
    a{
      color:${props=>props.theme.colors.main};
    }
  }
`;
const Loader = styled.div`
  text-align: center;
`;
const Img = styled.img`
  width:30px;
  height:30px;
  vertical-align: middle;
  margin-right: 8px;
`;

interface CoinInterface {
  id:string;
  name:string;
  symbol:string;
  rank:number;
  is_new:boolean;
  is_active:boolean;
  type:string;
}


function Coins(){
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const json = await (await fetch("https://api.coinpaprika.com/v1/coins")).json();
      setCoins(json.slice(0,50));
      setLoading(false);
    })();
  },[]);
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      <CoinList>
        {loading ? <Loader>Loading...</Loader> : coins.map(coin=>
        <CoinItem key={coin.name}>
          <Link to={`/${coin.id}`}>
            <Img src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`} />
            {coin.name} &rarr;
          </Link>
        </CoinItem>
        )}
      </CoinList>
    </Container>
  );
}
export default Coins;
const BASE_URL = "https://api.coinpaprika.com/v1";
export async function fetchCoins(){
  return await (await fetch(`${BASE_URL}/coins`)).json();
};

export async function fetchCoinInfo(id:string){
  return await (await fetch(`${BASE_URL}/coins/${id}`)).json();
};

export async function fetchCoinTickers(id:string){
  return await (await fetch(`${BASE_URL}/tickers/${id}`)).json();
};
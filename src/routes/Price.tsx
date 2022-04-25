import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { IHistorical } from "./Chart";
import { ChartParams } from "./Chart";
import ApexChart from "react-apexcharts";

function Price({coinId}:ChartParams){
  const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv",coinId], ()=> fetchCoinHistory(coinId));

  const mappedSeries = data?.map(val=>
    ({x:`${new Date(val.time_open).getMonth()}-${new Date(val.time_open).getDate()}` ,y:[val.open.toFixed(3),val.high.toFixed(3),val.low.toFixed(3),val.close.toFixed(3)]}));

  return (
    <div>
      {isLoading ? "Loading..." : 
        <ApexChart 
          type="candlestick" 
          series={[
            {data:mappedSeries as unknown as number[]}
          ]}
          options={{
            theme:{
              mode:"dark"
            },
            xaxis:{
              axisBorder:{show:false},
              axisTicks:{show:false},
              labels:{show:false}
            },
            yaxis:{
              show:false
            },
            chart:{
              toolbar:{
                show:false
              },
              height:500,
              background: "transparent"
            },
            grid: {
              show:false
            },
          }} />
      }
    </div>
  );
}
export default Price;
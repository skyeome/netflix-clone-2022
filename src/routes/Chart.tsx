import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface ChartParams {
  coinId:string;
}
interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
function Chart({coinId}:ChartParams){
  const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv",coinId], ()=> fetchCoinHistory(coinId));
  return (
    <div>
    {isLoading ? "Loading..." : <ApexChart
      type="line" 
      series={[
        {
          name:`${coinId}`,
          data:data?.map(price=>price.close) ?? []
        }
      ]}
      options={{
        theme:{
          mode:"dark"
        },
        xaxis:{
          axisBorder:{show:false},
          axisTicks:{show:false},
          labels:{show:false},
          categories:data?.map(time => time.time_open) ?? [],
          type:"datetime"
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
        stroke: {
          curve:"smooth",
          width: 2
        },
        fill: {
          type:"gradient",
          gradient:{
            gradientToColors:["#92FE9D"], stops:[0,100]
          }
        },
        colors:["#00C9FF"],
        tooltip:{
          y:{
            formatter:(val => `$${val.toFixed(2)}`)
          }
        },
        yaxis:{
          show:false
        }
      }}
    />}
    </div>
  );
}
export default Chart;
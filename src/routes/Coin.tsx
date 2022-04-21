import { useParams } from "react-router-dom";

interface Params {
  id:string;
}

function Coin(){
  //const {id} = useParams();
  const {id} = useParams() as unknown as Params;
  console.log(id);
  return (<h1>Coin</h1>);
}
export default Coin;
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
`;

const Grid = styled.div`
  width:100%;
  max-width: 640px;
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap:10px;
  div:first-child,
  div:last-child{
    grid-column:span 2;
  }
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height:100%;
  display: flex;
  justify-content: center;
  align-items:center;
`;

const Box = styled(motion.div)`
  height: 200px;
  background-color: rgba(255,255,255,1);
  border-radius: 50px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  font-size: 24px;
`;

function App() {
  const [id, setId] = useState<null | string>(null);
  return (
    <Wrapper>
      <Grid>
        {["1","2","3","4"].map(i=><Box key={i} layoutId={i} onClick={()=>setId(i)} />)}
      </Grid>
      <AnimatePresence>
        {id ? (
        <Overlay onClick={()=>setId(null)} initial={{backgroundColor:"rgba(0,0,0,0)"}} animate={{backgroundColor:"rgba(0,0,0,0.5)"}} exit={{backgroundColor:"rgba(0,0,0,0)"}}>
          <Box layoutId={id} style={{width:400,height:200}} ></Box>
        </Overlay>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default App;

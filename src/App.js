import styled,{ keyframes } from "styled-components";

const Wrapper = styled.div`
  display:flex;
`;
const ani = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`;
const Box = styled.div`
  width:200px;
  height:200px;
  background-color: tomato;
  animation: ${ani} 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  span{
    font-size: 40px;
    &:hover{
      font-size: 50px;
    }
    &:active{
      opacity: 0;
    }
  }
`;

function App() {
  return (
    <div className="App">
      <Wrapper>
        <Box>
          <span>😃</span>
        </Box>
      </Wrapper>
    </div>
  );
}

export default App;

import styled from "styled-components";

const Wrapper = styled.div`
  display:flex;
`;
const Box = styled.div`
  background-color: ${(props)=>props.bgColor};
  &:hover{
    background-color: #fff;
  }
  width:100px;
  height:100px;
`;
const Circle = styled(Box)`
  border-radius: 100%;
`;
const Text = styled.span`
  color:white;
`;

function App() {
  return (
    <div className="App">
      <Wrapper>
        <Box bgColor="aqua">
          <Text>Hello</Text>
        </Box>
        <Circle bgColor="tomato"/>
      </Wrapper>
    </div>
  );
}

export default App;

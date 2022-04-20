import styled from "styled-components";

const Wrapper = styled.div`
  display:flex;
`;
const Btn = styled.button`
  color: #fff;
  background-color: tomato;
  padding:10px;
  border:0;
  border-radius: 15px;
`;
const Input = styled.input.attrs({type:"text",required:true})`
  border:1px solid #efefef;
  border-radius: 5px;
`;

function App() {
  return (
    <div className="App">
      <Wrapper>
        <Btn as="a" href="/login">Log in</Btn>
        <Btn>Log out</Btn>
      </Wrapper>
      <Wrapper>
        <Input />
        <Input />
        <Input />
        <Input />
      </Wrapper>
    </div>
  );
}

export default App;

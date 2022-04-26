import React from "react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Categories, categoryState, toDoSelector, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

const Container = styled.div`
  max-width: 480px;
  padding:0 20px;
  margin:0 auto;
`;

function ToDoList(){
  const toDos = useRecoilValue(toDoSelector);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event:React.FormEvent<HTMLSelectElement>) => {
    const {currentTarget:{value}} = event;
    setCategory(value as any);
  };
  const setToDos = useSetRecoilState(toDoState);
  const local = localStorage.getItem("toDoState");
  useEffect(()=>{
    if(local !== null){
      const toDoState = JSON.parse(local);
      setToDos(toDoState);
    }
  },[local]);
  return <>
    <Container>
      <h1>To Dos</h1>
      <form>
        <select value={category} onInput={onInput}>
          <option value={Categories.TO_DO}>To Do</option>
          <option value={Categories.DOING}>Doing</option>
          <option value={Categories.DONE}>Done</option>
        </select>
      </form>
      <CreateToDo />
      {toDos?.map(toDo => <ToDo key={toDo.id} {...toDo} />)}
    </Container>
  </>
  
}

export default ToDoList;
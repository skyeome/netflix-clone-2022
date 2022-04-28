import React, { useEffect, useState } from "react";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState } from "./atoms";
import Board from "./Components/Board";

const Container = styled.div`
  background: ${props=>props.theme.colors.bg};
  min-height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap:wrap;
  width:100%;
  max-width: 640px;
  padding:0 20px;
  margin: 0 auto;
  position: relative;
`;

const Boards = styled.div`
  display: flex;
  gap:10px;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const NewBoardWrap = styled.div`
  width:100%;
  height: calc(2.6rem + 20px);
  margin-bottom: 2em;
  background: rgba( 255, 255, 255, 0.25 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 7.5px );
  border-radius: 0 0 10px 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
`;

const NewBoardBtn = styled.button<{isAdding:boolean}>`
  appearance: button;
  backface-visibility: hidden;
  background-color: #405cf5;
  border-radius: 6px;
  border-width: 0;
  box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  height: 3em;
  line-height: 1.15;
  outline: none;
  overflow: hidden;
  padding: 0 25px;
  text-align: center;
  transition: all .2s,box-shadow .08s ease-in;
  user-select: none;
  touch-action: manipulation;
  width: 270px;
  display: ${props=>props.isAdding ? "none" : "block"};
  margin:10px auto;
  &:disabled {
    cursor: default;
  }
  &:focus {
    box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px;
  }
`;

const BoardNameInput = styled.input<{isAdding:boolean}>`
  position: absolute;
  display: block;
  top:10px;
  left:50%;
  width: 270px;
  height: 3em;
  line-height: 3em;
  padding:0 10px;
  background-color: transparent;
  border:0;
  transform: translateX(-50%);
  opacity: ${props=>props.isAdding ? 1 : 0 };
  z-index: ${props=>props.isAdding ? 1 : -1};
`;

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const local = localStorage.getItem("toDoState");
  useEffect(()=>{
    if(local !== null){
      const toDoLocal = JSON.parse(local);
      setToDos(toDoLocal);
    }
  },[local]);
  window.addEventListener("beforeunload",(event:BeforeUnloadEvent)=>{
    const isEmptyObj = (obj:IToDo):boolean => {
      if(obj.constructor === Object && Object.keys(obj).length === 0)  {
        return true;
      }
      return false;
    }
    if(local !== null && isEmptyObj(JSON.parse(local))) localStorage.removeItem("toDoState");
    else localStorage.setItem("toDoState",JSON.stringify(toDos));
  });
  const onDragEnd = (info:DropResult) => {
    console.log(info);
    const {destination,draggableId,source} = info;
    if(!destination) return;
    if(destination?.droppableId === source.droppableId){
      //같은 보드 내에서 움직였을때
      setToDos(allBoards => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index]; //보드내에서 드래그한 Object
        boardCopy.splice(source.index,1);
        boardCopy.splice(destination.index,0,taskObj);
        //다른거는 다 똑같이 쓰고 드롭한 보드만 고치고 싶을때는 대괄호 안에 key를 넣어주면 된다.
        return {
          ...allBoards,
          [source.droppableId]: boardCopy
        };
      });
    }
    if(destination.droppableId !== source.droppableId){
      if(destination.droppableId.indexOf("Trash") > 1){
        setToDos(allBoards => {
          const boardCopy = [...allBoards[source.droppableId]];
          boardCopy.splice(source.index,1);
          //다른거는 다 똑같이 쓰고 드롭한 보드만 고치고 싶을때는 대괄호 안에 key를 넣어주면 된다.
          return {
            ...allBoards,
            [source.droppableId]: boardCopy
          };
        });
      } else {
        // 서로 다른 보드에서 움직였을때
        setToDos((allBoards) => {
          const srcCopy = [...allBoards[source.droppableId]];
          const dstCopy = [...allBoards[destination.droppableId]];
          const taskObj = srcCopy[source.index]; //보드내에서 드래그한 Object
          srcCopy.splice(source.index,1);
          dstCopy.splice(destination.index,0,taskObj);
          return {
            ...allBoards,
            [source.droppableId]:srcCopy,
            [destination.droppableId]:dstCopy
          }
        });
      }
      
    }
    
  };
  const {register,handleSubmit,setValue,setFocus} = useForm<{newBoard:string}>();
  const onValid:SubmitHandler<{newBoard:string}> = ({newBoard})=>{
    setToDos((allBoards) => {
      const copyAll = {...allBoards};
      copyAll[newBoard] = [];
      return {
        ...copyAll
      }
    });
    setIsAdding(current => !current);
    setValue("newBoard","");
  }
  const handleAddClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    setIsAdding(current => !current);
    setFocus("newBoard");
  };
  return <DragDropContext onDragEnd={onDragEnd}>
    <Container>
      <NewBoardWrap>
        <Wrapper>
          <NewBoardBtn onClick={handleAddClick} isAdding={isAdding}>✏️ 보드 추가</NewBoardBtn>
          <form onSubmit={handleSubmit(onValid)}>
            <BoardNameInput isAdding={isAdding} {...register("newBoard",{required:true})} autoComplete="off" placeholder="보드 이름" />
          </form>
        </Wrapper>
      </NewBoardWrap>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
        </Boards>
      </Wrapper>
    </Container>
  </DragDropContext>;
}

export default App;

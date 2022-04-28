import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import React from "react";

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom:12px;
  font-size: 18px;
`;

const Wrapper = styled.div`
  width: 294px;
  padding-top: 20px;
  background-color: ${props=>props.theme.colors.boardBg};
  border-radius: ${props=>props.theme.borderRadius};
  min-height: 250px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

interface IAreaProps {
  isDraggingFromThis:boolean;
  isDraggingOver:boolean;
}

const DropArea = styled.div<IAreaProps>`
  background-color: ${props=>props.isDraggingOver ? "#b2bec3" : props.isDraggingFromThis ? "#dfe6e9" : "transparent"};
  transition: background-color .3s ease;
  flex-grow:1;
  padding:12px;
`;

const Form = styled.form`
  width: 100%;
  input{
    display: block;
    padding:10px;
    width: 270px;
    margin:0 auto;
    border:1px solid #ccc;
  }
`;

const DelBoardBtn = styled.button`
  background-color: transparent;
  border:0;
  position: absolute;
  right:10px;
  top:10px;
  font-size: 1.2em;
`;

const Trash = styled.div<{isDraggingOver:boolean}>`
  padding-top:1em;
  padding-bottom:${props=>props.isDraggingOver ? "10px" : "25px"};
  transition: padding-bottom .2s ease;
  text-align: center;
  font-size: 12px;
  background-color:#ccc;

`;

interface IBoardProps{
  toDos:IToDo[],
  boardId:string;
}

interface IForm {
  toDo : string;
}

function Board({toDos, boardId}:IBoardProps){
  const setToDo = useSetRecoilState(toDoState);
  const {register,setValue,handleSubmit} = useForm<IForm>();
  const onValid = ({toDo}:IForm) => {
    const newToDo:IToDo = {
      id:Date.now(),
      text:toDo
    };
    setToDo(allBoards => {
      return {
        ...allBoards,
        [boardId]:[
          ...allBoards[boardId],
          newToDo
        ]
      }
    });
    setValue("toDo","");
  }
  const onDelClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    setToDo(allBoard=>{
      const copyBoard = {...allBoard};
      delete copyBoard[boardId];
      return {
        ...copyBoard
      }
    });
  }
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input {...register("toDo",{required:true})} type="text" placeholder={`add task on ${boardId}`} autoComplete="off"/>
      </Form>
      <DelBoardBtn onClick={onDelClick}>🗑</DelBoardBtn>
      <Droppable droppableId={boardId}>
        {(provided,snapshot)=>
          <DropArea 
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)} 
            isDraggingOver={snapshot.isDraggingOver} 
            ref={provided.innerRef} 
            {...provided.droppableProps}>
            {toDos.map((toDo,index) => <DraggableCard key={toDo.id} toDo={toDo} index={index} boardId={boardId} />)}
            {provided.placeholder}
          </DropArea>
        }
      </Droppable>
      <Droppable droppableId={`${boardId} Trash`}>
        {(provided,snapshot)=>
        <Trash 
          isDraggingOver={snapshot.isDraggingOver} 
          ref={provided.innerRef} 
          {...provided.droppableProps}>
          🗑 휴지통
          {provided.placeholder}
        </Trash>}
      </Droppable>
    </Wrapper>
  );
}
export default Board;
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";

const Card = styled.div<{isDragging:boolean}>`
  border-radius: ${props=>props.theme.borderRadius};
  padding:15px 10px;
  background-color:${props=>props.theme.colors.cardBg};
  margin-bottom:5px;
  background-color:${props=>props.isDragging ? "#74b9ff":"white"};
  box-shadow:${props=>props.isDragging ? "1px 2px 2em rgba(40,40,40,.3)" : "none"};
  transition:background-color .3s ease,box-shadow .3s ease;
  position: relative;
`;
const DelBtn = styled.button<{isModifying:boolean}>`
  background-color:transparent;
  border:0;
  position: absolute;
  top:10px;
  right:5px;
  cursor: pointer;
  display: ${props=>props.isModifying ? "none" : "block"};
`;
const Form = styled.form<{isModifying:boolean}>`
  position: absolute;
  width: 100%;
  top:10px;
  left:0;
  opacity: ${props=>props.isModifying ? 1 : 0 };
  z-index: ${props=>props.isModifying ? 1 : -1};
  transition: all .2s;
  input {
    width:calc(100% - 2em);
    border:0;
    padding:6px 10px;
  }
`;

const SaveBtn = styled.button`
  background-color:transparent;
  border:0;
  position: absolute;
  top:0;
  right:5px;
  cursor: pointer;
`;

interface ICardProps {
  toDo:IToDo;
  index:number;
  boardId:string;
}

function DraggableCard({toDo, index,boardId}:ICardProps){
  const [isModifying, setIsModifying] = useState(false);
  const setToDos = useSetRecoilState(toDoState);
  const {register,handleSubmit,setValue,setFocus} = useForm<{updateToDo:string}>();
  const onClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    setIsModifying(current=>!current);
    setFocus("updateToDo");
    setValue("updateToDo",toDo.text);
  };
  const onValid = (data:{updateToDo:string}) => {
    setToDos(toDos => {
      const cardCopy = [...toDos[boardId]];
      const newToDo:IToDo = {
        id:cardCopy[index].id,
        text:data.updateToDo
      }
      cardCopy[index] = newToDo;
      return {
        ...toDos,
        [boardId]:cardCopy
      };
    });
    setIsModifying(current=>!current);
  };
  return (<Draggable draggableId={toDo.id+""} index={index}>
  {(provided, snapshot)=>
  <Card isDragging={snapshot.isDragging} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
    {toDo.text}
    <DelBtn isModifying={isModifying} onClick={onClick}>✏️</DelBtn>
    <Form isModifying={isModifying} onSubmit={handleSubmit(onValid)}>
      <input {...register("updateToDo",{required:true})}/>
      <SaveBtn type="submit">💾</SaveBtn>
    </Form>
  </Card>}
</Draggable>);
}
export default React.memo(DraggableCard);
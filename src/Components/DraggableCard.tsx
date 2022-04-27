import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  border-radius: ${props=>props.theme.borderRadius};
  padding:15px 10px;
  background-color:${props=>props.theme.colors.cardBg};
  margin-bottom:5px;
`;

interface ICardProps {
  toDo:string;
  index:number;
}

function DraggableCard({toDo, index}:ICardProps){
  return (<Draggable draggableId={toDo} index={index}>
  {(provided)=>
  <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
    {toDo}
  </Card>}
</Draggable>);
}
export default React.memo(DraggableCard);
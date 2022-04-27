import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";

const ABoard = styled.div`
  padding:20px 10px;
  padding-top: 30px;
  background-color: ${props=>props.theme.colors.boardBg};
  border-radius: ${props=>props.theme.borderRadius};
  min-height: 300px;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom:12px;
  font-size: 18px;
`;
interface IBoardProps{
  toDos:string[],
  boardId:string;
}

function Board({toDos, boardId}:IBoardProps){
  return (
    <Droppable droppableId={boardId}>
      {(provided)=>
        <ABoard ref={provided.innerRef} {...provided.droppableProps}>
          <Title>{boardId}</Title>
          {toDos.map((toDo,index) => <DraggableCard key={toDo} toDo={toDo} index={index} />)}
          {provided.placeholder}
        </ABoard>
      }
    </Droppable>
  );
}
export default Board;
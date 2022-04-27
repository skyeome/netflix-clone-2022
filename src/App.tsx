import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import DraggableCard from "./Components/DraggableCard";

const Container = styled.div`
  background: ${props=>props.theme.colors.bg};
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  max-width: 480px;
  margin: 0 auto;
  height: 100%;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
`;

const Board = styled.div`
  padding:20px 10px;
  padding-top: 30px;
  background-color: ${props=>props.theme.colors.boardBg};
  border-radius: ${props=>props.theme.borderRadius};
  min-height: 200px;
`;




function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({draggableId,destination,source}:DropResult) => {
    if(!destination) return;
    setToDos(oldToDos => {
      const copy = [...oldToDos];
      // 1) source.index 아이템 제거
      copy.splice(source.index, 1);
      // 2) destination.index로 아이템 다시 돌려주기.
      copy.splice(destination?.index, 0, draggableId);
      return copy;
    });
  };
  return <DragDropContext onDragEnd={onDragEnd}>
    <Container>
      <Wrapper>
        <Boards>
        <Droppable droppableId="one">
          {(provided)=>
            <Board ref={provided.innerRef} {...provided.droppableProps}>
              {toDos.map((toDo,index) => <DraggableCard key={toDo} toDo={toDo} index={index} />)}
              {provided.placeholder}
            </Board>
          }
        </Droppable>
        </Boards>
      </Wrapper>
    </Container>
  </DragDropContext>;
}

export default App;

import {DragDropContext, DropResult} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Container = styled.div`
  background: ${props=>props.theme.colors.bg};
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  max-width: 640px;
  padding:0 20px;
  margin: 0 auto;
  height: 100%;
`;

const Boards = styled.div`
  display: grid;
  gap:10px;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info:DropResult) => {
    //console.log(info);
    const {destination,draggableId,source} = info;
    if(!destination) return;
    if(destination?.droppableId === source.droppableId){
      //같은 보드 내에서 움직였을때
      setToDos(allBoards => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index,1);
        boardCopy.splice(destination.index,0,draggableId);
        //다른거는 다 똑같이 쓰고 드롭한 보드만 고치고 싶을때는 대괄호 안에 key를 넣어주면 된다.
        return {
          ...allBoards,
          [source.droppableId]: boardCopy
        };
      });
    }
    if(destination.droppableId !== source.droppableId){
      // 서로 다른 보드에서 움직였을때
      setToDos((allBoards) => {
        const srcCopy = [...allBoards[source.droppableId]];
        const dstCopy = [...allBoards[destination.droppableId]];
        srcCopy.splice(source.index,1);
        dstCopy.splice(destination.index,0,draggableId);
        return {
          ...allBoards,
          [source.droppableId]:srcCopy,
          [destination.droppableId]:dstCopy
        }
      });
    }
    
  };
  return <DragDropContext onDragEnd={onDragEnd}>
    <Container>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)}
        </Boards>
      </Wrapper>
    </Container>
  </DragDropContext>;
}

export default App;

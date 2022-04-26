import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";


function ToDoList(){
  const toDos = useRecoilValue(toDoState);
  console.log(toDos);
  return <>
    <h1>To Dos</h1>
    <CreateToDo />
    <ul>
      {toDos.map((todo)=> <ToDo key={todo.id} {...todo} />)}
    </ul>
  </>
  
}

export default ToDoList;
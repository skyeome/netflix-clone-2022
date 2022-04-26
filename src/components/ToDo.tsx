import { useSetRecoilState } from "recoil";
import { IToDo, toDoState } from "../atoms";


function ToDo({text,category,id}:IToDo){
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    const {currentTarget:{name}} = event;
    setToDos(oldToDos => {
      const targetIndex = oldToDos.findIndex((todo)=> todo.id === id);
      const newToDo = {text,id,category:name as any};
      const front = oldToDos.slice(0,targetIndex);
      const back = oldToDos.slice(targetIndex+1);

      return [...front,newToDo,...back];
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== "DOING" && <button name="DOING" onClick={onClick}>Doing</button>}
      {category !== "TO_DO" && <button name="TO_DO" onClick={onClick}>To Do</button>}
      {category !== "DONE" && <button name="DONE" onClick={onClick}>Done</button>}
    </li>
  );
}

export default ToDo;
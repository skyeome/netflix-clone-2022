import { useSetRecoilState } from "recoil";
import { Categories, IToDo, toDoState } from "../atoms";


function ToDo({text,category,id}:IToDo){
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event:React.MouseEvent<HTMLButtonElement>) => {
    const {currentTarget:{name}} = event;
    setToDos(oldToDos => {
      const targetIndex = oldToDos.findIndex((todo)=> todo.id === id);
      const newToDo = {text,id,category:name as any};
      const front = oldToDos.slice(0,targetIndex);
      const back = oldToDos.slice(targetIndex+1);
      localStorage.setItem("toDoState", JSON.stringify([...front,newToDo,...back]));
      return [...front,newToDo,...back];
    });
  };
  const delToDo = ({id}:IToDo) => {
    setToDos(oldToDos => {
      const tg = oldToDos.findIndex((todo)=>todo.id === id);
      localStorage.setItem("toDoState", JSON.stringify([...oldToDos.slice(0,tg),...oldToDos.slice(tg+1)]));
      return [...oldToDos.slice(0,tg),...oldToDos.slice(tg+1)];
    });
  }
  return (
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && <button name={Categories.DOING} onClick={onClick}>Doing</button>}
      {category !== Categories.TO_DO && <button name={Categories.TO_DO} onClick={onClick}>To Do</button>}
      {category !== Categories.DONE && <button name={Categories.DONE} onClick={onClick}>Done</button>}
      <button onClick={()=>delToDo({text,category,id})}>X</button>
    </li>
  );
}

export default ToDo;
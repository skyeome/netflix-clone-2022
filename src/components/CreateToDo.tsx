import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo:string;
}

function CreateToDo(){
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const {register,handleSubmit,setValue} = useForm<IForm>();
  const onSubmit = ({toDo}:IForm) => {
    setToDos(oldToDos => [{text:toDo,id:Date.now(),category},...oldToDos]);
    setValue("toDo","");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("toDo")} autoComplete="off" placeholder="Write a To Do" />
      <button>Add</button>
    </form>
  );
}

export default CreateToDo;
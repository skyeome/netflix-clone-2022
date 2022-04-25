import { useForm } from "react-hook-form";
// function ToDoList(){
//   const [toDo, setToDo] = useState("");
//   const [toDoError, setToDoError] = useState("");
//   const onChange = (event:React.FormEvent<HTMLInputElement>) => {
//     const {currentTarget:{value}} = event;
//     setToDoError("");
//     setToDo(value);
//   };
//   const onSubmit = (event:React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if(toDo.length < 10){
//       return setToDoError("To do 는 10자 이상 적어주세요.");
//     }
//     console.log("submit");
//   };
//   return <div>
//     <form onSubmit={onSubmit}>
//       <input onChange={onChange} value={toDo} placeholder="Write a to do"/>
//       <button>Add</button>
//       {toDoError !== "" ? toDoError : null}
//     </form>
//   </div>;
// }

interface IForm{
  email:string;
  firstName:string;
  lastName:string;
  username:string;
  password:string;
  password1:string;
  extraError?:string;
}

function ToDoList(){
  const {register,handleSubmit,formState:{errors},setError} = useForm<IForm>({
    defaultValues:{
      email:"@naver.com"
    }
  });
  const onValid = (data:IForm) => {
    if(data.password !== data.password1) {
      setError("password1",{message:"비밀번호가 일치하지 않습니다.",},{shouldFocus:true})
    }
    //setError("extraError",{message:"Server offline"});
  };
  
  return <>
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register("email",{
        required:"이메일은 필수입니다.",
        pattern:{
          value:/^[A-Za-z0-9._%+-]+@naver.com$/,
          message:"naver 이메일만 가능합니다."
        }
      })} placeholder="Email"/><span>{errors?.email?.message}</span>
      <input {...register("firstName",{
        required:"성은 필수입니다.",
        minLength:{
          value:2,
          message:"성은 2자 이상 적어주세요"
        },
        /**
         * true이면 진행되고 false이면 진행되지 않는다.
        validate:(value) => !value.includes("admin")
         * 메시지를 출력하고 싶으면 조건문을 사용해서 메시지를 리턴하면된다.
        validate:(value) => value.includes("admin") ? "admin은 사용할수없습니다." : true
         */
        validate:{
          noAdmin:(value)=>value.includes("admin") ? "admin은 사용할수없습니다." : true,
          noRoot:(value)=>value.includes("root") ? "root는 사용할수없습니다." : true,
        }
      })} placeholder="firstName"/><span>{errors?.firstName?.message}</span>
      <input {...register("lastName",{
        required:"이름은 필수입니다.",
        minLength:{
          value:2,
          message:"이름은 2자 이상 적어주세요"
        }
        })} placeholder="lastName"/><span>{errors?.lastName?.message}</span>
      <input {...register("username",{
        required:"아이디는 필수입니다.",
        minLength:{
          value:5,
          message:"아이디는 5자 이상 적어주세요."
        }
      })} placeholder="username"/><span>{errors?.username?.message}</span>
      <input {...register("password",{
        required:"비밀번호는 필수입니다.",
        minLength:{
          value:8,
          message:"비밀번호는 8자 이상 적어주세요."
        }
      })} type="password" placeholder="password"/><span>{errors?.password?.message}</span>
      <input {...register("password1",{
        required:"비밀번호는 필수입니다.",
        minLength:{
          value:8,
          message:"비밀번호는 8자 이상 적어주세요."
        }
      })} type="password" placeholder="password confirm"/><span>{errors?.password1?.message}</span>
      <button>Add</button>
    </form>
  </>
  
}

export default ToDoList;
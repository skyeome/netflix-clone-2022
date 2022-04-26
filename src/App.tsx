import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { hourSelector, minuteState } from "./atoms";

function App() {
  const [minute, setMinute] = useRecoilState(minuteState);
  const [hours, setHours] = useRecoilState(hourSelector);
  const onMinutesChange = (event:React.FormEvent<HTMLInputElement>) => {
    const {currentTarget:{value}} = event;
    setMinute(+value);
  }
  const onHoursChange = (event:React.FormEvent<HTMLInputElement>) => {
    const {currentTarget:{value}} = event;
    setHours(+value);
  };
  return (
    <>
    <input value={minute} onChange={onMinutesChange} type="number" placeholder="Minutes" />
    <input value={hours} onChange={onHoursChange} type="number" placeholder="Hours" />
    </>
  );
}

export default App;

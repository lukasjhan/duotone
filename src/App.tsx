import { useState } from "react";
import Background from "./Background";
import Edit from "./Edit";

export default function App() {
  const [edit, setEdit] = useState(false);
  return (
    <div className="wrapper">
      {!edit && <div className="title">Welcome to Duotone Editor</div>}
      {!edit && <div className="app">
        <Background />
        <div className="try-button" onClick={() => {setEdit(true)}}>Try Now</div>
      </div>}
      {edit && <Edit />}
    </div>
  );
}
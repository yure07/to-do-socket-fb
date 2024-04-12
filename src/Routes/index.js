import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Lists from "../pages/Lists";

const RoutesApp = () => {
  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/lists" element={<Lists/>}/>
    </Routes>
  )
}
export default RoutesApp
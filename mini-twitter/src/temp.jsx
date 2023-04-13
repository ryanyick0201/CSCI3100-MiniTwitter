import { Routes, Route } from "react-router-dom";
import Content from "./component/Content";

const Temp = () => {
  return <Route path="/" element={<Content />} />;
};

export default Temp;

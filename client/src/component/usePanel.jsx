import { useEffect, useState } from "react";

const getRecipientList = async (username) => {
  console.log("enter getRecipientList");

  const url =
    "http://" +
    window.location.hostname +
    ":3000/chat/chattedUser?q=" +
    username;
  const res = await fetch(url, { mode: "cors" });

  console.log("finish fetch, now parse res to json");

  const data = await res.json();

  console.log("finished parsing, data is", data);

  return data;
};

const usePanel = (sender, socket) => {
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    socket.on("chattedUser", (obj) => {
      setNameList(obj); // Rely on BE to give updated list
    });
  }, [socket]);

  return { nameList };
};

export default usePanel;

/** usePanel - Helper funtions used in Panel.jsx
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: usePanel(socket)
 *  Where socket is a socket object defined in "../ChatPage.jsx" for listening to socket events
 * PURPOSE: For maintainability, define all socket event emitter and listener to be used by "./Panel.jsx"
 * ALGORITHM: useEffect((...)=>{...}, []) to define listener only once when the page is rendered for the first time
 */

import { useEffect, useState } from "react";

const usePanel = (sender, socket) => {
  const [nameList, setNameList] = useState([]);

  useEffect(() => {
    socket.on("chattedUser", (obj) => {
      setNameList(obj); // Rely on BE to give updated list
    });
  }, []);

  return { nameList };
};

export default usePanel;

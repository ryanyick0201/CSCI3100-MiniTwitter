import { useEffect, useState } from "react";

/* For testing
const getRecipientList = () => {
    const names = [];
    for (let i = 0; i < 2; i++) {
        names.push("Placeholder" + i);
    }
    return names;
}
*/
const usePanel = (sender, socket) => {
    const [nameList, setNameList] = useState([]);

    useEffect(() => {
        socket.on("getNotification", (list) => {
            setNameList(list);  // Rely on BE to give updated list
        });
    }, [socket]);

    return { nameList }
}

export default usePanel;
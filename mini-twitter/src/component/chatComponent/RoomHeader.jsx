/** RoomHeader - Chatroom Header component
 * PROGRAMMER: Choi, Man Wai (SID: 1155159354)
 * CALLING SEQUENCE: RoomHeader({recipient})
 *  Where recipient is a state storing the username, whose message history with the sender is being viewed by the sender
 * PURPOSE: Hold the name tag of the recipient
 */

import { Card, Grid } from "@material-ui/core";
import NameTag from "./NameTag.jsx";

const RoomHeader = ({ recipient }) => {
  return (
    <Card square style={{ minHeight: "10%" }}>
      <Grid container justifyContent="center" alignItems="center">
        <NameTag name={recipient} />
      </Grid>
    </Card>
  );
};

export default RoomHeader;

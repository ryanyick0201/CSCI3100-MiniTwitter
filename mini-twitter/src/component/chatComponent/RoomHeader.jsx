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

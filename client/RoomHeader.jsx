import { Card, CardHeader, Avatar, Grid } from '@material-ui/core';

const RoomHeader = ({ roomName }) => {
    return (
        <Card square style={{ backgroundColor: "green", height: "10%" }}>
            <Grid container justifyContent="center" alignItems="center">
                <CardHeader
                    avatar={
                        <Avatar alt={roomName} src="" />
                    }
                    title={roomName}
                />
            </Grid>
        </Card>
    )
}

export default RoomHeader;
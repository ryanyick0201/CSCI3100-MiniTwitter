import { Card, CardHeader, Avatar, Grid } from '@material-ui/core';

const RoomHeader = ({ recipient }) => {
    return (
        <Card square style={{ backgroundColor: "green", height: "10%" }}>
            <Grid container justifyContent="center" alignItems="center">
                <CardHeader
                    avatar={<Avatar alt={recipient} src="" />}
                    title={recipient}
                />
            </Grid>
        </Card>
    )
}

export default RoomHeader;
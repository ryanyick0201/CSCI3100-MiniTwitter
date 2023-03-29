import { Card, CardHeader, Avatar, Grid } from '@material-ui/core';

const RoomHeader = (props) => {
    return (
        <Card square >
            <Grid container justifyContent="center" alignItems="center">
                <CardHeader
                    avatar={
                        <Avatar alt={props.title} src="" />
                    }
                    title={props.title}
                />
            </Grid>
        </Card>
    )
}

export default RoomHeader;
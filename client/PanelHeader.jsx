import { Card, CardHeader, Avatar, Grid, IconButton } from '@material-ui/core';
import RateReviewIcon from '@mui/icons-material/RateReview';

const PanelHeader = ({ sender }) => {
    const handleCompose = () => {
        alert("you clicked me")
    }

    return (
        <Card square style={{ height: "10%" }}>
            <Grid container justifyContent="center" alignItems="center">
                <CardHeader
                    avatar={
                        <Avatar alt={sender} src="/" />
                    }
                    title={sender}
                    action={
                        <IconButton aria-label="compose" onClick={handleCompose}>
                            <RateReviewIcon color="warning" />
                        </IconButton>
                    }
                />
            </Grid>
        </Card>
    )
}

export default PanelHeader;
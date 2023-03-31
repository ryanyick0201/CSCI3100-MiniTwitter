import { Card, CardHeader, Avatar, Grid, Typography, IconButton } from '@material-ui/core';
import RateReviewIcon from '@mui/icons-material/RateReview';

const PanelHeader = ({ sender }) => {
    const handleCompose = () => {
        alert("you clicked me")
    }

    return (
        <Card square style={{ minHeight: "10%" }}>
            <Grid container justifyContent="center" alignItems="center">
                <CardHeader
                    avatar={<Avatar alt={sender} src="/" />}
                    title={sender}
                />
                <IconButton aria-label="compose" onClick={handleCompose}>
                    <RateReviewIcon color="warning" />
                </IconButton>
            </Grid>
        </Card>
    )
}

export default PanelHeader;
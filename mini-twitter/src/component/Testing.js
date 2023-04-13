import { makeStyles } from "@material-ui/core/styles";

export const Testing = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FFA500",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
  },
  form: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  textField: {
    margin: theme.spacing(1),
    width: "25ch",
  },
  SubButton: {
    padding: "20px 40px 20px 40px",
  },
}));

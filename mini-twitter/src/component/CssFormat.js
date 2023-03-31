import { makeStyles } from '@material-ui/core/styles';

export const UseStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#FFA500',
  },
  rootNormal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  formContainer: {
    display: 'flex',
    borderStyle: 'solid',
    borderColor: 'grey',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(5),
    backgroundColor: 'white',
  },
  form: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(4),
  },
  form_title: {
    padding: '10px 50px 20px 50px',
  },
  formDescription: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 50px 20px 50px',
    backgroundColor: 'white',
  },
  form_item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "start",
    padding: '20px 0 20px 0',
  },
  form_redirect: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    padding: '30px 0 10px 0',
  },
  form_button_grp: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: '0 0 10px 0',
  },
  textField: {
    margin: theme.spacing(1),
    width: '25ch',
    
  },
  linkText: {
    color: 'black',
  },
  submitButton: {
    margin: theme.spacing(2, 0),
  },
  button: {
    textTransform: 'none',
    backgroundColor: 'orange',
  },
  loginTitle: {
    padding: '10px 0 20px 0',
    justifyContent: "start",
    alignItems: "flex-start",
  },
  loginDesc: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "flex-start",
    padding: '10px 0 20px 0',
    backgroundColor: 'white',
    justifyContent: "start",
  },
}));

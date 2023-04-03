import React from 'react';
import { makeStyles, Grid, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: '#FFA500',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: theme.spacing(110),
  },
  signOutButton: {
    color: 'black',
    backgroundColor: 'white',
    marginLeft: theme.spacing(130),
    borderRadius: '50px',
  },
  retButton: {
    color: 'white',
    backgroundColor: 'orange',
    marginLeft: theme.spacing(28),
    marginTop: theme.spacing(10),
    borderRadius: '50px',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    marginRight: theme.spacing(2),
  },
  tableContainer: {
    marginLeft: theme.spacing(20),
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(5),
    maxHeight: 400,
    maxWidth: 300,
  },
  tableCellHeader: {
    fontWeight: 'bold',
  },
  tableRowOdd: {
    backgroundColor: 'orange',
  },
  tableRowEven: {
    backgroundColor: 'white',
  },
  tableCell: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  formRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  formLabel: {
    marginRight: theme.spacing(2),
  },
  formInput: {
    flex: '1 1 auto',
  },
  formButton: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    borderRadius: '50px',
    color: 'white',
    backgroundColor: 'orange',
  },
  submitButton: {
    alignSelf: 'flex-end',
    borderRadius: '50px',
    color: 'white',
    backgroundColor: 'orange',
    marginTop: theme.spacing(2),
  },
}));

const users = [
  { id: 1, username: 'user1' },
  { id: 2, username: 'user2' },
  { id: 3, username: 'user3' },
];

function AdminPage() {
  const classes = useStyles();

  const handleSignOut = () => {
    // sign out logic here
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // submit logic here
  };

  return (
    <div className={classes.root}>
      
      <div className={classes.topSection}>
        <Typography variant="h4" className={classes.title}>
          Welcome admin!
        </Typography>
        <Button variant="contained"  className={classes.signOutButton}>
          Sign Out
        </Button>
      </div>
  
      <Grid container spacing={2}>
      <Grid item xs={6}>
      <Button variant="contained" className={classes.retButton}>Retrieve user list</Button>
      <div className={classes.userList}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCellHeader}>Username</TableCell>              
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={user.id % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd}>
                  <TableCell className={classes.tableCell}>{user.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </Grid>
  
      <Grid item xs={6}>
      <div className={classes.form}>
        <div style={{ height:'150px'}}></div>
        <div><span>Choose an option:</span></div>
        <div className={classes.formRow}>
          <Button variant="contained" className={classes.formButton}>
            Create
          </Button>
          <Button variant="contained" className={classes.formButton}>
            Update
          </Button>
          <Button variant="contained" className={classes.formButton}>
            Delete
          </Button>
        </div>
        <div className={classes.formRow}>
          <Typography variant="subtitle1" className={classes.formLabel}>
            Username:
          </Typography>
          <TextField className={classes.formInput} />
        </div>
        <div style={{ height:'20px'}}></div>
        <div className={classes.formRow}>
          <Typography variant="subtitle1" className={classes.formLabel}>
            Password:
          </Typography>
          <TextField type="password" className={classes.formInput} />
        </div>
        <Button variant="contained" className={classes.submitButton}>
          Submit
        </Button>
      </div>
      </Grid>
      </Grid>
    </div>
  );
  
}



 export default AdminPage 
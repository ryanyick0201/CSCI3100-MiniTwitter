import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: "#FFA500",
    padding: theme.spacing(2),
    textAlign: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginRight: theme.spacing(110),
  },
  signOutButton: {
    textTransform: "none",
    color: "black",
    backgroundColor: "white",
    marginLeft: theme.spacing(130),
    borderRadius: "50px",
  },
  retButton: {
    textTransform: "none",
    color: "white",
    backgroundColor: "#F47458",
    marginLeft: theme.spacing(28),
    marginTop: theme.spacing(10),
    borderRadius: "50px",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
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
    fontWeight: "bold",
  },
  tableRowOdd: {
    backgroundColor: "orange",
  },
  tableRowEven: {
    backgroundColor: "white",
  },
  tableCell: {
    padding: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  formRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  formLabel: {
    marginRight: theme.spacing(2),
  },
  formInput: {
    flex: "1 1 auto",
  },
  formButton: {
    textTransform: "none",
    backgroundColor: "#F47458",
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    borderRadius: "50px",
    color: "white",
  },
  submitButton: {
    textTransform: "none",
    alignSelf: "flex-end",
    borderRadius: "25px",
    color: "white",
    backgroundColor: "#F47458",
    fontWeight: "bold",
    marginTop: theme.spacing(2),
  },
}));

function AdminPage({ setIsLoggedIn }) {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [option, setOption] = useState("");

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [oldUsernameInput, setOldUsernameInput] = useState("");
  const [newUsernameInput, setNewUsernameInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?exactMatch=true`
      );
      const data = await response.json();
      setUsers(data.result);
    };
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleRetrieve = () => {
    const fetchUsers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?exactMatch=true`
      );
      const data = await response.json();
      setUsers(data.result);
    };
    fetchUsers();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (option === "create") {
      const data = {
        username: usernameInput,
        password: passwordInput,
        email: `${usernameInput}@gmail.com`,
        hasVerified: false,
      };
      const response = await fetch(
        "http://" + window.location.hostname + ":3000/user/createUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(result);
      setUsernameInput("");
      setPasswordInput("");
    } else if (option === "update") {
      const data = {
        oldUsername: oldUsernameInput,
        newUsername: newUsernameInput,
        password: passwordInput,
        personalBio: "",
        privacySetting: "public",
      };
      const response = await fetch(
        "http://" + window.location.hostname + ":3000/user/updateUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(result);
      setOldUsernameInput("");
      setNewUsernameInput("");
      setPasswordInput("");
    } else if (option === "delete") {
      const data = {
        username: usernameInput,
      };
      const response = await fetch(
        "http://" + window.location.hostname + ":3000/user/deleteUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(result);
      setUsernameInput("");
    } else {
      alert("Please choose an option.");
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.topSection}>
        <Typography variant="h4" className={classes.title}>
          Welcome admin!
        </Typography>
        <Button
          variant="contained"
          className={classes.signOutButton}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            className={classes.retButton}
            onClick={handleRetrieve}
          >
            Retrieve user list
          </Button>
          <div className={classes.userList}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCellHeader}>
                      Username
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user, index) => (
                    <TableRow
                      key={user.tweetId}
                      className={
                        (index + 1) % 2 === 0
                          ? classes.tableRowEven
                          : classes.tableRowOdd
                      }
                    >
                      <TableCell className={classes.tableCell}>
                        {user.username}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.form}>
            <div style={{ height: "150px" }}></div>
            <div>
              <span>Choose an option:</span>
            </div>
            <div className={classes.formRow}>
              <Button
                variant="contained"
                className={classes.formButton}
                onClick={() => setOption("create")}
              >
                Create
              </Button>
              <Button
                variant="contained"
                className={classes.formButton}
                onClick={() => setOption("update")}
              >
                Update
              </Button>
              <Button
                variant="contained"
                className={classes.formButton}
                onClick={() => setOption("delete")}
              >
                Delete
              </Button>
            </div>

            <div>
              {option === "create" || option === "" ? (
                <>
                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      Username:
                    </Typography>
                    <TextField
                      value={usernameInput}
                      className={classes.formInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                  </div>
                  <div style={{ height: "20px" }}></div>
                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      Password:
                    </Typography>
                    <TextField
                      value={passwordInput}
                      type="password"
                      className={classes.formInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                </>
              ) : option === "update" ? (
                <>
                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      Old username:
                    </Typography>
                    <TextField
                      value={oldUsernameInput}
                      className={classes.formInput}
                      onChange={(e) => setOldUsernameInput(e.target.value)}
                    />
                  </div>

                  <div style={{ height: "20px" }}></div>

                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      New username:
                    </Typography>
                    <TextField
                      value={newUsernameInput}
                      className={classes.formInput}
                      onChange={(e) => setNewUsernameInput(e.target.value)}
                    />
                  </div>

                  <div style={{ height: "20px" }}></div>

                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      Password:
                    </Typography>
                    <TextField
                      value={passwordInput}
                      type="password"
                      className={classes.formInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={classes.formRow}>
                    <Typography
                      variant="subtitle1"
                      className={classes.formLabel}
                    >
                      Username:
                    </Typography>
                    <TextField
                      value={usernameInput}
                      className={classes.formInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              variant="contained"
              className={classes.submitButton}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminPage;

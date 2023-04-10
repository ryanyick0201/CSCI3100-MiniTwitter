import { useState } from 'react';
import { Avatar, Button, TextField, Typography, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '40px 120px 120px 400px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    flexGrow: 1,
    marginRight: theme.spacing(5),
  },
  usersContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: theme.spacing(2),
    '&:hover': {
      background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
    },
  },
  searchButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
  },
  viewMoreButton: {
    textTransform: 'none',
    backgroundColor: '#F47458',
    borderRadius: '25px',
    fontWeight: 'bold', 
    color: 'white',
    width: '100%',
  },
  recomUsersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  recomUser: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(10),
    padding: '5px',
    '&:hover': {
      background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))',
    },
  },
}));



function SearchPage() {
  const myUsername = sessionStorage.getItem('username');
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({});

  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);

  const handleSearch = async () => {
    if(searchTerm==''){
      setSearchResults({});
      return;
    }
    const response = await fetch(`http://localhost:2000/user/searchUser?username=${searchTerm}`);
    const data = await response.json();
    setSearchResults(data);
  };


  const handleShowAllResults = () => {
    setShowAllResults(true);
  };

  const navigate = useNavigate();

  const handleUserClick = (user) => {
    navigate('/other profile', {state: {username: user.username }});
  };



  return (
    <div className={classes.root}>
    <Card>
    <CardContent>
    <div className={classes.searchContainer}>
      <TextField
        className={classes.searchInput}
        label="Search by username"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="text" className={classes.searchButton} onClick={handleSearch}>
        Search
      </Button>
    </div>

      <div className={classes.usersContainer}>
        {searchResults.result?.slice(0, showAllResults ? searchResults.result?.length : 2).map((user) => (
          <div>
          {user.username !== myUsername ? (
            <div className={classes.user} key={user.userId} onClick={() => handleUserClick(user)}>
              <Avatar className={classes.avatar} src alt={user.username} />
              <Typography variant="subtitle1" className={classes.userName}>
                {user.username}
              </Typography>
            </div>
          ) : (
            <div className={classes.user} key={user.userId} onClick={() => navigate('/my profile')}>
              <Avatar className={classes.avatar} src alt={user.username} />
              <Typography variant="subtitle1" className={classes.userName}>
                {user.username}
              </Typography>
            </div>
          )}
          </div>
        ))}
      </div>
      {searchResults.result?.length > 2 && !showAllResults && (
        <div>
          <div style={{ height: 16 }}/>
          <Button className={classes.viewMoreButton} onClick={handleShowAllResults}>
            Click to view more
          </Button>
        </div>
      )}
    </CardContent>
    </Card>




     <Card className={classes.card}>
      <CardContent>
      <Typography variant="h6">You may want to follow these users:</Typography>
      <div className={classes.recomUsersContainer}>
        {recommendedUsers.map((user) => (
          <div className={classes.recomUser} key={user.name} onClick={handleUserClick}>
            <Avatar src alt />
            <Typography variant="subtitle1" className={classes.userName}>
              {user.name}
            </Typography>
          </div>
        ))}
      </div>
      </CardContent>
     </Card>

    </div>
  );
}

export default SearchPage;

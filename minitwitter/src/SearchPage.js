import { useState } from 'react';
import { Avatar, Button, TextField, Typography, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
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
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([
    { name: 'User 1', avatar: '/images/avatar1.jpg' },
    { name: 'User 2', avatar: '/images/avatar2.jpg' },
    { name: 'User 3', avatar: '/images/avatar3.jpg' },
  ]);
  const [showAllResults, setShowAllResults] = useState(false);

  const handleSearch = () => {
    // TODO: Make API call to search for users with searchTerm
    const results = [
      { name: 'User A', avatar: '/images/avatar4.jpg' },
      { name: 'User B', avatar: '/images/avatar5.jpg' },
      { name: 'User C', avatar: '/images/avatar6.jpg' },
    ];
    setSearchResults(results);
    setShowAllResults(false);
  };

  const handleShowAllResults = () => {
    setShowAllResults(true);
  };

  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/other profile');
  };

  

  return (
    <div className={classes.root}>
    <Card>
    <CardContent>
    <div className={classes.searchContainer}>
      <TextField
        className={classes.searchInput}
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="text" className={classes.searchButton} onClick={handleSearch}>
        Search
      </Button>
    </div>

      <div className={classes.usersContainer}>
        {searchResults.slice(0, showAllResults ? searchResults.length : 2).map((user) => (

            <div className={classes.user} key={user.name} onClick={handleUserClick}>
              <Avatar className={classes.avatar} src={user.avatar} alt={`${user.name} avatar`} />
              <Typography variant="subtitle1" className={classes.userName}>
                {user.name}
              </Typography>
            </div>

        ))}
      </div>
      {searchResults.length > 2 && !showAllResults && (
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
            <Avatar src={user.avatar} alt={`${user.name} avatar`} />
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

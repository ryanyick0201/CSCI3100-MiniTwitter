import { useState } from 'react';
import { Avatar, Button, TextField, Typography, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '40px 120px 120px 400px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
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
      <Button variant="contained" style={{backgroundColor: 'orange'}} onClick={handleSearch}>
        Search
      </Button>
    </div>

    {searchResults.length > 0 && (
      <div className={classes.usersContainer}>
        {searchResults.map((user) => (
          <Button component={Link} to={'/other profile'}>
          <div className={classes.user} key={user.name}>
            <Avatar className={classes.avatar} src={user.avatar} alt={`${user.name} avatar`} />
            <Typography variant="subtitle1" className={classes.userName}>
              {user.name}
            </Typography>
          </div>
          </Button>
        ))}
      </div>
    )}
    {showAllResults && (
      <div className={classes.usersContainer}>
        {recommendedUsers.map((user) => (
          <Button component={Link} to={'/other profile'}>
          <div className={classes.user} key={user.name}>
            <Avatar className={classes.avatar} src={user.avatar} alt={`${user.name} avatar`} />
            <Typography variant="subtitle1" className={classes.userName}>
              {user.name}
            </Typography>
          </div>
          </Button>
        ))}
      </div>
    )}
    {!showAllResults && (
      <Button variant="contained" style={{backgroundColor: 'orange'}} onClick={handleShowAllResults}>
        Click to view more
      </Button>
    )}
    </CardContent>
    </Card>




     <Card className={classes.card}>
     <CardContent>
     <Typography variant="h6">You may want to follow these users:</Typography>
     <div className={classes.usersContainer}>
      {recommendedUsers.map((user) => (
        
        <Button component={Link} to={'/other profile'}>
        <div className={classes.user} key={user.name}>
          <Avatar src={user.avatar} alt={`${user.name} avatar`} />
          <Typography variant="subtitle1" className={classes.userName}>
            {user.name}
          </Typography>
        </div>
        </Button>
        
      ))}
     </div>
     </CardContent>
     </Card>

    </div>
  );
}

export default SearchPage;

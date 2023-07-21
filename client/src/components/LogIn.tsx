import React from 'react';
import Auth from '../auth/Auth';
import Images1 from '../images/welcome-word-flat-cartoon-people-characters_81522-4207.png';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  heading: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  image: {
    width: '800px',
    marginBottom: theme.spacing(2),
  },
  paragraph: {
    marginBottom: theme.spacing(2),
  },
  loginButton: {
    marginTop: theme.spacing(2),
  },
}));

interface LogInProps {
  auth: Auth;
}

interface LogInState {}

export const LogIn: React.FC<LogInProps> = ({ auth }) => {
  const classes = useStyles();

  const handleLogin = () => {
    auth.login();
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.heading}>
      Welcome to our amazing website!
      </Typography>
      <img src={Images1} alt="Image 1" className={classes.image} />
      <Typography variant="body1" className={classes.paragraph}>
        Welcome to our amazing website! Please log in to continue.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLogin}
        className={classes.loginButton}
      >
        Log in
      </Button>
    </div>
  );
};

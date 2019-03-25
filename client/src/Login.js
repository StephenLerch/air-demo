import React from 'react';
import {Button, FormControl, Card, Input, InputLabel, Typography} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import './App.css';

const styles = theme => ({
  container: {
    margin: '15px',
    padding: '10px',
    width: '400px'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: false,
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const {username, password} = this.state;
    if (username === 'demo' && password === 'demo') {
      this.setState({error: false});
      setTimeout(() => this.props.history.push('/'), 2000);
    } else {
      this.setState({error: true});
    }
  };

  handleChange = name => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const {classes} = this.props;
    const {error} = this.state;
    const message = (error) ? <Typography variant="subtitle1">
      That username/password is incorrect. Try again!</Typography> : null;

    return (
      <div>
        <div className="app-header">Air Demo Login</div>
        <Card className={classes.container}>
        <Typography component="h1" variant="h5">Login</Typography>
          {message}
        <form className={classes.form} onSubmit={this.handleSubmit.bind(this)}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">User Name</InputLabel>
            <Input
              id="username"
              type={'text'}
              autoFocus
              onChange={this.handleChange('username')}
              value={this.state.username} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={'password'}
              onChange={this.handleChange('password')}
              value={this.state.password} />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log in
          </Button>
        </form>
      </Card>
    </div>
    );
  }
}

export default withStyles(styles)(Login);

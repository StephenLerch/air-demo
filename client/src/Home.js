import React, { Component } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid,
  List, ListItem, ListItemText, MenuItem, Radio, TextField, Typography} from '@material-ui/core';
import {getEndDateTimeInSeconds, getStartDateTimeInSeconds} from './Util';
import {airports} from './data/AirportData';
import {API_USERNAME, API_PASSWORD} from './config'
import './App.css';
import _ from 'lodash';
import {Link} from "react-router-dom";

class Home extends Component {
  minutesList = [];
  state = {
    airport: '',
    city: '',
    aResponse: {},
    dResponse: {},
    flightType: 'arrival',
    numberOfMinutes: 15,
    open: false
  };

  componentWillMount() {
    this.setTimeValues();
  }

  setTimeValues = () => {
    for (let i = 1; i <= 6; i++) {
      const value = (i * 15);
      const arrayObj = {id: i, value: value};
      this.minutesList.push(arrayObj);
    }
  };

  callApi = async (url) => {
    const headers = new Headers();
    const bytes = utf8.encode(API_USERNAME + ':' + API_PASSWORD);
    const encoded = base64.encode(bytes);
    headers.append('Authorization', 'Basic ' + encoded);
    const response = await fetch(url, {headers: headers});
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getData = (airport) => {
    const {numberOfMinutes} = this.state;
    const end = getEndDateTimeInSeconds() - 86400;  // Subtract 1 day
    const begin = getStartDateTimeInSeconds(numberOfMinutes, end);
    let url = `https://opensky-network.org/api/flights/arrival?airport=${airport}&begin=${begin}&end=${end}`;

    this.callApi(url)
      .then(res => this.setState({ aResponse: res }))
      .catch(err => console.log(err));

    url = `https://opensky-network.org/api/flights/departure?airport=${airport}&begin=${begin}&end=${end}`;
    this.callApi(url)
      .then(res => this.setState({ dResponse: res }))
      .catch(err => console.log(err));
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleMinutesChange = event => {
    event.preventDefault();
    const numberOfMinutes = event.target.value;
    const {airport} = this.state;

    this.setState({numberOfMinutes: numberOfMinutes});
    this.getData(airport);
  };

  handleRadioChange = event => {
    this.setState({flightType: event.target.value});
  } ;

  handleRowClick = (airport, city) => {
    this.getData(airport);
    this.setState({airport: airport, city: city, open: true});
  };

  render() {
    const {airport, city, aResponse = [], dResponse = [], flightType} = this.state;
    const flightTypeLabel = flightType === 'departure' ? 'Departures' : 'Arrivals';
    const numberOfFlights = flightType === 'departure' ? !_.isEmpty(dResponse) ? dResponse.length : 0
      : !_.isEmpty(aResponse) ? aResponse.length : 0;
    const airData = _.sortBy(airports, ['city']);

    return (
      <div className="app">
        <div className="app-header">Air Demo</div>
        <div className="app-subheader">
          <span>Set the number of minutes and then select the city to see airport data for the prior day.</span>
          <Link className="app-subheader-item" to="/login">Login</Link>
        </div>
        <div className="app-content">
          <div className="section">
            <div className="input-minutes">
              <TextField
                select
                fullWidth
                label="Number of Minutes"
                onChange={this.handleMinutesChange}
                value={this.state.numberOfMinutes}
              >
                {this.minutesList.length > 0 &&
                this.minutesList.map(item => (
                  <MenuItem key={item.id} value={item.value}>
                    {item.value}
                  </MenuItem>
                ))
                }
              </TextField>
            </div>
            <List className="app-list">
              <ListItem>
                <ListItemText className="listItem1" primary="Code" primaryTypographyProps={{variant: 'h6'}} />
                <ListItemText className="listItem2" primary="City" primaryTypographyProps={{variant: 'h6'}} />
              </ListItem>
              <Divider />
              {airData.map(x=>
                <ListItem key={x.id} button component="a" href="#" onClick={() => this.handleRowClick(x.airport, x.city)}>
                  <ListItemText className="listItem1" primary={x.airport} />
                  <ListItemText className="listItem2" primary={x.city} />
                </ListItem>
              )}
            </List>
          </div>
        </div>
        <Dialog
          fullWidth={true}
          maxWidth = {'sm'}
          onClose={this.handleClose}
          open={this.state.open}>
          <DialogTitle className="dialog-title">Airport Info</DialogTitle>
          <Divider />
          <DialogContent className="dialog-content">
            <Grid className="grid-container" container direction="row">
              <Grid item>
                <FormControlLabel
                  control={
                    <Radio
                      checked={flightType === 'arrival'}
                      onChange={this.handleRadioChange}
                      value="arrival"
                      name="flightType"
                    />
                  }
                  label={'Arrivals'}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Radio
                      checked={flightType === 'departure'}
                      onChange={this.handleRadioChange}
                      value="departure"
                      name="flightType"
                    />
                  }
                  label={'Departures'}
                />
              </Grid>
            </Grid>
            <Grid alignItems="stretch" direction="row" item container={true}>
              <Typography className="grid-label" variant="subtitle1">Airport:</Typography>
              <Typography className="grid" variant="subtitle1">{airport}</Typography>
            </Grid>
            <Grid alignItems="stretch" direction="row" item container={true}>
              <Typography className="grid-label" variant="subtitle1">City:</Typography>
              <Typography className="grid" variant="subtitle1">{city}</Typography>
            </Grid>
            <Grid alignItems="stretch" direction="row" item container={true}>
              <Typography className="grid-label" variant="subtitle1">{flightTypeLabel}:</Typography>
              <Typography className="grid" variant="subtitle1">{numberOfFlights}</Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Home;

import React, { Component } from 'react';
import './App.css';
import { GOOGLE_API_KEY } from './config';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      userAddress: null
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.reverseGeocodeCoordinate = this.reverseGeocodeCoordinate.bind(this);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    this.reverseGeocodeCoordinate()
  }

  reverseGeocodeCoordinate() {
    const { latitude, longitude } = this.state;

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=false&key=${GOOGLE_API_KEY}`)
      .then(response => response.json())
      .then(data => this.setState({userAddress: data.results[0].formatted_address}))
      .catch(error => alert(error))
  }

  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for location');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out');
        break;
      case error.UNKNOWN_ERROR:
        alert('An ubkwon error ocurred');
        break;
      default:
        alert('An unknow error ocurred');
    }
  }

  render() {
    const { latitude, longitude, userAddress } = this.state;
    console.log(GOOGLE_API_KEY);
    return (
      <div className="App">
        <h2> React Geolocation Example</h2>
        <button onClick={this.getLocation}> Get Coordinates </button>
        <h4>HTML5 Coordinates</h4>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        <h4>Google Maps Reverse Geocoding</h4>
        <p>Address: {userAddress}</p>
        {
          latitude && longitude ?
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x300&sensor=false&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_API_KEY}`} alt="" />
            :
            null
        }
      </div>
    );
  }
}

export default App;

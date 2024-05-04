import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlightController from '../controller/FlightController';

class BrowseFlight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: []
        };
        this.flightController = new FlightController();
    }

    async componentDidMount() {
        const flights = await this.flightController.fetchAllFlights();
        this.setState({ flights });
    }

    render() {
        const { flights } = this.state;

        return (
            <div className='main'>
				<div className="container">
                    <h3>All Flight list</h3>
                    <div>
                        {flights.map(flight => (
                            <div className="opt--box" key={flight.FlightID}>
                                <Link to={`/browseSeat/${flight.FlightID}`}><h2>{flight.FlightNumber || 'N/A'}</h2></Link>
                                <p>Departure Airport: {flight.DepartureAirport || 'N/A'}</p>
                                <p>Arrival Airport: {flight.ArrivalAirport || 'N/A'}</p>
                                <p>Departure Date: {flight.DepartureDate || 'N/A'}</p>
                                <p>Arrival Date: {flight.ArrivalDate || 'N/A'}</p>
                                <p>Available Seats: {flight.AvailableSeats !== undefined ? flight.AvailableSeats : 'N/A'}</p>
                                <p>Aircraft ID: {flight.AircraftID !== undefined ? flight.AircraftID : 'N/A'}</p>
                                <p>Price: {flight.Price !== undefined ? flight.Price : 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default BrowseFlight;



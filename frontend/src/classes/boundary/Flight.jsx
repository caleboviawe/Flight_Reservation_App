import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlightController from '../controller/FlightController';

class Flight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: []
        };
        this.flightController = new FlightController();
        this.handleDelete = this.handleDelete.bind(this);
    }

    async componentDidMount() {
        const flights = await this.flightController.fetchAllFlights();
        this.setState({ flights });
    }

    async handleDelete(id) {
        const isSuccess = await this.flightController.deleteFlight(id);
        if (isSuccess) {
            window.location.reload();
        }
    }

    render() {
        const { flights } = this.state;

        return (
            <div className='main'>
				<div className="container">
                    <h3>Flight list</h3>
                    <p>Prices displayed include taxes and may change based on availability.</p>
                    <div>
                        {flights.map(flight => (
                            <div className="opt--box" key={flight.FlightID} to={`/crew/${flight.FlightID}`}>
                                <Link to={`/crew/${flight.FlightID}`}><h2>{flight.FlightNumber || 'N/A'}</h2></Link>
                                <p>Departure Airport: {flight.DepartureAirport || 'N/A'}</p>
                                <p>Arrival Airport: {flight.ArrivalAirport || 'N/A'}</p>
                                <p>Departure Date: {flight.DepartureDate || 'N/A'}</p>
                                <p>Arrival Date: {flight.ArrivalDate || 'N/A'}</p>
                                <p>Available Seats: {flight.AvailableSeats !== undefined ? flight.AvailableSeats : 'N/A'}</p>
                                <p>Aircraft ID: {flight.AircraftID !== undefined ? flight.AircraftID : 'N/A'}</p>
                                <p>Price: {flight.Price !== undefined ? flight.Price : 'N/A'}</p>
                                <div>
                                    <button onClick={() => this.handleDelete(flight.FlightID)}>Delete</button>
                                    <Link to={`/updateFlight/${flight.FlightID}`}>
                                        <button>Update</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link to="/addFlight">
                        <button>Add new flight</button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Flight;

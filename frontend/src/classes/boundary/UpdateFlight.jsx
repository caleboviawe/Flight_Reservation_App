import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

class UpdateFlight extends Component {
	constructor(props) {
		super(props);
		this.state = {
            flight: {
                FlightNumber: "",
                DepartureAirport: "",
                ArrivalAirport: "",
                DepartureDateTime: "",
                ArrivalDateTime: "",   
                DepartureDate: "",
                ArrivalDate: "",
                DepartureTime: "",     
                ArrivalTime: "",      
                AvailableSeats: 378,
                AircraftID: 0,
                Price: 0.0
            }
		};
		this.flightID = this.props.location.pathname.split("/")[2];
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(e) {
		this.setState((prevState) => ({
			flight: { ...prevState.flight, [e.target.name]: e.target.value },
		}));
	}

	async handleClick(e) {
		e.preventDefault();
		try {
			await axios.put(
				"http://localhost:3001/flight/" + this.flightID,
				this.state.flight
			);
			this.props.navigate("/flight");
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const { flight } = this.state;

		return (
			<div className="main">
				<div className="container">
					<h3>Update a Flight</h3>
					<div className="options">
						<label>Flight Number</label>
						<input type="text" placeholder="Flight Number" onChange={this.handleChange} name="FlightNumber" value={flight.FlightNumber} />
						<label>Departure Airport</label>
						<input type="text" placeholder="Departure Airport" onChange={this.handleChange} name="DepartureAirport" value={flight.DepartureAirport} />
						<label>Arrival Airport</label>
						<input type="text" placeholder="Arrival Airport" onChange={this.handleChange} name="ArrivalAirport" value={flight.ArrivalAirport} />
						<label>Departure Date</label>
						<input type="date" id="DepartureDate" onChange={this.handleChange} name="DepartureDate" value={flight.DepartureDate} />
						<label>Arrival Date</label>
						<input type="date" id="ArrivalDate" onChange={this.handleChange} name="ArrivalDate" value={flight.ArrivalDate} />
						{/* <label>Number of Available Seats</label>
						<input type="number" placeholder="Available Seats" onChange={this.handleChange} name="AvailableSeats" value={flight.AvailableSeats} /> */}
						<label>Aircraft ID</label>
						<input type="number" placeholder="Aircraft ID" onChange={this.handleChange} name="AircraftID" value={flight.AircraftID} />
						<label>Price</label>
						<input type="number" placeholder="Price" step="10" onChange={this.handleChange} name="Price" value={flight.Price} />
						<button className="formButton" onClick={this.handleClick}>Update</button>
					</div>
				</div>
			</div>
		);
	}
}

export default function UpdateFlightWithRouter(props) {
	const navigate = useNavigate();
	const location = useLocation();
	return <UpdateFlight navigate={navigate} location={location}></UpdateFlight>;
}


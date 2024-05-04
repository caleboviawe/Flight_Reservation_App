import React, { Component } from 'react';
import axios from "axios";
import UserSingleton from '../UserSingleton';
import DateFormatter from "../controller/DateFormatter";

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: []
        };
    }

    componentDidMount() {
        const userInstance = UserSingleton.getInstance();
        // console.log(userInstance.getUserData());
        const flightID = userInstance.getUserData().FlightID;

        this.fetchReservations(flightID);
    }

    async fetchReservations(flightID) {
        try {
            const res = await axios.get(`http://localhost:3001/reservation/${flightID}`);
            // console.log(res);
            this.setState({ reservations: res.data });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { reservations } = this.state;
        const dateFormatter = new DateFormatter();

        return (
            <div className='main'>
				<div className="container">
                    <h3>Passenger list</h3>
                    <div>
                        {reservations.map(reservation => (
                            <div className="opt--box" key={reservation.ReservationID}>
                                <h2>{reservation.PassengerName || 'N/A'}</h2>
                                <p>TicketID: {reservation.TicketID || 'N/A'}</p>
                                <p>Seat Number: {reservation.SeatNumber || 'N/A'}</p>
                                <p>Seat Type: {reservation.SeatType || 'N/A'}</p>
                                <p>Reservation Date: {dateFormatter.formatDate(reservation.ReservationDate) || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Reservation;


import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import CrewController from "../controller/CrewController";

class Crew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flightAttendants: [],
        };
        this.crewController = new CrewController();
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const flightID = this.props.location.pathname.split("/")[2];
        this.crewController.setFlightID(flightID);
        this.fetchAllFlightAttendants();
    }

    async fetchAllFlightAttendants() {
        const flightAttendants = await this.crewController.fetchAllFlightAttendants();
        this.setState({ flightAttendants });
    }

    async handleDelete(id) {
        const success = await this.crewController.deleteFlightAttendant(id);
        if (success) {
            window.location.reload();
        }
    }

    render() {
        const { flightAttendants } = this.state;

        return (
            <div className='main'>
            <div className="container">
            <h3>Flight Attendants' List</h3>
                <div className="flightAttendants">
                    {flightAttendants.map((attendant) => (
                        <div className="opt--box" key={attendant.UserID}>
                            <h2>{attendant.Name || "N/A"}</h2>
                            <p>Email: {attendant.Email || "N/A"}</p>
                            <p>Address: {attendant.Address || "N/A"}</p>
                            <p>Flight ID: {attendant.FlightID !== undefined ? attendant.FlightID : "N/A"}</p>
                            <p>Role: {attendant.Role || "N/A"}</p>
                            <div>
                                <button className="delete" onClick={() => this.handleDelete(attendant.UserID)}>Delete</button>
                                {/* Update button - You'll need to create a route and handle the update functionality */}
                                <Link to={`/updateCrew/${attendant.UserID}`}>
                                    <button>Update</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to={`/addCrew/${this.crewController.flightID}`}>
                    <button>Add new Flight Attendant</button>
                </Link>
            </div>
        </div>
        );
    }
}

export default function CrewWithRouter(props) {
	const navigate = useNavigate();
	const location = useLocation();
	return <Crew navigate={navigate} location={location}></Crew>;
}

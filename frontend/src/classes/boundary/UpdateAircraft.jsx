import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

class UpdateAircraft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aircraft: {
                Name: ""
            }
        };
        this.aircraftID = this.props.location.pathname.split("/")[2];
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.setState((prevState) => ({
            aircraft: { ...prevState.aircraft, [e.target.name]: e.target.value },
        }));
    }

    async handleClick(e) {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3001/aircraft/${this.aircraftID}`,
                this.state.aircraft
            );
            this.props.navigate("/aircraft");
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { aircraft } = this.state;

        return (
            <div className="main">
                <div className="container">
                    <h3>Update Aircraft</h3>
                    <div className="opt--box">
                        <input type="text" placeholder="Aircraft Name" onChange={this.handleChange} name="Name" value={aircraft.Name} />
                        <button className="formButton" onClick={this.handleClick}>Update</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default function UpdateAircraftWithRouter(props) {
    const navigate = useNavigate();
    const location = useLocation();
    return <UpdateAircraft navigate={navigate} location={location}></UpdateAircraft>;
}

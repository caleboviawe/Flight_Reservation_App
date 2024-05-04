import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AircraftController from '../controller/AircraftController';

class AircraftBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aircrafts: []
        };
        this.controller = new AircraftController();
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.fetchAllAircrafts();
    }

    async fetchAllAircrafts() {
        try {
            const aircrafts = await this.controller.getAllAircrafts();
            this.setState({ aircrafts });
        } catch (err) {
            console.log(err);
        }
    }

    async handleDelete(id) {
        try {
            await this.controller.deleteAircraft(id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { aircrafts } = this.state;

        return (
            <div className="main">
				<div className="container">
                    <h3>Aircraft list</h3>
                    <div>
                        {aircrafts.map(aircraft => (
                            <div className="opt--box" key={aircraft.AircraftID}>
                                <h2>{aircraft.Name || 'N/A'}</h2>
                                <p>ID: {aircraft.AircraftID || 'N/A'}</p>
                                <div>
                                    <button className="delete" onClick={() => this.handleDelete(aircraft.AircraftID)}>Delete</button>
                                    <Link to={`/updateAircraft/${aircraft.AircraftID}`}>
                                        <button>Update</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/addAircraft">
                        <button>Add new aircraft</button> 
                    </Link>
                </div>
            </div>
        );
    }
}

export default AircraftBoundary;

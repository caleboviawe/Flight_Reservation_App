import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

class AddAircraft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aircraft: {
                Name: ""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleChange(e) {
        const { aircraft } = this.state;
        this.setState({
            aircraft: {
                ...aircraft,
                [e.target.name]: e.target.value
            }
        });
    }

    async handleClick(e) {
        e.preventDefault();
        const { aircraft } = this.state;
        try {
            await axios.post("http://localhost:3001/aircraft", aircraft);
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
                    <h3>Add New Aircraft</h3>
                    <div className="options">
                        <input type="text" placeholder="Aircraft Name" onChange={this.handleChange} name="Name" value={aircraft.Name} />
                        <button className="formButton" onClick={this.handleClick}>Add</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default function AddAircraftWithRouter(props) {
    const navigate = useNavigate();
    return (<AddAircraft navigate={navigate}></AddAircraft>);
};

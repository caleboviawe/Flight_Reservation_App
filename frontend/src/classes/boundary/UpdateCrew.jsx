import React, { Component } from "react";
import RegistrationValidation from "../controller/RegistrationValidation";
import UserValidation from "../controller/UserValidation";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

class UpdateCrew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: "",
                email: "",
                password: "",
                address: "",
                flightID: "",
                role: "Crew",
            },
            errors: {
                email: "",
                password: "",
                other: "",
            },
        };
		this.flightAttendantID = this.props.location.pathname.split("/")[2];
    }

    handleChange = (e) => {
        this.setState((prevState) => ({
            values: { ...prevState.values, [e.target.name]: e.target.value },
            errors: { ...prevState.errors, [e.target.name]: "", other: "" },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { values } = this.state;
        const validationErrors = RegistrationValidation.validate(values);
        const res = await UserValidation.validate(values);
        
        if (res[0] === 1) {
            this.setState({ errors: { other: "Account already exists" } });
        } else {
            this.setState({ errors: validationErrors });

            if (!validationErrors.email && !validationErrors.password) {
                try {
                    await axios.put("http://localhost:3001/crew/" + this.flightAttendantID, values
					);
                    this.props.navigate("/crew/"+values.flightID);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    render() {
        const { values, errors } = this.state;
        return (
            <div className="main">
                <div className="container">
                    <h3>Update Flight Attendant</h3>
                <form action="" onSubmit={this.handleSubmit}>
                    <div className="options">
                        <div className="opt--box">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                onChange={this.handleChange}
                                name="email"
                                value={values.email}
                            />
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                        <div className="opt--box">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                onChange={this.handleChange}
                                name="password"
                                value={values.password}
                            />
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                        <div className="opt--box">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                onChange={this.handleChange}
                                name="name"
                                value={values.name}
                            />
                        </div>
                        <div className="opt--box">
                            <label>Address</label>
                            <input
                                type="text"
                                placeholder="Enter Address"
                                onChange={this.handleChange}
                                name="address"
                                value={values.address}
                            />
                        </div>
                        <div className="opt--box">
                            <label>FlightID</label>
                            <input
                                type="number"
                                placeholder="Enter FlightID"
                                onChange={this.handleChange}
                                name="flightID"
                                value={values.flightID}
                            />
                        </div>
                    </div>
                    {errors.other && <p>{errors.other}</p>}
                    <button type="submit">Update</button>
                </form>
                </div>
            </div>
        );
    }
}

export default function UpdateCrewWithRouter(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return (<UpdateCrew navigate={navigate} location={location}></UpdateCrew>);
};

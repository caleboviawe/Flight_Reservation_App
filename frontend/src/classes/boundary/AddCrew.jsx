import React, { Component } from "react";
import RegistrationValidation from "../controller/RegistrationValidation";
import UserValidation from "../controller/UserValidation";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

class AddCrew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: "",
                email: "",
                password: "",
                address: "",
                flightID: this.props.location.pathname.split("/")[2],
                role: "Crew",
            },
            errors: {
                email: "",
                password: "",
                other: "",
            },
        };
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
                    await axios.post("http://localhost:3001/crew", values);
                    this.props.navigate("/crew/"+this.props.location.pathname.split("/")[2]);
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
                    <h3>Add Flight Attendant</h3>
                    <form action="" onSubmit={this.handleSubmit}>
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
                        {errors.other && <p>{errors.other}</p>}
                        <button type="submit">Create Account</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default function AddCrewWithRouter(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return (<AddCrew navigate={navigate} location={location}></AddCrew>);
};

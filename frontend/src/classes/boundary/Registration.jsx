import React, { Component } from "react";
import RegistrationValidation from "../controller/RegistrationValidation";
import UserValidation from "../controller/UserValidation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Customer",
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
    console.log(res);
    if (res[0] === 1) {
      this.setState({ errors: { other: "Account already exists" } });
    } else {
      this.setState({ errors: validationErrors });

      if (!validationErrors.email && !validationErrors.password) {
        try {
          await axios.post("http://localhost:3001/register", values);
          this.props.navigate("/login");
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
          <h3>Registration</h3>
          <p>Enter your details below.</p>
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
            </div>
            {errors.other && <p>{errors.other}</p>}
            <button type="submit">Create Account</button>
          </form>
        </div>
      </div>
    );
  }
}

export default function RegistrationWithRouter(props) {
  const navigate = useNavigate();
  return <Registration navigate={navigate}></Registration>;
}

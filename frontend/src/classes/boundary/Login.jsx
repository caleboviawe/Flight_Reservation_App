import React, { Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import UserValidation from '../controller/UserValidation';
import UserSingleton from '../UserSingleton'; 

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                email: "",
                password: ""
            },
            errors: {
                email: "",
                password: "",
                other: ""
            }
        };
    }

    handleChange = (e) => {
        this.setState(prevState => ({
            values: { ...prevState.values, [e.target.name]: e.target.value },
            errors: { ...prevState.errors, [e.target.name]: "", other: "" }
        }));
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { values } = this.state;
            const res = await UserValidation.validate(values);
            if (res[0] === 1 && res[1] === 1) {
                const userInstance = UserSingleton.getInstance();
                userInstance.setLoggedInStatus(true);
                userInstance.setUser(res[2]);
                console.log(userInstance.getLoggedInStatus())
                
                if (res[2].Role === "Customer") {
                    this.props.navigate("/customerOption");
                }
                else if (res[2].Role === "Crew") {
                    this.props.navigate("/passenger");
                }
                else {
                    this.props.navigate("/adminOption");
                }
            } else {
                if (values.email === "" && values.password === "") {
                    this.setState({
                        errors: { email: "Email should not be empty", password: "Password should not be empty" }
                    });
                } else if (values.email === "") {
                    this.setState({
                        errors: { email: "Email should not be empty" }
                    });
                } else if (values.password === "") {
                    this.setState({
                        errors: { password: "Password should not be empty" }
                    });
                } else {
                    this.setState({
                        errors: { other: "Invalid email or password" }
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const { values, errors } = this.state;
        return (
            <div className='main'>
                <div className="container">
                    <h3>Login</h3>
                    <p>Enter your details below.</p>
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className='options'>
                            <div className='opt--box'>
                                <label>Email</label>
                                <input type="email" placeholder="Enter Email" onChange={this.handleChange} name="email" value={values.email} />
                                {errors.email && <span>{errors.email}</span>}
                            </div>
                            <div className='opt--box'>
                                <label>Password</label>
                                <input type="password" placeholder="Enter Password" onChange={this.handleChange} name="password" value={values.password} />
                                {errors.password && <span>{errors.password}</span>}
                            </div>
                        </div>
                        {errors.other && <p>{errors.other}</p>}
                        <button type="submit">Login</button>
                        <br/>
                        <br/>
                        <p>New to the app? Sign up today!</p>
                        <Link to="/registration">
                            <button>Sign up</button>
                        </Link>
                    </form>
                </div>
            </div>
        );
    }
}

export default function LoginWithRouter(props) {
    const navigate = useNavigate();
    return (<Login navigate={navigate}></Login>);
};
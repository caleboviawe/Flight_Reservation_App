import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserSingleton from '../UserSingleton'; 

class View extends Component {
	constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

	handleClick() {
		const userInstance = UserSingleton.getInstance();
		userInstance.setLoggedInStatus(false);
		userInstance.setUser(null);
	}

	render() {
		return (
			<div className="main">
				<p >Welcome to the Flight Booking Web Application by Group 20!</p>
				<div className="options">
					<div className="opt--box">
						<p>Alread have an account? Log in below.</p>
						<Link to="/login">
							<button>Login</button>
						</Link>
					</div>
					<div className="opt--box">
						<p>No account No problem! Continue as Guest</p>
						<Link to="/customerOption">
							<button onClick={this.handleClick}>Guest user</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default View;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserSingleton from "../UserSingleton";

class CustomerOption extends Component {
	render() {
		const userInstance = UserSingleton.getInstance();
		console.log(userInstance.getLoggedInStatus())
		return (
			<div className="main">
				<div className="container">
                    <h3>Customer Option</h3>
					<div className="opt--box">
						<Link to="/browseFlight">
							<button>Browse Flight</button>
						</Link>
						<Link to="/cancel">
							<button>Cancel Flight</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default CustomerOption;

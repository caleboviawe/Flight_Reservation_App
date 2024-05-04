import React, { Component } from "react";
import { Link } from "react-router-dom";

class AdminOption extends Component {
	render() {
		return (
			<div className="main">
                <div className="container">
					<h3>Admin Access</h3>
					<p>Choose an option to view.</p>
					<div className="options">
						<div className="opt--box"> 
							<p>View Flight List.</p>
							<Link to="/flight">
								<button>Flights</button>
							</Link>
						</div>
						<div className="opt--box">
							<p>View Aircraft List.</p>
							<Link to="/aircraft">
								<button>Aircraft</button>
							</Link>
						</div>
						<div className="opt--box">
							<p>View Users' List.</p>
							<Link to="/viewUser">
								<button>User</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminOption;

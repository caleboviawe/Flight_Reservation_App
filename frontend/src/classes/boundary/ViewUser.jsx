import React, { Component } from "react";
import axios from "axios";

class ViewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        this.fetchAllUsers();
    }

    async fetchAllUsers() {
        try {
            const res = await axios.get("http://localhost:3001/users");
            console.log(res);
            this.setState({ users: res.data });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { users } = this.state;

        return (
            <div className="main">
				<div className="container">
                    <h3>Users' list</h3>
                    <div>
                        {users.map(user => (
                            <div className="opt--box" key={user.UserID}>
                                <h2>{user.Name || 'N/A'}</h2>
                                <p>ID: {user.UserID || 'N/A'}</p>
                                <p>Email: {user.Email || 'N/A'}</p>
                                <p>Address: {user.Address || 'N/A'}</p>
                                <p>Position: {user.Role || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewUser;

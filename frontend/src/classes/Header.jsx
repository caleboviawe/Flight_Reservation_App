import React, { Component } from "react";
import UserSingleton from "./UserSingleton";

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoggedIn: false 
      };
    }
  
    componentDidMount() {
        const userInstance = UserSingleton.getInstance();
        const isLoggedIn = userInstance.getLoggedInStatus();
        this.setState({ isLoggedIn });
        userInstance.subscribeToLoginStatus(this.handleLoginStatusChange);
      }
      
      componentWillUnmount() {
        const userInstance = UserSingleton.getInstance();
        userInstance.unsubscribeFromLoginStatus(this.handleLoginStatusChange);
      }
      
      handleLoginStatusChange = isLoggedIn => {
        this.setState({ isLoggedIn });
      };
  
    handleLogout = () => {
      const userInstance = UserSingleton.getInstance();
      userInstance.setLoggedInStatus(false);
      userInstance.setUser(null);
      window.location.href = "/";
    };
  
    handleLogin = () => {
      window.location.href = "/login";
    };

	render() {
		const userInstance = UserSingleton.getInstance();
		const isLoggedIn = userInstance.getLoggedInStatus();

		const headerStyle = {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			borderBottom: "1px solid #ccc",
			padding: "10px 20px",
		};

		const sectionStyle = {
			flex: 1,
		};

		const titleStyle = {
			textAlign: "center",
		};

		const buttonContainerStyle = {
			display: "flex",
			justifyContent: "flex-end",
		};

		return (
			<div style={headerStyle}>
				<div className="left" style={sectionStyle}></div>
				<div className="center" style={{ ...sectionStyle, ...titleStyle }}>
					<h1 className='title'>Debugging Airways</h1>
				</div>
				<div className="right" style={sectionStyle}>
					<div style={buttonContainerStyle}>
						{isLoggedIn ? (
							<button onClick={this.handleLogout}>Logout</button>
						) : (
							<button onClick={this.handleLogin}>Login</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Header;

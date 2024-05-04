import React, { Component } from "react";
import Header from "./Header";

class PageDecorator {
	constructor(WrappedComponent) {
		this.WrappedComponent = WrappedComponent;
	}

	render() {
		const withHeaderStyle = {
			display: "block",
		};

		const { WrappedComponent } = this;
		return class extends Component {
			render() {
				return (
					<div style={withHeaderStyle}>
						<Header />
						<WrappedComponent {...this.props} />
					</div>
				);
			}
		};
	}
}

export default PageDecorator
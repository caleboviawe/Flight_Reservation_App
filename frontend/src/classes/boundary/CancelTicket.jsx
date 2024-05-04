import React, { Component } from "react";
import axios from "axios";
import DateFormatter from "../controller/DateFormatter";
import EmailSender from "../controller/EmailSender";
import UserSingleton from "../UserSingleton";

class CancelTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passengers: [], // Initialize an empty array to hold passenger data
			userInput: "", // Store user input
			displayMessage: "", // Message to display based on input
			ticketFound: false, // Flag to indicate if ticket is found
			ticketData: null, // Store ticket data
		};
		this.userInstance = UserSingleton.getInstance();
	}

	async componentDidMount() {
		const response = await axios.get("http://localhost:3001/passenger");
		this.setState({ passengers: response.data });
	}

	handleInputChange = (event) => {
		this.setState({ userInput: event.target.value });
		this.setState({ displayMessage: "" });
		this.setState({ ticketFound: false });
		this.setState({ ticketData: null });
	};

	checkTicketID = async () => {
		const { passengers, userInput } = this.state;
		// Check if userInput exists as a TicketID in passengers array
		const foundPassenger = passengers.find(
			(passenger) => passenger.TicketID === userInput
		);
		if (foundPassenger) {
			this.setState({ ticketFound: true });
			await this.getTicketData(userInput); // Call method to fetch ticket data
			console.log(this.state.ticketData);
		} else {
			this.setState({
				displayMessage: "Passenger not found!",
				ticketFound: false,
			});
		}
	};

	getTicketData = async (ticketID) => {
		try {
			const response = await axios.get(
				`http://localhost:3001/ticket/${ticketID}`
			);
			// console.log(response.data);
			this.setState({ ticketData: response.data[0] });
		} catch (error) {
			console.error("Error fetching ticket data:", error);
		}
	};

	cancelTicket = async () => {
		const { userInput, passengers } = this.state;
		try {
			let userEmail = this.state.ticketData.Email;
			const canceledTicket = userInput;

			await axios.delete(`http://localhost:3001/ticket/${userInput}`);

			const updatedPassengers = passengers.filter(
				(passenger) => passenger.TicketID !== userInput
			);
			this.setState({
				displayMessage: "Ticket canceled successfully!",
				passengers: updatedPassengers,
				ticketFound: false,
				ticketData: null,
				userInput: "",
			});

			if (!userEmail) {
				userEmail = this.userInstance.getUserData().Email;
			}

			const emailSender = new EmailSender();
			emailSender.setEmail(userEmail);
			emailSender.setSubject(
				`Flight Ticket Cancellation - Ticket #${canceledTicket}`
			);
			emailSender.setMessage(`
        <p>Dear valued passenger,</p>
        <p>This email is to confirm that we have received your request to cancel the flight ticket with the ticket number ${canceledTicket}.</p>
        <p>Your cancellation request has been processed accordingly.</p>
        <p>If you have any further inquiries or need assistance, please feel free to contact our customer support.</p>
        <p>Thank you for choosing our service.</p>
        <p>Best regards,<br>The Flight Service Team</p>
      `);

			try {
				emailSender.sendMail();
				console.log("Email sent successfully");
			} catch (error) {
				console.error("Failed to send email:", error);
			}
		} catch (error) {
			console.error("Error canceling ticket:", error);
			this.setState({ displayMessage: "Failed to cancel the ticket." });
		}
	};

	render() {
		const { displayMessage, ticketData } = this.state;

		const dateFormatter = new DateFormatter();
		let refundDetails = null;

		if (ticketData) {
      let actualTicketCost = ticketData.Cost;
      let refundPercentage = ticketData.Insurance ? 100 : 50;
  
      if (ticketData.Insurance) {
        actualTicketCost /= 1.1; // Actual cost without insurance
      }
  
      let refundAmount = actualTicketCost * (refundPercentage / 100);
  
      let refundReason = ticketData.Insurance ? 'due to insurance' : 'since no insurance was purchased';

			refundDetails = (
				<div>
					<h2>Refund Details</h2>
					<p>
						Refund Percentage: {refundPercentage}% ({refundReason})
					</p>
					<p>Refund Amount: ${refundAmount.toFixed(2)}</p>
				</div>
			);
		}

		return (
			<div className="main">
				<div className="container">
                    <h3>Cancel Ticket</h3>
					<div className="options">
						<div className="opt--box">
							<input
								type="text"
								placeholder="Enter TicketID"
								onChange={this.handleInputChange}
								value={this.state.userInput}
								required
							/>
							<button onClick={this.checkTicketID}>Find Ticket</button>
							<p>{displayMessage}</p>
						</div>
						{ticketData && (
							<div className="opt--box">
								<h1>Ticket Details</h1>
								<p>Seat Number: {ticketData.SeatNumber}</p>
								<p>Seat Type: {ticketData.SeatType}</p>
								<p>FlightNumber: {ticketData.FlightNumber}</p>
								<p>DepartureAirport: {ticketData.DepartureAirport}</p>
								<p>ArrivalAirport: {ticketData.ArrivalAirport}</p>
								<p>
									DepartureDate:{" "}
									{dateFormatter.formatDate(ticketData.DepartureDate)}
								</p>
								<p>
									ArrivalDate: {dateFormatter.formatDate(ticketData.ArrivalDate)}
								</p>
								{refundDetails}
								<button onClick={this.cancelTicket}>Cancel Ticket</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default CancelTicket;

import React, { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserSingleton from "../UserSingleton";
import DateFormatter from "../controller/DateFormatter";
import EmailSender from "../controller/EmailSender";
import TicketNumberGenerator from "../controller/TicketNumberGenerator";

class BookTicket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			values: {
				name: "",
				email: "",
				creditCard: "", 
				flightID: this.props.location.pathname.split("/")[2],
				seatNumber: `${this.props.location.pathname.split("/")[3]}${
					this.props.location.pathname.split("/")[4]
				}`,
				seatType: this.SeatType(this.props.location.pathname.split("/")[4]),
				reservationDate: new Date().toISOString().slice(0, 10),
			},
			paymentCompleted: false,
			price: 0,
			flight: {},
			insurance: 0,
			promoApplied: false,
		};
		this.userInstance = UserSingleton.getInstance();
		this.handlePay = this.handlePay.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		await this.updatePrice();
	}

	async updatePrice() {
		const res = await axios.get(
			`http://localhost:3001/flight/${this.state.values.flightID}`
		);
		const flight = res.data[0];
		const row = this.props.location.pathname.split("/")[4];
		let price = flight.Price;
		if (row >= 1 && row <= 6) {
			price *= 1.4 * 2;
		} else if (row >= 7 && row <= 18) {
			price *= 1.4;
		}

		price = parseFloat(price.toFixed(2));
		this.setState({ price, flight });
	}

	SeatType(row) {
		if (row >= 1 && row <= 6) {
			return "Business";
		} else if (row >= 7 && row <= 18) {
			return "Comfort";
		} else {
			return "Ordinary";
		}
	}

	handlePay(e) {
		e.preventDefault();
		const { values } = this.state;

		if (values.creditCard.length === 16) {
			this.setState({ paymentCompleted: true });
		} else {
			console.log("Please enter a 16-digit credit card number.");
		}
	}

	handleChange(e) {
		const { name, value } = e.target;

		if (name === "creditCard") {
			const onlyDigits = value.replace(/\D/g, ""); 
			this.setState((prev) => ({
				values: { ...prev.values, [name]: onlyDigits },
			}));
		} else {
			this.setState((prev) => ({
				values: { ...prev.values, [name]: value },
			}));
		}
	}

	async handleSubmit(e) {
		e.preventDefault();
		const { values, paymentCompleted } = this.state;

		const ticketGenerator = new TicketNumberGenerator(8);
		const ticketNumber = ticketGenerator.generateTicketNumber();

		if (paymentCompleted) {
			let userID = null;
			const userData = this.userInstance.getUserData();

			if (userData) {
				userID = userData.UserID;
			}

			const postData = {
				Name: values.name,
				Email: values.email,
				TicketID: ticketNumber,
				UserID: userID,
				Cost: this.state.price,
				Insurance: this.state.insurance,
			};

			try {
				const response = await axios.post(
					"http://localhost:3001/passenger",
					postData
				);
				const passengerID = response.data.PassengerID;

				const reservationData = {
					PassengerID: passengerID,
					FlightID: values.flightID,
					SeatNumber: values.seatNumber,
					SeatType: values.seatType,
					ReservationDate: values.reservationDate,
				};

				await axios.post("http://localhost:3001/reservation", reservationData);
			} catch (err) {
				console.error(err);
			}
		}

		let emailAddress = values.email;
		if (!emailAddress) {
			emailAddress = this.userInstance.getUserData().Email;
		}

		const emailSender = new EmailSender();
		emailSender.setEmail(emailAddress);
		emailSender.setSubject(
			`Flight Order Confirmation - Ticket #${ticketNumber}`
		);
		emailSender.setMessage(`
		<p>Dear valued passenger,</p>
		<p>We are delighted to confirm your flight order. Your unique ticket number for reference is: ${ticketNumber}.</p>
		<p>Thank you for choosing our service. We look forward to serving you on board!</p>
		<p>Best regards,<br>The Flight Service Team</p>
		`);

		try {
			emailSender.sendMail();
			console.log("Email sent successfully");
		} catch (error) {
			console.error("Failed to send email:", error);
		}

		this.props.navigate("/confirmation");
	}

	handlePriceReduction = (e) => {
		e.preventDefault();
		const { price } = this.state;
		const updatedPrice = (price * 0.95).toFixed(2);
		this.setState({ price: parseFloat(updatedPrice), promoApplied: true });
	};

	handleInsuranceToggle = (e) => {
		e.preventDefault();
		this.setState((prevState) => {
			let updatedPrice = prevState.price;
			if (!prevState.insurance) {
				updatedPrice *= 1.1;
			} else {
				updatedPrice /= 1.1;
			}
	
			return {
				insurance: !prevState.insurance,
				price: parseFloat(updatedPrice.toFixed(2)),
			};
		});
	};
	

	render() {
		const { values, price, flight, paymentCompleted, promoApplied } =
			this.state;
		const isUserLoggedIn = this.userInstance.getUserData();
		const dateFormatter = new DateFormatter();
		const isCreditCardValid = values.creditCard.length === 16;

		return (
			<div className="main">
				<div className="container">
                    <h3>Book Ticket</h3>
					<div className="opt--box">
						{isUserLoggedIn && <h2>Registered User</h2>}
						<p>Seat Number: {values.seatNumber}</p>
						<p>Seat Type: {values.seatType}</p>
						<p>Price: ${price}</p>
						<p>FlightNumber: {flight.FlightNumber}</p>
						<p>DepartureAirport: {flight.DepartureAirport}</p>
						<p>ArrivalAirport: {flight.ArrivalAirport}</p>
						<p>DepartureDate: {dateFormatter.formatDate(flight.DepartureDate)}</p>
						<p>ArrivalDate: {dateFormatter.formatDate(flight.ArrivalDate)}</p>
					</div>
					<div className="options">
						<form onSubmit={this.handleSubmit}>
							<div className="opt--box">
								<label>Name</label>
								<input
									type="text"
									placeholder="Enter Name"
									onChange={this.handleChange}
									name="name"
									value={values.name}
									required
								/>
							</div>
							{!isUserLoggedIn && (
								<div className="opt--box">
									<label>Email</label>
									<input
										type="email"
										placeholder="Enter Email"
										onChange={this.handleChange}
										name="email"
										value={values.email}
										required
									/>
								</div>
							)}
							<div className="opt--box">
								<label>Credit Card Number</label>
								<input
									type="text"
									placeholder="Enter Credit Card Number"
									onChange={this.handleChange}
									name="creditCard"
									value={values.creditCard}
									required
									pattern="[0-9]*" 
									minLength={16}
									maxLength={16}
								/>
							</div>
							<button onClick={this.handleInsuranceToggle}>
								{this.state.insurance ? "Remove Insurance" : "Add Insurance"}
							</button>
							{isUserLoggedIn && (
								<>
									<button
										onClick={this.handlePriceReduction}
										disabled={promoApplied}
										style={{
											filter: !promoApplied ? "none" : "grayscale(100%)", 
											pointerEvents: !promoApplied ? "auto" : "none", 
										}}
									>
										Promo
									</button>
								</>
							)}
							<button
								onClick={this.handlePay}
								disabled={!isCreditCardValid || paymentCompleted}
								style={{
									filter:
										!isCreditCardValid || paymentCompleted
											? "grayscale(100%)"
											: "none",
									pointerEvents:
										!isCreditCardValid || paymentCompleted ? "none" : "auto",
								}}
							>
								Pay
							</button>
							<button
								type="submit"
								disabled={!paymentCompleted}
								style={{
									filter: paymentCompleted ? "none" : "grayscale(100%)", 
									pointerEvents: paymentCompleted ? "auto" : "none", 
								}}
							>
								Confirm
							</button>
						</form>

					</div>
				</div>
			</div>
		);
	}
}

export default function BookTicketWithRouter(props) {
	const location = useLocation();
	const navigate = useNavigate();
	return <BookTicket navigate={navigate} location={location}></BookTicket>;
}

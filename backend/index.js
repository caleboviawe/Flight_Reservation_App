import express from "express";
import nodemailer from "nodemailer";
import mysql from "mysql";
import cors from "cors";

class FlightReservationApp {
	constructor() {
		this.app = express();
		this.db = mysql.createConnection({
			host: "localhost",
			user: "username",
			password: "password",
			database: "flight_reservation_v2",
		});
		this.setupMiddleware();
		this.setupRoutes();
	}

	setupMiddleware() {
		this.app.use(cors());
		this.app.use(express.json({ limit: "25mb" }));
		this.app.use((req, res, next) => {
			res.setHeader("Access-Control-Allow-Origin", "*");
			next();
		});
	}

	setupRoutes() {
		this.app.get("/sendEmail", this.handleSendEmail.bind(this));

		this.app.get("/", this.handleRoot.bind(this));
		this.app.get("/aircraft", this.getAircraft.bind(this));
		this.app.post("/aircraft", this.createAircraft.bind(this));
		this.app.delete("/aircraft/:id", this.deleteAircraft.bind(this));
		this.app.put("/aircraft/:id", this.updateAircraft.bind(this));

		this.app.get("/flight", this.getFlight.bind(this));
		this.app.get("/flight/:id", this.getSpecificFlight.bind(this));
		this.app.post("/flight", this.createFlight.bind(this));
		this.app.delete("/flight/:id", this.deleteFlight.bind(this));
		this.app.put("/flight/:id", this.updateFlight.bind(this));

		this.app.get("/crew/:id", this.getCrew.bind(this));
		this.app.post("/crew", this.createCrew.bind(this));
		this.app.delete("/crew/:id", this.deleteCrew.bind(this));
		this.app.put("/crew/:id", this.updateCrew.bind(this));

		this.app.post("/register", this.registerUser.bind(this));
		this.app.get("/users", this.getUser.bind(this));

		this.app.get("/reservation/:id", this.getReservation.bind(this));
		this.app.post("/reservation", this.createReservation.bind(this));

		this.app.get("/passenger", this.getPassenger.bind(this));
		this.app.post("/passenger", this.createPassenger.bind(this));

		this.app.get("/ticket/:id", this.getTicket.bind(this));
		this.app.delete("/ticket/:id", this.deleteTicket.bind(this));
	}

	handleRoot(req, res) {
		res.json("The backend is working!");
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getTicket(req, res) {
		const ticketID = req.params.id; 
	  
		const q = `
		  SELECT *
		  FROM Passengers AS P
		  JOIN Reservations AS R ON P.PassengerID = R.PassengerID
		  JOIN Flights AS F ON R.FlightID = F.FlightID
		  WHERE P.TicketID = '${ticketID}';
		`;
	  
		this.db.query(q, (err, data) => {
		  if (err) {
			return res.json(err);
		  } else {
			return res.json(data);
		  }
		});
	}

	deleteTicket(req, res) {
		const ticketID = req.params.id;
		const q = "DELETE FROM Passengers WHERE TicketID = ?";
	
		this.db.query(q, [ticketID], (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Passenger has been deleted successfully!");
			}
		});
	}
	  
	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getPassenger(req, res) {
		const q = "SELECT * FROM Passengers";

		this.db.query(q, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	createPassenger(req, res) {
		const q = "INSERT INTO Passengers (Name, Email, TicketID, UserID, Cost, Insurance) VALUES (?, ?, ?, ?, ?, ?)";
		const values = [
			req.body.Name,
			req.body.Email,
			req.body.TicketID,
			req.body.UserID,
			req.body.Cost,
			req.body.Insurance
		];
	
		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			}
			return res.json({ PassengerID: data.insertId });
		});
	}
	
	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getReservation(req, res) {
		const flightID = req.params.id;

		const q = `
            SELECT R.ReservationID, P.Name AS PassengerName, P.TicketID as TicketID, R.SeatNumber, R.SeatType, R.ReservationDate
            FROM Reservations R
            JOIN Passengers P ON R.PassengerID = P.PassengerID
            WHERE R.FlightID = ?;
        `;

		this.db.query(q, flightID, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	createReservation(req, res) {
		const q =
			"INSERT INTO Reservations (PassengerID, FlightID, SeatNumber, SeatType, ReservationDate) VALUES (?, ?, ?, ?, ?)";
		const values = [
			req.body.PassengerID,
			req.body.FlightID,
			req.body.SeatNumber,
			req.body.SeatType,
			req.body.ReservationDate,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Reservation has been created successfully!");
			}
		});
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	registerUser(req, res) {
		const q = `INSERT INTO Users (Name, Email, Password, Address, Role) VALUES (?, ?, ?, ?, ?)`;
		const values = [
			req.body.name,
			req.body.email,
			req.body.password,
			req.body.address,
			req.body.role,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("User has been added successfully!");
			}
		});
	}

	getUser(req, res) {
		const q = `SELECT * FROM Users`;

		this.db.query(q, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	sendEmail({ email, subject, message }) {
		return new Promise((resolve, reject) => {
			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "firstkey.lastvalue@gmail.com",
					pass: "poyliudpsqtokeym",
				},
			});

			const mailConfigs = {
				from: "firstkey.lastvalue@gmail.com",
				to: email,
				subject: subject,
				html: `${message}`,
			};
			transporter.sendMail(mailConfigs, function (error, info) {
				if (error) {
					console.log(error);
					return reject({ message: "An error has occurred" });
				}
				return resolve({ message: "Email sent successfully" });
			});
		});
	}

	handleSendEmail(req, res) {
		this.sendEmail(req.query)
			.then((response) => res.send(response.message))
			.catch((error) => res.status(500).send(error.message));
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getAircraft(req, res) {
		const q = "SELECT * FROM Aircrafts";
		this.db.query(q, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	createAircraft(req, res) {
		const q = "INSERT INTO Aircrafts (Name) VALUES (?)";
		const values = [req.body.Name];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Aircraft has been created successfully!");
			}
		});
	}

	deleteAircraft(req, res) {
		const aircraftId = req.params.id;
		const q = "DELETE FROM Aircrafts WHERE AircraftID = ?";

		this.db.query(q, [aircraftId], (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Aircraft has been deleted successfully!");
			}
		});
	}

	updateAircraft(req, res) {
		const aircraftID = req.params.id;
		const q = "UPDATE Aircrafts SET Name = ? WHERE AircraftID = ?";

		const values = [req.body.Name, aircraftID];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Aircraft has been updated successfully!");
			}
		});
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getFlight(req, res) {
		const q = "SELECT * FROM Flights";
		this.db.query(q, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	getSpecificFlight(req, res) {
		const flightID = req.params.id; 
		const q = `SELECT * FROM Flights WHERE FlightID = ${flightID}`;
		
		this.db.query(q, (err, data) => {
		  if (err) {
			return res.json(err);
		  } else {
			return res.json(data);
		  }
		});
	}

	createFlight(req, res) {
		const q = `
        INSERT INTO Flights (
            FlightNumber,
            DepartureAirport,
            ArrivalAirport,
            DepartureDate,
            ArrivalDate,
            AvailableSeats,
            AircraftID,
            Price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
		const values = [
			req.body.FlightNumber,
			req.body.DepartureAirport,
			req.body.ArrivalAirport,
			req.body.DepartureDate,
			req.body.ArrivalDate,
			req.body.AvailableSeats,
			req.body.AircraftID,
			req.body.Price,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Flight has been created successfully!");
			}
		});
	}

	deleteFlight(req, res) {
		const flightId = req.params.id;
		const q = "DELETE FROM Flights WHERE FlightID = ?";

		this.db.query(q, [flightId], (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Flight has been deleted successfully!");
			}
		});
	}

	updateFlight(req, res) {
		const flightID = req.params.id;
		const q = `
            UPDATE Flights
            SET 
                FlightNumber = ?,
                DepartureAirport = ?,
                ArrivalAirport = ?,
                DepartureDate = ?,
                ArrivalDate = ?,
                AvailableSeats = ?,
                AircraftID = ?,
                Price = ?
            WHERE FlightID = ?
        `;

		const values = [
			req.body.FlightNumber,
			req.body.DepartureAirport,
			req.body.ArrivalAirport,
			req.body.DepartureDate,
			req.body.ArrivalDate,
			req.body.AvailableSeats,
			req.body.AircraftID,
			req.body.Price,
			flightID,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("Flight has been updated successfully!");
			}
		});
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	getCrew(req, res) {
		const userId = req.params.id;

		const q = `SELECT * FROM Users WHERE FlightID = ?`;
		this.db.query(q, userId, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json(data);
			}
		});
	}

	createCrew(req, res) {
		const q = `
        INSERT INTO Users (
            Name,
            Email,
            Password,
            Address,
            FlightID,
            Role
        ) VALUES (?, ?, ?, ?, ?, ?)
        `;
		const values = [
			req.body.name,
			req.body.email,
			req.body.password,
			req.body.address,
			req.body.flightID,
			req.body.role,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("User has been created successfully!");
			}
		});
	}

	deleteCrew(req, res) {
		const userID = req.params.id;
		const q = `DELETE FROM Users WHERE UserID = ?`;

		this.db.query(q, [userID], (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("User has been deleted successfully!");
			}
		});
	}

	updateCrew(req, res) {
		const userID = req.params.id;
		const q = `
        UPDATE Users
        SET 
            Name = ?,
            Email = ?,
            Password = ?,
            Address = ?,
            FlightID = ?,
            Role = ?
        WHERE UserID = ?;
        `;
		const values = [
			req.body.name,
			req.body.email,
			req.body.password,
			req.body.address,
			req.body.flightID,
			req.body.role,
			userID,
		];

		this.db.query(q, values, (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json("User has been updated successfully!");
			}
		});
	}

	// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

	startServer(port) {
		this.app.listen(port, () => {
			console.log("Connected to backend!");
		});
	}
}

const flightApp = new FlightReservationApp();
flightApp.startServer(3001);

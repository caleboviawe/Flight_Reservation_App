import DateFormatter from "../controller/DateFormatter";

class FlightEntity {
    constructor(data) {
        this.FlightID = data.FlightID || null;
        this.FlightNumber = data.FlightNumber || 'N/A';
        this.DepartureAirport = data.DepartureAirport || 'N/A';
        this.ArrivalAirport = data.ArrivalAirport || 'N/A';
        const dateFormatter = new DateFormatter();
        this.DepartureDate = dateFormatter.formatDate(data.DepartureDate) || 'N/A';
        this.ArrivalDate = dateFormatter.formatDate(data.ArrivalDate) || 'N/A';
        this.AvailableSeats = data.AvailableSeats !== undefined ? data.AvailableSeats : 'N/A';
        this.AircraftID = data.AircraftID !== undefined ? data.AircraftID : 'N/A';
        this.Price = data.Price !== undefined ? data.Price : 'N/A';
    }
}

export default FlightEntity;  
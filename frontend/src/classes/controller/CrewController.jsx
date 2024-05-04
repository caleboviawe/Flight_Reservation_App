import axios from "axios";
import CrewEntity from "../entity/CrewEntity";

class CrewController {
    constructor() {
        this.flightID = '';
    }

    setFlightID(flightID) {
        this.flightID = flightID;
    }

    async fetchAllFlightAttendants() {
        try {
            const res = await axios.get(`http://localhost:3001/crew/${this.flightID}`);
            return res.data.map(data => new CrewEntity(data.UserID, data.Name, data.Email, data.Address, data.FlightID, data.Role));
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async deleteFlightAttendant(id) {
        try {
            await axios.delete(`http://localhost:3001/crew/${id}`);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    // You might implement methods for create/update based on your UI interactions
}

export default CrewController;

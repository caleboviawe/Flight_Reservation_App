import axios from 'axios';
import FlightEntity from '../entity/FlightEntity';

class FlightController {
    constructor() {
        this.endpoint = 'http://localhost:3001/flight';
    }

    async fetchAllFlights() {
        try {
            const res = await axios.get(this.endpoint);
            return res.data.map(flightData => new FlightEntity(flightData));
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async deleteFlight(id) {
        try {
            await axios.delete(`${this.endpoint}/${id}`);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default FlightController;

import axios from "axios";
import AircraftEntity from '../entity/AircraftEntity';

class AircraftController {
    async getAllAircrafts() {
        try {
            const res = await axios.get("http://localhost:3001/aircraft");
            return res.data.map(aircraft => new AircraftEntity(aircraft.Name, aircraft.AircraftID));
        } catch (err) {
            throw err;
        }
    }

    async deleteAircraft(id) {
        try {
            await axios.delete(`http://localhost:3001/aircraft/${id}`);
        } catch (err) {
            throw err;
        }
    }
}

export default AircraftController;

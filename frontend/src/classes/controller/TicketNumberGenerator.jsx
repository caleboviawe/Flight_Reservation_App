import axios from 'axios';

class TicketNumberGenerator {
  constructor(length) {
    this.length = length;
    this.charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.passengers = [];
  }

  async fetchPassengers() {
    try {
      const response = await axios.get('http://localhost:3001/passenger');
      this.passengers = response.data;
      console.log(this.passengers); // Do something with passengers data
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
  }

  generateTicketNumber() {
    let result = "";
    let isUnique = false;

    while (!isUnique) {
      result = "";
      for (let i = 0; i < this.length; i++) {
        const randomIndex = Math.floor(Math.random() * this.charset.length);
        result += this.charset[randomIndex];
      }
      isUnique = this.isTicketNumberUnique(result);
    }

    return result;
  }

  isTicketNumberUnique(ticketNumber) {
    return !this.passengers.some(passenger => passenger.TicketID === ticketNumber);
  }
}

export default TicketNumberGenerator;

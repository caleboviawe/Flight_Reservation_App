import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

class BrowseSeat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numRows: 42,
      columnsBeforeWalkway: 3,
      columnsAfterSeats: 3,
      seatsPerRow: 9,
      reservations: [],
    };

    this.flightID = this.props.location.pathname.split('/')[2];
  }

  componentDidMount() {
    this.fetchReservations();
  }

  async fetchReservations() {
    try {
      const res = await axios.get(`http://localhost:3001/reservation/${this.flightID}`);
      this.setState({ reservations: res.data });
    } catch (err) {
      console.log(err);
    }
  }

  handleClick = (row, seat) => {
    const columnLetter = String.fromCharCode(65 + seat);
    console.log(`Seat clicked: Column ${columnLetter}, Row ${row}`);
    this.props.navigate(`/bookTicket/${this.flightID}/${columnLetter}/${row}`);
  };

  isSeatReserved = (row, seat) => {
    const columnLetter = String.fromCharCode(65 + seat);
    const seatNumberToCheck = `${columnLetter}${row}`;
    return this.state.reservations.some(
      (reservation) => reservation.SeatNumber === seatNumberToCheck
    );
  };

  renderSeating = () => {
    const seating = [];
    const { numRows } = this.state;
  
    for (let row = 1; row <= numRows; row++) {
      const seats = [];
      const rowStyle = {};
  
      if (row <= 6) {
        rowStyle.backgroundColor = 'lightblue';
      } else if (row <= 18) {
        rowStyle.backgroundColor = 'mediumblue';
      } else {
        rowStyle.backgroundColor = 'darkblue';
      }
  
      for (let seat = 0; seat < this.state.seatsPerRow; seat++) {
        const seatIsReserved = this.isSeatReserved(row, seat);
        let seatStyle = {
          margin: '5px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          ...rowStyle, // Add the row-specific background color
        };
  
        if (seatIsReserved) {
          const redShade = 255 - (row * 5); // Adjust the shade of red based on row number
          seatStyle = {
            ...seatStyle,
            backgroundColor: `rgb(${redShade}, 0, 0)`,
            color: 'white',
          };
        }
  
        seats.push(
          <React.Fragment key={`${row}-${seat}`}>
            {(seat > 0 && seat % 3 === 0) && <div style={{ width: '20px', height: '20px' }} />}
            <button
              onClick={() => !seatIsReserved && this.handleClick(row, seat)}
              disabled={seatIsReserved}
              style={seatStyle}
            >
              {String.fromCharCode(65 + seat)}{row}
            </button>
          </React.Fragment>
        );
      }
  
      seating.push(
        <div key={row} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          {seats}
        </div>
      );
    }
  
    return seating;
  };

  render() {
    return (
      <div className='main'>
        <div className='container'>
          <h2>Airplane Seating Arrangement</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {this.renderSeating()}
          </div>
        </div>
      </div>
    );
  }
}

export default function BrowseSeatWithRouter(props) {
  const navigate = useNavigate();
  const location = useLocation();
  return <BrowseSeat navigate={navigate} location={location}></BrowseSeat>;
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Confirmation extends Component {
  render() {
    return (
      <div className='main'>
        <div className='container'>
          <h1>Your order has been confirmed!</h1>
          <p>Check your email for the ticket Number.</p>
          <Link to="/customerOption">
            <button>Go back</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Confirmation;

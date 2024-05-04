import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Flight from "./boundary/Flight";
import AddFlightWithRouter from "./boundary/AddFlight";
import UpdateFlightWithRouter from "./boundary/UpdateFlight";

import CrewWithRouter from "./boundary/Crew";
import AddCrewWithRouter from "./boundary/AddCrew";
import UpdateCrewWithRouter from "./boundary/UpdateCrew";

import CustomerOption from "./boundary/CustomerOption";
import Passenger from "./boundary/Passenger";
import AdminOption from "./boundary/AdminOption";

import View from "./boundary/View";

import LoginWithRouter from "./boundary/Login";
import RegistrationWithRouter from "./boundary/Registration";

import Aircraft from "./boundary/Aircraft";
import AddAircraftWithRouter from "./boundary/AddAircraft";
import UpdateAircraftWithRouter from "./boundary/UpdateAircraft";

import ViewUser from "./boundary/ViewUser";

import BrowseFlight from "./boundary/BrowseFlight";
import CancelTicket from "./boundary/CancelTicket";
import BrowseSeatWithRouter from "./boundary/BrowseSeat";
import BookTicketWithRouter from "./boundary/BookTicket";

import Confirmation from "./boundary/Confirmation";

import "../style.css";

class PageContent extends Component {
	render() {
		return <BrowserRouter>
    <Routes>
      <Route path="/" element={<View />} />

      <Route path="/login" element={<LoginWithRouter />} />
      <Route path="/registration" element={<RegistrationWithRouter />} />

      <Route path="/customerOption" element={<CustomerOption />} />
      <Route path="/passenger" element={<Passenger />} />
      <Route path="/adminOption" element={<AdminOption />} />

      <Route path="/aircraft" element={<Aircraft />} />
      <Route path="/addAircraft" element={<AddAircraftWithRouter />} />
      <Route
        path="/updateAircraft/:id"
        element={<UpdateAircraftWithRouter />}
      />

      <Route path="/flight" element={<Flight />} />
      <Route path="/addFlight" element={<AddFlightWithRouter />} />
      <Route
        path="/updateFlight/:id"
        element={<UpdateFlightWithRouter />}
      />

      <Route path="/crew/:id" element={<CrewWithRouter />} />
      <Route path="/addCrew/:id" element={<AddCrewWithRouter />} />
      <Route path="/updateCrew/:id" element={<UpdateCrewWithRouter />} />

      <Route path="/viewUser" element={<ViewUser />} />

      <Route path="/browseFlight" element={<BrowseFlight />} />
      <Route path="/browseSeat/:id" element={<BrowseSeatWithRouter />} />
      <Route
        path="/bookTicket/:id/:id/:id"
        element={<BookTicketWithRouter />}
      />

      <Route path="/confirmation" element={<Confirmation />} />

      <Route path="/cancel" element={<CancelTicket />} />
    </Routes>
  </BrowserRouter>;
	}
}

export default PageContent;
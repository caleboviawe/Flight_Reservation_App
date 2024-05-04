-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS flight_reservation_v2;

-- Use the database
USE flight_reservation_v2;

-- Drop tables if they exist
DROP TABLE IF EXISTS Reservations;
DROP TABLE IF EXISTS FlightAttendants;
DROP TABLE IF EXISTS FlightAgents;
DROP TABLE IF EXISTS Passengers;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Flights;
DROP TABLE IF EXISTS Aircrafts;

-- Create Aircrafts Table
CREATE TABLE Aircrafts (
    AircraftID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100)
);

-- Create Flights Table with Price column
CREATE TABLE Flights (
    FlightID INT AUTO_INCREMENT PRIMARY KEY,
    FlightNumber VARCHAR(20),
    DepartureAirport VARCHAR(50),
    ArrivalAirport VARCHAR(50),
    DepartureDate DATE,
    ArrivalDate DATE,
    AvailableSeats INT,
    AircraftID INT,
    Price DECIMAL(10, 2), 
    FOREIGN KEY (AircraftID) REFERENCES Aircrafts(AircraftID) ON DELETE CASCADE
);

-- Create Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    FlightID INT,
    Role VARCHAR(50) NOT NULL,
    FOREIGN KEY (FlightID) REFERENCES Flights(FlightID) ON DELETE SET NULL
);

-- Create tables
CREATE TABLE Passengers (
    PassengerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(255),
    TicketID VARCHAR(8),
    UserID INT,
    Cost NUMERIC,
    Insurance BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Create Reservations Table
CREATE TABLE Reservations (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    PassengerID INT,
    FlightID INT,
    SeatNumber VARCHAR(10),
    SeatType VARCHAR(50),
    ReservationDate DATE,
    FOREIGN KEY (PassengerID) REFERENCES Passengers(PassengerID) ON DELETE CASCADE,
    FOREIGN KEY (FlightID) REFERENCES Flights(FlightID) ON DELETE CASCADE
);

-- Create FlightAgents Table
CREATE TABLE FlightAgents (
    AgentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100)
);

-- Insert data into Aircrafts table
INSERT INTO Aircrafts (Name) VALUES 
    ('Boeing 737'),
    ('Airbus A320'),
    ('Embraer E190');

-- Insert data into Flights table
INSERT INTO Flights (FlightNumber, DepartureAirport, ArrivalAirport, DepartureDate, ArrivalDate, AvailableSeats, AircraftID, Price) VALUES 
    ('ABC123', 'JFK', 'LAX', '2023-12-01', '2023-12-02', 378, 1, 250.00),
    ('DEF456', 'LAX', 'ORD', '2023-12-05', '2023-12-06', 378, 2, 200.00),
    ('GHI789', 'ORD', 'DFW', '2023-12-10', '2023-12-11', 378, 3, 180.00);

-- Insert data into Users table
INSERT INTO Users (Name, email, Password, Address, FlightID, Role) VALUES 
    ('Alice Johnson', 'alice@example.com', 'Pa$$w0rd!', '456 Oak St', NULL, 'Customer'),
    ('Bob Smith', 'bob@example.com', 'Secur1ty&', '789 Elm St', NULL, 'Customer'),
    ('Eva Brown', 'eva@example.com', 'P@ssw0rd#', '101 Pine St', NULL, 'Customer'),
    ('Grace Lee', 'grace@example.com', 'NewP@ssw0rd', '1000 Main St', NULL, 'Customer'),
    ('Daniel Wilson', 'daniel@example.com', 'D@n1elP@ss', '555 Center St', NULL, 'Customer'),


    ('Maxwell Anderson', 'max@example.com', '3xample!', '222 Broadway', NULL, 'Admin'),
    ('Sophie Clark', 'sophie@example.com', 'Qwerty@123', '777 Park Ave', 1, 'Crew'),
    ('Oliver Garcia', 'oliver@example.com', 'P@ssw0rd123', '123 Hill St', 2, 'Crew');

-- Insert data into Passengers table
INSERT INTO Passengers (Name, TicketID, UserID) VALUES 
    ('Alice Johnson', '5G7H3E9K', 1),
    ('Bob Smith', 'P2A9B4F6', 2),
    ('Eva Brown', 'J8N6C1Q0', 3),
    ('Grace Lee', 'Y3T2D7W8', 4), 
    ('Daniel Wilson', 'B4M9A1Z7', 5);
    

-- Insert data into Reservations table
INSERT INTO Reservations (PassengerID, FlightID, SeatNumber, SeatType, ReservationDate) VALUES 
    (1, 1, 'A1', 'Ordinary', '2023-11-28'),
    (2, 2, 'B1', 'Comfort', '2023-11-29'),
    (3, 3, 'C2', 'Business', '2023-11-30'),
    (4, 1, 'A2', 'Ordinary', '2023-12-01'),
    (5, 3, 'B2', 'Comfort', '2023-12-05');

-- Insert data into FlightAgents table
INSERT INTO FlightAgents (Name) VALUES 
    ('Sarah Johnson'),
    ('Michael Brown'),
    ('Emma Davis');

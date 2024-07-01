import React, { useState, useEffect } from 'react';
import './Customerdashboard.css';

const CustomerDashboard = ({ branches }) => {
    useEffect(() => {
        document.body.style.background = 'linear-gradient(90deg, #3f86a6 0%, #302b63 50%, #24243e 100%)';
    
        return () => {
          document.body.style.background = '';
        };
    }, []);
    
    const [reservation, setReservation] = useState({
        name: '',
        phoneNumber: '',
        serviceType: '',
        dateTime: '',
        branch: '',
    });
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = () => {
        const request = window.indexedDB.open('reservations_db', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('reservations')) {
                const objectStore = db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('reservations', 'readonly');
            const objectStore = transaction.objectStore('reservations');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = (event) => {
                setReservations(event.target.result);
            };

            getAllRequest.onerror = (event) => {
                console.error('Error loading reservations:', event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    };

    const addReservation = () => {
        const request = window.indexedDB.open('reservations_db', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('reservations', 'readwrite');
            const objectStore = transaction.objectStore('reservations');
            const addRequest = objectStore.add(reservation);

            addRequest.onsuccess = (event) => {
                console.log('Reservation added successfully');
                setReservations([...reservations, reservation]);
                setReservation({
                    name: '',
                    phoneNumber: '',
                    serviceType: '',
                    dateTime: '',
                    branch: '',
                });
                alert('Reservation successful!'); 
            };

            addRequest.onerror = (event) => {
                console.error('Error adding reservation:', event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    };

    const handleSubmitReservation = (e) => {
        e.preventDefault();
        addReservation();
    };

    const getServicesForBranch = (selectedBranch) => {
        const branch = branches.find(branch => branch.name === selectedBranch);
        return branch ? branch.services : [];
    };

    const getBranchTimes = (branchName) => {
        const branch = branches.find(branch => branch.name === branchName);
        return branch ? `${branch.openingTime} - ${branch.closingTime}` : '';
    };

    return (
        <div className="center-container">
            <h1 className="circular-box">Customer Dashboard</h1>

            <h2>Make a Reservation</h2>
            <form onSubmit={handleSubmitReservation} className="form-center">
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={reservation.name}
                        onChange={(e) =>
                            setReservation({ ...reservation, name: e.target.value })
                        }
                        className="input-box"
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={reservation.phoneNumber}
                        onChange={(e) =>
                            setReservation({
                                ...reservation,
                                phoneNumber: e.target.value,
                            })
                        }
                        pattern="[0-9]{7,12}"
                        title="Phone number should be 7-12 digits."
                        className="input-box"
                        required
                    />
                </div>
                <div>
                    <label>Branch:</label>
                    <select
                        value={reservation.branch}
                        onChange={(e) =>
                            setReservation({
                                ...reservation,
                                branch: e.target.value,
                            })
                        }
                        className="input-box"
                        required
                    >
                        <option value="">Select Branch</option>
                        {branches.map((branch, index) => (
                            <option key={index} value={branch.name}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {reservation.branch && (
                    <>
                        <div className="spaced-div">
                            <label>Service Type:</label>
                            <select
                                value={reservation.serviceType}
                                onChange={(e) =>
                                    setReservation({
                                        ...reservation,
                                        serviceType: e.target.value,
                                    })
                                }
                                className="input-box"
                                required
                            >
                                <option value="">Select Service</option>
                                {getServicesForBranch(reservation.branch).map((service, index) => (
                                    <option key={index} value={service}>
                                        {service} at {reservation.branch}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Date & Time:</label>
                            <input
                                type="datetime-local"
                                value={reservation.dateTime}
                                onChange={(e) =>
                                    setReservation({
                                        ...reservation,
                                        dateTime: e.target.value,
                                    })
                                }
                                className="input-box"
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="submit-button">Reserve</button>
            </form>
            <h2 className="spaced-div">Reservations</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Service Type</th>
                        <th>Date & Time</th>
                        <th>Branch</th>
                        <th>Opening Time</th>
                        <th>Closing Time</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((res, index) => (
                        <tr key={index}>
                            <td>{res.name}</td>
                            <td>{res.phoneNumber}</td>
                            <td>{res.serviceType}</td>
                            <td>
                                {new Date(res.dateTime).toLocaleString()}
                            </td>
                            <td>{res.branch}</td>
                            <td>{getBranchTimes(res.branch).split(' - ')[0]}</td>
                            <td>{getBranchTimes(res.branch).split(' - ')[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerDashboard;

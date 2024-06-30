import React, { useState, useEffect } from 'react';
import './Admindashboard.css';
const AdminDashboard = ({ onUpdateBranches }) => {
    useEffect(() => {
        document.body.style.background = 'linear-gradient(90deg, #24243e 0%, #302b63 50%, #3f86a6 100%)';

        return () => {
          document.body.style.background = '';
        };
      }, []);
    
    const [newBranch, setNewBranch] = useState({
        name: '',
        services: [],
        openingTime: '09:00',
        closingTime: '18:00',
    });

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        initializeDatabase();
    }, []);

    const initializeDatabase = () => {
        const request = window.indexedDB.open('branches_db', 1);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('branches', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('services', 'services', { unique: false });
            objectStore.createIndex('openingTime', 'openingTime', { unique: false });
            objectStore.createIndex('closingTime', 'closingTime', { unique: false });

            objectStore.transaction.oncomplete = (event) => {
                const branchesObjectStore = db.transaction('branches', 'readwrite').objectStore('branches');

                const defaultBranches = [
                    {
                        name: 'Jakarta',
                        services: ['Haircuts and Styling'],
                        openingTime: '09:00',
                        closingTime: '18:00',
                    },
                    {
                        name: 'Tangerang',
                        services: ['Manicure and Pedicure', 'Facial Treatments'],
                        openingTime: '09:00',
                        closingTime: '18:00',
                    },
                    {
                        name: 'Bekasi',
                        services: ['Haircuts and Styling', 'Manicure and Pedicure'],
                        openingTime: '09:00',
                        closingTime: '18:00',
                    },
                ];

                defaultBranches.forEach(branch => {
                    branchesObjectStore.add(branch);
                });

                loadBranches();
            };
        };

        request.onsuccess = (event) => {
            console.log('IndexedDB initialized successfully');
        };
    };

    const loadBranches = () => {
        const db = window.indexedDB.open('branches_db', 1);

        db.onsuccess = (event) => {
            const database = event.target.result;
            const transaction = database.transaction('branches', 'readonly');
            const objectStore = transaction.objectStore('branches');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = (event) => {
                setBranches(event.target.result);
            };

            getAllRequest.onerror = (event) => {
                console.error('Error loading branches:', event.target.error);
            };
        };

        db.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    };

    const addBranch = () => {
        const db = window.indexedDB.open('branches_db', 1);

        db.onsuccess = (event) => {
            const database = event.target.result;
            const transaction = database.transaction('branches', 'readwrite');
            const objectStore = transaction.objectStore('branches');
            const addRequest = objectStore.add(newBranch);

            addRequest.onsuccess = (event) => {
                console.log('Branch added successfully');
                setBranches([...branches, newBranch]);
                onUpdateBranches([...branches, newBranch]);
                setNewBranch({
                    name: '',
                    services: [],
                    openingTime: '09:00',
                    closingTime: '18:00',
                });
                alert('Branch added successfully!');
            };

            addRequest.onerror = (event) => {
                console.error('Error adding branch:', event.target.error);
            };
        };

        db.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch({ ...newBranch, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedServices = [...newBranch.services];

        if (checked) {
            updatedServices.push(value); 
        } else {
            updatedServices = updatedServices.filter((service) => service !== value);
        }

        setNewBranch({ ...newBranch, services: updatedServices });
    };

    return (
        <div className="center-container">
            <h1 className="circular-box">Admin Dashboard</h1>
            <div class="circular-box">
                <h2>Add New Branch</h2>
                <form>
                    <label>
                        Branch Name:
                        <input
                            type="text"
                            name="name"
                            value={newBranch.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <br />
                    <label>Services Offered:</label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="services"
                                value="Haircuts and Styling"
                                checked={newBranch.services.includes('Haircuts and Styling')}
                                onChange={handleCheckboxChange}
                            />{' '}
                            Haircuts and Styling
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="services"
                                value="Manicure and Pedicure"
                                checked={newBranch.services.includes('Manicure and Pedicure')}
                                onChange={handleCheckboxChange}
                            />{' '}
                            Manicure and Pedicure
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="services"
                                value="Facial Treatments"
                                checked={newBranch.services.includes('Facial Treatments')}
                                onChange={handleCheckboxChange}
                            />{' '}
                            Facial Treatments
                        </label>
                    </div>
                    <br />
                    <div class="time-inputs">
                        <label>
                            Opening Time:
                            <input
                                type="time"
                                name="openingTime"
                                value={newBranch.openingTime}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Closing Time:
                            <input
                                type="time"
                                name="closingTime"
                                value={newBranch.closingTime}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                    <br />
                    <button type="button" onClick={addBranch} className="submit-button">
                        Add Branch
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;

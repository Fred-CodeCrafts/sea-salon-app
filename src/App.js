import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage';
import AuthPage from './pages/Authpage';
import CustomerDashboard from './pages/Customerdashboard';
import AdminDashboard from './pages/Admindashboard';

const App = () => {
    const [branches, setBranches] = useState([]);

    // Initialize default branches if they don't exist in IndexedDB
    useEffect(() => {
        const defaultBranches = [
            {
                name: 'Jakarta',
                services: ['Haircuts and Styling', 'Facial Treatments'],
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

        const request = window.indexedDB.open('branches_db', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('branches')) {
                const objectStore = db.createObjectStore('branches', { keyPath: 'name' });
                objectStore.createIndex('name', 'name', { unique: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('branches', 'readonly');
            const objectStore = transaction.objectStore('branches');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = (event) => {
                const existingBranches = event.target.result;
                const missingBranches = defaultBranches.filter(
                    (defaultBranch) =>
                        !existingBranches.some(
                            (branch) => branch.name === defaultBranch.name
                        )
                );

                if (missingBranches.length > 0) {
                    const addTransaction = db.transaction('branches', 'readwrite');
                    const branchesStore = addTransaction.objectStore('branches');

                    missingBranches.forEach((branch) => {
                        branchesStore.add(branch);
                    });

                    addTransaction.oncomplete = () => {
                        console.log('Default branches added');
                        setBranches([...existingBranches, ...missingBranches]);
                    };

                    addTransaction.onerror = (event) => {
                        console.error('Error adding default branches:', event.target.error);
                    };
                } else {
                    setBranches(existingBranches);
                }
            };

            getAllRequest.onerror = (event) => {
                console.error('Error loading branches:', event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.errorCode);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/customer"
                    element={<CustomerDashboard branches={branches} />}
                />
                <Route
                    path="/admin"
                    element={<AdminDashboard onUpdateBranches={setBranches} />}
                />
            </Routes>
        </Router>
    );
};

export default App;

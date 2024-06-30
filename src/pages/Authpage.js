import React, { useState, useEffect } from 'react';
import { addUser, findUserByEmail } from './indexedDB'; 
import './Authpage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        const initialUser = {
            username: 'thomasn',
            fullName: 'Thomas N',
            email: 'thomas.n@example.com',
            password: 'Admin123',
            role: 'Admin'
        };

        findUserByEmail(initialUser.email)
            .then(user => {
                if (!user) {
                    addUser(initialUser)
                        .then(userId => console.log('Initial user added with ID:', userId))
                        .catch(error => console.error('Error adding initial user:', error));
                }
            })
            .catch(error => console.error('Error finding initial user:', error));
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    const handleLogin = async () => {
        try {
            const user = await findUserByEmail(formData.email);
            if (user && user.password === formData.password) {
                localStorage.setItem('userId', user.userId);
                if (user.email === 'thomas.n@example.com') {
                    alert('Admin login successful!');
                    window.location.href = '/admin';
                } else {
                    alert('Customer login successful!');
                    window.location.href = '/customer';
                }
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            alert('Error during login');
        }
    };

    const handleRegister = async () => {
        try {
            const newUser = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                role: 'Customer',
            };
            await addUser(newUser);
            alert('Registration successful! Please log in.');
            setIsLogin(true);
        } catch (error) {
            alert('Error during registration');
        }
    };

    return (
        <div className="container" style={{ backgroundImage: 'url("sea_bg.gif")' }}>
            <div className="overlay">
                <div className="box" style={{ backgroundImage: 'url("sea_bg.gif")' }}>
                    <h1>{isLogin ? 'Login' : 'Register'}</h1>
                    <form onSubmit={handleAuth}>
                        {!isLogin && (
                            <div className="row">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="row">
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="row">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="row">
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <center>
                        <div className="row">
                            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                        </div>
                        </center>
                    </form>
                    <div className="row">
                        <button onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Switch to Register' : 'Switch to Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

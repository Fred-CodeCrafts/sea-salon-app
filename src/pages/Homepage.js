import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewForm from './components/ReviewForm';
import './HomePage.css';

const HomePage = () => {
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Handle form submission
    const handleSubmitReview = (e) => {
        e.preventDefault();
        const newReview = { name, rating, comment };
        setReviews([...reviews, newReview]);
        setName('');
        setRating(5);
        setComment('');
    };

    return (
        <div>
            <div className="header-image" style={{backgroundImage: "url('head_img.jpg')"}}>
                <nav style={{paddingTop: '40px'}}>
                    <Link to="/" className="link" style={{textDecoration: 'underline'}}>Home</Link>
                    <Link to="/auth" className="link">Dashboard</Link>
                </nav>
                <div className="site-name">
                    <h1>SEA SALON</h1>
                </div>
            </div>
            <div className="running-text">
                <p>Beauty and Elegance Redefined&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beauty and Elegance Redefined&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beauty and Elegance Redefined&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beauty and Elegance Redefined&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beauty and Elegance Redefined</p>
            </div>
            <div className="services-container">
                <div className="service">
                    <img src="shell.png" alt="Haircut" />
                    <p>Haircuts and Styling</p>
                </div>
                <div className="service">
                    <img src="shell.png" alt="Manicure" />
                    <p>Manicure and Pedicure</p>
                </div>
                <div className="service">
                    <img src="shell.png" alt="Facial Treatment" />
                    <p>Facial Treatments</p>
                </div>
            </div>

            <div className="footer">
                <h2>Contacts</h2>
                <div className="contact-info">
                    <div className="contact-item">
                        <p>Thomas: <span>(+62) 8123456789</span></p>
                    </div>
                    <div className="contact-item">
                        <p>Sekar: <span>(+62) 8164829372</span></p>
                    </div>
                </div>
            </div>

            <ReviewForm
                name={name}
                rating={rating}
                comment={comment}
                setName={setName}
                setRating={setRating}
                setComment={setComment}
                handleSubmitReview={handleSubmitReview}
            />
        </div>
    );
};

export default HomePage;

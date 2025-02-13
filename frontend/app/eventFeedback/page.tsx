"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Rating from './Rating';


const EventFeedback: React.FC = () => {
    const searchParams = useSearchParams();
    const event_id = searchParams.get('event_id');
    
    const [comment, setComment] = useState<string | null>(null);
    const [rating, setRating] = React.useState(0);
    const [error, setError] = useState<string | null>(null);
    const [volunteerID, setVolunteerID] = useState<string | null>(null);
    const router = useRouter();


    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
      };

    useEffect(() => {
        document.title = "Provide Feedback"

        if (!event_id) {
            setError("No event ID provided");
        }

        const volunteer_id = localStorage.getItem('userId');
        if (!volunteer_id) {
            setError("You are not logged in");
        }
        else {
            setVolunteerID(volunteer_id);
        }
    }, []);

    if (error || !volunteerID) {
        return (
            <div style={styles.container}>
              <p style={styles.error}>{error}</p>
            </div>
          );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating < 1 || rating > 5)
        {
            alert("Choose between 1 and 5 stars!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/feedback', {
                event_id: event_id,
                volunteer_id: volunteerID,
                rating: Number(rating),
                comment: comment
            });

            if (response.status === 201) {
                router.push('/plantMe');
            }
        } catch (error) {
            console.error("Could not add the event: ", error);
            alert("Error creating event feedback. Please try again.");
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', 
            background: 'linear-gradient(to bottom, #B1C29E, #659287)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            padding: '20px',
            fontFamily: '"Quicksand", sans-serif',
            margin: 0,
        }}>

            <div style = {{
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                width: '100%',
                height: '50%',
                maxWidth: '400px',
                padding: '30px',
                textAlign: 'center',
                overflow: 'hidden', 
                boxSizing: 'border-box', 
                margin: '20px',
            }}>
                
                <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>Provide Feedback</h2>
            
                <form onSubmit={handleSubmit}>
                    
                    <div style={{ marginBottom: '10px', textAlign: 'left', color: '#789461' }}>
                        <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block' }}>Rating</label>
                        <Rating
                            count={5}
                            value={rating}
                            edit={true}
                            onChange={(value) => setRating(value)}
                        />
                    </div>

                    <div style={{ marginBottom: '10px', textAlign: 'left', color: '#789461' }}>
                        <label style={{ fontSize: '14px', color: '#555', marginBottom: '8px', display: 'block' }}>Comment</label>
                        <input
                            type='text'
                            name='comment'
                            placeholder='Comment'
                            onChange={handleCommentChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                color: '#333',
                                fontFamily: '"Quicksand", sans-serif',
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'left', color: '#789461' }}>
                        <button
                            type='submit'
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#789461',
                                color: '#fff',
                                fontSize: '16px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: '"Quicksand", sans-serif',
                            }}
                        >Provide Feedback</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        fontFamily: '"Quicksand", sans-serif',
        textAlign: 'center',
        backgroundColor: '#F5F5F5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: '18px',
    },
};

export default EventFeedback;

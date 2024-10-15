// src/pages/Profile.js
import React from 'react';
import './Profile.css'; // Đảm bảo rằng file CSS tồn tại trong thư mục src/pages

const Profile = ({ name, studentId, imageUrl }) => {
    return (
        <div className="main-container">
            <div className="header-container">
                <h1 className="centered-header">My Profile</h1>
            </div>
            <div className="profile-container">
                <div className="profile-card">
                    <img src={imageUrl} alt="Profile" className="profile-image" />
                    <div className="profile-details">
                        <h2 className="profile-name">{name}</h2>
                        <p className="profile-id">Student ID: {studentId}</p>
                        <p className="profile-id">Class: D21HTTT03</p>
                        <p className="profile-id">Report: <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a></p>
                        <p className="profile-id">Link git: <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a></p>
                        <p className="profile-id">Liink api doc: <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a></p>

                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const userProfile = {
        name: 'Phạm Thu Hà',
        studentId: 'B21DCCN042',
        imageUrl: 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/407729128_885243906438172_297860472802975909_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHkzvQiLJXgMUNVk-ozvVuGTZx2U98VM_dNnHZT3xUz9wUvyKpKi1_wizk4Vg18YLFcaGK66TcrNknSby8WQznY&_nc_ohc=6Gq6z3E0rLoQ7kNvgE7ESkG&_nc_ht=scontent.fhan20-1.fna&oh=00_AYAbua8GbkvmAfA015RuaIBb1X7rV9IEHuUXtzqqjUFJkA&oe=66CAB218', // Thay đổi URL ảnh theo ý muốn
    };

    return <Profile {...userProfile} />;
};

export default App;

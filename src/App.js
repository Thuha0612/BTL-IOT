import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoomControls from './components/RoomControls';
import Data from './pages/Data';  // Import trang Data
import ActionHistory from './pages/ActionHistory'; // Import trang Action History
import Profile from './pages/Profile'; // Import trang Profile
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Sidebar />
                <div className="main-content">
                    {/* Define the routes */}
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Header />
                                <RoomControls />
                                {/* Các thành phần khác của trang Home */}
                            </>
                        } />
                        <Route path="/data" element={<Data />} /> {/* Route cho trang Data */}
                        <Route path="/action-history" element={<ActionHistory />} /> {/* Route cho trang Action History */}
                        <Route path="/profile" element={<Profile />} /> {/* Route cho trang Profile */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

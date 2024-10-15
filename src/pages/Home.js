import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoomControls from './components/RoomControls';

import './App.css';

function App() {
    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                
                <Header />
                <RoomControls />
            </div>
        </div>
    );
}

export default App;

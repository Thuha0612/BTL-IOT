// src/components/Header.js

import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const updateDateTime = () => {
            setDateTime(new Date());
        };

        // Cập nhật thời gian mỗi giây
        const interval = setInterval(updateDateTime, 1000);

        // Dọn dẹp interval khi component bị hủy
        return () => clearInterval(interval);
    }, []);

    const formatDateTime = (date) => {
        // Định dạng ngày tháng năm và thời gian mà không có từ "Lúc"
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Sử dụng định dạng 24 giờ
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className="header">
            <h1>My Home</h1>
            <p>{formatDateTime(dateTime)}</p> {/* Hiển thị ngày giờ hiện tại */}
        </div>
    );
}

export default Header;

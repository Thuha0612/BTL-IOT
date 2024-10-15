import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = () => {
    // Trạng thái dữ liệu biểu đồ
    const [data, setData] = useState({
        labels: [], // Khởi tạo nhãn trống
        datasets: [
            {
                label: 'Nhiệt độ (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Độ ẩm (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
            {
                label: 'Ánh sáng (Lux)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    });

    // Cập nhật dữ liệu biểu đồ sau mỗi khoảng thời gian nhất định
    useEffect(() => {
        const interval = setInterval(() => {
            // Lấy thời gian hiện tại và định dạng cho nhãn
            const now = new Date();
            const formattedTime = now.toLocaleTimeString();

            setData(prevData => {
                const newLabels = [...prevData.labels.slice(-6), formattedTime]; // Giới hạn nhãn ở 6 khoảng thời gian gần nhất
                const newTemperatureData = [...prevData.datasets[0].data.slice(-6), Math.floor(Math.random() * 35) + 15];
                const newHumidityData = [...prevData.datasets[1].data.slice(-6), Math.floor(Math.random() * 20) + 60];
                const newLightData = [...prevData.datasets[2].data.slice(-6), Math.floor(Math.random() * 100) + 500];
                
                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: newTemperatureData,
                        },
                        {
                            ...prevData.datasets[1],
                            data: newHumidityData,
                        },
                        {
                            ...prevData.datasets[2],
                            data: newLightData,
                        },
                    ],
                };
            });
        }, 5000); // Cập nhật dữ liệu sau mỗi 5 giây

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    // Tùy chỉnh tùy chọn biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Thời gian',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Giá trị',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '80%', height: '80%' }}>
            <h2 style={{ textAlign: 'center' }}>Dữ Liệu Môi Trường</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default ChartComponent;

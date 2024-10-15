import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./RoomControls.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RoomControls = () => {
  const [selectedChart, setSelectedChart] = useState("temperature");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Light (Lux)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Wind Speed (m/s)",
        data: [], // Dữ liệu sẽ được cung cấp
        borderColor: "rgba(255, 206, 86, 1)", // Màu đường tốc độ gió (thay đổi màu tại đây)
        backgroundColor: "rgba(255, 206, 86, 0.2)", // Màu nền tốc độ gió (thay đổi màu tại đây)
        fill: true,
      },
    ],
  });

  const [windChartData, setWindChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Tốc độ gió (m/s)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  });

  const [windSpeed, setWindSpeed] = useState(0);

  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [light, setLight] = useState(300);
  const [fan, setFan] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);
  const [ac, setAc] = useState(false);
  const [loading, setLoading] = useState({
    fan: false,
    light: false,
    ac: false,
  });

  const [alertActive, setAlertActive] = useState(false);


  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/sensor-data/top20latest"
      );
      const data = await response.json();

      if (data.length > 0) {
        const labels = data
          .map(
            (item) => item.timeStr.split(" ")[0] // Lấy phần giờ từ timeStr
          )
          .reverse();
        const temperatures = data.map((item) => item.temperature).reverse();
        const humidities = data.map((item) => item.humidity).reverse();
        const lights = data.map((item) => item.light).reverse();
        const windSpeeds = data.map((item) => item.wind).reverse();

        setTemperature(data[0].temperature);
        setHumidity(data[0].humidity);
        setLight(data[0].light);
        setWindSpeed(data[0].wind);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatures,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
            {
              label: "Humidity (%)",
              data: humidities,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
            },
            {
              label: "Light (Lux)",
              data: lights,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
            {
              label: "Wind Speed (m/s)",
              data: windSpeeds,
              borderColor: "rgba(255, 206, 86, 1)",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              fill: true,
            },
          ],
        });

        setWindChartData({
          labels: labels,
          datasets: [
            {
              label: "Wind Speed (m/s)",
              data: windSpeeds,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
        // if (data[0].wind > 50) {
        //   await turnOnWarningLight();
        // }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const turnOnWarningLight = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/action-histories/warning_light/ON",
        { method: "POST" }
      );
      if (response.ok) {
        console.log("Warning light turned ON");
      } else {
        console.error("Failed to turn on warning light");
      }
    } catch (error) {
      console.error("Error turning on warning light:", error);
    }
  };
  const checkWindSpeedalert = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/sensor-data/latest"
      );
      const data = await response.json();
      const latestWindSpeed = data.wind;

      setWindSpeed(latestWindSpeed);
      if (latestWindSpeed > 80) {
        setAlertActive(true);
      } else {
        setAlertActive(false);
      }
    } catch (error) {
      console.error("Error checking wind speed:", error);
    }
  };
  const checkWindSpeed = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/sensor-data/latest"
      );
      const data = await response.json();
      const latestWindSpeed = data.wind;

      setWindSpeed(latestWindSpeed);
      if (latestWindSpeed > 80) {
        await turnOnWarningLight();
      }
    } catch (error) {
      console.error("Error checking wind speed:", error);
    }
  };

  const toggleDevice = async (device, status) => {
    const action = status ? "ON" : "OFF";
    const url = `http://localhost:8080/api/action-histories/${device}/${action}`;
    try {
      const response = await fetch(url, { method: "POST" });
      return response.ok; // Trả về true nếu lệnh thành công
    } catch (error) {
      console.error(`Lỗi khi bật/tắt ${device}:`, error);
      return false; // Nếu có lỗi hoặc không thành công
    }
  };

  const checkDeviceStatus = async (device) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/device-status/latest/${device}`
      );
      const responseJson = await response.json();
      return responseJson.status === "ON"; // Kiểm tra nếu status là "ON"
    } catch (error) {
      console.error(`Lỗi khi kiểm tra trạng thái ${device}:`, error);
      return false; // Trả về false nếu có lỗi
    }
  };

  useEffect(() => {
    const fetchAllDeviceStatuses = async () => {
      try {
        const fanStatus = await checkDeviceStatus("Fan");
        const lightStatus = await checkDeviceStatus("Light");
        const acStatus = await checkDeviceStatus("Air Conditioner");

        setFan(fanStatus);
        setLightStatus(lightStatus);
        setAc(acStatus);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thiết bị:", error);
      }
    };

    fetchAllDeviceStatuses();
    fetchDataFromBackend(); // Lấy dữ liệu môi trường
    const dataInterval = setInterval(() => {
      fetchDataFromBackend(); // Cập nhật dữ liệu môi trường mỗi 5 giây
    }, 2000);
    const windIntervalalert = setInterval(() => {
      checkWindSpeedalert(); // Kiểm tra tốc độ gió mỗi giây
    }, 2000);
    const windInterval = setInterval(() => {
      checkWindSpeed(); // Kiểm tra tốc độ gió mỗi giây
    }, 10000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(windIntervalalert); // Dọn dẹp interval kiểm tra tốc độ gió
      clearInterval(windInterval);
    };
  }, []);

  const handleFanToggle = async () => {
    setLoading((prev) => ({ ...prev, fan: true }));
    const newFanStatus = !fan;

    await toggleDevice("fan", newFanStatus);

    let status = await checkDeviceStatus("Fan");
    while (status !== newFanStatus) {
      status = await checkDeviceStatus("Fan");
    }

    setFan(status);
    setLoading((prev) => ({ ...prev, fan: false }));
  };

  const handleLightToggle = async () => {
    setLoading((prev) => ({ ...prev, light: true }));
    const newLightStatus = !lightStatus;

    await toggleDevice("light", newLightStatus);

    let status = await checkDeviceStatus("Light");
    while (status !== newLightStatus) {
      status = await checkDeviceStatus("Light");
    }

    setLightStatus(status);
    setLoading((prev) => ({ ...prev, light: false }));
  };

  const handleAcToggle = async () => {
    setLoading((prev) => ({ ...prev, ac: true }));
    const newAcStatus = !ac;

    await toggleDevice("airconditioner", newAcStatus);

    let status = await checkDeviceStatus("Air Conditioner");
    while (status !== newAcStatus) {
      status = await checkDeviceStatus("Air Conditioner");
    }

    setAc(status);
    setLoading((prev) => ({ ...prev, ac: false }));
  };

  const getTemperatureColor = (temp) => {
    if (temp < 0) return "#00BFFF";
    if (temp >= 0 && temp < 18) return "#ADD8E6";
    if (temp >= 18 && temp < 29) return "#FFFF00";
    if (temp >= 29 && temp < 35) return "#FFA500";
    return "#FF4500";
  };

  const getHumidityColor = (hum) => {
    if (hum > 80) return "#00BFFF";
    if (hum > 60) return "#ADD8E6";
    if (hum > 30) return "#00FF00";
    if (hum > 20) return "#FFA500";
    return "#FF4500";
  };

  const getLightColor = (light) => {
    if (light > 1500) return "#ADD8E6";
    if (light > 1000) return "#90EE90";
    if (light > 500) return "#FFB6C1";
    if (light > 200) return "#A9A9A9";
    return "#000000";
  };

  const getWindSpeedColor = (speed) => {
    if (speed < 0) return "#B0E0E6"; // Light blue
    if (speed >= 0 && speed < 20) return "#B2DFDB"; // Light teal
    if (speed >= 20 && speed < 40) return "#FFE09D"; // Light yellow
    if (speed >= 40 && speed < 60) return "#FFD54F"; // Light orange
    return "#FF8A65"; // Light red
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };
  return (
    <div className="controls-container">
      <div className="top-controls">
        <div
          className="control"
          style={{ backgroundColor: getTemperatureColor(temperature) }}
        >
          <i className="fa-solid fa-temperature-half icon-size"></i>
          <div className="control-content">
            <p className="control-label">Temperature</p>
            <p className="control-value">{temperature}°C</p>
          </div>
        </div>
        <div
          className="control"
          style={{ backgroundColor: getHumidityColor(humidity) }}
        >
          <i className="fa-solid fa-droplet icon-size"></i>
          <div className="control-content">
            <p className="control-label">Humidity</p>
            <p className="control-value">{humidity}%</p>
          </div>
        </div>
        <div
          className="control"
          style={{ backgroundColor: getLightColor(light) }}
        >
          <i className="fa-solid fa-sun icon-size"></i>
          <div className="control-content">
            <p className="control-label">Light</p>
            <p className="control-value">{light} Lux</p>
          </div>
        </div>
        <div
          className="control"
          style={{ backgroundColor: getWindSpeedColor(windSpeed) }}
        >
          <i className="fa-solid fa-wind icon-size"></i>
          <div className="control-content">
            <p className="control-label">Wind Speed</p>
            <p className="control-value">{windSpeed} m/s</p>{" "}
            {/* Correct variable name here */}
          </div>
        </div>
      </div>

      <div className={`alert-box ${alertActive ? "active" : ""}`}>
        <i className={`fa-solid fa-bell ${alertActive ? "ring" : ""}`}></i>
        <p>Cảnh báo: Tốc độ gió quá cao!</p>
      </div>

      <div className="bottom-controls">
        {/* <div className="chart-container">
          <h2 style={{ textAlign: "center" }}>Environmental Data</h2>
          <Line data={chartData} options={chartOptions} />
        </div> */}

        <div className="chart-container">
          <div className="chart-selector">
            <select
              id="chart-select"
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
            >
              <option value="temperature">Environmental </option>
              <option value="wind">Wind Speed</option>
            </select>
          </div>
          {selectedChart === "temperature" && (
            <>
              <h3>Environmental Chart</h3>
              <Line data={chartData} options={chartOptions} />
            </>
          )}
          {selectedChart === "wind" && (
            <>
              <h3>Wind Speed Chart</h3>
              <Line data={windChartData} options={chartOptions} />
            </>
          )}
        </div>

        <div className="device-controls">
          <div className={`device-control ${fan ? "active" : ""}`}>
            <div className="device-info">
              <i
                className={`fa-solid fa-fan icon-size ${
                  fan ? "fan-on" : "fan-off"
                }`}
              ></i>
              <p>Quạt</p>
            </div>
            <div className="device-toggle">
              <button
                onClick={handleFanToggle}
                disabled={loading.fan}
                className={`btn-toggle ${loading.fan ? "loading" : ""}`}
              >
                {fan ? "Off" : "On"}
              </button>
            </div>
          </div>
          <div className={`device-control ${lightStatus ? "active" : ""}`}>
            <div className="device-info">
              <i
                className={`fa-solid fa-lightbulb icon-size ${
                  lightStatus ? "light-on" : "light-off"
                }`}
              ></i>
              <p>Đèn</p>
            </div>
            <div className="device-toggle">
              <button
                onClick={handleLightToggle}
                disabled={loading.light}
                className={`btn-toggle ${loading.light ? "loading" : ""}`}
              >
                {lightStatus ? "Off" : "On"}
              </button>
            </div>
          </div>
          <div className={`device-control ${ac ? "active" : ""}`}>
            <div className="device-info">
              <i
                className={`fa-solid fa-snowflake icon-size ${
                  ac ? "ac-on" : "ac-off"
                }`}
              ></i>
              <p>Điều hòa</p>
            </div>
            <div className="device-toggle">
              <button
                onClick={handleAcToggle}
                disabled={loading.ac}
                className={`btn-toggle ${loading.ac ? "loading" : ""}`}
              >
                {ac ? "Off" : "On"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomControls;

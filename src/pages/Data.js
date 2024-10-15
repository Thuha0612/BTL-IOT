import React, { useState, useEffect } from "react";
import { Table, Input, Select, Pagination } from "antd";
import axios from "axios";
import Header from "../components/Header"; // Import the Header component

const { Option } = Select;

const Data = () => {
  const [data, setData] = useState([]);
  const [searchType, setSearchType] = useState("temperature"); // Default search type is 'temperature'
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10); // Default number of rows per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  // Fetch data from backend
  const fetchDataFromBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sensor-data/all"
      );
      setData(response.data.reverse()); // Reverse the data here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataFromBackend(); // Initial fetch on component mount
    const intervalId = setInterval(() => {
      fetchDataFromBackend(); // Fetch data every 2 seconds
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Filter data based on search value and search type
  useEffect(() => {
    const newFilteredData = data.filter((item) => {
      if (searchType === "time") {
        return item.timeStr.includes(searchValue);
      } else {
        return (
          item[searchType] !== undefined &&
          item[searchType] !== null &&
          item[searchType].toString().includes(searchValue)
        );
      }
    });
    setFilteredData(newFilteredData);
    setCurrentPage(1);
  }, [searchType, searchValue, data]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Temperature (°C)",
      dataIndex: "temperature",
      key: "temperature",
      align: "center",
      render: (temp) => `${temp}°C`,
      sorter: (a, b) => a.temperature - b.temperature,
    },
    {
      title: "Light (Lux)",
      dataIndex: "light",
      key: "light",
      align: "center",
      render: (light) => `${light} Lux`,
      sorter: (a, b) => a.light - b.light,
    },
    {
      title: "Humidity (%)",
      dataIndex: "humidity",
      key: "humidity",
      align: "center",
      render: (humidity) => `${humidity}%`,
      sorter: (a, b) => a.humidity - b.humidity,
    },
    {
      title: "Time",
      dataIndex: "timeStr",
      key: "timeStr",
      align: "center",
      sorter: (a, b) => new Date(b.timeStr) - new Date(a.timeStr), // Sort in descending order (latest first)
    },
  ];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Header />
      <h2 style={{ textAlign: "center" }}>Data Sensor</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Select
            defaultValue={pageSize}
            style={{ width: 100, marginRight: 10 }}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
          </Select>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
          <Select
            defaultValue="temperature"
            style={{ width: 150, marginRight: 10 }}
            onChange={handleSearchTypeChange}
          >
            <Option value="temperature">Temperature</Option>
            <Option value="humidity">Humidity</Option>
            <Option value="light">Light</Option>
            <Option value="id">ID</Option>
            <Option value="time">Time</Option>
          </Select>

          <Input
            placeholder={`Search by ${searchType}`}
            onChange={handleSearchChange}
            value={searchValue}
            style={{ width: 200 }}
          />
        </div>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        pagination={false} // Tắt phân trang của Table
        rowKey="id"
      />

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger={false} // Ẩn kích thước trang
          onChange={(page) => setCurrentPage(page)} // Cập nhật trang khi người dùng chọn trang mới
        />
      </div>
    </div>
  );
};

export default Data;

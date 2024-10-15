import React, { useState, useEffect } from "react";
import { Table, Input, Select, Pagination } from "antd";
import axios from "axios";
import Header from "../components/Header"; // Import the Header component

const { Option } = Select;

const ActionHistory = () => {
  const [data, setData] = useState([]);
  const [searchType, setSearchType] = useState("id"); // Default search type is 'id'
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(10); // Default number of rows per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  // Fetch data from backend
  const fetchDataFromBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/action-histories"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  // Filter and reverse data based on search value and search type
  useEffect(() => {
    const newFilteredData = data
      .filter((item) => {
        if (searchType === "time") {
          return item.timeStr.includes(searchValue);
        } else {
          return (
            item[searchType] !== undefined &&
            item[searchType] !== null &&
            item[searchType].toString().includes(searchValue)
          );
        }
      })
      .reverse(); // Đảo ngược thứ tự của dữ liệu
    setFilteredData(newFilteredData);
    setCurrentPage(1); // Reset to page 1 when search changes
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
      title: "Device",
      dataIndex: "device",
      key: "device",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
    },
    {
      title: "Time",
      dataIndex: "timeStr",
      key: "timeStr",
      align: "center",
      sorter: (a, b) => new Date(a.timeStr) - new Date(b.timeStr),
    },
  ];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Header />
      <h2 style={{ textAlign: "center" }}>Action History</h2>

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
            defaultValue="id"
            style={{ width: 150, marginRight: 10 }}
            onChange={handleSearchTypeChange}
          >
            <Option value="id">ID</Option>
            <Option value="device">Device</Option>
            <Option value="action">Action</Option>
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
        pagination={false} // Disable built-in pagination
        rowKey="id"
      />

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger={false} // Hide page size changer
          onChange={(page) => setCurrentPage(page)} // Update page on change
        />
      </div>
    </div>
  );
};

export default ActionHistory;

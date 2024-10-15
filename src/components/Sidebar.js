import React from 'react';
import { AppstoreOutlined, PoweroffOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        navigate(e.key);
    };

    const items = [
        {
            key: '/',
            label: 'Home',
            icon: <HomeOutlined />,
        },
        {
            key: '/data',
            label: 'Data Sensor',
            icon: <AppstoreOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: '/action-history',
            label: 'Action History',
            icon: <PoweroffOutlined />,
        },
        {
            key: '/profile',
            label: 'Profile',
            icon: <UserOutlined />,
        },
    ];

    return (
        <Menu
            onClick={handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['/']}
            mode="inline"
            items={items}
        />
    );
};

export default Sidebar;

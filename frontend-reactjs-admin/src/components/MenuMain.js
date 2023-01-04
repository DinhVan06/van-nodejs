import {
  DatabaseOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const items = [
  { label: "Trang chủ", key: "home", icon: <HomeOutlined /> }, // remember to pass the key prop
  { label: "Cấu hình", key: "settings", icon: <SettingOutlined /> }, // which is required
  {
    label: "Quản trị dữ liệu",
    key: "management",
    icon: <DatabaseOutlined />,
    children: [
      {
        label: "Nhân viên",
        key: "management-employees",
      },
      {
        label: "Sản phẩm",
        key: "management-products",
      },
      { label: "Khách hàng", key: "management-customers" },
      { label: "Danh mục", key: "management-categories" },
      { label: "Nhà cung cấp", key: "management-suppliers" },
    ],
  },
  {
    label: "Quản lý bán hàng",
    key: "sales",
    children: [
      {
        label: "Đơn hàng",
        key: "sales-orders-menus",
        children: [
          {
            label: "Đơn hàng",
            key: "sales-orders",
          },
          {
            label: "Thống kê theo trạng thái",
            key: "sales-orders-status",
          },
          {
            label: "Thống kê theo thanh toán",
            key: "sales-orders-payment-status ",
          },
        ],
      },
      {
        label: "Sản phẩm",
        key: "sales-products",
        children: [
          { label: "Thống kê theo giảm giá", key: "sales-products-discount" },
          { label: "Thống kê theo tồn kho", key: "sales-products-stock" },
        ],
      },
    ],
  },
];

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <Menu
        theme="dark"
        items={items}
        onClick={({ key }) => {
          navigate("/" + key.split("-").join("/"));
          console.log(key);
        }}
      />
    </div>
  );
}

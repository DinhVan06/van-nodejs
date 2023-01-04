import React from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Categories from "./Management/categories/Categories";
import Customers from "./Management/customers/Customer";
import Employees from "./Management/employees/Employee";
import Orders from "./Sales/Order/Order";
import Products from "./Management/products/Product";
import Suppliers from "./Management/suppliers/Supplier";
import "./Link.css";
import Home from "./Home";
import MenuMain from "../components/MenuMain";
import SearchOrdersByStatus from "./Sales/Order/SearchOrdersByStatus";
import { Layout, Button } from "antd";
import SearchOrderByPaymentType from "./Sales/Order/SearchOrderByPaymentType";
import SearchProductByDiscount from "./Sales/Product/SearchProductByDiscount";
import SearchProductByStock from "./Sales/Product/SearchProductByStock";
import AntUpload from "./upload/Upload";
import Login from "./login";
const { Header, Footer, Sider, Content } = Layout;
function List() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Sider theme="dark" style={{ minHeight: "100vh" }}>
            <MenuMain />
          </Sider>
          <Layout>
            <Header style={{ backgroundColor: "#7e6c6c" }}>
              <Button
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Thoát
              </Button>
            </Header>
            <Content style={{ padding: 24 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/management/categories" element={<Categories />} />
                <Route path="/management/employees" element={<Employees />} />
                <Route path="/management/suppliers" element={<Suppliers />} />
                <Route path="/management/products" element={<Products />} />
                <Route path="/sales/orders" element={<Orders />} />
                <Route path="/management/customers" element={<Customers />} />
                <Route path="/antupload" element={<AntUpload />} />
                {/* SALES */}
                {/* order */}
                {/* thống kê theo trạng thái */}
                <Route
                  path="/sales/orders/status"
                  element={<SearchOrdersByStatus />}
                />
                {/* thống kê theo hình thức thanh toán */}
                <Route
                  path="/sales/orders/payment/status"
                  element={<SearchOrderByPaymentType />}
                />
                {/* end order */}
                {/* product */}
                {/* thống kê theo giảm giá */}
                <Route
                  path="sales/products/discount"
                  element={<SearchProductByDiscount />}
                />
                {/* thống kê theo tồn kho */}
                <Route
                  path="sales/products/stock"
                  element={<SearchProductByStock />}
                />
                {/* end product */}
                {/* END SALES */}
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>404 Page not found 😂😂😂😂</p>
                    </main>
                  }
                />
              </Routes>
            </Content>
            <Footer style={{ backgroundColor: "#7e6c6c" }}>Footer</Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default List;

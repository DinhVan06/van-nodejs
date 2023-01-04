import React from "react";
import { Table, Button, Form, message, InputNumber } from "antd";
import { axiosClient } from "../../../libraries/axioClient";
import numeral from "numeral";
function SearchProductByDiscount() {
  const columns = [
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text, record) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (text, record) => {
        return <strong>{record?.supplier?.name}</strong>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => {
        return <span>{numeral(text).format("0,0$")}</span>;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (text) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text) => {
        return <span>{numeral(text).format("0,0.0")}</span>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (text) => {
        return <span>{numeral(text).format("0,0$")}</span>;
      },
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [searchForm] = Form.useForm();
  const onFinish = (values) => {
    setLoading(true);
    axiosClient
      .post("/products/questions/1", values)
      .then((response) => {
        // console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error("Lỗi!");
        setLoading(false);
      });
  };

  const onFinishFailed = (errors) => {
    console.log("🐣", errors);
  };
  return (
    <div>
      <Form
        form={searchForm}
        name="search-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ discount: "" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item label="Giảm giá" name="discount">
          <InputNumber />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? "Đang xử lý ..." : "Lọc thông tin"}
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={products} columns={columns} />
    </div>
  );
}

export default SearchProductByDiscount;

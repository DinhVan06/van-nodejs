import React, { useEffect } from "react";
import { Modal, Space, Table } from "antd";
import { Button, Form, Input, message, Popconfirm } from "antd";
import { axiosClient } from "../../../libraries/axioClient";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
function Employees() {
  const [employees, setEmployees] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  // table
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => {
        return <em>{text}</em>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "1%",
    },
    {
      title: "Phone Numer",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "1%",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      width: "1%",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    // delete, update
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <Space>
            {/* delete */}
            <Popconfirm
              title="Bạn có muốn xóa không"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/employees/" + id)
                  .then((response) => {
                    message.success("Xóa thành công");
                    setRefresh((pre) => pre + 1);
                  })
                  .catch((err) => {
                    message.error("Xóa thất bại");
                  });
                console.log("delete", record);
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
            {/* Update */}
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                console.log("selectes", record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ];
  // get dữ liệu
  useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  // xử lý thêm mới
  const onFinish = (values) => {
    axiosClient
      .post("/employees", values)
      .then((response) => {
        message.success("Thêm mới thành công ❤");
        // reset dữ liệu đã nhập ở form nhập
        createForm.resetFields();

        // load lại form
        setRefresh((pre) => pre + 1);
      })
      .catch((err) => {
        message.error("Thêm mới thất bại 😥");
      });
    console.log("❤", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣", errors);
  };
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật thất bại 😥");
      });
    console.log("❤", values);
  };
  const onUpdateFinishFailed = (errors) => {
    console.log("💣", errors);
  };

  // resetForm nhập liệu
  const [createForm] = Form.useForm();

  // resetForm update
  const [updateForm] = Form.useForm();

  // form nhập liệu
  return (
    <div>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          hasFeedback
          label="Họ"
          name="firstName"
          rules={[{ required: true, message: "Chưa nhập Họ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Tên"
          name="lastName"
          rules={[{ required: true, message: "Chưa nhập Tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Chưa nhập SDT" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Chưa nhập email" },
            { type: "email", message: "email không đúng định dạng" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Chưa nhập địa chỉ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="birthday">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={employees} columns={columns} />

      {/* update form */}
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Lưu thông tin"
        cancelText="Đóng"
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            hasFeedback
            label="Họ"
            name="firstName"
            rules={[{ required: true, message: "Chưa nhập Họ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Tên"
            name="lastName"
            rules={[{ required: true, message: "Chưa nhập Tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: "Chưa nhập SDT" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Chưa nhập email" },
              { type: "email", message: "email không đúng định dạng" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Chưa nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthday">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Employees;

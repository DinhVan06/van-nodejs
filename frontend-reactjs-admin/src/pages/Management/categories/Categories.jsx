import React, { useEffect } from "react";
import { Modal, Space, Table, Upload } from "antd";
import { Image, Button, Form, Input, message, Popconfirm } from "antd";
import { axiosClient } from "../../../libraries/axioClient";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../../constants/URLS";
import axios from "axios";
function Categories() {
  const [categories, setCategories] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [isPreview, setIsPreview] = React.useState(false);
  // table
  const columns = [
    {
      title: "Hình ảnh",
      key: "imageUrl",
      dataIndex: "imageUrl",
      width: "1%",
      render: (text, record) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={`${API_URL}${text}`}
                />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  <Image.PreviewGroup
                    preview={{
                      visible: isPreview && record._id === selectedRecord?._id,
                      onVisibleChange: (vis) => setIsPreview(vis),
                    }}
                  >
                    <Image src={`${API_URL}${text}`} />
                    {record &&
                      record.images &&
                      record.images.map((image) => {
                        return <Image key={image} src={`${API_URL}${image}`} />;
                      })}
                  </Image.PreviewGroup>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      },
    },
    {
      title: "Chi tiết hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (text, record) => {
        return (
          <div>
            <div style={{ marginRight: "10px", display: "inline-block" }}>
              {record &&
                record.images &&
                record.images.map((image) => {
                  return (
                    <img
                      style={{ width: "60px" }}
                      key={image}
                      src={`${API_URL}${image}`}
                      alt=""
                    />
                  );
                })}
            </div>
            <div style={{ display: "inline-block" }}>
              <Upload
                showUploadList={false}
                name="file"
                action={
                  API_URL + "/upload/categories/" + record._id + "/images"
                }
                headers={{ authorization: "authorization-text" }}
                onChange={(info) => {
                  if (info.file.status !== "uploading") {
                    console.log(info.file, info.fileList);
                  }

                  if (info.file.status === "done") {
                    message.success(`${info.file.name} thêm file thành công`);
                    setRefresh((pre) => pre + 1);
                  } else if (info.file.status === "error") {
                    message.error(`${info.file.name} thêm file thất bại`);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </div>
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => {
        return <em>{text}</em>;
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
            {/* upload hình ảnh */}
            <Upload
              showUploadList={false}
              name="file"
              action={API_URL + "/upload/categories/" + record._id}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }

                if (info.file.status === "done") {
                  message.success(`${info.file.name} Thêm file thành công`);
                  setRefresh((pre) => pre + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} Thêm file thất bại`);
                }
              }}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
            {/* delete */}
            <Popconfirm
              title="Bạn có muốn xóa không"
              onConfirm={() => {
                //delete
                const id = record._id;
                axiosClient
                  .delete("/categories/" + id)
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
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  // xử lý thêm mới
  const onFinish = (values) => {
    axiosClient.post("/categories", values).then((response) => {
      const { _id } = response.data;
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(API_URL + "/upload/categories/" + _id, formData)
        .then((respose) => {
          //console.log(respose.data);
          message.success("Thêm mới thành công ❤");
          // reset dữ liệu đã nhập ở form nhập
          createForm.resetFields();

          // load lại form
          setRefresh((pre) => pre + 1);
        })
        .catch((err) => {
          message.error("Thêm mới thất bại 😥");
        });
    });

    console.log("❤", values);
  };
  const onFinishFailed = (errors) => {
    console.log("💣", errors);
  };
  // xử lý cập nhật thông tin
  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/categories/" + selectedRecord._id, values)
      .then((response) => {
        message.success("Cập nhật thành công ❤");
        updateForm.resetFields();
        // load lại form
        setRefresh((pre) => pre + 1);
        // đóng
        setEditFormVisible(false);
        console.log();
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
        <Form.Item label="Hình minh họa" name="file">
          <Upload
            showUploadList={true}
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Chưa nhập tên danh mục" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item hasFeedback label="Mô tả" name="description">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={categories} columns={columns} />

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
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Chưa nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item hasFeedback label="Mô tả" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Categories;

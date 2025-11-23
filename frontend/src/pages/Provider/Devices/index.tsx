import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

import { devices } from '../../../mock/devices';
import { personnel } from '../../../mock/personnel';
import type { Device } from '../../../types';
import { formatTime } from '../../../utils/time';

interface DeviceFormData {
  sn: string;
  brand: string;
  model: string;
  purchaseDate?: string;
  purchaseVoucher?: any;
}

const ProviderDevicesPage = () => {
  const [form] = Form.useForm<DeviceFormData>();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleRegister = async (values: DeviceFormData) => {
    // 模拟设备登记
    message.success(`设备 ${values.sn} 登记成功`);
    setRegisterModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (device: Device) => {
    // 检查设备是否已绑定人员
    const boundPersonnel = personnel.find((p) => p.boundDeviceSn === device.sn);
    if (boundPersonnel) {
      message.error(`设备 ${device.sn} 已绑定给 ${boundPersonnel.name}，请先解绑后再删除`);
      return;
    }
    // 模拟删除设备
    message.success(`设备 ${device.sn} 已删除`);
  };

  const columns: ColumnsType<Device> = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      width: 150,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: Device['status']) => {
        const statusMap = {
          online: { label: '在线', color: 'success' },
          offline: { label: '离线', color: 'default' },
          maintenance: { label: '维护中', color: 'warning' },
        };
        const config = statusMap[value];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '电量',
      dataIndex: 'battery',
      width: 100,
      render: (value: number) => `${value}%`,
    },
    {
      title: '信号',
      dataIndex: 'signal',
      width: 100,
      render: (value: number) => (
        <Tag color={value >= 3 ? 'green' : value >= 2 ? 'orange' : 'red'}>
          {value > 0 ? `${value}格` : '无信号'}
        </Tag>
      ),
    },
    {
      title: '绑定人员',
      dataIndex: 'boundOperator',
      width: 120,
      render: (value?: string) => value || '-',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const boundPersonnel = personnel.find((p) => p.boundDeviceSn === record.sn);
        return (
          <Space>
            <Button type="link" size="small" onClick={() => setSelectedDevice(record)}>
              查看详情
            </Button>
            <Popconfirm
              title="确认删除设备？"
              description={
                boundPersonnel
                  ? `设备 ${record.sn} 已绑定给 ${boundPersonnel.name}，请先解绑后再删除`
                  : `确定要删除设备 ${record.sn} 吗？此操作不可恢复。`
              }
              onConfirm={() => handleDelete(record)}
              okText="确认删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              disabled={!!boundPersonnel}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} disabled={!!boundPersonnel}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <VideoCameraOutlined />
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                设备管理
              </Typography.Title>
            </Space>
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              管理本单位设备，包括登记、绑定、状态监控
            </Typography.Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setRegisterModalOpen(true)}
            >
              设备登记
            </Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={devices}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* 设备登记弹窗 */}
      <Modal
        open={registerModalOpen}
        title="设备登记"
        onCancel={() => {
          setRegisterModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="确认登记"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="设备编号（SN码）"
            name="sn"
            rules={[{ required: true, message: '请输入设备编号' }]}
          >
            <Input placeholder="例如：JXP2-230501" />
          </Form.Item>
          <Form.Item
            label="设备品牌"
            name="brand"
            rules={[{ required: true, message: '请选择设备品牌' }]}
          >
            <Select placeholder="请选择设备品牌">
              <Select.Option value="建勖信息">建勖信息</Select.Option>
              <Select.Option value="海康威视">海康威视</Select.Option>
              <Select.Option value="大华">大华</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="设备型号"
            name="model"
            rules={[{ required: true, message: '请选择设备型号' }]}
          >
            <Select placeholder="请选择设备型号">
              <Select.Option value="JX-P2">JX-P2 执法记录仪</Select.Option>
              <Select.Option value="JX-P3">JX-P3 执法记录仪</Select.Option>
              <Select.Option value="DS-2CD">DS-2CD 系列</Select.Option>
              <Select.Option value="DH-IPC">DH-IPC 系列</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="采购日期" name="purchaseDate">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="采购凭证" name="purchaseVoucher">
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*,.pdf"
            >
              <Button icon={<UploadOutlined />}>上传凭证</Button>
            </Upload>
            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              支持图片或PDF格式，用于设备登记审核
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* 设备详情抽屉 */}
      <Drawer
        open={!!selectedDevice}
        title="设备详情"
        width={600}
        onClose={() => setSelectedDevice(null)}
        extra={
          selectedDevice && (() => {
            const boundPersonnel = personnel.find((p) => p.boundDeviceSn === selectedDevice.sn);
            return (
              <Popconfirm
                title="确认删除设备？"
                description={
                  boundPersonnel
                    ? `设备 ${selectedDevice.sn} 已绑定给 ${boundPersonnel.name}，请先解绑后再删除`
                    : `确定要删除设备 ${selectedDevice.sn} 吗？此操作不可恢复。`
                }
                onConfirm={() => {
                  handleDelete(selectedDevice);
                  setSelectedDevice(null);
                }}
                okText="确认删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
                disabled={!!boundPersonnel}
              >
                <Button danger icon={<DeleteOutlined />} disabled={!!boundPersonnel}>
                  删除设备
                </Button>
              </Popconfirm>
            );
          })()
        }
      >
        {selectedDevice && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Typography.Text type="secondary">设备编号</Typography.Text>
              <Typography.Title level={5} style={{ marginTop: 4 }}>
                {selectedDevice.sn}
              </Typography.Title>
            </div>
            <div>
              <Typography.Text type="secondary">设备品牌</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedDevice.brand}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">设备型号</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedDevice.model}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">设备状态</Typography.Text>
              <div style={{ marginTop: 4 }}>
                <Tag
                  color={
                    selectedDevice.status === 'online'
                      ? 'success'
                      : selectedDevice.status === 'offline'
                      ? 'default'
                      : 'warning'
                  }
                >
                  {selectedDevice.status === 'online'
                    ? '在线'
                    : selectedDevice.status === 'offline'
                    ? '离线'
                    : '维护中'}
                </Tag>
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">电量</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedDevice.battery}%
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">信号强度</Typography.Text>
              <div style={{ marginTop: 4 }}>
                <Tag
                  color={
                    selectedDevice.signal >= 3 ? 'green' : selectedDevice.signal >= 2 ? 'orange' : 'red'
                  }
                >
                  {selectedDevice.signal > 0 ? `${selectedDevice.signal}格` : '无信号'}
                </Tag>
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">绑定人员</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedDevice.boundOperator || '未绑定'}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">最后活跃时间</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {formatTime(selectedDevice.lastActive)}
              </Typography.Paragraph>
            </div>
          </Space>
        )}
      </Drawer>
    </Space>
  );
};

export default ProviderDevicesPage;


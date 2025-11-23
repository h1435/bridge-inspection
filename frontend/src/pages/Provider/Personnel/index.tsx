import { useState } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, PlusOutlined, TeamOutlined, UnlockOutlined } from '@ant-design/icons';

import { personnel } from '../../../mock/personnel';
import { devices } from '../../../mock/devices';
import type { Personnel } from '../../../types';
import { formatTime } from '../../../utils/time';

// 获取所有设备的SN列表
const getAllDeviceSns = () => devices.map((d) => d.sn);

interface PersonnelFormData {
  name: string;
  phone: string;
  idCard?: string;
  certificate?: string;
  boundDeviceSn?: string; // 改为SN编码
}

const ProviderPersonnelPage = () => {
  const [form] = Form.useForm<PersonnelFormData>();
  const [editForm] = Form.useForm<PersonnelFormData>();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);

  const handleAdd = async (values: PersonnelFormData) => {
    // 模拟添加人员
    message.success(`已添加检测人员：${values.name}`);
    setAddModalOpen(false);
    form.resetFields();
  };

  const handleEdit = (personnel: Personnel) => {
    setEditingPersonnel(personnel);
    editForm.setFieldsValue({
      name: personnel.name,
      phone: personnel.phone,
      idCard: personnel.idCard,
      certificate: personnel.certificate,
      boundDeviceSn: personnel.boundDeviceSn, // 改为SN编码
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (values: PersonnelFormData) => {
    // 模拟更新人员信息
    message.success(`已更新 ${values.name} 的信息`);
    setEditModalOpen(false);
    setEditingPersonnel(null);
    editForm.resetFields();
  };

  const handleUnbind = (personnel: Personnel) => {
    // 模拟解绑设备
    message.success(`已解绑 ${personnel.name} 的设备`);
  };

  // 验证设备SN是否存在
  const validateDeviceSn = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve(); // 可选字段，空值通过
    }
    const deviceSns = getAllDeviceSns();
    if (deviceSns.includes(value)) {
      // 检查是否已被其他人员绑定
      const isBoundByOthers = personnel.some(
        (p) => p.boundDeviceSn === value && p.id !== editingPersonnel?.id,
      );
      if (isBoundByOthers) {
        return Promise.reject(new Error('该设备已被其他人员绑定'));
      }
      return Promise.resolve();
    }
    return Promise.reject(new Error('设备SN编码不存在，请检查后重新输入'));
  };

  const columns: ColumnsType<Personnel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      width: 180,
      render: (value?: string) => value || '-',
    },
    {
      title: '证书编号',
      dataIndex: 'certificate',
      width: 150,
      render: (value?: string) => value || '-',
    },
    {
      title: '绑定设备',
      dataIndex: 'boundDeviceSn',
      width: 150,
      render: (value?: string) => (value ? <Tag color="blue">{value}</Tag> : <Tag>未绑定</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: Personnel['status']) => (
        <Tag color={value === 'active' ? 'success' : 'default'}>
          {value === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => setSelectedPersonnel(record)}>
            查看详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.boundDeviceId && (
            <Popconfirm
              title="确认解绑设备？"
              description={`确定要解绑 ${record.name} 的设备 ${record.boundDeviceSn} 吗？`}
              onConfirm={() => handleUnbind(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<UnlockOutlined />}>
                解绑
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <TeamOutlined />
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              人员管理
            </Typography.Title>
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              管理本单位检测人员，包括添加、信息维护、设备绑定
            </Typography.Text>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            添加人员
          </Button>
        </Space>
      </Card>

      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={personnel}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* 添加人员弹窗 */}
      <Modal
        open={addModalOpen}
        title="添加检测人员"
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="确认添加"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="身份证号" name="idCard">
            <Input placeholder="请输入身份证号（可选）" />
          </Form.Item>
          <Form.Item label="证书编号" name="certificate">
            <Input placeholder="请输入证书编号（可选）" />
          </Form.Item>
          <Form.Item
            label="绑定设备（SN编码）"
            name="boundDeviceSn"
            rules={[{ validator: validateDeviceSn }]}
          >
            <Input placeholder="请输入设备SN编码（可选）" />
            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              输入设备SN编码进行绑定，例如：JXP2-230501
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑人员弹窗 */}
      <Modal
        open={editModalOpen}
        title="编辑检测人员"
        onCancel={() => {
          setEditModalOpen(false);
          setEditingPersonnel(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        okText="确认修改"
        cancelText="取消"
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="身份证号" name="idCard">
            <Input placeholder="请输入身份证号（可选）" />
          </Form.Item>
          <Form.Item label="证书编号" name="certificate">
            <Input placeholder="请输入证书编号（可选）" />
          </Form.Item>
          <Form.Item
            label="绑定设备（SN编码）"
            name="boundDeviceSn"
            rules={[{ validator: validateDeviceSn }]}
          >
            <Input placeholder="请输入设备SN编码（可选）" />
            <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              输入设备SN编码进行绑定，例如：JXP2-230501。留空表示不绑定设备
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* 人员详情抽屉 */}
      <Drawer
        open={!!selectedPersonnel}
        title="人员详情"
        width={600}
        onClose={() => setSelectedPersonnel(null)}
        extra={
          selectedPersonnel && (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  handleEdit(selectedPersonnel);
                  setSelectedPersonnel(null);
                }}
              >
                编辑
              </Button>
              {selectedPersonnel.boundDeviceId && (
                <Popconfirm
                  title="确认解绑设备？"
                  description={`确定要解绑 ${selectedPersonnel.name} 的设备 ${selectedPersonnel.boundDeviceSn} 吗？`}
                  onConfirm={() => {
                    handleUnbind(selectedPersonnel);
                    setSelectedPersonnel(null);
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button danger icon={<UnlockOutlined />}>
                    解绑设备
                  </Button>
                </Popconfirm>
              )}
            </Space>
          )
        }
      >
        {selectedPersonnel && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Typography.Text type="secondary">姓名</Typography.Text>
              <Typography.Title level={5} style={{ marginTop: 4 }}>
                {selectedPersonnel.name}
              </Typography.Title>
            </div>
            <div>
              <Typography.Text type="secondary">手机号</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedPersonnel.phone}
              </Typography.Paragraph>
            </div>
            {selectedPersonnel.idCard && (
              <div>
                <Typography.Text type="secondary">身份证号</Typography.Text>
                <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                  {selectedPersonnel.idCard}
                </Typography.Paragraph>
              </div>
            )}
            {selectedPersonnel.certificate && (
              <div>
                <Typography.Text type="secondary">证书编号</Typography.Text>
                <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                  {selectedPersonnel.certificate}
                </Typography.Paragraph>
              </div>
            )}
            <div>
              <Typography.Text type="secondary">绑定设备</Typography.Text>
              <div style={{ marginTop: 4 }}>
                {selectedPersonnel.boundDeviceSn ? (
                  <Tag color="blue">{selectedPersonnel.boundDeviceSn}</Tag>
                ) : (
                  <Tag>未绑定</Tag>
                )}
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">状态</Typography.Text>
              <div style={{ marginTop: 4 }}>
                <Tag color={selectedPersonnel.status === 'active' ? 'success' : 'default'}>
                  {selectedPersonnel.status === 'active' ? '启用' : '停用'}
                </Tag>
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">创建时间</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {formatTime(selectedPersonnel.createdAt)}
              </Typography.Paragraph>
            </div>
          </Space>
        )}
      </Drawer>
    </Space>
  );
};

export default ProviderPersonnelPage;


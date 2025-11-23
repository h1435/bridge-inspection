import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.css';

interface LoginForm {
  tenant: string;
  username: string;
  code: string;
}

const LoginPage = () => {
  const [form] = Form.useForm<LoginForm>();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} bordered={false}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          定检可视化平台（演示版）
        </Typography.Title>
        <Form<LoginForm> form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ tenant: '浦东新区交通委' }}>
          <Form.Item label="主管单位 / 租户" name="tenant" rules={[{ required: true, message: '请输入租户' }]}>
            <Input placeholder="请输入租户名称" allowClear />
          </Form.Item>
          <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="手机号 / 工号" allowClear />
          </Form.Item>
          <Form.Item label="验证码" name="code" rules={[{ required: true, message: '请输入验证码' }]}>
            <Input placeholder="演示可填写 123456" allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">
              立即登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

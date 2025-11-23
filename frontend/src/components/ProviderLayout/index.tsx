import { Layout as AntLayout, Menu, Typography, theme, Button, Space } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  CheckSquareOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from './index.module.css';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  {
    key: '/provider/dashboard',
    icon: <DashboardOutlined />,
    label: '作业总览',
  },
  {
    key: '/provider/devices',
    icon: <VideoCameraOutlined />,
    label: '设备管理',
  },
  {
    key: '/provider/personnel',
    icon: <TeamOutlined />,
    label: '人员管理',
  },
  {
    key: '/provider/tasks',
    icon: <CheckSquareOutlined />,
    label: '作业记录',
  },
];

const ProviderLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKeys = useMemo(() => {
    const matched = menuItems.find((item) => location.pathname.startsWith(item.key));
    return matched ? [matched.key] : [];
  }, [location.pathname]);

  return (
    <AntLayout className={styles.root}>
      <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
        <div className={styles.brand}>定检可视化</div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header className={styles.header} style={{ background: colorBgContainer }}>
          <div className={styles.headerContent}>
            <Typography.Title level={4} className={styles.title}>
              定检可视化系统（执行单位）
            </Typography.Title>
            <Space>
              <div className={styles.tenantInfo}>执行单位：上海路桥检测有限公司</div>
              <Button
                type="default"
                icon={<SwapOutlined />}
                onClick={() => navigate('/dashboard')}
              >
                切换到主管单位
              </Button>
            </Space>
          </div>
        </Header>
        <Content className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default ProviderLayout;


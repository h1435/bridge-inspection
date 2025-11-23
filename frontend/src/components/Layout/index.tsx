import { Layout as AntLayout, Menu, Typography, theme, Button, Space } from 'antd';
import {
  DashboardOutlined,
  CheckSquareOutlined,
  VideoCameraOutlined,
  DeploymentUnitOutlined,
  ProfileOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import styles from './index.module.css';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '监管大屏',
  },
  {
    key: '/projects',
    icon: <ProfileOutlined />,
    label: '定检计划',
  },
  {
    key: '/tasks',
    icon: <CheckSquareOutlined />,
    label: '作业列表',
  },
  {
    key: '/devices',
    icon: <VideoCameraOutlined />,
    label: '设备监控',
  },
  {
    key: '/checkin-demo',
    icon: <DeploymentUnitOutlined />,
    label: '定检打卡演示',
  },
];

const Layout = () => {
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
              上海市桥梁定检监管平台（演示版）
            </Typography.Title>
            <Space>
              <div className={styles.tenantInfo}>租户：浦东新区交通委</div>
              <Button
                type="default"
                icon={<SwapOutlined />}
                onClick={() => navigate('/provider/dashboard')}
              >
                切换到执行单位
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

export default Layout;

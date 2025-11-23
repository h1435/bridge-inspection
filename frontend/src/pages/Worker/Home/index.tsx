import { Card, Space, Typography } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.css';

const WorkerHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          定检模块
        </Typography.Title>
        <Typography.Text type="secondary">
          选择功能开始操作
        </Typography.Text>
      </Card>

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card className={styles.menuCard} hoverable onClick={() => navigate('/worker/create')}>
          <Space size={16}>
            <div className={styles.iconWrapper}>
              <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Typography.Title level={5} style={{ marginBottom: 4 }}>
                创建新任务
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                开始一个新的定检任务
              </Typography.Text>
            </div>
          </Space>
        </Card>

        <Card className={styles.menuCard} hoverable onClick={() => navigate('/worker/tasks')}>
          <Space size={16}>
            <div className={styles.iconWrapper}>
              <UnorderedListOutlined style={{ fontSize: 24, color: '#52c41a' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Typography.Title level={5} style={{ marginBottom: 4 }}>
                任务列表
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                查看当前任务和历史任务
              </Typography.Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default WorkerHomePage;


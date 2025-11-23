import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Statistic, Row, Col } from 'antd';
import {
  VideoCameraOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatTime } from '../../../utils/time';
import type { WorkerTask, CurrentWork } from '../../../types';

import styles from './index.module.css';

const WorkerWorkingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = (location.state as { task?: WorkerTask })?.task;

  const [workInfo, setWorkInfo] = useState<CurrentWork | null>(null);
  const [duration, setDuration] = useState(0); // 作业时长（分钟）

  useEffect(() => {
    if (!task) {
      navigate('/worker/home');
      return;
    }

    // 初始化作业信息
    const checkinTime = new Date().toISOString();
    setWorkInfo({
      taskId: task.id,
      projectPackage: task.projectPackage,
      route: task.route,
      segment: task.segment,
      checkinTime,
      videoStatus: 'connecting', // 初始状态：连接中
      location: {
        lat: 31.2304 + Math.random() * 0.01,
        lng: 121.4737 + Math.random() * 0.01,
      },
      duration: 0,
    });

    // 模拟视频连接
    setTimeout(() => {
      setWorkInfo((prev) => (prev ? { ...prev, videoStatus: 'on' } : null));
    }, 2000);

    // 定时更新作业时长
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
      if (workInfo) {
        setWorkInfo((prev) => (prev ? { ...prev, duration: duration + 1 } : null));
      }
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, [task, navigate]);

  const handleFinish = () => {
    navigate('/worker/checkout', { state: { task, workInfo } });
  };

  if (!task || !workInfo) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          作业进行中
        </Typography.Title>
        <Typography.Text type="secondary">
          请按要求完成定检作业
        </Typography.Text>
      </Card>

      <Card className={styles.infoCard}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Text type="secondary">项目包</Typography.Text>
            <Typography.Title level={5} style={{ marginTop: 4 }}>
              {workInfo.projectPackage}
            </Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">定检路线</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {workInfo.route}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">定检路段</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {workInfo.segment}
            </Typography.Paragraph>
          </div>
        </Space>
      </Card>

      <Card className={styles.statusCard}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="作业时长"
              value={duration}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="录像状态"
              value={
                workInfo.videoStatus === 'on' ? '已开启' : workInfo.videoStatus === 'connecting' ? '连接中' : '未开启'
              }
              prefix={<VideoCameraOutlined />}
              valueStyle={{
                color: workInfo.videoStatus === 'on' ? '#52c41a' : workInfo.videoStatus === 'connecting' ? '#faad14' : '#ff4d4f',
                fontSize: 14,
              }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="打卡时间"
              value={formatTime(workInfo.checkinTime).split(' ')[1]}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ fontSize: 14 }}
            />
          </Col>
        </Row>
      </Card>

      {workInfo.location && (
        <Card className={styles.locationCard}>
          <Space>
            <EnvironmentOutlined />
            <Typography.Text>
              当前位置：{workInfo.location.lat.toFixed(4)}, {workInfo.location.lng.toFixed(4)}
            </Typography.Text>
          </Space>
        </Card>
      )}

      <div className={styles.actionBar}>
        <Button
          type="primary"
          block
          size="large"
          icon={<CheckCircleOutlined />}
          onClick={handleFinish}
        >
          结束任务
        </Button>
      </div>
    </div>
  );
};

export default WorkerWorkingPage;


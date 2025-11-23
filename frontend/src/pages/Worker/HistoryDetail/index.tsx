import { Card, Space, Typography, Tag, Descriptions, Empty } from 'antd';
import { useLocation } from 'react-router-dom';
import {
  CheckCircleOutlined,
  VideoCameraOutlined,
  BranchesOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { formatTime } from '../../../utils/time';
import type { WorkerHistoryTask } from '../../../types';

import styles from './index.module.css';

const WorkerHistoryDetailPage = () => {
  const location = useLocation();
  const task = (location.state as { task?: WorkerHistoryTask })?.task;

  if (!task) {
    return (
      <div className={styles.container}>
        <Card>
          <Empty description="任务信息不存在" />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          任务详情
        </Typography.Title>
        <Typography.Text type="secondary">
          查看历史任务详细信息
        </Typography.Text>
      </Card>

      <Card className={styles.infoCard}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Text type="secondary">项目包</Typography.Text>
            <Typography.Title level={5} style={{ marginTop: 4 }}>
              {task.projectPackage}
            </Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">定检路线</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {task.route}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">定检路段</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {task.segment}
            </Typography.Paragraph>
          </div>
          {task.description && (
            <div>
              <Typography.Text type="secondary">作业说明</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {task.description}
              </Typography.Paragraph>
            </div>
          )}
        </Space>
      </Card>

      <Card className={styles.statusCard}>
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item
            label={
              <Space>
                <CheckCircleOutlined />
                <span>任务状态</span>
              </Space>
            }
          >
            <Tag
              color={
                task.status === 'completed'
                  ? 'success'
                  : task.status === 'abnormal'
                  ? 'error'
                  : 'warning'
              }
            >
              {task.status === 'completed' ? '已完成' : task.status === 'abnormal' ? '异常' : '中断'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <ClockCircleOutlined />
                <span>开工时间</span>
              </Space>
            }
          >
            {formatTime(task.checkinTime)}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <ClockCircleOutlined />
                <span>收工时间</span>
              </Space>
            }
          >
            {formatTime(task.checkoutTime)}
          </Descriptions.Item>
          <Descriptions.Item label="作业时长">
            {task.duration} 分钟
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <VideoCameraOutlined />
                <span>视频记录</span>
              </Space>
            }
          >
            {task.videoRecorded ? (
              <Tag color="blue">有视频记录</Tag>
            ) : (
              <Tag>无视频记录</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <BranchesOutlined />
                <span>轨迹记录</span>
              </Space>
            }
          >
            {task.trajectoryRecorded ? (
              <Tag color="green">有轨迹记录</Tag>
            ) : (
              <Tag>无轨迹记录</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default WorkerHistoryDetailPage;


import { useState } from 'react';
import { Card, List, Button, Space, Typography, Tag, Empty, Divider } from 'antd';
import { EyeOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { currentTask, historyTasks } from '../../../mock/workerTasks';
import { formatTime } from '../../../utils/time';
import type { CurrentWork, WorkerHistoryTask } from '../../../types';

import styles from './index.module.css';

const WorkerTasksPage = () => {
  const navigate = useNavigate();
  const [current] = useState<CurrentWork | null>(currentTask);
  const [history] = useState<WorkerHistoryTask[]>(historyTasks);

  const handleViewCurrent = () => {
    // 跳转到当前任务详情（作业中页面）
    if (current) {
      const task = {
        id: current.taskId,
        projectPackage: current.projectPackage,
        route: current.route,
        segment: current.segment,
        status: 'in-progress' as const,
      };
      navigate('/worker/working', { state: { task, workInfo: current } });
    }
  };

  const handleViewHistory = (historyTask: WorkerHistoryTask) => {
    // 跳转到历史任务详情
    navigate('/worker/history-detail', { state: { task: historyTask } });
  };

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          任务列表
        </Typography.Title>
        <Typography.Text type="secondary">
          查看当前任务和历史任务
        </Typography.Text>
      </Card>

      {/* 当前任务 */}
      {current ? (
        <Card className={styles.currentTaskCard} style={{ borderColor: '#1890ff' }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag color="processing" icon={<ClockCircleOutlined />}>
                进行中
              </Tag>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                已作业 {current.duration} 分钟
              </Typography.Text>
            </div>
            <div>
              <Typography.Title level={5} style={{ marginBottom: 4 }}>
                {current.projectPackage}
              </Typography.Title>
              <Space>
                <Tag color="blue">{current.route}</Tag>
                <Tag color="green">{current.segment}</Tag>
              </Space>
            </div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              打卡时间：{formatTime(current.checkinTime)}
            </Typography.Text>
            <Button
              type="primary"
              block
              icon={<EyeOutlined />}
              onClick={handleViewCurrent}
              size="large"
            >
              查看详情
            </Button>
          </Space>
        </Card>
      ) : (
        <Card>
          <Empty description="暂无进行中的任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      )}

      {/* 历史任务 */}
      <Divider orientation="left" style={{ marginTop: 24, marginBottom: 16 }}>
        <Typography.Text type="secondary">历史任务</Typography.Text>
      </Divider>

      {history.length === 0 ? (
        <Card>
          <Empty description="暂无历史任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <List
          dataSource={history}
          renderItem={(task) => (
            <Card className={styles.historyTaskCard} key={task.id}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag
                    color={
                      task.status === 'completed'
                        ? 'success'
                        : task.status === 'abnormal'
                        ? 'error'
                        : 'warning'
                    }
                    icon={<CheckCircleOutlined />}
                  >
                    {task.status === 'completed' ? '已完成' : task.status === 'abnormal' ? '异常' : '中断'}
                  </Tag>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {formatTime(task.checkinTime).split(' ')[0]}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Title level={5} style={{ marginBottom: 4 }}>
                    {task.projectPackage}
                  </Typography.Title>
                  <Space>
                    <Tag color="blue">{task.route}</Tag>
                    <Tag color="green">{task.segment}</Tag>
                  </Space>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <Typography.Text type="secondary">
                    作业时长：{task.duration} 分钟
                  </Typography.Text>
                  <Space>
                    {task.videoRecorded && <Tag color="blue">有视频</Tag>}
                    {task.trajectoryRecorded && <Tag color="green">有轨迹</Tag>}
                  </Space>
                </div>
                <Button
                  type="default"
                  block
                  icon={<EyeOutlined />}
                  onClick={() => handleViewHistory(task)}
                >
                  查看详情
                </Button>
              </Space>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default WorkerTasksPage;

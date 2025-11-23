import { Badge, Card, Space, Tag, Typography } from 'antd';
import {
  AlertOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { Operator } from '../../types';
import { formatTime } from '../../utils/time';

import styles from './index.module.css';

interface VideoCardProps {
  operator: Operator;
}

const statusColorMap: Record<Operator['status'], string> = {
  working: 'green',
  paused: 'orange',
  alert: 'red',
};

const videoStatusLabel: Record<Operator['videoStatus'], string> = {
  online: '视频在线',
  offline: '视频离线',
  connecting: '尝试自动连接',
};

const VideoCard = ({ operator }: VideoCardProps) => {
  return (
    <Card
      className={styles.card}
      hoverable
      cover={<div className={styles.cover} />} // 视频占位图
      actions={[
        <Space key="play">
          <PlayCircleOutlined />
          <span>查看详情</span>
        </Space>,
      ]}
    >
      <Space className={styles.header} align="start">
        <Badge color={statusColorMap[operator.status]} />
        <div>
          <Typography.Title level={5} className={styles.name}>
            {operator.name}
          </Typography.Title>
          <div className={styles.route}>项目包：{operator.projectPackage}</div>
          <div className={styles.route}>
            路线/路段：{operator.route} · {operator.segment}
          </div>
        </div>
      </Space>
      <Space direction="vertical" className={styles.info}>
        <div className={styles.infoRow}>
          <ClockCircleOutlined />
          <span>最后打卡：{formatTime(operator.lastCheckinTime)}</span>
        </div>
        <div className={styles.infoRow}>
          <AlertOutlined />
          <span>设备编号：{operator.deviceId}</span>
        </div>
        <Tag color={operator.videoStatus === 'online' ? 'green' : 'orange'}>
          {videoStatusLabel[operator.videoStatus]}
        </Tag>
      </Space>
    </Card>
  );
};

export default VideoCard;

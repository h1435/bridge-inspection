import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import type { AlertItem } from '../../types';
import { formatTime } from '../../utils/time';

import styles from './index.module.css';

interface AlertTickerProps {
  data: AlertItem[];
  interval?: number;
}

const AlertTicker = ({ data, interval = 5000 }: AlertTickerProps) => {
  const sorted = useMemo(
    () => [...data].sort((a, b) => (a.time < b.time ? 1 : -1)),
    [data],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!sorted.length) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % sorted.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [sorted, interval]);

  if (!sorted.length) {
    return null;
  }

  const current = sorted[index];

  return (
    <div className={styles.wrapper}>
      <Alert
        type={current.level === 'critical' ? 'error' : current.level === 'warning' ? 'warning' : 'info'}
        message=
          <Space>
            <SoundOutlined />
            <Typography.Text strong>{current.type}</Typography.Text>
            <Typography.Text>{current.message}</Typography.Text>
          </Space>
        action={<Button size="small">查看详情</Button>}
        description={<Typography.Text type="secondary">{formatTime(current.time)}</Typography.Text>}
        showIcon={false}
        className={styles.alert}
      />
    </div>
  );
};

export default AlertTicker;

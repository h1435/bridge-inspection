import dayjs from '../utils/dayjs';
import type { AlertItem } from '../types';

export const alerts: AlertItem[] = [
  {
    id: 'alert-001',
    type: '视频中断',
    level: 'critical',
    message: '王敏-中山南路沿线：视频信号异常，已尝试自动重连。',
    time: dayjs().subtract(1, 'minute').toISOString(),
  },
  {
    id: 'alert-002',
    type: '轨迹偏离',
    level: 'warning',
    message: '刘强-外环高架东段：定位偏离计划路线 80 米。',
    time: dayjs().subtract(6, 'minute').toISOString(),
  },
  {
    id: 'alert-003',
    type: '设备离线',
    level: 'critical',
    message: '设备 JXP2-231021 已离线 3 小时，请及时排查。',
    time: dayjs().subtract(12, 'minute').toISOString(),
  },
  {
    id: 'alert-004',
    type: '长时间静止',
    level: 'info',
    message: '赵磊-嘉罗公路北段：静止超过 15 分钟，请确认是否正常。',
    time: dayjs().subtract(18, 'minute').toISOString(),
  },
];

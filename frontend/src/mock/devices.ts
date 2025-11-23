import dayjs from '../utils/dayjs';
import type { Device } from '../types';

export const devices: Device[] = [
  {
    id: 'dev-001',
    sn: 'JXP2-230501',
    brand: '建勖信息',
    model: 'JX-P2',
    status: 'online',
    battery: 82,
    signal: 4,
    boundOperator: '刘强',
    lastActive: dayjs().subtract(2, 'minute').toISOString(),
  },
  {
    id: 'dev-004',
    sn: 'JXP2-230612',
    brand: '建勖信息',
    model: 'JX-P2',
    status: 'online',
    battery: 56,
    signal: 2,
    boundOperator: '王敏',
    lastActive: dayjs().subtract(4, 'minute').toISOString(),
  },
  {
    id: 'dev-006',
    sn: 'JXP2-230845',
    brand: '建勖信息',
    model: 'JX-P2',
    status: 'maintenance',
    battery: 0,
    signal: 0,
    boundOperator: '赵磊',
    lastActive: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'dev-009',
    sn: 'JXP2-231021',
    brand: '建勖信息',
    model: 'JX-P2',
    status: 'offline',
    battery: 34,
    signal: 0,
    lastActive: dayjs().subtract(3, 'hour').toISOString(),
  },
];

import { Progress, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { devices } from '../../mock/devices';
import type { Device } from '../../types';
import { formatTime } from '../../utils/time';

const statusColor: Record<Device['status'], string> = {
  online: 'success',
  offline: 'default',
  maintenance: 'warning',
};

const statusLabel: Record<Device['status'], string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
};

const columns: ColumnsType<Device> = [
  { title: '设备编号', dataIndex: 'sn' },
  { title: '品牌', dataIndex: 'brand' },
  { title: '型号', dataIndex: 'model' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value: Device['status']) => <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>,
  },
  {
    title: '绑定人员',
    dataIndex: 'boundOperator',
    render: (value?: string) => value ?? '-'
  },
  {
    title: '电量',
    dataIndex: 'battery',
    render: (value: number) => <Progress percent={value} size="small" status={value > 20 ? 'active' : 'exception'} />,
  },
  {
    title: '信号',
    dataIndex: 'signal',
    render: (value: number) => <Progress percent={(value / 5) * 100} size="small" showInfo={false} />,
  },
  {
    title: '最近活跃',
    dataIndex: 'lastActive',
    render: (value: string) => formatTime(value),
  },
];

const DevicesPage = () => {
  return <Table rowKey="id" columns={columns} dataSource={devices} pagination={false} />;
};

export default DevicesPage;

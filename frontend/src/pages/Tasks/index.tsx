import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { tasks } from '../../mock/tasks';
import type { TaskItem } from '../../types';
import { formatTime } from '../../utils/time';

const statusLabel: Record<TaskItem['status'], { text: string; color: string }> = {
  'in-progress': { text: '作业中', color: 'processing' },
  pending: { text: '待执行', color: 'default' },
  completed: { text: '已完成', color: 'success' },
  alert: { text: '告警中', color: 'error' },
};

const columns: ColumnsType<TaskItem> = [
  {
    title: '项目包',
    dataIndex: 'projectPackage',
  },
  {
    title: '路线',
    dataIndex: 'route',
  },
  {
    title: '路段',
    dataIndex: 'segment',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value: TaskItem['status']) => <Tag color={statusLabel[value].color}>{statusLabel[value].text}</Tag>,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    render: (value: string) => formatTime(value),
  },
  {
    title: '告警数量',
    dataIndex: 'alerts',
    render: (value: number) => (value > 0 ? <Tag color="error">{value}</Tag> : <Tag color="default">0</Tag>),
  },
];

const TasksPage = () => {
  return <Table rowKey="id" columns={columns} dataSource={tasks} pagination={false} />;
};

export default TasksPage;

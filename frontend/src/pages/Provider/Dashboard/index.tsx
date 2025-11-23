import { useMemo } from 'react';
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

import { devices } from '../../../mock/devices';
import { tasks } from '../../../mock/tasks';
import { operators } from '../../../mock/operators';
import type { Device, TaskItem } from '../../../types';
import { formatTime } from '../../../utils/time';

import styles from './index.module.css';

const ProviderDashboardPage = () => {
  // 统计本单位数据
  const stats = useMemo(() => {
    // 设备统计
    const totalDevices = devices.length;
    const onlineDevices = devices.filter((d) => d.status === 'online').length;
    const offlineDevices = devices.filter((d) => d.status === 'offline').length;
    const maintenanceDevices = devices.filter((d) => d.status === 'maintenance').length;

    // 人员统计
    const totalOperators = operators.length;
    const workingOperators = operators.filter((o) => o.status === 'working').length;
    const alertOperators = operators.filter((o) => o.status === 'alert').length;

    // 作业统计
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const alertTasks = tasks.filter((t) => t.status === 'alert').length;

    return {
      devices: { total: totalDevices, online: onlineDevices, offline: offlineDevices, maintenance: maintenanceDevices },
      operators: { total: totalOperators, working: workingOperators, alert: alertOperators },
      tasks: { total: totalTasks, inProgress: inProgressTasks, completed: completedTasks, alert: alertTasks },
    };
  }, []);

  // 最近作业列表
  const recentTasksColumns: ColumnsType<TaskItem> = [
    {
      title: '项目包',
      dataIndex: 'projectPackage',
      width: 200,
    },
    {
      title: '定检路线',
      dataIndex: 'route',
      width: 150,
    },
    {
      title: '定检路段',
      dataIndex: 'segment',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: TaskItem['status']) => {
        const statusMap = {
          'in-progress': { label: '进行中', color: 'processing' },
          pending: { label: '待开始', color: 'default' },
          completed: { label: '已完成', color: 'success' },
          alert: { label: '告警中', color: 'error' },
        };
        const config = statusMap[value];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '告警次数',
      dataIndex: 'alerts',
      width: 100,
      render: (value: number) => (value > 0 ? <Tag color="red">{value}</Tag> : value),
    },
  ];

  // 设备状态列表
  const devicesColumns: ColumnsType<Device> = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      width: 150,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: Device['status']) => {
        const statusMap = {
          online: { label: '在线', color: 'success' },
          offline: { label: '离线', color: 'default' },
          maintenance: { label: '维护中', color: 'warning' },
        };
        const config = statusMap[value];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '电量',
      dataIndex: 'battery',
      width: 100,
      render: (value: number) => `${value}%`,
    },
    {
      title: '信号',
      dataIndex: 'signal',
      width: 100,
      render: (value: number) => (
        <Tag color={value >= 3 ? 'green' : value >= 2 ? 'orange' : 'red'}>
          {value > 0 ? `${value}格` : '无信号'}
        </Tag>
      ),
    },
    {
      title: '绑定人员',
      dataIndex: 'boundOperator',
      width: 120,
      render: (value?: string) => value || '-',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      width: 180,
      render: (value: string) => formatTime(value),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <Typography.Title level={4} style={{ marginBottom: 0 }}>
          作业总览
        </Typography.Title>
        <Typography.Text type="secondary">
          查看本单位作业统计、设备状态、告警概览
        </Typography.Text>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className={styles.statCard}>
            <Statistic
              title="设备总数"
              value={stats.devices.total}
              prefix={<VideoCameraOutlined />}
              suffix={
                <Space size={4}>
                  <Tag color="success">{stats.devices.online}在线</Tag>
                  <Tag color="default">{stats.devices.offline}离线</Tag>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className={styles.statCard}>
            <Statistic
              title="检测人员"
              value={stats.operators.total}
              prefix={<TeamOutlined />}
              suffix={
                <Space size={4}>
                  <Tag color="processing">{stats.operators.working}作业中</Tag>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className={styles.statCard}>
            <Statistic
              title="作业任务"
              value={stats.tasks.total}
              prefix={<CheckCircleOutlined />}
              suffix={
                <Space size={4}>
                  <Tag color="processing">{stats.tasks.inProgress}进行中</Tag>
                  <Tag color="success">{stats.tasks.completed}已完成</Tag>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className={styles.statCard}>
            <Statistic
              title="告警数量"
              value={stats.tasks.alert + stats.operators.alert}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#f87171' }}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      {/* 最近作业 */}
      <Card
        bordered={false}
        title="最近作业"
        extra={<Typography.Link>查看全部</Typography.Link>}
      >
        <Table
          rowKey="id"
          columns={recentTasksColumns}
          dataSource={tasks.slice(0, 5)}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 设备状态 */}
      <Card
        bordered={false}
        title="设备状态"
        extra={<Typography.Link>设备管理</Typography.Link>}
      >
        <Table
          rowKey="id"
          columns={devicesColumns}
          dataSource={devices}
          pagination={false}
          size="small"
        />
      </Card>
    </Space>
  );
};

export default ProviderDashboardPage;


import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  HistoryOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from '../../utils/dayjs';

import { historyRecords } from '../../mock/history';
import type { HistoryRecord } from '../../types';
import { formatTime } from '../../utils/time';
import mapPlaceholder from '../../assets/react.svg';

import styles from './index.module.css';

const { RangePicker } = DatePicker;

interface FilterForm {
  dateRange?: [Dayjs, Dayjs];
  operatorName?: string;
  projectPackage?: string;
  status?: HistoryRecord['status'];
}

const statusMap: Record<HistoryRecord['status'], { label: string; color: string }> = {
  completed: { label: '正常完成', color: 'success' },
  abnormal: { label: '异常结束', color: 'warning' },
  interrupted: { label: '中断', color: 'error' },
};

const HistoryPage = () => {
  const [form] = Form.useForm<FilterForm>();
  const [filterValues, setFilterValues] = useState<FilterForm>({});
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  // 获取所有可选项
  const operatorNames = useMemo(
    () => Array.from(new Set(historyRecords.map((r) => r.operatorName))),
    [],
  );
  const projectPackages = useMemo(
    () => Array.from(new Set(historyRecords.map((r) => r.projectPackage))),
    [],
  );

  // 筛选逻辑
  const dataSource = useMemo(() => {
    let filtered = [...historyRecords];

    // 时间范围筛选
    if (filterValues.dateRange) {
      const [start, end] = filterValues.dateRange;
      filtered = filtered.filter((record) => {
        const recordDate = dayjs(record.checkinTime);
        const startDate = start.startOf('day');
        const endDate = end.endOf('day');
        return (
          (recordDate.isAfter(startDate) || recordDate.isSame(startDate)) &&
          (recordDate.isBefore(endDate) || recordDate.isSame(endDate))
        );
      });
    }

    // 人员筛选
    if (filterValues.operatorName) {
      filtered = filtered.filter((record) => record.operatorName === filterValues.operatorName);
    }

    // 项目包筛选
    if (filterValues.projectPackage) {
      filtered = filtered.filter(
        (record) => record.projectPackage === filterValues.projectPackage,
      );
    }

    // 状态筛选
    if (filterValues.status) {
      filtered = filtered.filter((record) => record.status === filterValues.status);
    }

    return filtered;
  }, [filterValues]);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilterValues(values);
  };

  const handleReset = () => {
    form.resetFields();
    setFilterValues({});
  };

  const columns: ColumnsType<HistoryRecord> = [
    { title: '检测人员', dataIndex: 'operatorName', width: 100 },
    { title: '所属单位', dataIndex: 'company', width: 180 },
    { title: '项目包', dataIndex: 'projectPackage', width: 200 },
    { title: '定检路线', dataIndex: 'route', width: 150 },
    { title: '定检路段', dataIndex: 'segment', width: 150 },
    {
      title: '打卡时间',
      dataIndex: 'checkinTime',
      width: 180,
      render: (value: string) => formatTime(value),
    },
    {
      title: '收工时间',
      dataIndex: 'checkoutTime',
      width: 180,
      render: (value: string) => (value ? formatTime(value) : '-'),
    },
    {
      title: '作业时长',
      dataIndex: 'duration',
      width: 100,
      render: (value: number) => (value ? `${value}分钟` : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: HistoryRecord['status']) => (
        <Tag color={statusMap[value].color}>{statusMap[value].label}</Tag>
      ),
    },
    {
      title: '告警次数',
      dataIndex: 'alerts',
      width: 100,
      render: (value: number) => (value > 0 ? <Tag color="red">{value}</Tag> : value),
    },
    {
      title: '记录',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.videoRecorded && (
            <Tag icon={<VideoCameraOutlined />} color="blue">
              视频
            </Tag>
          )}
          {record.trajectoryRecorded && (
            <Tag icon={<PlayCircleOutlined />} color="green">
              轨迹
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => setSelectedRecord(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <Space>
          <HistoryOutlined />
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            历史数据回看
          </Typography.Title>
        </Space>
        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
          查看历史作业记录、轨迹回放、视频回放
        </Typography.Text>
      </Card>

      <Card bordered={false} title="筛选条件">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 8]}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="时间范围" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="检测人员" name="operatorName">
                <Select placeholder="请选择检测人员" allowClear style={{ width: '100%' }}>
                  {operatorNames.map((name) => (
                    <Select.Option key={name} value={name}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="项目包" name="projectPackage">
                <Select placeholder="请选择项目包" allowClear style={{ width: '100%' }}>
                  {projectPackages.map((pkg) => (
                    <Select.Option key={pkg} value={pkg}>
                      {pkg}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                  <Select.Option value="completed">正常完成</Select.Option>
                  <Select.Option value="abnormal">异常结束</Select.Option>
                  <Select.Option value="interrupted">中断</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={24}>
              <Form.Item>
                <div className={styles.actions}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        open={!!selectedRecord}
        title={
          selectedRecord ? (
            <Space>
              <Tag color={statusMap[selectedRecord.status].color}>
                {statusMap[selectedRecord.status].label}
              </Tag>
              <span>{selectedRecord.operatorName} - 作业详情</span>
            </Space>
          ) : null
        }
        width={1200}
        onClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <Row gutter={16}>
            <Col span={16}>
              <Card title="视频回放" bordered={false} className={styles.videoCard}>
                <div className={styles.videoContainer}>
                  <div className={styles.videoPlaceholder}>
                    {selectedRecord.videoRecorded ? (
                      <>
                        <PlayCircleOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                        <Typography.Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                          视频回放：{selectedRecord.checkinTime} 至 {selectedRecord.checkoutTime || '未收工'}
                        </Typography.Text>
                        <Button type="primary" style={{ marginTop: 16 }}>
                          播放视频
                        </Button>
                      </>
                    ) : (
                      <Typography.Text type="secondary">该作业无视频记录</Typography.Text>
                    )}
                  </div>
                </div>
              </Card>
              <Card title="轨迹回放" bordered={false} style={{ marginTop: 16 }}>
                <div className={styles.mapPlaceholder} style={{ height: 300 }}>
                  <img src={mapPlaceholder} alt="map" />
                  {selectedRecord.location && (
                    <div
                      className={`${styles.mapMarker} ${styles[`marker-${selectedRecord.status}`]}`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className={styles.markerDot} />
                      <div className={styles.markerLabel}>{selectedRecord.operatorName}</div>
                    </div>
                  )}
                </div>
                {selectedRecord.trajectoryRecorded ? (
                  <Button type="primary" style={{ marginTop: 16 }}>
                    播放轨迹
                  </Button>
                ) : (
                  <Typography.Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                    该作业无轨迹记录
                  </Typography.Text>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="作业信息" bordered={false}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Typography.Text type="secondary">检测人员</Typography.Text>
                    <Typography.Title level={5} style={{ marginTop: 4 }}>
                      {selectedRecord.operatorName}
                    </Typography.Title>
                  </div>
                  <div>
                    <Typography.Text type="secondary">所属单位</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedRecord.company}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">项目包</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedRecord.projectPackage}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">定检路线</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedRecord.route}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">定检路段</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedRecord.segment}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">打卡时间</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {formatTime(selectedRecord.checkinTime)}
                    </Typography.Paragraph>
                  </div>
                  {selectedRecord.checkoutTime && (
                    <div>
                      <Typography.Text type="secondary">收工时间</Typography.Text>
                      <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                        {formatTime(selectedRecord.checkoutTime)}
                      </Typography.Paragraph>
                    </div>
                  )}
                  {selectedRecord.duration && (
                    <div>
                      <Typography.Text type="secondary">作业时长</Typography.Text>
                      <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                        {selectedRecord.duration} 分钟
                      </Typography.Paragraph>
                    </div>
                  )}
                  <div>
                    <Typography.Text type="secondary">告警次数</Typography.Text>
                    <div style={{ marginTop: 4 }}>
                      {selectedRecord.alerts > 0 ? (
                        <Tag color="red">{selectedRecord.alerts} 次</Tag>
                      ) : (
                        <Tag color="green">无告警</Tag>
                      )}
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </Drawer>
    </Space>
  );
};

export default HistoryPage;


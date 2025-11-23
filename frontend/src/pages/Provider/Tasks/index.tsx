import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Image,
  List,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CameraOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  BranchesOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from '../../../utils/dayjs';

import { tasks } from '../../../mock/tasks';
import { operators } from '../../../mock/operators';
import type { TaskItem } from '../../../types';
import { formatTime } from '../../../utils/time';

import styles from './index.module.css';

const { RangePicker } = DatePicker;

interface FilterForm {
  dateRange?: [Dayjs, Dayjs];
  operatorName?: string;
  projectPackage?: string;
  status?: TaskItem['status'];
}

const ProviderTasksPage = () => {
  const [form] = Form.useForm<FilterForm>();
  const [filterValues, setFilterValues] = useState<FilterForm>({});
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // 获取所有可选项
  const operatorNames = Array.from(new Set(operators.map((o) => o.name)));
  const projectPackages = Array.from(new Set(tasks.map((t) => t.projectPackage)));

  // 筛选逻辑
  const dataSource = useMemo(() => {
    let filtered = [...tasks];

    // 时间范围筛选
    if (filterValues.dateRange) {
      const [start, end] = filterValues.dateRange;
      filtered = filtered.filter((task) => {
        const taskDate = dayjs(task.startTime);
        const startDate = start.startOf('day');
        const endDate = end.endOf('day');
        return (
          (taskDate.isAfter(startDate) || taskDate.isSame(startDate)) &&
          (taskDate.isBefore(endDate) || taskDate.isSame(endDate))
        );
      });
    }

    // 人员筛选（需要从operators中匹配）
    if (filterValues.operatorName) {
      // 这里简化处理，实际应该根据任务关联的人员进行筛选
      filtered = filtered;
    }

    // 项目包筛选
    if (filterValues.projectPackage) {
      filtered = filtered.filter((task) => task.projectPackage === filterValues.projectPackage);
    }

    // 状态筛选
    if (filterValues.status) {
      filtered = filtered.filter((task) => task.status === filterValues.status);
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

  const columns: ColumnsType<TaskItem> = [
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
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedTask(record)}
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
          <CheckSquareOutlined />
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            作业记录
          </Typography.Title>
        </Space>
        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
          查看本单位所有作业记录、进度、数据审核
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
                  <Select.Option value="in-progress">进行中</Select.Option>
                  <Select.Option value="pending">待开始</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                  <Select.Option value="alert">告警中</Select.Option>
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
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* 作业详情抽屉 */}
      <Drawer
        open={!!selectedTask}
        title="作业详情"
        width={800}
        onClose={() => setSelectedTask(null)}
      >
        {selectedTask && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Typography.Text type="secondary">项目包</Typography.Text>
              <Typography.Title level={5} style={{ marginTop: 4 }}>
                {selectedTask.projectPackage}
              </Typography.Title>
            </div>
            <div>
              <Typography.Text type="secondary">定检路线</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedTask.route}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">定检路段</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {selectedTask.segment}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">状态</Typography.Text>
              <div style={{ marginTop: 4 }}>
                <Tag
                  color={
                    selectedTask.status === 'completed'
                      ? 'success'
                      : selectedTask.status === 'in-progress'
                      ? 'processing'
                      : selectedTask.status === 'alert'
                      ? 'error'
                      : 'default'
                  }
                >
                  {selectedTask.status === 'completed'
                    ? '已完成'
                    : selectedTask.status === 'in-progress'
                    ? '进行中'
                    : selectedTask.status === 'alert'
                    ? '告警中'
                    : '待开始'}
                </Tag>
              </div>
            </div>
            <div>
              <Typography.Text type="secondary">开始时间</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {formatTime(selectedTask.startTime)}
              </Typography.Paragraph>
            </div>
            <div>
              <Typography.Text type="secondary">告警次数</Typography.Text>
              <div style={{ marginTop: 4 }}>
                {selectedTask.alerts > 0 ? (
                  <Tag color="red">{selectedTask.alerts} 次</Tag>
                ) : (
                  <Tag color="green">无告警</Tag>
                )}
              </div>
            </div>
            <Card title="作业数据" bordered={false} style={{ marginTop: 16 }}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {/* 打卡记录 */}
                {selectedTask.checkinTime && (
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      打卡记录
                    </Typography.Title>
                    <Descriptions column={2} size="small" bordered>
                      <Descriptions.Item label="检测人员">
                        <Space>
                          <UserOutlined />
                          {selectedTask.operatorName || '-'}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="打卡时间">
                        {formatTime(selectedTask.checkinTime)}
                      </Descriptions.Item>
                      {selectedTask.checkoutTime && (
                        <>
                          <Descriptions.Item label="收工时间">
                            {formatTime(selectedTask.checkoutTime)}
                          </Descriptions.Item>
                          <Descriptions.Item label="作业时长">
                            {selectedTask.duration ? `${selectedTask.duration} 分钟` : '-'}
                          </Descriptions.Item>
                        </>
                      )}
                    </Descriptions>
                  </div>
                )}

                {/* 视频回看 */}
                {selectedTask.videoRecords && selectedTask.videoRecords.length > 0 ? (
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      <VideoCameraOutlined style={{ marginRight: 8 }} />
                      视频回看
                    </Typography.Title>
                    <List
                      dataSource={selectedTask.videoRecords}
                      renderItem={(video) => (
                        <List.Item>
                          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space>
                              <PlayCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                              <div>
                                <Typography.Text strong>
                                  视频片段 {video.id}
                                </Typography.Text>
                                <br />
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                  {formatTime(video.startTime)} - {formatTime(video.endTime)}
                                </Typography.Text>
                              </div>
                            </Space>
                            <Tag color="blue">{video.duration} 分钟</Tag>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                ) : (
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      <VideoCameraOutlined style={{ marginRight: 8 }} />
                      视频回看
                    </Typography.Title>
                    <Empty description="暂无视频记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}

                {/* 现场照片 */}
                {selectedTask.photos && selectedTask.photos.length > 0 ? (
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      <CameraOutlined style={{ marginRight: 8 }} />
                      现场照片 ({selectedTask.photos.length} 张)
                    </Typography.Title>
                    <Row gutter={[12, 12]}>
                      {selectedTask.photos.map((photo) => (
                        <Col key={photo.id} xs={12} sm={8} md={6}>
                          <Card
                            hoverable
                            cover={
                              <Image
                                alt={photo.description}
                                src={photo.url}
                                style={{ height: 120, objectFit: 'cover' }}
                                preview
                              />
                            }
                            size="small"
                          >
                            <Card.Meta
                              title={
                                <Typography.Text ellipsis style={{ fontSize: 12 }}>
                                  {photo.description || '现场照片'}
                                </Typography.Text>
                              }
                              description={
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                  {formatTime(photo.time)}
                                </Typography.Text>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      <CameraOutlined style={{ marginRight: 8 }} />
                      现场照片
                    </Typography.Title>
                    <Empty description="暂无现场照片" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}

                {/* 轨迹信息 */}
                {selectedTask.trajectory && selectedTask.trajectory.recorded ? (
                  <div>
                          <Typography.Title level={5} style={{ marginBottom: 12 }}>
                            <BranchesOutlined style={{ marginRight: 8 }} />
                      轨迹信息
                    </Typography.Title>
                    <Descriptions column={2} size="small" bordered>
                      <Descriptions.Item label="轨迹点数量">
                        {selectedTask.trajectory.points || 0} 个
                      </Descriptions.Item>
                      <Descriptions.Item label="总里程">
                        {selectedTask.trajectory.distance ? `${selectedTask.trajectory.distance} 公里` : '-'}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : (
                  <div>
                          <Typography.Title level={5} style={{ marginBottom: 12 }}>
                            <BranchesOutlined style={{ marginRight: 8 }} />
                      轨迹信息
                    </Typography.Title>
                    <Empty description="暂无轨迹记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>
    </Space>
  );
};

export default ProviderTasksPage;


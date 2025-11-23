import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Drawer,
  Modal,
  Radio,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  AudioOutlined,
  CameraOutlined,
  GlobalOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import AlertTicker from '../../components/AlertTicker';
import VideoCard from '../../components/VideoCard';
import { alerts } from '../../mock/alerts';
import { operators } from '../../mock/operators';
import { tasks } from '../../mock/tasks';
import type { Operator } from '../../types';
import { formatTime } from '../../utils/time';
import mapPlaceholder from '../../assets/react.svg';

import styles from './index.module.css';

type ViewMode = 'card' | 'map';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const taskStats = useMemo(() => {
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const alerting = tasks.filter((task) => task.status === 'alert').length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return { inProgress, alerting, completed };
  }, []);

  const handleCardClick = (operator: Operator) => {
    setSelectedOperator(operator);
  };

  const handleScreenshot = () => {
    message.success('截图已保存');
    // 实际实现：调用视频截图API
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      message.success('录屏已停止并保存');
    } else {
      setIsRecording(true);
      message.success('开始录屏');
    }
    // 实际实现：调用视频录屏API
  };

  return (
    <Space direction="vertical" size={16} className={styles.container}>
      <AlertTicker data={alerts} />
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <RadarChartOutlined />
                <span>正在作业（{operators.length}）</span>
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="default"
                  icon={<HistoryOutlined />}
                  onClick={() => navigate('/history')}
                >
                  历史回看
                </Button>
                <Radio.Group
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="card">
                    <AppstoreOutlined /> 卡片视图
                  </Radio.Button>
                  <Radio.Button value="map">
                    <GlobalOutlined /> 地图视图
                  </Radio.Button>
                </Radio.Group>
              </Space>
            }
            bordered={false}
            className={styles.card}
          >
            {viewMode === 'card' ? (
              <Row gutter={[16, 16]}>
                {operators.map((operator) => (
                  <Col xs={24} sm={12} lg={8} key={operator.id}>
                    <div onClick={() => handleCardClick(operator)} style={{ cursor: 'pointer' }}>
                      <VideoCard operator={operator} />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className={styles.mapContainer}>
                <div className={styles.mapPlaceholder}>
                  <img src={mapPlaceholder} alt="map" />
                  <div className={styles.mapMarkers}>
                    {operators.map((operator) => (
                      <div
                        key={operator.id}
                        className={`${styles.mapMarker} ${styles[`marker-${operator.status}`]}`}
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${30 + Math.random() * 40}%`,
                        }}
                        onClick={() => handleCardClick(operator)}
                        title={operator.name}
                      >
                        <div className={styles.markerDot} />
                        <div className={styles.markerLabel}>{operator.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Space wrap style={{ marginTop: 16 }}>
                  <Tag color="green">作业中</Tag>
                  <Tag color="orange">暂停中</Tag>
                  <Tag color="red">告警中</Tag>
                </Space>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card bordered={false} className={styles.card}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="作业中" value={taskStats.inProgress} suffix="条" />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="告警中"
                    value={taskStats.alerting}
                    suffix="条"
                    valueStyle={{ color: '#f87171' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="今日完成"
                    value={taskStats.completed}
                    suffix="条"
                    valueStyle={{ color: '#22c55e' }}
                  />
                </Col>
              </Row>
              <div className={styles.statFooter}>演示数据，每 5 秒自动轮播告警。</div>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* 详情抽屉 */}
      <Drawer
        open={!!selectedOperator}
        title={
          selectedOperator ? (
            <Space>
              <Tag color={selectedOperator.status === 'working' ? 'green' : selectedOperator.status === 'alert' ? 'red' : 'orange'}>
                {selectedOperator.status === 'working' ? '作业中' : selectedOperator.status === 'alert' ? '告警中' : '暂停中'}
              </Tag>
              <span>{selectedOperator.name}</span>
            </Space>
          ) : null
        }
        width={1200}
        onClose={() => setSelectedOperator(null)}
        extra={
          selectedOperator && (
            <Space>
              <Button
                type="primary"
                icon={<AudioOutlined />}
                onClick={() => {
                  Modal.info({
                    title: '语音对讲',
                    content: `正在连接：${selectedOperator.name}`,
                    okText: '结束对讲',
                  });
                }}
              >
                语音对讲
              </Button>
              <Button icon={<CameraOutlined />} onClick={handleScreenshot}>
                截屏
              </Button>
              <Button
                type={isRecording ? 'primary' : 'default'}
                danger={isRecording}
                icon={<PlayCircleOutlined />}
                onClick={handleRecord}
              >
                {isRecording ? '停止录屏' : '开始录屏'}
              </Button>
            </Space>
          )
        }
      >
        {selectedOperator && (
          <Row gutter={16}>
            <Col span={16}>
              <Card title="实时视频" bordered={false} className={styles.videoCard}>
                <div className={styles.videoContainer}>
                  <div className={styles.videoPlaceholder}>
                    <PlayCircleOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                    <Typography.Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                      视频流：{selectedOperator.videoStatus === 'online' ? '在线' : selectedOperator.videoStatus === 'connecting' ? '连接中' : '离线'}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {selectedOperator.deviceId}
                    </Typography.Text>
                  </div>
                </div>
              </Card>
              <Card title="位置信息" bordered={false} style={{ marginTop: 16 }}>
                <div className={styles.mapPlaceholder} style={{ height: 300 }}>
                  <img src={mapPlaceholder} alt="map" />
                  {selectedOperator.location && (
                    <div
                      className={`${styles.mapMarker} ${styles[`marker-${selectedOperator.status}`]}`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className={styles.markerDot} />
                      <div className={styles.markerLabel}>{selectedOperator.name}</div>
                    </div>
                  )}
                </div>
                {selectedOperator.location && (
                  <Space style={{ marginTop: 16 }}>
                    <Typography.Text>
                      经度：{selectedOperator.location.lng.toFixed(6)}
                    </Typography.Text>
                    <Typography.Text>
                      纬度：{selectedOperator.location.lat.toFixed(6)}
                    </Typography.Text>
                  </Space>
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="打卡信息" bordered={false}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <Typography.Text type="secondary">检测人员</Typography.Text>
                    <Typography.Title level={5} style={{ marginTop: 4 }}>
                      {selectedOperator.name}
                    </Typography.Title>
                  </div>
                  {selectedOperator.company && (
                    <div>
                      <Typography.Text type="secondary">所属单位</Typography.Text>
                      <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                        {selectedOperator.company}
                      </Typography.Paragraph>
                    </div>
                  )}
                  <div>
                    <Typography.Text type="secondary">项目包</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedOperator.projectPackage}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">定检路线</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedOperator.route}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">定检路段</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedOperator.segment}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">打卡时间</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {formatTime(selectedOperator.lastCheckinTime)}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">设备编号</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                      {selectedOperator.deviceId}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">视频状态</Typography.Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag
                        color={
                          selectedOperator.videoStatus === 'online'
                            ? 'green'
                            : selectedOperator.videoStatus === 'connecting'
                            ? 'orange'
                            : 'red'
                        }
                      >
                        {selectedOperator.videoStatus === 'online'
                          ? '视频在线'
                          : selectedOperator.videoStatus === 'connecting'
                          ? '连接中'
                          : '视频离线'}
                      </Tag>
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

export default DashboardPage;

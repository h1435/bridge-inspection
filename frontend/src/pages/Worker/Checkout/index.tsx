import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Steps, Modal, message } from 'antd';
import { CheckCircleOutlined, VideoCameraOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatTime } from '../../../utils/time';
import type { WorkerTask, CurrentWork } from '../../../types';

import styles from './index.module.css';

const { Step } = Steps;

const WorkerCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { task, workInfo } = (location.state as {
    task?: WorkerTask;
    workInfo?: CurrentWork;
  }) || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (!task || !workInfo) {
      navigate('/worker/home');
    }
  }, [task, workInfo, navigate]);

  const handleCheckout = () => {
    // 模拟收工打卡流程
    setCurrentStep(1);
    // 模拟提交数据
    setTimeout(() => {
      setCurrentStep(2);
      setCheckoutSuccess(true);
      // 收工成功后，提示关闭录像
      setTimeout(() => {
        setShowVideoModal(true);
      }, 500);
    }, 1000);
  };

  const handleConfirmVideo = () => {
    setShowVideoModal(false);
    message.success('收工打卡成功！请在执法记录仪上关闭录像功能');
    // 返回任务列表
    setTimeout(() => {
      navigate('/worker/tasks');
    }, 1500);
  };

  if (!task || !workInfo) {
    return null;
  }

  const duration = Math.floor((new Date().getTime() - new Date(workInfo.checkinTime).getTime()) / 60000);

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          收工打卡
        </Typography.Title>
        <Typography.Text type="secondary">
          确认作业完成并提交结果
        </Typography.Text>
      </Card>

      <Card className={styles.summaryCard}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Text type="secondary">项目包</Typography.Text>
            <Typography.Title level={5} style={{ marginTop: 4 }}>
              {workInfo.projectPackage}
            </Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">定检路线</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {workInfo.route}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">定检路段</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {workInfo.segment}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">开工时间</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {formatTime(workInfo.checkinTime)}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">作业时长</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {duration} 分钟
            </Typography.Paragraph>
          </div>
        </Space>
      </Card>

      <Card className={styles.stepsCard}>
        <Steps current={currentStep} direction="vertical" size="small">
          <Step
            title="确认作业信息"
            description="请核对作业信息是否正确"
            icon={currentStep > 0 ? <CheckCircleOutlined /> : null}
          />
          <Step
            title="提交作业数据"
            description="正在提交作业数据..."
            icon={currentStep > 1 ? <CheckCircleOutlined /> : null}
          />
          <Step
            title="完成收工"
            description={checkoutSuccess ? '收工成功！' : '等待收工...'}
            icon={checkoutSuccess ? <CheckCircleOutlined /> : null}
          />
        </Steps>
      </Card>

      <div className={styles.actionBar}>
        <Button
          type="default"
          block
          onClick={() => navigate('/worker/working', { state: { task, workInfo } })}
          style={{ marginBottom: 12 }}
        >
          返回
        </Button>
        <Button
          type="primary"
          block
          size="large"
          onClick={handleCheckout}
          disabled={checkoutSuccess}
          loading={currentStep > 0 && !checkoutSuccess}
          icon={checkoutSuccess ? <CheckCircleOutlined /> : <StopOutlined />}
        >
          {checkoutSuccess ? '收工成功' : '确认收工'}
        </Button>
      </div>

      {/* 提示关闭录像的弹窗 */}
      <Modal
        open={showVideoModal}
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#ff4d4f' }} />
            <span>请关闭录像设备</span>
          </Space>
        }
        onOk={handleConfirmVideo}
        onCancel={() => setShowVideoModal(false)}
        okText="已关闭录像"
        cancelText="稍后关闭"
        closable={false}
        maskClosable={false}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Paragraph>
            收工打卡成功！请在您的执法记录仪设备上手动关闭录像功能。
          </Typography.Paragraph>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            提示：关闭录像后，系统将停止视频回传和定位上报。
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  );
};

export default WorkerCheckoutPage;


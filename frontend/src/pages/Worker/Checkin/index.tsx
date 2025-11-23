import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Steps, Modal, message } from 'antd';
import { CheckCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { WorkerTask } from '../../../types';

import styles from './index.module.css';

const { Step } = Steps;

const WorkerCheckinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = (location.state as { task?: WorkerTask })?.task;

  const [currentStep, setCurrentStep] = useState(0);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (!task) {
      // 如果没有任务信息，返回创建任务页
      navigate('/worker/create');
    }
  }, [task, navigate]);

  const handleCheckin = () => {
    // 模拟打卡流程
    setCurrentStep(1);
    // 模拟定位获取
    setTimeout(() => {
      setCurrentStep(2);
      setCheckinSuccess(true);
      // 打卡成功后，提示开启录像
      setTimeout(() => {
        setShowVideoModal(true);
      }, 500);
    }, 1000);
  };

  const handleConfirmVideo = () => {
    setShowVideoModal(false);
    message.success('打卡成功！请在执法记录仪上开启录像功能');
    // 跳转到作业中页面
    setTimeout(() => {
      navigate('/worker/working', { state: { task } });
    }, 1500);
  };

  if (!task) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          开工打卡
        </Typography.Title>
        <Typography.Text type="secondary">
          确认任务信息并完成打卡
        </Typography.Text>
      </Card>

      <Card className={styles.taskInfoCard}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Text type="secondary">项目包</Typography.Text>
            <Typography.Title level={5} style={{ marginTop: 4 }}>
              {task.projectPackage}
            </Typography.Title>
          </div>
          <div>
            <Typography.Text type="secondary">定检路线</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {task.route}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">定检路段</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
              {task.segment}
            </Typography.Paragraph>
          </div>
          {task.description && (
            <div>
              <Typography.Text type="secondary">作业说明</Typography.Text>
              <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                {task.description}
              </Typography.Paragraph>
            </div>
          )}
        </Space>
      </Card>

      <Card className={styles.stepsCard}>
        <Steps current={currentStep} direction="vertical" size="small">
          <Step
            title="确认任务信息"
            description="请核对任务信息是否正确"
            icon={currentStep > 0 ? <CheckCircleOutlined /> : null}
          />
          <Step
            title="获取定位"
            description="正在获取当前位置..."
            icon={currentStep > 1 ? <CheckCircleOutlined /> : null}
          />
          <Step
            title="完成打卡"
            description={checkinSuccess ? '打卡成功！' : '等待打卡...'}
            icon={checkinSuccess ? <CheckCircleOutlined /> : null}
          />
        </Steps>
      </Card>

      <div className={styles.actionBar}>
        <Button
          type="default"
          block
          onClick={() => navigate('/worker/create')}
          style={{ marginBottom: 12 }}
        >
          返回
        </Button>
        <Button
          type="primary"
          block
          size="large"
          onClick={handleCheckin}
          disabled={checkinSuccess}
          loading={currentStep > 0 && !checkinSuccess}
        >
          {checkinSuccess ? '打卡成功' : '确认打卡'}
        </Button>
      </div>

      {/* 提示开启录像的弹窗 */}
      <Modal
        open={showVideoModal}
        title={
          <Space>
            <VideoCameraOutlined style={{ color: '#1890ff' }} />
            <span>请开启录像设备</span>
          </Space>
        }
        onOk={handleConfirmVideo}
        onCancel={() => setShowVideoModal(false)}
        okText="已开启录像"
        cancelText="稍后开启"
        closable={false}
        maskClosable={false}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Paragraph>
            打卡成功！请在您的执法记录仪设备上手动开启录像功能。
          </Typography.Paragraph>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            提示：如果设备支持自动推流，系统将自动开启录像；否则请手动开启。
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  );
};

export default WorkerCheckinPage;


import { useState } from 'react';
import { Card, Button, Space, Typography, Steps, Modal, message, Form, Select } from 'antd';
import { CheckCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { plans } from '../../../mock/plans';
import type { ProjectPlan } from '../../../types';

import styles from './index.module.css';

const { Step } = Steps;

interface CheckinForm {
  projectPackage: string;
  route: string;
  segment: string;
}

const WorkerCreatePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckinForm>();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  // 获取所有项目包（去重）
  const projectPackages = Array.from(new Set(plans.map((p) => p.projectPackage)));

  // 根据项目包和路线获取路段
  const getSegmentsByRoute = (projectPackage: string, route: string) => {
    const plan = plans.find((p) => p.projectPackage === projectPackage && p.route === route);
    return plan ? plan.segments : [];
  };

  const handlePackageChange = (value: string) => {
    const plan = plans.find((p) => p.projectPackage === value);
    setSelectedPlan(plan || null);
    setSelectedRoute('');
    form.setFieldsValue({ route: undefined, segment: undefined });
  };

  const handleRouteChange = (value: string) => {
    setSelectedRoute(value);
    form.setFieldsValue({ segment: undefined });
  };

  const handleCheckin = async () => {
    try {
      const values = await form.validateFields();
      if (!values.projectPackage || !values.route || !values.segment) {
        message.error('请完整选择项目包、路线和路段');
        return;
      }

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
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleConfirmVideo = () => {
    const values = form.getFieldsValue();
    setShowVideoModal(false);
    message.success('打卡成功！请在执法记录仪上开启录像功能');
    
    // 创建任务对象
    const task = {
      id: `task-${Date.now()}`,
      projectPackage: values.projectPackage,
      route: values.route,
      segment: values.segment,
      status: 'in-progress' as const,
    };

    // 跳转到作业中页面
    setTimeout(() => {
      navigate('/worker/working', { state: { task } });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Typography.Title level={4} style={{ marginBottom: 8 }}>
          创建新任务
        </Typography.Title>
        <Typography.Text type="secondary">
          选择项目包、路线和路段开始定检作业
        </Typography.Text>
      </Card>

      <Card className={styles.formCard}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="项目包"
            name="projectPackage"
            rules={[{ required: true, message: '请选择项目包' }]}
          >
            <Select
              placeholder="请选择项目包"
              onChange={handlePackageChange}
              allowClear
            >
              {projectPackages.map((pkg) => (
                <Select.Option key={pkg} value={pkg}>
                  {pkg}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="定检路线"
            name="route"
            rules={[{ required: true, message: '请选择定检路线' }]}
          >
            <Select
              placeholder="请先选择项目包"
              onChange={handleRouteChange}
              disabled={!selectedPlan}
              allowClear
            >
              {selectedPlan && (
                <Select.Option key={selectedPlan.route} value={selectedPlan.route}>
                  {selectedPlan.route}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="定检路段"
            name="segment"
            rules={[{ required: true, message: '请选择定检路段' }]}
          >
            <Select
              placeholder="请先选择路线"
              disabled={!selectedRoute}
              allowClear
            >
              {selectedRoute &&
                getSegmentsByRoute(form.getFieldValue('projectPackage'), selectedRoute).map(
                  (segment) => (
                    <Select.Option key={segment} value={segment}>
                      {segment}
                    </Select.Option>
                  ),
                )}
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card className={styles.stepsCard}>
        <Steps current={currentStep} direction="vertical" size="small">
          <Step
            title="选择任务信息"
            description="请选择项目包、路线和路段"
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
          onClick={() => navigate('/worker/home')}
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

export default WorkerCreatePage;

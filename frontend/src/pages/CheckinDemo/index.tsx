import { useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Result, Space, Steps, Typography } from 'antd';

import ProjectSelector from '../../components/ProjectSelector';
import { projectTree } from '../../mock/projects';
import type { CheckinResult } from '../../types';

const { Step } = Steps;

const CheckinDemoPage = () => {
  const [form] = Form.useForm<{ project: string[] }>();
  const [result, setResult] = useState<CheckinResult | null>(null);

  const steps = useMemo(
    () => [
      { title: '选择项目包/路线/路段', description: '从主管单位下发的清单中选择' },
      { title: '开工打卡', description: '系统尝试自动开启视频和定位上传' },
      { title: '作业执行', description: '实时视频 + 语音对讲 + 异常告警' },
    ],
    [],
  );

  const handleSubmit = () => {
    const project = form.getFieldValue('project');
    if (!project || project.length !== 3) {
      return;
    }
    const success = Math.random() > 0.2; // 模拟 80% 自动推流成功
    setResult({
      success,
      message: success
        ? '设备已自动开启音视频回传，监管端已同步显示。'
        : '设备未响应自动推流指令，请在执法记录仪上手动开启视频。',
      videoStatus: success ? 'online' : 'connecting',
    });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="定检人员打卡流程演示" bordered={false}>
        <Steps current={result ? 2 : 1} responsive>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} description={item.description} />
          ))}
        </Steps>
      </Card>
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="选择项目包 / 路线 / 路段"
            name="project"
            rules={[{ required: true, message: '请选择项目包、路线、路段' }]}
          >
            <ProjectSelector options={projectTree} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              打卡并尝试自动开启视频
            </Button>
          </Form.Item>
        </Form>
        {result ? (
          <Result
            status={result.success ? 'success' : 'warning'}
            title={result.success ? '打卡成功，视频已接入。' : '打卡成功，但视频需要人工开启。'}
            subTitle={result.message}
            extra={<Button onClick={() => setResult(null)}>重新演示</Button>}
          />
        ) : (
          <Alert
            message="说明"
            description="演示场景：定检人员现场打卡后，系统会尝试通过执法记录仪自动推流；若设备不支持，则提示人工开启，同时大屏收到告警。"
            type="info"
            showIcon
          />
        )}
      </Card>
      <Card bordered={false}>
        <Typography.Title level={5}>演示提示</Typography.Title>
        <Typography.Paragraph>
          - 此页面用于模拟“小程序打卡”关键体验，真实环境下将通过微信小程序调用硬件能力。
        </Typography.Paragraph>
        <Typography.Paragraph>
          - 大屏页面会展示“正在作业”人员及视频画面，点击可以发起语音对讲。
        </Typography.Paragraph>
      </Card>
    </Space>
  );
};

export default CheckinDemoPage;

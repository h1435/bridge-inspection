import { useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Drawer, Form, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from '../../utils/dayjs';

import { plans } from '../../mock/plans';
import type { ProjectPlan } from '../../types';

import styles from './index.module.css';

const { RangePicker } = DatePicker;

const statusMap: Record<ProjectPlan['status'], { label: string; color: string }> = {
  active: { label: '执行中', color: 'success' },
  draft: { label: '草稿', color: 'default' },
  adjusting: { label: '调整中', color: 'warning' },
};

const columns: ColumnsType<ProjectPlan> = [
  { title: '项目包', dataIndex: 'projectPackage' },
  { title: '定检路线', dataIndex: 'route' },
  {
    title: '定检路段',
    dataIndex: 'segments',
    render: (segments: string[]) => (
      <Space size={[4, 4]} wrap>
        {segments.map((segment) => (
          <Tag key={segment} color="blue">
            {segment}
          </Tag>
        ))}
      </Space>
    ),
  },
  { title: '行政区划', dataIndex: 'district' },
  { title: '定检单位', dataIndex: 'inspectionUnit' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value: ProjectPlan['status']) => (
      <Tag color={statusMap[value].color}>{statusMap[value].label}</Tag>
    ),
  },
  {
    title: '定检周期',
    dataIndex: 'inspectionCycle',
  },
];

interface FilterForm {
  dateRange?: [Dayjs, Dayjs];
  projectPackage?: string;
  district?: string;
  inspectionUnit?: string;
}

const ProjectsPage = () => {
  const [form] = Form.useForm<FilterForm>();
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null);
  const [filterValues, setFilterValues] = useState<FilterForm>({});

  // 获取所有可选项（用于下拉框）
  const projectPackages = useMemo(() => Array.from(new Set(plans.map((p) => p.projectPackage))), []);
  const districts = useMemo(() => Array.from(new Set(plans.map((p) => p.district))), []);
  const inspectionUnits = useMemo(() => Array.from(new Set(plans.map((p) => p.inspectionUnit))), []);

  // 筛选逻辑
  const dataSource = useMemo(() => {
    let filtered = [...plans];

    // 时间范围筛选（按定检周期筛选）
    if (filterValues.dateRange) {
      const [start, end] = filterValues.dateRange;
      filtered = filtered.filter((plan) => {
        // 解析定检周期：格式为 "YYYY-MM-DD 至 YYYY-MM-DD"
        const [cycleStart, cycleEnd] = plan.inspectionCycle.split(' 至 ');
        const cycleStartDate = dayjs(cycleStart);
        const cycleEndDate = dayjs(cycleEnd);
        const startDate = start.startOf('day');
        const endDate = end.endOf('day');
        // 判断定检周期是否与筛选时间范围有交集
        return (cycleStartDate.isBefore(endDate) || cycleStartDate.isSame(endDate)) && 
               (cycleEndDate.isAfter(startDate) || cycleEndDate.isSame(startDate));
      });
    }

    // 项目包筛选
    if (filterValues.projectPackage) {
      filtered = filtered.filter((plan) => plan.projectPackage === filterValues.projectPackage);
    }

    // 行政区划筛选
    if (filterValues.district) {
      filtered = filtered.filter((plan) => plan.district === filterValues.district);
    }

    // 定检单位筛选
    if (filterValues.inspectionUnit) {
      filtered = filtered.filter((plan) => plan.inspectionUnit === filterValues.inspectionUnit);
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

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <Typography.Title level={4} style={{ marginBottom: 0 }}>
          定检计划查询
        </Typography.Title>
        <Typography.Text type="secondary">
          数据由 CBMS 计划模块维护，此处仅提供查询与详情查看功能。
        </Typography.Text>
      </Card>
      <Card bordered={false} title="筛选条件">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 8]}>
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label="时间范围" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={5}>
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
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label="行政区划" name="district">
                <Select placeholder="请选择行政区划" allowClear style={{ width: '100%' }}>
                  {districts.map((district) => (
                    <Select.Option key={district} value={district}>
                      {district}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label="定检单位" name="inspectionUnit">
                <Select placeholder="请选择定检单位" allowClear style={{ width: '100%' }}>
                  {inspectionUnits.map((unit) => (
                    <Select.Option key={unit} value={unit}>
                      {unit}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Form.Item label=" " colon={false} className={styles.buttonItem}>
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
          columns={[
            ...columns,
            {
              title: '操作',
              key: 'action',
              render: (_, record) => (
                <Button type="link" onClick={() => setSelectedPlan(record)}>
                  查看详情
                </Button>
              ),
            },
          ]}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
        />
      </Card>
      <Drawer
        open={!!selectedPlan}
        title="定检计划详情"
        width={420}
        onClose={() => setSelectedPlan(null)}
      >
        {selectedPlan && (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Typography.Title level={5}>{selectedPlan.projectPackage}</Typography.Title>
            <Typography.Paragraph>
              <Typography.Text strong>定检路线：</Typography.Text> {selectedPlan.route}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>定检路段：</Typography.Text>
              <Space direction="vertical" size={4}>
                {selectedPlan.segments.map((segment) => (
                  <Tag key={segment} color="blue">
                    {segment}
                  </Tag>
                ))}
              </Space>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>状态：</Typography.Text>
              <Tag color={statusMap[selectedPlan.status].color}>{statusMap[selectedPlan.status].label}</Tag>
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>定检周期：</Typography.Text> {selectedPlan.inspectionCycle}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>行政区划：</Typography.Text> {selectedPlan.district}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>定检单位：</Typography.Text> {selectedPlan.inspectionUnit}
            </Typography.Paragraph>
            {selectedPlan.description && (
              <Typography.Paragraph>
                <Typography.Text strong>备注说明：</Typography.Text>
                <Typography.Text type="secondary"> {selectedPlan.description}</Typography.Text>
              </Typography.Paragraph>
            )}
          </Space>
        )}
      </Drawer>
    </Space>
  );
};

export default ProjectsPage;

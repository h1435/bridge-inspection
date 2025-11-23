import dayjs from '../utils/dayjs';
import type { WorkerTask, CurrentWork, WorkerHistoryTask } from '../types';

// 待领取的任务列表（用于创建新任务时选择）
export const pendingTasks: WorkerTask[] = [
  {
    id: 'wt-001',
    projectPackage: '浦东新区主干桥梁定检',
    route: '外环高架东段',
    segment: '沪南路-周浦立交',
    status: 'pending',
    scheduledTime: dayjs().add(1, 'hour').toISOString(),
    description: '检查桥梁外观、伸缩缝、支座状况',
  },
  {
    id: 'wt-002',
    projectPackage: '黄浦区重点桥梁夜检',
    route: '中山南路沿线',
    segment: '南浦大桥-打浦路隧道',
    status: 'pending',
    scheduledTime: dayjs().add(2, 'hour').toISOString(),
    description: '夜间检查照明、疏导设施及桥面附属设施',
  },
  {
    id: 'wt-003',
    projectPackage: '嘉定区城区定检',
    route: '嘉罗公路北段',
    segment: '南翔立交-老嘉罗公路',
    status: 'pending',
    scheduledTime: dayjs().add(3, 'day').toISOString(),
    description: '日常定检，重点关注桥面平整度',
  },
  {
    id: 'wt-004',
    projectPackage: '静安区桥梁专项检查',
    route: '南北高架',
    segment: '共和新路-天目西路',
    status: 'pending',
    scheduledTime: dayjs().add(5, 'day').toISOString(),
    description: '专项检查，重点关注结构安全',
  },
];

// 当前进行中的任务（如果有）
export const currentTask: CurrentWork | null = {
  taskId: 'wt-001',
  projectPackage: '浦东新区主干桥梁定检',
  route: '外环高架东段',
  segment: '沪南路-周浦立交',
  checkinTime: dayjs().subtract(45, 'minute').toISOString(),
  videoStatus: 'on',
  location: {
    lat: 31.2304 + 0.01,
    lng: 121.4737 + 0.02,
  },
  duration: 45,
};

// 历史任务列表
export const historyTasks: WorkerHistoryTask[] = [
  {
    id: 'hist-001',
    projectPackage: '黄浦区重点桥梁夜检',
    route: '中山南路沿线',
    segment: '南浦大桥-打浦路隧道',
    checkinTime: dayjs().subtract(2, 'day').subtract(8, 'hour').toISOString(),
    checkoutTime: dayjs().subtract(2, 'day').subtract(6, 'hour').toISOString(),
    duration: 120,
    status: 'completed',
    videoRecorded: true,
    trajectoryRecorded: true,
    description: '夜间检查照明、疏导设施及桥面附属设施',
  },
  {
    id: 'hist-002',
    projectPackage: '嘉定区城区定检',
    route: '嘉罗公路北段',
    segment: '南翔立交-老嘉罗公路',
    checkinTime: dayjs().subtract(5, 'day').subtract(9, 'hour').toISOString(),
    checkoutTime: dayjs().subtract(5, 'day').subtract(7, 'hour').toISOString(),
    duration: 90,
    status: 'completed',
    videoRecorded: true,
    trajectoryRecorded: true,
    description: '日常定检，重点关注桥面平整度',
  },
  {
    id: 'hist-003',
    projectPackage: '静安区桥梁专项检查',
    route: '南北高架',
    segment: '共和新路-天目西路',
    checkinTime: dayjs().subtract(7, 'day').subtract(10, 'hour').toISOString(),
    checkoutTime: dayjs().subtract(7, 'day').subtract(8, 'hour').toISOString(),
    duration: 120,
    status: 'abnormal',
    videoRecorded: true,
    trajectoryRecorded: false,
    description: '专项检查，发现异常情况',
  },
];

import dayjs from '../utils/dayjs';
import type { TaskItem } from '../types';

export const tasks: TaskItem[] = [
  {
    id: 'task-01',
    projectPackage: '浦东新区主干桥梁定检',
    route: '外环高架东段',
    segment: '沪南路-周浦立交',
    status: 'in-progress',
    startTime: dayjs().subtract(45, 'minute').toISOString(),
    alerts: 0,
    operatorName: '刘强',
    checkinTime: dayjs().subtract(45, 'minute').toISOString(),
    duration: 45,
    videoRecords: [
      {
        id: 'video-01',
        startTime: dayjs().subtract(45, 'minute').toISOString(),
        endTime: dayjs().toISOString(),
        duration: 45,
      },
    ],
    photos: [
      {
        id: 'photo-01',
        url: 'https://via.placeholder.com/300x200?text=现场照片1',
        time: dayjs().subtract(30, 'minute').toISOString(),
        description: '桥梁外观检查',
      },
      {
        id: 'photo-02',
        url: 'https://via.placeholder.com/300x200?text=现场照片2',
        time: dayjs().subtract(15, 'minute').toISOString(),
        description: '桥面状况',
      },
    ],
    trajectory: {
      recorded: true,
      points: 270,
      distance: 2.3,
    },
  },
  {
    id: 'task-02',
    projectPackage: '黄浦区重点桥梁夜检',
    route: '中山南路沿线',
    segment: '南浦大桥-打浦路隧道',
    status: 'alert',
    startTime: dayjs().subtract(25, 'minute').toISOString(),
    alerts: 2,
    operatorName: '王敏',
    checkinTime: dayjs().subtract(25, 'minute').toISOString(),
    duration: 25,
    videoRecords: [
      {
        id: 'video-02',
        startTime: dayjs().subtract(25, 'minute').toISOString(),
        endTime: dayjs().toISOString(),
        duration: 25,
      },
    ],
    photos: [
      {
        id: 'photo-03',
        url: 'https://via.placeholder.com/300x200?text=现场照片3',
        time: dayjs().subtract(20, 'minute').toISOString(),
        description: '夜间检查',
      },
    ],
    trajectory: {
      recorded: true,
      points: 150,
      distance: 1.5,
    },
  },
  {
    id: 'task-03',
    projectPackage: '嘉定区城区定检',
    route: '嘉罗公路北段',
    segment: '南翔立交-老嘉罗公路',
    status: 'pending',
    startTime: dayjs().add(2, 'hour').toISOString(),
    alerts: 0,
  },
  {
    id: 'task-04',
    projectPackage: '徐汇区日常定检',
    route: '龙华中路',
    segment: '宛平南路-老沪闵路',
    status: 'completed',
    startTime: dayjs().subtract(1, 'day').add(2, 'hour').toISOString(),
    alerts: 1,
    operatorName: '陈明',
    checkinTime: dayjs().subtract(1, 'day').add(2, 'hour').toISOString(),
    checkoutTime: dayjs().subtract(1, 'day').add(4, 'hour').toISOString(),
    duration: 120,
    videoRecords: [
      {
        id: 'video-04-1',
        startTime: dayjs().subtract(1, 'day').add(2, 'hour').toISOString(),
        endTime: dayjs().subtract(1, 'day').add(3, 'hour').toISOString(),
        duration: 60,
      },
      {
        id: 'video-04-2',
        startTime: dayjs().subtract(1, 'day').add(3, 'hour').toISOString(),
        endTime: dayjs().subtract(1, 'day').add(4, 'hour').toISOString(),
        duration: 60,
      },
    ],
    photos: [
      {
        id: 'photo-04',
        url: 'https://via.placeholder.com/300x200?text=现场照片4',
        time: dayjs().subtract(1, 'day').add(2, 'hour').add(30, 'minute').toISOString(),
        description: '桥梁结构检查',
      },
      {
        id: 'photo-05',
        url: 'https://via.placeholder.com/300x200?text=现场照片5',
        time: dayjs().subtract(1, 'day').add(3, 'hour').toISOString(),
        description: '桥墩检查',
      },
      {
        id: 'photo-06',
        url: 'https://via.placeholder.com/300x200?text=现场照片6',
        time: dayjs().subtract(1, 'day').add(3, 'hour').add(30, 'minute').toISOString(),
        description: '护栏检查',
      },
    ],
    trajectory: {
      recorded: true,
      points: 720,
      distance: 5.8,
    },
  },
];

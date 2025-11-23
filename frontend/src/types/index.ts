export type VideoStatus = 'online' | 'offline' | 'connecting';

export interface Operator {
  id: string;
  name: string;
  avatar?: string;
  projectPackage: string;
  route: string;
  segment: string;
  status: 'working' | 'paused' | 'alert';
  lastCheckinTime: string;
  deviceId: string;
  videoStatus: VideoStatus;
  company?: string; // 所属公司/单位
  // 位置信息
  location?: {
    lat: number; // 纬度
    lng: number; // 经度
  };
}

// 历史作业记录
export interface HistoryRecord {
  id: string;
  operatorId: string;
  operatorName: string;
  company: string;
  projectPackage: string;
  route: string;
  segment: string;
  checkinTime: string; // 打卡时间
  checkoutTime?: string; // 收工时间
  duration?: number; // 作业时长（分钟）
  status: 'completed' | 'abnormal' | 'interrupted'; // 完成、异常、中断
  videoRecorded: boolean; // 是否有视频记录
  trajectoryRecorded: boolean; // 是否有轨迹记录
  alerts: number; // 告警次数
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Device {
  id: string;
  sn: string;
  brand: string; // 设备品牌
  model: string; // 设备型号
  status: 'online' | 'offline' | 'maintenance';
  battery: number;
  signal: number;
  boundOperator?: string;
  lastActive: string;
}

// 检测人员（执行单位管理员视角）
export interface Personnel {
  id: string;
  name: string;
  phone: string;
  idCard?: string;
  certificate?: string; // 证书编号
  boundDeviceId?: string; // 绑定的设备ID
  boundDeviceSn?: string; // 绑定的设备SN
  status: 'active' | 'inactive'; // 启用、停用
  createdAt: string; // 创建时间
}

export interface TaskItem {
  id: string;
  projectPackage: string;
  route: string;
  segment: string;
  status: 'in-progress' | 'pending' | 'completed' | 'alert';
  startTime: string;
  alerts: number;
  // 作业数据
  operatorName?: string; // 检测人员
  checkinTime?: string; // 打卡时间
  checkoutTime?: string; // 收工时间
  duration?: number; // 作业时长（分钟）
  videoRecords?: Array<{
    id: string;
    startTime: string;
    endTime: string;
    duration: number; // 分钟
    url?: string; // 视频URL
  }>;
  photos?: Array<{
    id: string;
    url: string;
    time: string;
    description?: string;
  }>;
  trajectory?: {
    recorded: boolean;
    points?: number; // 轨迹点数量
    distance?: number; // 总里程（公里）
  };
}

export interface AlertItem {
  id: string;
  type: '视频中断' | '长时间静止' | '轨迹偏离' | '设备离线';
  level: 'info' | 'warning' | 'critical';
  message: string;
  time: string;
}

export interface ProjectNode {
  label: string;
  value: string;
  children?: ProjectNode[];
}

export interface CheckinResult {
  success: boolean;
  message: string;
  videoStatus: VideoStatus;
}

export type PlanStatus = 'active' | 'draft' | 'adjusting';

export interface ProjectPlan {
  id: string;
  projectPackage: string;
  route: string;
  segments: string[];
  status: PlanStatus;
  inspectionCycle: string; // 定检周期，格式：YYYY-MM-DD 至 YYYY-MM-DD
  description?: string;
  // 筛选字段
  district: string; // 行政区划
  roadType: string; // 道路类型
  inspectionUnit: string; // 定检单位
}

// 检测人员小程序端相关类型
export interface WorkerTask {
  id: string;
  projectPackage: string;
  route: string;
  segment: string;
  status: 'pending' | 'in-progress' | 'completed'; // 待领取、进行中、已完成
  scheduledTime?: string; // 计划时间
  description?: string;
}

export interface CurrentWork {
  taskId: string;
  projectPackage: string;
  route: string;
  segment: string;
  checkinTime: string; // 开工打卡时间
  videoStatus: 'on' | 'off' | 'connecting'; // 录像状态：已开启、未开启、连接中
  location?: {
    lat: number;
    lng: number;
  };
  duration: number; // 作业时长（分钟）
}

// 历史任务详情
export interface WorkerHistoryTask {
  id: string;
  projectPackage: string;
  route: string;
  segment: string;
  checkinTime: string; // 开工打卡时间
  checkoutTime: string; // 收工打卡时间
  duration: number; // 作业时长（分钟）
  status: 'completed' | 'abnormal' | 'interrupted'; // 完成、异常、中断
  videoRecorded: boolean; // 是否有视频记录
  trajectoryRecorded: boolean; // 是否有轨迹记录
  description?: string; // 作业说明
}

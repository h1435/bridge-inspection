import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProviderLayout from '../components/ProviderLayout';
import WorkerLayout from '../components/WorkerLayout';
import DashboardPage from '../pages/Dashboard';
import TasksPage from '../pages/Tasks';
import DevicesPage from '../pages/Devices';
import CheckinDemoPage from '../pages/CheckinDemo';
import ProjectsPage from '../pages/Projects';
import HistoryPage from '../pages/History';
// 执行单位管理员页面
import ProviderDashboardPage from '../pages/Provider/Dashboard';
import ProviderDevicesPage from '../pages/Provider/Devices';
import ProviderPersonnelPage from '../pages/Provider/Personnel';
import ProviderTasksPage from '../pages/Provider/Tasks';
// 检测人员小程序端页面
import WorkerHomePage from '../pages/Worker/Home';
import WorkerCreatePage from '../pages/Worker/Create';
import WorkerTasksPage from '../pages/Worker/Tasks';
import WorkerCheckinPage from '../pages/Worker/Checkin';
import WorkerWorkingPage from '../pages/Worker/Working';
import WorkerCheckoutPage from '../pages/Worker/Checkout';
import WorkerHistoryDetailPage from '../pages/Worker/HistoryDetail';

const router = createBrowserRouter([
  // 检测人员小程序端路由（优先匹配，避免与其他路由冲突）
  {
    path: '/worker',
    element: <WorkerLayout />,
    children: [
      { index: true, element: <Navigate to="/worker/home" replace /> },
      { path: 'home', element: <WorkerHomePage /> },
      { path: 'create', element: <WorkerCreatePage /> },
      { path: 'tasks', element: <WorkerTasksPage /> },
      { path: 'checkin', element: <WorkerCheckinPage /> },
      { path: 'working', element: <WorkerWorkingPage /> },
      { path: 'checkout', element: <WorkerCheckoutPage /> },
      { path: 'history-detail', element: <WorkerHistoryDetailPage /> },
    ],
  },
  // 执行单位管理员路由
  {
    path: '/provider',
    element: <ProviderLayout />,
    children: [
      { index: true, element: <Navigate to="/provider/dashboard" replace /> },
      { path: 'dashboard', element: <ProviderDashboardPage /> },
      { path: 'devices', element: <ProviderDevicesPage /> },
      { path: 'personnel', element: <ProviderPersonnelPage /> },
      { path: 'tasks', element: <ProviderTasksPage /> },
    ],
  },
  // 主管单位管理员路由
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'devices', element: <DevicesPage /> },
      { path: 'checkin-demo', element: <CheckinDemoPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
  // 404 重定向
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;

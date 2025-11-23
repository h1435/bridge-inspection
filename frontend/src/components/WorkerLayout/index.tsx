import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';

import styles from './index.module.css';

const { Content } = AntLayout;

const WorkerLayout = () => {
  // 移动端布局，简单顶部导航
  // 确保完全独立的布局，不受其他 Layout 影响
  return (
    <div className={styles.wrapper}>
      <AntLayout className={styles.root}>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </div>
  );
};

export default WorkerLayout;


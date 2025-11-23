import type { ProjectNode } from '../types';

export const projectTree: ProjectNode[] = [
  {
    label: '浦东新区主干桥梁定检',
    value: 'pkg-pudong',
    children: [
      {
        label: '外环高架东段',
        value: 'route-waiguang-east',
        children: [
          { label: '沪南路-周浦立交', value: 'segment-hunan-zhoupu' },
          { label: '周浦立交-申江路', value: 'segment-zhoupu-shenjiang' },
        ],
      },
      {
        label: '金桥及周边',
        value: 'route-jinqiao',
        children: [
          { label: '金桥路-锦绣路', value: 'segment-jinqiao-jinxiu' },
        ],
      },
    ],
  },
  {
    label: '黄浦区重点桥梁夜检',
    value: 'pkg-huangpu',
    children: [
      {
        label: '中山南路沿线',
        value: 'route-zhongshan-south',
        children: [
          { label: '南浦大桥-打浦路隧道', value: 'segment-nanpu-dapulu' },
          { label: '打浦路隧道-西藏南路', value: 'segment-dapulu-xizang' },
        ],
      },
    ],
  },
  {
    label: '嘉定区城区定检',
    value: 'pkg-jiading',
    children: [
      {
        label: '嘉罗公路北段',
        value: 'route-jialuo-north',
        children: [
          { label: '南翔立交-老嘉罗公路', value: 'segment-nanxiang-oldjialuo' },
        ],
      },
    ],
  },
];

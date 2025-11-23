import { Cascader } from 'antd';
import type { CascaderProps } from 'antd/es/cascader';
import type { ProjectNode } from '../../types';

interface ProjectSelectorProps {
  value?: string[];
  onChange?: (value: string[], selectedOptions?: ProjectNode[]) => void;
  options: ProjectNode[];
  placeholder?: string;
}

const fieldNames: CascaderProps<ProjectNode>['fieldNames'] = {
  label: 'label',
  value: 'value',
  children: 'children',
};

const ProjectSelector = ({ value, onChange, options, placeholder }: ProjectSelectorProps) => {
  return (
    <Cascader
      fieldNames={fieldNames}
      options={options}
      value={value}
      onChange={(val, selected) => onChange?.(val as string[], selected as ProjectNode[])}
      placeholder={placeholder ?? '请选择项目包 / 路线 / 路段'}
      showSearch
      style={{ width: '100%' }}
    />
  );
};

export default ProjectSelector;

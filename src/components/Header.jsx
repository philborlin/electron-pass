import { Button, Divider, Space } from 'antd';
import { DeleteOutlined, EditOutlined, FolderAddOutlined, PlusOutlined } from '@ant-design/icons';

export function Header() {
  return <>
    <Space size="small">
      <Button type="primary" icon={<PlusOutlined />} />
      <Button type="primary" icon={<FolderAddOutlined />} />
      <Divider type="vertical" />
      <Button type="primary" icon={<EditOutlined />} />
      <Button type="primary" icon={<DeleteOutlined />} />
    </Space>
  </>
}
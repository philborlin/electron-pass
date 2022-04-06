import { useEffect, useState } from 'react'
import { Input, Tree } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import { files, filterFiles, getAllKeys, pass } from '../files/filelist'

export function FileBrowser({ dispatch }) {
  const [treeData, setTreeData] = useState([])
  const [search, setSearch] = useState('')
  const [expandedKeys, setExpandedKeys] = useState([])

  useEffect(() => {
    async function fetchTreeData() {
      const fiteredFiles = filterFiles(search, await files())
      setTreeData(fiteredFiles)
    }

    fetchTreeData()
  }, [search])

  const onSelect = async (keys, e) => {
    try {
      const { stdout } = await pass(e.node.path)
      dispatch({ type: 'pass', value: stdout })
    } catch (e) {
      console.log(e)
    }
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    setExpandedKeys(e.target.valu == '' ? [] : getAllKeys(treeData))
  }

  return (
    <>
      <Input
        style={{ marginBottom: 8 }}
        prefix={<SearchOutlined style={{ color: "gray" }} />}
        placeholder="Search"
        onChange={onSearch}
        allowClear
      />
      <Tree
        treeData={treeData}
        onExpand={(e) => setExpandedKeys(e)}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
        height={380}
      />
    </>
  )
}
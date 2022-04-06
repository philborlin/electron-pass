import { Input, Tree } from 'antd'
import { useEffect, useState } from 'react'

import { files, filterFiles, getAllKeys, pass } from '../files/filelist'

const { Search } = Input

export function FileBrowser() {
  const [treeData, setTreeData] = useState([])
  const [search, setSearch] = useState('')
  const [expandedKeys, setExpandedKeys] = useState(false)

  useEffect(() => {
    async function fetchTreeData() {
      const fiteredFiles = filterFiles(search, await files())
      setTreeData(fiteredFiles)
    }

    fetchTreeData()
  }, [search])

  const onSelect = async (keys, e) => {
    // TODO Add a try/catch block
    // TODO Dispatch the results
    const {stdout} = await pass(e.node.path)
    console.log(stdout)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    setExpandedKeys(e.target.valu == '' ? [] : getAllKeys(treeData))
  }

  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onSearch} />
      <Tree
        treeData={treeData}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
      />
    </>
  )
}
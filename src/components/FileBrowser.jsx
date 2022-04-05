import { Tree } from 'antd'
import { useEffect, useState } from 'react'

import {files} from '../files/filelist'

export function FileBrowser() {
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    async function fetchTreeData() {
      setTreeData(await files())
    }

    fetchTreeData()
  }, [])

  // Onclick dispatch the path so the parent component can call pass and display the data on the right
  return (
    <>
      <Tree treeData={treeData} />
    </>
  )
}
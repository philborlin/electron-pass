import { Tree } from 'antd'
import { useEffect, useState } from 'react'

import { files, pass } from '../files/filelist'

export function FileBrowser() {
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    async function fetchTreeData() {
      setTreeData(await files())
    }

    fetchTreeData()
  }, [])

  const onSelect = async (keys, e) => {
    console.log('keys', keys)
    console.log('e', e)

    const {stdout} = await pass('jobs/vone/quickbooks-to-pay-etienne')
    console.log(stdout)
  }

  // Onclick dispatch the path so the parent component can call pass and display the data on the right
  return (
    <>
      <Tree
        treeData={treeData}
        onSelect={onSelect}
      />
    </>
  )
}
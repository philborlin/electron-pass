import { useReducer } from 'react'
import './App.css'
import 'antd/dist/antd.css'

import { Layout } from 'antd'

import { Content } from './components/Content'
import { FileBrowser } from './components/FileBrowser'
import { Header } from './components/Header'

const { Header: AntHeader, Footer, Sider, Content: AntContent } = Layout

const initialState = { pass: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'pass':
      return { pass: action.value }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Layout>
      <AntHeader><Header /></AntHeader>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider><FileBrowser dispatch={dispatch} /></Sider>
        <AntContent><Content pass={state.pass} /></AntContent>
      </Layout>
      {/* <Footer style={{ position: "sticky", bottom: "0" }}>Footer</Footer> */}
    </Layout>
  )
}

export default App;

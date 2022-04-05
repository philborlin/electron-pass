import './App.css';
import 'antd/dist/antd.css';

import { Layout } from 'antd';

import { FileBrowser } from './components/FileBrowser';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider><FileBrowser /></Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default App;

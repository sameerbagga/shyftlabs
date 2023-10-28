import React, { useState } from 'react';
import { HomeOutlined, UserAddOutlined, UnorderedListOutlined, FileAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import AddStudents from './AddStudents';
import NotFound from './NotFound';
import ListStudents from './ListStudents';
import AddCourses from './AddCourses';
import ListCourses from './ListCourses';
import ListResults from './ListResults';
import AddResults from './AddResults';
const { Content, Sider } = Layout;


function getItem(label, key, icon, url) {
  return {
    key,
    icon,
    url,
    label
  };
}

const items = [
  getItem('Home', "home", <HomeOutlined />, "/"),
  getItem('Add New Students', "addStudents", <UserAddOutlined />, "/addStudents"),
  getItem('Students List', "listStudents", <UnorderedListOutlined />, "/listStudents"),
  getItem('Add New Courses', "addCourses", <FileAddOutlined />, "/addCourses"),
  getItem('Courses List', "listCourses", <UnorderedListOutlined />, "/listCourses"),
  getItem('Add New Results', "addResults", <FolderAddOutlined />, "/addResults"),
  getItem('Results List', "listResults", <UnorderedListOutlined />, "/listResults")
];


const CustomApp = () => {
  const [navPath, setNavPath] = useState("home");

  function getNavKeyFromPath() {
    const path = window.location.pathname.split("/")[1];
    if (path && path !== navPath) setNavPath(path);
    return path;
  }

  const onClick = (e) => {
    setNavPath(e.key);
  };

  const resetNavPath = () => {
    setNavPath("home");
  }

  return (
    <Router>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          theme="light"
        >
          <div className="demo-logo-vertical" />
          <Menu
            onClick={onClick}
            theme='light'
            mode="inline"
            selectedKeys={[getNavKeyFromPath() || navPath]}
            defaultSelectedKeys={["home"]}
          // items={items}
          >
            {items.map(i => {
              return (
                <Menu.Item key={i.key}>
                  <Link to={i.url} className="nav-text">{i.label}</Link>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout>
          <Content>
            <div
              style={{
                padding: 24,
                background: "white",
                height: "100vh"
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/addStudents" element={<AddStudents />} />
                <Route path="/listStudents" element={<ListStudents />} />
                <Route path="/addCourses" element={<AddCourses />} />
                <Route path="/listCourses" element={<ListCourses />} />
                <Route path="/addResults" element={<AddResults />} />
                <Route path="/listResults" element={<ListResults />} />
                <Route path="*" element={<NotFound resetNavPath={resetNavPath} />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default CustomApp;

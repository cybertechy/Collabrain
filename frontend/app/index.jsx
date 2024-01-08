import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './components/index.css';
// import App from './components/App';
// import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar';
import Bar from './components/Bar';
import SideNav from './components/Sidenav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calls from './pages/Calls';
import Messages from './pages/Messages';
import Teams from './pages/Teams';
import Recent from './pages/Recent';
import Shared from './pages/Shared';
import Starred from './pages/Starred';


  function MainContent({ isSidebarOpen }) {
    const mainContentStyle = {
      marginLeft: isSidebarOpen ? '13rem' : '0',
    };

    return (
      <div id="main" style={mainContentStyle}>
        <Navbar/>
        <Bar/>
        {/* <App/> */}
      </div> 
    );
  }

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const sidebarWidth = isSidebarOpen ? '13rem' : '0rem';

  return (
    <Router>
        <SideNav isOpen={isSidebarOpen} onToggle={handleToggle} />
        <MainContent onClick={handleToggle} isSidebarOpen={isSidebarOpen} 
        />
        <Routes> 
          <Route path="/" exact component={Dashboard} />
          <Route path="/shared-with-me" component={Shared} />
          <Route path="/recent" component={Recent} />
          <Route path="/starred" component={Starred} />
          <Route path="/teams" component={Teams} />
          <Route path="/messages" component={Messages} />
          <Route path="/calls" component={Calls} />
        </Routes>
    </Router>
  )
}

// root.render(<Dashboard/>)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <Dashboard/>
    {/* <App /> */}
    {/* </BrowserRouter> */}
  </React.StrictMode>
);
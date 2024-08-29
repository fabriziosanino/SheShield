import { Navbar, Nav, NavItem  } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faExclamation, faComment } from '@fortawesome/free-solid-svg-icons';
import { Container } from 'react-bootstrap';

import { useLongPress } from "@uidotdev/usehooks";

const tabs = [{
  route: "/",
  icon: faUserShield,
  label: "GO"
},{
  route: "/report",
  icon: faExclamation,
  label: "REPORT"
},{
  route: "/chat",
  icon: faComment,
  label: "CHAT"
}]

function Navigation(props) {
  const location = useLocation();
  const[activeTab, setActiveTab] = useState(location.pathname == '/ChatMessages' || location.pathname == '/Chat' ? '/chat' : location.pathname); 

  useEffect(() => {
    location.pathname == '/ChatMessages' || location.pathname == '/Chat' ? 
      setActiveTab('/chat')
      : 
      setActiveTab(location.pathname);
  }, [location.pathname]);

  const attrs = useLongPress(
    () => { window.open('tel:112') },
    {
      threshold: 500
    }
  )

    return (
      <Navbar bg="light" fixed="bottom" style={{zIndex: 120}} className="navbar-component">
        <Nav className='w-100' >
        <Container fluid>
        <div className="d-flex justify-content-between" style={{padding: '0'}}>
          {
          tabs.map((tab, index) =>(
            <NavItem key={`tab-${index}`} className='w-100'>
              <NavLink key={`link-${index}`} 
                to={tab.route} 
                style={{ textDecoration: 'none'}}
                onClick={() => setActiveTab(tab.route)}
                {... tab.label === 'REPORT' ? attrs: []}
              >
                <div className={`text-center nav-item ${activeTab === tab.route ? 'active' : ''}`} style={{paddingTop: '5%'}}>
                  <FontAwesomeIcon size="2xl" icon={tab.icon}/>
                  <div>{tab.label}</div> 
                </div>
              </NavLink>
            </NavItem>
          ))
          }
          </div>
        </Container>
        </Nav>
		  </Navbar>
    );
};

export { Navigation }
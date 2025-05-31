import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Dashboard as DashboardIcon,
  Description as RequestIcon,
  Schedule as ScheduleIcon,
  Person as ResidentIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #4B6455;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.h3`
  margin: 5px 0;
  font-size: 1.2rem;
`;

const ProfileId = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    margin-right: 10px;
  }
`;

const LogoutButton = styled(NavItem)`
  margin-top: auto;
`;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/requests', icon: <RequestIcon />, label: 'Request' },
    { path: '/schedule', icon: <ScheduleIcon />, label: 'Schedule' },
    { path: '/resident-registration', icon: <ResidentIcon />, label: 'Resident Registration' },
    { path: '/settings', icon: <SettingsIcon />, label: 'Settings' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <SidebarContainer>
      <ProfileSection>
        <ProfileImage src="/path-to-profile-image.jpg" alt="Profile" />
        <ProfileName>Jacob Thomas</ProfileName>
        <ProfileId>ID:#3567298</ProfileId>
      </ProfileSection>

      {navItems.map((item) => (
        <NavItem
          key={item.path}
          active={location.pathname === item.path}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          {item.label}
        </NavItem>
      ))}

      <LogoutButton onClick={handleLogout}>
        <LogoutIcon />
        Log out
      </LogoutButton>
    </SidebarContainer>
  );
}

export default Sidebar; 
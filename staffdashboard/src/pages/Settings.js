import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const SettingsContainer = styled(Paper)`
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #4B6455;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const LargeAvatar = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;
  margin-right: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
`;

function Settings() {
  const [settings, setSettings] = useState({
    firstName: 'Jacob',
    lastName: 'Thomas',
    email: 'jacob.thomas@example.com',
    phone: '+251 123 456 789',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: 'light',
  });

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
    });
  };

  const handleNotificationChange = (type) => (event) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: event.target.checked,
      },
    });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Add save logic here
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    console.log('Uploading photo:', file);
    // Add photo upload logic here
  };

  return (
    <PageContainer>
      <Title>Settings</Title>
      
      <SettingsContainer elevation={3}>
        <Section>
          <SectionTitle>Profile</SectionTitle>
          <ProfileSection>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <LargeAvatar src="/path-to-profile-image.jpg">
                JT
              </LargeAvatar>
              <IconButton
                color="primary"
                component="span"
                style={{ position: 'relative', left: '-40px', top: '30px' }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
            <div>
              <h3 style={{ margin: '0' }}>Jacob Thomas</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>ID: #3567298</p>
            </div>
          </ProfileSection>
          
          <FormGroup>
            <TextField
              label="First Name"
              value={settings.firstName}
              onChange={handleChange('firstName')}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={settings.lastName}
              onChange={handleChange('lastName')}
              fullWidth
            />
          </FormGroup>
          
          <FormGroup>
            <TextField
              label="Email"
              value={settings.email}
              onChange={handleChange('email')}
              fullWidth
              type="email"
            />
            <TextField
              label="Phone"
              value={settings.phone}
              onChange={handleChange('phone')}
              fullWidth
            />
          </FormGroup>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>Notifications</SectionTitle>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={handleNotificationChange('email')}
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.push}
                  onChange={handleNotificationChange('push')}
                  color="primary"
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.sms}
                  onChange={handleNotificationChange('sms')}
                  color="primary"
                />
              }
              label="SMS Notifications"
            />
          </FormGroup>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>Security</SectionTitle>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => console.log('Change password')}
          >
            Change Password
          </Button>
        </Section>

        <ButtonContainer>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </ButtonContainer>
      </SettingsContainer>
    </PageContainer>
  );
}

export default Settings; 
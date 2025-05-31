import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { TextField, Button } from '@mui/material';

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/background-image.jpg');
  background-size: cover;
  background-position: center;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const LoginButton = styled(Button)`
  margin-top: 20px !important;
  padding: 12px !important;
  background-color: #4B6455 !important;
  
  &:hover {
    background-color: #3d5245 !important;
  }
`;

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // Add authentication logic here
    console.log('Login attempt:', values);
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Sign In</Title>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <StyledForm>
              <StyledTextField
                name="username"
                label="Username"
                variant="outlined"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <StyledTextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <LoginButton
                type="submit"
                variant="contained"
                fullWidth
              >
                Sign In
              </LoginButton>
            </StyledForm>
          )}
        </Formik>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  FormHelperText,
  Paper,
} from '@mui/material';

const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const FormContainer = styled(Paper)`
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const FileUploadSection = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  
  &:hover {
    border-color: #4B6455;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  fatherName: Yup.string().required('Father name is required'),
  grandFatherName: Yup.string().required('Grand father name is required'),
  placeOfBirth: Yup.string().required('Place of birth is required'),
  region: Yup.string().required('Region is required'),
  woreda: Yup.string().required('Woreda is required'),
  zone: Yup.string().required('Zone is required'),
  nationality: Yup.string().required('Nationality is required'),
  gender: Yup.string().required('Gender is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  mothersFullName: Yup.string().required('Mother\'s full name is required'),
  mothersNationality: Yup.string().required('Mother\'s nationality is required'),
  fathersFullName: Yup.string().required('Father\'s full name is required'),
  fathersNationality: Yup.string().required('Father\'s nationality is required'),
});

function ResidentRegistration() {
  const [file, setFile] = useState(null);

  const initialValues = {
    name: '',
    fatherName: '',
    grandFatherName: '',
    placeOfBirth: 'Ethiopia',
    region: '',
    woreda: '',
    zone: '',
    nationality: 'Ethiopia',
    gender: 'male',
    dateOfBirth: '',
    mothersFullName: '',
    mothersNationality: 'Ethiopia',
    fathersFullName: '',
    fathersNationality: 'Ethiopia',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form Values:', values);
    console.log('Uploaded File:', file);
    setSubmitting(false);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  return (
    <PageContainer>
      <Title>Resident Registration</Title>
      <FormContainer elevation={3}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <FormSection>
                <FormRow>
                  <StyledTextField
                    name="name"
                    label="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <StyledTextField
                    name="fatherName"
                    label="Father Name"
                    value={values.fatherName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fatherName && Boolean(errors.fatherName)}
                    helperText={touched.fatherName && errors.fatherName}
                  />
                  <StyledTextField
                    name="grandFatherName"
                    label="Grand Father Name"
                    value={values.grandFatherName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.grandFatherName && Boolean(errors.grandFatherName)}
                    helperText={touched.grandFatherName && errors.grandFatherName}
                  />
                </FormRow>

                <FormRow>
                  <FormControl>
                    <StyledTextField
                      select
                      name="placeOfBirth"
                      label="Place of Birth"
                      value={values.placeOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.placeOfBirth && Boolean(errors.placeOfBirth)}
                      helperText={touched.placeOfBirth && errors.placeOfBirth}
                    >
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                    </StyledTextField>
                  </FormControl>
                  <StyledTextField
                    name="region"
                    label="Region"
                    value={values.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.region && Boolean(errors.region)}
                    helperText={touched.region && errors.region}
                  />
                  <StyledTextField
                    name="woreda"
                    label="Woreda"
                    value={values.woreda}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.woreda && Boolean(errors.woreda)}
                    helperText={touched.woreda && errors.woreda}
                  />
                </FormRow>

                <FormRow>
                  <StyledTextField
                    name="zone"
                    label="Zone"
                    value={values.zone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.zone && Boolean(errors.zone)}
                    helperText={touched.zone && errors.zone}
                  />
                  <FormControl>
                    <StyledTextField
                      select
                      name="nationality"
                      label="Nationality"
                      value={values.nationality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.nationality && Boolean(errors.nationality)}
                      helperText={touched.nationality && errors.nationality}
                    >
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                    </StyledTextField>
                  </FormControl>
                </FormRow>

                <FormRow>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                    {touched.gender && errors.gender && (
                      <FormHelperText error>{errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                  <StyledTextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                  />
                </FormRow>
              </FormSection>

              <FormSection>
                <FormRow>
                  <StyledTextField
                    name="mothersFullName"
                    label="Mother's Full Name"
                    value={values.mothersFullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.mothersFullName && Boolean(errors.mothersFullName)}
                    helperText={touched.mothersFullName && errors.mothersFullName}
                  />
                  <FormControl>
                    <StyledTextField
                      select
                      name="mothersNationality"
                      label="Mother's Nationality"
                      value={values.mothersNationality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.mothersNationality && Boolean(errors.mothersNationality)}
                      helperText={touched.mothersNationality && errors.mothersNationality}
                    >
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                    </StyledTextField>
                  </FormControl>
                </FormRow>

                <FormRow>
                  <StyledTextField
                    name="fathersFullName"
                    label="Father's Full Name"
                    value={values.fathersFullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fathersFullName && Boolean(errors.fathersFullName)}
                    helperText={touched.fathersFullName && errors.fathersFullName}
                  />
                  <FormControl>
                    <StyledTextField
                      select
                      name="fathersNationality"
                      label="Father's Nationality"
                      value={values.fathersNationality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fathersNationality && Boolean(errors.fathersNationality)}
                      helperText={touched.fathersNationality && errors.fathersNationality}
                    >
                      <MenuItem value="Ethiopia">Ethiopia</MenuItem>
                    </StyledTextField>
                  </FormControl>
                </FormRow>
              </FormSection>

              <FileUploadSection>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  {file ? file.name : 'Click to upload documents'}
                </label>
              </FileUploadSection>

              <ButtonContainer>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </ButtonContainer>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </PageContainer>
  );
}

export default ResidentRegistration; 
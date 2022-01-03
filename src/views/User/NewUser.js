import React from 'react';
import {Box, Container, Grid, TextField, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import * as yup from 'yup';
import {useFormik} from "formik";
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DatePicker} from "@mui/lab";

const validationSchema = yup.object({
  email: yup
  .string()
  .trim()
  .email('Please enter a valid email address')
  .required('Email is required.'),
  firstName: yup
  .string()
  .required('Please specify your first name'),
  lastName: yup
  .string()
  .required('Please specify your first name'),
  birthdate: yup
  .date()
});

const NewUser = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const [birthdate, setBirthdate] = React.useState(null);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    birthdate: ''
  }

  const onSubmit = (values) => {
    return values;
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  return (
      <Container>
        <Box marginBottom={4}>
          <Typography
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'medium',
              }}
              gutterBottom
              color={'text.secondary'}
          >
            Create User
          </Typography>
          <Typography color="text.secondary">
            Enter the details
          </Typography>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant={'subtitle2'} sx={{marginBottom: 2}}>
                Enter your email
              </Typography>
              <TextField
                  label="Email *"
                  variant="outlined"
                  name={'email'}
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'subtitle2'} sx={{marginBottom: 2}}>
                Enter your firstname
              </Typography>
              <TextField
                  label="Firstname *"
                  variant="outlined"
                  name={'firstName'}
                  fullWidth
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'subtitle2'} sx={{marginBottom: 2}}>
                Enter your lastName
              </Typography>
              <TextField
                  label="Lastname *"
                  variant="outlined"
                  name={'lastName'}
                  fullWidth
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant={'subtitle2'} sx={{marginBottom: 2}}>
                Enter your birthdate
              </Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    fullWidth
                    label="Birthdate"
                    onChange={(newValue) => {
                      setBirthdate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </form>
      </Container>
  );
}

export default NewUser;
import React, {useEffect} from 'react';
import {Box, Button, Container, Grid, Link, TextField, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import * as yup from 'yup';
import {useFormik} from "formik";
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DatePicker} from "@mui/lab";
import Footer from "../Footer/Footer";
import {createUser, retrieveUser} from '../../redux/modules/UserModule';

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
  birthDate: yup
  .date()
});

const INITIAL_USER = {
  firstName: '',
  lastName: '',
  email: ''
}

const useUser = () => useSelector(({user: {user, status}}) => ({
  user,
  status
}));

const UserDetail = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const {user, status} = useUser();
  const [birthDate, setBirthDate] = React.useState(null);
  const {id} = router.query;

  useEffect(() => {

    if (id && !isNaN(id)) {
      dispatch(retrieveUser(id));
    }
  }, [dispatch, id]);

  const onSubmit = (values) => {
    const newValues = {
      ...values,
      birthDate: birthDate.toISOString()
    }
    dispatch(createUser(newValues, router));
  };

  const formik = useFormik({
    initialValues: INITIAL_USER,
    validationSchema: validationSchema,
    onSubmit
  });

  useEffect(() => {
    if (user && user !== null) {
      console.log('formik.setValues')
      setBirthDate(user.birthDate);

      formik.setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user])

  return (
      <Container maxWidth={"sm"}>
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
                    value={birthDate}
                    onChange={(newValue) => {
                      setBirthDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant={"outlined"} fullWidth/>}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Fields that are marked with * sign are required.
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type={"submit"}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Link href="/users">
                    <Button size="large" variant="contained" color="secondary">
                      Cancel
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <Footer></Footer>
      </Container>
  );
}

export default UserDetail;
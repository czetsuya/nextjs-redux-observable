import React, {useEffect, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {PersonAdd} from "@mui/icons-material";

import {retrieveList,} from 'redux/modules/UserModule';
import {useRouter} from "next/router";
import Footer from "../Footer/Footer";

const useUsers = () =>
    useSelector((state) => {
      const {user} = state;
      const {list, count} = user || {};
      return {users: list, count}
    });

const UserList = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const {users, count} = useUsers();
  const hasUsers = !!users && users.length > 0;
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(retrieveList({offset: offset * limit, limit}));
  }, [dispatch, offset, limit]);

  return (
      <Container maxWidth={"md"} fixed>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={6} align="right">
                  <Link href="/users/new">
                    <Button variant="outlined" color="primary">
                      <PersonAdd/>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Birth date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hasUsers ? (
                  users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {moment.utc(user.birthDate).format('MM-DD-YYYY')}
                        </TableCell>
                        <TableCell sx={{textAlign: "right"}}>
                          <ButtonGroup>
                            {/*  <Button onClick={editUser(user)}>*/}
                            {/*    /!*<Edit/>*!/*/}
                            {/*  </Button>*/}
                            {/*  <Button onClick={openDialog(user)}>*/}
                            {/*    /!*<Delete/>*!/*/}
                            {/*  </Button>*/}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={6}>No users found.</TableCell>
                  </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/*<TablePagination*/}
                {/*    component={TableCell}*/}
                {/*    count={count}*/}
                {/*    page={offset}*/}
                {/*    rowsPerPage={limit}*/}
                {/*    onChangePage={handleChangePage}*/}
                {/*    onChangeRowsPerPage={handleChangeRowsPerPage}*/}
                {/*/>*/}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <Footer></Footer>
      </Container>
  );
}

export default UserList;
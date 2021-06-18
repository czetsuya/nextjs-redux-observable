import styles from './User.module.css';
import React, {useEffect, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {PersonAdd} from "@material-ui/icons";

import {retrieveUserList,} from 'redux/modules/UserModule';
import {useRouter} from "next/router";

const useUsers = () =>
    useSelector(({user: {users, count, status, user}}) => ({
      users,
      storeUser: user,
      count,
      status,
    }));

const UserList = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const {users, storeUser, count, status} = useUsers();
  const hasUsers = !!users && users.length > 0;
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(retrieveUserList({offset: offset * limit, limit}));
  }, [dispatch, offset, limit]);

  return (
      <>
        <TableContainer className={styles.tableContainer} component={Paper}>
          <Table className={styles.table}>
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
                <TableCell className={styles.buttonContainer}></TableCell>
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
                        <TableCell className={styles.buttonContainer} align="right">
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
      </>
  );
}

export default UserList;
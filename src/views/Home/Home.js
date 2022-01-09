import Head from 'next/head';
import styles from './Home.module.css';
import Link from 'next/link';
import {Container} from "@mui/material";
import Footer from "../Footer/Footer";

const Home = () => (

  <Container maxWidth={"sm"} fixed>
    <Head>
      <title>Home - NextJS Frontend Framework</title>
    </Head>

    <main>
      <h1>NextJS Framework Template</h1>

      <h2>Sample pages</h2>
      <ul>
        <li>
          <Link href="/users">
            <a>Users (CRUD example)</a>
          </Link>
        </li>
      </ul>

      <Footer></Footer>
    </main>
  </Container>
);

export default Home;

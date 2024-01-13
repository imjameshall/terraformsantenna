import type { NextPage } from "next";
import Head from "next/head";
import Tuner from "../components/tuner"

const Home: NextPage = () => {
  return (
    <div>
      <Head>


  <title>TERRAFORMS ANTENNA INFO</title>
      </Head>

      <main>
        <Tuner/>
      </main>
    </div>
  );
};

export default Home;
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
        Folks who have added code, or want to verify site:
        <ul>
            <li>James Hall <a href='https://twitter.com/'>ImJamesHall</a></li>
        </ul>
      </main>
    </div>
  );
};

export default Home;
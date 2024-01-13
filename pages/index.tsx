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
        <p className="text-center text-beta-md my-3 leading-relaxed">Want to help on the site? The code can be found here: <a href='https://github.com/imjameshall/terraformsantenna'>https://github.com/imjameshall/terraformsantenna</a></p>
      </main>
    </div>
  );
};

export default Home;
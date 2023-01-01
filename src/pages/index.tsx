import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import AudioRecorder from "../component/AudioRecorder";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Redhorse AI Transcriber</title>
        <meta name="description" content="Redhorse AI Transcriber" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <nav className="flex">
          <p className="px-10 py-3 text-xl text-white">
            Redhorse AI Transcriber
          </p>
          <div className="ml-auto">
            <button
              className="bg-gray/10 hover:bg-gray/20 rounded-full px-10 py-3 font-semibold text-white no-underline transition"
              onClick={sessionData ? () => signOut() : () => signIn("google")}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </div>
        </nav>
        <div className="mx-4 flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Hello!
            {sessionData ? (
              <>
                <span className="text-[#ff6b00]">{sessionData.user?.name}</span>
                <AudioRecorder />
              </>
            ) : (
              <span className="text-[#ff6b00]"> Guest</span>
            )}
          </h1>
        </div>
      </main>
      <Toaster />
    </>
  );
};

export default Home;

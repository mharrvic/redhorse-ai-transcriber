import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
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
          <p className="px-10 py-3 text-xl text-white flex">
            <Image src="/redhorse-ai-transcriber.png" alt="Logo" width="100" height="100"/>
          </p>
        </nav>
        <div className="mx-4 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              <>
                <p className="text-white"> Redhorse AI <span className="text-[#ff6b00]">Transcriber</span></p>   
                <p className="font-mono text-lg text-gray-400 mb-4">Openai's Whisper (Automatic Speech Recognition) deployed in a Serverless GPU (banana.dev)</p>         
                <p className="font-mono text-sm text-gray-200">1. Click Record (to record) -> 2. Stop (to stop the recording) -> and 3. Transcribe (to start the transcribe process)</p>
                <AudioRecorder />
              </>
          </h1>
        </div>
      </main>
      <Toaster />
    </>
  );
};

export default Home;

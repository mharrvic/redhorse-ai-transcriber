import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import AudioRecorder from "../component/AudioRecorder";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Redhorse AI Transcriber</title>
        <meta name="description" content="Redhorse AI Transcriber" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <nav className="flex">
          <p className="flex px-10 py-3 text-xl text-white">
            <Image
              src="/redhorse-ai-transcriber.png"
              alt="Redhorse AI Transcriber Logo"
              width="100"
              height="100"
            />
          </p>
          <div className="m-3 ml-auto">
            <a
              href="https://github.com/mharrvic/redhorse-ai-transcriber"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Image
                src="/github.svg"
                alt="Banana Logo"
                width="20"
                height="20"
              />
              <p className="text-white"> Source Code</p>
            </a>
          </div>
        </nav>
        <div className="mx-4 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <>
              <p className="text-white">
                {" "}
                Redhorse AI <span className="text-[#ff6b00]">Transcriber</span>
              </p>
              <p className="mb-4 font-mono text-lg text-gray-400">
                Openai&apos;s Whisper (Automatic Speech Recognition) deployed in
                a Serverless GPU (banana.dev)
              </p>
              <p className="font-mono text-sm text-gray-200">
                1. Click Record (to record) -&gt; 2. Stop (to stop the
                recording) -&gt; and 3. Transcribe (to start the transcribe
                process)
              </p>
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

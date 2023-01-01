import clsx from "clsx";
import toast from "react-hot-toast";

import MicRecorder from "mic-recorder-to-mp3";

import React from "react";
import { trpc } from "../utils/trpc";
import Divider from "./Divider";

const buttonStyle =
  "inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm";

function roundOff(num: number) {
  return Math.round(num).toFixed(2);
}

const AudioRecorder = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [audio, setAudio] = React.useState<string>();
  const [blobURL, setBlobURL] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState<
    {
      start: number;
      end: number;
      text: string;
    }[]
  >([]);

  const recorder = React.useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const resetTranscript = () => setTranscript([]);

  const { mutate, isLoading } = trpc.ml.transcribe.useMutation({
    onSuccess: (data) => {
      toast.remove();
      toast.success("Transcribed!");
      data.modelOutputs[0]?.text.map((output) => {
        const { text, start, end } = output;
        setTranscript((prev) => [...prev, { start, end, text }]);
      });
    },
    onError: () => {
      toast.error("Error!");
    },
  });

  const handleStartRecording = () => {
    resetTranscript();
    recorder
      .start()
      .then(() => {
        setIsRecording(true);
      })
      .catch((e: string) => console.error(e));
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    recorder
      .stop()
      .getMp3()
      .then((audioData: [Int8Array[], Blob]) => {
        const [buffer, blob] = audioData;
        const file = new File(buffer, "test.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        setBlobURL(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          const base64data = reader.result;

          if (typeof base64data === "string") {
            const base64String = base64data.split(",")[1];
            setAudio(base64String);
          }
        };
      });
  };

  const handleGenerate = () => {
    toast.loading("Transcribing with openai's whisper...");
    setIsRecording(false);
    if (audio) {
      mutate({ mp3BytesString: audio });
    }
  };

  const handleMouseOver = (start: number, end: number, text: string) => {
    toast.remove();
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
      >
        <div className="w-0 flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{`From: ${roundOff(
                start
              )}s - To: ${roundOff(end)}s`}</p>
              <p className="mt-1 text-sm text-gray-500">{text}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  const seekTo = (start: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = start;
      audio.play();
    }
  };

  const handleOnTranscriptClick = (start: number, end: number) => {
    seekTo(start);
  };

  return (
    <div className="mt-5 flex flex-col place-items-center gap-5">
      <div className="flex gap-5">
        <button
          onClick={handleStartRecording}
          disabled={isRecording}
          className={clsx(
            buttonStyle,
            { "bg-gray-600": isRecording },
            { "bg-indigo-600": !isRecording }
          )}
        >
          Record
        </button>
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className={clsx(
            buttonStyle,
            { "bg-red-600": isRecording },
            { "bg-gray-600": !isRecording }
          )}
        >
          Stop
        </button>
      </div>

      {blobURL && (
        <div className="text-center">
          <p className="font-mono text-sm text-gray-200">Audio Preview</p>
          <audio src={blobURL} controls={true} ref={audioRef} />
        </div>
      )}

      {audio && (
        <p className="font-mono text-sm text-gray-200">
          Click this to transcribe!
        </p>
      )}

      <button
        type="submit"
        className={clsx(buttonStyle, {
          "bg-gray-600": !audio,
          "bg-[#ff6b00]": audio,
        })}
        onClick={handleGenerate}
        disabled={!audio || isLoading}
      >
        {isLoading ? "Transcribing..." : "Transcribe"}
      </button>

      {transcript.length > 0 && (
        <>
          <Divider />
          <div>
            <p className="font-mono text-sm text-gray-300">
              Click each of the transcribed text to play
            </p>
            {transcript.map((item, index) => (
              <div
                key={index}
                className="mb-8 cursor-pointer hover:underline"
                onMouseOver={() =>
                  handleMouseOver(item.start, item.end, item.text)
                }
                onClick={() => handleOnTranscriptClick(item.start, item.end)}
              >
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}
    </div>
  );
};

export default AudioRecorder;

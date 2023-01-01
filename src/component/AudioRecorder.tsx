import clsx from "clsx";

import MicRecorder from "mic-recorder-to-mp3";

import React from "react";
import { trpc } from "../utils/trpc";

const buttonStyle =
  "inline-flex items-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm";

const AudioRecorder = () => {
  const [audio, setAudio] = React.useState<string>();
  const [blobURL, setBlobURL] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState<string[]>([]);

  const recorder = React.useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const resetTranscript = () => setTranscript([]);

  const { mutate, isLoading } = trpc.ml.transcribe.useMutation({
    onSuccess: (data) => {
      data.modelOutputs[0]?.text.map((output) => {
        const text = output.text;
        setTranscript((prev) => [...prev, text]);
      });
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
    setIsRecording(false);
    if (audio) {
      mutate({ mp3BytesString: audio });
    }
  };
  return (
    <div>
      <div className="mb-2 flex gap-5">
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

      <div>
        <audio src={blobURL} controls={true} />
      </div>

      <div>
        <button
          type="submit"
          className={clsx(buttonStyle, {
            "bg-gray-600": !audio,
            "bg-green-600": audio,
          })}
          onClick={handleGenerate}
          disabled={!audio}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>

      <div>
        {transcript.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default AudioRecorder;

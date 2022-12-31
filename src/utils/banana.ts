import * as banana from "@banana-dev/banana-dev";
import { env } from "../env/server.mjs";
import type { ITranscribeAudio } from "../types/transcribe.js";

export async function transcribeAudio(audio: string) {
  const modelParameters = {
    mp3BytesString: audio,
  };

  const output = await banana.run(
    env.BANANA_API_KEY,
    env.BANANA_MODEL_KEY,
    modelParameters
  );
  return output as ITranscribeAudio;
}

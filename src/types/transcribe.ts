export interface ITranscribeAudio {
  id: string;
  message: string;
  created: number;
  apiVersion: string;
  modelOutputs: IModelOutput[];
}

export interface IModelOutput {
  text: IText[];
}

export interface IText {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

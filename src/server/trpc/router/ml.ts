import { z } from "zod";
import { transcribeAudio } from "../../../utils/banana";

import { publicProcedure, router } from "../trpc";

export const mlRouter = router({
  transcribe: publicProcedure
    .input(z.object({ mp3BytesString: z.string() }))
    .mutation(async ({ input }) => {
      const transcribe = await transcribeAudio(input.mp3BytesString);
      return transcribe;
    }),
});

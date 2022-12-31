import { z } from "zod";
import { transcribeAudio } from "../../../utils/banana";

import { protectedProcedure, router } from "../trpc";

export const mlRouter = router({
  transcribe: protectedProcedure
    .input(z.object({ mp3BytesString: z.string() }))
    .mutation(async ({ input }) => {
      const transcribe = await transcribeAudio(input.mp3BytesString);
      return transcribe;
    }),
});

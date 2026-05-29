'use server';
/**
 * @fileOverview A Genkit flow for generating a summary of a study session.
 *
 * - generateSessionSummary - A function that handles the session summary generation process.
 * - GenerateSessionSummaryInput - The input type for the generateSessionSummary function.
 * - GenerateSessionSummaryOutput - The return type for the generateSessionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  sender: z.string().describe('The name of the sender.'),
  message: z.string().describe('The content of the message.'),
});

const ActivityLogSchema = z.string().describe('A log entry describing an activity during the session.');

const GenerateSessionSummaryInputSchema = z.object({
  sessionTitle: z.string().describe('The title of the study session.'),
  chatLogs: z.array(ChatMessageSchema).describe('An array of chat messages from the session.'),
  activityLogs: z.array(ActivityLogSchema).optional().describe('An optional array of activity logs from the session.'),
});
export type GenerateSessionSummaryInput = z.infer<typeof GenerateSessionSummaryInputSchema>;

const GenerateSessionSummaryOutputSchema = z.object({
  summaryTitle: z.string().describe('A concise title for the session summary.'),
  overallSummary: z.string().describe('A general paragraph summarizing the entire session.'),
  keyDiscussionPoints: z.array(z.string()).describe('An array of significant discussion points identified in the session.'),
  decisionsMade: z.array(z.string()).describe('An array of decisions or conclusions reached during the session.'),
});
export type GenerateSessionSummaryOutput = z.infer<typeof GenerateSessionSummaryOutputSchema>;

const sessionSummaryPrompt = ai.definePrompt({
  name: 'sessionSummaryPrompt',
  input: { schema: GenerateSessionSummaryInputSchema },
  output: { schema: GenerateSessionSummaryOutputSchema },
  prompt: `You are an intelligent study assistant. Your task is to analyze the provided study session details and generate a comprehensive summary.\n\nThe session title is: "{{{sessionTitle}}}"\n\nHere are the chat logs from the session:\n{{#each chatLogs}}\n  {{{sender}}}: {{{message}}}\n{{/each}}\n\n{{#if activityLogs}}\nHere are the activity logs from the session:\n{{#each activityLogs}}\n  - {{{this}}}\n{{/each}}\n{{/if}}\n\nBased on the information above, please provide a summary that includes:\n1.  A concise summary title.\n2.  An overall summary paragraph of the session.\n3.  A list of key discussion points.\n4.  A list of any decisions or conclusions made.\n\nEnsure the output adheres strictly to the specified JSON schema.`,
});

const generateSessionSummaryFlow = ai.defineFlow(
  {
    name: 'generateSessionSummaryFlow',
    inputSchema: GenerateSessionSummaryInputSchema,
    outputSchema: GenerateSessionSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await sessionSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate session summary.');
    }
    return output;
  }
);

export async function generateSessionSummary(
  input: GenerateSessionSummaryInput
): Promise<GenerateSessionSummaryOutput> {
  return generateSessionSummaryFlow(input);
}

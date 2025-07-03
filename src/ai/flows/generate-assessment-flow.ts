
'use server';

/**
 * @fileOverview Analyzes user-selected data to generate a hair loss assessment.
 *
 * - generateAssessment - A function that generates the assessment.
 * - GenerateAssessmentInput - The input type for the generateAssessment function.
 * - GenerateAssessmentOutput - The return type for the generateAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssessmentInputSchema = z.object({
    selectedImages: z.array(z.object({
        id: z.string(),
        description: z.string(),
        category: z.string(),
    })).describe("An array of objects representing the hair loss pattern images selected by the user."),
    selectedTags: z.array(z.object({
        tag: z.string(),
        category: z.string(),
    })).describe("An array of objects representing the contributing factors selected by the user."),
});

export type GenerateAssessmentInput = z.infer<typeof GenerateAssessmentInputSchema>;

const GenerateAssessmentOutputSchema = z.object({
  classification: z.enum(['Temporary', 'Permanent Non-Scarring', 'Permanent Scarring', 'Unknown']).describe("Classify the hair loss type based on the provided data. Use 'Unknown' if classification is not possible."),
  severity: z.enum(['Mild', 'Mild to Moderate', 'Moderate', 'Moderate to Severe', 'Severe', 'Unknown']).describe("Assess the severity of the hair loss based on the provided data. Use 'Unknown' if assessment is not possible."),
  selectedImageSummary: z.record(z.array(z.string())).describe("A summary of the selected images, grouped by category. The key is the category name and the value is an array of image descriptions."),
  contributingFactorsSummary: z.record(z.array(z.string())).describe("A summary of the selected contributing factors, grouped by category. The key is the category name and the value is an array of selected tags."),
});

export type GenerateAssessmentOutput = z.infer<typeof GenerateAssessmentOutputSchema>;

export async function generateAssessment(input: GenerateAssessmentInput): Promise<GenerateAssessmentOutput> {
  return generateAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAssessmentPrompt',
  input: {schema: GenerateAssessmentInputSchema},
  output: {schema: GenerateAssessmentOutputSchema},
  prompt: `You are HairlossDoctor.AI, a specialized AI assistant designed for hair loss assessment. Your task is to analyze the user's selections and provide a structured assessment.

Analyze the user's selected images and contributing factors to determine the hair loss classification and severity.

- **Classification**: Based on all available data (image patterns and factors), classify the likely hair loss type into one of: 'Temporary', 'Permanent Non-Scarring', 'Permanent Scarring'. If the data is conflicting or insufficient, classify as 'Unknown'. For example, 'Frontal Fibrosing Alopecia' points to 'Permanent Scarring'. 'Androgenetic Alopecia (AGA)' points to 'Permanent Non-Scarring'. 'Telogen Effluvium' points to 'Temporary'.
- **Severity**: Estimate the severity based on the stage of hair loss images (e.g., AGA Stage 5 is 'Severe') and the number and type of contributing factors. Classify as 'Mild', 'Mild to Moderate', 'Moderate', 'Moderate to Severe', or 'Severe'. If unable to determine, use 'Unknown'.
- **Summaries**: Create summaries for both `selectedImageSummary` and `contributingFactorsSummary` by grouping the user's selections by their 'category' field. The result should be an object where keys are the category names and values are arrays of the descriptions/tags.

Here is the user's data:

**Selected Images:**
{{#each selectedImages}}
- Category: {{category}}, Description: {{description}}
{{/each}}

**Selected Contributing Factors:**
{{#each selectedTags}}
- Category: {{category}}, Tag: {{tag}}
{{/each}}

Based on this data, provide the structured output in the required JSON format. Do not add any conversational text or disclaimers to the output.
`,
});

const generateAssessmentFlow = ai.defineFlow(
  {
    name: 'generateAssessmentFlow',
    inputSchema: GenerateAssessmentInputSchema,
    outputSchema: GenerateAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

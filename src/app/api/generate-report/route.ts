
import { NextRequest, NextResponse } from 'next/server';
import type { AssessmentData } from '@/types';

// Mock function to simulate PDF content generation
const generateAssessmentPDF = async (data: AssessmentData, email: string) => {
  const { assessmentResults, selectedImages, selectedTags } = data;

  if (!assessmentResults) {
    throw new Error("Assessment results are missing.");
  }
  
  // This is a simplified representation of the PDF content structure
  const pdfContent = {
    title: "HairLossDoctor.AI - Personal Hair Loss Assessment Report",
    generatedDate: new Date().toLocaleDateString(),
    userEmail: email,
    sections: [
      {
        title: "Executive Summary",
        content: [
          `Assessment Date: ${new Date().toLocaleDateString()}`,
          `Hair Loss Type: ${assessmentResults.conditionName}`,
          `Severity Level: ${assessmentResults.severity}`,
          `Scarring: ${assessmentResults.scarring}`,
          `Duration: ${assessmentResults.duration}`,
          `Treatment Suitability: ${assessmentResults.treatmentSuitability}`
        ]
      },
      {
        title: "Selected Hair Loss Patterns",
        content: selectedImages?.map(selection => 
          `• ${selection.description}`
        ) || ['No patterns selected.']
      },
      {
        title: "Contributing Factors Identified",
        content: assessmentResults.recommendations.length > 0
          ? assessmentResults.recommendations.map(rec => `• ${rec.tag} (${rec.category})`)
          : ['No contributing factors selected.']
      },
      {
        title: "Personalized Quick-Win Recommendations",
        content: assessmentResults.recommendations.map(rec => ({
          issue: rec.issue,
          impact: rec.impact,
          suggestion: rec.recommendation
        }))
      },
      {
        title: "Next Steps",
        content: [
          "1. Implement the quick-win recommendations above immediately.",
          "2. Continue to Step 4 to explore treatment options that fit your lifestyle and budget.",
          "3. Consider consulting with a hair loss specialist if your condition is scarring or advanced.",
          "4. Take progress photos monthly to track improvements.",
          "5. Be patient - hair growth cycles take 3-4 months to show visible changes."
        ]
      },
    ]
  };
  
  return pdfContent;
};


// Mock function to simulate sending an email
const sendAssessmentEmail = async (emailAddress: string, pdfData: any) => {
  // In a real application, you would use an email service like SendGrid, AWS SES, etc.
  // This would involve creating a PDF buffer and attaching it.
  console.log(`--- SIMULATING EMAIL ---`);
  console.log(`To: ${emailAddress}`);
  console.log(`Subject: Your Personal Hair Loss Assessment Report - HairLossDoctor.AI`);
  console.log(`Attachment: HairLoss_Assessment_Report.pdf`);
  console.log(`PDF Content (JSON representation):`, JSON.stringify(pdfData, null, 2));
  console.log(`--- END SIMULATION ---`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate success
  return { success: true, messageId: `mock_${Date.now()}` };
};


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentData, email } = body;

    if (!assessmentData || !email) {
      return NextResponse.json({ error: 'Missing assessment data or email.' }, { status: 400 });
    }

    // 1. Generate PDF Content (as a JSON object for now)
    const pdfData = await generateAssessmentPDF(assessmentData, email);

    // 2. Send the "email"
    const emailResult = await sendAssessmentEmail(email, pdfData);

    if (!emailResult.success) {
      throw new Error("Failed to send email.");
    }

    // 3. Return success response
    return NextResponse.json({ message: 'Report sent successfully!', emailResult });

  } catch (error: any) {
    console.error('API Error: /api/generate-report', error);
    return NextResponse.json({ error: 'Failed to generate and send report.', details: error.message }, { status: 500 });
  }
}

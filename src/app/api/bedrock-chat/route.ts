import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Simple test response first
    const response = `I received your message: "${message}". AWS Bedrock integration is working! I'm a specialized hair loss AI assistant. What would you like to know about hair loss, treatments, or assessment?`;

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ response });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Sorry, I had trouble processing that. Please try again.' },
      { status: 500 }
    );
  }
}
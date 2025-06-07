import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    console.log('🔍 Received context:', JSON.stringify(context, null, 2));

    // Initialize Bedrock Agent client
    const client = new BedrockAgentRuntimeClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });

    // Enhanced prompt with full context
    const enhancedPrompt = `
USER CONTEXT:
- Current Step: ${context?.currentStep || 'Unknown'}
- Selected Images: ${JSON.stringify(context?.selectedImages || [])}
- Selected Tags: ${JSON.stringify(context?.selectedTags || [])}
- Assessment Results: ${JSON.stringify(context?.assessmentResults || {})}

USER MESSAGE: ${message}

Please provide a helpful, professional response based on the user's hair loss assessment context and your medical knowledge base. Reference their specific selections and provide personalized advice.
    `;

    console.log('🔍 Enhanced prompt being sent to AWS:', enhancedPrompt);

    // Send to Bedrock Agent
    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_AGENT_ID!,
      agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID!,
      sessionId: `session-${Date.now()}`,
      inputText: enhancedPrompt
    });

    const response = await client.send(command);

    // Process streaming response
    let fullResponse = '';
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
        }
      }
    }

    console.log('🔍 AWS response:', fullResponse);

    return NextResponse.json({ response: fullResponse });

  } catch (error) {
    console.error('❌ Bedrock Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

export async function POST(request: NextRequest) {
  try {
    const { message, userType } = await request.json();
    
    // Initialize Bedrock Agent client for general chat
    const client = new BedrockAgentRuntimeClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_GENERAL_CHAT_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_GENERAL_CHAT_SECRET_ACCESS_KEY!,
      }
    });

    // Enhanced prompt with user type
    const enhancedPrompt = `
USER TYPE: ${userType.toUpperCase()} 
USER MESSAGE: ${message}

Adapt language based on user type: DOCTOR = technical terms, PATIENT = simple words, OTHER = balanced.
    `;

    const command = new InvokeAgentCommand({
      agentId: process.env.BEDROCK_GENERAL_CHAT_AGENT_ID!,
      agentAliasId: process.env.BEDROCK_GENERAL_CHAT_ALIAS_ID!,
      sessionId: `general-chat-${Date.now()}`,
      inputText: enhancedPrompt
    });

    const response = await client.send(command);
    
    let fullResponse = '';
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
        }
      }
    }

    return NextResponse.json({ response: fullResponse });
    
  } catch (error) {
    console.error('General chat error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
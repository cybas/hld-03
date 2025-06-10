
import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

export async function POST(request: NextRequest) {
  console.log('General Chat API: Request received.');

  const awsAccessKeyId = process.env.AWS_GENERAL_CHAT_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_GENERAL_CHAT_SECRET_ACCESS_KEY;
  const bedrockAgentId = process.env.BEDROCK_GENERAL_CHAT_AGENT_ID;
  const bedrockAgentAliasId = process.env.BEDROCK_GENERAL_CHAT_ALIAS_ID;
  const awsRegion = process.env.AWS_GENERAL_CHAT_REGION || 'us-east-1'; // Default region if not specified

  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.error('General Chat API: AWS credentials for general chat (AWS_GENERAL_CHAT_ACCESS_KEY_ID or AWS_GENERAL_CHAT_SECRET_ACCESS_KEY) are not set.');
    return NextResponse.json({ error: 'Server configuration error: General chat AWS credentials missing.' }, { status: 500 });
  }
  if (!bedrockAgentId || !bedrockAgentAliasId) {
    console.error('General Chat API: Bedrock Agent ID or Alias ID for general chat is not configured.');
    return NextResponse.json({ error: 'Server configuration error: General chat Bedrock configuration missing.' }, { status: 500 });
  }
  console.log('General Chat API: Using Bedrock Config:', { region: awsRegion, agentId: bedrockAgentId, agentAliasId: bedrockAgentAliasId });

  try {
    const { message, userType } = await request.json();
    console.log('General Chat API: Parsed request:', { message, userType });
    
    const client = new BedrockAgentRuntimeClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      }
    });
    console.log('General Chat API: Bedrock client initialized.');

    const enhancedPrompt = `
USER TYPE: ${userType ? userType.toUpperCase() : 'PATIENT'} 
USER MESSAGE: ${message}

Adapt language based on user type: DOCTOR = technical terms, PATIENT = simple words, OTHER = balanced.
    `;
    console.log('General Chat API: Enhanced prompt created.');

    const sessionId = `general-chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log(`General Chat API: Generated Session ID: ${sessionId}`);

    const command = new InvokeAgentCommand({
      agentId: bedrockAgentId,
      agentAliasId: bedrockAgentAliasId,
      sessionId: sessionId,
      inputText: enhancedPrompt
    });
    console.log('General Chat API: Sending command to Bedrock:', JSON.stringify(command.input, null, 2));

    const response = await client.send(command);
    console.log('General Chat API: Received response from Bedrock.');
    
    let fullResponse = '';
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
        }
      }
    }
    console.log('General Chat API: Response processed. Length:', fullResponse.length);

    return NextResponse.json({ response: fullResponse });
    
  } catch (error: any) {
    console.error('General Chat API: Error during Bedrock agent invocation or response processing:', error.message, error.stack, error);
    let errorMessage = 'Failed to get AI response from general chat due to an internal server error.';
    if (error.name) {
        errorMessage += ` (Error: ${error.name})`;
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}

    
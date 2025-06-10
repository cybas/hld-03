
import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

// Placeholder for getBedrockConfig - in a real scenario, this would be imported or defined
// For now, we'll simulate its potential output and handle errors if it were to fail.
interface BedrockConfig {
  region: string;
  agentId: string;
  agentAliasId: string;
  sessionId: string; // sessionId seems to be generated per request in the original code
}

function getBedrockConfig(): BedrockConfig {
  // This is a MOCK. In a real app, this would fetch from env vars or a config file.
  // process.env.BEDROCK_AGENT_ID, process.env.BEDROCK_AGENT_ALIAS_ID, etc.
  // Let's assume it might throw or return undefined if not configured
  const region = process.env.AWS_REGION || 'us-east-1'; // Default if not set
  const agentId = process.env.BEDROCK_AGENT_ID;
  const agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID;

  if (!agentId || !agentAliasId) {
    console.error('Bedrock Agent ID or Alias ID is not configured in environment variables.');
    throw new Error('Bedrock Agent ID or Alias ID is not configured.');
  }

  return {
    region,
    agentId,
    agentAliasId,
    // sessionId will be generated per request, as in the original code.
    // For this simulation, we'll let the POST handler generate it.
    sessionId: '', 
  };
}


export async function POST(request: NextRequest) {
  const overallStart = Date.now();
  console.log('Bedrock Chat API: Request received.');

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('Bedrock Chat API: AWS credentials (AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY) are not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: AWS credentials missing.' }, { status: 500 });
  }

  let config: BedrockConfig;
  try {
    const configStart = Date.now();
    config = getBedrockConfig(); // This now includes checks for agentId/AliasId
    console.log(`Bedrock Chat API: Config Setup Time: ${Date.now() - configStart}ms`);
    if (!config.region || !config.agentId || !config.agentAliasId) {
        console.error('Bedrock Chat API: Invalid Bedrock configuration fetched (missing region, agentId, or agentAliasId).', config);
        return NextResponse.json({ error: 'Server configuration error: Invalid Bedrock config.' }, { status: 500 });
    }
    console.log('Bedrock Chat API: Using Bedrock Config:', { region: config.region, agentId: config.agentId, agentAliasId: config.agentAliasId });
  } catch (error: any) {
    console.error('Bedrock Chat API: Error getting Bedrock config:', error.message, error.stack);
    return NextResponse.json({ error: `Server configuration error: ${error.message}` }, { status: 500 });
  }
  
  try {
    const parseStart = Date.now();
    const { message, context } = await request.json();
    console.log(`Bedrock Chat API: JSON Parse Time: ${Date.now() - parseStart}ms`);
    
    const clientStart = Date.now();
    const client = new BedrockAgentRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
    console.log(`Bedrock Chat API: Client Init Time: ${Date.now() - clientStart}ms`);

    const promptStart = Date.now();
    const enhancedPrompt = `
USER CONTEXT: Step ${context.currentStep || 1}, Images: ${context.selectedImages?.length || 0}, Factors: ${context.selectedTags?.length || 0}

USER MESSAGE: ${message}

Provide a brief, helpful response (max 100 words). Reference their specific selections when relevant.
    `;
    console.log(`Bedrock Chat API: Prompt Creation Time: ${Date.now() - promptStart}ms`);

    const sessionId = `bedrock-chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log(`Bedrock Chat API: Generated Session ID: ${sessionId}`);

    const commandStart = Date.now();
    const command = new InvokeAgentCommand({
      agentId: config.agentId,
      agentAliasId: config.agentAliasId,
      sessionId: sessionId, // Use generated or context-provided session ID
      inputText: enhancedPrompt,
      // performanceConfig: { latency: "optimized" }, // This field does not exist, remove it
      enableTrace: false // Set to true for more detailed Bedrock traces if needed
    });
    console.log(`Bedrock Chat API: Command Setup Time: ${Date.now() - commandStart}ms`);
    console.log('Bedrock Chat API: Sending command to Bedrock:', JSON.stringify(command.input, null, 2));

    const awsCallStart = Date.now();
    const response = await client.send(command);
    console.log(`Bedrock Chat API: AWS Bedrock Call Time: ${Date.now() - awsCallStart}ms`);

    const processingStart = Date.now();
    let fullResponse = '';
    let chunkCount = 0;
    
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
          chunkCount++;
        }
      }
    }
    console.log(`Bedrock Chat API: Response Processing Time: ${Date.now() - processingStart}ms (${chunkCount} chunks)`);

    const totalTime = Date.now() - overallStart;
    console.log(`Bedrock Chat API: TOTAL REQUEST TIME: ${totalTime}ms`);
    
    if (totalTime > 3000) console.warn('Bedrock Chat API: SLOW REQUEST DETECTED');
    if (Date.now() - awsCallStart > 2000) console.warn('Bedrock Chat API: AWS CALL IS SLOW');

    return NextResponse.json({ 
      response: fullResponse,
      debugTiming: {
        total: totalTime,
        awsCall: Date.now() - awsCallStart,
        chunks: chunkCount
      }
    });
    
  } catch (error: any) {
    console.error('Bedrock Chat API: Error during Bedrock agent invocation or response processing:', error.message, error.stack, error);
    // Attempt to give a more specific error message if known AWS SDK error
    let errorMessage = 'Failed to get AI response due to an internal server error.';
    if (error.name) {
        errorMessage += ` (Error: ${error.name})`;
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
  }
}

    
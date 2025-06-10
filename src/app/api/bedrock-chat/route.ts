export async function POST(request: NextRequest) {
  const overallStart = Date.now();
  
  try {
    const parseStart = Date.now();
    const { message, context } = await request.json();
    console.log(`⏱️ JSON Parse: ${Date.now() - parseStart}ms`);
    
    const configStart = Date.now();
    const config = getBedrockConfig();
    console.log(`⏱️ Config Setup: ${Date.now() - configStart}ms`);
    
    const clientStart = Date.now();
    const client = new BedrockAgentRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
    console.log(`⏱️ Client Init: ${Date.now() - clientStart}ms`);

    // Shorter, more efficient prompt
    const promptStart = Date.now();
    const enhancedPrompt = `
USER CONTEXT: Step ${context.currentStep || 1}, Images: ${context.selectedImages?.length || 0}, Factors: ${context.selectedTags?.length || 0}

USER MESSAGE: ${message}

Provide a brief, helpful response (max 100 words). Reference their specific selections when relevant.
    `;
    console.log(`⏱️ Prompt Creation: ${Date.now() - promptStart}ms`);

    const commandStart = Date.now();
    const command = new InvokeAgentCommand({
      agentId: config.agentId,
      agentAliasId: config.agentAliasId,
      sessionId: config.sessionId,
      inputText: enhancedPrompt,
      performanceConfig: { latency: "optimized" },
      enableTrace: false
    });
    console.log(`⏱️ Command Setup: ${Date.now() - commandStart}ms`);

    const awsCallStart = Date.now();
    const response = await client.send(command);
    console.log(`🚀 AWS Bedrock Call: ${Date.now() - awsCallStart}ms`);

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
    console.log(`⏱️ Response Processing: ${Date.now() - processingStart}ms (${chunkCount} chunks)`);

    const totalTime = Date.now() - overallStart;
    console.log(`🎯 TOTAL REQUEST TIME: ${totalTime}ms`);
    
    // Alert if any part is slow
    if (totalTime > 3000) console.warn('🐌 SLOW REQUEST DETECTED');
    if (Date.now() - awsCallStart > 2000) console.warn('🐌 AWS CALL IS SLOW');

    return NextResponse.json({ 
      response: fullResponse,
      debugTiming: {
        total: totalTime,
        awsCall: Date.now() - awsCallStart,
        chunks: chunkCount
      }
    });
    
  } catch (error) {
    console.error('❌ Bedrock Agent error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
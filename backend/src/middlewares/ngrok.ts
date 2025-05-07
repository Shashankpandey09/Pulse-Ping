import ngrok from 'ngrok';

export const Ngrok = async (): Promise<string> => {
  try {
    // 1. Explicit configuration
    const url = await ngrok.connect({
      proto: 'http',
      addr: parseInt(process.env.PORT!) || 3000,
      region: 'us', // Explicit region
      authtoken: process.env.NGROK_AUTHTOKEN, // Required for persistent tunnels
      web_addr: 'localhost:4040' // Force default API port
    });

    console.log('✅ Ngrok tunnel established:', url);
    return url;
  } catch (error) {
    console.error('❌ Ngrok connection failed:', error);
    throw new Error('Failed to initialize ngrok');
  }
};
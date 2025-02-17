export const CONFIG = {
    API: {
        KEY: 'AIzaSyBkq20j1-O0T2SUNWtDDz4NRikUyq1Mf4g',
        BASE_URL: 'wss://generativelanguage.googleapis.com/ws',
        VERSION: 'v1alpha',
        MODEL_NAME: 'models/gemini-2.0-flash-exp'
    },
    // You can change the system instruction to your liking
    SYSTEM_INSTRUCTION: {
        TEXT: 'You are my helpful assistant. You can see and hear me, and respond with voice and text.',
    },
    // Model's voice
    VOICE: {
        NAME: 'Aoede' // You can choose one from: Puck, Charon, Kore, Fenrir, Aoede (Kore and Aoede are female voices, rest are male)
    },
    // Default audio settings
    AUDIO: {
        INPUT_SAMPLE_RATE: 16000,
        OUTPUT_SAMPLE_RATE: 24000,      // If you want to have fun, set this to around 14000 (u certainly will)
        BUFFER_SIZE: 7680,
        CHANNELS: 1
    },
    // If you are working in the RoArm branch 
    // ROARM: {
    //     IP_ADDRESS: '192.168.1.4'
    // }
    PINECONE: {
        API_KEY: '',
        ENVIRONMENT: '',
        INDEX: ''
    },
    setPineconeConfig(apiKey, environment, index){
        this.PINECONE.API_KEY = apiKey;
        this.PINECONE.ENVIRONMENT = environment;
        this.PINECONE.INDEX = index;
    }
  };
  
  export default CONFIG;

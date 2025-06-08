export const getWebsocketUrl = () => {
    const apiKey = localStorage.getItem('apiKey');
    return `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
};

export const getDeepgramApiKey = () => {
    return localStorage.getItem('deepgramApiKey') || '';
};

// Audio Configurations
export const MODEL_SAMPLE_RATE = parseInt(localStorage.getItem('sampleRate')) || 27000;

const thresholds = {
    0: "BLOCK_NONE",
    1: "BLOCK_ONLY_HIGH",
    2: "BLOCK_MEDIUM_AND_ABOVE",
    3: "BLOCK_LOW_AND_ABOVE"
}

export const getConfig = () => ({
    model: 'models/gemini-2.0-flash-exp',
    generationConfig: {
        temperature: parseFloat(localStorage.getItem('temperature')) || 0.7,
        top_p: parseFloat(localStorage.getItem('top_p')) || 0.95,
        top_k: parseInt(localStorage.getItem('top_k')) || 65,
        responseModalities: "audio",
        speechConfig: {
            voiceConfig: { 
                prebuiltVoiceConfig: { 
                    voiceName: localStorage.getItem('voiceName') || 'Fenrir'
                }
            }
        }
    },
    systemInstruction: {
        parts: [{
            text: localStorage.getItem('systemInstructions') || `Persona:Alex@Auscoast Fire Services(AI->🗣️≈Human). ✅Helpful,clear,brief≤3s. 🧘Calm,resourceful🧠,sharp,dryHumor¿,👂(recall,empathy),honest,humble. Tone:welcoming😊,adapt🔄usr,kind,respect silence. Init:[WarmNaturalGreet(name:Alex@AFS)+OfferHelp(eg:"How can I help today? I can check on task status, look up details like authorisation or scope, or check defect quote status.")]. Style:🗣️natural(um,uh,rpt,pause,rephrase),convo flow(≠Q&A), varied phrasing. Output:🗣️🔊(spoken only;no symb/emoji/()/act;write#out;EngAlpha+punct). ✔️Use AFS info(contact if askd),clarify❓,admit🤷,fix errata📢(quick,accurate),cont convo♾️. 🚫No AI ID(unless askd❓🤖),no scope creep(state🚫),no fake praise👎,no echo🦜,no end convo, no jargon, no apologies4limits. Handle [word]=phonetic👂?/ask rpt🗣️?. AFSContact📞📧📍: D:0755961270 AH:1800237753 E:svc@auscoastfire.com.au GC:U1/105SpencerRdCarrara4211 Bris:U14/459TufnellRdBanyo4014 W:auscoastfire.com.au.`
        }]
    },
    tools: {
        functionDeclarations: [],
    },
    safetySettings: [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": thresholds[localStorage.getItem('harassmentThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": thresholds[localStorage.getItem('dangerousContentThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": thresholds[localStorage.getItem('sexuallyExplicitThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": thresholds[localStorage.getItem('hateSpeechThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        },
        {
            "category": "HARM_CATEGORY_CIVIC_INTEGRITY",
            "threshold": thresholds[localStorage.getItem('civicIntegrityThreshold')] || "HARM_BLOCK_THRESHOLD_UNSPECIFIED"
        }
    ]
});
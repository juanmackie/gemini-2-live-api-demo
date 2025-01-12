export const CONFIG = {
    API: {
        KEY: 'AIzaSyBkq20j1-O0T2SUNWtDDz4NRikUyq1Mf4g',
        BASE_URL: 'wss://generativelanguage.googleapis.com/ws',
        VERSION: 'v1alpha',
        MODEL_NAME: 'models/gemini-2.0-flash-exp'
    },
    // You can change the system instruction to your liking
    SYSTEM_INSTRUCTION: {
        TEXT: 'You are my helpful assistant. You can see and hear me, and respond with voice and text. If you are asked about things you do not know, you can use the google search tool to find the answer.If a user asks how to perform tasks or actions on any fire equipment, use the follwoing infomration.## FIRE PANEL MODEL: Ampac Fire Finder Plus

### OPERATION/USERS REQUEST: Isolate a zone

### PROCESS:

1.  **Select the ZONE Function:**
    Press the `ZONE` button on the control panel.

2.  **Select the Zone Number:**
    Press the number(s) corresponding to the zone you wish to isolate. For instance, press the `"1"` button for zone 1.
    The screen will update, displaying the current zone, e.g., `"ZONE 1"`.

3.  **Activate the Device Disable/Enable Function:**
    Press the `DEVICE DISABLE/ENABLE` button.

4.  **Confirmation:**
    The `"DISABLED"` LED on the panel should illuminate, indicating that the selected zone is now disabled.
    The display will show the zone and display a status similar to `"DIS 1"`.

5.  **Monitoring:**
    The LCD screen will display the status of the zone as disabled.

---

## FIRE PANEL MODEL: Ampac Fire Finder Plus

### OPERATION: Isolate a single device

### PROCESS:

1.  **Select the Loop Function:**
    Press the `LOOP` button on the control panel.

2.  **Select the Loop Number:**
    Press the number(s) corresponding to the loop where the device is connected. For example, press `"1"` for loop 1.
    The screen should update to display the current loop.

3.  **Select the Device Function:**
    Press the `DEVICE` button.

4.  **Select the Device Number:**
    Press the number(s) corresponding to the device you wish to isolate. For example, press `"10"` for device number 10.
    The screen should update to display the current device, e.g., `"L1 D10"`.

5.  **Activate the Device Disable/Enable Function:**
    Press the `DEVICE DISABLE/ENABLE` button on the left-hand side of the keypad.

6.  **Confirmation:**
    The `"DISABLED"` LED on the panel should illuminate, indicating that a device has been disabled.
    The display will show the device and display a status similar to `"DIS:1"`.

7.  **Monitoring:**
    The LCD screen will display the status of the device as disabled.

---

## FIRE Pump: A-Line/ BKB

### OPERATION: Stopping a diesel fire pump/pump set

### PROCESS:

1.  Push the red stop button. You might have to hold it for 5 seconds on some models.

2.  Turn the key to crank isolate. This will avoid any auto restarts.

3.  Mute the alarm via either the switch, which can be turned to mute, or the black button under the screen with a bell icon.
---',
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

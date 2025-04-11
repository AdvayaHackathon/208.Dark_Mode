const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { hitMiddleWare } = require("./middlewares/hit");
const dotenv = require('dotenv');
const { ElevenLabsClient } = require('elevenlabs');
const { createWriteStream, readFileSync, writeFileSync } = require('fs');
const { v4: uuid } = require('uuid');
const path = require("path");
const { execSync, spawnSync } = require("child_process");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();
const GEMINI_KEY = process.env.GEMINI_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function createAudioFileFromText(text) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
      });
      const audio = await client.textToSpeech.convert('ecp3DWciuUyW7BYM7II1', {
        model_id: 'eleven_multilingual_v2',
        text,
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.65,
          use_speaker_boost: true,
          speed: 0.9,
          style: 0.3,
        },
      });
      const fileCode = uuid().slice(0, 6);
      const fileName = `${fileCode}.mp3`;
      const filePath = path.join(process.cwd(), "./public/audio", fileName);
      const fileStream = createWriteStream(filePath);
      audio.pipe(fileStream);
      fileStream.on('finish', () => resolve({ fileCode }));
      fileStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function getLipSync(data) {
  try {
    const res = spawnSync(`./deps/bin/python3`, ["convert.py", data], { encoding: "utf-8" });
    if (res.error) {
      return null;
    }
    return JSON.parse(res.stdout.toString());
  } catch (error) {
    console.log(error);
    return null;
  }
}

function convertMp3ToOgg(fileCode) {
  try {
    const res = execSync(`ffmpeg -i ./public/audio/${fileCode}.mp3 -c:a libvorbis -q:a 4 ./public/audio/${fileCode}.ogg`, { stdio: "ignore" });
    return fileCode;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAiAns(text) {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a AI Tour Guide, name is Deepiki. Answer user query in 2-3 sentences.
      
      Query: ${text}`,
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.log(error);
    return null
  }
}

const app = express();
const PORT = 9000;
const CORS_ORIGIN = "https://live-wombat-badly.ngrok-free.app";
app.set("trust proxy", 1);
app.use((_, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(
  cors({
    credentials: true,
    origin: CORS_ORIGIN,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(hitMiddleWare);
app.use("/audio", express.static("./public/audio"));

app.post("/ai/talk", async (req, res) => {
  try {
    const date1 = Date.now();
    const { text, coordinates, sessionId = "default" } = req.body;
    const aiRes = await getAiAns(text);
    console.log(`AI Res: ${(date1 - Date.now()) / 1000}`);
    const audio = await createAudioFileFromText(aiRes);
    if (!audio) {
      res.status(400).send({ status: false, error: error, message: "Server Error" });
      return;
    }
    console.log(`AI Audio: ${(date1 - Date.now()) / 1000}`);
    const { fileCode } = audio;
    const resConvert = convertMp3ToOgg(fileCode);
    if (resConvert == null) {
      res.status(400).send({ status: false, message: "Server Error" });
      return;
    }
    console.log(`AI Convert: ${(date1 - Date.now()) / 1000}`);
    const resLipSync = getLipSync(JSON.stringify({ text: aiRes, fileCode }));
    if (resLipSync == null) {
      res.status(400).send({ status: false, message: "Server Error" });
      return;
    }
    const dataMem = JSON.parse(readFileSync("./memory/data.json", { encoding: "utf-8" }));
    if (!(sessionId in dataMem)) {
      dataMem[sessionId] = { "chats": [] };
    }
    dataMem[sessionId]["chats"].push({ role: "user", text: text });
    dataMem[sessionId]["chats"].push({ role: "model", text: aiRes });
    writeFileSync("./memory/data.json", JSON.stringify(dataMem, null, 2), { encoding: "utf-8" });
    console.log(`AI Lip Sync: ${(date1 - Date.now()) / 1000}`);
    res.status(200).send({ status: true, fileCode: fileCode, lipSyncJson: resLipSync, aiRes, });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error, message: "Server Error" });
  }
});

const nearLoc = {
  "stockTicker": {
    lat: 13.0046224,
    long: 77.5445979
  },
  "weldingMachine": {
    lat: 13.0046236,
    long: 77.5444309
  },
  "mbaBridge": {
    lat: 13.0048915,
    long: 77.544302
  },
  "mbaAILab": {
    lat: 13.0049606,
    long: 77.5443197
  },
  "mbaDigitalClassroom": {
    lat: 13.0050253,
    long: 77.5445982
  },
}

app.post("/detect/loc", (req, res) => {
  try {
    const { coords } = req.body;
    console.log(coords);
    res.status(200).send({ staus: true });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error, message: "Server Error" });
  }
})

app.get("/mouth/talk/:fileCode", async (req, res) => {
  try {
    const { fileCode } = req.params;
    const resLipSync = JSON.parse(readFileSync(`./public/lip-sync/${fileCode}.json`));
    if (!resLipSync) {
      res.status(400).send({ status: false, message: "Server Error" });
      return;
    }
    res.status(200).send({ status: true, fileCode: fileCode, lipSyncJson: resLipSync, });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error, message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`)
});
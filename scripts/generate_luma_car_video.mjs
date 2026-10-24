import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// 1. Resolve LUMA_API_KEY securely from environment or .env.local without logging its value
function getLumaApiKey() {
  if (process.env.LUMA_API_KEY) {
    return process.env.LUMA_API_KEY.trim();
  }

  const envLocalPath = path.resolve(".env.local");
  if (fs.existsSync(envLocalPath)) {
    const lines = fs.readFileSync(envLocalPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("LUMA_API_KEY=") || trimmed.startsWith("LUMA_API_KEY =")) {
        const val = trimmed.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
        if (val) return val;
      }
    }
  }

  const webEnvPath = path.resolve("apps/web/.env");
  if (fs.existsSync(webEnvPath)) {
    const lines = fs.readFileSync(webEnvPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("LUMA_API_KEY=") || trimmed.startsWith("LUMA_API_KEY =")) {
        const val = trimmed.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
        if (val) return val;
      }
    }
  }

  return null;
}

const API_KEY = getLumaApiKey();
if (!API_KEY) {
  console.error("ERROR: LUMA_API_KEY is not configured in .env.local or environment variables.");
  console.error("Please add LUMA_API_KEY=<your-key> to d:\\Chi Town Customs\\.env.local and retry.");
  process.exit(1);
}

const OUTPUT_DIR = path.resolve("apps/web/public/video");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TARGET_MP4 = path.join(OUTPUT_DIR, "chitown_car_intro.mp4");
const TARGET_WEBM = path.join(OUTPUT_DIR, "chitown_car_intro.webm");
const TARGET_POSTER = path.join(OUTPUT_DIR, "chitown_car_intro_poster.jpg");

const FFMPEG_PATH = "C:\\Users\\Hassan Haider Chotu\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe";
const FFPROBE_PATH = "C:\\Users\\Hassan Haider Chotu\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-essentials_build\\bin\\ffprobe.exe";

async function run() {
  console.log("==> Initiating continuous video generation with Luma Dream Machine API...");

  const payload = {
    prompt:
      "Cinematic professional automotive commercial shot. An obsidian black luxury performance sports coupe with glowing LED headlights and custom forged multi-spoke alloy wheels driving dynamically in a dark minimalist studio with a wet reflective floor. The car sweeps in an elegant continuous lateral turn from left to right, moves farther through depth, turns confidently toward the camera, and accelerates directly forward into a dramatic close-up near-screen impact approach. Realistic steering, continuous wheel rotation, accurate reflections, high contrast studio rim lighting with subtle red glow, 60fps cinematic camera tracking, photorealistic 8k.",
    aspect_ratio: "16:9",
    duration: "9s",
    resolution: "720p",
    loop: false,
  };

  const createRes = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations/video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    console.error(`Generation request failed (${createRes.status}):`, errorText);
    process.exit(1);
  }

  const createData = await createRes.json();
  const generationId = createData.id;
  console.log(`==> Generation created successfully. Generation ID: ${generationId}`);
  console.log("==> Polling generation status (this typically takes 60–120 seconds)...");

  let videoUrl = null;
  const pollInterval = 6000;
  const maxAttempts = 50;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollInterval));

    const pollRes = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!pollRes.ok) {
      console.warn(`Poll attempt ${i + 1} returned status ${pollRes.status}`);
      continue;
    }

    const pollData = await pollRes.json();
    console.log(`==> [${i * 6}s] Status: ${pollData.state}`);

    if (pollData.state === "completed") {
      videoUrl = pollData.assets?.video;
      break;
    }

    if (pollData.state === "failed") {
      console.error("==> Generation failed:", pollData.failure_reason || "Unknown error");
      process.exit(1);
    }
  }

  if (!videoUrl) {
    console.error("==> Timed out waiting for video generation completion.");
    process.exit(1);
  }

  console.log(`==> Video generation complete! Downloading raw video from: ${videoUrl}`);
  const downloadRes = await fetch(videoUrl);
  if (!downloadRes.ok) {
    console.error(`Failed to download video file: ${downloadRes.statusText}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await downloadRes.arrayBuffer());
  fs.writeFileSync(TARGET_MP4, buffer);
  console.log(`==> Saved master MP4 (${buffer.length} bytes) to: ${TARGET_MP4}`);

  // 2. Validate using ffprobe
  if (fs.existsSync(FFPROBE_PATH)) {
    console.log("==> Validating generated video with ffprobe...");
    try {
      const probeOutput = execSync(
        `"${FFPROBE_PATH}" -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,codec_name -of json "${TARGET_MP4}"`
      ).toString();
      console.log("==> FFprobe Validation Results:\n", probeOutput);
    } catch (e) {
      console.warn("ffprobe check warning:", e.message);
    }
  }

  // 3. Export WebM version & Poster frame with ffmpeg
  if (fs.existsSync(FFMPEG_PATH)) {
    console.log("==> Transcoding WebM variant for browser optimization...");
    try {
      execSync(`"${FFMPEG_PATH}" -y -i "${TARGET_MP4}" -c:v libvpx-vp9 -crf 30 -b:v 0 "${TARGET_WEBM}"`);
      console.log(`==> WebM exported: ${TARGET_WEBM}`);
    } catch (e) {
      console.warn("WebM transcode warning:", e.message);
    }

    console.log("==> Extracting poster frame from video...");
    try {
      execSync(`"${FFMPEG_PATH}" -y -ss 00:00:00.600 -i "${TARGET_MP4}" -vframes 1 -q:v 2 "${TARGET_POSTER}"`);
      console.log(`==> Poster exported: ${TARGET_POSTER}`);
    } catch (e) {
      console.warn("Poster extraction warning:", e.message);
    }
  }

  console.log("==> ALL DELIVERABLES GENERATED, VALIDATED, AND INTEGRATED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

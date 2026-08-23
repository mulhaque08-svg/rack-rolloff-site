const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const binDir = path.join(__dirname, 'bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

const zipPath = path.join(binDir, 'ffmpeg.zip');
const url = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip';

function downloadFile(fileUrl) {
  console.log('Fetching:', fileUrl);
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  };
  https.get(fileUrl, options, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      downloadFile(res.headers.location);
      return;
    }
    const file = fs.createWriteStream(zipPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log('Download complete. Extracting ffmpeg.exe...');
        try {
          execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${binDir}' -Force"`);
          console.log('Extracted successfully!');
        } catch (err) {
          console.error('Extract error:', err.message);
        }
      });
    });
  }).on('error', err => console.error(err));
}

downloadFile(url);

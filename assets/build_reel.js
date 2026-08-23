const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const video1 = `C:\\Users\\fibrg\\Downloads\\Video 1.mp4`; // Clean site (848x480 horizontal)
const video2 = `C:\\Users\\fibrg\\Downloads\\Video 2.mp4`; // Debris site (1024x576 vertical rotated)
const photo = `C:\\Users\\fibrg\\.gemini\\antigravity\\brain\\0b4e9f61-09df-4ebf-b588-ed6b225c4a6c\\.user_uploaded\\media_1787515747081.jpg`;
const ffmpeg = path.join(__dirname, 'ffmpeg.exe');
const outputReel = path.join(__dirname, '..', 'assets', 'RackRolloff_Debris_Removal_Reel.mp4');
const desktopReel = `C:\\Users\\fibrg\\OneDrive\\1 Desktop 2026\\RackRolloff_Debris_Removal_Reel.mp4`;

console.log('Re-rendering 9:16 Reel so ALL segments ZOOM-FILL the full vertical frame (1080x1920)...');

/* 
  Plan:
  Use scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920
  This crops/fills the full 1080x1920 screen with NO blue bars or small middle boxes!
*/

const filterGraph = `
[1:v]trim=0:10,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=text='BEFORE CLEANUP':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0xc62828@0.95:boxborderw=15,drawtext=text='SITE DEBRIS & CLUTTER':fontcolor=yellow:fontsize=40:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.85:boxborderw=12[v0];

[0:v]trim=0:8,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=text='AFTER CLEANUP':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0x2e7d32@0.95:boxborderw=15,drawtext=text='100% CLEAN & CLEARED SITE':fontcolor=yellow:fontsize=40:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.85:boxborderw=12[v1];

[2:v]loop=loop=240:size=1:start=0,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=text='RACK ROLLOFF DUMPSTERS':fontcolor=white:fontsize=50:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0x0d47a1@0.95:boxborderw=15,drawtext=text='FAST & RELIABLE DEBRIS REMOVAL':fontcolor=yellow:fontsize=38:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.85:boxborderw=12,drawtext=text='CALL (832) 510-8005':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=1620:box=1:boxcolor=0x2e7d32@0.95:boxborderw=15,drawtext=text='WWW.RACKROLLOFF.COM':fontcolor=yellow:fontsize=42:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=1730:box=1:boxcolor=0x0d47a1@0.95:boxborderw=12[v2];

[v0][v1][v2]concat=n=3:v=1:a=0[vfinal]
`;

const cmd = `"${ffmpeg}" -y -i "${video1}" -i "${video2}" -i "${photo}" -filter_complex "${filterGraph.replace(/\n/g, '')}" -map "[vfinal]" -c:v libx264 -pix_fmt yuv420p -r 30 "${outputReel}"`;

console.log('Executing FFmpeg command...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Full-Frame Reel created successfully at:', outputReel);
  
  // Copy to Desktop
  fs.copyFileSync(outputReel, desktopReel);
  console.log('Full-Frame Reel copied to Desktop at:', desktopReel);
} catch (err) {
  console.error('Error rendering reel:', err.message);
}

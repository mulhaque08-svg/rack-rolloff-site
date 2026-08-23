const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const video1 = `C:\\Users\\fibrg\\Downloads\\Video 1.mp4`; // Clean site video
const video2 = `C:\\Users\\fibrg\\Downloads\\Video 2.mp4`; // Debris site video
const photo = `C:\\Users\\fibrg\\.gemini\\antigravity\\brain\\0b4e9f61-09df-4ebf-b588-ed6b225c4a6c\\.user_uploaded\\media_1787515747081.jpg`;
const ffmpeg = path.join(__dirname, 'ffmpeg.exe');
const outputReel = path.join(__dirname, '..', 'assets', 'RackRolloff_Debris_Removal_Reel.mp4');
const desktopReel = `C:\\Users\\fibrg\\OneDrive\\1 Desktop 2026\\RackRolloff_Debris_Removal_Reel.mp4`;

console.log('Rebuilding 9:16 Vertical Promo Reel with corrected sequence...');

/* 
  Corrected Sequence:
  1. FIRST: Video 2 (0-10s) -> BEFORE CLEANUP (Debris site)
  2. SECOND: Video 1 (0-8s) -> AFTER CLEANUP (Clean site)
  3. THIRD: Photo (8s) -> RACK ROLLOFF BRAND & CALL TO ACTION
*/

const filterGraph = `
[1:v]trim=0:10,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0d47a1,drawtext=text='BEFORE CLEANUP':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0xc62828@0.9:boxborderw=15,drawtext=text='SITE DEBRIS & CLUTTER':fontcolor=yellow:fontsize=40:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.8:boxborderw=12[v0];

[0:v]trim=0:8,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0d47a1,drawtext=text='AFTER CLEANUP':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0x2e7d32@0.9:boxborderw=15,drawtext=text='100% CLEAN & CLEARED SITE':fontcolor=yellow:fontsize=40:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.8:boxborderw=12[v1];

[2:v]loop=loop=240:size=1:start=0,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0d47a1,drawtext=text='RACK ROLLOFF DUMPSTER RENTALS':fontcolor=white:fontsize=46:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=180:box=1:boxcolor=0x0d47a1@0.9:boxborderw=15,drawtext=text='FAST & RELIABLE DEBRIS REMOVAL':fontcolor=yellow:fontsize=40:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=100:box=1:boxcolor=0x0d47a1@0.8:boxborderw=12,drawtext=text='CALL (832) 510-8005':fontcolor=white:fontsize=56:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=1650:box=1:boxcolor=0x2e7d32@0.9:boxborderw=15,drawtext=text='WWW.RACKROLLOFF.COM':fontcolor=yellow:fontsize=42:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-text_w)/2:y=1750:box=1:boxcolor=0x0d47a1@0.9:boxborderw=12[v2];

[v0][v1][v2]concat=n=3:v=1:a=0[vfinal]
`;

const cmd = `"${ffmpeg}" -y -i "${video1}" -i "${video2}" -i "${photo}" -filter_complex "${filterGraph.replace(/\n/g, '')}" -map "[vfinal]" -c:v libx264 -pix_fmt yuv420p -r 30 "${outputReel}"`;

console.log('Executing FFmpeg command...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Corrected Reel created successfully at:', outputReel);
  
  // Copy to Desktop
  fs.copyFileSync(outputReel, desktopReel);
  console.log('Corrected Reel copied to Desktop at:', desktopReel);
} catch (err) {
  console.error('Error rendering reel:', err.message);
}

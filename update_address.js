const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const htmlFiles = getFiles(__dirname + '/..');

const oldAddr1 = "9803 Highway 242, Suite 200-203<br>Conroe, TX 77385";
const newAddr1 = "27128 Hanna Road<br>Conroe, TX 77385";

const oldAddr2 = "9803 Highway 242, Suite 200-203 Conroe TX 77385";
const newAddr2 = "27128 Hanna Road, Conroe, TX 77385";

let updatedCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;

  if (content.includes(oldAddr1)) {
    content = content.replaceAll(oldAddr1, newAddr1);
    updated = true;
  }
  if (content.includes(oldAddr2)) {
    content = content.replaceAll(oldAddr2, newAddr2);
    updated = true;
  }

  // Replace placeholder city addresses if present
  if (content.includes('1301 Fannin St')) {
    content = content.replace(/1301 Fannin St, [^<]+<\/li>/g, '27128 Hanna Road, Conroe, TX 77385</li>');
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(__dirname + '/..', file)}`);
    updatedCount++;
  }
});

console.log(`Total HTML files updated with new address: ${updatedCount}`);

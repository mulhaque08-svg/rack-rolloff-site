import os
import glob

html_files = glob.glob("**/*.html", recursive=True)

old_addr1 = "9803 Highway 242, Suite 200-203<br>Conroe, TX 77385"
new_addr1 = "27128 Hanna Road<br>Conroe, TX 77385"

old_addr2 = "9803 Highway 242, Suite 200-203 Conroe TX 77385"
new_addr2 = "27128 Hanna Road, Conroe, TX 77385"

# Also check city page footers with old placeholder 1301 Fannin St
old_fannin = "1301 Fannin St"

updated_files = []

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    new_content = content
    if old_addr1 in new_content:
        new_content = new_content.replace(old_addr1, new_addr1)
    if old_addr2 in new_content:
        new_content = new_content.replace(old_addr2, new_addr2)
    
    # Update city page address footers if present
    lines = new_content.splitlines()
    modified_lines = []
    for line in lines:
        if "1301 Fannin St" in line:
            # Replace placeholder city address with official headquarters address
            line = line.split("</i>")[0] + "</i> 27128 Hanna Road, Conroe, TX 77385</li>"
        modified_lines.append(line)
    
    new_content = "\n".join(modified_lines)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated_files.append(file_path)

print(f"Updated {len(updated_files)} HTML files:")
for u in updated_files:
    print(f" - {u}")

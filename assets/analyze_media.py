import os
import subprocess
import json

video1 = r"C:\Users\fibrg\Downloads\Video 1.mp4"
video2 = r"C:\Users\fibrg\Downloads\Video 2.mp4"
photo = r"C:\Users\fibrg\.gemini\antigravity\brain\0b4e9f61-09df-4ebf-b588-ed6b225c4a6c\.user_uploaded\media_1787515747081.jpg"

print(f"Video 1 exists: {os.path.exists(video1)}, size: {os.path.getsize(video1) if os.path.exists(video1) else 0}")
print(f"Video 2 exists: {os.path.exists(video2)}, size: {os.path.getsize(video2) if os.path.exists(video2) else 0}")
print(f"Photo exists: {os.path.exists(photo)}, size: {os.path.getsize(photo) if os.path.exists(photo) else 0}")

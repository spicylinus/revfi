import subprocess
import json

def get_images(url):
    cmd = f'agent-browser open {url} && agent-browser evaluate "Array.from(document.images).map(i => i.src)"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)

print("Spruce Salon:")
get_images("https://www.sprucesalonaustin.com/")
print("\nS & D Plumbing:")
get_images("https://sanddplumbing.com/")

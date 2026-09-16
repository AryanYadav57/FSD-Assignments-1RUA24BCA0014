import urllib.request
import json

urls = [
  'https://unsplash.com/photos/mEZ3PoFGs_k/download',
  'https://unsplash.com/photos/ZHvM3XIOHoE/download',
  'https://unsplash.com/photos/tB5ZZtHZ_tI/download',
  'https://unsplash.com/photos/cBOYwonp_Ao/download',
  'https://unsplash.com/photos/NZwALpHszuI/download',
  'https://unsplash.com/photos/h7L-SRej-sw/download'
]

results = {}

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirectHandler)

for url in urls:
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    })
    try:
        res = opener.open(req)
        results[url] = {"status": res.status, "location": res.getheader('Location')}
    except urllib.error.HTTPError as e:
        results[url] = {"status": e.code, "location": e.headers.get('Location')}

print(json.dumps(results, indent=2))

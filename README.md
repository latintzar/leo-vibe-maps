# Leo Vibe Maps

An Airbnb map extension that highlights neighbourhoods by vibe

Leo Vibe Maps is a Chrome extension that adds neighbourhood areas and vibe tags to accommodation search maps.

![Leo Vibe Maps](https://atelierneyra.com/assets/product-motion-v4/leo-vibe-maps.jpg)

[Open demo](https://preview.atelierneyra.com/apps/vibe-maps/) · [Project website](https://atelierneyra.com/vibe-maps/) · [Documentation](https://docs.atelierneyra.com/leo-vibe-maps/overview/) · [GitHub](https://github.com/latintzar/leo-vibe-maps) · [Download extension](https://github.com/latintzar/leo-vibe-maps/releases/download/v0.1.0-source-beta/leo-vibe-maps.zip)

## What it does

The extension draws the original Gothic Quarter, El Born, Gràcia, Barceloneta and Eixample areas on a supported map. Hover for tags and select an area to explore it. The separate interactive demo shows the same source areas on an OpenStreetMap-backed map.

## Install and run

Download and unzip the extension. Open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extracted folder. Open an Airbnb Barcelona search map, open the extension popup, and select **Show Barcelona Areas**. The unpacked extension was tested on an Airbnb Barcelona search and created all five circles. Host-site changes may affect compatibility.

For the separate interactive example:

```sh
git clone https://github.com/latintzar/leo-vibe-maps.git
cd leo-vibe-maps/demo
python3 -m http.server 18873 --bind 127.0.0.1
```

Open http://127.0.0.1:18873.

## Credentials and status

The five Barcelona examples need no key. Custom generation accepts your Gemini API key for one request and sends your trip description directly to Gemini; provider charges may apply. The extension does not save the key. No provider call was made during recovery.

## Source and agent instructions

Recovered from `latintzar/puedo_casa`, master `d461e9556f09ad526030376ab58643298e3a1fc8`, via the public Home Matching extraction. The extension is in `extension/`; `demo/areas.js` retains its original area list. Keep the demo distinct from the live page integration and verify site compatibility after changes. Original code is MIT licensed; dependencies, map tiles and the Lucide icon retain their own licenses.

## Development checks

```sh
cd extension
npm ci --ignore-scripts
npx --no-install playwright install chromium
npm test
```

The offline browser check renders hostile generated text through both map-card implementations. Generated areas are bounded to ten, with finite coordinates, a bounded radius, plain text, three itinerary items and six-digit hex colours. Provider requests remain an explicit action using the recipient’s key.

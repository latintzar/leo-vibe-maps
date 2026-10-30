# Leo Vibe Maps

Leo Vibe Maps is a Chrome extension that overlays Barcelona neighbourhood areas and vibe tags on accommodation search maps. The repository preserves the recovered Manifest V3 extension and an interactive map of its five original example areas.

## Install

Download the extension ZIP from the demo, unzip it, open `chrome://extensions`, enable Developer mode and select **Load unpacked**, then choose the extracted directory. On a supported Airbnb or Booking search map, open the toolbar popup and select **Show Barcelona Areas**. These overlays depend on the host site’s map implementation; browser and website changes can affect compatibility.

The custom-area option accepts your own Gemini API key for a single request. Your browser sends the trip description and key directly to Gemini; provider usage may incur charges. The key is not saved by the extension. Default Barcelona areas do not require a key.

## Source and rights

Recovered from `latintzar/puedo_casa`, master `d461e9556f09ad526030376ab58643298e3a1fc8`, via the public Home Matching source extraction. The original extension is under `extension/`. `demo/areas.js` is extracted from its original neighbourhood list; the demo draws those areas on an OpenStreetMap-backed Leaflet map as an interactive example. It is separate from the extension’s page integration. Original code is MIT licensed; dependencies, map tiles, and the Lucide icon retain their own licenses. See the icon’s adjacent license and third-party notices.

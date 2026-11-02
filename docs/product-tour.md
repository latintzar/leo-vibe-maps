# Product tour

Leo Vibe Maps is a Chrome extension for travellers comparing neighbourhoods while browsing accommodation maps. It places area circles, names and vibe tags in the map where the listing search is already happening.

[Open demo](https://preview.atelierneyra.com/apps/vibe-maps/) · [Install the extension](../README.md#install-and-run)

## Choose an area in Barcelona

1. Open the interactive example. The map shows the extension’s five source areas: Gothic Quarter, El Born, Gràcia, Barceloneta and Eixample.
2. Select **Gothic Quarter**. The map moves to the area and opens its tags: romantic, historic and nightlife.
3. Select **El Born**, then compare the other areas. The labels stay attached to their geographic circles as you move around the map.
4. Install the extension and open an Airbnb Barcelona search map. Choose **Show Barcelona Areas** in the toolbar popup to apply that idea to the existing accommodation map.
5. Hover or select a circle to read the area card and zoom. The popup’s activation control toggles the overlay.

The separate web example is a convenient way to explore the fixed area definitions. The extension is the reusable page integration. The unpacked source beta was checked on an Airbnb Barcelona search with all five circles; each host site’s current map integration needs its own compatibility check.

## Custom trip areas

The extension popup accepts a trip description and your Gemini key for that request. **Generate Custom Areas** sends the description to the background worker, which calls Gemini and returns structured neighbourhood areas. The page integration draws those areas and their local-search suggestions. Provider charges belong to the supplied account; the key stays transient for the request. Recovery checks exercised the deterministic areas and rendering boundaries; live custom generation has its own provider acceptance.

## Product areas and source

| Area | Actions and results | Source |
| --- | --- | --- |
| Toolbar popup | Detect the active accommodation page, activate/toggle areas, or submit a trip description. | [popup.html](../extension/popup.html), [popup.js](../extension/popup.js). |
| Page integration | Detect the search page, relay extension messages and inject the map renderer. | [content-script.js](../extension/content-script.js), [manifest.json](../extension/manifest.json). |
| Map overlay and cards | Draw area circles in the host map, show labels/cards and zoom to an area. | [injected-script.js](../extension/injected-script.js), [content-styles.css](../extension/content-styles.css). |
| Custom generation | Build the trip prompt, call Gemini and validate the returned area structure. | [background.js](../extension/background.js). |
| Standalone example | Explore the five fixed source areas on an OpenStreetMap basemap. | [demo/index.html](../demo/index.html), [demo/areas.js](../demo/areas.js). |
| Rendering checks | Exercise generated text through both map-card implementations. | [area-rendering.cjs](../extension/tests/area-rendering.cjs). |

## Design decisions

Native map circles keep area labels aligned with pan and zoom. The toolbar, isolated content script, main-world map renderer and provider-calling background worker have separate responsibilities. The fixed Barcelona path provides an immediate example; custom trip generation supplies a separately selected provider path.

The manifest declares Airbnb, Booking.com and Google Maps routes; popup activation currently recognizes Airbnb and Booking.com URLs. Treat the current source and a live host compatibility check as the integration contract. The retained architecture and area notes describe the original design and earlier provider settings.

## Continue from here

- [Install, local demo and development checks](../README.md#install-and-run).
- [Original extension architecture](../extension/docs/EXTENSION_ARCHITECTURE.md) and [area-design notes](../extension/docs/VIBE_AREAS.md), retained as historical references.
- [Current manifest](../extension/manifest.json) and [background worker](../extension/background.js) for permissions and provider configuration.
- [Third-party notices](../THIRD-PARTY-NOTICES.md) for map, icon and software terms.

A useful continuation is to verify one current accommodation map end to end, then add a fixture and browser check for its actual map API. Keep this extension separate from the Geospatial Agent console and Retail Location Similarity scorer.

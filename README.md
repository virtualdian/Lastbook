# Lastbook Den Haag-Loosduinen

Een offline noodgids voor Den Haag-Loosduinen en omgeving, gebaseerd op het idee achter
[Lastbook](https://lastbook.org): een bibliotheek die werkt als het internet weg is.
Dit is een web-app (PWA). Je installeert hem op je iPhone, Android, tablet of computer
en daarna werkt hij zonder internet.

## Wat zit erin

- **Gidsen** (Nederlands, offline): EHBO en reanimatie, water, voedsel, stroomuitval,
  overstroming, storm, onweer, de zee, alarmnummers, NL-Alert en de rampenzender, en een
  noodpakket-checklist.
- **Offline kaart** van Den Haag en omgeving (ongeveer 15 km rond Loosduinen) met
  hulppunten uit OpenStreetMap: AED's, ziekenhuizen, huisartsen, apotheken, brandweer,
  politie, reddingsbrigade, drinkwaterpunten, supermarkten, bouwmarkten, tankstations en
  verzamelpunten. Met afstand en richting vanaf je GPS-locatie, ook zonder internet.
- **Zoeken** in gidsen, straten, wijken en hulppunten.
- **Mijn plan**: een persoonlijk noodplan (contacten, verzamelpunten, medicijnen,
  overstroomik.nl-advies). Blijft alleen op het toestel, en is te printen of te delen.

## Op je iPhone zetten

1. Open de site in **Safari**.
2. Tik op **Deel** en kies **Zet op beginscherm**.
3. Open Lastbook vanaf je beginscherm en tik op **Kaart offline opslaan** (liefst via wifi).

Een app op het beginscherm heeft op iOS een eigen opslag. Sla de kaart daarom op vanuit
die app, niet vanuit Safari.

## Hoe het gebouwd wordt

Er is geen buildstap voor de app zelf: gewone HTML, CSS en JavaScript. De kaartdata wordt
bij elke publicatie gebouwd door de GitHub Actions-workflow
[`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `tools/build-data.mjs` haalt hulppunten, straten en wijknamen op via de Overpass API
   (OpenStreetMap) voor het gebied in [`area.json`](area.json).
2. `go-pmtiles extract` snijdt het gebied uit de dagelijkse wereldkaart van
   [Protomaps](https://protomaps.com) (maximaal 95 MB; anders een zoomniveau minder).
3. Lettertypen en kaarticonen komen uit `protomaps/basemaps-assets`.
4. `tools/write-meta.mjs` schrijft `data/meta.json`; daarna gaat alles naar GitHub Pages.

De workflow draait bij elke push, handmatig, en elke maand om de data te verversen.

**Eenmalig instellen:** in de repository *Settings → Pages → Build and deployment →
Source* kies je **GitHub Actions**.

### Lokaal testen

Je hebt een server nodig die HTTP Range-verzoeken ondersteunt (voor de kaart), bijvoorbeeld
`npx http-server` of `npx serve`. Zonder de map `data/` werken de gidsen en het plan wel,
maar de kaart en hulppunten niet.

### Ander gebied

Pas `area.json` aan (naam, middelpunt en `bbox` als `[west, zuid, oost, noord]`) en
publiceer opnieuw. De gidsen in `js/guides.js` zijn grotendeels landelijk; de lokale
stukken (Radio West, Dunea, Stedin, Delfland) moet je dan aanpassen.

## Belangrijk

Deze app vervangt geen EHBO- of reanimatiecursus, arts of de aanwijzingen van
hulpdiensten. Volg altijd NL-Alert, de rampenzender en de hulpverleners. Hulppunten uit
OpenStreetMap kunnen verouderd zijn.

## Licenties

Zie [NOTICE.md](NOTICE.md).

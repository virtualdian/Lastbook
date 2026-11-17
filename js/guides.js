/*
 * Lastbook Den Haag-Loosduinen: gidsen.
 * Alle tekst is offline beschikbaar. Elke gids heeft:
 *   id, cat, title, short, body (HTML), optioneel urgent (toon op startscherm),
 *   call112 (toon belknop bovenaan) en src (bronnen om online na te lezen).
 * Bronnen zijn bedoeld om bij te houden; ze zijn geen vervanging van een cursus.
 */
window.LB_CATEGORIES = [
  { id: "ehbo", title: "EHBO & medisch", icon: "plus", blurb: "Reanimatie, bloedingen, brandwonden, verslikking en meer." },
  { id: "basis", title: "Water, voedsel, stroom", icon: "drop", blurb: "Drinkwater, noodvoorraad, stroomuitval en warm blijven." },
  { id: "water", title: "Overstroming & storm", icon: "wave", blurb: "Hoogwater, dijk- of duindoorbraak, storm, onweer en de zee." },
  { id: "plan", title: "Communicatie & noodplan", icon: "radio", blurb: "Alarmnummers, NL-Alert, rampenzender en je eigen plan." },
  { id: "lokaal", title: "Jouw omgeving", icon: "pin", blurb: "Wie doet wat in Den Haag-Loosduinen en omgeving." }
];

window.LB_GUIDES = [
  /* ------------------------------------------------------------------ EHBO */
  {
    id: "reanimatie", cat: "ehbo", urgent: true, call112: true,
    title: "Reanimatie (iemand ademt niet)",
    short: "Niet aanspreekbaar en geen normale ademhaling: bel 112, druk 30 keer, beadem 2 keer.",
    body: `
<ol class="steps">
<li><b>Veilig?</b> Kijk of het voor jou veilig is (verkeer, stroom, water, rook).</li>
<li><b>Aanspreken en schudden</b> aan de schouders. Geen reactie? Roep om hulp.</li>
<li><b>Ademhaling controleren</b>: hoofd achterover, kin omhoog. Kijk, luister en voel maximaal 10 seconden. Alleen af en toe happen is <b>geen</b> normale ademhaling.</li>
<li><b>Bel 112</b> en zet je telefoon op de luidspreker. Zeg dat iemand niet ademt. De meldkamer kan burgerhulpverleners met een AED oproepen.</li>
<li><b>Laat iemand een AED halen</b> als die dichtbij is. Op de kaart in deze app staan AED's (filter "AED").</li>
<li><b>30 keer borstcompressies</b>: hiel van je hand midden op de borst (onderste helft van het borstbeen), andere hand erop, armen gestrekt. Druk 5 tot 6 cm diep, tempo 100 tot 120 per minuut (het ritme van "Stayin' Alive").</li>
<li><b>2 keer beademen</b>: neus dicht, mond over mond, blaas 1 seconde tot de borst omhoog komt.</li>
<li><b>Ga door met 30:2</b> tot de AED er is, hulpverleners het overnemen of het slachtoffer weer normaal ademt. Wissel elke 2 minuten van helper als dat kan.</li>
<li><b>AED</b>: zet hem aan en volg de gesproken instructies. Plak de elektroden op de blote borst. Raak het slachtoffer niet aan tijdens de analyse en de schok.</li>
</ol>
<div class="note"><b>Wil of kun je niet beademen?</b> Geef dan alleen borstcompressies, zonder te stoppen. Dat is veel beter dan niets doen.</div>
<div class="note"><b>Kind of drenkeling:</b> begin met 5 beademingen en ga daarna door met 30:2.</div>
<div class="tip">Een reanimatiecursus duurt een avond. Bij een echte noodsituatie is dat het verschil. Zoek een cursus bij de Hartstichting, het Rode Kruis of de EHBO-vereniging in de buurt.</div>`,
    src: ["Nederlandse Reanimatieraad, richtlijn 2021 (reanimatieraad.nl)", "Hartstichting: reanimatie in 6 stappen (hartstichting.nl)"]
  },
  {
    id: "bloeding", cat: "ehbo", urgent: true, call112: true,
    title: "Ernstige bloeding",
    short: "Druk hard en lang op de wond. Levensbedreigend aan arm of been: knelverband.",
    body: `
<ol class="steps">
<li><b>Bel 112</b> bij een flinke bloeding, of laat een ander bellen.</li>
<li><b>Druk direct en hard</b> op de wond met een schone doek, verband of desnoods je hand (gebruik handschoenen of een plastic zak als je die hebt).</li>
<li><b>Blijf drukken</b>. Niet steeds kijken. Bloedt het door? Leg er extra materiaal bovenop, niet de eerste laag weghalen.</li>
<li><b>Drukverband</b>: houd druk met een stevig omwonden verband.</li>
<li><b>Levensbedreigende bloeding aan arm of been</b> die niet stopt met drukken: leg een knelverband (tourniquet) 5 tot 7 cm boven de wond, niet op een gewricht. Draai aan tot het bloeden stopt. Noteer de tijd en laat het zitten tot hulpverleners het overnemen.</li>
<li><b>Laat het slachtoffer liggen</b> en houd hem of haar warm. Blijf erbij.</li>
</ol>
<div class="note">Zit er iets in de wond (glas, mes, hout)? <b>Niet uittrekken.</b> Druk eromheen en zet het vast.</div>`,
    src: ["Rode Kruis EHBO-app en rodekruis.nl: ernstige bloeding", "Het Oranje Kruis: Oranje Kruis Boekje"]
  },
  {
    id: "verslikking", cat: "ehbo", urgent: true, call112: true,
    title: "Verslikking",
    short: "Laat hoesten. Lukt dat niet: 5 rugslagen, dan 5 buikstoten, herhalen.",
    body: `
<ol class="steps">
<li><b>Kan iemand nog hoesten of praten?</b> Moedig hoesten aan. Niet op de rug slaan.</li>
<li><b>Kan iemand niet meer hoesten, praten of ademen?</b> Laat diegene voorover leunen en geef <b>5 krachtige slagen</b> tussen de schouderbladen met de hiel van je hand.</li>
<li>Helpt dat niet: <b>5 buikstoten</b>. Ga achter het slachtoffer staan, vuist net boven de navel, andere hand eromheen, en trek krachtig naar binnen en omhoog.</li>
<li><b>Wissel af</b>: 5 rugslagen, 5 buikstoten. Laat intussen 112 bellen.</li>
<li><b>Wordt iemand bewusteloos?</b> Leg diegene op de grond, bel 112 en begin met <a href="#/gids/reanimatie">reanimatie</a>.</li>
</ol>
<div class="note"><b>Baby (jonger dan 1 jaar):</b> geen buikstoten. Leg de baby op je onderarm met het hoofd omlaag en geef 5 rugslagen. Draai dan om en geef 5 borststoten met twee vingers op het borstbeen.</div>
<div class="note">Na buikstoten moet iemand altijd door een arts worden nagekeken.</div>`,
    src: ["Nederlandse Reanimatieraad: verslikking", "Rode Kruis: verslikking"]
  },
  {
    id: "bewusteloos", cat: "ehbo", urgent: true,
    title: "Bewusteloos maar ademt wel",
    short: "Leg iemand in stabiele zijligging en blijf de ademhaling controleren.",
    body: `
<ol class="steps">
<li><b>Bel 112.</b></li>
<li><b>Controleer de ademhaling</b>: hoofd achterover, kin omhoog, maximaal 10 seconden.</li>
<li><b>Stabiele zijligging</b>: arm aan jouw kant in een hoek omhoog. Andere hand met de rug tegen de wang aan jouw kant. Verre knie optrekken. Trek aan die knie het slachtoffer naar je toe op de zij. Hoofd iets achterover zodat de mond naar beneden wijst.</li>
<li><b>Houd warm</b> met een deken of jas.</li>
<li><b>Controleer elke minuut</b> of de ademhaling normaal blijft. Stopt de ademhaling: <a href="#/gids/reanimatie">reanimatie</a>.</li>
</ol>
<div class="note">Vermoed je letsel aan nek of rug (val, verkeersongeluk) en ademt iemand goed? Beweeg zo min mogelijk en houd het hoofd stil.</div>`,
    src: ["Rode Kruis: stabiele zijligging"]
  },
  {
    id: "beroerte", cat: "ehbo", urgent: true, call112: true,
    title: "Beroerte (herseninfarct of -bloeding)",
    short: "Scheve mond, lamme arm, verwarde spraak: bel direct 112. Elke minuut telt.",
    body: `
<p>Gebruik de <b>FAST-test</b>:</p>
<ul class="checks">
<li><b>Face</b>: vraag om te lachen. Hangt een mondhoek?</li>
<li><b>Arm</b>: laat beide armen strekken. Zakt er een weg?</li>
<li><b>Speech</b>: is de spraak onduidelijk of verward?</li>
<li><b>Time</b>: zie je één van deze dingen? <b>Bel meteen 112</b> en onthoud hoe laat het begon.</li>
</ul>
<ol class="steps">
<li>Laat iemand zitten of liggen, met hoofd en schouders iets omhoog.</li>
<li>Geef niets te eten, drinken of medicijnen.</li>
<li>Bewusteloos maar ademt: <a href="#/gids/bewusteloos">stabiele zijligging</a>. Ademt niet: <a href="#/gids/reanimatie">reanimatie</a>.</li>
</ol>`,
    src: ["Hersenstichting: herken een beroerte (FAST)"]
  },
  {
    id: "brandwond", cat: "ehbo", urgent: true,
    title: "Brandwond",
    short: "Direct 10 minuten koelen met lauw, zacht stromend kraanwater. Geen ijs.",
    body: `
<ol class="steps">
<li><b>Haal de bron weg</b> en zorg dat het veilig is. Brandende kleding: laat iemand rollen of doof met een deken.</li>
<li><b>Koel 10 minuten</b> met lauw, zacht stromend kraanwater. Geen ijs of ijskoud water. Geen kraanwater? Gebruik ander schoon, koel water.</li>
<li>Doe <b>ringen, horloges en losse kleding</b> uit voor het opzwelt. Kleding die vastgeplakt zit: laten zitten.</li>
<li><b>Dek af</b> met huishoudfolie of een schone, niet-pluizende doek. Geen zalf, boter of tandpasta.</li>
<li><b>Bel 112 of de huisarts(enpost)</b> bij: een brandwond groter dan de handpalm van het slachtoffer, blaren of wit/zwart verbrande huid, brandwonden in gezicht, handen, voeten, gewrichten of geslachtsdelen, bij jonge kinderen en ouderen, en bij chemische of elektrische brandwonden.</li>
</ol>
<div class="note">Koel kinderen en grote oppervlakken niet te lang: houd de rest van het lichaam warm, anders kan iemand onderkoeld raken.</div>`,
    src: ["Brandwondenstichting: eerste hulp bij brandwonden", "Rode Kruis: brandwonden"]
  },
  {
    id: "koolmonoxide", cat: "ehbo", urgent: true, call112: true,
    title: "Koolmonoxide (CO-vergiftiging)",
    short: "Hoofdpijn, duizelig of misselijk met meerdere mensen tegelijk? Naar buiten, bel 112.",
    body: `
<p>Koolmonoxide ruik en zie je niet. Het risico stijgt bij stroomuitval, als mensen binnen gaan stoken of koken met dingen die daar niet voor zijn.</p>
<ol class="steps">
<li><b>Zet ramen en deuren wijd open</b> en ga naar buiten.</li>
<li><b>Bel 112</b>, ook als het slachtoffer weer bijkomt.</li>
<li>Zet het apparaat uit als dat veilig kan.</li>
<li>Is iemand bewusteloos: naar buiten brengen als dat kan zonder zelf lang binnen te blijven, dan <a href="#/gids/bewusteloos">zijligging</a> of <a href="#/gids/reanimatie">reanimatie</a>.</li>
</ol>
<div class="warn"><b>Nooit binnen gebruiken:</b> barbecue, houtskool, terrasverwarmer, gasstel op een gasfles, aggregaat of generator. Ook niet in een schuur, garage of tent.</div>
<div class="tip">Hang een CO-melder bij je cv-ketel, geiser of houtkachel.</div>`,
    src: ["Brandweer Nederland: koolmonoxide", "Rijksoverheid: koolmonoxidevergiftiging voorkomen"]
  },
  {
    id: "allergie", cat: "ehbo", urgent: true, call112: true,
    title: "Ernstige allergische reactie",
    short: "Benauwd, zwelling, flauw na een prik of eten: adrenalinepen in het bovenbeen, bel 112.",
    body: `
<ol class="steps">
<li><b>Bel 112.</b></li>
<li><b>Adrenalinepen</b> (zoals EpiPen) aanwezig? Help iemand de pen in de buitenkant van het bovenbeen te zetten, zo nodig door de broek heen. Houd vast volgens de bijsluiter.</li>
<li><b>Benauwd?</b> Laat iemand rechtop zitten. <b>Duizelig of bleek?</b> Laat liggen met de benen omhoog.</li>
<li>Geen verbetering na 5 tot 15 minuten en er is een tweede pen: gebruik die (andere been).</li>
<li>Bewusteloos en ademt niet: <a href="#/gids/reanimatie">reanimatie</a>.</li>
</ol>`,
    src: ["Thuisarts.nl: anafylactische reactie", "Rode Kruis: allergische reactie"]
  },
  {
    id: "onderkoeling", cat: "ehbo",
    title: "Onderkoeling",
    short: "Rillen, verward, traag: rustig naar een warme plek, droge kleding, warm inpakken.",
    body: `
<p>Onderkoeling kan ook binnen als het huis lang onverwarmd is, zeker bij ouderen en baby's. En na een val in zee of een sloot.</p>
<ol class="steps">
<li><b>Breng iemand voorzichtig</b> naar een warme, droge en windstille plek. Ruw bewegen kan gevaarlijk zijn bij ernstige onderkoeling.</li>
<li><b>Natte kleding uit</b>, droge kleding aan.</li>
<li><b>Inpakken</b> in dekens, ook het hoofd. Een reddingsdeken helpt.</li>
<li><b>Warme, zoete drank</b> als iemand goed wakker is en kan slikken. Geen alcohol.</li>
<li><b>Niet wrijven</b> of masseren, en geen heet bad.</li>
<li><b>Bel 112</b> als iemand verward of suf wordt, stopt met rillen of bewusteloos raakt.</li>
</ol>`,
    src: ["Rode Kruis: onderkoeling"]
  },
  {
    id: "drenkeling", cat: "ehbo", call112: true,
    title: "Drenkeling of iemand in nood in zee",
    short: "Niet zelf de zee in zonder drijfmiddel. Bel 112, vraag om de reddingsbrigade of KNRM.",
    body: `
<ol class="steps">
<li><b>Bel 112</b> en zeg dat het om iemand in zee gaat. Noem een strandopgang of paalnummer als je dat ziet (de strandpalen staan langs het hele strand).</li>
<li><b>Houd de persoon in het oog</b> en wijs voor de hulpverleners.</li>
<li><b>Gooi iets dat drijft</b> (reddingsboei, bal, koelbox, surfplank).</li>
<li><b>Ga niet zelf het water in</b> zonder drijfmiddel. Veel redders verdrinken zelf.</li>
<li>Is iemand uit het water en ademt niet: <a href="#/gids/reanimatie">reanimatie</a>, begin met 5 beademingen.</li>
<li>Daarna: <a href="#/gids/onderkoeling">onderkoeling</a> voorkomen.</li>
</ol>
<div class="tip">Zie ook <a href="#/gids/zee">Strand en zee: muistroom</a>.</div>`,
    src: ["KNRM en Reddingsbrigade Nederland: veilig zwemmen in zee", "Nederlandse Reanimatieraad: verdrinking"]
  },
  {
    id: "shock", cat: "ehbo",
    title: "Shock",
    short: "Bleek, klam, snelle pols na een ongeluk of bloeding: laten liggen, warm houden, 112.",
    body: `
<p>Shock betekent dat de organen te weinig bloed krijgen. Het kan ontstaan na een bloeding, ernstige brandwond, allergie of uitdroging.</p>
<ol class="steps">
<li><b>Bel 112.</b></li>
<li>Behandel de oorzaak (bijvoorbeeld een <a href="#/gids/bloeding">bloeding</a> stoppen).</li>
<li>Laat iemand <b>plat liggen</b>. Houd warm met een deken, ook eronder.</li>
<li>Geen eten of drinken. Blijf erbij en stel gerust.</li>
</ol>`,
    src: ["Rode Kruis: shock"]
  },
  {
    id: "botbreuk", cat: "ehbo",
    title: "Botbreuk, verstuiking of hoofdletsel",
    short: "Niet bewegen, steunen in de houding waarin het ligt. Hoofdletsel: 24 uur in de gaten houden.",
    body: `
<ol class="steps">
<li>Laat de gewonde de pijnlijke plek <b>niet bewegen</b>. Ondersteun in de houding die het minst pijn doet (kussen, opgerolde jas, mitella).</li>
<li><b>Open botbreuk</b> (bot door de huid): dek af met een schone doek, niet terugduwen, bel 112.</li>
<li><b>Koel</b> een verstuiking 10 tot 20 minuten met koud water of ijs in een doek.</li>
<li><b>Hoofdletsel</b>: bel 112 bij bewusteloosheid, braken, verwardheid, ongelijke pupillen of vocht uit neus of oor. Anders: laat iemand de eerste 24 uur niet alleen en houd suf worden in de gaten.</li>
</ol>`,
    src: ["Rode Kruis: botbreuken", "Thuisarts.nl: hoofdletsel"]
  },
  {
    id: "medicijnen", cat: "ehbo",
    title: "Medicijnen en zorg op voorraad",
    short: "Houd een week extra van je vaste medicijnen in huis en een lijst op papier.",
    body: `
<ul class="checks">
<li>Een <b>voorraad van je vaste medicijnen</b> voor minstens een week extra. Vraag je apotheek of huisarts hoe dat kan.</li>
<li>Een <b>medicijnoverzicht op papier</b> (naam, dosering, waarvoor). Je apotheek kan het printen. Vul het ook in bij <a href="#/plan">Mijn plan</a>.</li>
<li>Medicijnen die <b>koel</b> moeten blijven (zoals insuline): koelelementen of een koeltas, en weet hoe lang het buiten de koelkast goed blijft (bijsluiter).</li>
<li><b>Hulpmiddelen op stroom</b> (zuurstof, thuisbeademing, elektrisch bed): vraag de leverancier om een noodplan en reservebatterijen. Meld het bij je netbeheerder als zij dat registreren.</li>
<li>EHBO-doos: pleisters, verband, steriele gaasjes, snelverband, schaar, pincet, handschoenen, reddingsdeken, paracetamol, wondontsmetting, eventueel een knelverband.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl): noodpakket", "Thuisarts.nl"]
  },

  /* --------------------------------------------------- WATER, VOEDSEL, STROOM */
  {
    id: "drinkwater", cat: "basis", urgent: true,
    title: "Drinkwater: voorraad en wat te doen bij uitval",
    short: "Reken op 3 liter per persoon per dag. Voor 72 uur is dat 9 liter per persoon.",
    body: `
<p>In Den Haag en omgeving komt het kraanwater van <b>Dunea</b>.</p>
<h3>Voorraad</h3>
<ul class="checks">
<li><b>3 liter per persoon per dag</b> om te drinken en een beetje te koken. Voor 3 dagen: 9 liter per persoon.</li>
<li>Denk aan <b>huisdieren</b>: een hond drinkt ongeveer 50 ml per kilo lichaamsgewicht per dag.</li>
<li>Flessenwater uit de winkel blijft lang goed. Kraanwater in schone, afgesloten flessen: ververs het elke paar maanden.</li>
</ul>
<h3>Als er een probleem met het water dreigt</h3>
<ol class="steps">
<li><b>Vul direct</b> flessen, pannen en een emmer met kraanwater. Vul ook het bad of grote bakken voor het doorspoelen van de wc en voor de afwas.</li>
<li><b>Luister naar Dunea en de rampenzender</b>. Er kan een <b>kookadvies</b> komen: dan water eerst koken voor je het drinkt of je tanden poetst.</li>
<li>Na een onderbreking: laat de kraan een paar minuten lopen tot het water helder is.</li>
</ol>
<div class="tip">Zie ook <a href="#/gids/water-zuiveren">Water veilig maken</a>.</div>`,
    src: ["Denk Vooruit (denkvooruit.nl): water", "Dunea (dunea.nl): storingen en kookadvies"]
  },
  {
    id: "water-zuiveren", cat: "basis",
    title: "Water veilig maken",
    short: "Eerst helder maken, dan minstens 1 minuut flink laten koken. Zeewater nooit drinken.",
    body: `
<ol class="steps">
<li><b>Gebruik eerst je voorraad</b> en kraanwater. Zuiveren is voor als het echt niet anders kan.</li>
<li><b>Kies het schoonste water</b>: regenwater uit een schone bak is beter dan slootwater. Drink <b>nooit zeewater</b> en geen water dat naar olie of chemicaliën ruikt: koken haalt dat er niet uit.</li>
<li><b>Laat bezinken</b> en giet het heldere deel door een schone doek of koffiefilter.</li>
<li><b>Koken</b>: breng het water aan de kook en laat het minstens <b>1 minuut flink borrelen</b>. Laat afkoelen met een deksel erop.</li>
<li><b>Geen kookmogelijkheid?</b> Gebruik tabletten om water te ontsmetten (buitensportwinkel, apotheek) volgens de verpakking. Een goede waterfilter haalt bacteriën eruit, maar niet altijd virussen.</li>
</ol>
<div class="warn">Water uit een overstroming is vaak vervuild met rioolwater en chemicaliën. Niet gebruiken om te drinken, ook niet gekookt, als er iets anders is.</div>`,
    src: ["Wereldgezondheidsorganisatie (WHO): boiling water", "RIVM: drinkwater in noodsituaties"]
  },
  {
    id: "voedsel", cat: "basis",
    title: "Voedselvoorraad voor 72 uur",
    short: "Houdbaar eten dat je zonder stroom en zonder koken kunt eten.",
    body: `
<p>Kies eten dat lang goed blijft, waar je familie van houdt, en dat je ook koud kunt eten.</p>
<ul class="checks">
<li>Brood dat lang houdbaar is: crackers, beschuit, knäckebröd, roggebrood.</li>
<li>Blikken: vis, bonen, soep, groente, fruit, kant-en-klare maaltijden. <b>Een blikopener</b> zonder stroom.</li>
<li>Pindakaas, noten, gedroogd fruit, muesli- of krentenbollen in folie.</li>
<li>Houdbare melk, sap, babyvoeding en dieetvoeding als dat nodig is.</li>
<li>Een <b>kookstel voor buiten</b> op gas of brandpasta, alleen buiten gebruiken (zie <a href="#/gids/koolmonoxide">koolmonoxide</a>).</li>
<li>Huisdierenvoer voor een paar dagen.</li>
</ul>
<div class="tip">Gebruik je voorraad gewoon in de keuken en vul bij wat je opmaakt. Zo blijft alles vers.</div>`,
    src: ["Denk Vooruit (denkvooruit.nl): voedsel en noodpakket"]
  },
  {
    id: "koelkast", cat: "basis",
    title: "Koelkast en vriezer bij stroomuitval",
    short: "Deur dicht houden. Koelkast blijft zo'n 4 uur koel, een volle vriezer zo'n 2 dagen.",
    body: `
<ul class="checks">
<li><b>Houd de deuren dicht.</b> Een dichte koelkast blijft ongeveer 4 uur koel.</li>
<li>Een <b>volle vriezer</b> blijft dicht ongeveer 48 uur koud, een halfvolle ongeveer 24 uur.</li>
<li><b>Eet eerst</b> wat in de koelkast bederft: vlees, vis, zuivel, restjes.</li>
<li>Koelkast lang warm geweest (meer dan 4 uur)? Gooi vlees, vis, zuivel, eieren en restjes weg. <b>Twijfel? Weggooien.</b> Ruik of proef niet om het te testen.</li>
<li>Diepvries dat nog ijskristallen heeft, mag je weer invriezen.</li>
<li>Het is winter en het vriest? Een koele berging of balkon kan helpen, maar houd het uit de zon en weg van dieren.</li>
</ul>`,
    src: ["Voedingscentrum: stroomstoring en eten", "USDA: food safety during power outage"]
  },
  {
    id: "stroomuitval", cat: "basis", urgent: true,
    title: "Stroomuitval: het eerste uur",
    short: "Eigen meterkast of de hele buurt? Telefoon sparen, apparaten uit, radio aan.",
    body: `
<ol class="steps">
<li><b>Kijk of de buren ook geen stroom hebben.</b> Alleen jij? Kijk in de meterkast of de aardlekschakelaar of een groep eruit is gesprongen.</li>
<li><b>De hele buurt?</b> Netbeheerder in Den Haag is <b>Stedin</b>. Landelijk storingsnummer gas en stroom: <a href="tel:08009009">0800-9009</a>. Bel alleen als het nodig is, de lijnen zijn dan druk.</li>
<li><b>Zet apparaten uit</b> en haal stekkers uit het stopcontact (ook computer en tv). Laat één lamp aan zodat je merkt wanneer de stroom terug is.</li>
<li><b>Spaar je telefoon</b>: helderheid laag, energiebesparingsmodus aan, niet streamen. Het mobiele netwerk kan na een paar uur ook uitvallen.</li>
<li><b>Zet een radio op batterijen aan</b>: <a href="#/gids/rampenzender">rampenzender</a>.</li>
<li><b>Gebruik een zaklamp</b>, liever geen kaarsen. Kaarsen nooit onbewaakt laten branden.</li>
<li><b>Lift</b>: zit je vast, gebruik de alarmknop of bel 112. Probeer niet zelf uit te klimmen.</li>
<li><b>Pinnen</b> werkt niet: een beetje contant geld in huis helpt.</li>
</ol>
<div class="tip">Kijk ook bij <a href="#/gids/koelkast">koelkast en vriezer</a> en <a href="#/gids/warm-blijven">warm blijven</a>.</div>`,
    src: ["Denk Vooruit (denkvooruit.nl): stroomuitval", "Stedin (stedin.net): storingen"]
  },
  {
    id: "warm-blijven", cat: "basis",
    title: "Warm blijven zonder verwarming",
    short: "Eén kamer warm houden, laagjes kleding, samen onder dekens. Nooit binnen stoken met buitenspullen.",
    body: `
<p>Ook een cv-ketel op gas heeft stroom nodig. Bij stroomuitval valt de verwarming dus vaak ook uit.</p>
<ul class="checks">
<li><b>Kies één kamer</b>, het liefst klein en aan de zonkant. Sluit deuren en gordijnen. Leg een handdoek tegen kieren.</li>
<li><b>Laagjes kleding</b>, een muts en sokken. Wol en fleece houden beter warm dan katoen.</li>
<li><b>Samen</b> onder dekens en slaapzakken. Een reddingsdeken onder de deken helpt.</li>
<li><b>Warme drank en eten</b> helpen je lichaam warmte te maken.</li>
<li><b>Let op</b> ouderen, baby's en zieken: zij koelen sneller af. Zie <a href="#/gids/onderkoeling">onderkoeling</a>.</li>
<li><b>Ventileer</b> toch af en toe kort, zeker als er mensen slapen of als je kaarsen brandt.</li>
</ul>
<div class="warn">Geen barbecue, gasstel, terrasverwarmer of aggregaat binnen. Zie <a href="#/gids/koolmonoxide">koolmonoxide</a>.</div>`,
    src: ["Denk Vooruit (denkvooruit.nl): kou en stroomuitval", "Brandweer Nederland: veilig verwarmen"]
  },
  {
    id: "toilet", cat: "basis",
    title: "Wc en hygiëne zonder water",
    short: "Doorspoelen met een emmer. Riool werkt niet: emmer met vuilniszak en kattenbakkorrels.",
    body: `
<ul class="checks">
<li><b>Doorspoelen</b>: giet een emmer water in de pot. Gebruik daarvoor het water uit het bad, niet je drinkwater.</li>
<li><b>Riool werkt niet</b> of het water staat hoog: zet een stevige vuilniszak in de wc of in een emmer. Doe er kattenbakkorrels, zaagsel of aarde bij. Knoop dicht en zet buiten, apart van ander afval.</li>
<li><b>Handen wassen</b> blijft belangrijk: gebruik desinfecterende handgel of een beetje water met zeep.</li>
<li>Vochtige doekjes, toiletpapier, vuilniszakken en handgel horen in je noodpakket.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl): noodpakket"]
  },
  {
    id: "opladen", cat: "basis",
    title: "Licht en opladen zonder stroom",
    short: "Powerbank vol houden, zaklamp met reservebatterijen, auto als laadpunt (buiten!).",
    body: `
<ul class="checks">
<li><b>Powerbanks</b>: houd er minstens één volgeladen. Laad hem elke paar maanden op.</li>
<li><b>Zaklamp of hoofdlamp</b> met reservebatterijen, of een opwindlamp.</li>
<li><b>Radio</b> op batterijen, opwind of zonne-energie.</li>
<li><b>Auto</b>: je kunt je telefoon opladen in de auto. Laat de motor alleen draaien als de auto buiten staat, nooit in een garage.</li>
<li><b>Zonnepanelen</b> op het dak leveren bij stroomuitval meestal géén stroom aan je huis. De omvormer schakelt uit voor de veiligheid van monteurs.</li>
<li><b>Thuisbatterij of aggregaat</b>: alleen gebruiken volgens de handleiding. Een aggregaat altijd buiten, ver van ramen.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl): noodpakket"]
  },

  /* ------------------------------------------------------ OVERSTROMING & STORM */
  {
    id: "overstroming-voorbereiden", cat: "water", urgent: true,
    title: "Overstroming: nu voorbereiden",
    short: "Zoek één keer op overstroomik.nl hoe hoog het water bij jou kan komen, en schrijf het op.",
    body: `
<p>Den Haag-Loosduinen ligt achter de duinen. Het <b>Hoogheemraadschap van Delfland</b> beheert de duinen als waterkering, samen met Rijkswaterstaat. De kans op een doorbraak is heel klein, maar de gevolgen zijn groot. Veel vaker is er <b>wateroverlast door hevige regen</b>: ondergelopen kelders, souterrains, tunnels en straten.</p>
<ol class="steps">
<li><b>Zoek je adres op</b> op <b>overstroomik.nl</b> (lukt alleen online). Je ziet hoe hoog het water bij jou maximaal kan komen en of het advies is om te blijven of te vertrekken. Schrijf de uitkomst in <a href="#/plan">Mijn plan</a>.</li>
<li><b>Weet waar je hoog kunt schuilen</b>: een hogere verdieping in je eigen huis of bij buren. Het liefst hoger dan de maximale waterhoogte.</li>
<li><b>Spreek een adres buiten de regio af</b> waar je kunt logeren als je moet vertrekken.</li>
<li><b>Maak een <a href="#/gids/noodpakket">noodpakket</a></b> en zet belangrijke papieren in een waterdichte zak.</li>
<li><b>Waardevolle spullen</b> en documenten liever niet in de kelder of berging op de begane grond.</li>
</ol>`,
    src: ["Overstroom ik? (overstroomik.nl), Rijksoverheid en Rijkswaterstaat", "Hoogheemraadschap van Delfland (hhdelfland.nl)"]
  },
  {
    id: "overstroming-acuut", cat: "water", urgent: true,
    title: "Overstroming dreigt of het water komt",
    short: "Volg NL-Alert en de rampenzender. Op tijd vertrekken of naar de hoogste verdieping.",
    body: `
<ol class="steps">
<li><b>Volg de overheid</b>: NL-Alert op je telefoon en <a href="#/gids/rampenzender">Radio West op 89.3 FM</a>. Zij zeggen of je moet vertrekken of binnen moet blijven.</li>
<li><b>Moet je vertrekken?</b> Ga op tijd. Neem je noodpakket, medicijnen, papieren, telefoon en oplader mee. Help buren die het zelf niet kunnen.</li>
<li><b>Blijf je?</b> Ga naar de <b>hoogste verdieping</b>. Neem water, eten, warme kleding, radio, zaklamp en medicijnen mee naar boven.</li>
<li><b>Zet gas, stroom en water uit</b> als het water je huis in dreigt te lopen en het nog veilig kan.</li>
<li><b>Niet door stromend water</b> lopen of rijden. 15 cm stromend water kan je omver trekken, 30 cm kan een auto laten drijven. Je ziet niet waar putten of gaten zitten.</li>
<li><b>Hulp nodig?</b> Hang een laken of iets opvallends uit het raam en maak je zichtbaar. Bel 112 alleen bij direct levensgevaar.</li>
</ol>
<div class="warn">Ga niet kijken bij de duinen, het strand of het water. Je loopt hulpdiensten in de weg en het is gevaarlijk.</div>`,
    src: ["Overstroom ik? (overstroomik.nl)", "Denk Vooruit (denkvooruit.nl): overstroming"]
  },
  {
    id: "overstroming-na", cat: "water",
    title: "Na een overstroming of wateroverlast",
    short: "Pas terug als het mag. Overstromingswater is vies. Stroom eerst laten controleren.",
    body: `
<ul class="checks">
<li><b>Ga pas terug</b> als de overheid zegt dat het veilig is.</li>
<li><b>Overstromingswater is vervuild</b> (riool, olie). Draag laarzen en handschoenen. Was je handen goed. Laat kinderen er niet in spelen.</li>
<li><b>Stroom en gas</b>: niet zelf aanzetten als er water in de meterkast of bij de ketel heeft gestaan. Laat een installateur kijken.</li>
<li><b>Gooi eten weg</b> dat met het water in aanraking is geweest, ook in afgesloten verpakkingen die niet waterdicht zijn.</li>
<li><b>Maak foto's</b> van de schade voor je opruimt en bel je verzekeraar.</li>
<li><b>Ventileer en droog</b> zo snel mogelijk om schimmel te voorkomen.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl)", "RIVM: gezondheid na wateroverlast"]
  },
  {
    id: "storm", cat: "water", urgent: true,
    title: "Storm",
    short: "Code oranje of rood: binnen blijven, losse spullen vast, weg van duinen, strand en bomen.",
    body: `
<p>Het KNMI waarschuwt met <b>code geel, oranje en rood</b>. Aan de kust bij Kijkduin waait het vaak harder dan landinwaarts.</p>
<h3>Voor de storm</h3>
<ul class="checks">
<li>Zet <b>losse spullen</b> vast of binnen: tuinmeubels, trampoline, kliko's, plantenbakken.</li>
<li>Ramen en dakramen dicht. Zonneschermen in.</li>
<li>Telefoon en powerbank opladen, zaklamp klaarleggen.</li>
</ul>
<h3>Tijdens de storm</h3>
<ul class="checks">
<li><b>Blijf binnen</b>, weg van ramen. Stel reizen uit bij code oranje of rood.</li>
<li><b>Niet naar strand of duinen</b> om te kijken. Golven en stuivend zand zijn gevaarlijk.</li>
<li>Buiten: blijf weg van bomen, steigers, bouwhekken en hoge gebouwen.</li>
</ul>
<h3>Na de storm</h3>
<ul class="checks">
<li><b>Raak afgebroken kabels niet aan</b>. Meld ze bij 0800-9009 of 112 als het gevaarlijk is.</li>
<li>Omgevallen bomen of losse dakdelen op de openbare weg: meld bij de gemeente (14 070) of 112 als er direct gevaar is.</li>
</ul>`,
    src: ["KNMI (knmi.nl): weerwaarschuwingen", "Denk Vooruit (denkvooruit.nl): extreem weer"]
  },
  {
    id: "onweer", cat: "water",
    title: "Onweer",
    short: "Ga naar binnen of in de auto. Strand en open veld direct verlaten.",
    body: `
<ul class="checks">
<li><b>Ga naar binnen</b> of in een auto met dichte ramen. Een auto beschermt goed.</li>
<li><b>Verlaat het strand, het water en open veld</b> direct. Ook zwemmers en surfers.</li>
<li><b>Niet schuilen onder één losse boom</b>.</li>
<li>Geen binnenkomst mogelijk? Ga gehurkt zitten met de voeten tegen elkaar, niet plat liggen.</li>
<li>Hoor je de donder binnen 30 seconden na de bliksem? Dan is het onweer dichtbij. Wacht na de laatste donder nog 30 minuten.</li>
</ul>`,
    src: ["KNMI: onweer", "Rode Kruis: blikseminslag"]
  },
  {
    id: "zee", cat: "water",
    title: "Strand en zee: muistroom",
    short: "Word je de zee in getrokken? Niet ertegenin zwemmen. Laat je drijven, zwaai en roep.",
    body: `
<p>Bij Kijkduin en langs de hele Haagse kust kunnen <b>muistromen</b> ontstaan: smalle stromingen die van het strand af de zee in lopen.</p>
<ol class="steps">
<li><b>Blijf rustig</b> en laat je drijven. De stroming trekt je niet onder water.</li>
<li><b>Zwem niet tegen de stroom in</b>. Zwem evenwijdig aan het strand tot je uit de stroming bent, en dan pas terug.</li>
<li><b>Steek een arm op</b> en roep om hulp.</li>
</ol>
<ul class="checks">
<li>Zwem bij een <b>post van de reddingsbrigade</b> en let op de vlaggen. Rode vlag: niet zwemmen.</li>
<li>Geen opblaasspullen bij aflandige wind (wind van het land naar de zee).</li>
<li>Iemand in nood? Zie <a href="#/gids/drenkeling">drenkeling</a>.</li>
</ul>`,
    src: ["KNRM en Reddingsbrigade Nederland: muistroom"]
  },
  {
    id: "hitte", cat: "water",
    title: "Extreme hitte",
    short: "Drink veel water, houd het huis koel, kijk om naar ouderen en zieken.",
    body: `
<ul class="checks">
<li><b>Drink</b> regelmatig water, ook als je geen dorst hebt.</li>
<li><b>Overdag</b> ramen, gordijnen en zonwering dicht. 's Avonds en 's nachts luchten.</li>
<li>Tussen 12 en 16 uur niet zwaar inspannen en uit de zon blijven.</li>
<li><b>Kijk om naar</b> ouderen, zieken en mensen die alleen wonen.</li>
<li>Laat nooit kinderen of dieren achter in een auto.</li>
<li>Verward, rode hete huid en niet meer zweten: kan een <b>zonnesteek</b> zijn. Bel 112, koel met water en natte doeken.</li>
</ul>`,
    src: ["Rijksoverheid: Nationaal Hitteplan", "Rode Kruis: hitte"]
  },

  /* ----------------------------------------------- COMMUNICATIE & NOODPLAN */
  {
    id: "alarmnummers", cat: "plan", urgent: true,
    title: "Alarmnummers en belangrijke nummers",
    short: "112 bij levensgevaar. Daarnaast politie, storingen en gemeente.",
    body: `
<ul class="numbers">
<li><a class="num urgent" href="tel:112"><b>112</b><span>Spoed: politie, brandweer, ambulance. Bij direct levensgevaar of als elke seconde telt.</span></a></li>
<li><a class="num" href="tel:09008844"><b>0900-8844</b><span>Politie, geen spoed.</span></a></li>
<li><a class="num" href="tel:08009009"><b>0800-9009</b><span>Landelijk storingsnummer gas en stroom (netbeheerder Stedin in Den Haag).</span></a></li>
<li><a class="num" href="tel:14070"><b>14 070</b><span>Gemeente Den Haag (meldingen openbare ruimte, informatie).</span></a></li>
<li><a class="num" href="tel:144"><b>144</b><span>Dieren in nood.</span></a></li>
</ul>
<p><b>Huisartsenpost</b>: buiten kantoortijd, als het niet kan wachten maar geen 112 is. Het nummer staat op de site of het antwoordapparaat van je eigen huisarts. Zet het in <a href="#/plan">Mijn plan</a>.</p>
<h3>Zo bel je 112</h3>
<ol class="steps">
<li>Zeg welke dienst je nodig hebt: politie, brandweer of ambulance.</li>
<li>Zeg <b>waar</b> je bent: straat, huisnummer, plaats. Weet je het niet? De kaart in deze app toont je locatie als je GPS hebt.</li>
<li>Zeg <b>wat</b> er is gebeurd en hoeveel mensen gewond zijn.</li>
<li>Hang niet op tot de centralist dat zegt.</li>
</ol>`,
    src: ["Rijksoverheid: alarmnummer 112", "Gemeente Den Haag (denhaag.nl)"]
  },
  {
    id: "rampenzender", cat: "plan", urgent: true,
    title: "NL-Alert en de rampenzender",
    short: "NL-Alert komt vanzelf op je telefoon. Radio West op 89.3 FM is de rampenzender voor Haaglanden.",
    body: `
<h3>NL-Alert</h3>
<p>De overheid stuurt bij een noodsituatie een <b>NL-Alert</b> naar alle telefoons in de buurt, met een hard geluid. Het werkt ook als het netwerk druk is. Lees het bericht goed en doe wat er staat.</p>
<p><b>iPhone</b>: kijk bij <i>Instellingen &gt; Berichtgeving</i> helemaal onderaan of de <b>overheidsmeldingen</b> aan staan.</p>
<h3>Rampenzender</h3>
<ul class="checks">
<li>Regionale rampenzender voor Haaglanden: <b>Radio West, 89.3 FM</b> (Omroep West).</li>
<li>Landelijk: <b>NPO Radio 1</b>.</li>
<li>Houd een <b>radio op batterijen of opwindradio</b> in huis. Bij stroomuitval werkt internetradio niet altijd.</li>
</ul>
<div class="tip">Controleer de frequentie één keer op omroepwest.nl en noteer hem op je radio. Frequenties kunnen veranderen.</div>`,
    src: ["NL-Alert (nl-alert.nl)", "Omroep West: calamiteitenzender", "Denk Vooruit (denkvooruit.nl): radio"]
  },
  {
    id: "zonder-netwerk", cat: "plan",
    title: "Contact houden zonder telefoon of internet",
    short: "Spreek nu verzamelpunten af. Sms gaat vaak nog als bellen niet lukt.",
    body: `
<ul class="checks">
<li><b>Spreek nu af</b> waar je elkaar ziet als je elkaar niet kunt bereiken: één plek in de buurt (bijvoorbeeld bij een school of plein) en één buiten de wijk. Zet het in <a href="#/plan">Mijn plan</a>.</li>
<li><b>Sms of een kort berichtje</b> komt vaak nog door als bellen niet lukt. Houd gesprekken kort, zodat het netwerk vrij blijft voor 112.</li>
<li><b>Nummers op papier</b>: je telefoon kan leeg raken. Print je plan of schrijf de nummers op.</li>
<li><b>Briefje op de deur</b> als je weggaat: waar je heen bent en hoe laat.</li>
<li><b>Eén contact buiten de regio</b> als doorgeefluik: iedereen meldt zich daar.</li>
<li><b>Buren</b>: weet wie er hulp nodig heeft (ouderen, mensen met een beperking, gezinnen met kleine kinderen) en loop even langs.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl): noodplan"]
  },
  {
    id: "noodpakket", cat: "plan", urgent: true,
    title: "Noodpakket (checklist)",
    short: "Alles om 72 uur zelf rond te komen. Vink af wat je al hebt.",
    checklist: "noodpakket",
    body: `
<p>De overheid adviseert om <b>72 uur</b> (3 dagen) zelf rond te kunnen komen zonder stroom, water of internet. Je vinkjes worden alleen op dit toestel bewaard.</p>
<div data-checklist="noodpakket"></div>`,
    src: ["Denk Vooruit (denkvooruit.nl): noodpakket"]
  },
  {
    id: "evacueren", cat: "plan",
    title: "Evacueren: wat neem je mee?",
    short: "Noodpakket, medicijnen, papieren, telefoon met oplader, warme kleding, huisdieren.",
    body: `
<ul class="checks">
<li><b>Noodpakket</b> en water voor onderweg.</li>
<li><b>Medicijnen</b> en je medicijnoverzicht, bril, hoortoestel, hulpmiddelen.</li>
<li><b>Identiteitsbewijs</b>, zorgpas, bankpas, contant geld en kopieën van belangrijke papieren in een waterdichte zak.</li>
<li><b>Telefoon, oplader en powerbank</b>.</li>
<li><b>Warme kleding</b>, regenkleding, stevige schoenen.</li>
<li><b>Huisdieren</b> met riem of reismand, voer en papieren.</li>
<li>Sluit ramen en deuren. Laat een <b>briefje</b> achter waar je heen gaat.</li>
<li>Zet gas, stroom en water uit als de overheid dat zegt.</li>
</ul>`,
    src: ["Denk Vooruit (denkvooruit.nl)"]
  },
  {
    id: "brand", cat: "plan", call112: true,
    title: "Brand in huis",
    short: "Ga eruit, blijf eruit, bel 112. Laag blijven in de rook. Deuren dicht.",
    body: `
<ol class="steps">
<li><b>Waarschuw</b> iedereen in huis.</li>
<li><b>Ga naar buiten</b> via de snelste veilige route. Blijf laag als er rook is: daar is de lucht het schoonst.</li>
<li><b>Deuren dicht</b> achter je om het vuur tegen te houden. Voel aan een deur voor je hem opent: heet? Niet openen.</li>
<li><b>Bel 112</b> zodra je buiten bent.</li>
<li><b>Ga nooit terug</b> naar binnen.</li>
<li>Kun je niet weg? Ga in een kamer met een raam, sluit de deur, leg handdoeken tegen de kier, bel 112 en maak je zichtbaar bij het raam.</li>
</ol>
<div class="tip">Rookmelders zijn verplicht op elke verdieping met een vluchtroute. Test ze één keer per maand.</div>`,
    src: ["Brandweer Nederland: brandveilig leven"]
  },

  /* --------------------------------------------------------------- LOKAAL */
  {
    id: "wie-is-wie", cat: "lokaal", urgent: true,
    title: "Wie doet wat in Den Haag-Loosduinen",
    short: "Veiligheidsregio, gemeente, drinkwater, stroom, waterkering en rampenzender.",
    body: `
<dl class="who">
<dt>Veiligheidsregio Haaglanden</dt><dd>Brandweer, GHOR (medische hulp bij rampen) en rampenbestrijding voor Den Haag, Westland, Rijswijk, Delft, Wassenaar en omgeving.</dd>
<dt>Gemeente Den Haag</dt><dd>Stadsdeel Loosduinen. Opvang en informatie bij een ramp. Telefoon 14 070.</dd>
<dt>Dunea</dt><dd>Drinkwater. Geeft kookadviezen en informatie over storingen.</dd>
<dt>Stedin</dt><dd>Netbeheerder voor stroom en gas. Storingen: 0800-9009.</dd>
<dt>Hoogheemraadschap van Delfland</dt><dd>Waterkeringen (ook de duinen), waterpeil en afvalwaterzuivering in deze regio.</dd>
<dt>Rijkswaterstaat</dt><dd>De kust, de Zandmotor bij Kijkduin en landelijke waterveiligheid.</dd>
<dt>Omroep West</dt><dd>Regionale rampenzender: Radio West, 89.3 FM.</dd>
<dt>KNRM en reddingsbrigades</dt><dd>Hulp op zee en langs het strand. Bereikbaar via 112.</dd>
</dl>
<div class="tip">Bekijk de kaart in deze app voor ziekenhuizen, huisartsen, apotheken, AED's, brandweer, politie, supermarkten, drinkwaterpunten en meer in de buurt.</div>`,
    src: ["Veiligheidsregio Haaglanden (vrh.nl)", "Gemeente Den Haag (denhaag.nl)"]
  },
  {
    id: "over", cat: "lokaal",
    title: "Over deze Lastbook",
    short: "Wat dit is, waar de gegevens vandaan komen en wat het niet is.",
    body: `
<p>Deze app is een kleine, lokale versie van het idee achter <b>Lastbook</b> (lastbook.org): een bibliotheek die werkt als het internet weg is. Deze versie is gemaakt voor Den Haag-Loosduinen en omgeving, en werkt op een iPhone, Android, tablet en computer.</p>
<ul class="checks">
<li><b>Alles staat op je toestel</b>: de gidsen, de kaart (na het opslaan) en de lijst met hulpposten.</li>
<li><b>Je noodplan en vinkjes</b> blijven alleen op dit toestel. Er gaat niets naar een server.</li>
<li><b>Kaart en hulppunten</b> komen uit <b>OpenStreetMap</b> (© OpenStreetMap-bijdragers, ODbL), via Protomaps. Iedereen kan OpenStreetMap aanvullen. Een AED die op de kaart staat kan verplaatst zijn.</li>
<li><b>Geen vervanging</b> van een EHBO- of reanimatiecursus, een arts of de aanwijzingen van hulpdiensten. Volg altijd NL-Alert, de rampenzender en de hulpverleners.</li>
</ul>`,
    src: ["lastbook.org", "openstreetmap.org/copyright", "protomaps.com"]
  }
];

window.LB_CHECKLISTS = {
  noodpakket: [
    { group: "Water en eten", items: [
      ["water", "Drinkwater: 9 liter per persoon (3 liter per dag)"],
      ["eten", "Houdbaar eten voor 3 dagen dat je koud kunt eten"],
      ["blikopener", "Blikopener (niet elektrisch)"],
      ["huisdiervoer", "Water en voer voor huisdieren"],
      ["babyvoeding", "Babyvoeding of dieetvoeding (als nodig)"]
    ]},
    { group: "Licht, stroom en informatie", items: [
      ["zaklamp", "Zaklamp of hoofdlamp met reservebatterijen"],
      ["radio", "Radio op batterijen of opwindradio"],
      ["powerbank", "Volle powerbank en oplaadkabels"],
      ["lucifers", "Lucifers of aansteker en waxinelichtjes"]
    ]},
    { group: "Gezondheid en hygiëne", items: [
      ["ehbo", "EHBO-doos"],
      ["medicijnen", "Medicijnen voor een week extra en een medicijnoverzicht"],
      ["handgel", "Handgel, vochtige doekjes, toiletpapier"],
      ["vuilniszakken", "Stevige vuilniszakken"],
      ["mondkapjes", "Mondkapjes en handschoenen"]
    ]},
    { group: "Warm en droog", items: [
      ["dekens", "Warme dekens, slaapzak of reddingsdekens"],
      ["kleding", "Warme kleding en regenkleding"],
      ["waterdicht", "Waterdichte zak voor papieren en telefoon"]
    ]},
    { group: "Papieren en geld", items: [
      ["geld", "Contant geld in kleine biljetten en munten"],
      ["kopieen", "Kopieën van ID, verzekeringspapieren en zorgpas"],
      ["nummers", "Belangrijke telefoonnummers op papier (print Mijn plan)"]
    ]},
    { group: "Gereedschap", items: [
      ["fluitje", "Fluitje om hulp te roepen"],
      ["multitool", "Zakmes of multitool, ducttape"],
      ["kookstel", "Kookstel voor buiten met brandstof"],
      ["copuntmelder", "CO-melder in huis en rookmelders getest"]
    ]}
  ]
};

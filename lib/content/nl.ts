import { SIZE_ROWS } from "./en";
import type { SiteContent } from "./types";

const content: SiteContent = {
  about: {
    intro:
      "RUE MIRA is een fictief label, bedacht voor een designportfolio: een kleine Brusselse studio die alledaagse kleding en accessoires maakt die doordacht, warm en stilletjes bijzonder aanvoelen — tegen vriendelijke prijzen.",
    sections: [
      {
        heading: "Het idee",
        paragraphs: [
          "Het meeste van wat we dragen, dragen we op gewone dagen. Daar begint RUE MIRA: de tram, het bureau, de markt, het etentje dat niet gepland was. De stukken zijn ontworpen om samen te werken, langer dan één seizoen mee te gaan en ook de honderdste keer goed te voelen.",
          "De kleuren komen uit de stad — baksteenbordeaux, natuursteen, espresso, een bleek ochtendblauw — zodat een jurk, een jas en een tas in één outfit samenkomen zonder te veel moeite.",
        ],
      },
      {
        heading: "De (verbeelde) studio",
        paragraphs: [
          "Ons verhaal is verzonnen: er is geen echt atelier, geen echt team en niets te koop. Wat wél echt is, is het vakmanschap achter deze website — de art direction, het interfaceontwerp, de toegankelijkheid en de front-end development die je op elke pagina kunt ontdekken.",
        ],
      },
      {
        heading: "Waar we voor staan",
        paragraphs: [
          "Eerlijke presentatie. Je vindt hier geen verzonnen reviews, valse schaarste of afteltimers. Voorraadcijfers zijn democijfers en worden ook zo vermeld.",
          "Inclusieve beelden met volwassenen. Elk model op onze foto's is volwassen en elk beeld werd speciaal voor deze demo gemaakt.",
        ],
      },
    ],
    quote: "“We ontwerpen voor de dag die je echt hebt, niet die uit het magazine.”",
    portraitAlt: "Portret van de fictieve oprichter van RUE MIRA in de studio",
    studioAlt: "De verbeelde RUE MIRA-studio met stofstalen en een werktafel",
  },
  journal: {
    intro: "Twee korte verhalen uit de (fictieve) studio — over je aankleden, en over de stad die ons inspireert.",
    readMore: "Lees het verhaal",
    backToJournal: "Terug naar het journal",
    stories: [
      {
        slug: "city-uniform",
        title: "Een ode aan het stadsuniform",
        dek: "Waarom de beste garderobes zichzelf herhalen — en hoe herhaling toch als jezelf voelt.",
        date: "2026-03-12",
        image: "/images/Home page and campaign images/75-home-editorial-city-style.png",
        imageAlt: "",
        pull: "Herhaling is niet saai als elk stuk zijn plaats verdient.",
        body: [
          "Mensen die elke dag hetzelfde lijken te dragen, hebben een stille zelfzekerheid. Kijk beter en het is zelden hetzelfde — het is hetzelfde idee: een vorm die werkt, kleuren die overeenkomen, één detail dat verandert.",
          "Onze stadsstukken beginnen bij dat idee. Een wijde broek die op de taille zit. Een hemd dat je kunt insteken, knopen of open dragen. Een korte trench die precies eindigt waar een hoge taille begint.",
          "Maak er drie van en je hebt een week. Voeg een klein tasje in een warme kleur toe en de week is van jou.",
          "Dit artikel is fictieve redactionele inhoud, geschreven voor een portfoliodemo.",
        ],
      },
      {
        slug: "slow-weekend",
        title: "Notities over een trage zondag",
        dek: "Markten, terrassen en de kunst van je aankleden voor nergens in het bijzonder.",
        date: "2026-04-02",
        image: "/images/Home page and campaign images/76-home-weekend-edit.png",
        imageAlt: "",
        pull: "De beste weekendoutfit is die waarvan je vergeet dat je ze draagt.",
        body: [
          "Weekendkleren hebben een andere taak. Ze moeten een markt, een lange lunch en een wandeling naar huis langs de mooie route overleven.",
          "We kiezen viscose met bloemen die meebeweegt, een gevlochten shopper die groot genoeg is voor bloemen en brood, en sandalen met een hak die laag genoeg is om te vergeten.",
          "Niets te kostbaar, niets te gepland — en toch, op de een of andere manier, verzorgd.",
          "Dit artikel is fictieve redactionele inhoud, geschreven voor een portfoliodemo.",
        ],
      },
    ],
  },
  help: {
    intro: "Antwoorden op veelgestelde vragen — geschreven voor deze demowinkel. Niets hier beschrijft een echte dienst.",
    faq: [
      { q: "Kan ik echt iets kopen?", a: "Nee. RUE MIRA is een portfoliodemo. De kassa is van begin tot eind gesimuleerd en vraagt of bewaart nooit betaalgegevens." },
      { q: "Waar wordt mijn winkeltas bewaard?", a: "In de lokale opslag van je browser, alleen op dit toestel. Blokkeert je browser opslag, dan blijft je winkeltas alleen tijdens dit bezoek bestaan." },
      { q: "Is er een promocode?", a: "Ja — probeer MIRA10 in je winkeltas voor 10% demokorting." },
      { q: "Hoe werkt de verzending?", a: "Ze werkt niet echt — maar de demo berekent ze wel: €4,95 thuislevering (gratis vanaf €70 vóór korting) of €2,95 naar een afhaalpunt. Alle tarieven zijn fictief." },
      { q: "Hoe vind ik mijn maat?", a: "Open de maattabel vanaf een productpagina, of bezoek de pagina met de maattabel voor volledige tabellen in centimeter." },
      { q: "Wat is de Demo Studio?", a: "Een openbare speeltuin die een backoffice nabootst. Je kunt prijzen, voorraad en zichtbaarheid aanpassen — maar alleen in je eigen browser." },
      { q: "Hoe zet ik alles terug?", a: "Open de Demo Studio en kies „Demo herstellen”. Je moet eerst bevestigen." },
    ],
  },
  delivery: {
    intro: "Ons leverings- en retourbeleid — volledig fictief, geschreven om de demo compleet te laten aanvoelen.",
    sections: [
      { heading: "Levering in België (demo)", paragraphs: ["Thuislevering: €4,95, geschat 2–4 werkdagen. Gratis vanaf €70 (subtotaal vóór korting).", "Afhaalpunt: €2,95, geschat 3–5 werkdagen."] },
      { heading: "Retour (demo)", paragraphs: ["In een echte winkel zou je 30 dagen hebben om ongedragen stukken terug te sturen. In deze demo wordt nooit iets verzonden, dus hoeft er ook niets terug."] },
      { heading: "Prijzen en btw", paragraphs: ["Alle prijzen staan in euro en zijn inclusief 21% Belgische btw. Totalen worden in hele centen berekend om afrondingsfouten te vermijden."] },
    ],
  },
  sizeGuide: {
    intro: "Maten zijn in centimeter en beschrijven je lichaam, niet het kledingstuk. Deze tabellen zijn illustratief voor deze demo.",
    howTo: {
      heading: "Zo meet je",
      paragraphs: [
        "Borst: rond het breedste deel van je borst. Taille: rond je natuurlijke taille. Heupen: rond het breedste deel van je heupen. Voet: van hiel tot langste teen, staand.",
        "Twijfel je tussen twee maten? Kies de grotere voor een losse pasvorm en de kleinere voor een nauwere pasvorm.",
      ],
    },
    tables: [
      { caption: "Kleding (XS–XL)", headers: ["Maat", "EU", "Borst", "Taille", "Heupen"], rows: SIZE_ROWS.sizeRows },
      { caption: "Denim (taillematen)", headers: ["Taillemaat", "Komt overeen met", "Taille (cm)"], rows: SIZE_ROWS.waistRows },
      { caption: "Schoenen (EU)", headers: ["EU", "UK", "Voetlengte (cm)"], rows: SIZE_ROWS.shoeRows.map((r) => [r[0], r[1].replace(".", ","), r[2].replace(".", ",")]) },
    ],
  },
  privacy: {
    intro: "Deze demo is ontworpen om niets te verzamelen. Dit is precies wat er met gegevens op deze site gebeurt.",
    sections: [
      { heading: "Wat wordt bewaard", paragraphs: ["Alleen niet-persoonlijke demogegevens, in de lokale opslag van je eigen browser: regels in je winkeltas (product-ID, maat, aantal), product-ID's van verlanglijst en vergelijking, wijzigingen in de Demo Studio, je taalkeuze en demobestellingen (code, artikelen, totalen, tijdstip)."] },
      { heading: "Wat nooit wordt bewaard of verstuurd", paragraphs: ["Namen, adressen, e-mails en berichten die je in de kassa, het contactformulier of de nieuwsbrief typt, blijven in het geheugen van de pagina en verdwijnen zodra je weggaat. Er wordt niets naar een server gestuurd — er is geen server.", "Er worden nooit betaalgegevens gevraagd."] },
      { heading: "Cookies en tracking", paragraphs: ["Deze demo gebruikt geen cookies, analytics of trackers van derden."] },
      { heading: "Je gegevens wissen", paragraphs: ["Gebruik „Demo herstellen” in de Demo Studio, of wis de gegevens van deze site in je browserinstellingen."] },
    ],
  },
  terms: {
    intro: "Voorwaarden in gewone taal voor een demowinkel.",
    sections: [
      { heading: "Geen verkoop", paragraphs: ["RUE MIRA is fictief. Niets op deze site wordt te koop aangeboden en het gebruik van de kassa vormt geen overeenkomst."] },
      { heading: "Inhoud", paragraphs: ["Productnamen, beschrijvingen, prijzen, personen en voorwaarden zijn verzonnen. De fotografie werd voor deze demo gemaakt; alle afgebeelde modellen zijn volwassen. Gelijkenissen met echte merken of personen zijn niet bedoeld."] },
      { heading: "Gebruik", paragraphs: ["Je mag elke functie gerust uitproberen. Geef geen echte persoonlijke of financiële gegevens in — dat is niet nodig."] },
    ],
  },
  demo: {
    intro: "RUE MIRA is een portfolioproject dat een volledige, toegankelijke, meertalige e-commerce-front-end toont — volledig als statische site.",
    sections: [
      { heading: "Wat werkt", paragraphs: ["Zoeken met suggesties, combineerbare filters en sortering met deelbare URL's, snel bekijken, zoombare galerijen, maattabel, verlanglijst, vergelijken (tot 4), winkeltas met promocode en verzendberekening, een gesimuleerde kassa in vijf stappen, demobestelgeschiedenis, een shopbaar lookbook en een lokale Demo Studio."] },
      { heading: "Wat gesimuleerd is", paragraphs: ["Betalingen, e-mails, accounts, voorraad en levering. Alles gebeurt in je browser en wordt duidelijk vermeld."] },
      { heading: "Hoe het gebouwd is", paragraphs: ["Next.js App Router met statische export, TypeScript, Tailwind CSS en Motion. Alle pagina's — inclusief 96 productpagina's in drie talen — worden bij het bouwen gegenereerd en kunnen op GitHub Pages draaien."] },
      { heading: "Toegankelijkheid", paragraphs: ["Menu's die met het toetsenbord werken, dialoogvensters met focusbeheer, zichtbare focus, semantische landmarks, vertaalde labels en ondersteuning voor minder beweging."] },
    ],
  },
};

export default content;

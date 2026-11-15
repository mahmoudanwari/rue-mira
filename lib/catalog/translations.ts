import type { Locale } from "../config";

/**
 * Localised product copy keyed by stable product ID.
 * Canonical data (price, sizes, stock, images, IDs) lives only in data/catalog.json.
 * English copy is read from the catalog itself; this file adds Dutch (BE) and French (BE).
 */
export interface ProductCopy {
  name: string;
  color: string;
  material: string;
  description: string;
}

type Translations = Record<string, Record<Exclude<Locale, "en">, ProductCopy>>;

export const PRODUCT_TRANSLATIONS: Translations = {
  "rm-001": {
    nl: { name: "Solène midi-jurk", color: "Bordeaux", material: "linnenmix", description: "Mouwloze bordeaux midi-jurk in linnenmix met vierkante hals, licht getailleerd lijfje, taillenepen, A-lijnrok tot halverwege de kuit en onzichtbare rits opzij. Zonder print." },
    fr: { name: "Robe midi Solène", color: "Bordeaux", material: "lin mélangé", description: "Robe midi bordeaux sans manches en lin mélangé, encolure carrée, buste légèrement ajusté, pinces à la taille, jupe trapèze à mi-mollet et zip invisible sur le côté. Sans imprimé." },
  },
  "rm-002": {
    nl: { name: "Elia hemdjurk", color: "Crème", material: "katoenpopeline", description: "Warme crème hemdjurk in frisse katoenpopeline met kraag, bijpassende strikceintuur, verborgen knopen vooraan, opgerolde korte mouwen en een lengte tot net onder de knie." },
    fr: { name: "Robe chemise Elia", color: "Crème", material: "popeline de coton", description: "Robe chemise crème chaud en popeline de coton nette, col, ceinture à nouer assortie, boutonnage caché, manches courtes retroussées et longueur sous le genou." },
  },
  "rm-003": {
    nl: { name: "Liora slipdress", color: "Oudroze", material: "geweven stof met satijnglans", description: "Oudroze slipdress met satijnglans, schuin geknipt, fijne verstelbare spaghettibandjes, zacht gedrapeerde halslijn en zoom onder de knie. Zonder versiering." },
    fr: { name: "Robe nuisette Liora", color: "Vieux rose", material: "tissé à finition satinée", description: "Robe nuisette vieux rose à finition satinée, coupée en biais, fines bretelles réglables, encolure souplement drapée et ourlet sous le genou. Sans ornement." },
  },
  "rm-004": {
    nl: { name: "Noa gebreide kokerjurk", color: "Cacao", material: "fijn geribde viscosebrei", description: "Cacaobruine enkellange kokerjurk in fijne ribbrei met korte mouwen, hoge ronde hals en smalle split opzij." },
    fr: { name: "Robe colonne en maille Noa", color: "Cacao", material: "maille côtelée fine en viscose", description: "Robe colonne longueur cheville en fine maille côtelée brun cacao, manches courtes, col rond montant et fine fente latérale." },
  },
  "rm-005": {
    nl: { name: "Iris theejurk met bloemen", color: "Olijf met bloemen", material: "viscose", description: "Gedempt olijfgroene theejurk in viscose met een fijne ivoorkleurige veldbloemenprint, V-hals, driekwartmouwen, zacht gerimpelde taille en rok tot op de kuit." },
    fr: { name: "Robe fleurie Iris", color: "Olive fleuri", material: "viscose", description: "Robe de thé vert olive adouci en viscose, petit imprimé de fleurs des champs ivoire, col en V, manches trois-quarts, taille légèrement froncée et jupe à mi-mollet." },
  },
  "rm-006": {
    nl: { name: "Amara wikkeljurk", color: "Middernachtblauw", material: "matte crêpe", description: "Middernachtblauwe wikkeljurk in matte crêpe met midilengte, korte fladdermouwtjes, V-hals, strikceintuur opzij en een licht asymmetrische zoom." },
    fr: { name: "Robe portefeuille Amara", color: "Bleu nuit", material: "crêpe mat", description: "Robe portefeuille midi bleu nuit en crêpe mat, petites manches volantées, col en V, lien à nouer sur le côté et ourlet légèrement asymétrique." },
  },
  "rm-007": {
    nl: { name: "Mina geribd T-shirt", color: "Ivoor", material: "katoenrib", description: "Ivoorkleurig, aansluitend T-shirt in zachte katoenrib met ronde hals, korte mouwen, subtiele smalle verticale ribbels en een strakke zoom zonder logo." },
    fr: { name: "T-shirt côtelé Mina", color: "Ivoire", material: "coton côtelé", description: "T-shirt ajusté ivoire en coton côtelé doux, col rond, manches courtes, fines côtes verticales discrètes et ourlet net sans logo." },
  },
  "rm-008": {
    nl: { name: "Camille satijnen blouse", color: "Champagne", material: "mat satijn", description: "Champagnekleurige blouse in mat satijn met lange mouwen, bescheiden open kraag, kleine knoopjes in dezelfde tint, losse val en afgeronde zoom." },
    fr: { name: "Blouse satinée Camille", color: "Champagne", material: "satin mat", description: "Blouse champagne en satin mat à manches longues, petit col ouvert, minuscules boutons ton sur ton, tombé fluide et ourlet arrondi." },
  },
  "rm-009": {
    nl: { name: "Ava oversized hemd", color: "Hemelsblauw", material: "katoenpopeline", description: "Lichtblauw oversized hemd in katoenpopeline met knoopsluiting, lange mouwen, puntkraag, verlaagde schouders en één borstzak." },
    fr: { name: "Chemise oversize Ava", color: "Bleu ciel", material: "popeline de coton", description: "Chemise boutonnée oversize bleu ciel pâle en popeline de coton, manches longues, col pointu, épaules tombantes et une poche poitrine." },
  },
  "rm-010": {
    nl: { name: "Mira top met vierkante hals", color: "Rozenhout", material: "stretchkatoen", description: "Effen gedempt rozenhoutkleurige mouwloze top in stretchkatoen met vierkante hals, strakke brede bandjes en aansluitend silhouet. Zonder print." },
    fr: { name: "Top à encolure carrée Mira", color: "Bois de rose", material: "coton stretch", description: "Top sans manches uni bois de rose adouci en coton stretch, encolure carrée, larges bretelles nettes et silhouette ajustée. Sans imprimé." },
  },
  "rm-011": {
    nl: { name: "Céleste fijngebreid vest", color: "Havermout", material: "fijne katoenbrei", description: "Kort fijngebreid vest in havermout met kleine knoopjes in dezelfde tint, ronde hals, geribde manchetten en boord en lange mouwen." },
    fr: { name: "Cardigan maille fine Céleste", color: "Flocon d'avoine", material: "maille fine de coton", description: "Cardigan court en maille fine flocon d'avoine, petits boutons ton sur ton, encolure ronde, poignets et bas côtelés, manches longues." },
  },
  "rm-012": {
    nl: { name: "Alba jeans met wijde pijpen", color: "Washed indigo", material: "katoenen denim", description: "Medium-indigo washed jeans met hoge taille, vijf zakken, wijde rechte pijpen, volledige lengte en contraststiksels. Zonder scheuren." },
    fr: { name: "Jean large Alba", color: "Indigo délavé", material: "denim de coton", description: "Jean taille haute indigo moyen délavé, cinq poches, jambes larges et droites, pleine longueur et surpiqûres contrastées. Sans déchirures." },
  },
  "rm-013": {
    nl: { name: "Ren getailleerde broek", color: "Zand", material: "geweven kostuumstof", description: "Warme zandkleurige getailleerde broek met hoge taille, wijde pijpen, scherpe bandplooien, riemlussen, schuine zakken en een strakke zoom." },
    fr: { name: "Pantalon tailleur Ren", color: "Sable", material: "tissu de costume tissé", description: "Pantalon tailleur sable chaud taille haute, jambes larges, plis marqués sur le devant, passants de ceinture, poches en biais et ourlet net." },
  },
  "rm-014": {
    nl: { name: "Sora geplisseerde midirok", color: "Zacht zwart", material: "geplisseerde polyestermix", description: "Zachtzwarte midirok met smalle geperste accordeonplooien, gladde aansluitende tailleband en soepele A-lijn." },
    fr: { name: "Jupe midi plissée Sora", color: "Noir doux", material: "polyester mélangé plissé", description: "Jupe midi noir doux à fins plis accordéon pressés, ceinture lisse et ajustée, forme trapèze fluide." },
  },
  "rm-015": {
    nl: { name: "June broek met rechte pijpen", color: "Espresso", material: "katoenen twillmix", description: "Diep espressobruine twillbroek met hoge taille en rechte pijpen, platte voorkant, verborgen haaksluiting, discrete zijzakken en volledige lengte." },
    fr: { name: "Pantalon droit June", color: "Espresso", material: "sergé de coton mélangé", description: "Pantalon droit taille haute en sergé brun espresso profond, devant plat, fermeture à crochet dissimulée, poches latérales discrètes et pleine longueur." },
  },
  "rm-016": {
    nl: { name: "Esme korte trench", color: "Steen", material: "gabardine in katoenmix", description: "Steenbeige korte trenchjas met dubbele rij schildpadknopen, brede revers, kleine stormflap en ceintuur in de taille." },
    fr: { name: "Trench court Esme", color: "Pierre", material: "gabardine de coton mélangé", description: "Trench court beige pierre, double boutonnage façon écaille, large revers, petit rabat tempête et ceinture à la taille." },
  },
  "rm-017": {
    nl: { name: "Nola gewatteerde jas", color: "Olijf", material: "gewatteerde katoen-polymix", description: "Gedempt olijfgroene, lichte boxy jas met ruitstiksel, smalle ribfluwelen contrastkraag, drukknopen en twee opgestikte zakken." },
    fr: { name: "Veste matelassée Nola", color: "Olive", material: "coton-polyester matelassé", description: "Veste boxy légère vert olive adouci, matelassage losange, petit col en velours côtelé contrasté, boutons-pression et deux poches plaquées." },
  },
  "rm-018": {
    nl: { name: "Blair zachte blazer", color: "Antraciet", material: "zachte geweven kostuumstof", description: "Antracietgrijze, licht gestructureerde blazer met enkele rij, één donkere knoop, gekerfde revers, twee paspelzakken en heuplengte." },
    fr: { name: "Blazer souple Blair", color: "Anthracite", material: "tissu de costume souple", description: "Blazer droit gris anthracite légèrement structuré, un bouton foncé, revers crantés, deux poches passepoilées, longueur hanche." },
  },
  "rm-019": {
    nl: { name: "Cleo mini-schoudertas", color: "Ossenbloed", material: "glad veganistisch leer", description: "Kleine, gladde halvemaanvormige schoudertas in ossenbloedrood imitatieleer met één kort hengsel en een minimalistische zilveren rits. Zonder logo of studs." },
    fr: { name: "Mini sac épaule Cleo", color: "Sang-de-bœuf", material: "cuir vegan lisse", description: "Petit sac épaule demi-lune en simili-cuir lisse sang-de-bœuf, une anse courte et un zip argenté minimaliste. Sans logo ni clous." },
  },
  "rm-020": {
    nl: { name: "Talia canvas shopper", color: "Warm ivoor", material: "zwaar katoencanvas", description: "Warm ivoorkleurige rechthoekige shopper in zwaar canvas met open bovenkant, lange geweven hengsels en één binnenvak. Zonder print of opschrift." },
    fr: { name: "Cabas en toile Talia", color: "Ivoire chaud", material: "toile de coton épaisse", description: "Cabas rectangulaire ivoire chaud en toile épaisse, ouvert sur le dessus, longues anses tissées et une poche intérieure. Sans imprimé ni inscription." },
  },
  "rm-021": {
    nl: { name: "Lumi crossbodytas", color: "Taupe", material: "genopt veganistisch leer", description: "Middelgrote rechthoekige crossbodytas in taupe genopt imitatieleer met smalle verstelbare riem, zacht afgeronde hoeken en rits bovenaan." },
    fr: { name: "Sac bandoulière Lumi", color: "Taupe", material: "cuir vegan grainé", description: "Sac bandoulière rectangulaire moyen en simili-cuir grainé taupe, fine sangle réglable, coins doucement arrondis et zip sur le dessus." },
  },
  "rm-022": {
    nl: { name: "Ivy gevlochten shopper", color: "Naturel stro", material: "gevlochten raffia-achtige vezel", description: "Grote naturel gevlochten shopper in raffia-look met twee afgeronde gevlochten hengsels en open, ongevoerde bovenkant. Zonder patroon of label." },
    fr: { name: "Cabas tressé Ivy", color: "Paille naturelle", material: "fibre tressée façon raphia", description: "Grand cabas tressé façon raphia naturel, deux anses tressées arrondies et ouverture non doublée. Sans motif ni étiquette." },
  },
  "rm-023": {
    nl: { name: "Aria gestructureerde satchel", color: "Chocolade", material: "glad veganistisch leer", description: "Kleine gestructureerde satchel in chocoladebruin imitatieleer met trapeziumvorm, opgerold handvat, afneembare smalle lange riem en geborstelde gouden sluiting." },
    fr: { name: "Sac cartable structuré Aria", color: "Chocolat", material: "cuir vegan lisse", description: "Petit sac cartable structuré en simili-cuir chocolat, forme trapèze, poignée roulottée, longue bandoulière fine amovible et fermoir doré brossé." },
  },
  "rm-024": {
    nl: { name: "Elle ballerina's", color: "Zwart", material: "glad veganistisch leer", description: "Paar zachte zwarte klassieke ballerina's in imitatieleer met ronde neus, klein plat strikje op de wreef en dunne, soepele zool." },
    fr: { name: "Ballerines Elle", color: "Noir", material: "cuir vegan lisse", description: "Paire de ballerines classiques en simili-cuir noir souple, bout rond, petit nœud plat sur l'empeigne et semelle fine et flexible." },
  },
  "rm-025": {
    nl: { name: "Sienna slingbackpumps", color: "Bordeaux", material: "glad veganistisch leer", description: "Paar bordeaux slingbackpumps in imitatieleer met spitse neus, kitten heel, verstelbaar gespbandje en hak van ongeveer 4 cm." },
    fr: { name: "Escarpins slingback Sienna", color: "Bordeaux", material: "cuir vegan lisse", description: "Paire d'escarpins slingback en simili-cuir bordeaux, bout pointu, petit talon, bride réglable à boucle et talon d'environ 4 cm." },
  },
  "rm-026": {
    nl: { name: "Nova lage sneakers", color: "Gebroken wit", material: "mat veganistisch leer", description: "Paar gebroken witte minimalistische lage sneakers in mat imitatieleer met gestikte panelen, crèmekleurige veters en lichtbruine rubberzool. Zonder logo." },
    fr: { name: "Baskets basses Nova", color: "Blanc cassé", material: "cuir vegan mat", description: "Paire de baskets basses minimalistes blanc cassé en simili-cuir mat, empiècements surpiqués, lacets crème et semelle en caoutchouc beige clair. Sans logo." },
  },
  "rm-027": {
    nl: { name: "Mae sandalen met blokhak", color: "Cognac", material: "glad veganistisch leer", description: "Paar warme cognackleurige minimalistische sandalen met twee dunne voorbandjes, verstelbaar enkelbandje en stevige lage blokhak van 5 cm." },
    fr: { name: "Sandales à talon bloc Mae", color: "Camel", material: "cuir vegan lisse", description: "Paire de sandales minimalistes camel chaud, deux fines brides sur le devant, bride de cheville réglable et talon bloc bas de 5 cm." },
  },
  "rm-028": {
    nl: { name: "Cora suède enkellaarsjes", color: "Chocolade", material: "imitatiesuède", description: "Paar chocoladebruine enkellaarsjes in imitatiesuède met zacht afgeronde amandelneus, kleine rits opzij en stabiele blokhak van 4 cm." },
    fr: { name: "Bottines en suède Cora", color: "Chocolat", material: "suédine", description: "Paire de bottines en suédine chocolat, bout amande doucement arrondi, petit zip latéral et talon bloc stable de 4 cm." },
  },
  "rm-029": {
    nl: { name: "Lyra creolen", color: "Warm goud", material: "verguld metaal", description: "Paar kleine, stevige ovale creolen in geborsteld warm goudkleurig metaal met discrete scharniersluiting, elk ongeveer 18 mm." },
    fr: { name: "Créoles Lyra", color: "Or chaud", material: "métal plaqué doré", description: "Paire de petites créoles ovales épaisses en métal doré chaud brossé, fermoir à charnière discret, environ 18 mm chacune." },
  },
  "rm-030": {
    nl: { name: "Nia hanger-ketting", color: "Zilver", material: "zilverkleurig metaal", description: "Fijne gepolijste zilverkleurige schakelketting met een piepkleine gladde druppelhanger, verstelbare lengte van 40–45 cm." },
    fr: { name: "Collier pendentif Nia", color: "Argent", material: "métal argenté", description: "Fine chaîne forçat en métal argenté poli avec un minuscule pendentif goutte lisse, longueur réglable de 40 à 45 cm." },
  },
  "rm-031": {
    nl: { name: "Eden stapelringen", color: "Goud", material: "verguld metaal", description: "Set van drie fijne, smalle warm goudkleurige stapelringen: één glad, één licht gehamerd en één met een fijne parelrandtextuur." },
    fr: { name: "Bagues à empiler Eden", color: "Or", material: "métal plaqué doré", description: "Ensemble de trois fines bagues à empiler dorées : une lisse, une légèrement martelée et une à fine texture perlée." },
  },
  "rm-032": {
    nl: { name: "Sol parelarmband", color: "Parelivoor", material: "imitatieparels en goudkleurig metaal", description: "Fijne armband van kleine onregelmatige ivoorkleurige imitatieparels, afgewisseld met subtiele goudkleurige tussenkraaltjes en een kleine sluiting." },
    fr: { name: "Bracelet de perles Sol", color: "Ivoire nacré", material: "perles fantaisie et métal doré", description: "Bracelet délicat de petites perles fantaisie ivoire irrégulières, alternées de discrètes perles intercalaires dorées, petit fermoir." },
  },
};

/**
 * Hamburg als Silhouette, von West nach Ost so, wie man die Stadt vom
 * Südufer der Elbe sieht: Tanzende Türme, Landungsbrücken mit Pegelturm,
 * Heinrich-Hertz-Turm, Michel, Elbphilharmonie.
 *
 * Dieselben Umrisse stehen im Kopfbild der Startseite
 * (components/marketing/hafen/containerbruecke.tsx) und am Fuß der
 * Spruch-Karten (lib/story-bild.ts): eine Stadt, ein Strich.
 *
 * Koordinaten wie im Kopfbild: Der Horizont liegt bei y = 640, die
 * Umrisse reichen darunter bis y = 670. Je Wahrzeichen eine Gruppe von
 * Pfaden.
 */
export const HAMBURG_HORIZONT = 640;
/** Westlichster und östlichster Punkt der Wahrzeichen. */
export const HAMBURG_WEST = -294;
export const HAMBURG_OST = 96;
/** Höchster Punkt (Spitze des Heinrich-Hertz-Turms). */
export const HAMBURG_SPITZE = 514;

export const HAMBURG_WAHRZEICHEN: string[][] = [
  // Tanzende Türme: zwei geknickte Hochhäuser am Ende der Reeperbahn
  [
    "M-292 670L-289 614L-294 590H-277L-272 614L-275 670Z",
    "M-270 670L-268 622L-264 604H-251L-254 622L-257 670Z",
  ],
  // Landungsbrücken: lange Halle mit zwei Kuppeltürmen und dem Pegelturm
  [
    "M-236 670V628L-232 625H-150L-146 628V670Z",
    "M-221 625V616H-214V625Z M-221 616Q-217.5 607 -214 616Z M-218 609h1v-6h-1Z",
    "M-188 625V616H-181V625Z M-188 616Q-184.5 607 -181 616Z M-185 609h1v-6h-1Z",
    "M-166 625V596H-157V625Z M-167 596L-161.5 586L-156 596Z M-162 587h1v-6h-1Z",
  ],
  // Heinrich-Hertz-Turm: schlanker Schaft, zwei Kanzeln, Antennenmast
  [
    "M-75.8 670L-72.6 566H-68.4L-65.2 670Z",
    "M-78 566H-63V559H-78Z M-76 559H-65V552H-76Z M-77.5 549H-63.5V546H-77.5Z",
    "M-71.2 552V514H-69.8V552Z",
  ],
  // Michel: Kirchenschiff, Turmschaft, Glockengeschoss, Haube, Laterne, Spitze
  [
    "M-60 670V617L-48 609H-22L-10 617V670Z",
    "M-42 670V590H-28V670Z",
    "M-40.5 590V576H-29.5V590Z M-42 591h17v-2h-17Z",
    "M-40.5 576Q-35 563 -29.5 576Z",
    "M-37 570V562H-33V570Z",
    "M-36.2 562L-35 548L-33.8 562Z",
  ],
  // Elbphilharmonie: Backstein-Speicher, darauf der Glasbau mit Wellendach
  [
    "M-12 670V606H96V670Z",
    "M-12 606V588Q-8 580 -2 571Q8 586 22 581Q32 572 44 574Q56 586 68 583Q78 578 86 584Q92 586 96 592V606Z",
  ],
];

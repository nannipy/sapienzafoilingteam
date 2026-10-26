export interface TeamPerson {
  id: string;
  name: string;
  photo?: string;
}
// A single record per person keeps names and future portraits consistent across roles.
export const people: Record<string, TeamPerson> = {
  stella: { id: 'stella', name: 'Stella Tortora', photo: '/team/stella-2026.webp' },
  matteo: { id: 'matteo', name: 'Matteo Valabrega', photo: '/team/matteo-2026.webp' },
  michele: { id: 'michele', name: 'Michele Arrigo Semeraro', photo: '/team/michele-2026.webp' },
  giovanni: { id: 'giovanni', name: 'Giovanni Battista Pernazza', photo: '/team/giovanni-2026.webp' },
  giacomo: { id: 'giacomo', name: 'Giacomo Romeo', photo: '/team/giacomo-2026.webp' },
  jacopo: { id: 'jacopo', name: 'Jacopo S. Pender', photo: '/team/jacopo-2026-v2.webp' },
  mario: { id: 'mario', name: 'Mario Valenzise', photo: '/team/mario-2026.webp' },
  fulvio: { id: 'fulvio', name: 'Fulvio Pellini', photo: '/team/fulvio-2026.webp' },
  arturo: { id: 'arturo', name: 'Arturo Buzzetti', photo: '/team/arturo.webp' },
  francesco: { id: 'francesco', name: 'Francesco Grossi', photo: '/team/francesco-2026.webp' },
  riccardo: { id: 'riccardo', name: 'Riccardo Mariotti', photo: '/team/riccardo-2026-cutout.png' },
  giulio: { id: 'giulio', name: 'Giulio Mastronardi', photo: '/team/giulio-2026.webp' },
};
export const leadership = [
  { person: 'stella', role: { it: 'Team Captain', en: 'Team Captain' } },
  { person: 'matteo', role: { it: 'Capo progetto', en: 'Project Lead' } },
  { person: 'michele', role: { it: 'Capo progetto', en: 'Project Lead' } },
];
export const departments = [
  { id: 'scafo', icon: '/brand/departments/scafo.png', description: {"it": "Studia la forma e la struttura dello scafo e l’integrazione con gli altri componenti della barca, dalla progettazione alle verifiche strutturali.", "en": "Works on hull geometry, structure and integration with the other boat components, from design to structural checks."}, name: { it: 'Scafo e Terrazze', en: 'Hull & Decks' }, heads: ['arturo', 'francesco'] },
  { id: 'foil', icon: '/brand/departments/foil.png', description: {"it": "Progetta e ottimizza le appendici che sollevano la barca sull’acqua, studiando portanza, resistenza e stabilità attraverso simulazioni e test.", "en": "Designs and optimises the appendages that lift the boat above the water, studying lift, drag and stability through simulations and testing."}, name: { it: 'Foil', en: 'Foil' }, heads: ['giacomo', 'jacopo'] },
  { id: 'elettronica', icon: '/brand/departments/elettronica.png', description: {"it": "Si occupa di sensori, acquisizione dati e telemetria: strumenti per leggere il comportamento della barca e confrontare i risultati dei test.", "en": "Develops sensors, data acquisition and telemetry to understand the boat’s behaviour and compare test results."}, name: { it: 'Elettronica', en: 'Electronics' }, heads: ['giovanni'] },
  { id: 'materiali', icon: '/brand/departments/materiali.png', description: {"it": "Studia e seleziona fibre, resine e materiali per i componenti della barca, valutando proprietà meccaniche, lavorabilità e impatto ambientale.", "en": "Researches and selects fibres, resins and materials for boat components, considering mechanical properties, manufacturing requirements and environmental impact."}, name: { it: 'Materiali', en: 'Materials' }, heads: ['mario'] },
  { id: 'comunicazione', icon: '/brand/departments/comunicazione.png', description: {"it": "Racconta il lavoro del team attraverso social, sito e contenuti visivi, documentando la costruzione, i test e gli eventi.", "en": "Shares the team’s work through social media, the website and visual content, documenting construction, testing and events."}, name: { it: 'Social e Comunicazione', en: 'Social & Communication' }, heads: ['giacomo', 'giovanni'] },
  { id: 'cantiere', icon: '/brand/departments/cantiere.png', description: {"it": "Trasforma i progetti in componenti reali: preparazione degli stampi, lavorazioni, laminazione e assemblaggio della barca.", "en": "Turns designs into physical components through mould preparation, fabrication, lamination and boat assembly."}, name: { it: 'Cantiere', en: 'Workshop' }, heads: ['fulvio'] },
  { id: 'management', icon: '/brand/departments/management.png', description: {"it": "Coordina l’organizzazione del progetto, le scadenze e le risorse, curando anche i rapporti con sponsor e partner.", "en": "Coordinates project organisation, deadlines and resources, as well as relationships with sponsors and partners."}, name: { it: 'Management e Finanze', en: 'Management & Finance' }, heads: ['riccardo', 'giulio'] },
];

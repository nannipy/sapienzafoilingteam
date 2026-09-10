export const boatTranslations = {
  en: {
    title: 'Meravijosa',
    subtitle: 'The Sustainable Foiling Moth of Sapienza University of Rome',
    badge: 'SuMoth Challenge // Stage S2',
    description: 'Explore the engineering architecture of Meravijosa: select the components on the 3D model to discover its circular materials, mechanical control systems, and custom onboard telemetry.',
    exploreCta: 'Click on the pins or tabs to inspect each component',
    partnersTitle: 'Technical Partners & Mentors',
    partnersDesc: 'Built with the generous support of FluidoDesign for composites manufacturing, Lega Navale di Ventotene for hydrofoils and rig, Comar Yachts for repurposed epoxy resin, and Harken & Gottifredi Maffioli for deck hardware and bio-based lines.',
    components: {
      hull: {
        id: '01',
        tab: 'Hull',
        title: 'B-PET Sandwich Hull',
        subsystem: 'STRUCTURE & CIRCULAR MATERIALS',
        desc: 'Laminated with ±45° biaxial basalt fiber skins, an industrial-excess PET foam core, and out-of-shelf-life epoxy resin donated by Comar Yachts to eliminate chemical waste.',
        photo: '/images/boat-01-wing-sft-detail.jpg',
        photoLabel: 'Laminated hull & wing detail // SFT',
        material: 'Biaxial Basalt & rPET Core',
        feature: 'Repurposed Comar Epoxy',
        bullets: [
          'Female tooling mold CNC-milled in MDF at Sapienza and hand-faired with longboards',
          'Mast step reinforced with an upcycled carbon windsurf mast section'
        ]
      },
      foils: {
        id: '02',
        tab: 'Foils',
        title: 'Foils',
        subsystem: 'LIFT & HYDRODYNAMICS',
        desc: 'Complete foil set loaned by Lega Navale Italiana di Ventotene. The team executed a precision surface refit to restore original laminar hydrodynamic profiles.',
        photo: '/images/hero-03.jpg',
        photoLabel: 'Foils in full flight // Lake Garda',
        material: 'Loaned Foil Platform',
        feature: 'Mirror-Finish Surface Refit',
        bullets: [
          'Microballoon edge fairing and wet sanding up to 1000-grit to delay cavitation',
          'Oversized modular foil box with custom shims for pitch and rake trim at the beach'
        ]
      },
      wand: {
        id: '03',
        tab: 'Wand',
        title: 'Mechanical Bow Wand Sensor',
        subsystem: 'MECHANICAL FLIGHT CONTROL',
        desc: '100% mechanical autonomous flight control: the bow paddle skims the water surface and mechanically modulates the main foil flap in real time with zero electrical power consumption.',
        photo: '/images/hero-04.jpg',
        photoLabel: 'Wand paddle and foil in paddock',
        material: 'In-House 3D Printed PETG',
        feature: 'Upcycled Carbon & Aluminum Rods',
        bullets: [
          'Additive manufacturing using recyclable PETG and fiber-reinforced filament',
          'Dry-assembled mechanical linkages for quick on-site tuning and repairability'
        ]
      },
      wings: {
        id: '04',
        tab: 'Wings',
        title: 'Lost-Core Wingbars & Deck',
        subsystem: 'CREW ERGONOMICS & DECK LAYOUT',
        desc: 'Wingbars shaped with lost-core male molding using rPET cores and basalt tapes. Deck panels reinforced with basalt and Kevlar, with control lines guided underdeck.',
        photo: '/images/boat-01-wing-sft-detail.jpg',
        photoLabel: 'Wingbars and hiking straps',
        material: 'rPET Sandwich + Basalt + Kevlar',
        feature: 'Harken Fly & Gottifredi Maffioli',
        bullets: [
          'Hull-to-wing interface reinforced with internal carbon plates repurposed from offcuts',
          'Deck layout validated with a 1:1 scale mock-up from recycled cardboard'
        ]
      },
      rig: {
        id: '05',
        tab: 'Rig',
        title: 'Upcycled Rig',
        subsystem: 'PROPULSION & TEXTILE RIGGING',
        desc: 'Mast, boom, and mainsail on loan from Lega Navale di Ventotene. The luff pocket was reinforced with Dacron stitching and rigged with bio-based Dyneema textile loops.',
        photo: '/images/sponsor-05-full-sail-partners.jpg',
        photoLabel: 'Refurbished rig sailing on Lake Garda',
        material: 'Reconditioned Rig + Dacron',
        feature: 'Bio-Based Dyneema Shrouds',
        bullets: [
          'Heavy metallic chainplates replaced by lightweight textile Dyneema loops',
          'Tailored sleeve repairs to restore clean aerodynamic twist and draft'
        ]
      },
      pcb: {
        id: '06',
        tab: 'Electronics',
        title: 'Custom PCB & Telemetry Box',
        subsystem: 'ONBOARD SENSORS & DATA LOGGING',
        desc: 'Custom-designed PCB developed in-house to capture flight telemetry autonomously during sailing sessions without requiring helmsman interaction.',
        photo: '/images/elettronica.jpeg',
        photoLabel: 'Meravijosa sailing with telemetry logging',
        material: 'Custom PCB + 3D Printed PETG',
        feature: 'ESP32 & 2000mAh LiPo Battery',
        bullets: [
          'Integrated 9-axis IMU, u-blox GPS module, and MicroSD card logging',
          'Waterproof 3D-printed enclosure with compressed TPU gasket and power switch'
        ]
      }
    },
    rulebook: {
      badge: 'SuMoth Challenge Regulations',
      title: 'Official Rulebook',
      desc: 'Meravijosa is engineered in compliance with the SuMoth Challenge technical guidelines, promoting sustainable manufacturing, circular materials, and foiling safety.',
      button: 'See the Rulebook'
    },
    joinProject: {
      title: 'Want to be part of the project?',
      description: 'If you are a student passionate about sailing and engineering and want to contribute to our fleet, send a spontaneous application.',
      contactButton: 'Contact Us',
      joinButton: 'Join the Team'
    }
  },
  it: {
    title: 'Meravijosa',
    subtitle: 'Il Moth Foiling Sostenibile della Sapienza Università di Roma',
    badge: 'SuMoth Challenge // Stage S2',
    description: 'Esplora l\'architettura ingegneristica di Meravijosa: seleziona i componenti sul modello 3D per scoprire i materiali, i sistemi di controllo meccanico e l\'elettronica di telemetria custom.',
    exploreCta: 'Clicca sui pin o sui tab per ispezionare ciascun componente',
    partnersTitle: 'Partner Tecnici & Mentors',
    partnersDesc: 'Realizzato grazie al supporto di FluidoDesign per il laboratorio compositi, Lega Navale di Ventotene per hydrofoil e rig, Comar Yachts per la resina epossidica, Harken e Gottifredi Maffioli per attrezzature e cime bio-based.',
    components: {
      hull: {
        id: '01',
        tab: 'Scafo',
        title: 'Scafo',
        subsystem: 'STRUTTURA & MATERIALI',
        desc: 'Costruito con pelli in fibra di basalto biassiale (±45°), anima in schiuma PET recuperata da sfridi industriali e resina epossidica donata da Comar Yachts oltre la data di scadenza per azzerare i rifiuti chimici.',
        photo: '/images/boat-01-wing-sft-detail.jpg',
        photoLabel: 'Scafo laminato & terrazza SFT',
        material: 'Basalto Biassiale & Core rPET',
        feature: 'Resina Donata da Comar',
        bullets: [
          'Stampo femmina in MDF fresato su CNC autocostruita in Sapienza e rifinito a mano',
          'Mast step rinforzato con sezione tubolare upcycled da un albero windsurf rotto'
        ]
      },
      foils: {
        id: '02',
        tab: 'Foil',
        title: 'Foils',
        subsystem: 'PORTANZA & IDRODINAMICA',
        desc: 'Set completo di foil concesso in prestito dalla Lega Navale Italiana di Ventotene. Il team ha eseguito un accurato refit superficiale per ripristinare la geometria dei profili idrodinamici.',
        photo: '/images/hero-03.jpg',
        photoLabel: 'Foil in volo sul Lago di Garda',
        material: 'Foil Pre-2015 su Prestito',
        feature: 'Refit Superficiale a Specchio',
        bullets: [
          'Stuccatura bordi d\'uscita e wet-sanding fino a 1000 grit per ritardare la cavitazione',
          'Scassa foil modulare sovradimensionata per regolare incidenza e rake direttamente a riva'
        ]
      },
      wand: {
        id: '03',
        tab: 'Wand',
        title: 'Wand',
        subsystem: 'CONTROLLO VOLO MECCANICO',
        desc: 'Sistema di controllo del volo 100% meccanico: la bacchetta tocca la superficie dell\'acqua e trasmette istantaneamente l\'angolo al flap del main foil tramite leveraggi interni, senza alcun consumo elettrico.',
        photo: '/images/hero-04.jpg',
        photoLabel: 'Bacchetta wand e foil in paddock',
        material: 'Paddle Stampa 3D in PETG',
        feature: 'Aste Carbonio & Alluminio',
        bullets: [
          'Manifattura additiva in-house con materiali riciclabili ad alta resistenza all\'urto',
          'Assemblaggio a secco con viteria per consentire riparazioni e regolazioni veloci'
        ]
      },
      wings: {
        id: '04',
        tab: 'Terrazze',
        title: 'Terrazze',
        subsystem: 'TERRAZZE & CALPESTIO',
        desc: 'Terrazze sagomate con tecnica a perdere lost-core su anime in rPET e nastri di basalto. La coperta calpestabile è rinforzata in Kevlar, mentre le manovre sono guidate sotto-coperta con bozzelli Harken.',
        photo: '/images/hero-04.jpg',
        photoLabel: 'Terrazze e cinghie di richiamo',
        material: 'Sandwich rPET + Basalto + Kevlar',
        feature: 'Bozzelli Harken & Cime Maffioli',
        bullets: [
          'Interfaccia scafo-ali rinforzata con piastre interne di carbonio recuperate da scarti',
          'Layout di coperta validato con un mock-up in scala reale 1:1 in cartone riciclato'
        ]
      },
      rig: {
        id: '05',
        tab: 'Sartie',
        title: 'Sartie',
        subsystem: 'PROPULSIONE & RIG TESSUTO',
        desc: 'Albero, boma e randa concessi in prestito dalla Lega Navale di Ventotene. La tasca dell\'albero è stata restaurata con cuciture strutturali in Dacron, abbinata a sartie tessili in Dyneema bio-based.',
        photo: '/images/sponsor-05-full-sail-partners.jpg',
        photoLabel: 'Rig ricondizionato sul Lago di Garda',
        material: 'Rig Pre-2015 + Dacron',
        feature: 'Sartie Tessili Dyneema Bio-Based',
        bullets: [
          'Eliminazione delle pesanti lande metalliche tradizionali a favore di stroppi tessili',
          'Riparazione sartoriale della randa per ripristinare il corretto profilo alare'
        ]
      },
      pcb: {
        id: '06',
        tab: 'Elettronica',
        title: 'Elettronica & PCB di Bordo',
        subsystem: 'TELEMETRIA & ACQUISIZIONE DATI',
        desc: 'Scheda elettronica (PCB) disegnata e realizzata in-house per registrare la dinamica di volo in totale autonomia, senza richiedere interazioni da parte del timoniere durante la navigazione.',
        photo: '/images/elettronica.jpeg',
        photoLabel: 'Meravijosa in navigazione // Telemetria attiva',
        material: 'Custom PCB + Scatola Stagna PETG',
        feature: 'Microcontrollore ESP32 & LiPo 2000mAh',
        bullets: [
          'Sensore inerziale IMU a 9 assi, modulo GPS u-blox e data logging su MicroSD',
          'Contenitore stagno stampato in 3D con guarnizione in TPU compressa per la massima impermeabilità'
        ]
      }
    },
    rulebook: {
      badge: 'Regolamento SuMoth Challenge',
      title: 'Regolamento Ufficiale',
      desc: 'Meravijosa è progettata e costruita nel pieno rispetto delle linee guida della SuMoth Challenge, integrando sostenibilità dei materiali, ciclo di vita circolare e sicurezza in volo.',
      button: 'Vedi il Regolamento'
    },
    joinProject: {
      title: 'Vuoi far parte del progetto?',
      description: 'Se sei uno studente appassionato di vela e ingegneria e vuoi contribuire alla costruzione della nostra flotta, invia una candidatura spontanea.',
      contactButton: 'Contattaci',
      joinButton: 'Unisciti al Team'
    }
  }
};

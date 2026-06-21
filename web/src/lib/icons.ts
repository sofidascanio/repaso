export interface AppIcon {
    id: string;
    label: string;
    src: string;
}

export const APP_ICONS: AppIcon[] = [
    { id: 'book',            label: 'Libro',         src: '/icons/book.svg' },
    { id: 'book-open',       label: 'Libro abierto', src: '/icons/book-open.svg' },
    { id: 'graduation-cap',  label: 'Graduación',    src: '/icons/graduation-cap.svg' },
    { id: 'brain',           label: 'Mente',         src: '/icons/brain.svg' },
    { id: 'pencil',          label: 'Lápiz',         src: '/icons/pencil.svg' },
    { id: 'flask',           label: 'Laboratorio',   src: '/icons/flask.svg' },
    { id: 'atom',            label: 'Física',        src: '/icons/atom.svg' },
    { id: 'dna',             label: 'Biología',      src: '/icons/dna.svg' },
    { id: 'calculator',      label: 'Matemáticas',   src: '/icons/calculator.svg' },
    { id: 'chart-bar',       label: 'Estadística',   src: '/icons/chart-bar.svg' },
    { id: 'globe',           label: 'Geografía',     src: '/icons/globe.svg' },
    { id: 'map-pin',         label: 'Ubicación',     src: '/icons/map-pin.svg' },
    { id: 'translate',       label: 'Idiomas',       src: '/icons/translate.svg' },
    { id: 'music-notes',     label: 'Música',        src: '/icons/music-notes.svg' },
    { id: 'paint-brush',     label: 'Arte',          src: '/icons/paint-brush.svg' },
    { id: 'laptop',          label: 'Tecnología',    src: '/icons/laptop.svg' },
    { id: 'code',            label: 'Programación',  src: '/icons/code.svg' },
    { id: 'briefcase',       label: 'Trabajo',       src: '/icons/briefcase.svg' },
    { id: 'currency-dollar', label: 'Economía',      src: '/icons/currency-dollar.svg' },
    { id: 'star',            label: 'Favorito',      src: '/icons/star.svg' },
];

export const DEFAULT_ICON_ID = 'book';

export function getIconById(id: string | null | undefined): AppIcon {
    return (
        APP_ICONS.find((icon) => icon.id === id) ??
        APP_ICONS.find((icon) => icon.id === DEFAULT_ICON_ID)!
    );
}
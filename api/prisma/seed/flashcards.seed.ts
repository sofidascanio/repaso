import { PrismaClient } from '@prisma/client';
import { SeededCollections } from './collections.seed';

export interface SeededFlashcards {
    algebraIds: string[];
    calculoIds: string[];
    historiaIds: string[];
    verbosIds: string[];
    vocabularioIds: string[];
    saludosIds: string[];
    nodeIds: string[];
    hooksIds: string[];
}

export async function seedFlashcards(
    prisma: PrismaClient,
    collections: SeededCollections,
): Promise<SeededFlashcards> {
    console.log('  → Creando flashcards...');

    // Álgebra 
    const algebraCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Qué es una matriz cuadrada?',
                answer: 'Una matriz que tiene el mismo número de filas y columnas (n×n).',
                tags: ['matrices', 'definición'],
                collectionId: collections.algebra.id,
            },
            {
                question: '¿Cuándo una matriz tiene inversa?',
                answer: 'Cuando su determinante es distinto de cero. Se llama matriz no singular o invertible.',
                tags: ['matrices', 'inversa'],
                collectionId: collections.algebra.id,
            },
            {
                question: '¿Qué es el rango de una matriz?',
                answer: 'El número máximo de filas (o columnas) linealmente independientes.',
                tags: ['matrices', 'rango'],
                collectionId: collections.algebra.id,
            },
            {
                question: '¿Qué es un autovalor?',
                answer: 'Un escalar λ tal que Av = λv, donde v es un vector no nulo (autovector).',
                tags: ['autovalores', 'álgebra lineal'],
                collectionId: collections.algebra.id,
                isDifficult: true,
            },
            {
                question: '¿Qué condición deben cumplir los vectores de una base?',
                answer: 'Deben ser linealmente independientes y generar todo el espacio vectorial.',
                tags: ['base', 'espacio vectorial'],
                collectionId: collections.algebra.id,
            },
        ],
    });

    // Cálculo 
    const calculoCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Cuál es la definición formal de límite?',
                answer: 'lim(x→a) f(x) = L si para todo ε > 0 existe δ > 0 tal que |f(x) - L| < ε cuando 0 < |x - a| < δ.',
                tags: ['límites', 'definición'],
                collectionId: collections.calculo.id,
                isDifficult: true,
            },
            {
                question: '¿Cuál es la regla de la cadena?',
                answer: 'Si h(x) = f(g(x)), entonces h\'(x) = f\'(g(x)) · g\'(x).',
                tags: ['derivadas', 'regla de la cadena'],
                collectionId: collections.calculo.id,
            },
            {
                question: '¿Qué establece el teorema fundamental del cálculo?',
                answer: 'La derivada de la integral definida es la función integranda: d/dx ∫ₐˣ f(t)dt = f(x).',
                tags: ['integral', 'teorema fundamental'],
                collectionId: collections.calculo.id,
                isFavorite: true,
            },
            {
                question: '¿Cuándo una función es diferenciable?',
                answer: 'Cuando el límite del cociente incremental existe y es finito. Toda función diferenciable es continua, pero no al revés.',
                tags: ['diferenciabilidad', 'continuidad'],
                collectionId: collections.calculo.id,
            },
        ],
    });

    // Historia Moderna 
    const historiaCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿En qué año comenzó la Revolución Francesa?',
                answer: '1789, con la toma de la Bastilla el 14 de julio.',
                tags: ['revolución francesa', 'fechas'],
                collectionId: collections.historiaModerna.id,
            },
            {
                question: '¿Qué fue el Renacimiento?',
                answer: 'Movimiento cultural y artístico surgido en Italia en el siglo XIV que retomó los ideales de la Antigüedad clásica.',
                tags: ['renacimiento', 'cultura'],
                collectionId: collections.historiaModerna.id,
            },
            {
                question: '¿Cuáles fueron las causas de la Reforma Protestante?',
                answer: 'La corrupción de la Iglesia, la venta de indulgencias, y las ideas humanistas que cuestionaban la autoridad papal. Martín Lutero publicó sus 95 tesis en 1517.',
                tags: ['reforma', 'religión'],
                collectionId: collections.historiaModerna.id,
                isFavorite: true,
            },
            {
                question: '¿Qué fue la Ilustración?',
                answer: 'Movimiento intelectual del siglo XVIII que promovía la razón, la ciencia y los derechos individuales por sobre la tradición y la religión.',
                tags: ['ilustración', 'filosofía'],
                collectionId: collections.historiaModerna.id,
            },
            {
                question: '¿Quién fue Nicolás Maquiavelo y qué obra escribió?',
                answer: 'Político y filósofo florentino (1469-1527), autor de "El Príncipe", obra que analiza el poder político desde una perspectiva pragmática.',
                tags: ['renacimiento', 'política'],
                collectionId: collections.historiaModerna.id,
            },
        ],
    });

    // Verbos Irregulares 
    const verbosCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: 'go — pasado simple',
                answer: 'went',
                tags: ['verbos', 'pasado'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'be — pasado simple (1ra y 3ra persona)',
                answer: 'was / were',
                tags: ['verbos', 'pasado', 'ser-estar'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'have — pasado simple',
                answer: 'had',
                tags: ['verbos', 'pasado'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'do — pasado simple',
                answer: 'did',
                tags: ['verbos', 'pasado'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'take — pasado simple y participio',
                answer: 'took / taken',
                tags: ['verbos', 'pasado', 'participio'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'know — pasado simple y participio',
                answer: 'knew / known',
                tags: ['verbos', 'pasado', 'participio'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'think — pasado simple y participio',
                answer: 'thought / thought',
                tags: ['verbos', 'pasado', 'participio'],
                collectionId: collections.verbosIrregulares.id,
            },
            {
                question: 'speak — pasado simple y participio',
                answer: 'spoke / spoken',
                tags: ['verbos', 'pasado', 'participio'],
                collectionId: collections.verbosIrregulares.id,
            },
        ],
    });

    // Vocabulario B2 
    const vocabularioCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Qué significa "albeit"?',
                answer: 'Aunque, si bien. Ej: "It was a good result, albeit unexpected."',
                tags: ['conectores', 'nivel-b2'],
                collectionId: collections.vocabularioB2.id,
            },
            {
                question: '¿Qué significa "nevertheless"?',
                answer: 'Sin embargo, no obstante. Se usa para introducir una idea contraria a la anterior.',
                tags: ['conectores', 'nivel-b2'],
                collectionId: collections.vocabularioB2.id,
            },
            {
                question: '¿Qué significa "scrutinize"?',
                answer: 'Examinar o inspeccionar algo con mucho detalle y cuidado.',
                tags: ['vocabulario', 'nivel-b2'],
                collectionId: collections.vocabularioB2.id,
                isDifficult: true,
            },
            {
                question: '¿Qué significa "paramount"?',
                answer: 'De la mayor importancia, primordial. Ej: "Safety is paramount."',
                tags: ['adjetivos', 'nivel-b2'],
                collectionId: collections.vocabularioB2.id,
            },
        ],
    });

    // Saludos en francés 
    const saludosCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Cómo se dice "Buenos días" en francés?',
                answer: 'Bonjour (se usa hasta las 18hs aproximadamente)',
                tags: ['saludos', 'básico'],
                collectionId: collections.saludos.id,
            },
            {
                question: '¿Cómo se dice "Buenas noches" en francés?',
                answer: 'Bonne nuit (al despedirse por la noche) / Bonsoir (al llegar de noche)',
                tags: ['saludos', 'básico'],
                collectionId: collections.saludos.id,
            },
            {
                question: '¿Cómo se dice "¿Cómo estás?" (informal) en francés?',
                answer: 'Ça va ? (o Comment tu vas ?)',
                tags: ['saludos', 'informal'],
                collectionId: collections.saludos.id,
            },
            {
                question: '¿Cómo se dice "Mucho gusto" en francés?',
                answer: 'Enchanté(e) — la "e" final se agrega si quien habla es mujer.',
                tags: ['presentaciones', 'básico'],
                collectionId: collections.saludos.id,
            },
        ],
    });

    // Node.js 
    const nodeCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Qué es el Event Loop en Node.js?',
                answer: 'Es el mecanismo que permite a Node.js ejecutar operaciones no bloqueantes usando un solo hilo, delegando operaciones de I/O al sistema operativo y ejecutando callbacks cuando terminan.',
                tags: ['event-loop', 'fundamentos'],
                collectionId: collections.nodeJs.id,
                isFavorite: true,
            },
            {
                question: '¿Cuál es la diferencia entre require() y import?',
                answer: 'require() es CommonJS (síncrono, dinámico). import es ES Modules (estático, permite tree-shaking). Node.js soporta ambos, pero no se pueden mezclar en el mismo archivo.',
                tags: ['módulos', 'esm', 'commonjs'],
                collectionId: collections.nodeJs.id,
            },
            {
                question: '¿Qué es un Stream en Node.js?',
                answer: 'Una abstracción para leer o escribir datos de forma secuencial. Hay 4 tipos: Readable, Writable, Duplex y Transform. Son útiles para manejar grandes volúmenes de datos sin cargarlos en memoria.',
                tags: ['streams', 'fundamentos'],
                collectionId: collections.nodeJs.id,
                isDifficult: true,
            },
            {
                question: '¿Qué hace process.nextTick()?',
                answer: 'Programa una función para ejecutarse al final de la fase actual del Event Loop, antes de continuar con la siguiente fase. Tiene mayor prioridad que Promise.resolve().',
                tags: ['event-loop', 'process'],
                collectionId: collections.nodeJs.id,
                isDifficult: true,
            },
            {
                question: '¿Qué es el patrón de módulo revelador en Node.js?',
                answer: 'Un patrón donde se exporta solo lo que se quiere hacer público, manteniendo el resto privado dentro del módulo. Ejemplo: module.exports = { publicMethod }.',
                tags: ['módulos', 'patrones'],
                collectionId: collections.nodeJs.id,
            },
        ],
    });

    // React Hooks 
    const hooksCards = await prisma.flashcard.createManyAndReturn({
        data: [
            {
                question: '¿Cuál es la diferencia entre useState y useRef?',
                answer: 'useState dispara re-render cuando cambia. useRef persiste valores entre renders SIN disparar re-render. useRef también se usa para referenciar elementos del DOM.',
                tags: ['useState', 'useRef', 'hooks'],
                collectionId: collections.reactHooks.id,
                isFavorite: true,
            },
            {
                question: '¿Cuándo usar useCallback vs useMemo?',
                answer: 'useCallback memoiza una función. useMemo memoiza el resultado de una función. Usar cuando se quiere evitar recrear funciones/valores costosos en cada render.',
                tags: ['useCallback', 'useMemo', 'optimización'],
                collectionId: collections.reactHooks.id,
            },
            {
                question: '¿Qué hace el array de dependencias en useEffect?',
                answer: '[] → corre solo al montar. [dep] → corre al montar y cuando dep cambia. Sin array → corre en cada render. La función de limpieza corre antes del próximo efecto o al desmontar.',
                tags: ['useEffect', 'hooks'],
                collectionId: collections.reactHooks.id,
                isFavorite: true,
            },
            {
                question: '¿Qué es useReducer y cuándo usarlo?',
                answer: 'Alternativa a useState para estado complejo. Recibe un reducer (state, action) => newState y un estado inicial. Útil cuando el estado tiene múltiples sub-valores o la lógica de actualización es compleja.',
                tags: ['useReducer', 'estado', 'hooks'],
                collectionId: collections.reactHooks.id,
            },
            {
                question: '¿Qué es useContext y cómo evitar renders innecesarios?',
                answer: 'Permite consumir un contexto sin prop drilling. Para evitar re-renders innecesarios, separar los contextos por responsabilidad o usar memoización en el valor del Provider.',
                tags: ['useContext', 'contexto', 'optimización'],
                collectionId: collections.reactHooks.id,
                isDifficult: true,
            },
        ],
    });

    const total =
        algebraCards.length +
        calculoCards.length +
        historiaCards.length +
        verbosCards.length +
        vocabularioCards.length +
        saludosCards.length +
        nodeCards.length +
        hooksCards.length;

    console.log(`     ✓ ${algebraCards.length} flashcards de Álgebra`);
    console.log(`     ✓ ${calculoCards.length} flashcards de Cálculo`);
    console.log(`     ✓ ${historiaCards.length} flashcards de Historia`);
    console.log(`     ✓ ${verbosCards.length} flashcards de Verbos irregulares`);
    console.log(`     ✓ ${vocabularioCards.length} flashcards de Vocabulario B2`);
    console.log(`     ✓ ${saludosCards.length} flashcards de Saludos en francés`);
    console.log(`     ✓ ${nodeCards.length} flashcards de Node.js`);
    console.log(`     ✓ ${hooksCards.length} flashcards de React Hooks`);
    console.log(`     → Total: ${total} flashcards`);

    return {
        algebraIds: algebraCards.map((f) => f.id),
        calculoIds: calculoCards.map((f) => f.id),
        historiaIds: historiaCards.map((f) => f.id),
        verbosIds: verbosCards.map((f) => f.id),
        vocabularioIds: vocabularioCards.map((f) => f.id),
        saludosIds: saludosCards.map((f) => f.id),
        nodeIds: nodeCards.map((f) => f.id),
        hooksIds: hooksCards.map((f) => f.id),
    };
}
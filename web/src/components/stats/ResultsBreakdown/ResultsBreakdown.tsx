import styles from './ResultsBreakdown.module.css';

interface ResultsBreakdownProps {
    reviewsByResult: Record<string, number>;
    total: number;
}

const RESULTS = [
    { key: 'AGAIN', label: 'Otra vez', styleKey: 'again' },
    { key: 'HARD', label: 'Difícil', styleKey: 'hard'  },
    { key: 'GOOD', label: 'Bien', styleKey: 'good'  },
    { key: 'EASY', label: 'Fácil', styleKey: 'easy'  },
];

export function ResultsBreakdown({ reviewsByResult, total }: ResultsBreakdownProps) {
    return (
        <div className={styles.wrapper}>
            {RESULTS.map(({ key, label, styleKey }) => {
                const count = reviewsByResult[key] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                    <div key={key} className={styles.row}>
                        <span className={styles.label}>{label}</span>
                        <div className={styles.barTrack}>
                            <div className={`${styles.barFill} ${styles[styleKey]}`} style={{ width: `${pct}%` }}/>
                        </div>
                        <span className={styles.count}>{count}</span>
                        <span className={styles.pct}>{pct}%</span>
                    </div>
                );
            })}
        </div>
    );
}
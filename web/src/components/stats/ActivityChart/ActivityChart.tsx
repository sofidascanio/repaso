import styles from './ActivityChart.module.css';

interface ActivityChartProps {
    data: { date: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    const max = Math.max(...data.map((d) => d.count), 1);

    const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className={styles.wrapper}>
            <div className={styles.bars}>
                {data.map(({ date, count }) => {
                    const height = Math.round((count / max) * 100);
                    const dayName = dayLabels[new Date(date + 'T12:00:00').getDay()];
                    const shortDate = new Date(date + 'T12:00:00').getDate();

                    return (
                        <div key={date} className={styles.barWrapper}>
                            <div className={styles.barContainer}>
                                {count > 0 && (
                                    <span className={styles.barCount}>{count}</span>
                                )}
                                <div className={`${styles.bar} ${count > 0 ? styles.barActive : ''}`}
                                    style={{ height: `${Math.max(height, count > 0 ? 8 : 4)}%` }}/>
                            </div>
                            <span className={styles.barLabel}>{dayName}</span>
                            <span className={styles.barDate}>{shortDate}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
import styles from './StatCard.module.css';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    sublabel?: string;
    accent?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export function StatCard({
    label,
    value,
    icon,
    sublabel,
    accent = 'primary',
}: StatCardProps) {
    return (
        <div className={`${styles.card} ${styles[accent]}`}>
            <div className={styles.header}>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                    {icon}
                </span>
                <span className={styles.label}>{label}</span>
            </div>
            <p className={styles.value}>{value}</p>
            {sublabel && <p className={styles.sublabel}>{sublabel}</p>}
        </div>
    );
}
import { APP_ICONS } from '@/lib/icons';
import { AppIconImg } from '@/components/ui/AppIconImg/AppIconImg';
import styles from './IconPicker.module.css';

interface IconPickerProps {
    value: string;
    onChange: (id: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>Icono</p>
            <div className={styles.grid}>
                {APP_ICONS.map((icon) => (
                    <button key={icon.id}
                            type="button"
                            className={`${styles.btn} ${value === icon.id ? styles.selected : ''}`}
                            onClick={() => onChange(icon.id)}
                            title={icon.label}>
                        <AppIconImg iconId={icon.id} size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
}
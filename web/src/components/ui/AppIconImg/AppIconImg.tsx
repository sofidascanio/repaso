import { getIconById } from '@/lib/icons';
import styles from './AppIconImg.module.css';

interface AppIconImgProps {
    iconId: string | null | undefined;
    size?: number;
    className?: string;
}

export function AppIconImg({ iconId, size = 24, className }: AppIconImgProps) {
    const icon = getIconById(iconId);

    return (
        <img src={icon.src}
            alt={icon.label}
            width={size}
            height={size}
            className={`${styles.icon} ${className ?? ''}`}
        />
    );
}
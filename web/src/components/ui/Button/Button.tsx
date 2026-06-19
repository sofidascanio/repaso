import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    children,
    disabled,
    className,
    ...props
}: ButtonProps) {
    return (
        <button className={[
                    styles.button,
                    styles[variant],
                    fullWidth ? styles.fullWidth : '',
                    isLoading ? styles.loading : '',
                    className ?? '',
                ]
                .filter(Boolean)
                .join(' ')}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className={styles.spinner} /> : children}
        </button>
    );
}
import { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, id, ...props }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s/g, '-');

        return (
            <div className={styles.wrapper}>
                <label className={styles.label} htmlFor={inputId}>
                    {label}
                </label>
                <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
                    {icon && (
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                        {icon}
                        </span>
                    )}
                    <input ref={ref}
                        id={inputId}
                        className={styles.input}
                        {...props}/>
                </div>
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    },
);

Input.displayName = 'Input';
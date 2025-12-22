export default function Card({
    children,
    className = '',
    padding = 'px-4 py-2',
    ...rest
}) {
    return (
        <div
            className={`bg-white dark:bg-dark lg:rounded-xl border dark:border-card-border ${padding} ${className}`}
            {...rest}>
            {children}
        </div>
    )
}

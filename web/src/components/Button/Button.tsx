interface IProps {
    text: string;
    className?: string;
    variant?: 'small' | 'big',
    type?: any;
    onClick?(data?: any): void
}

const Button: React.FC<IProps> = ({
    text,
    className = 'bg-gold rounded-md font-black hover:bg-dark-gold text-2xl',
    variant = 'small',
    type,
    onClick
}) => {
    return <button onClick={onClick} className={`${className} ${variant === 'big' ? 'w-36 h-14' : 'w-24 h-10'}`} type={type}>{text}</button>
}

export default Button;
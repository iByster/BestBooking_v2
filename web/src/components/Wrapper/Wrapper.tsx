interface IProps {
    children: React.ReactNode;
    classNames?: string;
}

const Wrapper: React.FC<IProps> = ({children, classNames}) => {
    return <div className={`flex flex-col justify-center items-center mx-auto container ${classNames}`}>
        {children}
    </div>
}

export default Wrapper;
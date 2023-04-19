interface IProps {
    children: React.ReactNode;
}

const Wrapper: React.FC<IProps> = ({children}) => {
    return <div className="flex flex-col justify-center items-center mx-auto container">
        {children}
    </div>
}

export default Wrapper;
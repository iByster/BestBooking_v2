import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import Logo from "../components/Logo/Logo";

interface IProps {

}

const NotFound: React.FC<IProps> = ({}) => {
    const navigate = useNavigate();
    return <div className="m-auto w-max h-[800px] flex flex-col justify-center text-center items-center gap-10">
        <div className="w-96">
            <Logo />
        </div>
        <p className="font-extrabold text-8xl">404</p>
        <p className="font-extrabold text-xl">Page not found</p>
        <Button text="Home" onClick={() => navigate({ pathname: '/' })}/>
    </div>
}

export default NotFound;
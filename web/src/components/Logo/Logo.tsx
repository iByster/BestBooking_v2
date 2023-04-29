import logo from './logov2.png';
import logoNoBackground from './logov2-removebg-preview.png';

interface IProps {
    noBackground?: boolean;
}

const Logo: React.FC<IProps> = ({noBackground}) => {
    return <img src={noBackground ? logoNoBackground : logo} />;
}

export default Logo;
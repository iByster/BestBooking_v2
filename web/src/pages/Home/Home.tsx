import Header from "../../components/Header/Header";
import InputBox from "../../components/InputBox/InputBox";
import Logo from "../../components/Logo/Logo";
import ScrapedSitesFooter from "../../components/ScrapedSitesFooter/ScrapedSitesFooter";
import Wrapper from "../../components/Wrapper/Wrapper";

interface IProps {}

const Home: React.FC<IProps> = ({}) => {
  return (
    <Wrapper>
      <Header />
      <InputBox />
      <ScrapedSitesFooter />
    </Wrapper>
  );
};

export default Home;

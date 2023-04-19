import Logo from "../Logo/Logo";

interface IProps {}

const Header: React.FC<IProps> = ({}) => {
  return (
    <div className="flex flex-row gap-8 mb-10 mt-28">
      <div className="w-96">
        <Logo />
      </div>
      <div className="boder border-r-2"></div>
      <div className="my-auto">
        <h1 className="font-extrabold text-2xl mb-6">Offers from favorite booking sites</h1>
        <p>Try looking for a city, a particular hotel or even a famous location!</p>
      </div>
    </div>
  );
};

export default Header;

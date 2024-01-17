import MenuIcon from "../../assets/Icons/MenuIcon";
import "./Navbar.scss";
import Person from "../../assets/Icons/Person";
function Navbar() {
  return (
    <>
      <div className="navbar-container">
        <div className="navbar-wrapper">
          <div className="menu-wrapper">
            <div className="dropdown">
              <MenuIcon height="16" width="16" />
              <div className="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </div>
          </div>
          <div className="header-1">Hotel Booking Chatbot</div>
          <div className="logo-wrapper">
            <img src="../../../public/assests//logo.png" alt="" />
          </div>
          <div className="profile-logo-wrapper">
            <Person />
          </div>
        </div>
      </div>
      <div className="bottom"></div>
    </>
  );
}

export default Navbar;

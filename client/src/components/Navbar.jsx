import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/dashboard" className="logo">
          EduAdapt.AI
        </Link>

        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/progress">Progress</Link>
        </div>

        <Link to="/login" className="logout-button">
          Logout
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;
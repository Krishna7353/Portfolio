import './Navbar.css'
function Navbar(){
    return(<>
        <nav className="Navbar">
            <ul className="Navbar-list">
                <li className="Navbar-items">Home</li>
                <li className="Navbar-items">Skills</li>
                <li className="Navbar-items">Project</li>
                <li className="Navbar-items"> Contact</li>
                <li className="Navbar-items">About</li>
            </ul>
        </nav>
    </>)
}
export default Navbar;
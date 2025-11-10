import './Header.css'
import logo from "../../assets/logo.png"

export default function Header() {
    return (
        <header>
            <nav className = "navbar">
                <a href = "/"><img src = {logo} alt = "logo" /></a>
            </nav>
        </header>
    )
}
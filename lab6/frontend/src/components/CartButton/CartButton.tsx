import './CartButton.css';
import cart from "../../assets/cart.png"

interface CartButtonProps {
    onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
    return (
        <button
            className="bigo-request-button"
            onClick={onClick}
        >
            <img
                src={cart}
                alt="Корзина"
            />
        </button>
    );
}
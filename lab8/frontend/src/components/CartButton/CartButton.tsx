import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { useNavigate } from 'react-router-dom';
import cart from "../../assets/cart.png";
import { getDraftBigORequest } from '../../store/slices/bigorequestSlice';
import './CartButton.css';
import {useEffect} from "react";
export default function CartButton() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.user);
    const { draftId, count } = useAppSelector(state => state.bigorequest);


    useEffect(() => {
        dispatch(getDraftBigORequest());
    }, [dispatch]);

    const handleClick = async () => {
        if (draftId) navigate(`/BigORequest/${draftId}`);
    };

    return (
        <button

            className="bigo-request-button"
            onClick={handleClick}
        >
            <img src={cart} alt="Корзина" />

            {isAuthenticated && draftId && count > 0 && (
                <span className="cart-number">{count}</span>
            )}
        </button>
    );
}

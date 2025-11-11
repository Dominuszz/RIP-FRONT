import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs'
import { ROUTES, ROUTE_LABELS } from '../../Routes'
import { Spinner } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import './CompClassPage.css'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchComplexClassById } from '../../store/slices/complexClassesSlice'
import {dest_img} from "../../modules/target_config.ts";

export default function ComplexClassPage() {
    const dispatch = useAppDispatch()
    const { currentItem: compclass, loading } = useAppSelector(state => state.complexClasses)
    const [imageError, setImageError] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        if (!id) return
        dispatch(fetchComplexClassById(Number(id)))
    }, [id, dispatch])

    const getImageUrl = (photo: string) => {
        if (!photo || imageError) return '/src/assets/compclasserror.jpg'
        if (photo.startsWith("data:") || photo.startsWith("/") || photo.includes("assets/")) {
            return photo
        }
        return `${dest_img}/${photo}`
    }

    const handleImageError = () => {
        setImageError(true)
    }

    if (loading) {
        return (
            <div className="compclass-page">
                <Header />
                <div className="compclass-page-loader">
                    <Spinner animation="border" />
                </div>
            </div>
        )
    }

    if (!compclass) {
        return (
            <div className="compclass-page">
                <Header />
                <div className="compclass-page-not-found">
                    <h1>Класс сложности не найден</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="detail-body">
            <Header />

            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.ComplexClasses, path: ROUTES.ComplexClasses },
                    { label: "O(" + compclass.complexity + ")"},
                ]}
            />

            <div className="detail">
                <img
                    src={getImageUrl(compclass.img)}
                    alt="img"
                    onError={handleImageError}
                    className="detail-image"
                />
                <div className="text-panel">
                    <h2 className="complexity-title">Класс Сложности O({compclass.complexity})</h2>
                    <div className="description-container">
                        <p className="degree">Степень: {compclass.degree_text}</p>
                        <p className="description">{compclass.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
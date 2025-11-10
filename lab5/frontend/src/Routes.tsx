export const ROUTES = {
    HOME: "/",
    ComplexClasses: "/ComplexClasses",
    ComplexClass: "/ComplexClass/:id",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ComplexClasses: "Классы сложности",
    ComplexClass: "Класс сложности"
};
export const ROUTES = {
    HOME: "/",
    ComplexClasses: "/ComplexClasses",
    ComplexClass: "/ComplexClass/:id",
    BigORequest: "/BigORequest/:id",
    BigORequests: "/BigORequest",
    Login: "/Login",
    Register: "/Register",
    Profile: "/Profile"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    ComplexClasses: "Классы сложности",
    ComplexClass: "Класс сложности",
    BigORequests: "Заявки на расчет",
    BigORequest: "Заяка на расчет",
    Login: "/Login",
    Register: "/Register",
    Profile: "/Profile"

};
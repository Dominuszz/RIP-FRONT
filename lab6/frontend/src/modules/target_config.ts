export const api_proxy_addr = "http://localhost:8080";
export const img_proxy_addr = "http://localhost:9000";

export function getDestRoot(): string {
        return "";
}

export function getDestApi(): string {
    if (typeof import.meta === "undefined") {
        return "/api/v1"; // fallback
    }

    // DEV → локальный прокси, Tauri → локальный сервер, иначе /api/v1
    if (import.meta.env.DEV) return "/api/v1";
    if (import.meta.env.MODE === "tauri") return api_proxy_addr;
    return "/api/v1";
}

export function getDestImg(): string {
    if (typeof import.meta === "undefined") {
        return "/lab1"; // fallback
    }

    // DEV → /lab1, Tauri → локальный сервер, иначе /lab1
    if (import.meta.env.DEV) return "/lab1";
    if (import.meta.env.MODE === "tauri") return img_proxy_addr;
    return "/lab1";
}
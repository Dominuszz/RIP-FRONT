export const api_proxy_addr = "http://localhost:8080";
export const img_proxy_addr = "http://localhost:9000";

export function getDestRoot(): string {
    if (typeof import.meta === "undefined") {
        return "/RIP-FRONT/";
    }

    // В dev и tauri режиме basename не нужен
    if (import.meta.env.DEV || import.meta.env.MODE === "tauri") {
        return "";
    }

    // Если билд открыт не по /RIP-FRONT/, убираем basename чтобы не было ошибки Router
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/RIP-FRONT/")) {
        return "";
    }

    // Продакшн по адресу /RIP-FRONT/
    return "/RIP-FRONT/";
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

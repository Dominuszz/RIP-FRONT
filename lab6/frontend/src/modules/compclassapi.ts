import {dest_api} from "./target_config.ts";

export interface ComplexClass {
    compclass_id: number
    img: string
    complexity: string
    degree: number
    degree_text: string
    description: string
    is_delete: boolean
}

export async function listComplexClasses(params?: { degree?: string; date_from?: string; date_to?: string }): Promise<ComplexClass[]> {
    try {
        let path = `${dest_api}/complexclass`;
        if (params) {
            const query = new URLSearchParams();
            if (params.degree) query.append("search-degree", params.degree);
            const queryString = query.toString();
            if (queryString) path += `?${queryString}`;
        }

        const res = await fetch(path, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Failed to fetch complexclasses:", err);
        return [];
    }
}

export async function getComplexClass(id: number): Promise<ComplexClass | null> {
    try {
        const res = await fetch(`${dest_api}/complexclass/${id}`, {headers: {Accept: "application/json"}});
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`Failed to fetch complex class ${id}:`, err);
        return null;
    }
}
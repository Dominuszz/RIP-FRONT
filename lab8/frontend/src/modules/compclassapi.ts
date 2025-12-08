import { api } from '../api';  // Путь от modules к src/api
import type { SerializerComplexClassJSON } from '../api/Api';  // Типы из Api.ts

export type ComplexClass = SerializerComplexClassJSON;  // Алиас для совместимости

export async function listComplexClasses(params?: { degree?: string }): Promise<ComplexClass[]> {
    try {
        const response = await api.complexclass.complexclassList({ "search-degree": params?.degree });
        return response.data;
    } catch (err) {
        console.error("Failed to fetch complexclasses:", err);
        return [];
    }
}

export async function getComplexClass(id: number): Promise<ComplexClass | null> {
    try {
        const response = await api.complexclass.complexclassDetail({ id });
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch complex class ${id}:`, err);
        return null;
    }
}
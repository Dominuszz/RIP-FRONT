import { type ComplexClass } from "./compclassapi.ts";
import constimage from '../assets/const.jpg'
import linearimage from '../assets/linear.jpg'
import logimage from '../assets/log.jpg'
import squareimage from '../assets/square.jpg'

export const COMPLEXCLASS_MOCK: ComplexClass[] = [
    {
        compclass_id: 1,
        img: linearimage,
        complexity: "n",
        degree: 1,
        degree_text: "Линейная",
        description: "время прямо пропорционально размеру данных",
        is_delete: false
    },
    {
        compclass_id: 2,
        img: logimage,
        complexity: "Log(n)",
        degree: 0.1,
        degree_text: "Логарифмическая",
        description: "время растет медленно, каждый шаг уменьшает задачу вдвое.",
        is_delete: false
    },
    {
        compclass_id: 3,
        img: squareimage,
        complexity: "n^2",
        degree: 2,
        degree_text: "Квадратичная",
        description: "время растет пропорционально квадрату размера данных (вложенные циклы)",
        is_delete: false
    },
    {
        compclass_id: 4,
        img: constimage,
        complexity: "1",
        degree: 0,
        degree_text: "Константная",
        description: "выполняется за фиксированное время, независимо от размера данных",
        is_delete: false
    }
]
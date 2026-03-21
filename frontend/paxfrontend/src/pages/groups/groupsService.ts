const API_URL = "http://localhost:8081/api/v1/groups";

// Описуємо Enum, щоб він збігався з Java GroupPrivacy
export enum GroupPrivacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    HIDDEN = "HIDDEN"
}

// Тип, який ми отримуємо з бекенду (Read Dto)
export interface Group {
    id: number;
    name: string;
    description: string;
    groupPrivacy: GroupPrivacy;
    location?: string;
    ownerId?: string;
}

// Тип для створення (те, що ми передаємо в функцію)
export interface CreateGroupDto {
    name: string;
    description: string;
    groupPrivacy: GroupPrivacy; // Обов'язкове поле для вашого бекенду
    location?: string;
}

// 1. Отримати всі групи
export async function fetchAllGroups(): Promise<Group[]> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

    const response = await fetch("http://localhost:8081/api/v1/groups/all", {
        headers: headers
    });
    if (!response.ok) throw new Error("Failed to load groups");
    return response.json();
}

export async function joinGroup(groupId: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Ви не авторизовані");

    const response = await fetch(`http://localhost:8081/api/v1/groups/${groupId}/join`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("Не вдалося вступити в групу на сервері");
    }
}
export async function leaveGroup(groupId: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`http://localhost:8081/api/v1/groups/${groupId}/leave`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Leave failed");
}
// 2. Створити нову групу
export async function createGroup(data: any) {
    const token = localStorage.getItem("access_token");

    // БУДУЄМО ОБ'ЄКТ ПІД JAVA DTO
    const payload = {
        id: null,                      // Обов'язково null для створення
        name: data.name,
        description: data.description, // МАЄ БУТИ НЕ ПОРОЖНІМ
        groupPrivacy: data.visibility ? data.visibility.toUpperCase() : "PUBLIC",
        location: "Online",            // Додаємо дефолтне значення, щоб не було null
        ownerId: null
    };

    console.log("Реальний JSON, який летить на сервер:", payload);

    const response = await fetch("http://localhost:8081/api/v1/groups", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        console.error("Сервер не прийняв запит:", errorDetails);
        throw new Error("400 Bad Request");
    }

    return response.json();

}
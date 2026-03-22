// postsService.ts

const API_URL = "http://localhost:8081/api/v1/posts";

// Описуємо тип поста, який приходить з бекенду (підкоригуй поля, якщо бекенд віддає інші назви)
// postsService.ts

export interface Post {
    id: number;
    text: string;           // У базі це String text;
    views: number;          // У базі це Long views;
    likes: number;          // У базі це Long likes;
    createdAt: string;
    updatedAt: string;

    // Ці поля прийдуть з DTO (дані з пов'язаних таблиць Author та Group)
    authorUsername?: string;
    authorId?: string;
    groupId?: number;
    groupName?: string;

    // Масив зображень
    images?: string[];
}

// Функція для отримання всіх постів


export async function fetchAllPosts(): Promise<Post[]> {
    const token = localStorage.getItem("access_token");

    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers,
        mode: "cors"
    });

    if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
    }

    return response.json();
}

// Додай це в кінець файлу postServise.ts

export interface CreatePostDto {
    text: string;
    groupId: number;
    // images: string[] - поки що залишаємо без картинок для простоти
}

export async function createPost(data: CreatePostDto): Promise<Post> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Ви не авторизовані");

    // ПРИМІТКА: Перевір, який саме URL у вашого PostController на бекенді.
    // Зазвичай це /api/v1/posts
    const response = await fetch("http://localhost:8081/api/v1/posts", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Не вдалося створити пост");
    }

    return response.json();
}
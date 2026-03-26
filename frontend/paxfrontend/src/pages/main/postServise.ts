const API_URL = "http://localhost:8081/api/v1/posts";

export interface Post {
    id: number;
    text: string;
    views: number;
    likes: number;
    createdAt: string;
    updatedAt: string;

    authorUsername?: string;
    authorId?: string;
    groupId?: number;
    groupName?: string;

    // Масив зображень
    images?: string[];
}

// === ФУНКЦІЯ ДЛЯ ОТРИМАННЯ ВСІХ ПОСТІВ (ВІДНОВЛЕНО) ===
export async function fetchAllPosts(): Promise<Post[]> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    // Додаємо відключення кешу, щоб на головній сторінці пости теж не зникали
    const response = await fetch(`${API_URL}/all?t=${new Date().getTime()}`, {
        method: "GET",
        headers,
        cache: "no-store",
        mode: "cors"
    });

    if (!response.ok) {
        throw new Error("Не вдалося завантажити всі пости");
    }

    return response.json();
}

// === ФУНКЦІЯ ДЛЯ ОТРИМАННЯ ПОСТІВ ГРУПИ ===
export async function fetchGroupPosts(groupId: number): Promise<Post[]> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    const response = await fetch(`${API_URL}/group/${groupId}?t=${new Date().getTime()}`, {
        method: "GET",
        headers,
        cache: "no-store",
        mode: "cors"
    });

    if (!response.ok) {
        throw new Error("Не вдалося завантажити пости групи");
    }

    return response.json();
}


export interface CreatePostDto {
    text: string;
    groupId: number;
}

// === ФУНКЦІЯ СТВОРЕННЯ ПОСТА ===
export async function createPost(data: CreatePostDto): Promise<Post> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Ви не авторизовані");

    const response = await fetch(API_URL, {
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

export async function deletePost(postId: number): Promise<void> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`http://localhost:8081/api/v1/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Не вдалося видалити пост");
    }
}
export async function likePost(postId: number): Promise<Post> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    // Викликаємо твій PostController: @PostMapping("/{id}/like")
    const response = await fetch(`${API_URL}/${postId}/like`, { method: "POST", headers });

    if (!response.ok) {
        throw new Error("Не вдалося лайкнути пост");
    }

    return response.json(); // Повертає оновлений пост із новими лайками
}

// Створюємо окремий інтерфейс для оновлення
export interface UpdatePostDto {
    id: number;       // Додаємо id, який часто вимагає Spring Boot
    text: string;
    groupId?: number; // Робимо не обов'язковим
}

// === ФУНКЦІЯ ОНОВЛЕННЯ (РЕДАГУВАННЯ) ПОСТА ===
export async function updatePost(postId: number, data: UpdatePostDto): Promise<Post> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    const response = await fetch(`${API_URL}/${postId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        // Читаємо відповідь від бекенду, щоб точно знати, яке поле не пройшло валідацію
        const errorData = await response.text();
        console.error("Бекенд відхилив запит (400):", errorData);
        throw new Error("Не вдалося оновити пост");
    }

    return response.json();
}

export async function unlikePost(postId: number): Promise<Post> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
    };

    // Викликаємо твій PostController: @PostMapping("/{id}/unlike")
    const response = await fetch(`${API_URL}/${postId}/unlike`, { method: "POST", headers });

    if (!response.ok) {
        throw new Error("Не вдалося прибрати лайк");
    }

    return response.json();
}
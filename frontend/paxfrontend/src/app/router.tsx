import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/main";
import { SettingsPage } from "../pages/settings";
import { MessagesPage } from "../pages/messages";
import { TrendingPage } from "../pages/trending";
import { GroupsPage } from "../pages/groups";
import { BookmarksPage } from "../pages/bookmarks";
import { NotificationsPage } from "../pages/notifications";
import { AuthCallback } from "../features/Auth/AuthCallback";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            { index: true, element: <Home /> },

            { path: "home", element: <Home /> },
            { path: "messages", element: <MessagesPage /> },
            { path: "trending", element: <TrendingPage /> },
            { path: "groups", element: <GroupsPage /> },
            { path: "bookmarks", element: <BookmarksPage /> },
            { path: "notifications", element: <NotificationsPage /> }, // ← добавлено

            { path: "settings", element: <SettingsPage /> },

            // убрал ведущий слэш
            { path: "auth/callback", element: <AuthCallback /> },
        ],
    },
]);

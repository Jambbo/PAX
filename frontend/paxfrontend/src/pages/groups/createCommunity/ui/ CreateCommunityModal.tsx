import React, {
    FC,
    useEffect,
    useState,
    FormEvent,
    ChangeEvent,
} from "react";
import {
    Globe,
    Lock,
    Eye,
    Gamepad2,
    Book,
    Music,
    Dumbbell,
    Palette,
    Briefcase,
} from "lucide-react";

import { CreateCommunityFormData } from "../model/types";

interface CreateCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCommunityFormData) => void | Promise<void>;
    isSubmitting?: boolean;
    serverError?: string | null;
}

export const CreateCommunityModal: FC<CreateCommunityModalProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        onSubmit,
                                                                        isSubmitting = false,
                                                                        serverError = null,
                                                                    }) => {
    const [form, setForm] = useState<CreateCommunityFormData>({
        name: "",
        description: "",
        visibility: "public",
        isNsfw: false,
        category: "General",
    });

    const [nameError, setNameError] = useState<string | null>(null);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setForm({
                name: "",
                description: "",
                visibility: "public",
                isNsfw: false,
                category: "General",
            });
            setNameError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange =
        (field: keyof CreateCommunityFormData) =>
            (
                e: ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
            ) => {
                if (field === "isNsfw") {
                    const input = e.target as HTMLInputElement;
                    setForm((prev) => ({ ...prev, isNsfw: input.checked }));
                    return;
                }

                const value = e.target.value;
                setForm((prev) => ({ ...prev, [field]: value as any }));

                if (field === "name" && nameError) {
                    setNameError(null);
                }
            };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setNameError("Community name is required");
            return;
        }

        onSubmit({
            ...form,
            name: form.name.trim(),
            description: form.description.trim(),
        });
    };

    // категории
    const categories = [
        { label: "General", icon: <Globe size={16} /> },
        { label: "Gaming", icon: <Gamepad2 size={16} /> },
        { label: "Art & Design", icon: <Palette size={16} /> },
        { label: "Music", icon: <Music size={16} /> },
        { label: "Study", icon: <Book size={16} /> },
        { label: "Anime", icon: <Book size={16} /> },
        { label: "Finance", icon: <Briefcase size={16} /> },
        { label: "Literature", icon: <Book size={16} /> },
        { label: "Programming", icon: <Globe size={16} /> },
        { label: "Sports", icon: <Dumbbell size={16} /> },
        { label: "Movies", icon: <Eye size={16} /> },
        { label: "Travel", icon: <Globe size={16} /> },

        // ---- потом доделаем, а то я ебу как красиво сделать ----
        // { label: "Technology", icon: <Globe size={16} /> },
        // { label: "Science", icon: <Globe size={16} /> },
        // { label: "History", icon: <Book size={16} /> },
        // { label: "Psychology", icon: <Book size={16} /> },
        // { label: "Memes", icon: <Eye size={16} /> },
        // { label: "Cars", icon: <Globe size={16} /> },
        // { label: "Photography", icon: <Eye size={16} /> },
        // { label: "Cooking", icon: <Eye size={16} /> },
        // { label: "Languages", icon: <Book size={16} /> },
        // { label: "Business", icon: <Briefcase size={16} /> },
        // { label: "Startups", icon: <Briefcase size={16} /> },
        // { label: "Crypto", icon: <Briefcase size={16} /> },
        // { label: "Fashion", icon: <Eye size={16} /> },
        // { label: "Parenting", icon: <Book size={16} /> },
    ];


    const visibilityOptions = [
        {
            value: "public",
            label: "Public",
            description: "Visible to everyone",
            icon: <Globe size={16} />,
        },
        {
            value: "private",
            label: "Private",
            description: "Join request required",
            icon: <Lock size={16} />,
        },
        {
            value: "hidden",
            label: "Hidden",
            description: "Invite only, not listed",
            icon: <Eye size={16} />,
        },
    ] as const;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-[#14141c] p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Create Community</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-300">
                            Community name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={handleChange("name")}
                            placeholder="My awesome community"
                            disabled={isSubmitting}
                            className={`w-full rounded-lg border bg-[#1b1b24] px-3 py-2 text-sm text-white outline-none focus:border-purple-500 ${
                                nameError ? "border-red-500" : "border-[#2b2b37]"
                            }`}
                        />
                        {nameError && (
                            <p className="text-xs text-red-400">{nameError}</p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-300">Description</label>
                        <textarea
                            value={form.description}
                            onChange={handleChange("description")}
                            placeholder="What is this community about?"
                            disabled={isSubmitting}
                            className="h-24 w-full resize-none rounded-lg border border-[#2b2b37] bg-[#1b1b24] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* CATEGORY — GRID */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Category</label>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {categories.map((c) => {
                                const active = form.category === c.label;
                                return (
                                    <button
                                        type="button"
                                        key={c.label}
                                        disabled={isSubmitting}
                                        onClick={() =>
                                            setForm((prev) => ({ ...prev, category: c.label }))
                                        }
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                                            active
                                                ? "bg-purple-600 text-white border-purple-500"
                                                : "bg-[#1b1b24] text-gray-300 border-[#2b2b37] hover:bg-[#232334]"
                                        }`}
                                    >
                                        {c.icon}
                                        <span className="truncate">{c.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* VISIBILITY */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Visibility</label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {visibilityOptions.map((option) => {
                                const active = form.visibility === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                visibility: option.value,
                                            }))
                                        }
                                        className={`flex flex-col items-start rounded-xl border px-3 py-2 text-left text-xs transition-all ${
                                            active
                                                ? "border-purple-500 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-white"
                                                : "border-[#2b2b37] bg-[#1b1b24] text-gray-300 hover:border-purple-500/60 hover:bg-[#232334]"
                                        }`}
                                    >
                                        <div className="mb-1 flex items-center gap-2 text-sm">
                      <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              active
                                  ? "bg-purple-600 text-white"
                                  : "bg-[#262636] text-gray-300"
                          }`}
                      >
                        {option.icon}
                      </span>
                                            <span className="font-medium">{option.label}</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400">
                      {option.description}
                    </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* NSFW */}
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={form.isNsfw}
                            onChange={handleChange("isNsfw")}
                            disabled={isSubmitting}
                            className="h-4 w-4 rounded border border-[#2b2b37] bg-[#1b1b24]"
                        />
                        NSFW (18+ content)
                    </label>

                    {/* SERVER ERROR */}
                    {serverError && (
                        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {serverError}
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg bg-[#262636] px-4 py-2 text-sm text-gray-200 hover:bg-[#2f2f45] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Community"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

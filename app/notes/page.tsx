"use client";

import { useState, useEffect } from 'react';
import { FolderIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import NoteDialog from '@/components/note-dialog';

interface Note {
    id: number;
    title: string;
    content: string;
    categoryId: string;
    createdAt: string;
}

interface Category {
    id: string;
    name: string;
    color: string;
}

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch notes and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notesRes, categoriesRes] = await Promise.all([
                    fetch('/api/notes'),
                    fetch('/api/categories')
                ]);

                if (notesRes.ok && categoriesRes.ok) {
                    const [notesData, categoriesData] = await Promise.all([
                        notesRes.json(),
                        categoriesRes.json()
                    ]);

                    setNotes(notesData);
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter notes based on selected category
    const filteredNotes = selectedCategory
        ? notes.filter(note => note.categoryId === selectedCategory.id)
        : notes;

    const handleNoteCreate = (newNote: Note) => {
        setNotes(prevNotes => [newNote, ...prevNotes]);
    };

    return (
        <div className="flex min-h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Categories */}
            <div className="w-64 border-r pr-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Categories</h2>
                    {/* Add CategoryDialog component here when ready */}
                </div>

                <div className="space-y-2">
                    <button
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        <FolderIcon className="h-4 w-4" />
                        <span>All Notes</span>
                    </button>

                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${selectedCategory?.id === category.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Notes Grid */}
            <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        {selectedCategory ? selectedCategory.name : 'All Notes'}
                    </h1>
                    <NoteDialog categories={categories} onNoteCreate={handleNoteCreate} />
                </div>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map(note => (
                        <div
                            key={note.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <h3 className="font-medium mb-2">{note.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {note.content}
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{categories.find(category => category.id === note.categoryId)?.name || 'Uncategorized'}</span>
                                <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
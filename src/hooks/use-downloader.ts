
"use client";

import { useState, useEffect } from 'react';

export interface DownloaderItem {
    id: string;
    url: string;
    name: string;
}

export interface DownloadState {
    progress: number;
    status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
    error?: string;
}

export const useDownloader = (items: DownloaderItem[]) => {
    const [downloads, setDownloads] = useState<Record<string, DownloadState>>(() => {
        const initialState: Record<string, DownloadState> = {};
        items.forEach(item => {
            initialState[item.id] = { progress: 0, status: 'idle' };
        });
        return initialState;
    });

    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        setIsDownloading(Object.values(downloads).some(d => d.status === 'downloading'));
    }, [downloads]);

    const startDownload = (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item || downloads[id].status === 'downloading' || downloads[id].status === 'completed') return;

        setDownloads(prev => ({
            ...prev,
            [id]: { ...prev[id], status: 'downloading', progress: 0, error: undefined }
        }));

        // Simulate download progress
        const interval = setInterval(() => {
            setDownloads(prev => {
                const currentProgress = prev[id].progress;
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    return { ...prev, [id]: { ...prev[id], status: 'completed' } };
                }
                const newProgress = Math.min(currentProgress + 10, 100);
                return { ...prev, [id]: { ...prev[id], progress: newProgress } };
            });
        }, 500);
    };

    const pauseDownload = (id: string) => {
        // Pausing logic would go here
    };

    const resumeDownload = (id: string) => {
        // Resuming logic would go here
    };

    const getDownloadState = (id: string) => {
        return downloads[id] || { progress: 0, status: 'idle' };
    };

    return {
        startDownload,
        pauseDownload,
        resumeDownload,
        getDownloadState,
        isDownloading,
    };
};

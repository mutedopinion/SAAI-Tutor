
"use client";

import { useState, useEffect } from 'react';
import { modelDB } from '@/lib/db';

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
        const checkExistingDownloads = async () => {
            await modelDB.init();
            const downloadedIds = await modelDB.getDownloadedModelIds();
            setDownloads(prev => {
                const newState = { ...prev };
                downloadedIds.forEach(id => {
                    if (newState[id]) {
                        newState[id] = { progress: 100, status: 'completed' };
                    }
                });
                return newState;
            });
        };
        checkExistingDownloads();
    }, []);


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

        // Simulate download progress with variable speed
        const simulateProgress = (currentProgress: number) => {
            if (downloads[id].status === 'paused') return;

            const increment = Math.random() * 5 + 1; // Variable increment
            const newProgress = Math.min(currentProgress + increment, 100);

            setDownloads(prev => {
                 if (prev[id].status !== 'downloading') {
                    // Stop simulation if status changed
                    return prev;
                }
                return {
                    ...prev,
                    [id]: { ...prev[id], progress: Math.round(newProgress) }
                }
            });

            if (newProgress < 100) {
                setTimeout(() => simulateProgress(newProgress), Math.random() * 1000 + 200);
            } else {
                 setDownloads(prev => ({
                    ...prev,
                    [id]: { ...prev[id], status: 'completed', progress: 100 }
                }));
                 // Save a mock blob to IndexedDB to simulate file storage.
                 modelDB.addModel(id, new Blob([`mock-data-for-${id}`]));
            }
        }
        
        simulateProgress(0);
    };

    const pauseDownload = (id: string) => {
        // Pausing logic would go here
         setDownloads(prev => ({ ...prev, [id]: { ...prev[id], status: 'paused' } }));
    };

    const resumeDownload = (id: string) => {
        // Resuming logic would go here
        startDownload(id);
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

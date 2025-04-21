import { useState, useEffect, useRef } from 'react';

export function useTextSelection(containerRef) {
    const [selection, setSelection] = useState(null);
    const [position, setPosition] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSelection = () => {
        const activeSelection = window.getSelection();
        const text = activeSelection?.toString();

        if (!activeSelection || !text || text.trim() === '') {
            setSelection(null);
            return;
        }

        const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

        setSelection(text);
        setPosition({
            x: rect.left + (rect.width / 2),
            y: rect.top - 10,
        });
    };

    const copyToClipboard = () => {
        if (!selection) return;

        navigator.clipboard.writeText(selection)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                    setSelection(null);
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    useEffect(() => {
        // If containerRef is provided, use it; otherwise, use document
        const container = containerRef?.current || document;

        container.addEventListener('mouseup', handleSelection);
        container.addEventListener('touchend', handleSelection);

        return () => {
            container.removeEventListener('mouseup', handleSelection);
            container.removeEventListener('touchend', handleSelection);
        };
    }, [containerRef]);

    return {
        selection,
        position,
        copied,
        copyToClipboard,
        clearSelection: () => setSelection(null)
    };
}
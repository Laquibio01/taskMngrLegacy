import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];

const useKonamiCode = (callback) => {
    const [input, setInput] = useState([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Create new input array with the latest key
            // We only keep the last N keys where N is the length of Konami Code
            const newInput = [...input, e.key].slice(-KONAMI_CODE.length);

            setInput(newInput);

            // Check if the current input matches the Konami Code
            if (JSON.stringify(newInput) === JSON.stringify(KONAMI_CODE)) {
                callback();
                setInput([]); // Reset after success
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [input, callback]); // Dependency on input to keep track
};

export default useKonamiCode;

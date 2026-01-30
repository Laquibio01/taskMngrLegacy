import React, { useState, useEffect, useCallback } from 'react';
import './PacmanGame.css';

const BOARD_SIZE = 15;
const INITIAL_PACMAN = { x: 1, y: 1 };
const INITIAL_GHOSTS = [{ x: 13, y: 13, color: 'red' }, { x: 13, y: 1, color: 'pink' }];
const WALL = 1;
const DOT = 0;
const EMPTY = 2; // Visited

// Simple symmetrical maze
const INITIAL_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const PacmanGame = ({ onClose }) => {
    const [map, setMap] = useState(JSON.parse(JSON.stringify(INITIAL_MAP)));
    const [pacman, setPacman] = useState(INITIAL_PACMAN);
    const [ghosts, setGhosts] = useState(INITIAL_GHOSTS);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [direction, setDirection] = useState({ x: 0, y: 0 });

    const moveEntity = (entity, dir, currentMap) => {
        const newX = entity.x + dir.x;
        const newY = entity.y + dir.y;

        if (
            newX >= 0 &&
            newX < BOARD_SIZE &&
            newY >= 0 &&
            newY < BOARD_SIZE &&
            currentMap[newY][newX] !== WALL
        ) {
            return { x: newX, y: newY };
        }
        return entity;
    };

    const handleKeyDown = useCallback((e) => {
        if (gameOver || win) return;

        switch (e.key) {
            case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
            case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
            case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
            case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
            default: break;
        }
    }, [gameOver, win]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return null;
};

export default PacmanGame;

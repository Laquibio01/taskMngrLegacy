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

    // Game Loop
    useEffect(() => {
        if (gameOver || win) return;

        const interval = setInterval(() => {
            // Move Pacman
            setPacman(prev => {
                const next = moveEntity(prev, direction, map);

                // Eat dot
                if (map[next.y][next.x] === DOT) {
                    const newMap = [...map];
                    newMap[next.y][next.x] = EMPTY;
                    setMap(newMap);
                    setScore(s => s + 10);
                }
                return next;
            });

            // Move Ghosts (Randomly)
            setGhosts(prevGhosts => prevGhosts.map(ghost => {
                const dirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
                const validDirs = dirs.filter(d => {
                    const nx = ghost.x + d.x;
                    const ny = ghost.y + d.y;
                    return map[ny] && map[ny][nx] !== WALL;
                });
                const dir = validDirs[Math.floor(Math.random() * validDirs.length)] || { x: 0, y: 0 };
                return moveEntity(ghost, dir, map);
            }));

        }, 200);

        return () => clearInterval(interval);
    }, [direction, map, gameOver, win]);

    // Collision Check & Win Condition
    useEffect(() => {
        // Check Collision
        if (ghosts.some(g => g.x === pacman.x && g.y === pacman.y)) {
            setGameOver(true);
        }

        // Check Win
        let dotsRemaining = 0;
        map.forEach(row => row.forEach(cell => {
            if (cell === DOT) dotsRemaining++;
        }));
        if (dotsRemaining === 0) setWin(true);

    }, [pacman, ghosts, map]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const resetGame = () => {
        setMap(JSON.parse(JSON.stringify(INITIAL_MAP)));
        setPacman(INITIAL_PACMAN);
        setGhosts(INITIAL_GHOSTS);
        setScore(0);
        setGameOver(false);
        setWin(false);
        setDirection({ x: 0, y: 0 });
    };

    return (
        <div className="pacman-overlay">
            <div className="pacman-modal">
                <div className="game-header">
                    <h2>PAC-MAN MINI</h2>
                    <p>Score: {score}</p>
                    <button onClick={onClose} className="btn-close">X</button>
                </div>

                <div className="game-board">
                    {map.map((row, y) => (
                        <div key={y} className="row">
                            {row.map((cell, x) => {
                                let className = 'cell ';
                                if (cell === WALL) className += 'wall';
                                if (cell === DOT) className += 'dot';

                                // Render Entities
                                if (pacman.x === x && pacman.y === y) return <div key={x} className="cell pacman">C</div>;
                                const ghost = ghosts.find(g => g.x === x && g.y === y);
                                if (ghost) return <div key={x} className={`cell ghost ${ghost.color}`}>👻</div>;

                                return <div key={x} className={className}></div>;
                            })}
                        </div>
                    ))}
                </div>

                {gameOver && (
                    <div className="game-status lose">
                        <h3>GAME OVER</h3>
                        <button onClick={resetGame}>Try Again</button>
                    </div>
                )}

                {win && (
                    <div className="game-status win">
                        <h3>YOU WIN!</h3>
                        <button onClick={resetGame}>Play Again</button>
                    </div>
                )}

                <div className="controls-hint">Use Arrow Keys to Move</div>
            </div>
        </div>
    );
};

export default PacmanGame;

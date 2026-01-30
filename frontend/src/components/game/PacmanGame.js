import React, { useState, useEffect, useCallback, useRef } from 'react';
import './PacmanGame.css';

// 0: Empty, 1: Wall, 2: Dot, 3: Pacman, 4: Ghost
const BOARD_WIDTH = 19;
const BOARD_HEIGHT = 19;

// Simplified map layout
const INITIAL_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 0], // Tunnel layer
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const PacmanGame = ({ onClose }) => {
    const [grid, setGrid] = useState(JSON.parse(JSON.stringify(INITIAL_MAP)));
    const [pacman, setPacman] = useState({ x: 9, y: 16, dir: 'LEFT' });
    const [ghosts, setGhosts] = useState([
        { x: 9, y: 8, color: 'red', dir: 'UP' },
        { x: 8, y: 10, color: 'pink', dir: 'DOWN' },
        { x: 10, y: 10, color: 'cyan', dir: 'UP' }
    ]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [gameLoop, setGameLoop] = useState(null);

    // Direction refs for movement logic
    const nextDir = useRef('LEFT');
    const currentDir = useRef('LEFT');

    // Handle Input
    useEffect(() => {
        const handleKey = (e) => {
            switch (e.key) {
                case 'ArrowUp': nextDir.current = 'UP'; break;
                case 'ArrowDown': nextDir.current = 'DOWN'; break;
                case 'ArrowLeft': nextDir.current = 'LEFT'; break;
                case 'ArrowRight': nextDir.current = 'RIGHT'; break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Game Loop
    useEffect(() => {
        if (gameOver || win) return;

        const moveEntity = (entity, desiredDir) => {
            let newX = entity.x;
            let newY = entity.y;

            if (desiredDir === 'UP') newY--;
            if (desiredDir === 'DOWN') newY++;
            if (desiredDir === 'LEFT') newX--;
            if (desiredDir === 'RIGHT') newX++;

            // Tunnel Wrap
            if (newX < 0) newX = BOARD_WIDTH - 1;
            if (newX >= BOARD_WIDTH) newX = 0;

            // Collision Check
            if (grid[newY] && grid[newY][newX] === 1) {
                return { x: entity.x, y: entity.y, moved: false }; // Hit Wall
            }
            return { x: newX, y: newY, moved: true };
        };

        const interval = setInterval(() => {
            setPacman(prev => {
                // Try next direction first
                let move = moveEntity(prev, nextDir.current);
                if (move.moved) {
                    currentDir.current = nextDir.current;
                } else {
                    // Keep current direction if next failed
                    move = moveEntity(prev, currentDir.current);
                }

                const newPacman = { x: move.x, y: move.y, dir: currentDir.current };

                // Eat Dot
                if (grid[newPacman.y][newPacman.x] === 2) {
                    setScore(s => s + 10);
                    const newGrid = [...grid];
                    newGrid[newPacman.y][newPacman.x] = 0;
                    setGrid(newGrid);

                    // Check Win
                    if (!newGrid.flat().includes(2)) setWin(true);
                }

                return newPacman;
            });

            // Move Ghosts Randomly
            setGhosts(prevGhosts => prevGhosts.map(ghost => {
                const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
                // Simple AI: 80% chance to keep direction, 20% random
                let dir = ghost.dir;
                if (Math.random() < 0.2) {
                    dir = directions[Math.floor(Math.random() * 4)];
                }

                const move = moveEntity(ghost, dir);

                // If hit wall, pick random valid direction
                if (!move.moved) {
                    const validMoves = directions.filter(d => moveEntity(ghost, d).moved);
                    if (validMoves.length > 0) {
                        const randomValid = validMoves[Math.floor(Math.random() * validMoves.length)];
                        const newMove = moveEntity(ghost, randomValid);
                        return { x: newMove.x, y: newMove.y, color: ghost.color, dir: randomValid };
                    }
                }
                return { ...move, color: ghost.color, dir: dir };
            }));

        }, 200); // Game Speed

        setGameLoop(interval);
        return () => clearInterval(interval);
    }, [gameOver, win, grid]); // Dependencies causing re-creation of loop on grid change is generic logic, optimized enough for egg

    // Collision with Ghost
    useEffect(() => {
        ghosts.forEach(g => {
            if (g.x === pacman.x && g.y === pacman.y) {
                setGameOver(true);
                clearInterval(gameLoop);
            }
        });
    }, [pacman, ghosts, gameLoop]);


    return (
        <div className="pacman-overlay">
            <div className="pacman-container">
                <div className="game-header">
                    <span>PAC-MAN</span>
                    <span className="score">SCORE: {score}</span>
                </div>

                <div className="grid" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, 20px)` }}>
                    {grid.map((row, y) => row.map((cell, x) => {
                        let content = null;
                        if (cell === 1) content = <div className="cell wall"></div>;
                        if (cell === 2) content = <div className="cell"><div className="dot"></div></div>;
                        if (cell === 0) content = <div className="cell"></div>;

                        // Render Entities
                        if (pacman.x === x && pacman.y === y) {
                            content = <div className="cell"><div className="pacman" style={{ transform: `rotate(${pacman.dir === 'RIGHT' ? 0 : pacman.dir === 'DOWN' ? 90 : pacman.dir === 'LEFT' ? 180 : 270}deg)` }}></div></div>;
                        }
                        ghosts.forEach(g => {
                            if (g.x === x && g.y === y) {
                                content = <div className="cell"><div className={`ghost ${g.color}`}></div></div>;
                            }
                        });

                        return <div key={`${x}-${y}`}>{content}</div>;
                    }))}
                </div>

                {gameOver && <div className="game-over">GAME OVER</div>}
                {win && <div className="game-win">YOU WIN!</div>}

                <div className="controls-hint">Use Arrow Keys to Move</div>
                <button className="close-btn" onClick={onClose}>Close Game</button>
            </div>
        </div>
    );
};

export default PacmanGame;

// Packet Snake — pure game logic, view-agnostic. The canvas cabinet and the
// terminal's ASCII mode both drive this same engine.
// Theme: the snake is a pipeline; the food is a data packet. Edges wrap —
// packets route around the subnet.

export const COLS = 21;
export const ROWS = 15;

const spawnFood = (snake) => {
  while (true) {
    const f = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

export const createSnake = () => {
  const snake = [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }];
  return {
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: spawnFood(snake),
    score: 0,
    dead: false,
    ate: false,
  };
};

// Queue a direction change; reversals into yourself are ignored.
export const setDir = (state, dir) => {
  if (state.dir.x + dir.x === 0 && state.dir.y + dir.y === 0) return;
  state.nextDir = dir;
};

// Advance one tick (mutates state — game state lives outside React).
export const step = (state) => {
  if (state.dead) return state;
  state.dir = state.nextDir;
  state.ate = false;

  const head = {
    x: (state.snake[0].x + state.dir.x + COLS) % COLS,
    y: (state.snake[0].y + state.dir.y + ROWS) % ROWS,
  };

  if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
    state.dead = true;
    return state;
  }

  state.snake.unshift(head);
  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 1;
    state.ate = true;
    state.food = spawnFood(state.snake);
  } else {
    state.snake.pop();
  }
  return state;
};

// Tick interval speeds up with score.
export const tickMs = (score) => Math.max(72, 150 - score * 3);

export const KEY_DIRS = {
  ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 }, z: { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },  s: { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 }, q: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },  d: { x: 1, y: 0 },
};

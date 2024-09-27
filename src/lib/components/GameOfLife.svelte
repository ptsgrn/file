<script lang="ts">
	import { onMount } from 'svelte';
	function conveyGameOfLife() {
		const $body = document.querySelector('body');
		if (!$body) return;
		const $canvas = document.createElement('canvas');
		$canvas.classList.add('gof');
		$canvas.width = $body.clientWidth;
		$canvas.height = $body.clientHeight;
		$body.appendChild($canvas);
		const ctx = $canvas.getContext('2d');
		const size = 5;
		const delay = 50;
		let cols = Math.floor($canvas.width / size);
		let rows = Math.floor($canvas.height / size);
		let gridArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null));
		let next = new Array(cols).fill(null).map(() => new Array(rows).fill(null));
		const init = () => {
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					gridArray[i][j] = Math.floor(Math.random() * 2);
				}
			}
		};
		const draw = () => {
			if (!ctx) return;
			ctx.clearRect(0, 0, $canvas.width, $canvas.height);
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					ctx.beginPath();
					ctx.rect(i * size, j * size, size, size);
					ctx.fillStyle = gridArray[i][j] ? 'rgba(2,255,255,0.1)' : 'transparent';
					ctx.fill();
					ctx.closePath();
				}
			}
		};
		const update = () => {
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					let neighborsCount = 0;
					for (let x = -1; x <= 1; x++) {
						for (let y = -1; y <= 1; y++) {
							if (x === 0 && y === 0) continue;
							if (i + x < 0 || i + x >= cols || j + y < 0 || j + y >= rows) continue;
							neighborsCount += gridArray[i + x][j + y];
						}
					}
					// Alive cell – Fewer than 2 alive neighbours – dies (underpopulation)
					if (gridArray[i][j] === 1 && neighborsCount < 2) {
						next[i][j] = 0; // die
						// Alive cell – 2 or 3 neighbours – continues to live (perfect situation)
					} else if (gridArray[i][j] === 1 && [2, 3].includes(neighborsCount)) {
						next[i][j] = 1;
						// Alive cell – More than 3 alive neighbours – dies (overpopulation)
					} else if (gridArray[i][j] === 1 && neighborsCount > 3) {
						next[i][j] = 0;
					} else if (gridArray[i][j] === 0 && neighborsCount === 3) {
						next[i][j] = 1;
					} else {
						next[i][j] = gridArray[i][j];
					}
				}
			}
			const temp = gridArray;
			gridArray = next;
			next = temp;
		};
		let interruptLoop = false;
		const loop = () => {
			if (interruptLoop) return;
			draw();
			update();
			setTimeout(() => {
				requestAnimationFrame(loop);
			}, delay);
		};
		init();
		loop();
		return {
			destroy: () => {
				interruptLoop = true;
				$canvas.remove();
			}
		};
	}

	onMount(() => {
		let cgol = conveyGameOfLife();
		window.addEventListener('resize', () => {
			cgol?.destroy();
			cgol = conveyGameOfLife();
		});
		return {
			destroy: () => {
				cgol?.destroy();
			}
		};
	});
</script>

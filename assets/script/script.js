let topSpikeHeight = 0;
let score = 0;
let intervalId;
const MAX_HEIGHT = 500;
const GAME_SCREEN_HEIGHT = 600;
const GAP = GAME_SCREEN_HEIGHT - MAX_HEIGHT;
// const HIGH_SCORE_KEY = "highScore";

//add level difficulties if enough time
// const difficulties = {
// 	hard: 570,
// 	medium: 500,
// 	easy: 420,
// }

//START GAME METHOD
const game = {
	el: {
		screens: {
			startScreen: document.querySelector('#start-screen'),
			gameScreen: document.querySelector('#game'),
			endScreen: document.querySelector('#end-screen'),
			creditScreen: document.querySelector('#credit-screen')
		},
		ui: {
			start: {
				startGameBtn:document.getElementById('start-button'),
			},
			gameOver: {
				playAgainBtn: document.getElementById('play-again'),
			},
			credit: {
				creditSection: document.getElementById('credit-button'),
			},
			home: {
				homeBtn: document.getElementById('home-button'),
			}
		},
	},
	switchScreen: function (screen) {
		for (const screenKey in game.el.screens) {
			game.el.screens[screenKey].classList.add("hidden");
		}
		screen.classList.remove('hidden');
	},
	//reset score function
	resetScore: function (){
		score = 0;
		const scoreSpan = document.getElementById('scoreSpan');
		scoreSpan.textContent = score;
	},


	init: function () {
		// Run these two lines whenever changing difficulty.
		document.documentElement.style.setProperty('--gap', `-${GAP}px`);
		document.documentElement.style.setProperty('--half-screen-size', `${(GAME_SCREEN_HEIGHT - GAP) / 2}px`);

		const {start, gameOver, credit, home} = this.el.ui;
		const {startScreen, gameScreen, creditScreen} = this.el.screens;
		const {switchScreen} = this;
		const audio = document.querySelector('audio');

		//btn to start game
		start.startGameBtn.addEventListener('click', ()=>{
			console.log('clicked');

			//reset the score
			this.resetScore();
			//switch to the game screen
			switchScreen(gameScreen);
			//show and update score in game
			intervalId = setInterval(() => {
				score++;
				console.log('current Score', score);
				const scoreSpan = document.getElementById('scoreSpan');
				scoreSpan.textContent = score;
			},1000);

			//play audo when switching to game screen 
			audio.play();
		});

		gameOver.playAgainBtn.addEventListener('click',()=>{

			audio.pause();
			audio.currentTime = 0;
			//switch back to the start screen
			game.switchScreen(startScreen);
			//stop the score and reset
			game.resetScore();
			scoreSpan.textContent = score++;
		});

		credit.creditSection.addEventListener('click', ()=>{
			console.log('clickcred');
			switchScreen(creditScreen);
		});

		home.homeBtn.addEventListener('click',()=>{
			switchScreen(startScreen);
		});
	},
};

//stop the score when bat dies
function stopScore() {
	console.log('stop');
	clearInterval(intervalId);
}

// When the DOM has fully loaded.
window.addEventListener("DOMContentLoaded", ()=>{
	game.init();
});
addEventListener('DOMContentLoaded', () => {
	const spikeTop = document.getElementById('spike-top');
	const spikeBottom = document.getElementById('spike-bottom');
	const gameEl = document.getElementById('game');
	const gameImgEl = document.querySelector('.game-bg');
	gameEl.style.height = `${GAME_SCREEN_HEIGHT}px`;
	gameImgEl.style.height = `${GAME_SCREEN_HEIGHT}px`;
	
	//random spike size top and bottom
	spikeTop.addEventListener('animationiteration', () => {
		topSpikeHeight = Math.round(Math.random() * MAX_HEIGHT);
		const bottomSpikeHeight = GAME_SCREEN_HEIGHT - topSpikeHeight - GAP;
		spikeTop.style.height = `${topSpikeHeight}px`;
		spikeBottom.style.height = `${bottomSpikeHeight}px`;
	});

	//Character & movement 
	function Character() {
		this.y = GAME_SCREEN_HEIGHT/2;
		this.x = 25;
		
		//set gravity for bird to drop
		this.gravity = 0.05;
		this.jump = -3;
		this.velocity = 0;

		this.show = function() {
			const batEl = document.getElementById('character');
			batEl.style.display = 'block';
			batEl.style.position = 'absolute';
			batEl.style.width = '60px';
			batEl.style.height = '42px';
			batEl.style.top = `${this.y}px`;
			batEl.style.left = `${this.x}px`;
		};
		
		this.update = function() {
			this.velocity += this.gravity;
			this.y += this.velocity;

			if(this.y < 0){
				this.y = 0; 
				this.velocity = 0;
			}

			if(this.y > GAME_SCREEN_HEIGHT - 60){
				this.y = GAME_SCREEN_HEIGHT - 60;
				this.velocity = 0;
			};
		};

		this.jumpStrength = function () {
			this.velocity = this.jump;
		};
		//bat movement
		gameEl.addEventListener('click', () => {
			console.log('click');
				this.jumpStrength();
		});
	};


//Create an instance for char 
const myCharacter = new Character();
//call the show method 
myCharacter.show();

//set a gravity for the bird to drop
setInterval(() => {
	myCharacter.update();
	myCharacter.show();
	myCharacter.hits();
}, 10);

//bird hits spike fxn to stop game
myCharacter.hits = function () {
    const characterRect = document.getElementById('character').getBoundingClientRect();
    const spikeTopRect = spikeTop.getBoundingClientRect();
    const spikeBottomRect = spikeBottom.getBoundingClientRect();

    // console.log('Character Rect:', characterRect);
    // console.log('Spike Top Rect:', spikeTopRect);
    // console.log('Spike Bottom Rect:', spikeBottomRect);

    // Adjust the range according to your game logic
    const xRange = -30; // You may need to adjust this value

    // Check if character's x-coordinate is within the range of spike top
    if (
        characterRect.right + xRange > spikeTopRect.left &&
        characterRect.left - xRange < spikeTopRect.right &&
        characterRect.bottom > spikeTopRect.top &&
        characterRect.top < spikeTopRect.bottom
    ) {
        console.log("Hit spike top!");
				// spikeTop.style.backgroundColor = 'red';
        // You may want to handle the game over logic here
		game.switchScreen(game.el.screens.endScreen);
		stopScore();
    }

    // Check if character's x-coordinate is within the range of spike bottom
    if (
        characterRect.right + xRange > spikeBottomRect.left &&
        characterRect.left - xRange < spikeBottomRect.right &&
        characterRect.bottom > spikeBottomRect.top &&
        characterRect.top < spikeBottomRect.bottom
    ) {
        console.log("Hit spike bottom!");
				// spikeBottom.style.backgroundColor = 'red';
        // You may want to handle the game over logic here
		game.switchScreen(game.el.screens.endScreen);
		stopScore();
    }
};

// clearInterval when bat dies
//spike.getBoundingClientRect set bird this.x
	
	//you lose start over screen
	//for loop for animating the dead bat 
});





const fillRow = (row) => {
	for (let i = 1; i < 9; i++) {
		const box = document.createElement("div");
		box.setAttribute("class","box");
		box.setAttribute("id",row.id+"-col"+i);
		box.innerHTML = i;
		row.appendChild(box);
	}
}

const move = (snake, directionState, boxes, food) => {
	console.log("directionState: "+ directionState);
	const headRow = snake[0].row;
	const headCol = snake[0].col;
	let nextBox;
	switch (directionState) {
		case "right":
			nextBox = getNextBox(headRow, headCol+1, boxes);
			nextBox = {box: nextBox, row: headRow, col: headCol+1};
			break;
		case "left":
			nextBox = getNextBox(headRow, headCol-1, boxes);
			nextBox = {box: nextBox, row: headRow, col: headCol-1};
			break;
		case "up":
			nextBox = getNextBox(headRow-1, headCol, boxes);
			nextBox = {box: nextBox, row: headRow-1, col: headCol};
			break;
		case "down":
			nextBox = getNextBox(headRow+1, headCol, boxes);
			nextBox = {box: nextBox, row: headRow+1, col: headCol};
			break;
		default:
			console.log("error in direction set!");
	}
	if (nextBox.box && !isCollision(nextBox, snake)) {
		colorBox(nextBox.box);
		snake.unshift(nextBox);
		if (!(nextBox.box === food.box)) {
			discolorBox(snake.pop().box);
		} else {
			generateFood(food, boxes, snake)
		}
	} else
		gameOver();
}

const getNextBox = (row, col, boxes) => {
	if (boxes[row-1] && boxes[row-1][col-1])
		return boxes[row-1][col-1];
	else {
		return false;
	}
}

const gameOver = () => {
		alert("Game Over!");
		window.clearInterval(timer);
}

const setDirection = (event) => {
	console.log(event);
	switch (event.keyCode) {
		case 38:
			if (directionState != "down")
				directionState = "up";
			break;
		case 39:
			if (directionState != "left")
				directionState = "right";
			break;
		case 40:
			if (directionState != "up")
				directionState = "down";
			break;
		case 37:
			if (directionState != "right")
				directionState = "left";
			break;
		default:
			console.log("Key press not part of game key!");
	}
}

const colorBox = (box) => box.style.backgroundColor = "gold";
const colorFoodBox = (box) => box.style.backgroundColor = "red";
const discolorBox = (box) => box.style.backgroundColor = "DeepSkyBlue";

const generateFood = (food, boxes, snake) => {
	while (food.box === undefined || isCollision(food, snake)) {
		console.log("Gen food!!");
		const row = Math.floor(Math.random() * boxes.length);
		const col = Math.floor(Math.random() * boxes[0].length);
		food.box = boxes[row][col];
		food.row = row+1;
		food.col = col+1;
	}
	colorFoodBox(food.box);
}

const isCollision = (area, snake) => {
	return (snake.some((part) =>{
		if (area.box === part.box)
			return true;
		else
			return false
	}));
}

// Fill rows
let rows = document.querySelectorAll('.row');
rows.forEach(fillRow);

// Attributes
let directionState = "right";
let speed = 700;
let snake = new Array();
let boxes = new Array();
let food = {box: undefined,row: undefined,col: undefined};

// Store grid as array
rows.forEach((row) => {
	boxes.push(row.childNodes);
})

//Init snake
snake.unshift({box: boxes[0][0], row: 1, col: 1});
snake.unshift({box: boxes[0][1], row: 1, col: 2});
snake.unshift({box: boxes[0][2], row: 1, col: 3});
snake.forEach(body => colorBox(body.box));
generateFood(food, boxes, snake);

window.addEventListener("keypress",setDirection); 
const timer = window.setInterval(() => move(snake, directionState, boxes, food), speed);

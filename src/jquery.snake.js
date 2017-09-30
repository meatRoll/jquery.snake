/**
 * version: 1.0.0
 * 使用本插件前请务必引入jquery
 * 仅支持IE9及以上
 */
(function ($) {
	// Snake对象
	function Snake() {}

	$.extend(Snake.prototype, {
		// 使snake爬行
		walk: function (speed) {
			var _this = this;
			this.stop();
			this.clockId = setInterval(function () {
				console.log(_this.speedToTime(speed))
			}, this.speedToTime(speed));
		},
		// 使snake停止
		stop: function () {
			clearInterval(this.clockId);
		},
		// speed转成时间
		speedToTime: function (speed) {
			return 50 * (10 - speed);
		},
		// 设置初始位置 
		setInitialPosition: function (posArr) {
			this.body = posArr;
		}
	});

	// Food对象
	function Food(snake, food, map) {
		this.snake = snake;
		this.food = food;
		this.map = map;
	}

	$.extend(Food.prototype, {
		// 获取食物位置坐标
		getRandomArrayElement: function () {
			var start = 0,
				len = this.foodMap.length;
			return arr[Math.floor(start + Math.random() * len)];
		},
		/**
		 * 把多个数组合并成一个
		 * @param {Array}
		 */
		mergeArray: function () {
			var tempArr = [];
			Array.prototype.forEach.call(arguments, function (elem) {
				tempArr = tempArr.concat(elem);
			});
			return tempArr;
		},
		/**
		 * 过滤数组元素
		 * @param {Array} arrMap  被过滤的数组
		 * @param {Array} arrFilter 数组集合参数
		 */
		filtrateArray: function (arrMap, arrFilter) {
			var tempArr = arrMap;
			tempArr = tempArr.filter(function (elemOut) {
				return !arrFilter.some(function (elemIn) {
					return elemOut === elemIn;
				});
			});
			return tempArr;
		},
		// 得到food位置的可用数组
		getMap: function () {
			var filters = [];
			this.snake.forEach(function(elem){
				filters = filters.concat(elem.body);
			});
			this.food.forEach(function(elem) {
				if(elem.position) filters.push(elem.position);	
			});
			this.foodMap = this.filtrateArray(this.map, filters);
		}
	});

	// Drawer对象
	function Drawer(unit) {
		this.unit = unit;
	}

	$.extend(Drawer.prototype, {
		/**
		 * @param {Number} squareLength 单元大小
		 */
		calculateSquare: function (squareLength) {

		}
	});

	/**
	 * @method  snake
	 * @param {Object} options 参数配置选项
	 */
	$.fn.snake = function (options) {
		var $canvas = $(this);

		// 检验是否支持canvas
		if ($canvas.get(0).getContext) {
			var ctx = $(this).get(0).getContext('2d');
		} else {
			throw new Error('不支持canvas');
		}

		// 检测是否传入参数
		options = typeof options === 'object' ? options : {};

		// 提取各种配置项
		var unit = (options.common && options.common.unit) || 10,
			speed = (options.common && options.common.speed) || 5,
			bgColor = (options.background && options.background.color) || 'white',
			bdColor = (options.border && options.border.color) || 'black',
			bdWidth = (options.border && options.border.width) || 10,
			bdStyle = (options.border && options.border.style) || 'solid';

		// 检测canvas整体尺寸与unit的匹配度
		if ($canvas.width() % unit !== 0) throw new Error('canvas宽度与unit不符');
		if ($canvas.height() % unit !== 0) throw new Error('canvas高度与unit不符');

		// 检测使snake的配置项至少为1
		if (!options.snake || options.snake.length === 0) options.snake = [{}];

		// 提取snake的配置项
		var snakeConfig = [];
		options.snake.forEach(function (elem, index) {
			snakeConfig[index] = {};
			for (var key in elem) {
				snakeConfig[index][key] = elem[key];
			}
			if (index === 0) {
				snakeConfig[index].color = snakeConfig[index].color || 'black';
				snakeConfig[index].up = snakeConfig[index].up || 38;
				snakeConfig[index].down = snakeConfig[index].down || 40;
				snakeConfig[index].left = snakeConfig[index].left || 37;
				snakeConfig[index].right = snakeConfig[index].right || 39;
			}
		});

		// 检测使food的配置项至少为1
		if (!options.food || options.food.length === 0) options.food = [{}];

		// 提取food的配置项
		var foodConfig = [];
		options.food.forEach(function (elem, index) {
			foodConfig[index] = {};
			for (var key in elem) {
				foodConfig[index][key] = elem[key];
			}
			if (index === 0) {
				foodConfig[index].color = foodConfig[index].color || 'red';
			}
		});

		// 边框样式和背景样式
		$canvas.css({
			'border': bdWidth + 'px ' + bdStyle + ' ' + bdColor,
			'background': bgColor
		});

		// 计算row和column
		var row = $canvas.width() / unit,
			column = $canvas.height() / unit;

		// 给snake原型设定row和column
		Object.defineProperties(Snake.prototype, {
			row: {
				get: function () {
					return row;
				}
			},
			column: {
				get: function () {
					return column;
				}
			}
		});

		// 生成点阵
		var map = [];
		for (var i = 1; i <= row; i++) {
			for (var j = 1; j <= column; j++) {
				map.push(i + ' ' + j);
			}
		}

		// 生成Snake对象
		var snake = [],
			tempSnake;
		snakeConfig.forEach(function (elem, index) {
			tempSnake = snake[index] = new Snake;
			for (var key in elem) {
				if (key === 'initialPostion') tempSnake.body = elem[key];
				else tempSnake[key] = elem[key];
			}
		});
		tempSnake = null;

		// 生成Food对象
		var food = [],
			tempFood;
		foodConfig.forEach(function (elem, index) {
			tempFood = food[index] = new Food(snake, food, map);
			for (var key in elem) {
				tempFood[key] = elem[key];
			}
		});
		tempFood = null;




	}
}(jQuery));
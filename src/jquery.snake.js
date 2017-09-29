/**
 * version: 1.0.0
 * 使用本插件前请务必引入jquery
 * 仅支持IE9及以上
 */
(function ($) {
	// 贪食蛇对象
	function Snake() {
		this.body = [];
	}

	$.extend(Snake.prototype, {
		// 使snake爬行
		walk: function (speed) {
			this.stop();
			this.clockId = setInterval(function () {
				console.log(1)
			}, speedToTime(speed));
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

	// 食物对象
	function Food() {

	}

	$.extend(Food.prototype, {
		getPosition: function () {

		}
	});

	// 计算每个方块位置
	function calculateSquare(squareLength) {

	}

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
			if (index === 0) {
				snakeConfig[index] = {};
				snakeConfig[index].color = elem.color || 'black';
				snakeConfig[index].up = (elem.controls && elem.controls.up) || 38;
				snakeConfig[index].down = (elem.controls && elem.controls.down) || 40;
				snakeConfig[index].left = (elem.controls && elem.controls.left) || 37;
				snakeConfig[index].right = (elem.controls && elem.controls.right) || 39;
			} else {
				for (var key in elem) {
					snakeConfig[index] = {};
					snakeConfig[index][key] = elem[key];
				}
			}
		});

		// 检测使food的配置项至少为1
		if (!options.food || options.food.length === 0) options.food = [{}];

		// 提取food的配置项
		var foodConfig = [];
		options.food.forEach(function (elem, index) {
			if (index === 0) {
				foodConfig[index] = {};
				foodConfig[index].color = elem.color || 'red';
			} else {
				for (var key in elem) {
					foodConfig[index] = {};
					foodConfig[index][key] = elem[key];
				}
			}
		});

		// 边框样式
		$canvas.css('border', bdWidth + 'px ' + bdStyle + ' ' + bdColor);

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


	}
}(jQuery));
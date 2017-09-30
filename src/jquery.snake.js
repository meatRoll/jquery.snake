/**
 * version: 1.0.0
 * 使用本插件前请务必引入jquery
 * 仅支持IE9及以上
 */
(function ($) {
	/**
	 * Snake构造函数
	 * @class Snake
	 * @constructor Snake
	 * @param {Object} options 配置选项
	 */
	function Snake(options) {
		for (var key in options) {
			if (key === 'initialPostion') this.body = options[key];
			else this[key] = options[key];
		}
		this.setTime();
	}

	$.extend(Snake.prototype, {
		/**
		 * 使snake爬行
		 * @method walk
		 * @param {Number} speed 游戏速度
		 */
		walk: function (speed) {
			this.stop();
			this.clockId = setInterval(function () {





			}, this.time);
		},
		// 使snake停止
		stop: function () {
			clearInterval(this.clockId);
		},
		// speed转成time
		setTime: function () {
			this.time = 50 * (10 - this.speed);
		},
		/**
		 * 给外部提供的api接口，用于设置Snake的位置
		 * @param {Array} posArr 位置数据
		 */
		setInitialPosition: function (posArr) {
			this.body = posArr;
		}
	});

	/**
	 * Food构造函数
	 * @class Food
	 * @constructor Food
	 * @param {Array} snake 对象的数组集合
	 * @param {Array} food 对象的数组集合
	 * @param {Array} map 点阵数组
	 * @param {Object} options 配置选项
	 */
	function Food(snake, food, map, options) {
		this.snake = snake;
		this.food = food;
		this.map = map;
		for (var key in options) {
			this[key] = options[key];
		}
		this.getMap();
		this.getRandomArrayElement();
	}

	$.extend(Food.prototype, {
		// 获取食物位置坐标
		getRandomArrayElement: function () {
			var start = 0,
				len = this.foodMap.length;
			this.position = this.foodMap[Math.floor(start + Math.random() * len)];
		},
		/**
		 * 过滤数组元素
		 * @method filtrateArray
		 * @param {Array} arrMap  被过滤的数组
		 * @param {Array} arrFilter 数组集合参数
		 * @return {Array} 筛选过的数组
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
			this.snake.forEach(function (elem) {
				filters = filters.concat(elem.body);
			});
			this.food.forEach(function (elem) {
				if (elem.position) filters.push(elem.position);
			});
			this.foodMap = this.filtrateArray(this.map, filters);
		}
	});

	/**
	 * Drawer构造函数
	 * @class Drawer
	 * @constructor Drawer
	 * @param {Number} unit 单元大小
	 */
	function Drawer(unit) {
		this.unit = unit;
	}

	$.extend(Drawer.prototype, {
		// Drawer初始化
		initialize: function () {

		},
		/**
		 * 将记载位置的字符串转化为可利用的数组
		 * @method splitToArr
		 * @param {String} posStr 记载位置的字符串
		 * @return {Array} 记录着位置数据的数组
		 */
		splitToArr: function (posStr) {

		},
		// 计算每个单元实际位置
		calculateSquare: function () {

		}
	});

	/**
	 * @method  snake
	 * @param {Object} options 参数配置选项
	 */
	$.fn.snake = function (options) {
		var $canvas = $(this);

		// 检验是否支持canvas
		if (!$canvas.get(0).getContext) throw new Error('不支持canvas');

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
			snakeConfig[index].speed = snakeConfig[index].speed || speed;
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
			foodConfig[index].color = foodConfig[index].color || 'red';
		});

		// 边框样式和背景样式
		$canvas.css({
			'border': bdWidth + 'px ' + bdStyle + ' ' + bdColor,
			'background': bgColor
		});

		// 计算row和column
		var row = $canvas.width() / unit,
			column = $canvas.height() / unit;

		// 给Snake原型设定row和column
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
		var snake = [];
		snakeConfig.forEach(function (elem, index) {
			snake[index] = new Snake(elem);
		});

		// 生成Food对象
		var food = [];
		foodConfig.forEach(function (elem, index) {
			food[index] = new Food(snake, food, map, elem);
		});




	}
}(jQuery));
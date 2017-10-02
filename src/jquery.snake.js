/**
 * version: 1.0.0
 * 使用本插件前请务必引入jquery
 * 仅支持IE9及以上
 */
(function ($, window) {
	/**
	 * Snake构造函数
	 * @class Snake
	 * @constructor Snake
	 * @param {Object} canvas jQuery对象
	 * @param {Number} row 行数
	 * @param {Number} column 列数s
	 * @param {Object} options 配置选项
	 */
	function Snake(canvas, row, column, options) {
		this.canvas = canvas;
		this.row = row;
		this.column = column;
		this.canChangeDirection = true;
		this.direction = '1 0';
		this.ate = 0;
		for (var key in options) {
			if (key === 'initialPostion') this.body = options[key];
			else this[key] = options[key];
		}
		this.data = this.body.slice();
		this.setTime();
		// canvas事件处理
		var _this = this;
		$(window).on('click', function (event) {
			if (event.target === _this.canvas.get(0)) _this.isOnfocus = true;
			else _this.isOnfocus = false;
		});
		$(window).on('keydown', function (event) {
			if (_this.isOnfocus || _this.canChangeDirection) {
				var directionBefore = _this.direction;
				switch (event.keyCode) {
					case _this.controls.up:
						if (_this.direction !== '0 1') _this.direction = '0 -1';
						break;
					case _this.controls.down:
						if (_this.direction !== '0 -1') _this.direction = '0 1';
						break;
					case _this.controls.left:
						if (_this.direction !== '1 0') _this.direction = '-1 0';
						break;
					case _this.controls.right:
						if (_this.direction !== '-1 0') _this.direction = '1 0';
						break;
				}
				if (directionBefore !== _this.direction) _this.canChangeDirection = false;
				return false;
			}
		});
	}

	$.extend(Snake.prototype, {
		// 使snake爬行
		walk: function () {
			if (!this.announcer) throw new Error('没有绑定对应Drawer对象');
			this.stop();
			var _this = this;
			this.clockId = setInterval(function () {
				_this.setChange(_this.direction);
				_this.canChangeDirection = true;
				_this.checkIsAte();
				_this.checkIsAlive();
			}, this.time);
		},
		/**
		 * 对传入不同的操作符进行不同操作
		 * @method setChange
		 * @param {String} operation 操作符
		 */
		setChange: function (operaion) {
			var _operation = operaion.split(' '),
				tempData = this.body[0].split(' ').map(function (elem, index) {
					return Number(elem) + Number(_operation[index]);
				}, this).join(' ');
			this.data = [];
			this.data.push(tempData);
			this._body = this.body.slice();
			this.body.unshift(tempData);
			this.waste = [];
			this.waste.push(this.body.pop());
		},
		// 检查food是否被吃掉
		checkIsAte: function () {
			if (this.announcer.food.some(function (elem) {
					if (this.body[0] === elem.data[0]) {
						elem.changePosition();
						return true;
					}
				}, this)) {
				this.ate++;
				this.waste = [];
				this.body.push(this._body[this._body.length - 1]);
			}
		},
		// 检查snake是否存活,如果死亡则停止移动
		checkIsAlive: function () {
			var _this = this;
			setTimeout(function () {
				var head = _this.body[0],
					checkBody;
				head.split(' ').forEach(function (elem, index) {
					var pos = Number(elem),
						key;
					if (index === 0) key = _this.row;
					else key = _this.column;
					if (pos < 1 || pos > key) _this.die();
				});
				_this.announcer.snake.forEach(function (elemOut) {
					if (elemOut === _this) checkBody = elemOut.body.slice(1);
					else checkBody = elemOut.body;
					if (checkBody.some(function (elemIn, index) {
							if (head === elemIn) {
								if (index === 0 && _this.direction.split(' ').some(function (elem1) {
										return elemOut.direction.split(' ').some(function (elem2) {
											if (elem1 === '0') return false;
											return Number(elem1) === -Number(elem2);
										});
									})) {
									elemOut._body = elemOut.body;
									elemOut.die();
								};
								return true
							}
						})) _this.die();
				});
				_this.announcer.announce(_this);
			}, 5);
		},
		// 判定蛇死亡后的各种操作
		die: function () {
			this.stop();
			this.body = [];
			this.data = [];
			this.waste = this._body;
			if (this.died) this.died(this.announcer);
			this.announcer.announce(this);
		},
		// 使snake停止
		stop: function () {
			clearInterval(this.clockId);
		},
		// speed转成time
		setTime: function () {
			this.time = 50 * (10 - this.speed);
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
			this.data = [];
			this.data.push(this.foodMap[Math.floor(start + Math.random() * len)]);
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
		},
		// 改变food位置
		changePosition: function () {
			if (!this.announcer) throw new Error('没有绑定对应Drawer对象');
			this.getMap();
			if (this.foodMap.length === 0) {
				this.data = [];
				return;
			}
			this.getRandomArrayElement();
			this.announcer.announce(this);
		}
	});

	/**
	 * Drawer构造函数
	 * @class Drawer
	 * @constructor Drawer
	 * @param {Object} canvas jQuery对象
	 * @param {Number} unit 单元大小
	 * @param {Array} snake Snake对象数组
	 * @param {Array} food Food对象数组
	 */
	function Drawer(canvas, unit, snake, food, option) {
		this.canvas = canvas;
		this.unit = unit;
		this.snake = snake;
		this.food = food;
		this.deadSnake = 0;
		this.ganmeover = option;
		this.ctx = this.canvas.get(0).getContext('2d');
	}

	$.extend(Drawer.prototype, {
		// 初始化数据
		initialize: function () {
			this.clear();
			this.snake.forEach(function (elem) {
				this.get_data(elem);
				this.draw(elem);
				this.bind(elem);
			}, this);
			this.food.forEach(function (elem) {
				this.get_data(elem);
				this.draw(elem);
				this.bind(elem);
			}, this);
		},
		/**
		 * 用于绑定相应对象，实现监听
		 * @method bind
		 * @param {Object} obj Snake/Food对象
		 */
		bind: function (obj) {
			obj.announcer = this;
		},
		/**
		 * 用于通知Drawer对象重新计算描绘
		 * @method announce
		 * @param {Object} obj Snake/Food对象
		 */
		announce: function (obj) {
			this.get_data(obj);
			this.draw(obj);
		},
		// 计算snake死亡数
		calcultateDeath: function(){
			this.deadSnake++;
			if(this.deadSnake === this.snake.length || this.ganmeover) this.ganmeover();
		},
		/**
		 * 得到_data数据
		 * @method get_data
		 * @param {Object} obj Snake/Food对象
		 */
		get_data: function (obj) {
			obj._data = obj.data.map(function (elem) {
				return this.calculateSquare(elem);
			}, this);
			if (obj.waste) {
				obj._waste = obj.waste.map(function (elem) {
					return this.calculateSquare(elem);
				}, this);
			}
		},
		/**
		 * 计算每个单元实际位置
		 * @method calculateSquare
		 * @param {String} posStr 带有位置信息的数组
		 * @return {Array}
		 */
		calculateSquare: function (posStr) {
			var posArr = posStr.split(' ');
			return [
				(posArr[0] - 1) * this.unit,
				(posArr[1] - 1) * this.unit
			]
		},
		/**
		 * 针对特定区域进行描绘
		 * @method draw
		 * @param {Object} obj Snake对象或是Food对象
		 */
		draw: function (obj) {
			var ctx = this.ctx;
			ctx.beginPath();
			ctx.save();
			if (obj._waste) {
				obj._waste.forEach(function (elem) {
					ctx.clearRect(elem[0], elem[1], this.unit, this.unit);
				}, this);
			}
			ctx.fillStyle = obj.color;
			obj._data.forEach(function (elem) {
				ctx.fillRect(elem[0], elem[1], this.unit, this.unit);
			}, this);
			ctx.restore();
		},
		// 清空canvas
		clear: function () {
			this.ctx.clearRect(0, 0, this.canvas.width(), this.canvas.height());
		}
	});

	/**
	 * @method  snake
	 * @param {Object} options 参数配置选项
	 * @return {Object} jQuery对象
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
				if (key === 'initialDirection') {
					switch (elem[key]) {
						case 'up':
							snakeConfig[index].direction = '0 -1';
							break;
						case 'down':
							snakeConfig[index].direction = '0 1';
							break;
						case 'left':
							snakeConfig[index].direction = '-1 0';
							break;
						case 'right':
							snakeConfig[index].direction = '1 0';
							break;
					}
				} else snakeConfig[index][key] = elem[key];
			}
			if (index === 0) {
				snakeConfig[index].color = snakeConfig[index].color || 'black';
				if (!snakeConfig[index].controls) {
					snakeConfig[index].controls = {};
					snakeConfig[index].controls.up = 38;
					snakeConfig[index].controls.down = 40;
					snakeConfig[index].controls.left = 37;
					snakeConfig[index].controls.right = 39;
				}
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
			snake[index] = new Snake($canvas, row, column, elem);
		});

		// 生成Food对象
		var food = [];
		foodConfig.forEach(function (elem, index) {
			food[index] = new Food(snake, food, map, elem);
		});

		// 渲染之前的生命钩子
		var drawer, ctx = $canvas.get(0).getContext('2d');
		if (options.common && options.common.beforeDrawn) options.common.beforeDrawn(ctx, getDrawer);
		else getDrawer();

		// 生成Drawer对象
		function getDrawer() {
			ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
			drawer = new Drawer($canvas, unit, snake, food, options.Drawer && options.Drawer.ganmeovered);
			drawer.initialize();
			if (options.common && options.common.beforeStarted) options.common.beforeStarted(drawer, runSnake);
			else runSnake();
		}

		// 游戏开始
		function runSnake() {
			snake.forEach(function (elem) {
				elem.walk();
			});
		}

		return this;
	}
}(jQuery, window));
# 参数选项（options）
> 注意：
- 如没有特别标明，显示参数为默认
- 如没有特别标明，显示参数集合为Object
## 通用设置（common）
- 单位（unit）：10
- 游戏速度（speed）：5
  - 范围（range）： 0 - 9
> 以下为生命周期函数（life period callback function），后面为形参（formal parameter）
- beforeDrawn：ctx（描绘工具） next（调用以进行界面渲染）
- beforeStarted ：drawer（绘图对象）next（调用以进行游戏）
## 贪食蛇（snake）（Array）
- 颜色（color）：black
- 初始位置（initialPosition）（必填/require）: 
  - 格式（pattern）： Array  ["行/row" + "空格/space" + "列/column"]  ["1 1"]
  - 注意（warning）：位置必须相连（The location must be connected.
- 速度（speed）：同游戏速度（the same as the speed configuration above）
- 初始方向（initialDirection）：left right(default) up down
- 操作按键选择（controls）（第2条snake及以上 必填/require）：
  - 上（up）：38
  - 下（down）：40
  - 左（left）：37
  - 右（right）：39
> 以下为生命周期函数（life period callback function），后面为形参（formal parameter）
- died：Drawer对象
## 食物（food）（Array）
- 颜色（color）：red
## 绘画板（Drawer）（Object）
> 以下为生命周期函数（life period callback function），后面为形参（formal parameter）
- gameovered: 
## 背景（background）
- 颜色（color）：white
## 边框（border）
- 颜色（color）：black
- 宽度（width）：10
- 线条样式（style）：none hidden solid(default) dashed dotted double groove ridge inset outset
//js/webtools.js
//将项目中常见工具函数保存在此住方便项目直接使用
//1:创建匿名自调用函数
//2:为window对添加属性webtools
//3:为webtools添加属性css 值函数
//#对外只暴露一个属性webtools
+(function(w) {
	w.webtools = {};

	//node 元素对象
	//type transform属性值 [translateX;trnslateY;rotate;scale]
	//val  属性值
	w.webtools.css = function(node, type, val) {
		//1:判断元素是否有效  元素是否有transform属性
		//如果对象有效果没有tranform创建空对象保存
		if (typeof node === "object" && typeof node["transform"] === "undefined") {
			node["transform"] = {};
		}
		//2:判断参数个数 3 设置 2获取
		if (arguments.length >= 3) { //写入属性值
			//(1)将新值保存node对象中[方便]
			node["transform"][type] = val;
			//console.log(2);
			//console.log(node["transform"]);
			//(2)将保存值<拼接字符串>保存对象style.transform属性中
			//#test.style.transform="xys"
			var text = ""; //拼接字符串
			for (item in node["transform"]) {
				if (node["transform"].hasOwnProperty(item)) {
					//如果属性是否transform有效果
					switch (item) {
						case "translateX":
						case "translateY":
						case "translateZ":
							text += item + "(" + node["transform"][item] + "px)";
							break;
						case "scale":
							text += item + "(" + node["transform"][item] + ")";
							break;
						case "rotate":
							text += item + "(" + node["transform"][item] + "deg)";
							break;
					}
				}
			}
			//console.log(text);
			//考虑兼容问题旧webkit浏览器
			node.style.transform = node.style.webkitTransform = text;
		} else if (arguments.length == 2) { //读取属性值

			val = node["transform"][type];
			//如果用户没有设置此属性值返回默认值
			if (typeof val == "undefined") {
				switch (type) {
					case "translateX":
					case "translateY":
					case "translateZ":
					case "rotate":
						val = 0;
						break;
					case "scale":
						val = 1;
						break;
				}
			}
			return val;
		}

	}
	w.webtools.carousel = function carousel(arr) {
		var carouselWrap = document.querySelector(".carousel-wrap");
		if (carouselWrap) {
			//1:创建新变量保存指示器个数
			var pointslength = arr.length;
			//2:获取指令值
			var needCarousel = carouselWrap.getAttribute("needCarousel");
			//3:判断是否有指令赋值true false
			needCarousel = needCarousel == null ? false : true;
			//4:如果有指令 图片数组拼接 5->10
			if (needCarousel) {
				arr = arr.concat(arr);
			}
			//console.log(arr);

			var ulNode = document.createElement("ul");
			var styleNode = document.createElement("style");
			webtools.css(carouselWrap, "translateZ", 0);
			webtools.css(ulNode, "translateZ", 0);

			ulNode.className = "list";
			for (var i = 0; i < arr.length; i++) {
				ulNode.innerHTML += `<li><a href="javascript:;"><img src="${arr[i]}" /></a></li>`;
			}
			styleNode.innerHTML =
				`.carousel-wrap>.list>li{width:${1/arr.length*100}%}.carousel-wrap>.list{width:${arr.length}00%}`;

			carouselWrap.appendChild(ulNode);
			document.head.appendChild(styleNode);

			var imgNodes = document.querySelector(".carousel-wrap>.list>li>a>img");
			setTimeout(() => {
				carouselWrap.style.height = imgNodes.offsetHeight + "px";
			}, 50);


			//动态添加指示器(小圆点)
			//1:获取指示器父元素
			//2:判断是否有父元素
			//3:创建循环创建span 一个小圆点添加active
			//4:为了躲queryselect坑再次获取元素
			var pointWrap = document.querySelector(".carousel-wrap>.points-wrap");
			//webtools.css(pointsSpan,"translateZ",0);

			if (pointWrap) {
				//version 6
				for (var i = 0; i < pointslength; i++) {
					if (i == 0) {
						pointWrap.innerHTML += '<span class="active"></span>'
					} else {
						pointWrap.innerHTML += '<span></span>'
					}
				} //for end
				var pointsSpan = document.querySelectorAll(".carousel-wrap>.points-wrap>span");

				//version e end

			} //if pointwrap end
		} //if carouselWrap end


		//滑屏
		//1:拿到元素一开始位置   2:拿到手指开始点击位置
		//3:拿到手指move实时距离 4:将手指移动的距离加给元素

		var startX = 0; //手指开始位置 x轴位置
		var elementX = 0; //元素开始位置
		var index = 0; //自动轮播下标与手工滑动下标

		//version 15 防止抖动
		var startY = 0; //手指开始位置 y轴位置
		var elementY = 0; //元素位置   y轴位置

		//是否是X轴方向滑动
		var isX = true;
		//是否是首次滑动操作
		//判断条以首次为准
		var isFirst = true;


		carouselWrap.addEventListener("touchstart", (ev) => {
			ev = ev || event;
			var TouchC = ev.changedTouches[0];
			ulNode.style.transition = "none";

			var vw = document.documentElement.clientWidth;
			if (needCarousel) {
				//1:获取当前下标
				var index = webtools.css(ulNode, "translateX") / vw;
				//console.log(index);
				if (-index === 0) {
					index = -pointslength;
				} else if (-index == (arr.length - 1)) {
					index = -(pointslength - 1)
				}
				//4:修改translateX值
				webtools.css(ulNode, "translateX", index * vw);
			}
			//version 15
			//1:获取手指触碰屏幕开始位置
			startX = TouchC.clientX;
			startY = TouchC.clientY;
			//2:设置默认方向水平
			//事件:触发开始,每一次新开始滑动操作默认水平方向
			isX = true;
			//第一次滑动操作默认值
			isFirst = true;

			elementX = webtools.css(ulNode, "translateX");
			elementY = webtools.css(ulNode, "translateY");
			clearInterval(timer);
		});
		carouselWrap.addEventListener("touchmove", (ev) => {
			//第一次拦截垂直方向操作
			if (!isX) {
				return; //看门狗:每一次咬住不守规则用户
			}
			ev = ev || event;
			var TouchC = ev.changedTouches[0];
			//version 15
			var nowX = TouchC.clientX;
			var nowY = TouchC.clientY;
			//计算滑动距离
			var disX = nowX - startX;
			var disY = nowY - startY;
			//console.log(disX+":"+disY);

			//判断是否第一次操作判断
			if (isFirst) {
				isFirst = false; //判断过不是第一次
				//判断方向只判断第一次
				if (Math.abs(disX) < Math.abs(disY)) { //垂直方向距离大于水平方向
					isX = false; //垂直方向
					return;
				}
			}


			webtools.css(ulNode, "translateX", elementX + disX);
		});
		carouselWrap.addEventListener("touchend", (ev) => {
			ev = ev || event;
			var vw = document.documentElement.clientWidth;
			var index = webtools.css(ulNode, "translateX") / vw;
			index = Math.round(index);
			if (index > 0) {
				index = 0;
			} else if (index < 1 - arr.length) {
				index = 1 - arr.length;
			}

			points(index);
			if (needAuto) {
				auto();
			}

			ulNode.style.transition = ".5s transform";
			webtools.css(ulNode, "translateX", index * vw);
		});


		//version 7 自动轮播
		//1:创建变量保存定时器
		var timer = 0;
		//2:获取指令needAuto
		var needAuto = carouselWrap.getAttribute("needAuto");
		//3:判断如果没有指令false 有true
		needAuto = needAuto == null ? false : true;
		//4:判断是否调用auto函数
		if (needAuto) {
			auto();
		}
		//5:创建auto函数
		function auto() {
			var vw = document.documentElement.clientWidth;
			//5.1:清除原先定时器  防止定时器累加操作
			clearInterval(timer);
			//5.2:创建定时器
			timer = setInterval(function() {
				//(1)如果最后一张图片换到第一组最后一张 立即显示
				if (index == 1 - arr.length) {
					ulNode.style.transition = "none";
					index = 1 - arr.length / 2;
					webtools.css(ulNode, "translateX", index * vw);
				}
				//(2)创建一次性定时器完成 : 下一页下一页 index
				setTimeout(function() {
					index--;
					points(index);
					ulNode.style.transition = "1s transform";
					webtools.css(ulNode, "translateX", index * vw)
				})
			}, 2500);
		} //auto end 
		function points(index) {
			//1:判断是否存在最外最父元素
			if (!pointWrap) {
				return;
			}
			//2:创建循环添除所有span active
			for (var i = 0; i < pointsSpan.length; i++) {
				pointsSpan[i].classList.remove("active");
			}
			//3:当前下标元素添加 active
			pointsSpan[-index % pointslength].classList.add("active");
		}
	}
	//兼容低版本浏览器添加和删除className函数
	w.webtools.addClass = function(node, className) {
		var reg = new RegExp("\\b" + className + "\\b");
		if (!reg.test(node.className)) {
			node.className += (" " + className);
		}
	}
	w.webtools.removeClass = function(node, className) {
		if (node.className) {
			var reg = new RegExp("\\b" + className + "\\b");
			var classes = node.className;
			//删除指定className 实现
			node.className = classes.replace(reg, "");
			if (/^\s*$/g.test(node.className)) {
				node.removeAttribute("class");
			}
		} else {
			node.removeAttribute("class")
		}
	}
	// 垂直方向滑屏
	w.webtools.yMove = function(wrap) {
		//垂直方向滑屏函数 wrap 滑屏区域
		//1:获取滑屏元素:滑屏区域第一个子元素
		var item = wrap.children[0];
		//2:创建二个变量保存手指开始位置与元素开始位置
		var start = {};
		var element = {};
		//3:创建变量minY=视口高度(滑屏区域高度)-元素高度
		var minY = wrap.clientHeight - item.offsetHeight;
		//debugger;
		//4:创建四个变量实现变量像皮筋效果
		var lastTime = 0; //上一次开始时间
		var lastPoint = 0; //上一次开始距离
		var timeDis = 1; //时间差
		var pointDis = 0; //距离差
		//5:创建变量防止抖动(防止水平 false方向滑屏)
		var isY = true;
		//6:创建变量保存第一次操作 07
		var isFirst = true;
		//7:为滑屏区域绑定touchstart
		wrap.addEventListener("touchstart", function(ev) {
			//7.1:重新计算minY
			minY = wrap.clientHeight - item.offsetHeight;
			//7.2:处理ev
			ev = ev || event;
			console.log("ev"+ev)
			//7.3:获取点击屏幕时第一根手指
			var touchC = ev.changedTouches[0];
			//7.4:获取手指位置赋值start变量中
			start = {
				clientX: touchC.clientX,
				clientY: touchC.clientY
			};
			//7.5:获取元素当前位置赋值element
			element.y = webtools.css(item, "translateY");
			element.x = webtools.css(item, "translateX");
			//debugger;
			//7.6:清空过渡效果[手指滑动/手指抬起有过渡效果]
			item.style.transition = "none";
			//7.7:获取当前时间点赋值lastTime
			lastTime = new Date().getTime();
			//7.8:获取当前手指位置赋值lastPoint
			lastPoint = touchC.clientY;
			//7.9:清空上次滑动距离
			pointDis = 0;
			//7.10:为滑屏元素添加属笥handMove 是否到边界 
			item.handMove = false;
			//debugger;
		});
		//8:为滑屏区域绑定touchmove
		wrap.addEventListener("touchmove", function(ev) {
			//8.1:阻止水平方向滑动
			if (!isY) {
				return;
			}
			//console.log(new Date().getTime());
			//console.log(ev.changedTouches[0].clientY);
			//8.2:兼容处理ev
			ev = ev || event;
			//8.3:获取滑屏移动手指
			var touchC = ev.changedTouches[0];
			//8.4:创建变量保存滑动距离 #判断水平方向还是垂直方向
			var dis = {};
			//8.5:获取当前位置减开始位置 距离
			dis.x = touchC.clientX - start.clientX;
			dis.y = touchC.clientY - start.clientY;
			//console.log(dis.x+":"+dis.y);
			//8.6:创建变量transalteY=位置原始距离+移动距离
			//transalteY 正数向下滑动 负数向上滑动
			var translateY = element.y + dis.y;
			//console.log(translateY);
			//8.20:修改translateY值完成移动位置
			webtools.css(item, "translateY", translateY);
		});
		//9:为滑屏区域绑定touchend
		wrap.addEventListener("touchend", function(ev) {});




	}
})(window);
//1:引入   webtools.js
//2:直接调用webtools.css(node,"transalteX",100);

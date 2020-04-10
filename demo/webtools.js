//js/webtools.js
//将项目中常见工具函数保存在此住方便项目直接使用
//1:创建匿名自调用函数
//2:为window对添加属性webtools
//3:为webtools添加属性css 值函数
//#对外只暴露一个属性webtools
+(function(w) {
	w.webtools = {};
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
})(window);
//1:引入   webtools.js
//2:直接调用webtools.css(node,"transalteX",100);

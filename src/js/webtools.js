//js/webtools.js
//将项目中常见工具函数保存在此住方便项目直接使用
//1:创建匿名自调用函数
//2:为window对添加属性webtools
//3:为webtools添加属性css 值函数
//#对外只暴露一个属性webtools
+(function(w){
    w.webtools = {};

    //node 元素对象
    //type transform属性值 [translateX;trnslateY;rotate;scale]
    //val  属性值
    w.webtools.css = function(node,type,val){
        //1:判断元素是否有效  元素是否有transform属性
        //如果对象有效果没有tranform创建空对象保存
        if(typeof node === "object" && typeof node["transform"]==="undefined"){
            node["transform"]={};
        }
        //2:判断参数个数 3 设置 2获取
        if(arguments.length>=3){ //写入属性值
          //(1)将新值保存node对象中[方便]
          node["transform"][type] = val;
          //console.log(2);
          //console.log(node["transform"]);
          //(2)将保存值<拼接字符串>保存对象style.transform属性中
          //#test.style.transform="xys"
          var text = "";  //拼接字符串
          for(item in node["transform"]){
              if(node["transform"].hasOwnProperty(item)){
                  //如果属性是否transform有效果
                  switch(item){
                   case "translateX":
                   case "translateY":
                   case "translateZ":
                    text += item+"("+node["transform"][item]+"px)";
                    break;
                   case "scale":
                    text += item+"("+node["transform"][item]+")";
                    break;
                   case "rotate":
                   text += item+"("+node["transform"][item]+"deg)";
                   break;  
                  }
              }
          }
          //console.log(text);
          //考虑兼容问题旧webkit浏览器
          node.style.transform = node.style.webkitTransform= text;
        }else if(arguments.length==2){//读取属性值
         
          val = node["transform"][type];
          //如果用户没有设置此属性值返回默认值
          if(typeof val == "undefined"){
              switch(type){
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
    w.webtools.carousel =  function carousel(arr){
        var carouselWrap = document.querySelector(".carousel-wrap");
        if(carouselWrap){

            
            //1:创建新变量保存指示器个数
            var pointslength = arr.length;
            //2:获取指令值
            var needCarousel = carouselWrap.getAttribute("needCarousel");
            //3:判断是否有指令赋值true false
            needCarousel=needCarousel==null?false:true;
            //4:如果有指令 图片数组拼接 5->10
            if(needCarousel){
                arr=arr.concat(arr);
            }
            //console.log(arr);

            var ulNode = document.createElement("ul");
            var styleNode = document.createElement("style");
            webtools.css(carouselWrap,"translateZ",0);
            webtools.css(ulNode,"translateZ",0);

            ulNode.className = "list";
            for(var i=0;i<arr.length;i++){
                ulNode.innerHTML+=`<li><a href="javascript:;"><img src="${arr[i]}" /></a></li>`;
            }
            styleNode.innerHTML=`.carousel-wrap>.list>li{width:${1/arr.length*100}%}.carousel-wrap>.list{width:${arr.length}00%}`;

            carouselWrap.appendChild(ulNode);
            document.head.appendChild(styleNode);

            var imgNodes = document.querySelector(".carousel-wrap>.list>li>a>img");
            setTimeout(()=>{
             carouselWrap.style.height=imgNodes.offsetHeight+"px";
            },50);

                           
            //动态添加指示器(小圆点)
            //1:获取指示器父元素
            //2:判断是否有父元素
            //3:创建循环创建span 一个小圆点添加active
            //4:为了躲queryselect坑再次获取元素
            var pointWrap = document.querySelector(".carousel-wrap>.points-wrap");
            //webtools.css(pointsSpan,"translateZ",0);

            if(pointWrap){
                //version 6
               for(var i=0;i<pointslength;i++){
                   if(i==0){
                       pointWrap.innerHTML+='<span class="active"></span>'
                   }else{
                       pointWrap.innerHTML+='<span></span>'
                   }
               }//for end
               var pointsSpan = document.querySelectorAll(".carousel-wrap>.points-wrap>span"); 
               
               //version e end

            }//if pointwrap end
        }//if carouselWrap end


       //滑屏
       //1:拿到元素一开始位置   2:拿到手指开始点击位置
       //3:拿到手指move实时距离 4:将手指移动的距离加给元素

       var startX = 0; //手指开始位置 x轴位置
       var elementX = 0;//元素开始位置
       var index = 0;//自动轮播下标与手工滑动下标

       //version 15 防止抖动
       var startY = 0; //手指开始位置 y轴位置
       var elementY = 0;//元素位置   y轴位置
       
       //是否是X轴方向滑动
       var isX = true;
       //是否是首次滑动操作
       //判断条以首次为准
       var isFirst = true;


       carouselWrap.addEventListener("touchstart",(ev)=>{
           ev=ev||event;
           var TouchC = ev.changedTouches[0];
           ulNode.style.transition="none";
    
           var vw = document.documentElement.clientWidth;
           if(needCarousel){
               //1:获取当前下标
               var index = webtools.css(ulNode,"translateX")/vw;
               //console.log(index);
               if(-index === 0){
                  index = -pointslength;
               }else if(-index == (arr.length-1)){
                   index = -(pointslength-1)
               }
               //4:修改translateX值
               webtools.css(ulNode,"translateX",index*vw);
           }
           //version 15
           //1:获取手指触碰屏幕开始位置
           startX=TouchC.clientX;
           startY=TouchC.clientY;
           //2:设置默认方向水平
           //事件:触发开始,每一次新开始滑动操作默认水平方向
           isX = true;
           //第一次滑动操作默认值
           isFirst = true;

           elementX=webtools.css(ulNode,"translateX");
           elementY=webtools.css(ulNode,"translateY");
           clearInterval(timer);
       });
       carouselWrap.addEventListener("touchmove",(ev)=>{
           //第一次拦截垂直方向操作
           if(!isX){
             return;//看门狗:每一次咬住不守规则用户
           }
           ev=ev||event;
           var TouchC = ev.changedTouches[0];
           //version 15
           var nowX = TouchC.clientX;
           var nowY = TouchC.clientY;
           //计算滑动距离
           var disX = nowX-startX;
           var disY = nowY-startY;
           //console.log(disX+":"+disY);

           //判断是否第一次操作判断
           if(isFirst){
             isFirst = false;//判断过不是第一次
            //判断方向只判断第一次
            if(Math.abs(disX)<Math.abs(disY)){//垂直方向距离大于水平方向
                isX=false;//垂直方向
                return;
            }
          }


           webtools.css(ulNode,"translateX",elementX+disX);
       });
       carouselWrap.addEventListener("touchend",(ev)=>{
           ev=ev||event;
           var vw = document.documentElement.clientWidth;
           var index = webtools.css(ulNode,"translateX")/vw;
           index = Math.round(index);
           if(index>0){
              index=0; 
           }else if(index<1-arr.length){
              index=1-arr.length;
           }

           points(index);
           if(needAuto){
               auto();
           }

           ulNode.style.transition=".5s transform";
           webtools.css(ulNode,"translateX",index*vw);
       });


       //version 7 自动轮播
       //1:创建变量保存定时器
       var timer = 0;
       //2:获取指令needAuto
       var needAuto = carouselWrap.getAttribute("needAuto");
       //3:判断如果没有指令false 有true
       needAuto=needAuto==null?false:true;
       //4:判断是否调用auto函数
       if(needAuto){
           auto();
       }
       //5:创建auto函数
       function auto(){
           var vw = document.documentElement.clientWidth;
          //5.1:清除原先定时器  防止定时器累加操作
          clearInterval(timer);
          //5.2:创建定时器
          timer = setInterval(function(){
              //(1)如果最后一张图片换到第一组最后一张 立即显示
              if(index == 1-arr.length){
                  ulNode.style.transition="none";
                  index = 1-arr.length/2;
                  webtools.css(ulNode,"translateX",index*vw);
              }
              //(2)创建一次性定时器完成 : 下一页下一页 index
              setTimeout(function(){
                 index--;
                 points(index);
                 ulNode.style.transition="1s transform";
                 webtools.css(ulNode,"translateX",index*vw) 
              })
          },2500);
       }//auto end 
       function points(index){
          //1:判断是否存在最外最父元素
          if(!pointWrap){
            return;
          }
          //2:创建循环添除所有span active
          for(var i=0;i<pointsSpan.length;i++){
              pointsSpan[i].classList.remove("active");
          }
          //3:当前下标元素添加 active
          pointsSpan[-index%pointslength].classList.add("active");
       }
    }
    //兼容低版本浏览器添加和删除className函数
    w.webtools.addClass=function(node,className){
      var reg = new RegExp("\\b"+className+"\\b");
      if(!reg.test(node.className)){
          node.className+=(" "+className);
      }
    }
    w.webtools.removeClass=function(node,className){
       if(node.className){
           var reg = new RegExp("\\b"+className+"\\b");
           var classes = node.className;
           //删除指定className 实现
           node.className = classes.replace(reg,""); 
           if(/^\s*$/g.test(node.className)){
               node.removeAttribute("class");
           }
       }else{
           node.removeAttribute("class")
       }
    }
    //任务六:标签页垂直滑动
    w.webtools.yMove = function(wrap,callBack){
      //6.0:wrap 滑屏区域 .content  
      //6.1:获取滑屏元素   .content div
      var item = wrap.children[0];
      //6.2:创建变量保存手指开始位置
      var start = {};
      //6.3:创建变量保存元素开始位置
      var element = {};
      //6.4:计算minY=滑屏区域高度-滑屏元素高度
      var minY = wrap.clientHeight - item.offsetHeight;
      //debugger;
      //6.5:创建四个变量呈现像皮筋效果
      var lastTime =  0; //上一次时间点
      var lastPoint = 0; //上一次位置
      var timeDis = 1;   //时间差
      var pointDis = 0;  //距离差
      //6.6:创建二个变量保存防拌动
      var isY = true;       //滑动垂直方向true 水平false
      var isFirst = true;   //是否是第一次操作

      //6.7:获取滑屏区域绑定三个事件 touchstart
      wrap.addEventListener("touchstart",function(ev){
          //-事件兼容处理
          ev=ev||event;
          //-获取当前点击屏幕手指对象
          var TouchC = ev.changedTouches[0];
          //-再次获取minY
          minY = wrap.clientHeight - item.offsetHeight;
          //-获取手指当前位置保存在变量start
          start = {
              clientX:TouchC.clientX,
              clientY:TouchC.clientY
          }
          //-获取滑屏元素位置保存在变量element
          element.x = webtools.css(item,"translateX");
          element.y = webtools.css(item,"translateY");
          //debugger;
          //-清空过滤效果
          item.style.transition = "none";
          //-获取当前时间保存在变量lastTime
          lastTime = new Date().getTime();
          //-获取当前手指位置保存变量lastPoint
          lastPoint=TouchC.clientY;
          //-清空距离
          pointDis = 0;
          item.handMove = false;//是否滑动到边界
          //-指定变量是否滑动边界区域
          isY = true;
          isFirst = true;
          //-为isY和isFirst赋值实始值 true;
          //如果点击时显示滚动条
          if(callBack&&typeof callBack["start"]==="function"){
              callBack["start"].call(item);
          }
      });
      //6.8:获取滑屏区域绑定三个事件 touchmove
      wrap.addEventListener("touchmove",function(ev){
          //阻止水平滑屏
          if(!isY){
            return;
          }
          //事件兼容
          ev=ev||event;
          //获取手指
          var TouchC = ev.changedTouches[0];
          //创建变量dis 保存滑动时手指位置
          var dis = {};
          //创建变量translateY=当前元素位置+滑动距离
          dis.x = TouchC.clientX - start.clientX;
          dis.y = TouchC.clientY - start.clientY;
          var translateY = element.y + dis.y;
          //debugger;
          //?判断方向
          if(isFirst){
              isFirst = false;
              if(Math.abs(dis.x)>Math.abs(dis.y)){
                  isY = false;
                  return;
              }
          }
          //?像皮筋效果[边界出现]
          var nowTime = new Date().getTime();
          var nowPoint = TouchC.clientY;
          //时间差
          timeDis = nowTime - lastTime;
          //位置差
          pointDis = nowPoint - lastPoint;
          //将原先start时间与距离修改
          lastTime = nowTime;
          lastPoint = nowPoint;
          //debugger;
          //console.log(translateY<minY);
          if(translateY>0){
              item.handMove = true;
              var vh = document.documentElement.clientHeight;
              //创建变量计算摩擦系数
              var scale = vh/((vh+translateY)*5.5);
              translateY = webtools.css(item,"translateY")+pointDis*scale;
              //console.log(translateY+":"+scale);
              //debugger;
          }else if(translateY<minY){
              item.handMove = true;
              var over = minY - translateY;
              var vh = document.documentElement.clientHeight;
              var scale = vh/((vh+over)*5.5);
              translateY=webtools.css(item,"translateY")+pointDis*scale;
              //debugger;  
          }
          //滑动
          webtools.css(item,"translateY",translateY);

          //滑动显示滚动条
          if(callBack&&typeof callBack["move"]==="function"){
              callBack["move"].call(item);
          }
      });
      //6.9:获取滑屏区域绑定三个事件 touchend
      wrap.addEventListener("touchend",function(ev){
          var translateY = webtools.css(item,"translateY");
          //如果手指抬起恢复
          if(item.handMove){
            item.style.transition = ".3s transform";
            if(translateY>0){
                translateY = 0;
                webtools.css(item,"translateY",translateY);
            }else if(translateY<minY){
                translateY = minY;
                webtools.css(item,"translateY",translateY);
            }
          }

          //手指抬起滚动条隐藏
          if(callBack&&typeof callBack["end"]==="function"){
              callBack["end"].call(item);
          }
      });
    }
})(window);
//1:引入   webtools.js
//2:直接调用webtools.css(node,"transalteX",100);
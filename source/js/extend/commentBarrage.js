var commentBarrageConfig = {
	//同时最多显示弹幕数
	maxBarrage: 1,
	//弹幕显示间隔时间ms
	barrageTime: 4000,
	//twikoo部署地址腾讯云的为环境ID
	twikooUrl: PAGECONFIG.commentBarrageConfig.url,
	//token获取见上方
	accessToken: PAGECONFIG.commentBarrageConfig.token,
	pageUrl: window.location.pathname,
	barrageTimer: [],
	barrageList: [],
	barrageIndex: 0,
	dom: document.querySelector('.comment-barrage'),
}
function initCommentBarrage(){
		var data = JSON.stringify({
		  "event": "COMMENT_GET",
		  "commentBarrageConfig.accessToken": commentBarrageConfig.accessToken,
		  "url": commentBarrageConfig.pageUrl
		});
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.addEventListener("readystatechange", function() {
		  if(this.readyState === 4) {
			commentBarrageConfig.barrageList = commentLinkFilter(JSON.parse(this.responseText).data);
			commentBarrageConfig.dom.innerHTML = '';
		  }
		});
		xhr.open("POST", commentBarrageConfig.twikooUrl);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(data);

		setInterval(()=>{
			if(commentBarrageConfig.barrageList.length){
				popCommentBarrage(commentBarrageConfig.barrageList[commentBarrageConfig.barrageIndex]);
				commentBarrageConfig.barrageIndex += 1;
				commentBarrageConfig.barrageIndex %= commentBarrageConfig.barrageList.length;
			}
			if(commentBarrageConfig.barrageTimer.length > (commentBarrageConfig.barrageList.length > commentBarrageConfig.maxBarrage?commentBarrageConfig.maxBarrage:commentBarrageConfig.barrageList.length)){
				removeCommentBarrage(commentBarrageConfig.barrageTimer.shift())
			}
		},commentBarrageConfig.barrageTime)

}

function commentLinkFilter(data){
	data.sort((a,b)=>{
		return a.created - b.created;
	})
	let newData = [];
	data.forEach(item=>{
		newData.push(...getCommentReplies(item));
	});
	return newData;
}

function getCommentReplies(item){
	if(item.replies){
		let replies = [item];
		item.replies.forEach(item=>{
			replies.push(...getCommentReplies(item));
		})
		return replies;
	}else{
		return [];
	}
}


function popCommentBarrage(data){
	let barrage = document.createElement('div');
	let width = commentBarrageConfig.dom.clientWidth;
	let height = commentBarrageConfig.dom.clientHeight;
	barrage.className = 'comment-barrage-item'

	barrage.innerHTML = `
	<div class="barrageHead">
	<a class="barrageTitle" href="javascript:scrollToDest('post-comment')"">热评</a>
		  <div class="barrageNick">${data.nick}</div>
		  <img class="barrageAvatar" src="https://cravatar.cn/avatar/${data.mailMd5}"/>
	  </div>
	  <a class="barrageContent" href="javascript:scrollToDest('${data.id}');">${data.comment}</a>
	`
	commentBarrageConfig.barrageTimer.push(barrage);
	commentBarrageConfig.dom.append(barrage);
}
function removeCommentBarrage(barrage){
	barrage.className = 'comment-barrage-item out';
	setTimeout(()=>{
		commentBarrageConfig.dom.removeChild(barrage);
	},1000)
}

document.addEventListener('scroll',utils.throttle(function(){
    var visibleBottom = window.scrollY + document.documentElement.clientHeight;
    var visibleTop = window.scrollY;
    var pagination = document.querySelector('.comment-barrage');
    var eventlistner = document.getElementById('post-tools');
    if (eventlistner&&pagination){
    var centerY = eventlistner.offsetTop+(eventlistner.offsetHeight/2);
    if(document.body.clientWidth > 768){
      if(centerY>visibleBottom){
        pagination.style.bottom = '0';
      }else{
        pagination.style.bottom = '-200px';
      }
    }
  }
  }, 200))


function scrollToDest(pos, time) {
	if (pos < 0 || time < 0) {
	  return;
	}
  
	const currentPos = window.scrollY || window.screenTop;
	pos = pos - 70;
  
	if ('CSS' in window && CSS.supports('scroll-behavior', 'smooth')) {
	  window.scrollTo({
		top: pos,
		behavior: 'smooth'
	  });
	  return;
	}
  
	let start = null;
	time = time || 500;
	window.requestAnimationFrame(function step(currentTime) {
	  start = !start ? currentTime : start;
	  if (currentPos < pos) {
		const progress = currentTime - start;
		window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
		if (progress < time) {
		  window.requestAnimationFrame(step);
		} else {
		  window.scrollTo(0, pos);
		}
	  } else {
		const progress = currentTime - start;
		window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
		if (progress < time) {
		  window.requestAnimationFrame(step);
		} else {
		  window.scrollTo(0, pos);
		}
	  }
	});
  }




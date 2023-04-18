function setFixed(el) {
    if (!el) return
    const currentTop = window.scrollY || document.documentElement.scrollTop
    if (currentTop > 0) {
        el.classList.add('nav-fixed')
    } else {
        el.classList.remove('nav-fixed')
    }
}

const scrollFn = function () {
    const innerHeight = window.innerHeight + 0
    const $header = document.getElementById('page-header')
    setFixed($header)
    if (document.body.scrollHeight <= innerHeight) {
        return
    }
    let initTop = 0
    window.addEventListener('scroll', utils.throttle(function (e) {
        const currentTop = window.scrollY || document.documentElement.scrollTop
        const isDown = scrollDirection(currentTop)
        if (currentTop > 0) {
            if (isDown) {
                if ($header.classList.contains('nav-visible')) $header.classList.remove(
                    'nav-visible')
            } else {
                if (!$header.classList.contains('nav-visible')) $header.classList.add(
                    'nav-visible')
            }
            $header.classList.add('nav-fixed')
        } else {
            if (currentTop === 0) {
                $header.classList.remove('nav-fixed', 'nav-visible')
            }
        }
        percent()
    }, 200))
    function scrollDirection(currentTop) {
        const result = currentTop > initTop
        initTop = currentTop
        return result
    }
}

const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu')
    const $mobileSidebarMenus = document.getElementById('sidebar-menus')
    const $menuMask = document.getElementById('menu-mask')
    const $body = document.body

    if (!$toggleMenu) return

    function openMobileSidebar() {
        utils.sidebarPaddingR()
        $body.style.overflow = 'hidden'
        utils.fadeIn($menuMask, 0.5)
        $mobileSidebarMenus.classList.add('open')
    }

    function closeMobileSidebar() {
        $body.style.overflow = ''
        $body.style.paddingRight = ''
        utils.fadeOut($menuMask, 0.5)
        $mobileSidebarMenus.classList.remove('open')
    }

    $toggleMenu.addEventListener('click', openMobileSidebar)

    $menuMask.addEventListener('click', e => {
        if ($mobileSidebarMenus.classList.contains('open')) {
            closeMobileSidebar()
        }
    })

    window.addEventListener('resize', e => {
        if ($mobileSidebarMenus.classList.contains('open')) closeMobileSidebar()
    })
}

const showTodayCard = () => {
    const el = document.getElementById('todayCard')
    if (el) {
        document.getElementsByClassName('topGroup')[0].addEventListener('mouseleave', () => {
            if (el.classList.contains('hide')) {
                el.classList.remove('hide')
            }
        })
    }
}

const setTimeState = () => {
    const el = document.getElementById('author-info__sayhi')
    if (el) {
        const timeNow = new Date(), hours = timeNow.getHours(), lang = GLOBALCONFIG.lang.sayhello;
        let text = '';
        if (hours >= 0 && hours <= 5) {
            text = lang.goodnight;
        } else if (hours > 5 && hours <= 10) {
            text = lang.morning;
        } else if (hours > 10 && hours <= 14) {
            text = lang.noon;
        } else if (hours > 14 && hours <= 18) {
            text = lang.afternoon;
        } else if (hours > 18 && hours <= 24) {
            text = lang.night;
        }
        el.innerText = text + lang.iam;
    }
};

const chageTimeFormate = () => {
    const timeElements = document.getElementsByTagName("time"), lang = GLOBALCONFIG.lang.time
    for (var i = 0; i < timeElements.length; i++) {
        const datetime = timeElements[i].getAttribute("datetime"), timeObj = new Date(datetime), daysDiff = utils.timeDiff(timeObj, new Date())
        var timeString;
        if (daysDiff === 0) {
            timeString = lang.recent;
        } else if (daysDiff === 1) {
            timeString = lang.yesterday;
        } else if (daysDiff === 2) {
            timeString = lang.berforeyesterday;
        } else if (daysDiff <= 7) {
            timeString = daysDiff + lang.daybefore;
        } else {
            if (timeObj.getFullYear() !== new Date().getFullYear()) {
                timeString = timeObj.getFullYear() + "/" + (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            } else {
                timeString = (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            }
        }
        timeElements[i].textContent = timeString;
    }
}

const percent = () => {
    let a = document.documentElement.scrollTop || window.pageYOffset,
        b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight, // 整个网页高度
        result = Math.round(a / b * 100),
        btn = document.querySelector("#percent");
    const visibleBottom = window.scrollY + document.documentElement.clientHeight;
    const eventlistner = document.getElementById('post-tools') || document.getElementById('footer');
    const centerY = eventlistner.offsetTop + (eventlistner.offsetHeight / 2);
    if ((centerY < visibleBottom) || (result > 90)) {
        document.querySelector("#nav-totop").classList.add("long");
        btn.innerHTML = GLOBALCONFIG.lang.backtop;
        document.querySelectorAll(".needEndHide").forEach(item => {
            item.classList.add("hide")
        })
    } else {
        document.querySelector("#nav-totop").classList.remove("long");
        if (result >= 0) {
            btn.innerHTML = result;
            document.querySelectorAll(".needEndHide").forEach(item => {
                item.classList.remove("hide")
            })
        }
    }
}

class toc {
    static init() {
        const tocContainer = document.getElementById('card-toc')
        if (!tocContainer || !tocContainer.querySelector('.toc a')) {
            tocContainer.style.display = 'none'
            return
        }
        const el = document.querySelectorAll('.toc a')
        el.forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                utils.scrollToDest(utils.getEleTop(document.getElementById(decodeURI((event.target.className === 'toc-text' ? event.target.parentNode.hash : event.target.hash).replace('#', '')))), 300)
            })
        })
        this.active(el)
    }

    static active(toc) {
        const $article = document.getElementById('article-container')
        const $tocContent = document.getElementById('toc-content')
        const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
        let detectItem = ''
        function autoScroll(el) {
            const activePosition = el.getBoundingClientRect().top
            const sidebarScrollTop = $tocContent.scrollTop
            if (activePosition > (document.documentElement.clientHeight - 100)) {
                $tocContent.scrollTop = sidebarScrollTop + 150
            }
            if (activePosition < 100) {
                $tocContent.scrollTop = sidebarScrollTop - 150
            }
        }
        function findHeadPosition(top) {
            if (top === 0) {
                return false
            }

            let currentIndex = ''

            list.forEach(function (ele, index) {
                if (top > utils.getEleTop(ele) - 80) {
                    currentIndex = index
                }
            })

            if (detectItem === currentIndex) return
            detectItem = currentIndex
            document.querySelectorAll('.toc .active').forEach((i) => {
                i.classList.remove('active')
            })
            const activeitem = toc[detectItem]
            if (activeitem) {
                let parent = toc[detectItem].parentNode
                activeitem.classList.add('active')
                autoScroll(activeitem)
                for (; !parent.matches('.toc'); parent = parent.parentNode) {
                    if (parent.matches('li')) parent.classList.add('active')
                }
            }
        }
        window.tocScrollFn = utils.throttle(function () {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            findHeadPosition(currentTop)
        }, 100)

        window.addEventListener('scroll', tocScrollFn)
    }
}
class acrylic {
    static switchDarkMode() {
        const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' :
            'light'
        if (nowMode === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark')
            localStorage.setItem('theme', 'dark')
            utils.snackbarShow(GLOBALCONFIG.lang.theme.dark, false, 2000)
        } else {
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
            utils.snackbarShow(GLOBALCONFIG.lang.theme.light, false, 2000)
        }
    }
    static hideTodayCard() {
        document.getElementById('todayCard').classList.add('hide')
    }
    static toTop() {
        utils.scrollToDest(0)
    }
    static showConsole() {
        const el = document.getElementById('console')
        if (!el.classList.contains('show')) {
            el.classList.add('show')
        }
    }
    static hideConsole() {
        const el = document.getElementById('console')
        if (el.classList.contains('show')) {
            el.classList.remove('show')
        }
    }
    static copyPageUrl() {
        utils.copy(window.location.href)
    }
    static lightbox(el) {
        window.ViewImage && ViewImage.init(el);
    }
    static initTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const cachedMode = localStorage.getItem('theme');
        const isLightMode = !isDarkMode;
        
        const nowMode =
          cachedMode && (cachedMode === 'dark' || cachedMode === 'light')
            ? cachedMode === 'dark' && isLightMode ? 'light'
            : cachedMode === 'light' && isDarkMode ? 'dark'
            : cachedMode
            : isDarkMode ? 'dark'
            : 'light';
        
        document.documentElement.setAttribute('data-theme', nowMode);
        localStorage.setItem('theme', nowMode);
      }                  
    static reflashEssayWaterFall() {
        if (document.getElementById('waterfall')) {
            setTimeout(function () {
                waterfall('#waterfall');
                document.getElementById("waterfall").classList.add('show');
            }, 500);
        }
    }
    static addRuntime() {
        const el = document.getElementById('runtimeshow')
        if (el && GLOBALCONFIG.runtime) {
            el.innerText = utils.timeDiff(new Date(GLOBALCONFIG.runtime), new Date()) + GLOBALCONFIG.lang.time.runtime
        }
    }
    static lazyloadImg() {
        window.lazyLoadInstance = new LazyLoad({
            elements_selector: 'img',
            threshold: 0,
            data_src: 'lazy-src',
            callback_error: (img) => {
                img.setAttribute("src", GLOBALCONFIG.lazyload.error);
            }
        })
    }
    static fetchData() {
        const url = 'https://api.adil.com.cn/api/essays';
        const cacheBuster = Math.random();  
        const requestUrl = `${url}?cacheBuster=${cacheBuster}`;  
      
        return fetch(requestUrl)
          .then(response => response.json())
          .catch(error => {
            console.error('获取说说数据失败:', error);
            return [];
          });
    }  
    static displayEssays(essays) {
        const container = document.getElementById('bber-talk');
        const maxItems = 10;
        const swiperWrapper = document.querySelector('.swiper-wrapper');
    
        for (let i = 0; i < essays.length && i < maxItems; i++) {
            const item = essays[i];
            const content = item.image ? `${item.content}【图片】` : item.content;
    
            const div = document.createElement('div');
            div.classList.add('li-style', 'swiper-slide');
            div.textContent = content;
    
            swiperWrapper.appendChild(div);
        }
        if (container.swiper) {
            container.swiper.destroy(true, true);
        }
        acrylic.initbbtalk();
    }
    
    static fetchAndDisplayEssays() {
        acrylic.fetchData().then(essays => acrylic.displayEssays(essays));
    }
    static async fetchAndDisplayLongEssays() {
        const essays = await acrylic.fetchData();
        const container = document.getElementById('waterfall');
      
        for (let i = 0; i < essays.length && i < 30; i++) {
          const item = essays[i];
          const li = document.createElement('li');
          li.classList.add('item');
      
          let imageHtml = '';
          if (item.images) {
            let images;
            try {
              images = JSON.parse(item.images);
            } catch (error) {
              images = [];
            }
            
            if (Array.isArray(images)) {
              images.forEach(img => {
                imageHtml += `<img src="${img}">`;
              });
            }
          }
      
          let linkHtml = '';
          if (item.link) {
            linkHtml = `<a class="bber-content-link" href="${item.link}" title="跳转到短文指引的链接">链接</a>`;
          }
      
          li.innerHTML = `
            <div class="bber-content">
              <p class="datacont">${item.content}</p>
              <div class="bber-content-img">${imageHtml}</div>
            </div>
            <hr>
            <div class="bber-bottom">
              <div class="bber-info">
                <div class="bber-info-time">
                  <i class="fas fa-calendar-days"></i>
                  <time class="datetime" datetime="${item.date}"></time>
                </div>
                ${linkHtml}
              </div>
            </div>
          `;
      
          container.appendChild(li);
        }
        chageTimeFormate();
      }
    static initbbtalk() {
        if (document.querySelector('#bber-talk')) {
            var swiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                loop: true,
                autoplay: {
                    delay: 3000,
                    pauseOnMouseEnter: true
                },
            });
        }
    }
    static musicToggle(){
        const $music = document.querySelector('#nav-music'),
        $meting = document.querySelector('meting-js'),
        $console = document.getElementById('consoleMusic')
        if (acrylic_musicPlaying) {
            $music.classList.remove("playing")
            $console.classList.remove("on")
            acrylic_musicPlaying = false;
            $meting.aplayer.pause();
        }else {
            $music.classList.add("playing")
            $console.classList.add("on")
            acrylic_musicPlaying = true;
            $meting.aplayer.play();
        }
    }
    static hideCookie() {
        setTimeout(() => {
          const cookiesWindow = document.getElementById("cookies-window");
          if (cookiesWindow) {
            cookiesWindow.classList.add("cw-hide");
            setTimeout(() => {
              cookiesWindow.style.display = "none";
            }, 1000);
          }
        }, 3000);
      }
}

class hightlight {
    static createEle(langEl, item) {
        const fragment = document.createDocumentFragment()
        const highlightCopyEle = '<i class="fas fa-paste copy-button"></i>'

        const hlTools = document.createElement('div')
        hlTools.className = `highlight-tools`
        hlTools.innerHTML = langEl + highlightCopyEle
        hlTools.children[1].addEventListener('click', (e) => {
            utils.copy($table.querySelector('.code').innerText)
        })
        fragment.appendChild(hlTools)
        const itemHeight = item.clientHeight, $table = item.querySelector('table')
        if (GLOBALCONFIG.hightlight.limit && itemHeight > GLOBALCONFIG.hightlight.limit + 30) {
            $table.setAttribute('style', `height: ${GLOBALCONFIG.hightlight.limit}px`)
            const ele = document.createElement('div')
            ele.className = 'code-expand-btn'
            ele.innerHTML = '<i class="fas fa-angle-double-down"></i>'
            ele.addEventListener('click', (e) => {
                $table.setAttribute('style', `height: ${itemHeight}px`)
                e.target.className !== 'code-expand-btn' ? e.target.parentNode.classList.add('expand-done') : e.target.classList.add('expand-done')
            })
            fragment.appendChild(ele)
        }
        item.insertBefore(fragment, item.firstChild)
    }
    static init() {
        const $figureHighlight = document.querySelectorAll('figure.highlight'), that = this
        $figureHighlight.forEach(function (item) {
            let langName = item.getAttribute('class').split(' ')[1]
            if (langName === 'plaintext' || langName === undefined) langName = 'Code'
            const highlightLangEle = `<div class="code-lang">${langName.toUpperCase()}</div>`
            that.createEle(highlightLangEle, item)
        })
    }
}

class tabs {
    static init(){
        this.clickFnOfTabs()
        this.backToTop()
    }
    static clickFnOfTabs() {
        document.querySelectorAll('#article-container .tab > button').forEach(function (item) {
            item.addEventListener('click', function (e) {
                const that = this
                const $tabItem = that.parentNode
                if (!$tabItem.classList.contains('active')) {
                    const $tabContent = $tabItem.parentNode.nextElementSibling
                    const $siblings = utils.siblings($tabItem, '.active')[0]
                    $siblings && $siblings.classList.remove('active')
                    $tabItem.classList.add('active')
                    const tabId = that.getAttribute('data-href').replace('#', '')
                    const childList = [...$tabContent.children]
                    childList.forEach(item => {
                        if (item.id === tabId) item.classList.add('active')
                        else item.classList.remove('active')
                    })
                }
            })
        })
    }
    static backToTop() {
        document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(function (item) {
            item.addEventListener('click', function () {
                utils.scrollToDest(utils.getEleTop(item.parentElement.parentElement.parentNode), 300)
            })
        })
    }
}


window.refreshFn = () => {
    scrollFn()
    sidebarFn()
    setTimeState()
    chageTimeFormate()
    acrylic.addRuntime()
    acrylic.hideCookie()
    GLOBALCONFIG.lazyload.enable && acrylic.lazyloadImg()
    GLOBALCONFIG.lightbox && acrylic.lightbox('#article-container img, #bber .bber-content-img img, #album_detail album-content-img img')
    GLOBALCONFIG.randomlinks && randomLinksList()
    PAGECONFIG.toc && toc.init()
    if (PAGECONFIG.is_post) {
        GLOBALCONFIG.hightlight.enable && hightlight.init()
        tabs.init()
    }
    PAGECONFIG.comment && initComment()
    if (PAGECONFIG.is_home) {
        showTodayCard()
        acrylic.fetchAndDisplayEssays()
    }
    if (PAGECONFIG.is_page && PAGECONFIG.page === 'says') 
        {
            acrylic.reflashEssayWaterFall()
            acrylic.fetchAndDisplayLongEssays()
        }
    GLOBALCONFIG.covercolor && coverColor()
}

acrylic.initTheme()
let acrylic_musicPlaying = false
document.addEventListener('DOMContentLoaded', function () {
    refreshFn()
})

document.addEventListener('pjax:complete', () => {
    window.refreshFn()
})
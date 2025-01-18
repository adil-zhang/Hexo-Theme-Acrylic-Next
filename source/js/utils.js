const utils = {
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function (...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  throttle: (func, wait, options = {}) => {
    let timeout, context, args;
    let previous = 0;

    const later = () => {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      func.apply(context, args);
      if (!timeout) context = args = null;
    };

    return function (...args) {
      const now = Date.now();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
    };
  },

  fadeIn: (ele, time) => {
    ele.style.display = 'block';
    ele.style.animation = `to_show ${time}s`;
  },

  fadeOut: (ele, time) => {
    const handleAnimationEnd = () => {
      ele.style.display = 'none';
      ele.style.animation = '';
      ele.removeEventListener('animationend', handleAnimationEnd);
    };
    ele.addEventListener('animationend', handleAnimationEnd);
    ele.style.animation = `to_hide ${time}s`;
  },

  sidebarPaddingR: () => {
    const { innerWidth, clientWidth } = window;
    const paddingRight = innerWidth - clientWidth;
    if (innerWidth !== clientWidth) {
      document.body.style.paddingRight = `${paddingRight}px`;
    }
  },

  snackbarShow: (text, showAction = false, duration = 5000) => {
    document.styleSheets[0].addRule(':root', `--heo-snackbar-time:${duration}ms!important`);
    Snackbar.show({
      text,
      showAction,
      duration,
      pos: 'top-center'
    });
  },

  copy: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      utils.snackbarShow(GLOBALCONFIG.lang.copy.success, false, 2000);
    } catch (err) {
      utils.snackbarShow(GLOBALCONFIG.lang.copy.error, false, 2000);
    }
  },

  getEleTop: (ele) => {
    let actualTop = ele.offsetTop;
    let current = ele.offsetParent;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    return actualTop;
  },

  randomNum: (length) => Math.floor(Math.random() * length),

  timeDiff: (timeObj, today) => Math.floor((today - timeObj) / (1000 * 3600 * 24)),

  scrollToDest: (pos, time = 500) => {
    const currentPos = window.scrollY;
    const isNavFixed = document.getElementById('page-header').classList.contains('nav-fixed');
    if (currentPos > pos || isNavFixed) pos -= 70;
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: pos,
        behavior: 'smooth'
      });
      return;
    }
    let start = null;
    pos = +pos;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  },

  siblings: (ele, selector) => [...ele.parentNode.children].filter((child) => selector ? child !== ele && child.matches(selector) : child !== ele),

  isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
};

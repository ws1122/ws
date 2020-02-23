setTimeout(() => {
  const html = document.querySelector('html');
  const body = document.body;

  function getWidth () {
     /* 获取元素的位置 */
    return document.body.getBoundingClientRect().width;
  }

  function setWidth () {
    var width = getWidth() / 10
    // if (width > 54) width = 54
    html.style.fontSize = width + 'px';
    body.style.fontSize = '16px';
  }

  setTimeout(setWidth);
  /* 用于向指定元素添加事件 */
  window.addEventListener('resize', setWidth);
});

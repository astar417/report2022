// JavaScript Document
{
  "startPage": 1, // 分片的开始页码
  "endPage": 2, // 分片结束页码
  "totalPage": 64, // pdf 总页数
  "url": "report2022A3.pdf" // 分片内容下载地址
}

/*
  代码中使用 loadStatus 来记录特定页的内容是否一件下载
*/
const pageLoadStatus = {
  WAIT: 0, // 等待下下载
  LOADED: 1, // 已经下载
}
// 拿到第一个分片
const { startPage, totalPage, url } = await fetchPdfFragment(1);
if (!pages) {
  const pages = initPages(totalPage);
}
const loadingTask = PDFJS.getDocument(url);
loadingTask.promise.then((pdfDoc) => {
  // 将已经下载的分片保存到 pages 数组中
  for (let i = 0; i < pdfDoc.numPages; i += 1) {
    const pageIndex = startPage + i;
    const page = pages[pageIndex - 1];
    if (page.loadStatus !== pageLoadStatus.LOADED) {
        pdfDoc.getPage(i + 1).then((pdfPage) => {
        page.pdfPage = pdfPage;
        page.loadStatus = pageLoadStatus.LOADED;
        // 通知可以进行渲染了
        startRenderPages();
      });
    }
  }
});
// 从服务器获取分片
asycn function fetchPdfFragment(pageIndex) {
  /* 
    省略具体实现
    该方法从服务器获取包含指定页码(pageIndex)的 pdf 分片内容，
    返回的格式参考上文约定：
    {
      "startPage": 1, // 分片的开始页码
      "endPage": 5, // 分片结束页码
      "totalPage": 100, // pdf 总页数
      "url": "http://test.com/asset/fhdf82372837283.pdf" // 分片内容下载地址
    }
  */ 
}
// 创建一个 pages 数组来保存已经下载的 pdf 
function initPages (totalPage) {
  const pages = [];
  for (let i = 0; i < totalPage; i += 1) {
    pages.push({
      pageNo: i + 1,
      loadStatus: pageLoadStatus.WAIT,
      pdfPage: null,
      dom: null
    });
  }
}
// 获取单页高度
const viewport = pdfPage.getViewport({
  scale: 1, // 缩放的比例
  rotation: 0, // 旋转的角度
});
// 记录pdf页面高度
const pageSize = {
  width: viewport.width,
  height: viewport.height,
}

// 为了不让内容太拥挤，我们可以加一些页面间距 PAGE_INTVERVAL
const PAGE_INTVERVAL = 10;
// 创建内容绘制区，并设置大小
const contentView = document.createElement('div');
contentView.style.width = `${this.pageSize.width}px`;
contentView.style.height = `${(totalPage * (pageSize.height + PAGE_INTVERVAL)) + PAGE_INTVERVAL}px`;
pdfContainer.appendChild(contentView);

// 我们可以通过 scale 和 rotaion 的值来控制 pdf 文档缩放、旋转
let scale = 1;
let rotation = 0;
function renderPageContent (page) {
  const { pdfPage, pageNo, dom } = page;
  // dom 元素已存在，无须重新渲染，直接返回
  if (dom) {
    return;
  }
  const viewport = pdfPage.getViewport({
    scale: scale,
    rotation: rotation,
  });
  // 创建新的canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = pageSize.height;
  canvas.width = pageSize.width;
  // 创建渲染的dom
  const pageDom = document.createElement('div');
  pageDom.style.position = 'absolute';
  pageDom.style.top = `${((pageNo - 1) * (pageSize.height + PAGE_INTVERVAL)) + PAGE_INTVERVAL}px`;
  pageDom.style.width = `${pageSize.width}px`;
  pageDom.style.height = `${pageSize.height}px`;
  pageDom.appendChild(canvas);
  // 渲染内容
  pdfPage.render({
    canvasContext: context,
    viewport,
  });
  page.dom = pageDom;
  contentView.appendChild(pageDom);
}
// 监听容器的滚动事件，触发 scrollPdf 方法
// 这里加了防抖保证不会一次产生过多请求
scrollPdf = _.debounce(() => {
  const scrollTop = pdfContainer.scrollTop;
  const height = pdfContainer.height;
  // 根据内容可视区域中心点计算页码, 没有滚动时，指向第一页
  const pageIndex = scrollTop > 0 ?
        Math.ceil((scrollTop + (height / 2)) / (pageSize.height + PAGE_INTVERVAL)) :
        1;
  loadBefore(pageIndex);
  loadAfter(pageIndex);
}, 200)
// 假定每个分片的大小是 5 页
const SLICE_COUNT = 5;
// 获取当前页之前页面的分片
function loadBefore (pageIndex) {
  const start = (Math.floor(pageIndex / SLICE_COUNT) * SLICE_COUNT) - (SLICE_COUNT - 1);
  if (start > 0) {
    const prevPage = pages[start - 1] || {};
    prevPage.loadStatus === pageLoadStatus.WAIT && loadPdfData(start);
  }
}
// 获取当前页之后页面的分片
function loadAfter (pageIndex) {
  const start = (Math.floor(pageIndex / SLICE_COUNT) * SLICE_COUNT) + 1;
  if (start <= pages.length) {
    const nextPage = pages[start - 1] || {};
    nextPage.loadStatus === pageLoadStatus.WAIT && loadPdfData(start);
  }
}
// 首先我们获取到需要渲染的范围
// 根据当前的可视范围内的页码，我们前后只保留 10 页
function getRenderScope (pageIndex) {
  const pagesToRender = [];
  let i = pageIndex - 1;
  let j = pageIndex + 1;
  pagesToRender.push(pages[pageIndex - 1]);
  while (pagesToRender.length < 10 && pagesToRender.length < pages.length) {
    if (i > 0) {
      pagesToRender.push(pages[i - 1]);
      i -= 1;
    }
    if (pagesToRender.length >= 10) {
      break;
    }
    if (j <= pages.length) {
      pagesToRender.push(this.pages[j - 1]);
      j += 1;
    }
  }
  return pagesToRender;
}
// 渲染需要展示的页面，不需展示的页码将其清除
function renderPages (pageIndex) {
  const pagesToRender = getRenderScope(pageIndex);
  for (const i of pages) {
    if (pagesToRender.includes(i)) {
      i.loadStatus === pageLoadStatus.LOADED ?
        renderPageContent(i) :
        renderPageLoading(i);
    } else {
      clearPage(i);
    }
  }
}
// 清除页面 dom
function clearPage (page) {
  if (page.dom) {
    contentView.removeChild(page.dom);
    page.dom = undefined;
  }
}
// 页面正在下载时渲染loading视图
function renderPageLoading (page) {
  const { pageNo, dom } = page;
  if (dom) {
    return;
  }
  const pageDom = document.createElement('div');
  pageDom.style.width = `${pageSize.width}px`;
  pageDom.style.height = `${pageSize.height}px`;
  pageDom.style.position = 'absolute';
  pageDom.style.top = `${
    ((pageNo - 1) * (pageSize.height + PAGE_INTVERVAL)) + PAGE_INTVERVAL
  }px`;
  /*
   此处在dom 上添加 loading 组件，省略实现
  */
  page.dom = pageDom;
  contentView.appendChild(pageDom);
}
/**
 * 获取元素的高度包括margin
 * @param el
 * @returns
 */
export const getFullHeight = (el: HTMLDivElement) => {
  const offsetHeight = el.offsetHeight;
  const marginTop = window.getComputedStyle(el).marginTop.replace('px', '');
  const marginBottom = window.getComputedStyle(el).marginBottom.replace('px', '');
  return offsetHeight + (+marginTop) + (+marginBottom);
};
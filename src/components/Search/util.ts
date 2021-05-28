// 级联数据解构
export const convertData = (data: API.XNXQ[]) => {
  const chainData: {
      data: { title: string, key: string }[],
      subData: Record<string, { title: string; key: string }[]>
  } = {
      data: [],
      subData: {}
  }
  data.forEach((item) => {
      const { XN, XQ } = item;
      if (!chainData.data.find((d) => d.key === XN)) {
          chainData.data.push({ title: XN, key: XN })
      }
      if (chainData.subData[XN]) {
          chainData.subData[XN].push({ title: XQ, key: XQ })
      } else {
          chainData.subData[XN] = [{ title: XQ, key: XQ }]
      }
  });
  return chainData;
}
// 级联数据解构
export const convertData = (data: API.XNXQ[]) => {
    const chainData: {
        data: { label: string, value: string }[],
        subData: Record<string, { label: string; value: string }[]>
    } = {
        data: [],
        subData: {}
    }
    if (data && data.length) {
        data.forEach((item) => {
            const { XN, XQ } = item;

            if (!chainData.data.find((d) => d.value === XN)) {
                chainData.data.push({ label: XN, value: XN })
            }
            if (chainData.subData[XN]) {
                chainData.subData[XN].push({ label: XQ, value: XQ })
            } else {
                chainData.subData[XN] = [{ label: XQ, value: XQ }]
            }
        });
    }
    return chainData;
}
// 选择数据结构
export const convertSelectData = (data: API.NJSJ[]) => {
    const selectData: { key: string; title: string; }[] = []
    data.forEach((item) => {

        selectData.push({ key: item.id, title: item.NJMC })
    })
    return selectData;
}
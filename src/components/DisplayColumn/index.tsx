import type { FC, ReactNode } from 'react'
import styles from './index.less'


type Columstype = {
    /** 数据数组 */
    val: ValType[],
    /** 标题栏 */
    title?: string,
    /** 自定义类名 */
    bigboxname?: string,
}
export type ValType = {
    /** 上边div中的类型 */
    type: 'icon' | 'img';
    /** 如果是icon 传标签直接渲染 */
    content?: ReactNode,
    /** 如果是img 传路径 */
    text?: string,
    /** 顶部div的自定义类名 */
    valclassnam?: string,
    /** 底部div的内容 */
    title?: string,
    /** 每一个的点击事件 */
    onclick?: () => void,
    /** 底部文字框的类名 */
    titleclasssname?: string,
    /** 包裹盒类名 */
    boxname?: string,
}



const DisplayColumn: FC<Columstype> = ({
    val,
    title='',
    bigboxname,
}) => {

    return (
        <div className={`${bigboxname} ${styles.bigbox}`}>
            {title? (<div className={styles.cs}>{title}</div>) :''}
            {
                val.map((item) => {
                    return (
                    <div onClick={item.onclick} className={`${item.boxname} ${styles.boxclassName}`}>
                        <div className={`${item.valclassnam} ${styles.valueclassName}`}>
                            {
                                item.type === 'icon' ? item.content : <img src={item.text} alt='' />
                            }
                        </div>
                        <div className={`${item.titleclasssname} ${styles.titleclassName}`}>{item.title}</div>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default DisplayColumn
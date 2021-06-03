
const Choice =(props: any)=>{
    const {record} =props;
    const myDate = new Date();
    const nowdata=myDate.toLocaleDateString();
    console.log(nowdata)
    if(record.KCZT==='报名中'){
        return <span>已发布</span>
    }if(record.KCZT==='报名结束'){
        return <span>报名中</span>
    }if(record.KCZT==='已开课'){
        return <span>报名中</span>
    }if(record.KCZT==='已结课'){
        return <span>已结课</span>
    }
    return <span>报名中</span>

}
export default Choice

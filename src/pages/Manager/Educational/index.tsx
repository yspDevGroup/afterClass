import { useEffect,useRef} from 'react';



const EducationalPage:React.FC=(props)=>{
useEffect(()=>{
      // window.open('http://moodle.xianyunshipei.com/course/view.php?id=12')

 window.location.href='http://moodle.xianyunshipei.com/course/view.php?id=12'
   },[])
 
return(
      <div >
            {/* <a href="http://moodle.xianyunshipei.com/course/view.php?id=12" target='_self' onClick={}>aaa</a> */}
         

      </div>

  )
}
export default EducationalPage
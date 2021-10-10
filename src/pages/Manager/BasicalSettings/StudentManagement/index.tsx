import PageContainer from "@/components/PageContainer";
import styles from './index.less'

/* eslint-disable react/self-closing-comp */
const StudentManagement = () => {

  return <PageContainer cls={styles.StudentManagement}><iframe
    id="mainIframe"
    name="mainIframe"
    src="http://192.168.0.99:8081/studentManagement?hideMamu=true"
    frameBorder="0"
    scrolling="auto"
    style={{ width: '100%', height: '100%' }}>
  </iframe></PageContainer>
}
export default StudentManagement;

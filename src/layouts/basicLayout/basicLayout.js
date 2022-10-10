import { useEffect, useState } from 'react'
import { Outlet } from 'umi'
import { fetchSiteInfo } from '../../services/service'
import styles from './basicLayout.less'

export default function BasicLayout() {
  const [title, setTitle] = useState('')
  const [copyright, setCopyright] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetchSiteInfo()
      setTitle(res.title)
      setCopyright(res.copyright)
    } catch (error) {
      console.log('fetchSiteInfo', error)
    }
  }

  return (
    <div>
      <div className={styles.header}>{title}</div>
      <div className={styles.container}>
        <Outlet />
      </div>
      <div className={styles.footer}>{copyright}</div>
    </div>
  )
}

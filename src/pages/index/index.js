import { useEffect, useState } from 'react'
import { history } from 'umi'
import { Input, Divider, Row, Col, Card, message } from 'antd'
import { SearchOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons'
import { fetchComponentList } from '../../services/service'
import { getGitUrl, getPreviewUrl } from '../../utils/git'
import styles from './index.less'
import './index.less'

const { Meta } = Card

export default function HomePage() {
  const [list, setList] = useState([])
  const [searchParams, setSearchParams] = useState({})

  useEffect(() => {
    fetchList(searchParams)
  }, [searchParams])

  const fetchList = async searchParams => {
    try {
      const data = await fetchComponentList(searchParams)
      setList(data)
    } catch (error) {
      console.log('fetchComponentList', error)
    }
  }

  const getAvatar = item => {
    switch (item.git_type) {
      case 'gitee':
        return {
          img: 'https://gitee.com/static/images/logo-black.svg', // https://www.youbaobao.xyz/arch/img/github.jpeg
          style: { height: '18px', cursor: 'pointer' },
        }
      default:
        break
    }
  }

  const handlePreviewClick = item => {
    let url = getLatestPreviewUrl(item)
    if (url.includes('undefined')) {
      return message.info('Component Example Coming')
    }
    window.open(url)
  }

  const getLatestPreviewUrl = item => {
    const latestVersion = item.versions[0]
    const examplePath = latestVersion.example_path
    const exampleFile = JSON.parse(latestVersion.example_list)[0]
    return getPreviewUrl({
      name: item.classname,
      version: latestVersion.version,
      path: examplePath,
      file: exampleFile,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Divider />
        <div className={styles.searchInput}>
          <Input
            placeholder="搜索组件"
            bordered={false}
            size="large"
            onChange={e => setSearchParams({ name: e.target.value })}
          />
          <SearchOutlined style={{ fontSize: '20px', color: '#bbb' }} />
        </div>
        <Divider />
      </div>

      <Row gutter={[16, 16]}>
        {list.map(item => (
          <Col span={6} key={item.id}>
            <Card
              hoverable
              actions={[
                <EyeOutlined key="setting" onClick={() => handlePreviewClick(item)} />,
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    history.push({ pathname: '/detail', search: `?id=${item.id}` })
                  }}
                />,
                <EllipsisOutlined key="ellipsis" />,
              ]}>
              <Meta
                avatar={
                  <img
                    src={getAvatar(item).img}
                    style={getAvatar(item).style}
                    onClick={() => window.open(getGitUrl(item))}
                  />
                }
                title={item.name}
                description={item.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Select, Divider, Button, message } from 'antd'
import { FileOutlined, EyeOutlined, CloudOutlined, CopyOutlined } from '@ant-design/icons'
import showdown from 'showdown'
import { fetchComponentDetail } from '../../services/service'
import { fromNow, copy } from '../../utils'
import { getGitUrl, getPreviewUrl, getNpmUrl } from '../../utils/git'

import 'github-markdown-css'
import styles from './index.less'

const { Option } = Select

const DetailPage = props => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState(null)
  const [version, setVersion] = useState(null) // 版本号
  const [versionData, setVersionData] = useState(null) // 版本对象
  const [previewIndex, setPreviewIndex] = useState(0)
  const [preview, setPreview] = useState([])
  const [readme, setReadme] = useState(null)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      fetchData(id)
    }
  }, [])

  useEffect(() => {
    if (data && version) {
      const versionData = data.versions.find(item => item.version === version)
      let versionPreview = JSON.parse(versionData.example_list)
      versionPreview = versionPreview.map((file, index) => ({
        name: `预览${index + 1}`,
        index,
        file: getPreviewUrl({
          name: data.classname,
          version: versionData.version,
          path: versionData.example_path,
          file: versionPreview[index],
        }),
      }))
      setVersionData(versionData)
      setPreview(versionPreview)
      setPreviewIndex(previewIndex)
    }
  }, [data, version, previewIndex])

  const fetchData = async id => {
    const data = await fetchComponentDetail(id)
    setData(data)
    setVersion(data.versions[0].version)
    const converter = new showdown.Converter(),
      text = data.readme,
      html = converter.makeHtml(text)
    setReadme(html)
  }

  return (
    <div className={styles.container}>
      {data ? (
        <>
          <div className={styles.flexView}>
            <h1 className={styles.componentName}>{data.name}</h1>
            <Select
              value={version}
              style={{ marginLeft: 40, width: 120 }}
              bordered={false}
              onChange={val => setVersion(val)}>
              {data.versions.map(item => (
                <Option key={item.version} value={item.version}>
                  {item.version}
                </Option>
              ))}
            </Select>
          </div>

          <p>{data.description}</p>
          <Divider />

          <div className={styles.flexView}>
            <div className={styles.detailText}>代码托管：{data.git_type}</div>
            <div className={styles.detailText}>上传用户：{data.git_login}</div>
            <div className={styles.detailText}>创建时间：{fromNow(versionData?.create_dt)}</div>
            <div className={styles.detailText}>更新时间：{fromNow(versionData?.update_dt)}</div>
          </div>

          <div className={styles.btnGroup}>
            <div className={styles.flexView}>
              <Button
                className={styles.detailBtn}
                type="primary"
                icon={<FileOutlined />}
                onClick={() => window.open(getGitUrl(data))}>
                查看源码
              </Button>
              <Button
                className={styles.detailBtn}
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => window.open(preview[previewIndex].file)}>
                组件预览
              </Button>
              {preview.length > 0 ? (
                <Select
                  className={styles.detailBtn}
                  value={previewIndex}
                  bordered={false}
                  onChange={val => setPreviewIndex(val)}>
                  {preview?.map(item => (
                    <Option key={item.name} value={item.index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              ) : null}

              <Button
                className={styles.detailBtn}
                type="primary"
                icon={<CloudOutlined />}
                onClick={() => window.open(getNpmUrl(data, version))}>
                NPM仓库
              </Button>
            </div>
          </div>

          <div className={styles.applyBox}>
            <div className={styles.applyTitle}>在项目中使用</div>
            <Divider />
            <div className={styles.applyCommandWrapper}>
              <div className={styles.command}>npm install {data.classname}</div>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => {
                  copy(`npm install ${data.classname}`)
                  message.success('命令复制成功')
                }}>
                复制命令
              </Button>
            </div>
          </div>
          <Divider />

          {readme ? (
            <>
              <h2>文档</h2>
              <div className={styles.detailReadme} dangerouslySetInnerHTML={{ __html: readme }}></div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default DetailPage

import request from '../utils/request'

export function fetchSiteInfo() {
  return request({ url: '/api/v1/componentSite' })
}

export function fetchComponentList(params) {
  return request({ url: '/api/v1/components', params })
}

export function fetchComponentDetail(id) {
  return request({ url: `/api/v1/components/${id}` })
}

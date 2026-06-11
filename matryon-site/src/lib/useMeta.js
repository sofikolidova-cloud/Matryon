import { onMounted } from 'vue'

export function useMeta(title, description) {
  onMounted(() => {
    document.title = title

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description

    let metaOgTitle = document.querySelector('meta[property="og:title"]')
    if (!metaOgTitle) {
      metaOgTitle = document.createElement('meta')
      metaOgTitle.setAttribute('property', 'og:title')
      document.head.appendChild(metaOgTitle)
    }
    metaOgTitle.content = title

    let metaOgDesc = document.querySelector('meta[property="og:description"]')
    if (!metaOgDesc) {
      metaOgDesc = document.createElement('meta')
      metaOgDesc.setAttribute('property', 'og:description')
      document.head.appendChild(metaOgDesc)
    }
    metaOgDesc.content = description
  })
}

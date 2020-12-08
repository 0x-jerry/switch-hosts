const dom = document.createElement('input')
dom.type = 'file'
dom.style.display = 'none'
document.body.append(dom)

export function useFileBox() {
  return {
    async open(): Promise<string> {
      return new Promise((resolve) => {
        const file = new FileReader()

        dom.onchange = (e) => {
          const target: HTMLInputElement = e.target as any

          file.onload = (e) => {
            const result = e.target?.result as any

            resolve(result)

            // reset
            dom.value = ''
          }

          file.readAsText(target.files![0])
        }

        dom.click()
      })
    }
  }
}

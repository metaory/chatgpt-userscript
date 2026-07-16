const $ = document.querySelector.bind(document)

document.title = 'GPT'
gradient('l3.8e48', 'body')

{
  const SEL = {
    newChat: 'a[aria-label="New chat"]',
    sidebarOpen: 'button[data-testid="open-sidebar-button"]',
    sidebarClose: 'button[data-testid="close-sidebar-button"]',
    tempChat: 'button[aria-label="Turn on temporary chat"]',
  }

  const usable = (el) => el && !el.disabled && el.getClientRects().length
  const clickSel = (sel) => () => $(sel)?.click()
  const clickFirst = (...sels) => () => sels.map($).find(usable)?.click()
  const noCtrlMeta = (e) => !e.ctrlKey && !e.metaKey
  const altOk = (e) => e.altKey && noCtrlMeta(e) && !e.defaultPrevented && !e.isComposing

  const ALT_ACTIONS = new Map([
    ['KeyN', clickSel(SEL.newChat)],
    ['KeyL', clickFirst(SEL.sidebarClose, SEL.sidebarOpen)],
    ['KeyI', clickSel(SEL.tempChat)],
  ])

  document.addEventListener('keydown', (e) => {
    if (!altOk(e)) return
    const act = ALT_ACTIONS.get(e.code)
    if (!act) return
    e.preventDefault()
    e.stopPropagation()
    act()
  }, { capture: true })
}

export const isDesktopViewPort = (page) => {
    const size = page.viewportSize()
    return (size.width >= 600)
}
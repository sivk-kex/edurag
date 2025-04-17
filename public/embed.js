;(() => {
    // Configuration from data attributes
    const script = document.currentScript
    const userId = script.getAttribute("data-user-id")
    const title = script.getAttribute("data-title") || "AI Assistant"
    const primaryColor = script.getAttribute("data-color") || "#0f172a"
    const position = script.getAttribute("data-position") || "right"
  
    // Create widget button
    const button = document.createElement("button")
    button.id = "edurag-widget-button"
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
    button.style.position = "fixed"
    button.style.bottom = "20px"
    button.style[position] = "20px"
    button.style.backgroundColor = primaryColor
    button.style.color = "white"
    button.style.border = "none"
    button.style.borderRadius = "50%"
    button.style.width = "56px"
    button.style.height = "56px"
    button.style.display = "flex"
    button.style.alignItems = "center"
    button.style.justifyContent = "center"
    button.style.cursor = "pointer"
    button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
    button.style.zIndex = "9999"
  
    // Create widget container
    const container = document.createElement("div")
    container.id = "edurag-widget-container"
    container.style.position = "fixed"
    container.style.bottom = "90px"
    container.style[position] = "20px"
    container.style.width = "350px"
    container.style.height = "500px"
    container.style.backgroundColor = "white"
    container.style.borderRadius = "10px"
    container.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
    container.style.overflow = "hidden"
    container.style.display = "none"
    container.style.flexDirection = "column"
    container.style.zIndex = "10000"
  
    // Create iframe for the chat
    const iframe = document.createElement("iframe")
    iframe.src = `https://edurag-chatbot.vercel.app/embed/${userId}`
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "none"
  
    // Add elements to the DOM
    container.appendChild(iframe)
    document.body.appendChild(button)
    document.body.appendChild(container)
  
    // Toggle widget visibility
    button.addEventListener("click", () => {
      if (container.style.display === "none") {
        container.style.display = "flex"
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      } else {
        container.style.display = "none"
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
      }
    })
  })()
  
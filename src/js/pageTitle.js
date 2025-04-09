export function setPageTitle(title) {
    if (title && typeof title === "string") {
      document.title = title; // Set the page title dynamically
    } else {
      console.error("Invalid title provided.");
    }
  }
  
  // Set the title based on the page content
  export function setDynamicPageTitle() {
    const pageHeader = document.querySelector("h1"); 
    if (pageHeader) {
      setPageTitle(`The Game | ${pageHeader.textContent.trim()}`); // Use the <h1> text as the title
    } else {
      setPageTitle("Default Page Title"); // Fallback title
    }
  }
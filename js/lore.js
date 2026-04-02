// Lore Database Tab System

function initLoreTabs() {
  const tabs = document.querySelectorAll(".lore-tab");
  const sections = document.querySelectorAll(".lore-section");

  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Remove active state from all tabs and sections
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      // Add active state to clicked tab and corresponding section
      this.classList.add("active");
      document.getElementById(`${tabName}-content`).classList.add("active");
    });
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initLoreTabs);

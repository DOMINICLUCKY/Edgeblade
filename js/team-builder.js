// Team Builder System
let teamSlots = {
  1: null,
  2: null,
  3: null
};

const characters = {
  flame: { name: "IGNIVAR", emoji: "🔥", element: "Flame" },
  wind: { name: "AELITH", emoji: "🌪️", element: "Wind" },
  shadow: { name: "MORVYN", emoji: "🌑", element: "Shadow" }
};

function initTeamBuilder() {
  setupDragAndDrop();
  setupButtons();
}

function setupDragAndDrop() {
  const options = document.querySelectorAll(".team-option");
  const slots = document.querySelectorAll(".team-slot");

  options.forEach(option => {
    option.addEventListener("dragstart", dragStart);
    option.addEventListener("dragend", dragEnd);
  });

  slots.forEach(slot => {
    slot.addEventListener("dragover", dragOver);
    slot.addEventListener("drop", drop);
    slot.addEventListener("dragleave", dragLeave);
  });
}

let draggedElement = null;

function dragStart(e) {
  draggedElement = this;
  this.style.opacity = "0.5";
  e.dataTransfer.effectAllowed = "move";
}

function dragEnd(e) {
  this.style.opacity = "1";
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  this.style.backgroundColor = "rgba(255, 100, 100, 0.2)";
}

function dragLeave(e) {
  this.style.backgroundColor = "";
}

function drop(e) {
  e.preventDefault();
  const slot = this;
  const slotNumber = slot.getAttribute("data-slot");

  if (draggedElement.classList.contains("team-option")) {
    const character = draggedElement.getAttribute("data-character");
    teamSlots[slotNumber] = character;

    const char = characters[character];
    slot.innerHTML = `<span class="team-slot-char">${char.emoji} ${char.name}</span>`;
    slot.style.backgroundColor = "";
    updateTeamAnalysis();
  }
}

function updateTeamAnalysis() {
  const analysisDiv = document.getElementById("team-analysis");
  const team = Object.values(teamSlots);
  const filled = team.filter(c => c !== null);

  if (filled.length === 0) {
    analysisDiv.innerHTML = "<p>Add warriors to your team to see analysis</p>";
    return;
  }

  let analysis = `<div class="team-composition">
    <p><strong>Team Composition:</strong></p>
    <ul>`;

  filled.forEach(char => {
    analysis += `<li>${characters[char].emoji} ${characters[char].name}</li>`;
  });

  analysis += `</ul></div>`;

  const hasAllElements = filled.length === 3 &&
    new Set(filled).size === 3 &&
    filled.includes("flame") &&
    filled.includes("wind") &&
    filled.includes("shadow");

  if (hasAllElements) {
    analysis += `
      <div class="team-balance balanced">
        <p><strong>✓ Perfect Balance:</strong> Your team has all three elements in perfect harmony!</p>
        <p>Flame for power, Wind for speed, Shadow for strategy. An unbeatable combination.</p>
      </div>
    `;
  } else if (filled.length > 1) {
    const elementCount = {};
    filled.forEach(char => {
      const elem = characters[char].element;
      elementCount[elem] = (elementCount[elem] || 0) + 1;
    });

    const duplicates = Object.values(elementCount).some(count => count > 1);
    if (duplicates) {
      analysis += `
        <div class="team-balance unbalanced">
          <p><strong>⚠ Imbalanced:</strong> You have duplicate elements. Add variety for tactical advantage.</p>
        </div>
      `;
    }
  }

  analysisDiv.innerHTML = analysis;
}

function setupButtons() {
  const shareBtn = document.getElementById("share-team-btn");
  const resetBtn = document.getElementById("reset-team-btn");

  if (shareBtn) {
    shareBtn.addEventListener("click", shareTeam);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetTeam);
  }
}

function shareTeam() {
  const team = Object.values(teamSlots)
    .filter(c => c !== null)
    .map(c => c.charAt(0).toUpperCase())
    .join("");

  if (team.length === 0) {
    alert("Add warriors to your team first!");
    return;
  }

  const teamString = Object.values(teamSlots)
    .map(c => c || "empty")
    .join("-");

  const shareText = `Check out my EDGEBLADE team: ${teamString}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}?team=${teamString}`;

  if (navigator.share) {
    navigator.share({
      title: "EDGEBLADE Team",
      text: shareText,
      url: shareUrl
    }).catch(err => console.log("Share failed:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Team link copied to clipboard!"))
      .catch(err => alert("Failed to copy: " + err));
  }
}

function resetTeam() {
  teamSlots = { 1: null, 2: null, 3: null };

  document.querySelectorAll(".team-slot").forEach(slot => {
    slot.innerHTML = `Slot ${slot.getAttribute("data-slot")}`;
    slot.style.backgroundColor = "";
  });

  updateTeamAnalysis();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initTeamBuilder);

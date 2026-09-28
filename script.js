// Intel Sustainability Summit Check-In Application

// Constants and Goal
const maxGoal = 50;
const STORAGE_KEY_TOTAL = "intel_summit_total_count";
const STORAGE_KEY_WATER = "intel_summit_water_count";
const STORAGE_KEY_ZERO = "intel_summit_zero_count";
const STORAGE_KEY_POWER = "intel_summit_power_count";
const STORAGE_KEY_ATTENDEES = "intel_summit_attendees_list";

// State variables
let totalAttendees = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;
let attendeesList = [];

// DOM Elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");
const celebrationBanner = document.getElementById("celebrationBanner");
const celebrationMessage = document.getElementById("celebrationMessage");
const winningTeamText = document.getElementById("winningTeamText");
const attendeeList = document.getElementById("attendeeList");
const attendeeEmptyState = document.getElementById("attendeeEmptyState");
const attendeeListCount = document.getElementById("attendeeListCount");
const resetBtn = document.getElementById("resetBtn");

// Helper function to format current time
function getCurrentTimeFormatted() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Save progress to localStorage (Save Your Progress - 10 pts)
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY_TOTAL, totalAttendees.toString());
    localStorage.setItem(STORAGE_KEY_WATER, waterCount.toString());
    localStorage.setItem(STORAGE_KEY_ZERO, zeroCount.toString());
    localStorage.setItem(STORAGE_KEY_POWER, powerCount.toString());
    localStorage.setItem(STORAGE_KEY_ATTENDEES, JSON.stringify(attendeesList));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
}

// Load progress from localStorage on startup
function loadProgress() {
  try {
    const savedTotal = localStorage.getItem(STORAGE_KEY_TOTAL);
    const savedWater = localStorage.getItem(STORAGE_KEY_WATER);
    const savedZero = localStorage.getItem(STORAGE_KEY_ZERO);
    const savedPower = localStorage.getItem(STORAGE_KEY_POWER);
    const savedAttendees = localStorage.getItem(STORAGE_KEY_ATTENDEES);

    if (savedTotal !== null) {
      totalAttendees = parseInt(savedTotal, 10) || 0;
    }
    if (savedWater !== null) {
      waterCount = parseInt(savedWater, 10) || 0;
    }
    if (savedZero !== null) {
      zeroCount = parseInt(savedZero, 10) || 0;
    }
    if (savedPower !== null) {
      powerCount = parseInt(savedPower, 10) || 0;
    }
    if (savedAttendees !== null) {
      attendeesList = JSON.parse(savedAttendees) || [];
    }
  } catch (error) {
    console.error("Error reading data from localStorage:", error);
  }
}

// Determine the winning team for the celebration feature
function getWinningTeamSummary() {
  const teams = [
    { name: "Team Water Wise 🌊", count: waterCount },
    { name: "Team Net Zero 🌿", count: zeroCount },
    { name: "Team Renewables ⚡", count: powerCount }
  ];

  let highestCount = -1;
  for (let i = 0; i < teams.length; i = i + 1) {
    if (teams[i].count > highestCount) {
      highestCount = teams[i].count;
    }
  }

  if (highestCount <= 0) {
    return "All teams tied with 0 check-ins";
  }

  const winners = [];
  for (let i = 0; i < teams.length; i = i + 1) {
    if (teams[i].count === highestCount) {
      winners.push(teams[i].name);
    }
  }

  if (winners.length === 1) {
    return `${winners[0]} with ${highestCount} check-ins! 🏆`;
  } else {
    return `Tie: ${winners.join(" & ")} with ${highestCount} each! 🏆`;
  }
}

// Update the Celebration Feature (Celebration Feature - 5 pts)
function updateCelebration() {
  if (totalAttendees >= maxGoal) {
    celebrationBanner.style.display = "block";
    celebrationMessage.textContent = `Congratulations! We reached our summit goal of ${maxGoal} attendees! Total checked in: ${totalAttendees}.`;
    winningTeamText.textContent = `Winning Team: ${getWinningTeamSummary()}`;
  } else {
    celebrationBanner.style.display = "none";
  }
}

// Render the Attendee List (Attendee List - 10 pts)
function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendeesList.length === 0) {
    attendeeEmptyState.style.display = "block";
    attendeeListCount.textContent = "0 attendees";
    return;
  }

  attendeeEmptyState.style.display = "none";
  const plural = attendeesList.length === 1 ? "" : "s";
  attendeeListCount.textContent = `${attendeesList.length} attendee${plural}`;

  // Display recent check-ins first
  for (let i = attendeesList.length - 1; i >= 0; i = i - 1) {
    const attendee = attendeesList[i];
    const li = document.createElement("li");
    li.className = "attendee-item";

    const initial = attendee.name.charAt(0).toUpperCase();

    let teamPillClass = "water";
    let teamEmoji = "🌊";
    if (attendee.team === "zero") {
      teamPillClass = "zero";
      teamEmoji = "🌿";
    } else if (attendee.team === "power") {
      teamPillClass = "power";
      teamEmoji = "⚡";
    }

    li.innerHTML = `
      <div class="attendee-info">
        <div class="attendee-avatar">${initial}</div>
        <span class="attendee-name">${attendee.name}</span>
      </div>
      <div class="attendee-meta">
        <span class="attendee-team-pill ${teamPillClass}">${teamEmoji} ${attendee.teamName}</span>
        <span class="attendee-time">${attendee.time}</span>
      </div>
    `;

    attendeeList.appendChild(li);
  }
}

// Update all UI components based on state
function updateUI() {
  // Update attendance counter
  attendeeCountSpan.textContent = totalAttendees;

  // Update progress bar
  const percentage = Math.min((totalAttendees / maxGoal) * 100, 100);
  progressBar.style.width = `${percentage}%`;

  // Update individual team counts
  waterCountSpan.textContent = waterCount;
  zeroCountSpan.textContent = zeroCount;
  powerCountSpan.textContent = powerCount;

  // Update celebration state
  updateCelebration();

  // Update attendee directory
  renderAttendeeList();
}

// Handle Attendee Check-In Form Submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamText = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !selectedTeam) {
    return;
  }

  // Increment total attendance count
  totalAttendees = totalAttendees + 1;

  // Increment team count
  if (selectedTeam === "water") {
    waterCount = waterCount + 1;
  } else if (selectedTeam === "zero") {
    zeroCount = zeroCount + 1;
  } else if (selectedTeam === "power") {
    powerCount = powerCount + 1;
  }

  // Record attendee in the directory
  const newAttendee = {
    id: Date.now(),
    name: name,
    team: selectedTeam,
    teamName: teamText,
    time: getCurrentTimeFormatted()
  };
  attendeesList.push(newAttendee);

  // Save to localStorage
  saveProgress();

  // Update UI displays
  updateUI();

  // Show personalized dynamic greeting
  greeting.textContent = `Welcome, ${name}! You have successfully checked in with ${teamText}.`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  // Reset form inputs for the next attendee
  checkInForm.reset();
  attendeeNameInput.focus();
});

// Reset check-in data handler (safe for iframe environments)
let resetConfirmTimer = null;
if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    if (resetBtn.dataset.confirming === "true") {
      // Confirmed reset
      clearTimeout(resetConfirmTimer);
      resetBtn.dataset.confirming = "false";
      resetBtn.innerHTML = '<i class="fas fa-rotate-left"></i> Reset Check-In Data';

      totalAttendees = 0;
      waterCount = 0;
      zeroCount = 0;
      powerCount = 0;
      attendeesList = [];

      try {
        localStorage.removeItem(STORAGE_KEY_TOTAL);
        localStorage.removeItem(STORAGE_KEY_WATER);
        localStorage.removeItem(STORAGE_KEY_ZERO);
        localStorage.removeItem(STORAGE_KEY_POWER);
        localStorage.removeItem(STORAGE_KEY_ATTENDEES);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }

      updateUI();
      greeting.style.display = "none";
    } else {
      // First click: prompt user to click again to confirm
      resetBtn.dataset.confirming = "true";
      resetBtn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Click again to confirm reset';

      resetConfirmTimer = setTimeout(function () {
        resetBtn.dataset.confirming = "false";
        resetBtn.innerHTML = '<i class="fas fa-rotate-left"></i> Reset Check-In Data';
      }, 4000);
    }
  });
}

// Initialize on page load
loadProgress();
updateUI();

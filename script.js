// Intel Sustainability Summit Check-In Application

let totalAttendees = 0;
const maxGoal = 50;

let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");

// Listen for form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get name and selected team
  const name = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const teamText = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !selectedTeam) {
    return;
  }

  // Increment total attendance count
  totalAttendees = totalAttendees + 1;
  attendeeCountSpan.textContent = totalAttendees;

  // Calculate percentage and update progress bar width
  const percentage = Math.min((totalAttendees / maxGoal) * 100, 100);
  progressBar.style.width = `${percentage}%`;

  // Update specific team count
  if (selectedTeam === "water") {
    waterCount = waterCount + 1;
    waterCountSpan.textContent = waterCount;
  } else if (selectedTeam === "zero") {
    zeroCount = zeroCount + 1;
    zeroCountSpan.textContent = zeroCount;
  } else if (selectedTeam === "power") {
    powerCount = powerCount + 1;
    powerCountSpan.textContent = powerCount;
  }

  // Show welcome greeting message
  greeting.textContent = `Welcome, ${name}! You have successfully checked in with ${teamText}.`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  // Reset form inputs for next attendee
  checkInForm.reset();
});

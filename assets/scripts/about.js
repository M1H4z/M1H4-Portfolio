// Get all tab buttons and content sections
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".timeline");

// Add click event listener to each tab
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((t) => t.classList.remove("active"));

    // Add active class to clicked tab
    tab.classList.add("active");

    // Hide all content sections
    contents.forEach((content) => {
      content.style.display = "none";
    });

    // Show the selected content
    const contentId = `${tab.dataset.tab}-content`;
    document.getElementById(contentId).style.display = "block";
  });
});

// Add resume download functionality
const resumeButton = document.querySelector(".button-resume");
resumeButton.addEventListener("click", () => {
  // Create a link element
  const link = document.createElement("a");
  link.href = "../assets/files/M1H4_Resume.pdf"; // Path to your resume
  link.download = "M1H4_Resume.pdf"; // Name for downloaded file

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Add tech stack hover functionality
const techItems = document.querySelectorAll(".tech-item");
const techName = document.querySelector(".tech-name");
const techExperience = document.querySelector(".tech-experience");

techItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    techName.textContent = item.dataset.name;
    techExperience.textContent = item.dataset.experience;
    techName.style.opacity = "1";
    techExperience.style.opacity = "1";
  });

  item.addEventListener("mouseleave", () => {
    techName.style.opacity = "0";
    techExperience.style.opacity = "0";
  });
});

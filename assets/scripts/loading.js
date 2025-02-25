document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingText = document.getElementById("loading-text");
  const loadingItems = document.getElementById("loading-items");
  const progressBar = document
    .querySelector(".progress-bar")
    ?.querySelector(".progress");

  if (!loadingScreen || !loadingText || !loadingItems || !progressBar) return;

  // Determine if this is a full reload.
  const isReload =
    performance.getEntriesByType("navigation")[0]?.type === "reload" ||
    window.performance.navigation?.type === 1;

  // Check if the user navigated here from another internal page.
  const isInternalNavigation =
    document.referrer && document.referrer.startsWith(window.location.origin);

  // If the navigation is internal and it's not a reload, skip the loading screen.
  if (isInternalNavigation && !isReload) {
    loadingScreen.style.display = "none";
    document.getElementById("userInput")?.focus();
    return;
  }

  // Otherwise, show the loading screen.
  loadingScreen.style.display = "flex";

  const startLoadingSequence = () => {
    let text = isReload ? "Rebooting..." : "Booting...";
    let index = 0;

    const typeText = () => {
      if (index < text.length) {
        loadingText.textContent += text[index++];
        setTimeout(typeText, 100);
      }
    };

    typeText();

    const totalFiles = 5;
    let loadedFiles = 0;
    const files = [
      "styles.css",
      "command.js",
      "loading.js",
      "PressStart2P.woff2",
      "terminal-config.json",
    ];

    const loadFile = (fileName) =>
      new Promise((resolve) => {
        setTimeout(() => {
          loadedFiles++;
          const progress = (loadedFiles / totalFiles) * 100;
          progressBar.style.width = `${progress}%`;
          loadingItems.textContent = `${loadedFiles} of ${totalFiles} File Loaded: ${fileName}`;
          resolve();
        }, Math.random() * 1000 + 500);
      });

    const startLoading = async () => {
      try {
        for (const file of files) {
          await loadFile(file);
        }
        loadingItems.textContent = "Almost There...";
        await new Promise((resolve) => setTimeout(resolve, 2000));
        loadingScreen.style.display = "none";
        document.getElementById("userInput")?.focus();
      } catch (error) {
        console.error("Loading failed:", error);
        loadingItems.innerHTML = `
          <span style="color: red">Error loading:</span> ${error.message}<br>
          <button onclick="location.reload()">Retry</button>
        `;
        progressBar.style.backgroundColor = "red";
      }
    };

    startLoading();
  };

  setTimeout(startLoadingSequence, 50);
});

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("userInput");
  const outputDiv = document.getElementById("output");
  const terminal = document.querySelector(".terminal");
  const cursor = document.querySelector(".blinking-cursor");
  let charWidth = 8.5; // Default monospace character width

  if (!inputField || !outputDiv || !terminal) {
    console.error("Critical elements missing from DOM");
    return;
  }

  // Calculate character width
  const measureCharWidth = () => {
    const temp = document.createElement("span");
    temp.textContent = "M";
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.fontFamily = "monospace";
    temp.style.fontSize = getComputedStyle(inputField).fontSize;
    document.body.appendChild(temp);
    charWidth = temp.offsetWidth;
    document.body.removeChild(temp);
  };

  // Update cursor position
  const updateCursor = () => {
    const text = inputField.value;
    cursor.style.left = `${text.length * charWidth}px`;
  };

  // Initialize measurements
  measureCharWidth();
  window.addEventListener("resize", measureCharWidth);

  // Command handler definitions
  const commands = {
    help: () => {
      const helpContent = document.createElement("div");
      helpContent.style.fontFamily = "monospace";
      helpContent.style.whiteSpace = "pre-wrap";

      const title = document.createElement("b");
      title.textContent = "Help\n";
      helpContent.appendChild(title);

      const content = document.createTextNode(
        "M1SH is just like BASH except much more simple.\n\n" +
          "• Type ls to list directory contents\n" +
          "• Type cd to change directory\n" +
          "• Type cls to clear the terminal screen\n" +
          "• Use ↑/↓ keys to scroll\n"
      );

      helpContent.appendChild(content);
      return helpContent;
    },
    ls: () => {
      const container = document.createElement("div");
      ["about", "work", "social", "contact"].forEach((item) => {
        const link = document.createElement("span");
        link.textContent = `--${item} `;
        link.style.cursor = "pointer";
        link.onclick = () => commands[item]();
        container.appendChild(link);
      });
      return container;
    },
    cd: (cmd) => `Changing directory to: ${cmd.split(" ")[1] || "/"}`,
    about: () => {
      window.location.href = "./public/about.html";
    },
    work: () => {
      window.location.href = "./public/work.html";
    },
    social: () => {
      window.location.href = "./public/social.html";
    },
    contact: () => {
      window.location.href = "mailto:erfanhusaini@m1h4.com";
      return "Launching email client...";
    },
    cls: () => {
      outputDiv.innerHTML = "";
      return null;
    },
    default: (cmd) => `Command not found: ${cmd}. Type 'help' for commands.`,
  };

  // Input handling
  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputText = inputField.value.trim();
      if (inputText) processCommand(inputText);
      inputField.value = "";
      updateCursor();
    }
  });

  inputField.addEventListener("input", () => {
    updateCursor();
    inputField.style.width = `${inputField.value.length * charWidth + 2}px`;
  });

  // Terminal scrolling via arrow keys
  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const scrollAmount = 50;
      terminal.scrollTop += e.key === "ArrowUp" ? -scrollAmount : scrollAmount;
    }
  });

  // Disable scrollwheel scrolling in terminal (desktop only)
  terminal.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  function processCommand(command) {
    const handler = commands[command.toLowerCase()] || commands.default;
    const response = handler(command);

    if (response instanceof Node) {
      appendCommandOutput(command, response);
    } else if (typeof response === "string") {
      appendTextOutput(command, response);
    }

    scrollToBottom();
    inputField.focus();
  }

  // Output management
  function appendCommandOutput(command, responseNode) {
    const commandLine = document.createElement("p");
    commandLine.textContent = `USER:~$ ${command}`;
    outputDiv.append(commandLine, responseNode);
  }

  function appendTextOutput(command, responseText) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
            <p>USER:~$ ${command}</p>
            <div>${responseText}</div>
        `;
    outputDiv.appendChild(wrapper);
  }

  function scrollToBottom() {
    terminal.scrollTo({
      top: terminal.scrollHeight,
      behavior: "smooth",
    });
  }

  // Initial focus
  inputField.focus();
});

const allTopics = [
  "Input/Output", "Variables", "Data Types", "Operators",
  "Conditions", "Loops", "Arrays", "Matrices",
  "Functions", "Strings", "Patterns", "Logical Thinking"
];

const topicVideos = {
  "Input/Output": "https://www.youtube.com/watch?v=i12SONAAuqk",
  "Variables": "https://www.youtube.com/watch?v=i12SONAAuqk"
};

const topicDocs = {
  "Variables": "https://www.geeksforgeeks.org/variables-in-c/",
  "Data Types": "https://www.geeksforgeeks.org/data-types-in-c/",
  "Input/Output": "https://www.geeksforgeeks.org/basic-input-and-output-in-c/",
  "Operators": "https://www.geeksforgeeks.org/operators-in-c/",
  "Conditions": "https://www.geeksforgeeks.org/decision-making-c-cpp/",
  "Loops": "https://www.geeksforgeeks.org/c-loops/",
  "Arrays": "https://www.geeksforgeeks.org/c-arrays/",
  "Matrices": "https://www.geeksforgeeks.org/multidimensional-arrays-in-c/",
  "Functions": "https://www.geeksforgeeks.org/c-functions/",
  "Strings": "https://www.geeksforgeeks.org/strings-in-c/",
  "Patterns": "https://www.geeksforgeeks.org/pattern-programs-in-c/",
  "Logical Thinking": "#"
};

const ojLogos = {
  "Codeforce": "../media/img/Codeforces_logo.png",
  "Beecrowd": "../media/img/beecrowdLogo.png"
};

function generateProblemHTML(p) {
  const topicButtons = p.topics.map(topic => {
    const docURL = topicDocs[topic] || "#";
    return `<a href="${docURL}" target="_blank" class="topic-button" title="Go to documentation">${topic}</a>`;
  }).join("");

  const metaTag = p.difficulty ? `
    <span class="difficulty-tag">
      <img src="../media/img/icons8-fire.gif" alt="fire" class="fire-icon">
      ${p.difficulty}
    </span>` : "";

  let ojTag = "";
  if (p.oj && ojLogos[p.oj]) {
    const height = p.oj === "Beecrowd" ? "3" : "1";
    ojTag = `<img class="oj-tag-logo" src="${ojLogos[p.oj]}" alt="${p.oj}" title="${p.oj}" style="max-height: ${height}rem">`;
  }

  return `
    <div class="problem">
      <div class="problem-body">
        <div class="problem-left">
          <div class="problem-number">Problem ${p.number}:
            ${p.problemID ? `<button class="problem-id-btn">bee - ${p.problemID}</button>` : ""}
          </div>
          
          <div class="problem-title">${p.title}</div>
          <div class="problem-description">${p.description}</div>
          <div class="problem-meta">${metaTag}</div>
          <div class="problem-topics">${topicButtons}</div>
        </div>
        <div class="problem-right">
          ${ojTag}
        </div>
      </div>
      <div class="analysis-button-container">
        ${p.problemLink ? `<a href="${p.problemLink}" target="_blank" class="solve-button"><span class="solve-hint">💡 Try to Solve</span></a>` : ""}
        ${p.video ? `<a href="${p.video}" target="_blank" class="analysis-button">🎥 Analysis Video</a>` : ""}
      </div>
    </div>`;
}

function loadProblemsForTopic(topic, targetEl, source) {
  fetch(`${source}/problemList.json`)
    .then(res => res.json())
    .then(data => {
      const topicProblems = data.filter(p =>
        p.topics && Array.isArray(p.topics) &&
        p.topics.map(t => t.toLowerCase()).includes(topic.toLowerCase())
      );

      if (topicProblems.length === 0) {
        targetEl.innerHTML = `<p style="color:gray; padding: 10px 0;">No problems found.</p>`;
        return;
      }

      targetEl.innerHTML = `<div class="problem-grid">
  ${topicProblems.map(p => generateProblemHTML(p)).join('')}
</div>`;
      targetEl.closest('.topic-content').style.maxHeight = targetEl.closest('.topic-content').scrollHeight + 'px';
    });
}

function renderAllTopics() {
  const container = document.getElementById("all-topics");

  allTopics.forEach(topic => {
    const topicBlock = document.createElement("div");
    topicBlock.className = "topic-section";
    const safeId = topic.replace(/\s+/g, '-').toLowerCase();

    topicBlock.innerHTML = `
      <button class="toggle-topic">${topic}</button>
      <div class="topic-content" id="content-${safeId}" style="display: none; max-height: 0; overflow: hidden; transition: max-height 0.5s ease, opacity 0.5s ease; opacity: 0;">
        <h4>Lecture Video: </h4>
        <div class="video-container">
          <iframe
            src=""
            class="topic-video"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <h4>Online Problems: </h4>
        <div class="topic-problems" id="online-${safeId}">Loading...</div>
        <h4>Offline Problems: </h4>
        <div class="topic-problems" id="offline-${safeId}">Loading...</div>
      </div>
    `;

    const button = topicBlock.querySelector(".toggle-topic");
    const content = topicBlock.querySelector(".topic-content");
    const iframe = content.querySelector("iframe");

    button.addEventListener("click", () => {
      const allSections = document.querySelectorAll(".topic-content");
      allSections.forEach(sec => {
        if (sec !== content) {
          sec.style.maxHeight = null;
          sec.style.opacity = 0;
          setTimeout(() => sec.style.display = "none", 500);
        }
      });

      const isOpen = content.style.display === "block" && content.style.maxHeight !== "0px";

      if (!isOpen) {
        content.style.display = "block";
        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.opacity = 1;
        });

        const youtubeURL = topicVideos[topic];
        if (youtubeURL) {
          const embedURL = youtubeURL.replace("watch?v=", "embed/") + "?autoplay=0";
          iframe.src = embedURL;
        } else {
          iframe.style.display = "none";
        }

        loadProblemsForTopic(topic, document.getElementById(`online-${safeId}`), '../online');
        loadProblemsForTopic(topic, document.getElementById(`offline-${safeId}`), '../offline');

        // scroll to top of this topic
        topicBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        content.style.maxHeight = null;
        content.style.opacity = 0;
        setTimeout(() => content.style.display = "none", 500);
      }
    });

    container.appendChild(topicBlock);
  });
}

window.onload = renderAllTopics;

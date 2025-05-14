
let problems = []; // Global problem list
let selectedTopic = "All"; // Default selected topic

const coreTopics = [
    "All", "Basic", "Operators",
    "Conditions", "Loops", "Arrays",
    "Strings", "Math", "Geometry", "Ad-Hoc"
];

function getProblemsByCoreTopic(topic) {
    if (topic === "All") return problems;

    return problems.filter(p => {
        const keywords = p.topics.map(t => t.toLowerCase());
        switch (topic) {
            
            case "Basic":
                return keywords.includes("basic");
            case "Operators":
                return keywords.includes("operators");
            case "Conditions":
                return keywords.includes("conditions");
            case "Loops":
                return keywords.includes("loops");
            case "Arrays":
                return keywords.includes("arrays");
            case "Strings":
                return keywords.includes("strings");
            case "Math":
                return keywords.includes("math");
            case "Geometry":
                return keywords.includes("geometry");
            case "Ad-Hoc":
                return keywords.includes("ad-hoc");
            default:
                return false;
        }
    });
}

function renderTopicButtons() {
    const container = document.getElementById("topic-buttons");
    container.innerHTML = "";

    coreTopics.forEach(topic => {
        const button = document.createElement("button");
        button.textContent = topic;
        button.className = "topic-button";
        if (topic === selectedTopic) {
            button.classList.add("selected");
        }
        button.onclick = () => {
            selectedTopic = topic;
            renderProblems(getProblemsByCoreTopic(topic));
            renderTopicButtons();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        container.appendChild(button);
    });
}
const topicDocs = {
    
    "Basic": "https://www.geeksforgeeks.org/basic-input-and-output-in-c/",
    "Operators": "https://www.geeksforgeeks.org/operators-in-c/",
    "Conditions": "https://www.geeksforgeeks.org/decision-making-c-cpp/",
    "Loops": "https://www.geeksforgeeks.org/c-loops/",
    "Arrays": "https://www.geeksforgeeks.org/c-arrays/",
    "Strings": "https://www.geeksforgeeks.org/strings-in-c/",
    "Math": "https://www.geeksforgeeks.org/c-library-math-h-functions/",
    "Geometry": "https://www.geeksforgeeks.org/c-cpp-programs-for-geometric-algorithms/",
    "Ad-Hoc": "https://www.geeksforgeeks.org/multidimensional-arrays-in-c/",
};

// Handle Problem Number Search
document.getElementById("problem-search").addEventListener("input", function () {
    const query = this.value.trim();
    if (!query) {
        renderProblems(getProblemsByCoreTopic(selectedTopic));
        return;
    }
    const result = problems.filter(p => p.number == query);
    renderProblems(result);
});


function renderProblems(problemListData) {
    const problemList = document.getElementById("problem-list");
    problemList.innerHTML = "";

    // ✅ Show message if no problems match
    if (problemListData.length === 0) {
        problemList.innerHTML = `<div style="padding: 20px; color: red; text-align: center; font-weight: bold;">
            ❌ No problem found
        </div>`;
        return; // ⛔ Stop further execution
    }

    problemListData.forEach(problem => {
        const problemDiv = document.createElement("div");
        problemDiv.className = "problem";

        const topicButtons = problem.topics.map(topic => {
            const docURL = topicDocs[topic] || "#";
            const isSelected = topic === selectedTopic ? "selected" : "";
            return `
              <a href="${docURL}" target="_blank" 
                 class="topic-button ${isSelected}" 
                 title="Go to documentation">
                ${topic}
              </a>
            `;

        }).join("");

        let metaTag = "";
        if (problem.difficulty) {
            metaTag = `<span class="difficulty-tag">
  <img src="../media/img/icons8-fire.gif" alt="fire" class="fire-icon">
  ${problem.difficulty}
</span>`;

        }
        const ojLogos = {
            "Codeforce": "../media/img/Codeforces_logo.png",
            "Beecrowd": "../media/img/beecrowdLogo.png",
            // add more as needed
        };


        let ojTag = "";
        if (problem.oj && ojLogos[problem.oj]) {
            const height = problem.oj === "Beecrowd" ? "3" : "1";
            ojTag = `<img class="oj-tag-logo" src="${ojLogos[problem.oj]}" alt="${problem.oj}" title="${problem.oj}" style="max-height: ${height}rem">`;
        }



        problemDiv.innerHTML = `
  <div class="problem-body">
    <div class="problem-left">
      <div class="problem-number">
  Problem ${problem.number}
  ${problem.problemID ? `<button class="problem-id-btn">Problem ID - ${problem.problemID}</button>` : ""}
</div>

      <div class="problem-title">${problem.title}</div>
      ${problem.description ? `<div class="problem-description">${problem.description}</div>` : ""}
      <div class="problem-meta">${metaTag}</div>
      <div class="problem-topics">${topicButtons}</div>
      </div>
      <div class="problem-right">
      ${ojTag}
      </div>
      </div>
      <div class="analysis-button-container">
  <a href="${problem.problemLink}" target="_blank" class="solve-button">
 <span class="solve-hint">💡 Try to Solve</span>
</a>

  <a href="${problem.video}" target="_blank" class="analysis-button">🎥 Analysis Video</a>
</div>

`;






        problemList.appendChild(problemDiv);
    });


    // Add click events to inner topic buttons
    document.querySelectorAll('.inner-topic').forEach(button => {
        button.addEventListener('click', (e) => {
            selectedTopic = e.target.getAttribute('data-topic');
            renderProblems(getProblemsByCoreTopic(selectedTopic));
            renderTopicButtons();
        });
    });
}

// Load JSON and initialize app
fetch('problemList.json')
    .then(response => response.json())
    .then(data => {
        problems = data; // ✅ Save to global
        renderTopicButtons();         // ✅ Render buttons only once
        renderProblems(problems);     // ✅ Show all problems initially
    })
    .catch(error => console.error('Failed to load problemList.json:', error));

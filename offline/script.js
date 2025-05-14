
let problems = []; // Global problem list
let selectedTopic = "All"; // Default selected topic

const coreTopics = [
    "All", "Input/Output", "Variables", "Data Types", "Operators",
    "Conditions", "Loops", "Arrays", "Matrices",
    "Functions", "Strings", "Patterns", "Logical Thinking"
];

function getProblemsByCoreTopic(topic) {
    if (topic === "All") return problems;

    return problems.filter(p => {
        const keywords = p.topics.map(t => t.toLowerCase());
        switch (topic) {
            case "Variables":
                return keywords.includes("variables");
            case "Data Types":
                return keywords.includes("data types");
            case "Input/Output":
                return keywords.includes("input/output");
            case "Operators":
                return keywords.includes("operators");
            case "Conditions":
                return keywords.includes("conditions");
            case "Loops":
                return keywords.includes("loops");
            case "Arrays":
                return keywords.includes("arrays");
            case "Matrices":
                return keywords.includes("matrices");
            case "Functions":
                return keywords.includes("functions");
            case "Strings":
                return keywords.includes("strings");
            case "Patterns":
                return keywords.includes("patterns");
            case "Logical Thinking":
                return keywords.includes("logical thinking");
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

        problemDiv.innerHTML = `
        <div class="problem-number">Problem ${problem.number}:</div>
        <div class="problem-title">${problem.title}</div>
        <div class="problem-description">${problem.description}</div>
        <div class="problem-topics">${topicButtons}</div>
        <div class="analysis-button-container">
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



const container = document.getElementById('telegram-container');
const popup = document.getElementById('telegram-popup');

window.addEventListener('load', () => {
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
});

container.addEventListener('mouseenter', () => {
    popup.style.display = 'block';
});

container.addEventListener('mouseleave', () => {
    popup.style.display = 'none';
});


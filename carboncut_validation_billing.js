// CARBONCUT JavaScript Form Validation (onsubmit & oninput), Billing & CRUD Array

const UNIT_PRICES = {
  solar: 300,     // Rs. 300 per tonne CO2e
  forest: 200,    // Rs. 200 per tonne CO2e
  mangrove: 250,  // Rs. 250 per tonne CO2e
  biochar: 350    // Rs. 350 per tonne CO2e
};

let latestBillSummary = "6 Tonnes CO2e Verified Offset Portfolio — Total Rs. 1650";

// Real-time oninput field validation
function validateSingleField(fieldId) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(fieldId + "Error");
  input.classList.remove("input-error");
  errEl.textContent = "";

  if (fieldId === "orgName") {
    const val = input.value.trim();
    if (val.length === 0) {
      errEl.textContent = "Organization or buyer name is required.";
      input.classList.add("input-error");
      return false;
    } else if (!/^[A-Za-z0-9\s.&'-]{2,60}$/.test(val)) {
      errEl.textContent = "Enter 2–60 valid letters, numbers, or spaces.";
      input.classList.add("input-error");
      return false;
    }
    return true;
  } else {
    const raw = input.value.trim();
    const num = Number(raw);
    if (raw === "" || !Number.isInteger(num) || num < 0 || num > 1000) {
      errEl.textContent = "Enter a whole number between 0 and 1000.";
      input.classList.add("input-error");
      return false;
    }
    return true;
  }
}

// Form onsubmit validation & total price calculation
function validateAndBillOrder(event) {
  event.preventDefault();

  const vOrg = validateSingleField("orgName");
  const vSolar = validateSingleField("qtySolar");
  const vForest = validateSingleField("qtyForest");
  const vMangrove = validateSingleField("qtyMangrove");
  const vBiochar = validateSingleField("qtyBiochar");

  if (!vOrg || !vSolar || !vForest || !vMangrove || !vBiochar) {
    return false;
  }

  const qSolar = Number(document.getElementById("qtySolar").value);
  const qForest = Number(document.getElementById("qtyForest").value);
  const qMangrove = Number(document.getElementById("qtyMangrove").value);
  const qBiochar = Number(document.getElementById("qtyBiochar").value);

  const totalTonnes = qSolar + qForest + qMangrove + qBiochar;
  if (totalTonnes <= 0) {
    const errEl = document.getElementById("qtySolarError");
    errEl.textContent = "Select at least 1 tonne CO₂e across any reduction package.";
    document.getElementById("qtySolar").classList.add("input-error");
    return false;
  }

  const totalRs =
    (qSolar * UNIT_PRICES.solar) +
    (qForest * UNIT_PRICES.forest) +
    (qMangrove * UNIT_PRICES.mangrove) +
    (qBiochar * UNIT_PRICES.biochar);

  const buyer = document.getElementById("orgName").value.trim();
  latestBillSummary = `${buyer}: ${totalTonnes} Tonnes CO₂e (${qSolar} Solar, ${qForest} Forest, ${qMangrove} Mangrove, ${qBiochar} Biochar)`;

  document.getElementById("billSummaryLine").textContent = latestBillSummary;
  document.getElementById("totalBillAmount").textContent = `Rs. ${totalRs}`;
  return false;
}

function logOrderToChecklist() {
  const totalTxt = document.getElementById("totalBillAmount").textContent;
  reductionTasks.unshift({
    id: Date.now(),
    text: `Retire ${latestBillSummary} [${totalTxt}]`,
    done: false
  });
  saveTasks();
  renderTasks();
  document.getElementById("crud-checklist").scrollIntoView({ behavior: "smooth" });
}

// Carbon Footprint Calculator
function recalcFootprint() {
  const kwh = Number(document.getElementById("elecInput").value);
  const km = Number(document.getElementById("travelInput").value);
  const ops = Number(document.getElementById("opsProfile").value);

  document.getElementById("elecDisp").textContent = kwh;
  document.getElementById("travelDisp").textContent = km;

  const monthlyKg = Math.round((kwh * 0.72) + (km * 4.33 * 0.21) + ops);
  const annualTonnes = ((monthlyKg * 12) / 1000).toFixed(2);
  const recTonnes = Math.max(1, Math.round((monthlyKg * 12) / 1000));

  document.getElementById("monthKgOut").textContent = monthlyKg;
  document.getElementById("annualTonnesOut").textContent = annualTonnes;
  document.getElementById("advisorNote").textContent =
    `Recommended Offset: ~${recTonnes} Tonnes CO₂e / year`;
}

// CRUD Task Array
const SAMPLE_MILESTONES = [
  { id: 1, text: "Verify baseline Scope 1–2 electricity & fleet emissions", done: true },
  { id: 2, text: "Retire 6 Tonnes CO2e Verified Offset Portfolio (Rs. 1650)", done: false },
  { id: 3, text: "Switch warehouse lighting to high-efficiency LEDs", done: false }
];

let reductionTasks = JSON.parse(localStorage.getItem("carboncut_bill_tasks_v1")) || [...SAMPLE_MILESTONES];

function saveTasks() {
  localStorage.setItem("carboncut_bill_tasks_v1", JSON.stringify(reductionTasks));
}

// READ
function renderTasks() {
  const ul = document.getElementById("crudTaskList");
  const stats = document.getElementById("crudStats");
  ul.innerHTML = "";

  const doneCount = reductionTasks.filter(t => t.done).length;
  stats.textContent = `${doneCount} of ${reductionTasks.length} reduction milestones completed`;

  if (reductionTasks.length === 0) {
    ul.innerHTML = `<li class="cc-task-row"><span>No reduction tasks yet. Add one above!</span></li>`;
    return;
  }

  reductionTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "cc-task-row";
    li.innerHTML = `
      <div class="cc-task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${idx})" />
        <span class="${task.done ? "cc-done" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="cc-row-btns">
        <button type="button" class="cc-mini-btn" onclick="editTask(${idx})">Edit</button>
        <button type="button" class="cc-mini-btn del" onclick="deleteTask(${idx})">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// CREATE (onclick="addTask()")
function addTask() {
  const box = document.getElementById("taskInputBox");
  const val = box.value.trim();
  if (!val) {
    box.focus();
    return;
  }
  reductionTasks.unshift({ id: Date.now(), text: val, done: false });
  box.value = "";
  saveTasks();
  renderTasks();
}

// UPDATE
function toggleTask(idx) {
  reductionTasks[idx].done = !reductionTasks[idx].done;
  saveTasks();
  renderTasks();
}

function editTask(idx) {
  const updated = prompt("Edit carbon reduction milestone:", reductionTasks[idx].text);
  if (updated !== null && updated.trim() !== "") {
    reductionTasks[idx].text = updated.trim();
    saveTasks();
    renderTasks();
  }
}

// DELETE
function deleteTask(idx) {
  reductionTasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}

function resetSamples() {
  reductionTasks = [...SAMPLE_MILESTONES];
  saveTasks();
  renderTasks();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

document.getElementById("taskInputBox").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

recalcFootprint();
renderTasks();

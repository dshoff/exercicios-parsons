const blocks = [
  { id: "declaration", code: "float valor1, valor2, soma;", category: "declaration" },
  { id: "prompt", code: 'printf("Digite dois valores: ");', category: "output" },
  { id: "read", code: 'scanf("%f %f", &valor1, &valor2);', category: "input" },
  { id: "calculate", code: "soma = valor1 + valor2;", category: "processing" },
  { id: "show", code: 'printf("Soma: %.2f\\n", soma);', category: "output" },
  { id: "return", code: "return 0;", category: "termination" }
];

const solution = blocks.map((block) => block.id);
const storageKey = "parsons-soma-v1";
const list = document.querySelector("#code-list");
const feedback = document.querySelector("#feedback");
const attemptsLabel = document.querySelector("#attempts");
const checkButton = document.querySelector("#check-button");
const undoButton = document.querySelector("#undo-button");
const restartButton = document.querySelector("#restart-button");
const result = document.querySelector("#result");
const solutionCode = document.querySelector("#solution-code");

let state = loadState();
let history = [];
let activeCard = null;
let activePointerId = null;

function shuffledIds() {
  let ids;
  do {
    ids = [...solution];
    for (let index = ids.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[randomIndex]] = [ids[randomIndex], ids[index]];
    }
  } while (ids.every((id, index) => id === solution[index]));
  return ids;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const validOrder = Array.isArray(saved?.order)
      && saved.order.length === solution.length
      && solution.every((id) => saved.order.includes(id));
    if (validOrder) {
      return {
        order: saved.order,
        locked: Array.isArray(saved.locked) ? saved.locked.filter((id) => solution.includes(id)) : [],
        attempts: Number.isInteger(saved.attempts) ? saved.attempts : 0,
        complete: Boolean(saved.complete)
      };
    }
  } catch (_) {
    // Um estado corrompido simplesmente inicia uma nova tentativa.
  }
  return { order: shuffledIds(), locked: [], attempts: 0, complete: false };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function blockById(id) {
  return blocks.find((block) => block.id === id);
}

function render() {
  list.replaceChildren();
  state.order.forEach((id, index) => {
    const block = blockById(id);
    const locked = state.locked.includes(id);
    const item = document.createElement("li");
    item.className = `code-block${locked ? " correct" : ""}`;
    item.dataset.id = id;
    item.setAttribute("aria-label", `Bloco ${index + 1}: ${block.code}${locked ? ". Posição correta." : ""}`);

    const handle = document.createElement("button");
    handle.className = "drag-handle";
    handle.type = "button";
    handle.disabled = locked || state.complete;
    handle.setAttribute("aria-label", `Arrastar bloco: ${block.code}`);
    handle.textContent = "⠿";
    handle.addEventListener("pointerdown", startDrag);

    const code = document.createElement("span");
    code.className = "code-text";
    code.textContent = block.code;

    const controls = document.createElement("span");
    controls.className = "block-controls";
    const up = moveButton("↑", "Mover para cima", -1, id);
    const down = moveButton("↓", "Mover para baixo", 1, id);
    controls.append(up, down);
    item.append(handle, code, controls);

    if (locked) {
      const mark = document.createElement("span");
      mark.className = "correct-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✓";
      item.append(mark);
    }
    list.append(item);
  });

  attemptsLabel.textContent = `Tentativas: ${state.attempts}`;
  undoButton.disabled = history.length === 0 || state.complete;
  checkButton.disabled = state.complete;
  if (state.complete) showResult();
  updateMoveButtons();
  saveState();
}

function moveButton(symbol, label, direction, id) {
  const button = document.createElement("button");
  button.className = "move-button";
  button.type = "button";
  button.textContent = symbol;
  button.setAttribute("aria-label", `${label}: ${blockById(id).code}`);
  button.addEventListener("click", () => moveBy(id, direction));
  return button;
}

function updateMoveButtons() {
  const movableIds = state.order.filter((id) => !state.locked.includes(id));
  [...list.children].forEach((item) => {
    const locked = state.locked.includes(item.dataset.id) || state.complete;
    const movableIndex = movableIds.indexOf(item.dataset.id);
    const [up, down] = item.querySelectorAll(".move-button");
    up.disabled = locked || movableIndex <= 0;
    down.disabled = locked || movableIndex === -1 || movableIndex >= movableIds.length - 1;
  });
}

function registerMove() {
  history.push([...state.order]);
  if (history.length > 20) history.shift();
}

function moveBy(id, direction) {
  if (state.locked.includes(id)) return;
  const movableIds = state.order.filter((itemId) => !state.locked.includes(itemId));
  const from = movableIds.indexOf(id);
  const to = from + direction;
  if (to < 0 || to >= movableIds.length) return;
  registerMove();
  [movableIds[from], movableIds[to]] = [movableIds[to], movableIds[from]];
  state.order = rebuildWithLockedSlots(movableIds);
  clearPartialFeedback();
  render();
  list.querySelector(`[data-id="${id}"] .drag-handle`).focus();
}

function rebuildWithLockedSlots(movableIds) {
  const remaining = [...movableIds];
  return solution.map((solutionId) => (
    state.locked.includes(solutionId) ? solutionId : remaining.shift()
  ));
}

function startDrag(event) {
  const card = event.currentTarget.closest(".code-block");
  if (state.locked.includes(card.dataset.id) || state.complete) return;
  activeCard = card;
  activePointerId = event.pointerId;
  registerMove();
  event.currentTarget.setPointerCapture(event.pointerId);
  card.classList.add("dragging");
  document.body.style.userSelect = "none";
  event.currentTarget.addEventListener("pointermove", dragMove);
  event.currentTarget.addEventListener("pointerup", endDrag, { once: true });
  event.currentTarget.addEventListener("pointercancel", endDrag, { once: true });
}

function dragMove(event) {
  if (!activeCard || event.pointerId !== activePointerId) return;
  event.preventDefault();
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".code-block");
  if (!target || target === activeCard || state.locked.includes(target.dataset.id)) return;

  const targetRect = target.getBoundingClientRect();
  const placeAfter = event.clientY > targetRect.top + targetRect.height / 2;
  list.insertBefore(activeCard, placeAfter ? target.nextSibling : target);
}

function endDrag(event) {
  if (!activeCard || event.pointerId !== activePointerId) return;
  event.currentTarget.removeEventListener("pointermove", dragMove);
  activeCard.classList.remove("dragging");
  const movableIds = [...list.children]
    .map((item) => item.dataset.id)
    .filter((id) => !state.locked.includes(id));
  state.order = rebuildWithLockedSlots(movableIds);
  activeCard = null;
  activePointerId = null;
  document.body.style.userSelect = "";
  clearPartialFeedback();
  render();
}

function clearPartialFeedback() {
  if (feedback.classList.contains("partial")) {
    feedback.className = "feedback neutral";
    feedback.innerHTML = "Ordem alterada. Clique em <strong>Verificar</strong> novamente.";
  }
}

function verify() {
  state.attempts += 1;
  state.locked = state.order.filter((id, index) => id === solution[index]);
  state.complete = state.locked.length === solution.length;

  if (state.complete) {
    feedback.className = "feedback success";
    feedback.innerHTML = `<strong>Programa correto.</strong> Você ordenou os ${solution.length} blocos em ${state.attempts} ${state.attempts === 1 ? "tentativa" : "tentativas"}.`;
  } else {
    feedback.className = "feedback partial";
    feedback.innerHTML = `<strong>${state.locked.length} de ${solution.length} blocos estão corretos.</strong> Os blocos marcados foram bloqueados; reorganize os demais.`;
  }
  render();
}

function undo() {
  const previous = history.pop();
  if (!previous) return;
  state.order = previous;
  clearPartialFeedback();
  render();
}

function restart() {
  state = { order: shuffledIds(), locked: [], attempts: 0, complete: false };
  history = [];
  feedback.className = "feedback neutral";
  feedback.innerHTML = "Nova ordem criada. Organize os seis blocos e clique em <strong>Verificar</strong>.";
  result.hidden = true;
  render();
}

function showResult() {
  solutionCode.replaceChildren();
  const fixedStart = ["#include <stdio.h>", "", "int main(void)", "{"];
  fixedStart.forEach((text) => addSolutionLine(text));
  blocks.forEach((block) => addSolutionLine(`    ${block.code}`, block.category));
  addSolutionLine("}");
  result.hidden = false;
}

function addSolutionLine(text, category = "") {
  const line = document.createElement("div");
  line.className = `solution-line ${category}`.trim();
  line.textContent = text || "\u00a0";
  solutionCode.append(line);
}

checkButton.addEventListener("click", verify);
undoButton.addEventListener("click", undo);
restartButton.addEventListener("click", restart);
render();

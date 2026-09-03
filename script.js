const exercises = [
  {
    id: "sum",
    shortTitle: "Soma",
    title: "Soma de dois valores",
    prompt: "Organize as instruções para ler dois valores reais, calcular a soma e apresentar o resultado.",
    startLines: ["#include <stdio.h>", "int main(void){"],
    blocks: [
      { id: "declare", code: "    float parcelaA, parcelaB, total;", category: "declaration", comment: "declara os dois valores de entrada e o resultado" },
      { id: "prompt", code: "    printf(\"Digite dois valores: \");", category: "output", comment: "solicita os valores ao usuário" },
      { id: "read", code: "    scanf(\"%f %f\", &parcelaA, &parcelaB);", category: "input", comment: "armazena os dois valores informados" },
      { id: "calculate", code: "    total = parcelaA + parcelaB;", category: "processing", comment: "calcula a soma" },
      { id: "show", code: "    printf(\"Soma: %.2f\\n\", total);", category: "output", comment: "apresenta o resultado com duas casas decimais" },
      { id: "return", code: "    return 0;", category: "termination", comment: "encerra o programa indicando execução bem-sucedida" }
    ],
    closingComment: "encerra a função main",
    traceInput: "Entrada simulada: parcelaA = 4,5 e parcelaB = 2,0",
    trace: [
      { line: 1, heading: "Início da função", description: "A execução entra na função principal.", vars: {}, output: "" },
      { line: 2, heading: "Declaração", description: "As três variáveis reais são criadas, ainda sem valores definidos.", vars: { parcelaA: "—", parcelaB: "—", total: "—" }, output: "" },
      { line: 3, heading: "Solicitação", description: "O programa pede dois valores.", vars: { parcelaA: "—", parcelaB: "—", total: "—" }, output: "Digite dois valores:" },
      { line: 4, heading: "Entrada", description: "Os valores simulados são armazenados nas variáveis.", vars: { parcelaA: "4,5", parcelaB: "2,0", total: "—" }, output: "Digite dois valores:" },
      { line: 5, heading: "Processamento", description: "A expressão 4,5 + 2,0 é calculada.", vars: { parcelaA: "4,5", parcelaB: "2,0", total: "6,5" }, output: "Digite dois valores:" },
      { line: 6, heading: "Saída", description: "O valor de total é apresentado.", vars: { parcelaA: "4,5", parcelaB: "2,0", total: "6,5" }, output: "Digite dois valores: Soma: 6.50" },
      { line: 7, heading: "Término", description: "A função devolve zero e o programa termina.", vars: { parcelaA: "4,5", parcelaB: "2,0", total: "6,5" }, output: "Digite dois valores: Soma: 6.50" }
    ]
  },
  {
    id: "loop",
    shortTitle: "Repetição",
    title: "Cinco múltiplos de um número",
    prompt: "Organize o programa para ler um inteiro e apresentar seus cinco primeiros múltiplos usando um laço for.",
    startLines: ["#include <stdio.h>", "int main(void){"],
    blocks: [
      { id: "declare", code: "    int numero, multiplicador;", category: "declaration", comment: "declara o número lido e o controle do laço" },
      { id: "prompt", code: "    printf(\"Digite um numero inteiro: \");", category: "output", comment: "solicita um número inteiro" },
      { id: "read", code: "    scanf(\"%d\", &numero);", category: "input", comment: "armazena o número informado" },
      { id: "loop-open", code: "    for(multiplicador=1; multiplicador<=5; multiplicador++){", category: "control", comment: "repete o bloco para os multiplicadores de 1 a 5" },
      { id: "show", code: "        printf(\"%d x %d = %d\\n\", numero, multiplicador, numero*multiplicador);", category: "output", comment: "calcula e apresenta o múltiplo da iteração" },
      { id: "loop-close", code: "    }", category: "control", comment: "encerra o bloco controlado pelo for" },
      { id: "return", code: "    return 0;", category: "termination", comment: "encerra o programa indicando execução bem-sucedida" }
    ],
    closingComment: "encerra a função main",
    traceInput: "Entrada simulada: numero = 3",
    trace: buildLoopTrace(3)
  }
];

const storageKey = "parsons-c-v3";
const states = loadStates();
let activeExerciseIndex = 0;
let history = [];
let activeCard = null;
let activePointerId = null;
let traceIndex = 0;

const nav = document.querySelector("#exercise-nav");
const numberLabel = document.querySelector("#exercise-number");
const title = document.querySelector("#exercise-title");
const prompt = document.querySelector("#exercise-prompt");
const attemptsLabel = document.querySelector("#attempts");
const fixedStart = document.querySelector("#fixed-start");
const list = document.querySelector("#code-list");
const feedback = document.querySelector("#feedback");
const checkButton = document.querySelector("#check-button");
const undoButton = document.querySelector("#undo-button");
const restartButton = document.querySelector("#restart-button");
const result = document.querySelector("#result");
const solutionCode = document.querySelector("#solution-code");
const codeView = document.querySelector("#code-view");
const traceView = document.querySelector("#trace-view");
const traceCode = document.querySelector("#trace-code");
const traceInput = document.querySelector("#trace-input");
const traceProgress = document.querySelector("#trace-progress");
const traceHeading = document.querySelector("#trace-heading");
const traceDescription = document.querySelector("#trace-description");
const traceVariables = document.querySelector("#trace-variables");
const traceOutput = document.querySelector("#trace-output");
const previousButton = document.querySelector("#trace-previous");
const nextButton = document.querySelector("#trace-next");

function buildLoopTrace(number) {
  const trace = [
    { line: 1, heading: "Início da função", description: "A execução entra na função principal.", vars: {}, output: "" },
    { line: 2, heading: "Declaração", description: "As variáveis inteiras são criadas.", vars: { numero: "—", multiplicador: "—" }, output: "" },
    { line: 3, heading: "Solicitação", description: "O programa pede um número inteiro.", vars: { numero: "—", multiplicador: "—" }, output: "Digite um numero inteiro:" },
    { line: 4, heading: "Entrada", description: "O valor " + number + " é armazenado em numero.", vars: { numero: String(number), multiplicador: "—" }, output: "Digite um numero inteiro:" }
  ];
  let output = "Digite um numero inteiro:";
  for (let iteration = 1; iteration <= 5; iteration += 1) {
    trace.push({
      line: 5,
      heading: "Iteração " + iteration + " de 5 — teste do for",
      description: "multiplicador recebe " + iteration + "; a condição " + iteration + " <= 5 é verdadeira.",
      vars: { numero: String(number), multiplicador: String(iteration) },
      output: output
    });
    output += "\n" + number + " x " + iteration + " = " + (number * iteration);
    trace.push({
      line: 6,
      heading: "Iteração " + iteration + " de 5 — corpo do laço",
      description: number + " × " + iteration + " é calculado e apresentado.",
      vars: { numero: String(number), multiplicador: String(iteration) },
      output: output
    });
  }
  trace.push({
    line: 5,
    heading: "Teste final do for",
    description: "Após o último incremento, multiplicador vale 6. Como 6 <= 5 é falso, o laço termina.",
    vars: { numero: String(number), multiplicador: "6" },
    output: output
  });
  trace.push({
    line: 8,
    heading: "Término",
    description: "A função devolve zero e o programa termina.",
    vars: { numero: String(number), multiplicador: "6" },
    output: output
  });
  return trace;
}

function currentExercise() {
  return exercises[activeExerciseIndex];
}

function currentState() {
  return states[currentExercise().id];
}

function solutionIds(exercise) {
  const selected = exercise || currentExercise();
  return selected.blocks.map(function (block) { return block.id; });
}

function shuffledIds(exercise) {
  const solution = solutionIds(exercise);
  let ids;
  do {
    ids = solution.slice();
    for (let index = ids.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temporary = ids[index];
      ids[index] = ids[randomIndex];
      ids[randomIndex] = temporary;
    }
  } while (ids.every(function (id, index) { return id === solution[index]; }));
  return ids;
}

function freshState(exercise) {
  return { order: shuffledIds(exercise), locked: [], attempts: 0, complete: false };
}

function loadStates() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (_) {
    saved = {};
  }
  const resultStates = {};
  exercises.forEach(function (exercise) {
    const candidate = saved[exercise.id];
    const solution = solutionIds(exercise);
    const valid = Array.isArray(candidate && candidate.order)
      && candidate.order.length === solution.length
      && solution.every(function (id) { return candidate.order.includes(id); });
    resultStates[exercise.id] = valid ? {
      order: candidate.order,
      locked: Array.isArray(candidate.locked) ? candidate.locked.filter(function (id) { return solution.includes(id); }) : [],
      attempts: Number.isInteger(candidate.attempts) ? candidate.attempts : 0,
      complete: Boolean(candidate.complete)
    } : freshState(exercise);
  });
  return resultStates;
}

function saveStates() {
  localStorage.setItem(storageKey, JSON.stringify(states));
}

function renderNavigation() {
  nav.replaceChildren();
  exercises.forEach(function (exercise, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "exercise-button" + (index === activeExerciseIndex ? " active" : "");
    button.setAttribute("aria-current", index === activeExerciseIndex ? "page" : "false");
    const number = document.createElement("span");
    number.textContent = String(index + 1);
    button.append(number, document.createTextNode(exercise.shortTitle + (states[exercise.id].complete ? " ✓" : "")));
    button.addEventListener("click", function () { switchExercise(index); });
    nav.append(button);
  });
}

function switchExercise(index) {
  activeExerciseIndex = index;
  history = [];
  traceIndex = 0;
  renderPage();
  document.querySelector(".activity-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderPage() {
  const exercise = currentExercise();
  const state = currentState();
  renderNavigation();
  numberLabel.textContent = "Exercício " + (activeExerciseIndex + 1) + " de " + exercises.length;
  title.textContent = exercise.title;
  prompt.textContent = exercise.prompt;
  attemptsLabel.textContent = "Tentativas: " + state.attempts;
  fixedStart.textContent = exercise.startLines.join("\n");
  list.replaceChildren();
  state.order.forEach(function (id, index) { list.append(createBlock(id, index)); });
  checkButton.disabled = state.complete;
  undoButton.disabled = history.length === 0 || state.complete;
  feedback.className = "feedback " + (state.complete ? "success" : "neutral");
  feedback.innerHTML = state.complete
    ? "<strong>Programa correto.</strong> Você concluiu em " + state.attempts + " " + (state.attempts === 1 ? "tentativa" : "tentativas") + "."
    : "Organize os " + exercise.blocks.length + " blocos e clique em <strong>Verificar</strong>.";
  result.hidden = !state.complete;
  if (state.complete) {
    setView("plain");
    renderTrace();
  }
  updateMoveButtons();
  saveStates();
}

function createBlock(id, index) {
  const exercise = currentExercise();
  const state = currentState();
  const block = exercise.blocks.find(function (item) { return item.id === id; });
  const locked = state.locked.includes(id);
  const item = document.createElement("li");
  item.className = "code-block" + (locked ? " correct" : "");
  item.dataset.id = id;
  item.tabIndex = -1;
  item.setAttribute("aria-label", "Bloco " + (index + 1) + ": " + block.code.trim() + (locked ? ". Posição correta." : ""));
  item.addEventListener("pointerdown", startDrag);
  const code = document.createElement("span");
  code.className = "code-text";
  code.textContent = block.code;
  const controls = document.createElement("span");
  controls.className = "block-controls";
  controls.append(moveButton("↑", "Mover para cima", -1, id), moveButton("↓", "Mover para baixo", 1, id));
  item.append(code, controls);
  if (locked) {
    const mark = document.createElement("span");
    mark.className = "correct-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "✓";
    item.append(mark);
  }
  return item;
}

function moveButton(symbol, label, direction, id) {
  const button = document.createElement("button");
  const block = currentExercise().blocks.find(function (item) { return item.id === id; });
  button.className = "move-button";
  button.type = "button";
  button.textContent = symbol;
  button.setAttribute("aria-label", label + ": " + block.code.trim());
  button.addEventListener("click", function () { moveBy(id, direction); });
  return button;
}

function updateMoveButtons() {
  const state = currentState();
  const movableIds = state.order.filter(function (id) { return !state.locked.includes(id); });
  Array.from(list.children).forEach(function (item) {
    const locked = state.locked.includes(item.dataset.id) || state.complete;
    const movableIndex = movableIds.indexOf(item.dataset.id);
    const buttons = item.querySelectorAll(".move-button");
    buttons[0].disabled = locked || movableIndex <= 0;
    buttons[1].disabled = locked || movableIndex === -1 || movableIndex >= movableIds.length - 1;
  });
}

function registerMove() {
  history.push(currentState().order.slice());
  if (history.length > 20) history.shift();
}

function rebuildWithLockedSlots(movableIds) {
  const state = currentState();
  const remaining = movableIds.slice();
  return solutionIds().map(function (solutionId) {
    return state.locked.includes(solutionId) ? solutionId : remaining.shift();
  });
}

function moveBy(id, direction) {
  const state = currentState();
  if (state.locked.includes(id)) return;
  const movableIds = state.order.filter(function (itemId) { return !state.locked.includes(itemId); });
  const from = movableIds.indexOf(id);
  const to = from + direction;
  if (to < 0 || to >= movableIds.length) return;
  registerMove();
  const temporary = movableIds[from];
  movableIds[from] = movableIds[to];
  movableIds[to] = temporary;
  state.order = rebuildWithLockedSlots(movableIds);
  renderPage();
  list.querySelector("[data-id=\"" + id + "\"]").focus({ preventScroll: true });
}

function startDrag(event) {
  const state = currentState();
  const card = event.currentTarget;
  if (event.target.closest(".block-controls") || state.locked.includes(card.dataset.id) || state.complete) return;
  activeCard = card;
  activePointerId = event.pointerId;
  registerMove();
  card.setPointerCapture(event.pointerId);
  card.classList.add("dragging");
  card.addEventListener("pointermove", dragMove);
  card.addEventListener("pointerup", endDrag, { once: true });
  card.addEventListener("pointercancel", endDrag, { once: true });
}

function dragMove(event) {
  if (!activeCard || event.pointerId !== activePointerId) return;
  event.preventDefault();
  const state = currentState();
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const targetCard = target && target.closest(".code-block");
  if (!targetCard || targetCard === activeCard || state.locked.includes(targetCard.dataset.id)) return;
  const rect = targetCard.getBoundingClientRect();
  list.insertBefore(activeCard, event.clientY > rect.top + rect.height / 2 ? targetCard.nextSibling : targetCard);
}

function endDrag(event) {
  if (!activeCard || event.pointerId !== activePointerId) return;
  activeCard.removeEventListener("pointermove", dragMove);
  activeCard.classList.remove("dragging");
  const state = currentState();
  const movableIds = Array.from(list.children)
    .map(function (item) { return item.dataset.id; })
    .filter(function (id) { return !state.locked.includes(id); });
  state.order = rebuildWithLockedSlots(movableIds);
  activeCard = null;
  activePointerId = null;
  renderPage();
}

function verify() {
  const state = currentState();
  const solution = solutionIds();
  state.attempts += 1;
  state.locked = state.order.filter(function (id, index) { return id === solution[index]; });
  state.complete = state.locked.length === solution.length;
  history = [];
  renderPage();
  if (!state.complete) {
    feedback.className = "feedback partial";
    feedback.innerHTML = "<strong>" + state.locked.length + " de " + solution.length + " blocos estão corretos.</strong> Os blocos marcados permanecem em suas posições; reorganize os demais.";
  } else {
    renderNavigation();
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  saveStates();
}

function undo() {
  const previous = history.pop();
  if (!previous) return;
  currentState().order = previous;
  renderPage();
}

function restart() {
  states[currentExercise().id] = freshState(currentExercise());
  history = [];
  traceIndex = 0;
  result.hidden = true;
  renderPage();
  feedback.innerHTML = "Nova ordem criada. Organize os " + currentExercise().blocks.length + " blocos e clique em <strong>Verificar</strong>.";
}

function fullCodeLines() {
  const exercise = currentExercise();
  return [
    { code: exercise.startLines[0], category: "control", comment: "disponibiliza as funções printf e scanf" },
    { code: exercise.startLines[1], category: "control", comment: "inicia a função principal sem parâmetros" }
  ].concat(exercise.blocks).concat([
    { code: "}", category: "control", comment: exercise.closingComment }
  ]);
}

function renderSolution(commented) {
  solutionCode.replaceChildren();
  fullCodeLines().forEach(function (line) {
    const element = document.createElement("div");
    element.className = "solution-line " + line.category;
    element.textContent = commented ? line.code + "  // " + line.comment : line.code;
    solutionCode.append(element);
  });
}

function setView(view) {
  ["plain", "commented", "trace"].forEach(function (name) {
    const tab = document.querySelector("#" + name + "-tab");
    const selected = name === view;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  codeView.hidden = view === "trace";
  traceView.hidden = view !== "trace";
  if (view === "plain") renderSolution(false);
  if (view === "commented") renderSolution(true);
  if (view === "trace") renderTrace();
}

function renderTrace() {
  const exercise = currentExercise();
  const step = exercise.trace[traceIndex];
  traceInput.textContent = exercise.traceInput;
  traceCode.replaceChildren();
  fullCodeLines().forEach(function (line, index) {
    const row = document.createElement("div");
    row.className = "trace-line" + (index === step.line ? " active" : "");
    const arrow = document.createElement("span");
    arrow.className = "execution-arrow";
    arrow.textContent = index === step.line ? "➜" : "";
    arrow.setAttribute("aria-hidden", "true");
    const code = document.createElement("code");
    code.textContent = line.code;
    row.append(arrow, code);
    traceCode.append(row);
  });
  traceProgress.textContent = "Passo " + (traceIndex + 1) + " de " + exercise.trace.length;
  traceHeading.textContent = step.heading;
  traceDescription.textContent = step.description;
  traceVariables.replaceChildren();
  Object.entries(step.vars).forEach(function (entry) {
    const term = document.createElement("dt");
    term.textContent = entry[0];
    const definition = document.createElement("dd");
    definition.textContent = entry[1];
    traceVariables.append(term, definition);
  });
  traceOutput.replaceChildren();
  const outputTitle = document.createElement("strong");
  outputTitle.textContent = "Saída acumulada";
  const outputText = document.createElement("pre");
  outputText.textContent = step.output || "—";
  traceOutput.append(outputTitle, outputText);
  previousButton.disabled = traceIndex === 0;
  nextButton.disabled = traceIndex === exercise.trace.length - 1;
}

document.querySelector("#plain-tab").addEventListener("click", function () { setView("plain"); });
document.querySelector("#commented-tab").addEventListener("click", function () { setView("commented"); });
document.querySelector("#trace-tab").addEventListener("click", function () { setView("trace"); });
checkButton.addEventListener("click", verify);
undoButton.addEventListener("click", undo);
restartButton.addEventListener("click", restart);
previousButton.addEventListener("click", function () {
  if (traceIndex > 0) {
    traceIndex -= 1;
    renderTrace();
  }
});
nextButton.addEventListener("click", function () {
  if (traceIndex < currentExercise().trace.length - 1) {
    traceIndex += 1;
    renderTrace();
  }
});
document.querySelector("#trace-restart").addEventListener("click", function () {
  traceIndex = 0;
  renderTrace();
});

renderPage();

(() => {
  "use strict";

  const STEPS = 25;
  const NEVER_KNOW = ".. and now we will never know";
  const BASE_TITLE = document.title;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const verdict = document.getElementById("verdict");

  const runners = {};
  for (const el of document.querySelectorAll(".bug")) {
    runners[el.dataset.runner] = { el, pos: 0, timer: null };
  }

  let racing = false;

  // single source of truth for track length — CSS reads --steps for the grid
  document.documentElement.style.setProperty("--steps", STEPS);

  function delay() {
    return 100 + Math.random() * 900;
  }

  function render(runner) {
    runner.el.style.setProperty("--step", Math.min(runner.pos, STEPS));
    if (!reducedMotion.matches) {
      runner.el.classList.remove("hop");
      void runner.el.offsetWidth; // restart the squash animation
      runner.el.classList.add("hop");
    }
  }

  function hop(name) {
    const runner = runners[name];
    runner.pos += 1;
    render(runner);
    if (runner.pos >= STEPS) {
      finish(name);
      return;
    }
    runner.timer = setTimeout(() => hop(name), delay());
  }

  function haltRace() {
    racing = false;
    for (const runner of Object.values(runners)) {
      clearTimeout(runner.timer);
      runner.timer = null;
    }
    const stopHadFocus = stopBtn.contains(document.activeElement);
    stopBtn.hidden = true;
    startBtn.hidden = false;
    if (stopHadFocus) {
      startBtn.focus();
    }
  }

  function reset() {
    verdict.replaceChildren();
    for (const runner of Object.values(runners)) {
      runner.pos = 0;
      runner.el.style.setProperty("--step", 0);
      runner.el.classList.remove("hop", "winner");
    }
  }

  function start() {
    if (racing) return;
    reset();
    racing = true;
    document.title = "the bugs are deliberating…";
    startBtn.hidden = true;
    stopBtn.hidden = false;
    stopBtn.focus();
    for (const name of Object.keys(runners)) {
      runners[name].timer = setTimeout(() => hop(name), delay());
    }
  }

  function finish(winner) {
    haltRace();
    document.title = winner.toUpperCase() + ".";
    runners[winner].el.classList.add("winner");
    const stamp = document.createElement("span");
    stamp.className = "stamp";
    stamp.textContent = winner;
    verdict.replaceChildren(stamp);
    startBtn.textContent = "Race again";
  }

  function abort() {
    haltRace();
    document.title = BASE_TITLE;
    const note = document.createElement("span");
    note.className = "never-know";
    note.textContent = NEVER_KNOW;
    verdict.replaceChildren(note);
    startBtn.textContent = "Start the race";
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", abort);

  console.log("no bugs were harmed in the making of your decisions");
})();

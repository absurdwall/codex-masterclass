/* Local-only workbook tools. The lesson's approved examples are the source of truth. */
(() => {
  'use strict';

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const option = (value, label) => {
    const node = el('option', '', label);
    node.value = value;
    return node;
  };

  function field(id, labelText, input, hintText) {
    const wrapper = el('div', 'wb-field');
    const label = el('label', '', labelText);
    label.htmlFor = id;
    input.id = id;
    wrapper.append(label, input);
    if (hintText) {
      const hint = el('small', 'wb-note', hintText);
      hint.id = id + '-hint';
      input.setAttribute('aria-describedby', hint.id);
      wrapper.append(hint);
    }
    return { wrapper, label, input };
  }

  function panel(id, heading, introduction) {
    const root = el('section', 'wb-panel wb-tools');
    root.id = id;
    root.setAttribute('aria-labelledby', id + '-heading');
    const title = el('h2', 'wb-heading', heading);
    title.id = id + '-heading';
    root.append(el('p', 'wb-kicker', 'Try it here · local practice'), title,
      el('p', 'wb-note', introduction));
    return root;
  }

  function outputField(id, label, rows) {
    const input = el('textarea', 'wb-output wb-tools-output');
    input.readOnly = true;
    input.rows = rows;
    input.spellcheck = false;
    return field(id, label, input);
  }

  function statusLine() {
    const status = el('p', 'wb-note wb-tools-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    return status;
  }

  function copyButton(output, status, getRevision, noun) {
    const button = el('button', 'wb-button', 'Copy ' + noun);
    button.type = 'button';
    button.addEventListener('click', async () => {
      if (button.disabled || !output.value) return;
      const revision = getRevision();
      const value = output.value;
      let copied = false;
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(value);
          copied = true;
        }
      } catch (_) {
        // Some browsers deny clipboard access. Keep a selectable, keyboard-friendly fallback.
      }
      if (revision !== getRevision()) return;
      if (!copied) {
        output.focus();
        output.select();
        try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
        if (copied) button.focus();
      }
      status.textContent = copied
        ? (noun === 'prompt' ? 'Prompt copied. No scheduled task was created.' : 'Command copied. Nothing was run.')
        : 'Copy is unavailable here. The text is selected: press Ctrl+C or ⌘C to copy it.';
    });
    return button;
  }

  function buildSchedulePractice() {
    const anchor = document.getElementById('setup');
    const sourceIds = ['task-brief', 'task-read', 'task-deal'];
    const sources = sourceIds.map(id => document.getElementById(id));
    if (!anchor || sources.some(source => !source) || document.getElementById('schedule-workbook')) return;

    const templates = sources.map(source => source.textContent.trim());
    const exercises = [
      { name: 'Weekday learning brief', schedule: 'at 8:00 AM UTC.', duration: 'for the next two weeks, then stop.',
        time: '08:00', length: 2, unit: 'weeks', max: 8 },
      { name: 'One exceptional weekend read', schedule: 'at 9:00 AM UTC.', duration: 'for four Saturdays, then stop.',
        time: '09:00', length: 4, unit: 'Saturdays', max: 8 },
      { name: 'Quiet monitor deal watch', schedule: 'at 00:00, 06:00, 12:00, and 18:00 UTC each day',
        duration: 'for the next seven days, then stop.', length: 7, unit: 'days', max: 28 }
    ];
    // Do not silently generate a new variant if a lesson's approved wording has changed.
    if (exercises.some((exercise, index) => !templates[index].includes(exercise.schedule)
      || !templates[index].includes(exercise.duration)) || !templates[2].includes('Use $500 as the maximum item price.')) return;

    const defaults = () => exercises.map(exercise => ({ zone: 'UTC', time: exercise.time || '', length: String(exercise.length), price: '500' }));
    let values = defaults();
    let current = 0;
    let revision = 0;
    const root = panel('schedule-workbook', 'Make one prompt your own',
      'Pick an exercise and try a few classroom settings. This preview stays on this page; it does not save a schedule, contact sources, or buy anything.');
    const controls = el('div', 'wb-controls wb-tools-controls');
    const exerciseInput = el('select');
    exercises.forEach((exercise, index) => exerciseInput.append(option(String(index), exercise.name)));
    const exerciseField = field('wb-task-exercise', '1. Choose an exercise', exerciseInput);
    exerciseField.wrapper.classList.add('wb-tools-wide');

    const zoneInput = el('select');
    ['UTC', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney']
      .forEach(zone => zoneInput.append(option(zone, zone)));
    const zoneField = field('wb-task-zone', 'Time zone', zoneInput,
      'Times are local to this zone. Confirm the saved schedule and stop date before relying on it.');
    const timeInput = el('input');
    timeInput.type = 'time';
    timeInput.required = true;
    timeInput.step = '60';
    const timeField = field('wb-task-time', 'Run time', timeInput, 'Choose a clock time for the brief or weekend read.');
    const lengthInput = el('input');
    lengthInput.type = 'number';
    lengthInput.min = '1';
    lengthInput.step = '1';
    lengthInput.required = true;
    const lengthField = field('wb-task-length', 'Practice duration (weeks)', lengthInput);
    const lengthHint = el('small', 'wb-note');
    lengthHint.id = 'wb-task-length-hint';
    lengthInput.setAttribute('aria-describedby', lengthHint.id);
    lengthField.wrapper.append(lengthHint);
    const priceInput = el('input');
    priceInput.type = 'number';
    priceInput.min = '1';
    priceInput.max = '10000';
    priceInput.step = '0.01';
    priceInput.required = true;
    const priceField = field('wb-task-price', 'Maximum item price (USD)', priceInput,
      'Classroom range: $1–$10,000. Item price excludes shipping and tax; the prompt still says not to buy anything.');
    controls.append(exerciseField.wrapper, zoneField.wrapper, timeField.wrapper, lengthField.wrapper, priceField.wrapper);
    const boundary = el('p', 'wb-note wb-tools-boundary');
    const preview = outputField('wb-task-preview', '2. Review your prompt', 14);
    const status = statusLine();
    const actions = el('div', 'wb-actions');
    const copy = copyButton(preview.input, status, () => revision, 'prompt');
    const reset = el('button', 'wb-button wb-button-secondary', 'Reset builder');
    reset.type = 'button';
    actions.append(copy, reset);
    root.append(controls, boundary, preview.wrapper, actions, status,
      el('p', 'wb-note', 'After copying: test the job once, then ask to save it in your own chat. Inspect Scheduled and the first real result. Your changes are not retained when this page closes or reloads.'));

    function clockText(value) {
      const [hour, minute] = value.split(':').map(Number);
      return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
    }

    function render(message) {
      revision += 1;
      const exercise = exercises[current];
      const inputs = [zoneInput, lengthInput, current === 2 ? priceInput : timeInput];
      const invalid = inputs.filter(input => !input.checkValidity());
      [zoneInput, timeInput, lengthInput, priceInput].forEach(input => {
        if (invalid.includes(input)) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      });
      copy.disabled = invalid.length > 0;
      if (invalid.length) {
        preview.input.value = '';
        status.textContent = 'Enter a valid time, a whole-number duration, and any required price within the displayed ranges to preview and copy.';
        return;
      }
      const state = values[current];
      const length = Number(state.length);
      const duration = length === exercise.length ? exercise.duration : current === 0
        ? `for the next ${length} ${length === 1 ? 'week' : 'weeks'}, then stop.`
        : current === 1 ? `for ${length} ${length === 1 ? 'Saturday' : 'Saturdays'}, then stop.`
          : `for the next ${length} ${length === 1 ? 'day' : 'days'}, then stop.`;
      const schedule = current === 2
        ? `at 00:00, 06:00, 12:00, and 18:00 ${state.zone} each day`
        : `at ${clockText(state.time)} ${state.zone}.`;
      let prompt = templates[current].replace(exercise.schedule, schedule).replace(exercise.duration, duration);
      if (current === 2) {
        const amount = Number(state.price);
        const price = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
        prompt = prompt.replace('Use $500 as the maximum item price.', `Use $${price} as the maximum item price.`);
      }
      preview.input.value = prompt;
      status.textContent = message || 'Preview updated. Review it before copying; no task has been created.';
    }

    function showExercise(message) {
      const exercise = exercises[current];
      const state = values[current];
      exerciseInput.value = String(current);
      zoneInput.value = state.zone;
      timeInput.value = state.time;
      timeInput.disabled = current === 2;
      timeField.wrapper.hidden = current === 2;
      priceInput.value = state.price;
      priceInput.disabled = current !== 2;
      priceField.wrapper.hidden = current !== 2;
      lengthInput.max = String(exercise.max);
      lengthInput.value = state.length;
      lengthField.label.textContent = `Practice duration (${exercise.unit})`;
      lengthHint.textContent = `Choose 1–${exercise.max} ${exercise.unit.toLowerCase()} for this classroom practice. This is a practice range, not a product limit.`;
      boundary.textContent = current === 2
        ? 'The deal watch keeps its four daily checks: 00:00, 06:00, 12:00, and 18:00 in your chosen zone. Source checks, quiet alerts, checks for repeat deals, and the no-purchase rule stay in the preview.'
        : 'The selected exercise keeps its sources, quality bar, output format, checks for repeats, and rules for reporting missing access. Only the displayed timing and finite duration change.';
      render(message);
    }

    exerciseInput.addEventListener('change', () => {
      current = Number(exerciseInput.value);
      showExercise(exercises[current].name + ' selected. Review the prompt; no task has been created.');
    });
    [[zoneInput, 'zone'], [timeInput, 'time'], [lengthInput, 'length'], [priceInput, 'price']]
      .forEach(([input, key]) => input.addEventListener('input', () => {
        values[current][key] = input.value;
        render();
      }));
    reset.addEventListener('click', () => {
      values = defaults();
      current = 0;
      showExercise('Builder reset to the original weekday learning brief. No task has been created.');
    });
    anchor.after(root);
    showExercise('Original weekday learning brief ready to review. No task has been created.');
  }

  function buildCommandPractice() {
    const anchor = document.getElementById('map');
    const sourceNodes = Array.from(document.querySelectorAll('#noninteractive pre.code-example'));
    if (!anchor || sourceNodes.length !== 3 || document.getElementById('command-workbook')) return;
    const commands = sourceNodes.map(source => source.textContent.trim());
    const examples = [
      { name: 'Read-only repository briefing', mode: 'Read-only: inspect the repository without requesting file changes.',
        output: 'Progress normally goes to stderr; the final answer goes to stdout.',
        check: 'Run inside an authenticated, trusted Git repository. Check the reported entry points and test commands against the actual files.' },
      { name: 'JSONL progress report', mode: 'Read-only agent sandbox, with shell redirection to a report file.',
        output: 'The --json flag streams JSONL events, not a single JSON object. The shell writes events.jsonl even though the agent sandbox is read-only.',
        check: 'Inspect failures and the final result in the event stream. Before running it yourself, check the destination: shell redirection can replace an existing events.jsonl file.' },
      { name: 'Workspace-write regression test', mode: 'Workspace-write: local edits and the relevant test are intended; the prompt forbids committing or pushing.',
        output: 'Progress normally goes to stderr; the final answer goes to stdout. Review both the proposed file changes and test evidence.',
        check: 'Use this only for the actual empty-input bug described in bug.md. Inspect the diff and test result before accepting a change.' }
    ];
    let revision = 0;
    const root = panel('command-workbook', 'Choose a command and check what it can change',
      'Explore the three exact examples from this lesson. This generates text only: no terminal opens, no code runs, and no repository or report file is changed here.');
    const select = el('select');
    examples.forEach((example, index) => select.append(option(String(index), example.name)));
    const choice = field('wb-command-choice', '1. Choose the job', select);
    const controls = el('div', 'wb-controls');
    controls.append(choice.wrapper);
    const detail = el('div', 'wb-tools-explanation');
    const mode = el('p');
    const output = el('p');
    const review = el('p', 'wb-note');
    detail.append(mode, output, review);
    const preview = outputField('wb-command-preview', '2. Read the exact command', 5);
    const status = statusLine();
    const actions = el('div', 'wb-actions');
    const copy = copyButton(preview.input, status, () => revision, 'command');
    const reset = el('button', 'wb-button wb-button-secondary', 'Reset example');
    reset.type = 'button';
    actions.append(copy, reset);
    root.append(controls, detail, preview.wrapper, actions, status,
      el('p', 'wb-note', '3. If you use it later, review the permissions and paths in your own authenticated project first. Copying the command is not a test run.'));

    function render(message) {
      revision += 1;
      const index = Number(select.value);
      const example = examples[index];
      mode.replaceChildren(el('strong', '', 'Mode: '), document.createTextNode(example.mode));
      output.replaceChildren(el('strong', '', 'Output: '), document.createTextNode(example.output));
      review.replaceChildren(el('strong', '', 'Before running: '), document.createTextNode(example.check));
      preview.input.value = commands[index];
      status.textContent = message || example.name + ' selected. Nothing was run.';
    }
    select.addEventListener('change', () => render());
    reset.addEventListener('click', () => {
      select.value = '0';
      render('Reset to the read-only repository briefing. Nothing was run.');
    });
    anchor.after(root);
    render('Read-only repository briefing ready to inspect. Nothing was run.');
  }

  buildSchedulePractice();
  buildCommandPractice();
})();

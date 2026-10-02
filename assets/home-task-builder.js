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


  const anchor = document.getElementById('home-task-builder');
  if (!anchor) return;
  const records = JSON.parse(document.getElementById('home-task-data').textContent);
  const root = panel('schedule-workbook', 'Make one prompt your own', 'Choose a real task, adjust its schedule, and edit the full prompt. Copy it into a new ChatGPT chat to ask for the task to be created.');
  const controls = el('div', 'wb-controls wb-tools-controls');
  const pick = el('select');
  records.forEach((r,i)=>pick.append(option(String(i),r.name)));
  const pickField=field('wb-task-exercise','1. Choose a task',pick);pickField.wrapper.classList.add('wb-tools-wide');
  const cadence=el('select');[['daily','Daily'],['hourly','Hourly'],['six','Every six hours']].forEach(([v,t])=>cadence.append(option(v,t)));
  const cadenceField=field('wb-task-cadence','Repeat',cadence);
  const zone=el('select');['America/New_York','UTC','Europe/London','America/Los_Angeles','Asia/Kolkata','Asia/Tokyo','Australia/Sydney'].forEach(v=>zone.append(option(v,v)));
  const zoneField=field('wb-task-zone','Time zone',zone);
  const time=el('input');time.type='time';time.required=true;time.step='60';
  const timeField=field('wb-task-time','Run time',time);
  controls.append(pickField.wrapper,cadenceField.wrapper,zoneField.wrapper,timeField.wrapper);
  const preview=outputField('wb-task-preview','2. Review and edit the full setup request',18);preview.input.readOnly=false;
  const status=statusLine();let revision=0,current=0;
  const states=()=>records.map(r=>({cadence:r.cadence,zone:'America/New_York',time:r.time||'05:00',text:'',prefix:''}));
  let state=states();
  const copy=copyButton(preview.input,status,()=>revision,'prompt');
  const reset=el('button','wb-button wb-button-secondary','Reset builder');reset.type='button';
  const note=el('p','wb-note','These are ongoing examples. Copying does not create a task. Confirm the saved cadence, time zone, and destination in Scheduled; use Pause when you want future runs to stop.');
  function header(){const s=state[current];const repeat=s.cadence==='daily'?'every day at '+s.time:s.cadence==='hourly'?'every hour':'every six hours';return 'Create a scheduled task named “'+records[current].name+'” in this chat. Run it '+repeat+' in '+s.zone+', ongoing until I ask you to pause or stop it. Keep results in this same chat. Confirm the saved schedule, time zone, destination, and next run.\n\nTask instructions:\n';}
  function render(message){
    revision++;
    const s=state[current];timeField.wrapper.hidden=s.cadence!=='daily';time.disabled=s.cadence!=='daily';
    if(s.cadence==='daily'&&!time.checkValidity()){copy.disabled=true;time.setAttribute('aria-invalid','true');status.textContent='Enter a valid run time before copying.';return;}
    time.removeAttribute('aria-invalid');
    const prefix=header();
    if(!s.text)s.text=prefix+records[current].instructions;
    else if(s.prefix&&s.text.startsWith(s.prefix))s.text=prefix+s.text.slice(s.prefix.length);
    else {preview.input.value=s.text;copy.disabled=!s.text.trim();status.textContent='You edited the setup paragraph. Update its timing directly in the prompt, or reset the builder to use the schedule controls.';return;}
    s.prefix=prefix;preview.input.value=s.text;copy.disabled=!s.text.trim();status.textContent=message||'Prompt updated. Nothing has been created or run.';
  }
  function show(message){const s=state[current];pick.value=String(current);cadence.value=s.cadence;zone.value=s.zone;time.value=s.time;render(message);}
  pick.addEventListener('change',()=>{current=Number(pick.value);show('Task selected. Review all instructions before copying.');});
  [[cadence,'cadence'],[zone,'zone'],[time,'time']].forEach(([input,key])=>input.addEventListener('input',()=>{state[current][key]=input.value;render();}));
  preview.input.addEventListener('input',()=>{revision++;state[current].text=preview.input.value;copy.disabled=!preview.input.value.trim();status.textContent='Your edits are included when you copy. Changes stay only on this page.';});
  reset.addEventListener('click',()=>{state=states();current=0;show('Builder reset to the original task instructions and settings.');});
  root.append(controls,preview.wrapper,el('div','wb-actions'),status,note);
  root.querySelector('.wb-actions').append(copy,reset);
  anchor.replaceWith(root);show('Daily Interest Brief ready. Review and edit before copying.');
})();

/* Classroom-only demonstrations. No network, provisioning, code execution or external writes. */
(() => {
  'use strict';
  const host = document.getElementById('cloud-lab');
  if (!host || host.dataset.cloudReady) return;
  host.dataset.cloudReady = "true";
  host.classList.add('wb-panel');
  const make = (tag, text, cls) => { const n=document.createElement(tag); if(text)n.textContent=text; if(cls)n.className=cls; return n; };
  const button = (label, fn, secondary=false) => { const b=make('button',label,secondary?'wb-button-secondary':'wb-button');b.type='button';b.addEventListener('click',fn);return b; };
  const caption=make('p','Illustrative exercise • predefined examples only • no Cloud tasks are launched','wb-kicker');
  const heading=make('h3','','wb-heading');heading.tabIndex=-1;
  const count=make('p','','wb-count'), stage=make('div'), choices=make('div','','wb-choice-list');
  const feedback=make('p','','wb-feedback');feedback.setAttribute('role','status');
  const actions=make('div','','wb-actions');
  let step=0, revision=1, launchedB=false, launchedC=false;
  const reset=button('Restart walkthrough',()=>{step=0;revision=1;launchedB=false;launchedC=false;render(true);},true);
  actions.append(reset);host.replaceChildren(caption,count,heading,stage,choices,feedback,actions);
  const text=s=>stage.append(make('p',s));
  const code=s=>stage.append(make('pre',s,'wb-output'));
  const answer=(label,right,message)=>choices.append(button(label,()=>{feedback.textContent=message;if(right){const next=button('Continue →',()=>{step++;render(true);});choices.replaceChildren(next);next.focus();}},true));
  const steps=['Inspect the prepared starting point','Give one bounded assignment','Inspect the first proposed change','Review the correction','Explore isolated workspaces','Bring the result back to the project'];
  function render(focus=false){
    count.textContent=`Step ${step+1} of ${steps.length}`;heading.textContent=steps[step];stage.replaceChildren();choices.replaceChildren();feedback.textContent='';
    if(step===0){
      text('The example is a tiny task-list app. Before delegation, inspect a tested preparation: the intended repository, dependencies, tools, access, and a known baseline test.');
      code('ILLUSTRATIVE SETUP v1\nApp: tiny task list\nStarting state: three sample tasks\nBaseline: add / complete / show all → pass\nReal repository, starting commit and environment: pending');
      answer('Start after the real setup is published and its baseline test passes',true,'Good. A known starting point makes a later failure interpretable. In the real class, confirm the supplied repository and actual test command first.');
      answer('Start now; the task will inherit everything from my laptop',false,'Cloud does not automatically inherit laptop files, installed tools, or browser sessions. Prepare and verify the actual environment first.');
    }else if(step===1){
      text('Task A should add a view filter without deleting any stored tasks. Which brief makes that testable?');
      answer('Add “Unfinished only”; preserve data; test toggling, completion and the empty view; return diff and results',true,'Good. This gives a small change and observable acceptance checks. Task A gets its own workspace from the prepared environment.');
      answer('Make the app much better and ship it',false,'The scope and evidence are unclear. Ask for one behavior, define how to check it, and keep integration under review.');
    }else if(step===2){
      text('Illustrative first attempt: the filter looks right, but the proposed implementation overwrites the list. The example test report catches the loss.');
      code('PROPOSED CHANGE\nallTasks = allTasks.filter(task => !task.done)\n\nEXAMPLE TEST RESULTS\n✓ Unfinished tasks are visible\n✗ Switching back restores all 3 tasks: got 2\n✗ Stored task data remains unchanged');
      answer('Request a non-destructive view and rerun the failing checks',true,'Exactly. A convincing screenshot is insufficient. Keep the original data and derive only the displayed list.');
      answer('Accept it because the filtered screenshot looks correct',false,'That screenshot misses data loss. The failed restoration and preservation checks block acceptance.');
    }else if(step===3){
      text('Illustrative correction: calculate the visible list separately. Review both the changed code and what the tests actually cover.');
      code('CORRECTED EXAMPLE\nvisibleTasks = unfinishedOnly\n  ? allTasks.filter(task => !task.done)\n  : allTasks\n\nEXAMPLE TEST RESULTS\n✓ Default view shows all 3 tasks\n✓ Filter shows 2 unfinished tasks\n✓ Switching back restores all 3\n✓ Completing a visible task updates the view\n✓ Empty result is handled; stored data is preserved');
      answer('Keep this as a review candidate and inspect the real diff and behavior',true,'Good. This is fictional evidence for learning. In a real task, require the actual command/output, inspect the diff, and check important behavior yourself.');
      answer('Treat this lesson’s example report as proof my repository passed',false,'No code runs on this page. The example report explains the evidence to request; it cannot verify an actual repository.');
    }else if(step===4){
      text('Task A already started from setup v1. Explore what happens to other workspaces when the preparation is republished. These buttons update only this illustration.');
      const template=make('div','','cloud-template');
      template.append(make('strong','Prepared environment'),make('span',`Published example v${revision}`));stage.append(template);
      const arrow=make('span','↓','cloud-arrow');arrow.setAttribute('aria-hidden','true');stage.append(arrow);
      const board=make('div','','cloud-branches');
      const cards=[['Task A','v1 · filter change only']];
      if(launchedB)cards.push(['Task B','v1 · empty-state change only']);
      if(launchedC)cards.push(['Task C',`v${revision} · fresh workspace`]);
      cards.forEach(([title,body])=>{const card=make('article');card.append(make('strong',title),make('span',body));board.append(card);});stage.append(board);
      if(!launchedB)choices.append(button('Illustrate parallel Task B from v1',()=>{launchedB=true;render(true);feedback.textContent='Task B starts separately. It does not automatically contain Task A’s filter change.';},true));
      if(launchedB&&revision===1)choices.append(button('Illustrate republishing setup as v2',()=>{revision=2;render(true);feedback.textContent='The reusable preparation is now v2. Existing A and B workspaces stay at their previous state.';},true));
      if(revision===2&&!launchedC)choices.append(button('Illustrate a new Task C from v2',()=>{launchedC=true;render(true);feedback.textContent='Only the new task starts from v2. Combining A and B changes still needs deliberate Git review and integration.';},true));
      choices.append(button('Continue to the review handoff →',()=>{step++;render(true);}));
    }else{
      text('A useful handoff has three durable pieces. None is saved automatically by this illustration.');
      const list=make('ol');['GitHub: the reviewed code change or draft PR, with test evidence.','Space: current status, what was decided, what remains open, and links to the change.','dot: the ongoing responsibility, next action, and any decision it needs from you.'].forEach(s=>list.append(make('li',s)));stage.append(list);
      code('EXAMPLE PROJECT UPDATE\nStatus: filter change ready for review\nEvidence: link to actual diff and test results\nOpen question: keep the filter selected after reload?\nNext: human review; then explicitly authorized integration');
      feedback.textContent='Walkthrough complete. You prepared, delegated, checked a failure, reviewed a correction, and kept project context separate from task files.';
      const link=make('a','See the event-driven architecture →','wb-button-secondary');link.href='further-uses.html#architecture';choices.append(link);
    }
    if(focus)heading.focus();
  }
  render();
})();

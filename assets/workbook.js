/* Local learning interactions. No prompts are sent and no agent tasks run here. */
(() => {
  'use strict';
  const main = document.querySelector('main');
  if (!main) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  let uid = 0;
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key,value]) => {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key,value);
    });
    children.flat().forEach(child => node.append(child instanceof Node ? child : document.createTextNode(String(child))));
    return node;
  };
  const p = text => el('p',{},text);
  const button = (text, action, secondary = false) => {
    const b = el('button',{type:'button',class:secondary?'wb-button-secondary':'wb-button'},text);
    b.addEventListener('click',action); return b;
  };
  const panel = (title, note) => {
    const box = el('section',{class:'wb-panel',id:'lesson-workbench','aria-labelledby':'workbench-title'},el('p',{class:'wb-kicker'},'Interactive learning'),el('h2',{class:'wb-heading',id:'workbench-title'},title),p(note));
    return box;
  };
  const field = (label, type='text', value='', options=[]) => {
    const id='wb-field-'+(++uid);
    const input=el(type==='select'?'select':type==='textarea'?'textarea':'input',{id});
    if(type!=='select'&&type!=='textarea')input.type=type;
    options.forEach(([v,t])=>input.append(el('option',{value:v},t)));
    input.value=value;
    return {wrap:el('label',{class:'wb-field',for:id},el('span',{},label),input),input};
  };
  const live = () => el('p',{class:'wb-live',role:'status','aria-live':'polite'});
  const copy = (getText,status) => {
    const control=button('Copy prompt',async event=>{
      const trigger=event.currentTarget, value=getText();
      try { await navigator.clipboard.writeText(value); if(getText()!==value)return; trigger.textContent='Copied'; status.textContent='Copied to your clipboard. Nothing was submitted or run.'; }
      catch { if(getText()===value)status.textContent='Copy is unavailable here. Select the preview text and copy it manually.'; }
    });
    control.classList.add('wb-copy');return control;
  };
  const placeAfter = (box,target) => {
    (document.querySelector(target)||main.querySelector('.page-heading')).insertAdjacentElement('afterend',box);
    const nav=document.querySelector('.on-page');
    if(nav)nav.insertBefore(el('a',{href:'#lesson-workbench'},'Try the interactive exercise'),nav.children[1]||null);
  };
  const entryPoints={
    'models.html':['lesson-workbench','Compare two model choices'],
    'workspace.html':['lesson-workbench','Try a workspace scenario'],
    'pet.html':['lesson-workbench','Customize your pet prompt'],
    'dots-space.html':['lesson-workbench','Try a delegation scenario'],
    'dots-space-guide.html':['lesson-workbench','Build a delegation brief'],
    'build-demo.html':['lesson-workbench','Play the computer-use exercise'],
    'scheduled-tasks-guide.html':['schedule-workbook','Customize a scheduled task'],
    'further-uses.html':['command-workbook','Explore CLI commands']
  };
  if(entryPoints[page]){
    const [target,label]=entryPoints[page];
    const entry=el('a',{class:'wb-entry',href:'#'+target},label+' →');
    const nav=main.querySelector('.reading-mode');
    if(nav)nav.append(entry);else main.querySelector('.page-heading').after(el('div',{class:'wb-entry-row'},entry));
  }
  const markGroup = (group,chosen) => [...group.querySelectorAll('button')].forEach(b=>b.setAttribute('aria-pressed',String(b===chosen)));
  const topics=[['models','Choose a model','models.html'],['workspace','Organize your work','workspace.html'],['pet','Make your pet','pet.html'],['dots','Use dots & Space','dots-space.html'],['build','Build and delegate','build-demo.html']];
  const storeKey='codex-masterclass:reviewed:v1';
  let reviewed=[]; let persistent=true;
  try { const saved=JSON.parse(localStorage.getItem(storeKey)||'[]'); if(Array.isArray(saved))reviewed=saved.filter(x=>topics.some(t=>t[0]===x)); }
  catch { persistent=false; }
  function saveProgress(){try{localStorage.setItem(storeKey,JSON.stringify(reviewed));}catch{persistent=false;}document.dispatchEvent(new Event('workbook-progress'));}
  function setReviewed(id,on){reviewed=reviewed.filter(x=>x!==id);if(on)reviewed.push(id);saveProgress();}
  const currentTopic=({'models.html':'models','workspace.html':'workspace','pet.html':'pet','dots-space.html':'dots','dots-space-guide.html':'dots','build-demo.html':'build','scheduled-tasks-guide.html':'build'})[page];
  if(currentTopic){
    const row=el('aside',{class:'wb-complete'});const state=p('');const b=button('',()=>setReviewed(currentTopic,!reviewed.includes(currentTopic)),true);
    const render=()=>{const on=reviewed.includes(currentTopic);state.textContent=(on?'Marked reviewed.':'Ready to move on?')+' This is your own review marker, not a test score.';b.textContent=on?'Unmark reviewed':'Mark topic reviewed';b.setAttribute('aria-pressed',String(on));};
    row.append(state,b);const end=main.querySelector('.page-turn')||main.querySelector('footer');end?end.before(row):main.append(row);document.addEventListener('workbook-progress',render);render();
  }
  if(page==='index.html'){
    const box=panel('Choose your path','Follow the class in order, or choose the task you want to try.');
    const routes=[['class','Prepare for the session',[0,1,2,3,4]],['make','Make something useful',[0,2,4]],['delegate','Delegate ongoing work',[0,3,4]],['code','Work with code',[0,1,4]]];
    const controls=el('div',{class:'wb-controls'}),output=el('div',{class:'wb-route'});let routeKey='class',routeButton=null;const start=el('a',{class:'wb-button',href:'models.html'},'Start this route');
    function route(key,b){routeKey=key;routeButton=b;markGroup(controls,b);const data=routes.find(r=>r[0]===key);output.replaceChildren(el('h3',{},data[1]),key==='class'?p('Follow Topics 01–05 below. The detailed guides and Topic 06 are optional reading for later.'):el('ol',{},data[2].map(i=>el('li',{},el('a',{href:topics[i][2]},topics[i][1])))));if(key==='delegate')output.append(p('Then try one scheduled-task exercise from Topic 05.'));if(key==='code')output.append(p('Continue with the optional CLI and Agents API material in Topic 06.'));start.href=topics[data[2].find(i=>!reviewed.includes(topics[i][0]))??data[2][0]][2];start.textContent='Open next topic in this route';}
    routes.forEach(([key,title])=>{const b=button(title,()=>route(key,b),true);b.setAttribute('aria-pressed','false');controls.append(b);});
    const progress=el('progress',{max:'5',value:'0','aria-label':'Core topics marked reviewed'}),count=p(''),privacy=el('p',{class:'wb-note'});const checks=el('div',{class:'wb-checks'});
    topics.forEach(([id,title])=>{const input=el('input',{type:'checkbox','aria-label':'Mark '+title+' reviewed'});input.addEventListener('change',()=>setReviewed(id,input.checked));checks.append(el('label',{},input,title));input.dataset.topic=id;});
    function render(){progress.value=reviewed.length;count.textContent=reviewed.length+' / 5 core topics reviewed';checks.querySelectorAll('input').forEach(i=>i.checked=reviewed.includes(i.dataset.topic));privacy.textContent=persistent?'Review markers are saved only in this browser. Prompt inputs are not saved.':'Browser storage is unavailable; review markers last only for this page session.';if(routeButton)route(routeKey,routeButton);}
    const tracker=el('details',{},el('summary',{},'Track the topics you have reviewed'),checks,el('div',{class:'wb-actions'},button('Reset review markers',()=>{reviewed=[];saveProgress();},true)),privacy);
    box.append(controls,output,start,el('hr'),el('div',{class:'wb-progress'},count,progress),tracker);
    placeAfter(box,'.intro');document.addEventListener('workbook-progress',render);render();route('class',controls.firstElementChild);
  }
  if(page==='models.html'){
    const source=[...document.scripts].map(s=>s.textContent).find(s=>s.includes('const models=['));
    const match=source&&source.match(/const models=(\[.*?\]);const efforts=/s);
    if(match){
      const models=JSON.parse(match[1]),efforts=['low','medium','high','xhigh','max','none'];
      const box=panel('Compare two model + effort choices','Choose two model and effort combinations. See how their published scores and benchmark costs compare; this does not predict the price of your own task.');
      const presets=el('div',{class:'wb-controls'}),grid=el('div',{class:'wb-grid'}),summary=el('div',{class:'wb-compare-summary',role:'status','aria-live':'polite'});
      const sides=['A','B'].map((letter,i)=>{const model=field('Model '+letter,'select',i?'2':'1',models.map((m,n)=>[String(n),m.name]));const effort=field('Effort '+letter,'select','1',efforts.map((e,n)=>[String(n),e==='none'?'Non-reasoning':e]));const output=el('div',{class:'wb-output'});const card=el('div',{class:'wb-stack'},model.wrap,effort.wrap,output);grid.append(card);return {model:model.input,effort:effort.input,output};});
      const usd=v=>v===null?'Not measured':'$'+Number(v).toFixed(v<.01?4:2);
      function render(){const values=sides.map(({model,effort,output},i)=>{const m=models[Number(model.value)],e=Number(effort.value),score=m.scores[e],cost=m.costs[e];const notes=[];if(m.name.includes('*'))notes.push('Claude: adaptive reasoning with default fallback.');if(m.note)notes.push(m.note);if(m.name==='Gemini 3.8 Flash')notes.push('Introductory API rates through 31 December 2026; later input/output $1.50 / $7.50.');if(m.name.startsWith('GPT-6'))notes.push('Standard API rates shown for input up to 272K tokens.');if(m.name.startsWith('Grok'))notes.push('API rates shown for prompts up to 200K tokens.');output.replaceChildren(el('h3',{class:'wb-model-name'},String.fromCharCode(65+i)+': '+m.name+' · '+(efforts[e]==='none'?'non-reasoning':efforts[e])),el('div',{class:'wb-metrics'},el('div',{class:'wb-metric'},el('span',{},'AA Intelligence Index'),el('strong',{},score===null?'Not measured':score)),el('div',{class:'wb-metric'},el('span',{},'Benchmark cost / task'),el('strong',{},usd(cost)))),p('API per 1M tokens: $'+m.api[0]+' input / $'+m.api[1]+' output.'),el('p',{class:'wb-note'},notes.join(' ')),el('div',{class:'wb-source-links'},el('a',{href:m.benches?.[e]||m.bench},'Benchmark source'),el('a',{href:m.provider},'Provider rates')));return {score,cost};});const [a,b]=values;if(a.score===null||b.score===null||a.cost===null||b.cost===null){summary.textContent='One configuration has no verified measurement. No score difference or cost ratio is calculated.';}else{const delta=b.score-a.score,ratio=b.cost/a.cost;summary.textContent='B scores '+(delta===0?'the same':Math.abs(delta)+' '+(Math.abs(delta)===1?'point':'points')+' '+(delta>0?'higher':'lower'))+' and costs '+ratio.toFixed(ratio<.1?2:1)+'× as much as A on this benchmark. This does not predict which will pass your own acceptance tests.';}}
      const options=[['Scoped feature: Sol Medium',1,1,1,3],['Hard bug: Sol Xhigh',1,3,2,1],['Quality-first: Astra Medium',2,1,2,4]];
      options.forEach(([label,am,ae,bm,be])=>{const b=button(label,()=>{sides[0].model.value=am;sides[0].effort.value=ae;sides[1].model.value=bm;sides[1].effort.value=be;markGroup(presets,b);render();},true);b.setAttribute('aria-pressed','false');presets.append(b);});
      sides.forEach(s=>[s.model,s.effort].forEach(n=>n.addEventListener('change',()=>{markGroup(presets,null);render();})));
      box.append(presets,grid,summary,el('p',{class:'wb-note'},'Snapshot: 1 October 2026 · AA Intelligence Index v4.3.2. Broad intelligence, not a coding pass rate. Same effort names do not mean equal compute. API unit prices and subscription allowances are separate.'),el('div',{class:'wb-actions'},button('Reset comparison',()=>{sides[0].model.value='1';sides[1].model.value='2';sides.forEach(s=>s.effort.value='1');markGroup(presets,null);render();},true)));
      placeAfter(box,'#two-choices');render();
    }
  }
  function choiceExercise(title,note,scenarios,mount){
    const box=panel(title,note),pick=field('Choose a scenario','select','0',scenarios.map((s,i)=>[i,s.title])),question=el('h3'),choices=el('div',{class:'wb-choice-list'}),feedback=el('div',{class:'wb-feedback',role:'status','aria-live':'polite'});
    function render(){const s=scenarios[Number(pick.input.value)];question.textContent=s.question;feedback.replaceChildren();choices.replaceChildren();s.choices.forEach(([label,answer])=>{const b=button(label,()=>{markGroup(choices,b);feedback.replaceChildren(p(answer));},true);b.setAttribute('aria-pressed','false');choices.append(b);});}
    pick.input.addEventListener('change',render);box.append(pick.wrap,el('div',{class:'wb-output'},question,choices,feedback),el('div',{class:'wb-actions'},button('Try again',render,true)));placeAfter(box,mount);render();
  }
  if(page==='workspace.html')choiceExercise('Choose the right working setup','Pick a scenario, choose a structure, and inspect what it does to context and file isolation.',[
    {title:'Two changes at the same time',question:'Two agents will edit the same repository independently. What keeps their file changes apart?',choices:[['Two chats in one folder','Separate chats separate conversation context, not the underlying files. Both agents could still modify the same working tree.'],['Separate Git worktrees','Good fit. Worktrees provide separate working directories for Git branches. Review and merge the resulting changes deliberately.'],['Two Projects pointing at the same folder','Project organization alone does not guarantee file isolation. Check the actual working directory and use worktrees for independent Git changes.']]},
    {title:'New question, same project',question:'You finished a long bug investigation and now want a focused explanation of another module.',choices:[['Start a fresh chat in the project','Good fit. Reuse the project’s relevant files and instructions, while giving the new conversation a clear goal and any essential handoff facts.'],['Keep adding unrelated work to the old chat','You can, but it mixes distinct goals and old assumptions. A focused new chat can make the current task easier to understand and review.'],['Create a new worktree for every question','A read-only explanation usually does not need file isolation. A new conversation is the smaller change.']]},
    {title:'A report with shared reference files',question:'Several conversations need the same brief and reusable instructions. What organizes that context?',choices:[['A Project','Good fit. A Project groups related chats, files, and instructions. Still identify which sources and constraints matter to each task.'],['A Git branch','A branch tracks code history. It does not replace the project context used by conversations.'],['Only a longer chat','One chat can carry context, but a Project is a clearer home for shared reference material used across several conversations.']]}
  ],'#map');
  if(page==='pet.html'){
    const target=document.querySelector('#pet-prompt');if(target){const original=target.textContent;const box=panel('Make the prompt yours','Change the four character details. The A/B/C choice and complete animated-pet workflow stay intact. This edits prompt text only; the real Octopus above is unchanged.');const grid=el('div',{class:'wb-grid'});const defs=[['Name','Octopus'],['Character','a small octopus'],['Personality','lively'],['Main color','red']];const fields=defs.map(([label,value])=>{const f=field(label,'text',value);f.input.maxLength=100;grid.append(f.wrap);return f;});const status=live();const reset=button('Reset character',()=>{fields.forEach((f,i)=>f.input.value=defs[i][1]);render();},true);
      function render(){const values=new Map(defs.map((d,i)=>[d[1],fields[i].input.value.trim()||d[1]]));const text=original.replace(/\[(Octopus|a small octopus|lively|red)\]/g,(_match,key)=>'['+values.get(key)+']');target.textContent=text;const oldCopy=document.querySelector('[data-copy="pet-prompt"]');if(oldCopy)oldCopy.textContent='Copy prompt';cb.textContent='Copy prompt';status.textContent='Prompt updated below. Empty fields use the original character detail.';}
      fields.forEach(f=>f.input.addEventListener('input',render));const cb=copy(()=>target.textContent,status);box.append(grid,el('div',{class:'wb-actions'},cb,reset,el('a',{href:'#pet-prompt'},'See the full prompt')),status);document.querySelector('#prepared-prompt > p').after(box);render();
    }
  }
  if(page==='dots-space.html'){
    choiceExercise('Which kind of help fits this request?','Choose a situation and see the difference between a conversation, an ongoing assistant, a saved Page, and a schedule.',[
      {title:'A recommendation I need now',question:'You have two proposals and want to think through their trade-offs together.',choices:[['Start with a chat','Good fit. A conversation is enough for immediate analysis. You can save the useful conclusion in a Page afterward.'],['Create a recurring schedule','No recurring trigger is needed yet. First do the comparison; schedule only a real follow-up job.'],['Create a Space without giving the task','Space provides a home for material. You still need to ask ChatGPT or a dot to do the comparison.']]},
      {title:'A project that keeps moving',question:'A workshop has changing options, research, drafts, and decisions over several days.',choices:[['Delegate the ongoing work to a dot','Good fit. Give the goal, sources, boundaries, and review point. Ask it to save important results in a Page when needed.'],['Only create a Page','A Page is a useful record, but saving it does not assign an assistant to carry the work forward.'],['Set a reminder with no task instructions','A reminder alone does not explain what research or drafting should happen. Define the useful work first.']]},
      {title:'A document my team can edit',question:'The recommendation should stay easy to find, revise, and discuss with colleagues.',choices:[['Save it as a Page in Space','Good fit. A Page is an editable artifact; choose sharing deliberately and check access to child pages and linked sources.'],['Rely only on a private conversation','The conversation may contain the reasoning, but colleagues need an accessible shared artifact to review and update.'],['Increase the model’s effort','More reasoning does not provide a shared document or change its permissions. Choose the right artifact.']]},
      {title:'A weekday source check',question:'Every weekday, check defined sources and report only significant changes.',choices:[['Create and verify a scheduled task','Good fit. Specify timing, time zone, sources, result destination, and notification rules; inspect the first run.'],['Write “update every day” in a Page','That wording alone does not establish a saved enabled schedule. Verify the actual recurring task.'],['Open a new chat every morning','You can do the job manually, but a saved schedule is the feature designed for a defined recurring trigger.']]}
    ],'#together');
    const table=document.querySelector('.agent-matrix table');if(table){const wrap=el('div',{class:'wb-filter','aria-label':'Choose agent columns to compare'}),note=el('p',{class:'wb-note',role:'status'});const names=['dot','Grok Bot','Muse','Hermes Agent'];const checks=[];function show(){const selected=checks.filter(c=>c.checked).length;checks.forEach((c,i)=>{table.querySelectorAll('tr').forEach(r=>{if(r.children[i+1])r.children[i+1].hidden=!c.checked;});const col=table.querySelectorAll('col')[i+1];if(col)col.hidden=!c.checked;});table.style.minWidth=(selected===4?740:Math.max(320,120+selected*180))+'px';note.textContent=selected+' agent columns shown. Select all four to restore the full comparison.';}
      names.forEach((name,i)=>{const c=el('input',{type:'checkbox',checked:'','aria-label':'Show '+name+' column'});c.checked=true;c.addEventListener('change',()=>{if(checks.every(x=>!x.checked)){c.checked=true;note.textContent='Keep at least one agent visible.';return;}show();});checks.push(c);wrap.append(el('label',{},c,name));});const all=button('Show all',()=>{checks.forEach(c=>c.checked=true);show();},true);wrap.append(all);document.querySelector('.agent-matrix').before(wrap,note);show();}
  }
  if(page==='dots-space-guide.html'){
    const box=panel('Build a delegation brief','Fill the four fields to assemble a useful request. This checks whether fields are supplied, not whether an AI will succeed. Nothing is sent or saved.');const fields=[['Outcome','Compare three workshop venues'],['Sources','The workshop brief and three attached proposals'],['Boundary','Prepare recommendations only; do not contact venues or book'],['Evidence / result','A comparison with source links, unknowns, and a recommendation']].map(([label,value])=>field(label,'textarea',value));const grid=el('div',{class:'wb-grid'},fields.map(f=>f.wrap));const preview=el('pre',{class:'wb-output'}),status=live(),quality=el('div',{class:'wb-feedback',role:'status'});const initial=fields.map(f=>f.input.value);
    function render(){box.querySelectorAll('.wb-copy').forEach(b=>b.textContent='Copy prompt');const values=fields.map(f=>f.input.value.trim());const labels=['Outcome','Sources','Boundary','Evidence / result'];preview.textContent=values.map((v,i)=>labels[i]+': '+(v||'[add this detail]')).join('\n\n')+'\n\nTell me when a decision is needed. Stop when the reviewable result is ready.';const missing=labels.filter((_,i)=>!values[i]);quality.textContent=missing.length?'Missing: '+missing.join(', ')+'. Add these before delegating.':'All four fields supplied. Now check that the sources are available and the result is specific enough to verify.';status.textContent='';}
    fields.forEach(f=>f.input.addEventListener('input',render));box.append(grid,quality,preview,el('div',{class:'wb-actions'},copy(()=>preview.textContent,status),button('Reset example',()=>{fields.forEach((f,i)=>f.input.value=initial[i]);render();},true)),status);placeAfter(box,'#strengths');render();
  }
  if(page==='build-demo.html'){
    const box=panel('Practice observe → act → verify','A local, illustrative card-game scenario. These controls do not open a game or operate your computer. The goal is to inspect evidence, not to win.');const stage=el('div',{class:'wb-canvas'}),choices=el('div',{class:'wb-choice-list'}),feedback=el('div',{class:'wb-feedback',role:'status','aria-live':'polite'}),step=el('p',{class:'wb-note'});let phase=0;
    function advance(next){phase=next;render();const heading=stage.querySelector('h3');heading.tabIndex=-1;heading.focus();}
    function actionButtons(items){choices.replaceChildren();items.forEach(([label,fn])=>choices.append(button(label,fn,true)));}
    function render(){feedback.replaceChildren();step.textContent='Step '+(phase+1)+' of 3';stage.replaceChildren(el('div',{class:'wb-canvas-header'},el('strong',{},'Illustrative practice table'),el('span',{},'No wager · one turn only')));
      if(phase===0){stage.append(el('h3',{},'Observe the rule and your hand'),p('Rule: you must follow the led suit if you can. The current trick was led with hearts.'),el('div',{class:'wb-cards'},el('div',{class:'wb-card'},'Hearts 7'),el('div',{class:'wb-card'},'Clubs K')),p('Your turn. Which action respects the visible rule?'));actionButtons([['Play Hearts 7',()=>{advance(1);}],['Play Clubs K',()=>feedback.replaceChildren(p('You can follow hearts, so playing clubs would break the stated rule. Inspect the visible hand and try again.'))],['Keep playing until the game ends',()=>feedback.replaceChildren(p('The agreed boundary is one turn. Choose one legal action, then inspect its result.'))]]);}
      else if(phase===1){stage.append(el('h3',{},'The click was sent. Is that enough?'),p('The screen still shows both cards and still says “Your turn.” No played card or confirmation is visible.'));actionButtons([['Declare the turn complete',()=>feedback.replaceChildren(p('Not yet. Sending a click is not evidence that the game accepted it.'))],['Inspect the state before another action',()=>{advance(2);}],['Click several more times quickly',()=>feedback.replaceChildren(p('Repeated clicks could duplicate an action after a delay. Observe the current state before retrying.'))]]);}
      else{stage.append(el('h3',{},'Verify the changed state'),p('The table now shows Hearts 7 as your played card. Your hand contains only Clubs K. The turn indicator says “Opponent.”'));actionButtons([['Stop and report the verified turn',()=>feedback.replaceChildren(p('Good. The visible card, hand, and turn indicator agree. Report one legal turn completed, then stop at the requested boundary.'))],['Start another hand automatically',()=>feedback.replaceChildren(p('The verified turn completes this assignment. A new hand would go beyond the boundary.'))]]);}
    }
    box.append(step,stage,choices,feedback,el('div',{class:'wb-actions'},button('Restart scenario',()=>{advance(0);},true)));placeAfter(box,'#computer');render();
  }
})();

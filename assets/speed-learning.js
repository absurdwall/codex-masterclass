/* Normalized classroom arithmetic only. Does not estimate an account's allowance. */
(() => {
  'use strict';
  const host=document.getElementById('speed-lab');
  if(!host||host.dataset.ready)return;host.dataset.ready='true';
  const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  const heading=make('h3','Try the same-work / per-minute distinction');
  const intro=make('p','Illustration: the same token mix costs 100 normalized usage units and takes 10 minutes of token generation at Standard. These units are not credits, tokens, or an account quota.');
  const controls=make('div','','speed-controls');
  const field=(id,label,options)=>{const wrap=make('label',label),select=make('select');select.id=id;options.forEach(([value,name])=>{const o=make('option',name);o.value=value;select.append(o);});wrap.htmlFor=id;wrap.append(select);controls.append(wrap);return select;};
  const mode=field('speed-mode','Speed scenario',[['standard','Standard baseline'],['fast6','Fast · GPT-6 family'],['fast15','Fast · GPT-5.6 / GPT-5.5'],['ultra','Astra Ultrafast · full 8× scenario']]);
  const billing=field('speed-billing','Usage basis',[['included','Included subscription allowance'],['paid','Purchased credits / Enterprise PAYG']]);
  const output=make('div','','speed-results');output.setAttribute('role','status');output.setAttribute('aria-live','polite');
  const note=make('p','','speed-note');
  const reset=make('button','Reset illustration','wb-button-secondary');reset.type='button';
  host.replaceChildren(heading,intro,controls,output,note,reset);
  function render(){
    const data={standard:{speed:1,charge:1},fast6:{speed:null,charge:billing.value==='included'?2.5:2},fast15:{speed:1.5,charge:billing.value==='included'?2.5:2},ultra:{speed:8,charge:billing.value==='included'?8:6}}[mode.value];
    const f=n=>Number(n.toFixed(2)).toString();
    const stats=[['Same-work charge',`${f(100*data.charge)} units`,`${f(data.charge)}× Standard; identical token workload assumed`],['Generation time',data.speed===null?'Not specified':`${f(10/data.speed)} min`,data.speed===null?'No fixed claim in current Codex docs':`${f(data.speed)}× throughput scenario; excludes overhead`],['Usage per generation minute',data.speed===null?'Cannot calculate':`${f(data.charge*data.speed)}×`,data.speed===null?'Measured throughput is needed':'Relative to Standard; not whole-task burn']];
    output.replaceChildren();stats.forEach(([label,value,detail])=>{const card=make('div');card.append(make('span',label),make('strong',value),make('small',detail));output.append(card);});
    note.textContent=mode.value==='ultra'?'This uses the advertised maximum 8× generation speed, not a guaranteed result. Same work costs 8× included allowance or 6× paid usage, even though the per-minute ratio can be higher.':mode.value==='fast6'?'The charging multiplier is known; current Codex docs give no fixed GPT-6 Fast throughput multiplier. Do not borrow the older models’ 1.5× claim.':mode.value==='fast15'?'The older models’ documented 1.5× model-speed increase is used here as a generation-throughput assumption. This is not a measured task-time forecast.':'Arithmetic holds token mix and workload constant. Actual token counts, throughput, caching, tools, and waiting can change the result.';
  }
  mode.addEventListener('change',render);billing.addEventListener('change',render);reset.addEventListener('click',()=>{mode.value='ultra';billing.value='included';render();});mode.value='ultra';billing.value='included';render();
})();

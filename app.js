// The lessons and medium-effort benchmark table remain readable without JavaScript.
const effortSelect = document.querySelector('#effort');
if (effortSelect) {
  const efforts = ['low', 'medium', 'high', 'xhigh', 'max'];
  const data = [
    {scores:[21,29,32,34,37],costs:[.0045,.02,.03,.04,.07]},
    {scores:[42,48,50,51,52],costs:[.13,.21,.32,.39,.72]},
    {scores:[46,50,51,52,53],costs:[.82,1.54,1.73,2.31,3.26]},
    {scores:[null,41,47,52,56],costs:[null,.59,1.08,2.74,7.60]},
    {scores:[42,51,54,56,58],costs:[.55,1.34,1.82,3.46,5.98]}
  ];
  effortSelect.addEventListener('change', () => {
    const index = Number(effortSelect.value);
    document.querySelectorAll('#model-table tbody tr').forEach((row, i) => {
      row.querySelector('.tested-effort').textContent = efforts[index];
      row.querySelector('.score').textContent = data[i].scores[index] ?? 'Not measured';
      const cost = data[i].costs[index];
      row.querySelector('.bench-cost').textContent = cost === null ? 'Not measured' : '$' + cost.toFixed(cost < .01 ? 4 : 2);
    });
    document.querySelector('#table-status').textContent = `Showing ${efforts[index]} effort. ${index === 0 ? 'Sonnet low was not measured in this snapshot.' : 'Five tested configurations.'}`;
  });
}
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copy);
    const payload = target.textContent;
    try {
      await navigator.clipboard.writeText(payload);
      if (target.textContent === payload) button.textContent = 'Copied';
    } catch {
      if (target.textContent === payload) button.textContent = 'Select the prompt and copy';
    }
  });
});

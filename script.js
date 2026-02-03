// Playground interactions: theme toggle, table search, add row, inline edit, sorting
(() => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const tableSearch = document.getElementById('tableSearch');
  const dataTable = document.getElementById('dataTable');
  const addRowBtn = document.getElementById('addRowBtn');
  const pushRow = document.getElementById('pushRow');
  const newName = document.getElementById('newName');
  const newRole = document.getElementById('newRole');
  const sampleColor = document.getElementById('sampleColor');

  // Persist theme in localStorage
  const savedTheme = localStorage.getItem('ui-theme');
  if (savedTheme === 'light') body.classList.add('light');

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('ui-theme', body.classList.contains('light') ? 'light' : 'dark');
  });

  // Swatch color click -> change accent color
  document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', () => {
      const c = s.dataset.color;
      document.documentElement.style.setProperty('--accent', c);
    });
  });

  // Search filter
  tableSearch.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const rows = dataTable.querySelectorAll('tbody tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Add a new row with random progress
  function addRow(name = 'New User', role = 'Member', status = 'Pending') {
    const tbody = dataTable.querySelector('tbody');
    const id = tbody.children.length + 1;
    const progress = Math.floor(Math.random() * 100);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${id}</td>
      <td contenteditable="true">${name}</td>
      <td contenteditable="true">${role}</td>
      <td><span class="badge ${status === 'Active' ? 'success' : status === 'Blocked' ? 'danger' : 'warning'}">${status}</span></td>
      <td><div class="pbar"><div style="width:${progress}%"></div></div></td>
      <td>
        <button class="btn subtle small edit">Edit</button>
        <button class="btn danger small delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  addRowBtn.addEventListener('click', () => addRow('Auto Row', 'Dev', 'Active'));

  pushRow.addEventListener('click', () => {
    const n = newName.value.trim() || 'Unnamed';
    const r = newRole.value.trim() || 'Trainee';
    addRow(n, r, 'Pending');
    newName.value = '';
    newRole.value = '';
  });

  // Table-level event delegation for delete and edit
  dataTable.addEventListener('click', (ev) => {
    const el = ev.target;
    if (el.classList.contains('delete')) {
      const tr = el.closest('tr');
      tr && tr.remove();
      renumberRows();
    }
    if (el.classList.contains('edit')) {
      const tr = el.closest('tr');
      const firstEditable = tr.querySelector('[contenteditable="true"]');
      if (firstEditable) {
        firstEditable.focus();
        document.execCommand('selectAll', false, null);
      }
    }
  });

  // Renumber IDs after deletions
  function renumberRows(){
    const rows = dataTable.querySelectorAll('tbody tr');
    rows.forEach((r, i) => {
      r.children[0].textContent = i+1;
    });
  }

  // Sort when header clicked (toggle asc/desc)
  dataTable.querySelectorAll('thead th[data-key]').forEach(th => {
    th.style.cursor = 'pointer';
    let asc = true;
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      sortTableByColumn(key, asc);
      asc = !asc;
      // small indicator
      th.textContent = `${th.textContent.split(' ')[0]} ${asc ? '▾' : '▴'}`;
    });
  });

  function sortTableByColumn(key, asc = true) {
    const tbody = dataTable.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const idx = {
      id: 0,
      name: 1,
      role: 2,
      status: 3,
      progress: 4
    }[key];

    rows.sort((a, b) => {
      let aText = a.children[idx].innerText.trim();
      let bText = b.children[idx].innerText.trim();

      // Special handling for progress -> numeric
      if (key === 'id' || key === 'progress') {
        const aVal = parseInt(aText) || parseInt(a.querySelector('.pbar div')?.style.width) || 0;
        const bVal = parseInt(bText) || parseInt(b.querySelector('.pbar div')?.style.width) || 0;
        return asc ? aVal - bVal : bVal - aVal;
      }

      return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    rows.forEach(r => tbody.appendChild(r));
    renumberRows();
  }

  // Allow color input to change accent
  sampleColor && sampleColor.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent', e.target.value);
  });

  // Make any contenteditable cell commit on Enter (prevent newline)
  dataTable.addEventListener('keydown', (e) => {
    const el = e.target;
    if (el.isContentEditable && e.key === 'Enter') {
      e.preventDefault();
      el.blur();
    }
  });

})();

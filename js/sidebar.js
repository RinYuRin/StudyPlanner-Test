const menuIcon = document.getElementById('menu-icon');
  const sidebar = document.getElementById('sidebar');
  const spans = document.querySelectorAll('#sidebar-menu span');

  menuIcon.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-20', !isCollapsed);
    spans.forEach((span) => {
      span.classList.toggle('hidden', !isCollapsed);
    });
  });
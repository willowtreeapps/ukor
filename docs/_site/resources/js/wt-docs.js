(function() {
    const mainNav = document.querySelector('.site-navigation'),
        menu = document.getElementById('main-nav-menu'),
        icon = mainNav.querySelector('.menu-icon');

    mainNav.addEventListener('click', (e) => {
        if (e.target && e.target.closest('.menu-icon') != null) {
            if (menu.classList.contains('closed')) {
                menu.classList.remove('closed');
                icon.classList.add('opened');
            }
            else {
                menu.classList.add('closed');
                icon.classList.remove('opened');
            }
        }
    });
})();
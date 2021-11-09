function data() {
  function getThemeFromLocalStorage() {
    // if user already changed the theme, use it
    if (window.localStorage.getItem("dark")) {
      return JSON.parse(window.localStorage.getItem("dark"));
    }

    // else return their preferences
    return (
      !!window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function setThemeToLocalStorage(value) {
    window.localStorage.setItem("dark", value);
  }

  return {
    dark: getThemeFromLocalStorage(),
    toggleTheme() {
      this.dark = !this.dark;
      setThemeToLocalStorage(this.dark);
    },
    isSideMenuOpen: false,
    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
    },
    closeSideMenu() {
      this.isSideMenuOpen = false;
    },
    isNotificationsMenuOpen: false,
    toggleNotificationsMenu() {
      this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    },
    closeNotificationsMenu() {
      this.isNotificationsMenuOpen = false;
    },
    isProfileMenuOpen: false,
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    closeProfileMenu() {
      this.isProfileMenuOpen = false;
    },
    isPagesMenuOpen: false,
    togglePagesMenu() {
      this.isPagesMenuOpen = !this.isPagesMenuOpen;
    },

    // Modal edit
    isModalOpenEdit: false,
    trapCleanupEdit: null,
    openModalEdit(url) {
      loadContentHtml(url,'#contentEditModal')
      this.isModalOpenEdit = true;
      this.trapCleanupEdit = focusTrap(document.querySelector("#modalEdit"));
    },
    closeModalEdit() {
      $('#contentEditModal').html('');
      this.isModalOpenEdit = false;
      this.trapCleanupEdit();
    },

    // Modal  new
    isModalOpenNew: false,
    trapCleanupNew: null,
    openModalNew(url) {
      loadContentHtml(url,'#contentNewModal')
      this.isModalOpenNew = true;
      this.trapCleanupNew = focusTrap(document.querySelector("#modalNew"));
    },
    closeModalNew() {
      $('#contentEditModal').html('');
      this.isModalOpenNew = false;
      this.trapCleanupNew();
    },
  };
}

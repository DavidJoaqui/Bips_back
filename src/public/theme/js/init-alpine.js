function data() {
  function getThemeFromLocalStorage() {
    // if user already changed the theme, use it
    if (window.localStorage.getItem("dark")) {
      return JSON.parse(window.localStorage.getItem("dark"));
    }

    // else return their preferences
    return false;
    return (
      !!window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }
  function getIsSideMenuOpenFromStorage(_return) {
    if (window.localStorage.getItem("isSideMenuOpen")) {
      return window.localStorage.getItem("isSideMenuOpen") === 'true';
    }
    return _return;
  }

  function setIsSideMenuOpenStorage(value) {
    window.localStorage.setItem("dark", value);
  }


  function setThemeToLocalStorage(value) {
    window.localStorage.setItem("isSideMenuOpen", value);
  }

  return {
    dark: getThemeFromLocalStorage(),
    toggleTheme() {
      this.dark = !this.dark;
      setThemeToLocalStorage(this.dark);
    },
    isSideMenuOpen: false,
    isSideMenuDesktopOpen : getIsSideMenuOpenFromStorage(true),
    toggleSideMenu() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
      if(navigator.userAgent.match(toMatch)){
        this.isSideMenuOpen = !this.isSideMenuOpen;
        setThemeToLocalStorage(this.isSideMenuOpen);
      } else{
        this.isSideMenuDesktopOpen = !this.isSideMenuDesktopOpen;
        setThemeToLocalStorage(this.isSideMenuDesktopOpen);
      }
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
    openModalEdit(url,classSize) {
      const modalId="#modalEdit";
      removeClassModal(modalId)
      addClassModal(classSize,modalId);
      loadContentHtml(url,'#contentEditModal')
      this.isModalOpenEdit = true;
      this.trapCleanupEdit = focusTrap(document.querySelector(modalId));
    },
    closeModalEdit() {
      $('#contentEditModal').html('');
      this.isModalOpenEdit = false;
      this.trapCleanupEdit();
    },

    // Modal  new
    isModalOpenNew: false,
    trapCleanupNew: null,
    openModalNew(url,classSize) {
      const modalId="#modalNew";
      removeClassModal(modalId)
      addClassModal(classSize,modalId);
      loadContentHtml(url,'#contentNewModal')
      this.isModalOpenNew = true;
      this.trapCleanupNew = focusTrap(document.querySelector(modalId));
    },
    closeModalNew() {
      $('#contentNewModal').html('');
      this.isModalOpenNew = false;
      this.trapCleanupNew();
    },


    // Modal detail
    isModalOpenDetail: false,
    trapCleanupDetail: null,
    openModalDetail(url,classSize) {
      const modalId="#modalDetail";
      removeClassModal(modalId)
      addClassModal(classSize,modalId);
      loadContentHtml(url,'#contentDetailModal')
      this.isModalOpenDetail = true;
      this.trapCleanupDetail = focusTrap(document.querySelector(modalId));
    },
    closeModalDetail() {
      $('#contentDetailModal').html('');
      this.isModalOpenDetail = false;
      this.trapCleanupDetail();
    },


        // Modal detail
        isModalOpenDetailTwo: false,
        trapCleanupDetailTwo: null,
        openModalDetailTwo(url,classSize) {
          const modalId="#modalDetailTwo";
          removeClassModal(modalId)
          addClassModal(classSize,modalId);
          loadContentHtml(url,'#contentDetailTwoModal')
          this.isModalOpenDetailTwo = true;
          this.trapCleanupDetailTwo = focusTrap(document.querySelector(modalId));
        },
        closeModalDetailTwo() {
          $('#contentDetailTwoModal').html('');
          this.isModalOpenDetailTwo = false;
          this.trapCleanupDetailTwo();
        },
  };
}

function removeClassModal(htmlModal){
  $(htmlModal).removeClass( "sm:m-4 sm:max-w-xl xl:max-w-xl" )
}
function addClassModal(classSize,htmlModal){
  if(classSize){
    if(classSize=='sm'){
      $(htmlModal).addClass( "myClass yourClass" );
    }else if(classSize=='ms'){
      $(htmlModal).addClass( "myClass yourClass" );
    }else if(classSize=='xl'){
      $(htmlModal).addClass("sm:m-4 xl:max-w-xl");
    }
  }else{
    $(htmlModal).addClass( "sm:m-4 sm:max-w-xl" );
  }
}

window.alpine = data()


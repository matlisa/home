// We import components into components.js so that
// we can prebuild them into a Webpack DLL file.
import {
  MDCCheckbox,
  MDCChipSet,
  MDCDialog,
  MDCDrawer,
  MDCFormField,
  MDCIconButtonToggle,
  MDCLinearProgress,
  MDCList,
  MDCMenu,
  MDCRadio,
  MDCRipple,
  MDCSelect,
  MDCSnackbar,
  MDCSwitch,
  MDCTabBar,
  MDCTextField,
  MDCTextFieldHelperText,
  MDCTopAppBar
} from './components';

// Import my theme variables
import themeName from './my-theme';

import Prism from 'prismjs';


// Select DOM elements
const listEl = document.querySelector('.mdc-drawer:not(.live-proto-material-lessons-drawer) .mdc-list');
const materialLessonsDrawerEl = document.querySelector('.material-lessons-drawer');
const materialLessonsTopAppBarEl = document.querySelector('.material-lessons-top-app-bar');

const mainContentEl = document.querySelector('.main-content');

// Theme name
materialLessonsDrawerEl.querySelector('.theme-name').textContent = themeName;

// Initalize drawer and list

let modalDrawer = null;

const initModalDrawer = (topAppBarEl) => {
  materialLessonsDrawerEl.classList.add("mdc-drawer--modal");
  modalDrawer = MDCDrawer.attachTo(materialLessonsDrawerEl);
  modalDrawer.open = false;

  const topAppBar = new MDCTopAppBar(topAppBarEl);
  topAppBar.setScrollTarget(mainContentEl);
  topAppBar.listen('MDCTopAppBar:nav', () => {
    modalDrawer.open = !modalDrawer.open;
  });

  const list = new MDCList(listEl);
  list.wrapFocus = true;
  listEl.addEventListener('click', (event) => {
    modalDrawer.open = false;
  });
}

const destroyModalDrawer = () => {
  if (modalDrawer) {
    modalDrawer.destroy();
  }
  materialLessonsDrawerEl.classList.remove("mdc-drawer--modal");
}

const list = new MDCList(listEl);
list.singleSelection = true;
list.wrapFocus = true;
list.listElements.map((listItemEl) => new MDCRipple(listItemEl));

// Toggle between permanent drawer and modal drawer at breakpoint 1450px
const resizeHandler = () => {
  if (window.matchMedia("(max-width: 1450px)").matches) {
    initModalDrawer(materialLessonsTopAppBarEl);
    mainContentEl.classList.add('mdc-top-app-bar--short-fixed-adjust');
  } else {
    destroyModalDrawer();
    mainContentEl.classList.remove('mdc-top-app-bar--short-fixed-adjust');
  }
}

window.addEventListener('resize', resizeHandler);
resizeHandler();


// Top App Bar/Drawer in Live Prototype
const liveProto = document.querySelector('.subsystem-live-proto');

const liveDemoTopAppBarEl = document.querySelector('.subsystem-live-proto .mdc-top-app-bar');
const liveDemoDrawerEl = document.querySelector('.subsystem-live-proto .mdc-drawer');

if (liveProto && liveDemoTopAppBarEl && liveDemoDrawerEl) {
  const topAppBarComponent = new MDCTopAppBar(liveDemoTopAppBarEl);
  const drawer = new MDCDrawer(liveDemoDrawerEl);
  topAppBarComponent.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
  });
}


// Portfolio Template
if (document.querySelector('.portfolio-template')) {
  const portfolioPages = [
    'portfolio-work',
    'portfolio-about',
    'portfolio-contact',
    'portfolio-project'
  ];
  const switchToPortfolioPage = (pageName) => {
    portfolioPages.forEach((page) => {
      if (page === pageName) {
        document.querySelector('.' + page).style.display = 'block';
      } else {
        document.querySelector('.' + page).style.display = 'none';
      }
    });
  }

  document.querySelector('.portfolio-work-button').addEventListener('click', () => switchToPortfolioPage('portfolio-work'));
  document.querySelector('.portfolio-about-button').addEventListener('click', () => switchToPortfolioPage('portfolio-about'));
  document.querySelector('.portfolio-contact-button').addEventListener('click', () => switchToPortfolioPage('portfolio-contact'));
  const portfolioCards = Array.from(document.querySelectorAll('.portfolio-work .mdc-card'));
  portfolioCards.forEach((card) => card.addEventListener('click', () => switchToPortfolioPage('portfolio-project')));

  const portfolioTemplateResizeHandler = () => {
    const portfolioTopAppBarEl = document.querySelector('.portfolio-top-app-bar');
    if (window.matchMedia("(max-width: 1450px)").matches) {
      portfolioTopAppBarEl.querySelector('.mdc-top-app-bar__navigation-icon').style.display = 'block';
      initModalDrawer(portfolioTopAppBarEl);
    } else {
      portfolioTopAppBarEl.querySelector('.mdc-top-app-bar__navigation-icon').style.display = 'none';
      destroyModalDrawer();
    }
  }

  switchToPortfolioPage('portfolio-work');
  materialLessonsTopAppBarEl.style.display = 'none';
  window.removeEventListener('resize', resizeHandler);
  window.addEventListener('resize', portfolioTemplateResizeHandler);
  portfolioTemplateResizeHandler();
}


// Media Template

if (document.querySelector('.media-template')) {
  const mediaTemplateResizeHandler = () => {
    const mediaTopAppBarEl = document.querySelector('.media-top-app-bar');
    if (window.matchMedia("(max-width: 1450px)").matches) {
      mediaTopAppBarEl.querySelector('.mdc-top-app-bar__navigation-icon').style.display = 'block';
      initModalDrawer(mediaTopAppBarEl);
    } else {
      mediaTopAppBarEl.querySelector('.mdc-top-app-bar__navigation-icon').style.display = 'none';
      destroyModalDrawer();
    }
  }

  materialLessonsTopAppBarEl.style.display = 'none';
  window.removeEventListener('resize', resizeHandler);
  window.addEventListener('resize', mediaTemplateResizeHandler);
  mediaTemplateResizeHandler();
}


// Color Variable Visualizer
if (document.querySelector('.color-page')) {
  const rgbToHex = (col) => {
    if(col.charAt(0)=='r') {
      col=col.replace('rgb(','').replace(')','').split(',');
      var r=parseInt(col[0], 10).toString(16);
      var g=parseInt(col[1], 10).toString(16);
      var b=parseInt(col[2], 10).toString(16);
      r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
      var colHex='#'+r+g+b;
      return colHex;
    }
  }

  const visualizeColorVar = (elem) => {
    // Get background value of color component and sanitize
    const bgColor = rgbToHex(getComputedStyle(elem).backgroundColor) || '';
    const colorHex = elem.querySelector('.color-hex');
    const textnode = document.createTextNode(`${bgColor}`);
    colorHex.appendChild(textnode); 
  }

  [...document.querySelectorAll('.color-square')].forEach(visualizeColorVar);
  [...document.querySelectorAll('.color-square-desc--text')].forEach(visualizeColorVar);
  [...document.querySelectorAll('.grey-tone')].forEach(visualizeColorVar);
}


// Initialize all other components

// Button
const buttonEls = Array.from(mainContentEl.querySelectorAll('.mdc-button'));
buttonEls.forEach((el) => new MDCRipple(el));

// Icon button
const iconButtonEls = Array.from(mainContentEl.querySelectorAll('.mdc-icon-button:not(#icon-toggle-button'));
iconButtonEls.forEach((el) => new MDCRipple(el));

// Icon button toggle
const iconToggleEl = mainContentEl.querySelector('#icon-toggle-button');
if (iconToggleEl) {
  const iconToggle = new MDCIconButtonToggle(iconToggleEl);
  iconToggle.unbounded = true;
}

// Card
const cardPrimaryActionEls = Array.from(mainContentEl.querySelectorAll('.mdc-card__primary-action'));
cardPrimaryActionEls.forEach((el) => new MDCRipple(el));

// Chips
const chipSetEls = Array.from(mainContentEl.querySelectorAll('.mdc-chip-set'));
chipSetEls.forEach((el) => new MDCChipSet(el));

// Text field
const textFieldEls = Array.from(mainContentEl.querySelectorAll('.mdc-text-field'));
textFieldEls.forEach((el) => {
  let textField = new MDCTextField(el);
  if (el.classList.contains('text-field-with-input')) {
    textField.value = 'Input text';
  }
});
const helperTextEls = Array.from(mainContentEl.querySelectorAll('.mdc-text-field-helper-text'));
helperTextEls.forEach((el) => new MDCTextFieldHelperText(el));

// Linear progress
const linearProgressEl = mainContentEl.querySelector('.mdc-linear-progress');
if (linearProgressEl) {
  const linearProgress = new MDCLinearProgress(linearProgressEl);
  linearProgress.progress = 0.5;
}

// FAB
const fabEls = Array.from(mainContentEl.querySelectorAll('.mdc-fab'));
fabEls.forEach((el) => new MDCRipple(el));

// Checkbox
const checkboxEls = Array.from(mainContentEl.querySelectorAll('.mdc-checkbox'));
checkboxEls.forEach((el) => {
  let checkbox = new MDCCheckbox(el);
  if (el.classList.contains('indeterminate-checkbox')) {
    checkbox.indeterminate = true;
  }
});

// Radio
const radioEls = Array.from(mainContentEl.querySelectorAll('.mdc-radio'));
radioEls.forEach((el) => new MDCRadio(el));

// Switch
const switchEls = Array.from(mainContentEl.querySelectorAll('.mdc-switch'));
switchEls.forEach((el) => new MDCSwitch(el));

// Top app bar
// Only initialize for components sheet
const topAppBarEls = Array.from(mainContentEl.querySelectorAll('.mdc-top-app-bar'));
topAppBarEls.forEach((el) => {
  if (!el.classList.contains('live-proto-top-app-bar')) {
    return new MDCTopAppBar(el);
  }
});

// List
const listEls = Array.from(mainContentEl.querySelectorAll('.mdc-list'));
listEls.forEach((el) => {
  if (!el.parentElement.classList.contains('mdc-drawer__content')) {
    let list = new MDCList(el);
    list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
    list.singleSelection = true;
  }
});

// Select
const selectEls = Array.from(mainContentEl.querySelectorAll('.mdc-select'));
selectEls.forEach((el) => new MDCSelect(el));

// Snackbar
const snackbarEl = mainContentEl.querySelector('.mdc-snackbar');
if (snackbarEl) new MDCSnackbar(snackbarEl);

// Dialog
const dialogEl = mainContentEl.querySelector('.mdc-dialog');
if (dialogEl) new MDCDialog(dialogEl);

// Menu
const menuEl = mainContentEl.querySelector('.mdc-menu');
if (menuEl) {
  const menu = new MDCMenu(menuEl);
  menu.open = true;
  // Override MDCMenuSurfaceFoundation so the menu never closes
  menu.menuSurface_.foundation_.close = () => {};
  // Focus first component when menu is done opening
  menuEl.addEventListener('MDCMenuSurface:opened', () => document.querySelector('.mdc-button').focus());
}

// Tabs
const tabBarEl = mainContentEl.querySelector('.mdc-tab-bar');
if (tabBarEl) new MDCTabBar(tabBarEl);


// Live demo components 

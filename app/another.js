import 'react';
import 'font-awesome/css/font-awesome.css';
import 'purecss';
import './another.css';
import component from './component';

console.log('from another.js: ',process.env);
let demoComponent = component('Another page');
document.body.appendChild(demoComponent);
// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept('./component', () => {
    const nextComponent = demoComponent;
    // Replace old content with the hot loaded one
    document.body.replaceChild(nextComponent,demoComponent);
    demoComponent = nextComponent;
  });
}
import 'react';
import 'font-awesome/css/font-awesome.css';
import 'purecss';
import './main.css';
import component from './component';
import { bake } from './shake';

bake();
let demoComponent = component('Main page');
document.body.appendChild(demoComponent);
console.log('from index.js', process.env); //you can access all env vars here
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

const React = require('react');
const ReactDOM = require('react-dom');

const SSR = <div onClick={() => alert('Hello buddy')}> Hello world </div>;

// Render only in the browser, export otherwise
//console.log(typeof document)
if (typeof document === 'undefined') {
  module.exports = SSR;
} else {
  ReactDOM.render(SSR, document.getElementById('app'));
}

// Interactive demo — launches the app with demo sequence auto-start
import React from 'react';
import { render } from 'ink';
import { App } from './src/app.js';

// Demo mode launches the app with the demo sequence enabled
render(React.createElement(App, { demoAutoStart: true }));

import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
// const anotherElement = (
//     <a href="https://google.com" target='_blank'>visit google</a>
// )


const usernames = "pranaychikankar1"
const reactElement = React.createElement(
    'a',
    {href: 'https://google.com', target:'_blank' },
    'click me to visit',
     usernames
);
createRoot(document.getElementById('root')).render(
 reactElement 
)

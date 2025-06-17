function customRender(reactElement, container) {
   /*
    const DomElement = document.createElement
        (reactElement.type)
    DomElement.innerHTML = reactElement.Children
    DomElement.setAttribute('href', reactElement.props.href)
    DomElement.setAttribute('target', reactElement.props.target)

    container.appendChild(DomElement)
    */
    const DomElement = document.createElement
    (reactElement.type)
     DomElement.innerHTML = reactElement.Children
     for (const prop in reactElement.props) {
      DomElement.setAttribute(prop, reactElement.props[prop])
     }
     container.appendChild(DomElement)
}

const reactElement = {
    type: 'a',
    props: {
        href: 'https://google.com',
        target: '_blank'
    },
    Children: 'click me to visit google'
}

const mainContainer = document.querySelector('#root')

customRender(reactElement, mainContainer)
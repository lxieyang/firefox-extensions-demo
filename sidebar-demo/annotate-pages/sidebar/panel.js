var myWindowId;
var isOpen = true;

// select the content box using ES6 query selector
const contentBox = document.querySelector("#content");

/*
Make the content box editable as soon as the user mouses over the sidebar
*/
window.addEventListener("mouseover", () => {
    contentBox.setAttribute("contenteditable", true)
});

/*
When the user mouese out, save the current cotents of the box.
*/
window.addEventListener("mouseout", () => {
    contentBox.setAttribute("contenteditable", false);
    browser.tabs.query({
        windowId: myWindowId,
        active: true
    }).then((tabs) => {
        let contentToStore = {};
        contentToStore[tabs[0].url] = contentBox.innerHTML;     // could've been contentBox.textContent
        browser.storage.local.set(contentToStore);
        console.log("added entry: " + JSON.stringify(contentToStore));
    });
});

/* 
Update the sidebar's content.

1) Get the active tab in this sidebar's window
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
    browser.tabs.query({
        windowId: myWindowId,
        active: true
    }).then((tabs) => {
        return browser.storage.local.get(tabs[0].url);  // returning another promise in this then() block
    }).then((storedInfo) => {
        console.log("retrieved entry: " + JSON.stringify(storedInfo));
        contentBox.innerHTML = storedInfo[Object.keys(storedInfo)[0]] != null 
            ? storedInfo[Object.keys(storedInfo)[0]] 
            : '';
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({
    populate: true
}).then((windowInfo) => {
    myWindowId = windowInfo.id;
    updateContent();
})
function openSidebar() {
    browser.sidebarAction.open();
    browser.sidebarAction.close();
    browser.sidebarAction.open();
    updateContent();
    isOpen = true;
}

function closeSidebar() {
    browser.sidebarAction.close();
    browser.sidebarAction.open();
    browser.sidebarAction.close();
    isOpen = false;
}

function toggleSiderbar() {
    switch (isOpen) {
        case true:
            closeSidebar();
            break;
        case false:
            openSidebar();
            break;
    }
}

browser.browserAction.onClicked.addListener(toggleSiderbar);
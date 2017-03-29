﻿function BoxgrovePage() {
    /// <summary>
    /// Default Constructor
    /// </summary>

    this.Initialize();
}

BoxgrovePage.prototype.Initialize = function () {
    window.MainNav.SubscribeToDialClick(
        $.proxy(this.CloseClick, this)
    );
};

BoxgrovePage.prototype.CloseClick = function (selectedPageId) {
    /// <summary>
    /// Event handler to return to work page
    /// </summary>
    if (selectedPageId === 'work-boxgrove') {
        window.MainNav.NavigateTo('/Work');
    }
};

// Initializer
(function LoadWorkBoxGroveScript() {
    if (window.MainNav) {
        new BoxgrovePage();
    } else {
        window.setTimeout(LoadWorkBoxGroveScript, 50);
    }
})();
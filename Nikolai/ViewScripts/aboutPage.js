﻿//#region Constructors
function AboutPage() {
    this.Initialize();

    this.msLogo = new window.PolyEffect(document.getElementById('msLogoSvg'));
}
//#endregion

//#region Properties
AboutPage.prototype = {
    pageElmts: [],
    $ContainerElmt: null,
    $NavDotsElmt: null,
    selectedPageIndex: 0,
    previousPageIndex: 0,
    totalPages: 0,
    scroll: {
        isThrottled: false,
        throttleDuration: 1000
    },
    debug: {
        // Debugging for poly positioning
        polyContainerSelector: '.about-screen__img',
        enableDebugMode: false,
        nodeCount: 0,
        nodeScss: ''
    },
    AnimEndEventNames: {
        'WebkitAnimation': 'webkitAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd',
        'animation': 'animationend'
    },
    GetAnimEndEventName: function () {
        /// <summary>
        /// Returns animation event prefixed by browser
        /// </summary>
        return this.AnimEndEventNames[window.Modernizr.prefixed('animation')];
    }
};
//#endregion

//#region Event Handlers
AboutPage.prototype.OnPageChange = function (pageId) {
    /// <summary>
    /// Function which is called when page is changed
    /// </summary>
    if (pageId && pageId === 'about') {
        this.EnablePageIndicator();
        this.UpdateStyling();
        this.SubscribeToPageSpecificEvents();
        this.TriggerTextAnimation('up');
    } else {
        this.DisablePageIndicator();
        this.UnsubscribeToPageSpecificEvents();
    }
};

AboutPage.prototype.OnDialDropped = function () {
    if (window.MainNav.NavBar.DialControl.$Element.hasClass('nvDial--pulsing') === true) {
        window.MainNav.NavBar.DialControl.$Element.removeClass('nvDial--pulsing');

        // Animation Frames
        this.pageElmts.eq(this.selectedPageIndex).addClass('about-screen--animState2');

        window.setTimeout(() => {
            this.pageElmts.eq(this.selectedPageIndex).addClass('about-screen--animState3');

            window.setTimeout(() => {
                this.msLogo.StepToOriginalPosition(600);

                this.pageElmts.eq(this.selectedPageIndex).addClass('about-screen--animState4');

                $(this.msLogo.svgElmt).addClass('about-screen__img-certification');

                window.setTimeout(() => {
                    this.pageElmts.eq(this.selectedPageIndex).addClass('about-screen--animState5');
                }, 3000);
            }, 500);
        }, 500);
    }
};

AboutPage.prototype.OnDialDragged = function () {
    let isInBounds = false;
    const targetElmt = document.querySelectorAll('[data-nv-drop-target]');

    if (window.MainNav.NavBar.DialControl.IsDialWithinElmt(targetElmt[0])) {
        isInBounds = true;
    }

    if (isInBounds) {
        if (window.MainNav.NavBar.DialControl.$Element.hasClass('nvDial--pulsing') === false) {

            window.MainNav.NavBar.DialControl.$Element.addClass('nvDial--pulsing');
        }
    } else {
        if (window.MainNav.NavBar.DialControl.$Element.hasClass('nvDial--pulsing') === true) {

            window.MainNav.NavBar.DialControl.$Element.removeClass('nvDial--pulsing');
        }
    }
};

AboutPage.prototype.OnTargetClick = function () {
    window.MainNav.NavBar.DialControl.$Element.effect({
        effect: 'bounce'
        , direction: 'up'
        , distance: 40
        , times: 3
    });
};

AboutPage.prototype.OnPageMouseWheel = function (evt) {
    var that = this;

    evt.preventDefault();

    if (this.scroll.isThrottled) {
        return false;
    } else {
        this.scroll.isThrottled = true;
    }

    window.setTimeout(function () {
        that.scroll.isThrottled = false;
    }, this.scroll.throttleDuration);

    //if (evt.originalEvent.wheelDelta > 0) {
    if (evt.wheelDelta > 0) {
        if (this.selectedPageIndex === 0) {
            return false;
        } else {
            this.UpSection();
        }
    } else {
        if (this.selectedPageIndex >= this.totalPages - 1) {
            return false;
        } else {
            this.DownSection();
        }
    }
};
//#endregion

//#region Methods
AboutPage.prototype.Initialize = function () {
    // Set Properties
    this.pageElmts = $('[data-nv-about-page]');
    this.$ContainerElmt = this.pageElmts.parent();
    this.totalPages = this.pageElmts.length;
    this.$NavDotsElmt = $('#pnlAboutPageIndicator');

    // Bind Scope
    this.OnPageMouseWheel = $.proxy(this.OnPageMouseWheel, this);

    // Event Handlers
    window.MainNav.SubscribeToOnPageChange(
        $.proxy(this.OnPageChange, this)
    );

    // Initialize functionality
    this.ToggleClipPathPositionHelper();
    this.RenderNavDots();
    this.SetupTextAnimation();
};

/**
 * Wraps a string around each word
 *
 * @param {string} str The string to transform
 * @param {string} tmpl Template that gets interpolated
 * @returns {string} The given input splitted by words
 */
AboutPage.prototype.WrapWords = function (str, tmpl) {
    return str.replace(/\w+/g, tmpl || "<span>$&</span>");
};

AboutPage.prototype.SetupTextAnimation = function () {
    const $animateElmt = $('#about [data-nv-animate]');

    $animateElmt.each((i, elmt) => {
        const override = $(elmt).attr('data-nv-animate');

        if (override !== 'noWrap') {
            const text = this.WrapWords($(elmt).text());

            $(elmt).empty().append(text);
        }
    }).addClass('text-transition-text--start');
};

AboutPage.prototype.SubscribeToPageSpecificEvents = function () {
    window.MainNav.NavBar.DialControl.SubscribeToDragEvent(
        $.proxy(this.OnDialDragged, this)
    );

    window.MainNav.NavBar.DialControl.SubscribeToDropEvent(
        $.proxy(this.OnDialDropped, this)
    );

    window.addEventListener("mousewheel", this.OnPageMouseWheel, { passive: false });

    this.pageElmts.on(this.GetAnimEndEventName(), $.proxy(this.ResetPageTransitionStyling, this));

    $('[data-nv-drop-target]').on('click', this.OnTargetClick);
};

AboutPage.prototype.UnsubscribeToPageSpecificEvents = function () {
    window.MainNav.NavBar.DialControl.UnsubscribeToDragEvent(
        $.proxy(this.OnDialDragged, this)
    );

    window.MainNav.NavBar.DialControl.UnsubscribeToDropEvent(
        $.proxy(this.OnDialDropped, this)
    );

    window.removeEventListener("mousewheel", this.OnPageMouseWheel, { passive: false });

    $('[data-nv-drop-target]').off('click', this.OnTargetClick);
};

AboutPage.prototype.ToggleClipPathPositionHelper = function () {
    if (this.debug.enableDebugMode) {
        var that = this;

        $('body').on('click', function (e) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;

            var shapesoffsetX = $(that.debug.polyContainerSelector).offset().left;
            var shapesoffsetY = $(that.debug.polyContainerSelector).offset().top;

            var polygonswidth = $(that.debug.polyContainerSelector).width();
            var polygonsheight = $(that.debug.polyContainerSelector).height();

            var shapesmouseX = mouseX - shapesoffsetX;
            var shapesmouseY = mouseY - shapesoffsetY;

            var mousepercentX = shapesmouseX / polygonswidth;
            var mousepercentY = shapesmouseY / polygonsheight;

            var finalmouseX = (mousepercentX) * 100;
            var finalmouseY = (mousepercentY) * 100;
            var normalisedX = parseFloat(finalmouseX).toFixed(3);
            var normalisedY = parseFloat(finalmouseY).toFixed(3);

            that.debug.nodeCount = that.debug.nodeCount + 1;

            if (that.debug.nodeCount < 3) {
                that.debug.nodeScss = that.debug.nodeScss + normalisedX + '% ' + normalisedY + '% ,';
            } else
                if (that.debug.nodeCount == 3) {
                    that.debug.nodeScss = that.debug.nodeScss + normalisedX + '% ' + normalisedY + '% );';
                    alert(that.debug.nodeScss);
                    that.debug.nodeScss = '-webkit-clip-path: polygon( ';
                    that.debug.nodeCount = 0;
                }
        });
    }
};

AboutPage.prototype.RenderNavDots = function () {
    for (var i = 0; i < this.totalPages; i++) {
        var $navDot = $('<span></span>', {
            "class": "about-PageIndicator"
        });

        if (i === 0) {
            $navDot.addClass('about-PageIndicator--selected');
        }

        this.$NavDotsElmt.append($navDot);
    }
};

AboutPage.prototype.UpdateNavStyling = function () {
    var selectedTheme = this.pageElmts.eq(this.selectedPageIndex).data('nv-about-page');

    if (selectedTheme === 'darkTheme') {
        // Set Opposite to BG. I.E a dark bg get's a white nav
        window.MainNav.SetMenuBtnTheme('light');

        this.$NavDotsElmt.addClass('about-PageIndicatorContainer--light');
    } else {
        window.MainNav.SetMenuBtnTheme('dark');

        this.$NavDotsElmt.removeClass('about-PageIndicatorContainer--light');
    }
};

AboutPage.prototype.UpdateStyling = function () {
    /// <summary>
    /// Updates the styling based on what is set for
    /// data-nv-about-page attribute
    /// </summary>
    this.UpdateSelectedNavDot();
    this.UpdateNavStyling();
};

AboutPage.prototype.ResetTextAnimation = function () {
    $(this.pageElmts).each((i, elmt) => {
        if (i !== this.selectedPageIndex) {
            window.setTimeout(() => {
                $('[data-nv-animate]', elmt)
                    .removeClass('text-transition-up--end')
                    .removeClass('text-transition-down--end');
            }, 300);
        }
    });
};

AboutPage.prototype.TriggerTextAnimation = function (direction) {
    const $elmts = $('[data-nv-animate]', this.pageElmts.eq(this.selectedPageIndex));
    const triggerAnimation = (elmt, delay, animationClass) => {
        window.setTimeout(() => {
            $(elmt).addClass(animationClass);
        }, delay);
    };

    this.ResetTextAnimation();

    switch (direction) {
        case 'up':
            $elmts.each((x, elmt) => {
                triggerAnimation(
                    elmt,
                    Number($(elmt).attr('data-nv-animate-delay')),
                    'text-transition-down--end'
                );
            });
            break;
        case 'down':
            $elmts.each((x, elmt) => {
                triggerAnimation(
                    elmt,
                    Number($(elmt).attr('data-nv-animate-delay')),
                    'text-transition-up--end'
                );
            });
            break;
    }
};

AboutPage.prototype.UpdateSelectedNavDot = function () {
    /// <summary>
    /// Changes the selected dot based on what is specified for the 
    /// selectedPageIndex property
    /// </summary>
    $('.about-PageIndicator', this.$NavDotsElmt)
        .removeClass('about-PageIndicator--selected')
        .eq(this.selectedPageIndex)
        .addClass('about-PageIndicator--selected');
};

AboutPage.prototype.EnablePageIndicator = function () {
    this.$NavDotsElmt.addClass('about-PageIndicatorContainer--active');
};

AboutPage.prototype.DisablePageIndicator = function () {
    this.$NavDotsElmt.removeClass('about-PageIndicatorContainer--active');
};

AboutPage.prototype.UpSection = function () {
    this.pageElmts.eq(this.selectedPageIndex)
        .addClass('expand-container-ontop expand-moveToBottom');

    this.previousPageIndex = this.selectedPageIndex;
    this.selectedPageIndex--;

    this.pageElmts.eq(this.selectedPageIndex)
        .addClass('expand-moveFromTop about-screen--selected');

    this.UpdateStyling();

    this.TriggerTextAnimation('up');
};

AboutPage.prototype.DownSection = function () {
    this.pageElmts.eq(this.selectedPageIndex)
        .addClass('expand-container-ontop expand-moveToTop');

    this.previousPageIndex = this.selectedPageIndex;
    this.selectedPageIndex++;

    this.pageElmts.eq(this.selectedPageIndex)
        .addClass('expand-moveFromBottom about-screen--selected');

    this.UpdateStyling();

    this.TriggerTextAnimation('down');
};

AboutPage.prototype.ResetPageTransitionStyling = function (evt) {
    if (evt.target.hasAttribute('data-nv-about-page')) {
        this.pageElmts
            .removeClass('expand-container-ontop')
            .removeClass('expand-moveToTop')
            .removeClass('expand-moveFromBottom')
            .removeClass('expand-moveToBottom')
            .removeClass('expand-moveFromTop');

        this.pageElmts.eq(this.previousPageIndex)
            .removeClass('about-screen--selected');
    }
};
//#endregion

// Initializer
(function LoadAboutScript() {
    if (window.MainNav && window.MainNav.HasNavigationLoaded === true) {
        new AboutPage();
    } else if (window.MainNav) {
        window.MainNav.SubscribeToOnNavigationLoaded(function () {
            new AboutPage();
        });
    } else {
        window.setTimeout(LoadAboutScript, 50);
    }
})();
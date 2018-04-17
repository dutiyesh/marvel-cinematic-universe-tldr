/* Utility functions */
var Utils = (function() {
  function getWindowScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  return {
    getWindowScrollPosition: getWindowScrollPosition
  };
})();


/* Navigation control */
var NavigationControl = function() {
  var _isMobile = false;
  var _lazyLoadDelay = 20;

  function registerEvents() {
    document.getElementById('nextBtn').addEventListener('click', _handleNextClick);
    document.getElementById('prevBtn').addEventListener('click', _handlePrevClick);

    window.addEventListener('scroll', _handleControlsVisibility);

    _handleArrowKeys();
    _handleDeviceType();
  }

  function _getCurrentActiveItem() {
    var scrollPosition = Utils.getWindowScrollPosition();
    var listItems = document.getElementById('timeline').querySelectorAll('.timeline-list__item');
    var lastItemIndex = 0;

    for(var i = 0; i < listItems.length; i++) {
      if (listItems[i].offsetTop <= scrollPosition) {
        lastItemIndex = i;
      }
      if(lastItemIndex === i-1) {
        break;
      }
    }

    return listItems[lastItemIndex];
  }

  function _getItemIndex(element) {
    return Array.prototype.indexOf.call(element.parentElement.children, element);
  }

  function _getDeviceOffset() {
    var deviceOffset = _isMobile ? (window.innerHeight * 30) / 100 : 0; // get 30 percent device height for mobile, since the timeline item is of 130vh height

    return deviceOffset;
  }

  function _handleDeviceType() {
    if(window.innerWidth <= 768) {
      _isMobile = true;
      _lazyLoadDelay = 500;
    }
  }

  function _handleNextClick() {
    var currentActiveItem = _getCurrentActiveItem();
    var currentActiveItemIndex = _getItemIndex(currentActiveItem);
    var nextItem = currentActiveItem.nextElementSibling;
    var deviceOffset = _getDeviceOffset();

    if (!currentActiveItemIndex) {
      var isInViewport = (currentActiveItem.offsetTop + (currentActiveItem.offsetHeight * 99) / 100) > Utils.getWindowScrollPosition() + window.innerHeight + deviceOffset;

      if (isInViewport) {
        nextItem = currentActiveItem;
      }
    }

    if (nextItem) {
      scrollTo(document.documentElement, nextItem.offsetTop);
      setTimeout(function() {
        lazyload(nextItem.querySelectorAll(".lazyload"));
      }, _lazyLoadDelay);
    }
  }

  function _handlePrevClick() {
    var currentActiveItem = _getCurrentActiveItem();
    var currentActiveItemIndex = _getItemIndex(currentActiveItem);
    var prevItem = currentActiveItem.previousElementSibling;
    var deviceOffset = _getDeviceOffset();

    var isInViewport = (currentActiveItem.offsetTop + currentActiveItem.offsetHeight + deviceOffset > Utils.getWindowScrollPosition() + (window.innerHeight * 99) / 100);

    if(!isInViewport) {
      prevItem = currentActiveItem;
    }

    if (prevItem) {
      scrollTo(document.documentElement, prevItem.offsetTop);
      setTimeout(function() {
        lazyload(prevItem.querySelectorAll(".lazyload"));
      }, _lazyLoadDelay);
    }
  }

  function _handleControlsVisibility() {
    debounce(function() {
      var scrollPosition = Utils.getWindowScrollPosition() + window.innerHeight / 2;
      var list = document.getElementById("timeline");
      var visibilityStatus;

      if (scrollPosition > list.offsetTop) {
        visibilityStatus = "block";
      }
      else {
        visibilityStatus = "none";
      }

      list.querySelector(".navigation__control").style.display = visibilityStatus;
    }, 250)();
  }

  function _handleArrowKeys() {
    document.onkeydown = function(event) {
      var key = event.keyCode || event.which;

      switch (key) {
        case 37:
        case 38:
          document.getElementById("prevBtn").click();
          break;

        case 39:
        case 40:
          document.getElementById("nextBtn").click();
          break;

        default:
          break;
      }
    };
  }

  return {
    registerEvents: registerEvents
  }
};


/* GA Tracking */
var Tracking = function() {
  function registerEvents() {
    _handleClickEvent();
  }

  function _handleClickEvent() {
    var elements = document.querySelectorAll(".ga");

    for(var i = 0; i < elements.length; i++) {
      var element = elements[i];

      element.addEventListener("click", _triggerGA.bind(this, element));
    }
  }

  function _triggerGA(element) {
    if(typeof ga !== "undefined") {
      ga("send", "event", element.getAttribute("data-cat"), element.getAttribute("data-act") + "_Click", element.getAttribute("data-lab"));
    }
  }

  return {
    registerEvents: registerEvents
  }
};


/* Lazy load images */
var LazyLoadImages = function() {
  function registerEvents() {
    _handleImageLoad();
  }

  function _handleImageLoad() {
    var images = document.querySelectorAll(".lazyload");
    lazyload(images);
  }

  return {
    registerEvents: registerEvents
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var lazyLoadImages = new LazyLoadImages();
  lazyLoadImages.registerEvents();

  var timelineNavigation = new NavigationControl();
  timelineNavigation.registerEvents();

  var tracking = new Tracking();
  tracking.registerEvents();

}, false);

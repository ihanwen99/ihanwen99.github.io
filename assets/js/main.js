(function () {
  var publicationFilter = "all";
  var publicationGroup = "year";

  function setPressed(buttons, activeButton) {
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", button === activeButton ? "true" : "false");
    });
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("#site-nav");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initNewsToggle() {
    var button = document.querySelector("[data-news-toggle]");
    var extraItems = Array.prototype.slice.call(document.querySelectorAll("[data-news-extra]"));

    if (!button || extraItems.length === 0) {
      return;
    }

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      extraItems.forEach(function (item) {
        item.hidden = expanded;
      });
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? "Show more updates" : "Collapse updates";
    });
  }

  function initEmailLinks() {
    var emailLinks = Array.prototype.slice.call(document.querySelectorAll("[data-email-user]"));

    emailLinks.forEach(function (link) {
      var user = link.dataset.emailUser;
      var domain = link.dataset.emailDomain;
      var tld = link.dataset.emailTld;

      if (!user || !domain || !tld) {
        return;
      }

      var address = user + "@" + domain + "." + tld;
      link.setAttribute("href", "mailto:" + address);
    });
  }

  function publicationMatchesFilter(entry) {
    var isFull = entry.dataset.full === "true";
    var type = entry.dataset.type;

    if (publicationFilter === "full") {
      return isFull;
    }

    if (publicationFilter === "other") {
      return !isFull || ["demo", "workshop", "tutorial", "talk"].indexOf(type) !== -1;
    }

    return true;
  }

  function updatePublications() {
    var views = Array.prototype.slice.call(document.querySelectorAll("[data-publication-view]"));
    var entries = Array.prototype.slice.call(document.querySelectorAll("[data-publication-entry]"));
    var groups = Array.prototype.slice.call(document.querySelectorAll(".publication-group"));

    views.forEach(function (view) {
      var active = view.dataset.publicationView === publicationGroup;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
    });

    entries.forEach(function (entry) {
      entry.hidden = !publicationMatchesFilter(entry);
    });

    groups.forEach(function (group) {
      var visibleEntries = Array.prototype.slice.call(group.querySelectorAll("[data-publication-entry]"))
        .some(function (entry) {
          return !entry.hidden;
        });
      group.hidden = !visibleEntries;
    });
  }

  function initPublicationControls() {
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-pub-filter]"));
    var groupButtons = Array.prototype.slice.call(document.querySelectorAll("[data-pub-group]"));

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        publicationFilter = button.dataset.pubFilter;
        setPressed(filterButtons, button);
        updatePublications();
      });
    });

    groupButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        publicationGroup = button.dataset.pubGroup;
        setPressed(groupButtons, button);
        updatePublications();
      });
    });

    Array.prototype.slice.call(document.querySelectorAll(".chart-pill")).forEach(function (link) {
      link.addEventListener("click", function () {
        var yearButton = document.querySelector('[data-pub-group="year"]');
        publicationGroup = "year";
        if (yearButton) {
          setPressed(groupButtons, yearButton);
        }
        updatePublications();
      });
    });

    updatePublications();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initNewsToggle();
    initEmailLinks();
    initPublicationControls();
  });
})();

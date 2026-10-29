(function () {
  var dialog = document.getElementById("lightbox");
  var shot = document.getElementById("lightbox-img");
  var cap = document.getElementById("lightbox-cap");
  if (!dialog || !shot || !cap) return;

  function openFrom(link) {
    var img = link.querySelector("img");
    if (!img) return;
    shot.src = img.currentSrc || img.src;
    shot.alt = img.alt;
    cap.textContent = link.getAttribute("data-caption") || img.alt;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      var closeBtn = dialog.querySelector("button");
      if (closeBtn) closeBtn.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a.frame, a.cardlink");
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openFrom(link);
  });

  var links = Array.prototype.slice.call(document.querySelectorAll("nav.top .links a"));
  var sections = links
    .map(function (link) {
      var id = (link.getAttribute("href") || "").slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  var current = null;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (link) {
        var on = link.getAttribute("href") === "#" + current;
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
  );
  sections.forEach(function (section) { observer.observe(section); });
})();

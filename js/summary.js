document.addEventListener("DOMContentLoaded", function () {
  const BOTTOMCARD1 = document.getElementById("bottomCard1");
  const BOTTOMCARD2 = document.getElementById("bottomCard2");

  BOTTOMCARD1.addEventListener("mouseenter", function () {
    document
      .getElementById("penIcon")
      .setAttribute("src", "/assets/img/icon_pen_white.svg");
  });
  BOTTOMCARD1.addEventListener("mouseleave", function () {
    document
      .getElementById("penIcon")
      .setAttribute("src", "/assets/img/icon_pen.svg");
  });

  BOTTOMCARD2.addEventListener("mouseenter", function () {
    document
      .getElementById("checkIcon")
      .setAttribute("src", "/assets/img/icon_check_white.svg");
  });
  BOTTOMCARD2.addEventListener("mouseleave", function () {
    document
      .getElementById("checkIcon")
      .setAttribute("src", "/assets/img/icon_check.svg");
  });
});

function getGreeting() {
  let hour = new Date().getHours();
  if (3 <= hour && hour <= 11) {
    return "Good morning";
  }
  if (11 < hour && hour <= 19) {
    return "Good afternoon";
  }
  if (19 < hour || hour < 3) {
    return "Good evening";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const greetingSpan = document.getElementById("greeting");
  greetingSpan.innerText = getGreeting();
});

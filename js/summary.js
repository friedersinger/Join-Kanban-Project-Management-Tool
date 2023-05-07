



document.addEventListener("DOMContentLoaded", function() {
    
    const PENICON = document.getElementById('penIcon');

    PENICON.addEventListener('mouseenter', function() {
      this.setAttribute('src', '/assets/img/icon_pen_white.png');
    });
    
    PENICON.addEventListener('mouseleave', function() {
      this.setAttribute('src', '/assets/img/icon_pen.svg');
    });


});


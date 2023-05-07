



document.addEventListener("DOMContentLoaded", function() {
    
    const BOTTOMCARD1 = document.getElementById('bottomCard1');
    const BOTTOMCARD2 = document.getElementById('bottomCard2');



    BOTTOMCARD1.addEventListener('mouseenter', function() {
      document.getElementById('penIcon').setAttribute('src', '/assets/img/icon_pen_white.svg');
    });
    BOTTOMCARD1.addEventListener('mouseleave', function() {
        document.getElementById('penIcon').setAttribute('src', '/assets/img/icon_pen.svg');
    });


    BOTTOMCARD2.addEventListener('mouseenter', function() {
        document.getElementById('checkIcon').setAttribute('src', '/assets/img/icon_check_white.svg');
      });
      BOTTOMCARD2.addEventListener('mouseleave', function() {
          document.getElementById('checkIcon').setAttribute('src', '/assets/img/icon_check.svg');
      });





});


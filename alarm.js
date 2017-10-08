jQuery.noConflict();

(function ($) {
  var i = 0;
  $(document).ready(function () {
    loadPage();
  });

  function alarmAnimationLoop() {
    var colors = ['#dc143c', '#ff69b4', '#ffa500', '#16a085'];
    $('body').animate({
      backgroundColor: colors[(i++) % colors.length]
    }, 200, function () {
      alarmAnimationLoop();
    });
  }

  function triggerAlarm() {
    if (!$('body').is(':animated')) {
      alarmAnimationLoop();
    } else {
      console.log('Animation is in progress!');
    }
  }

  function disableAlarm() {
    i = 0;
    $('body').stop();
    $('body').animate({
      backgroundColor: '#16a085'
    });
  
    $('#snackbar').addClass('show');
    setTimeout(function() {
      $('#snackbar').removeClass('show');
    }, 5000);
  }

  function loadPage() {
    $('.hour-wrap').click(function (e) {
      triggerAlarm();
    });
    $('.min-wrap').click(function (e) {
      disableAlarm();
    });
  }
})(jQuery);
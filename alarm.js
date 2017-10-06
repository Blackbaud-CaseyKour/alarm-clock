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
    alarmAnimationLoop();
  }

  function disableAlarm() {
    // disable alarm
  }

  function loadPage() {
    $('.clock-wrap').click(function (e) {
      triggerAlarm();
    });
  }
})(jQuery);
jQuery.noConflict();

(function ($) {
  var alarmActive = false;
  var i = 0;
  $(document).ready(function () {
    loadPage();
  });

  function alarmAnimationLoop() {
    var colors = ['#dc143c', '#ff69b4', '#ffa500', '#16a085'];
    $('.clock-wrap').animate({
      backgroundColor: colors[(i++) % colors.length]
    }, 200, function () {
      alarmAnimationLoop();
    });
  }

  function triggerAlarm() {
    alarmActive = true;
    if (!$('.clock-wrap').is(':animated')) {
      alarmAnimationLoop();
    } else {
      console.log('Animation is in progress!');
    }
  }

  function disableAlarm() {
    alarmActive = false;
    i = 0;
    $('.clock-wrap').stop();
    $('.clock-wrap').animate({
      backgroundColor: '#16a085'
    });
  
    $.post('https://otg-alarmclock.azurewebsites.net/api/snooze', '{name}')
      .then(function (results) {
        var message = results.AlexaMessage.replace(/\{name\}/g, results.Name);
        $('#snackbar').html('<strong>Snooze Activated</strong><br /><small>' + message + '</small>');
        $('#snackbar').addClass('show');
        setTimeout(function() {
          $('#snackbar').removeClass('show');
        }, 5000);
      });
  }

  function showSettings() {
    $('#settings').show();
    window.closeSettings = function() {
      $('#settings').hide();
    };
  }

  function loadPage() {
    $('.hour-wrap').click(function (e) {
      e.stopPropagation();
      triggerAlarm();
    });
    $('.clock-wrap').click(function (e) {
      e.stopPropagation();
      if (alarmActive === true) {
        disableAlarm();
      }
    });

    $('.fa-gear').click(function (e) {
      showSettings();
    });
  }
})(jQuery);
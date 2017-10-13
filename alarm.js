jQuery.noConflict();

(function ($) {
  var alarmActive = false;
  var alarmAudio1;
  var alarmAudio2;
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
      $('.snooze').show();
      if (!alarmAudio1) {
        alarmAudio1 = new Audio('audio/Wake-up-sounds.mp3');
        alarmAudio1.loop = true;
      }

      alarmAudio1.play();
      setTimeout(function () {
        if (!alarmAudio2) {
          alarmAudio2 = new Audio('audio/Cuckoo-clock-sound.mp3');
          alarmAudio2.loop = true;
        }

        alarmAudio2.play();
      }, 500);
      alarmAnimationLoop();
    }
  }

  function disableAlarm(snooze) {
    alarmActive = false;
    i = 0;
    $('.clock-wrap').stop();
    $('.clock-wrap').animate({
      backgroundColor: '#007ca6'
    });

    if (alarmAudio1) {
      alarmAudio1.pause();
      alarmAudio1.currentTime = 0;
    }
  
    if (alarmAudio2) {
      alarmAudio2.pause();
      alarmAudio2.currentTime = 0;
    }

    if (snooze) {
      $.post('https://otg-alarmclock.azurewebsites.net/api/snooze', '{name}')
        .then(function (results) {
          var message = results.AlexaMessage.replace(/\{name\}/g, results.Name);
          $('#snackbar').html('<small>' + message + '</small>');
          $('#snackbar').addClass('show');
        });
    }

    $('.snooze').hide();
  }

  function showSettings() {
    $('#settings').show();
  }

  window.addEventListener('message', function () {
    $('#settings').hide();
  }, false);

  function loadPage() {
    $('.hour-wrap').click(function (e) {
      e.stopPropagation();
      triggerAlarm();
    });
    $('.clock-wrap').click(function (e) {
      e.stopPropagation();
      if (alarmActive === true) {
        disableAlarm(false);
      }
    });

    $('.fa-gear').click(function (e) {
      showSettings();
    });

    $('.refresh').click(function () {
      console.log('lolwut');
      window.location.reload();
    });

    $('#snackbar').click(function (e) {
      $('#snackbar').removeClass('show');
    });

    $('.snooze button').click(function (e) {
      disableAlarm(true);
    });

    $('.reset button').click(function () {
      $.ajax({
        url: 'https://otg-alarmclock.azurewebsites.net/api/',
        method: 'post',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify({
          Id: 'testUser',
          DonationLowerBound: Number('0.30'),
          DonationUpperBound: Number('0.85'),
          Name: 'Brandon',
          MySDG: Number('3')
        })
      });
    });
  }
})(jQuery);
(function ($) {
  var sdgCount = 17;
  var selectedSDG = null;

  function render() {
    var imageTemplate = '<div class="sdg-image" data-sdg-id="{num}"><img src="images/sdg/E_SDG goals_icons-individual-rgb-{num}.png" />{selectedIndicator}</div>';

    var selectorContent = '';
    for(var i = 1; i <= sdgCount; i++) {
      var num = i < 10 ? '0' + i : i;
      var imageText = imageTemplate
        .replace(/\{num\}/g, num)
        .replace(/\{selectedIndicator\}/g, selectedSDG == num ? '<i class="fa fa-check-circle"></i>' : '');
      selectorContent += imageText;
    }

    setTimeout(function () {
      $('.sdg-selector').html(selectorContent);
      $('.sdg-image').on('click', onSDGClick);
    }, 0);
  }

  function onSDGClick() {
    selectedSDG = $(this).attr('data-sdg-id');
    render();
  }

  function getSDG() {
    return $.get('https://otg-alarmclock.azurewebsites.net/api/testUser');
  }

  function onSaveClick() {
    $('.overlay').show();
    $.ajax({
      url: 'https://otg-alarmclock.azurewebsites.net/api/',
      method: 'post',
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        Id: 'testUser',
        DonationLowerBound: Number($('#min').val()),
        DonationUpperBound: Number($('#max').val()),
        Name: $('#name').val(),
        MySDG: Number(selectedSDG)
      })
    }).then(function () {
      $('.overlay').hide();
      window.parent.postMessage('message', '*');
    });
  }

  getSDG()
    .done(function (result) {
      $('#name').val(result.Name);
      $('#min').val(Number(result.DonationLowerBound).toFixed(2));
      $('#max').val(Number(result.DonationUpperBound).toFixed(2));

      var number = Number(result.MySDG);
      selectedSDG = number < 10 ? '0' + number : number;
      render();
    });

  window.addEventListener('message', function () {
    window.location.reload();
  }, false);
  
  setTimeout(function () {
    $('.overlay').hide();
    $('#name').keyboard();
    $('#min').keyboard({ layout: 'num' });
    $('#min').on('change', function () {
      $('#min').val(Number($('#min').val()).toFixed(2));
    });

    $('#max').keyboard({ layout: 'num' });
    $('#max').on('change', function () {
      $('#max').val(Number($('#max').val()).toFixed(2));
    });
    
    $('#save').on('click', function () {
      onSaveClick();
    });
  }, 0);
})($);
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
    });
  }

  getSDG()
    .done(function (result) {
      $('#name').val(result.Name);
      $('#min').val(result.DonationLowerBound);
      $('#max').val(result.DonationUpperBound);

      var number = Number(result.MySDG);
      selectedSDG = number < 10 ? '0' + number : number;
      render();
    });

  setTimeout(function () {
    $('.overlay').hide();
    $('#name').keyboard();
    $('#min').keyboard({ layout: 'num' });
    $('#max').keyboard({ layout: 'num' });
    $('#save').on('click', function () {
      onSaveClick();
    });
  }, 0);
})($);
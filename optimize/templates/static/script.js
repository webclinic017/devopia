$(document).ready(function() {
    $('#portfolio-form').on('submit', function(event) {
        event.preventDefault();

        var startDate = $('#start-date').val();
        var endDate = $('#end-date').val();
        var fileInput = $('#file-input')[0].files[0];

        var formData = new FormData();
        formData.append('file', fileInput);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);

        $.ajax({
            type: 'POST',
            url: '/optimize_portfolio',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                window.location.href = '/result?expected_return=' + response.expected_return.toFixed(4) +
                                    '&volatility=' + response.volatility.toFixed(4) +
                                    '&sharpe_ratio=' + response.sharpe_ratio.toFixed(4) +
                                    '&allocation=' + encodeURIComponent(JSON.stringify(response.allocation)) +
                                    '&leftover=' + response.leftover.toFixed(2);
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});
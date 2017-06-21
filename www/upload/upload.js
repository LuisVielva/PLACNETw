function compruebaCaptcha()
{
    if (grecaptcha.getResponse().length === 0)
    {
        grecaptcha.execute();
    }
}

function correctCaptcha(response)
{
}

$(function() 
{
    $('#name').on
    (
        'keypress', 
        function(e) 
        {
            return (e.which >= 97 && e.which <= 122)  // a--z
                || (e.which >= 65 && e.which <= 90)   // A--Z
                || (e.which >= 48 && e.which <= 57)   // 0--9
                || (e.which == 45)  // -
                || (e.which == 95); // _
        }
    );
});

function showProgress(x)
{
    var bar = $('.bar');
    var percent = $('.percent');
    var percentVal = x + '%';
    bar.width(percentVal)
    percent.html(percentVal);
}

(function() {
$('form').ajaxForm
(
    {
        beforeSend: function() 
        {
            $('.progress').show();
            showProgress(0);
        },
        uploadProgress: function(event, position, total, percentComplete) 
        {
            showProgress(percentComplete);
        },
        success: function() 
        {
            showProgress(100);
        },
	    complete: function(xhr) 
        {
            var res = JSON.parse(xhr.responseText);
            document.getElementById('result').innerHTML =
               "Your data has been succesfully submitted. "
               + "We will send an email to " + res.data.email
               + " when it is ready to be processed online";
            document.getElementById('formulario').reset();
            $('.progress').hide();
            showProgress(0);
	    }
    }
); 
})();       

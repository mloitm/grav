var getState = function(){
    var loadValues = [];
    $('input, select, textarea').each(function(index, element){
        var name  = $(element).prop('name'),
            value = $(element).val();

        if (name)  loadValues.push(name + '|' + value);
    });

    return loadValues.toString();
};

$(function(){

    // selectize
    $('input.page-filter').selectize({
        delimiter: ',',
        create: false
    });

    // auto generate folder based on title
    // on user input on folder, autogeneration stops
    // if user empties the folder, autogeneration restarts
    $('input[name="folder"]').on('input', function(){
        $(this).data('user-custom-folder', true);
        if (!$(this).val()) $(this).data('user-custom-folder', false);
    })
    $('input[name="title"]').on('input', function(e){
        if (!$('input[name="folder"]').data('user-custom-folder')) {
            folder = $(this).val().toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9_\-]/g, '');
            $('input[name="folder"]').val(folder);
        }
    });

    $('input[name="folder"]').on('input', function(e){
        value = $(this).val().toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9_\-]/g, '');
        $(this).val(value);
    });

    var currentValues = getState(),
        clickedLink;

    $('#admin-main button').on('click', function(){
        $(window).off('beforeunload');
    });

    $('[data-remodal-id] form').on('submit', function(){
        $(window).off('beforeunload');
    });

    $("#admin-mode-toggle input[name=mode-switch]").on('change', function(e){
        var value = $(this).val(),
            uri   = $(this).data('leave-url');

        if (currentValues == getState()) {
            setTimeout(function(){
                window.location.href = uri;
            }, 200)

            return true;
        }

        e.preventDefault();

        var confirm = $.remodal.lookup[$('[data-remodal-id=changes]').data('remodal')],
            buttons = $('[data-remodal-id=changes] a.button'),
            action;

        buttons.on('click', function(e){
            e.preventDefault();
            action = $(this).data('leave-action');

            buttons.off('click');
            confirm.close();

            if (action == 'continue') {
                $(window).off('beforeunload');
                window.location.href = $("#admin-mode-toggle input[name=mode-switch]:checked").data('leave-url');
            } else {
                $('input[name=mode-switch][checked]').prop('checked', true);
            }
        });

        confirm.open();
    });

    $('a[href]:not([href^=#])').on('click', function(e){
        if (currentValues != getState()){
            e.preventDefault();

            clickedLink = $(this).attr('href');

            var confirm = $.remodal.lookup[$('[data-remodal-id=changes]').data('remodal')],
                buttons = $('[data-remodal-id=changes] a.button'),
                action;

            buttons.on('click', function(e){
                e.preventDefault();
                action = $(this).data('leave-action');

                buttons.off('click');
                confirm.close();

                if (action == 'continue') {
                    $(window).off('beforeunload');
                    window.location.href = clickedLink;
                }
            });

            confirm.open();
        }
    });

    // deletion
    $('[data-remodal-target="delete"]').on('click', function(){
        var okdelete = $('[data-remodal-id=delete] a.button');

        okdelete.data('delete-action', $(this).data('delete-url'));
    });

    $('[data-delete-action]').on('click', function(){
        var confirm  = $.remodal.lookup[$('[data-remodal-id=delete]').data('remodal')],
            okdelete = $(this).data('delete-action');

        window.location.href = okdelete;
        confirm.close();
    });

    $(window).on('beforeunload', function(){
        if (currentValues != getState()){
            return "You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes";
        }
    });
});

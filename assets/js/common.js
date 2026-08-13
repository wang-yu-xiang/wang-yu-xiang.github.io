// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    // Click the WeChat icon to copy the WeChat ID to the clipboard
    $('.copy-wechat').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var id = $this.data('copy-id');
        if (!id) return;

        var original = $this.attr('data-original-title') || $this.attr('title') || ('WeChat: ' + id);
        var showCopied = function () {
            $this.attr('data-original-title', 'Copied: ' + id).tooltip('show');
        };
        var restore = function () {
            $this.attr('data-original-title', original).tooltip('hide');
        };
        var done = function () {
            showCopied();
            setTimeout(restore, 1500);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(id).then(done, function () {
                fallbackCopyText(id, done);
            });
        } else {
            fallbackCopyText(id, done);
        }
    });

    function fallbackCopyText(text, callback) {
        var $ta = $('<textarea></textarea>').val(text).css({
            position: 'fixed',
            top: 0,
            left: 0,
            opacity: 0
        });
        $('body').append($ta);
        $ta[0].select();
        try {
            document.execCommand('copy');
        } catch (err) {}
        $ta.remove();
        if (typeof callback === 'function') {
            callback();
        }
    }

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
})

$(document).ready(function () {

    // ─── Helper: escape special chars for HTML attributes ───────────────────
    function escapeAttr(str) {
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#39;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;');
    }


    $.ajax({
        url: 'https://fakestoreapi.com/products?limit=4',
        method: 'GET',
        dataType: 'json',

        success: function (products) {
            $('#deals-grid').empty();

            $.each(products, function (index, product) {
                // ... (same logic) ...

                var cardHtml =
                    '<div class="deal-card" data-id="' + product.id + '">' +
                        // ... image / title / stars / price ...

                        '<button class="quick-view-btn"' +
                            ' data-title="'  + escapeAttr(product.title)       + '"' +
                            ' data-desc="'   + escapeAttr(product.description) + '"' +
                            ' data-img="'    + product.image                   + '"' +
                            ' data-price="$' + product.price.toFixed(2)       + '"' +
                            ' data-cat="'    + escapeAttr(product.category)    + '"' +
                            ' data-stars="'  + starsHtml                       + '"' +
                            ' data-count="(' + product.rating.count            + ')">' +
                            'Quick View' +
                        '</button>' +
                    '</div>';

                $('#deals-grid').append(cardHtml);
            });
        },

        error: function () {
            $('#deals-grid').html(
                '<p class="deals-error">Couldn\'t load deals right now. Please try again later.</p>'
            );
        }
    });


    // ─── 3. INTERACTION: Quick View modal ───────────────────────────────────
    // ... (modal handlers, closeModal etc.) ...
});


    // ─── 3. INTERACTION: Quick View modal ───────────────────────────────────

    // Open modal on Quick View click (delegated — cards are injected dynamically)
    $(document).on('click', '.quick-view-btn', function () {
        var btn = $(this);
        $('#modal-img').attr('src',            btn.data('img'));
        $('#modal-title').text(                btn.data('title'));
        $('#modal-desc').text(                 btn.data('desc'));
        $('#modal-price').text(                btn.data('price'));
        $('#modal-category').text(             btn.data('cat').toUpperCase());
        $('#modal-stars').text(                btn.data('stars'));
        $('#modal-rating-count').text(         btn.data('count'));

        $('#quick-view-overlay').addClass('active');
        $('body').addClass('modal-open');
    });

    // Close modal — button
    $('#modal-close-btn').on('click', closeModal);

    // Close modal — clicking outside the box
    $('#quick-view-overlay').on('click', function (e) {
        if ($(e.target).is('#quick-view-overlay')) closeModal();
    });

    // Close modal — Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal () {
        $('#quick-view-overlay').removeClass('active');
        $('body').removeClass('modal-open');
    }


    // ─── Helper: escape special chars for HTML attributes ───────────────────
    function escapeAttr (str) ({
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#39;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;');
    }
});
</script>
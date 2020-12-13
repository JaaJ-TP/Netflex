
var ROW_NUMBER = 5;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


$(document).ready( function () {

    /* create datepicker */
    $("#txt_CopyRightDate").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $('#btn_CopyRightDate').click(function() {
        $('#txt_CopyRightDate').datepicker('show');
    });

    /* table add delete row */
    var $TABLE = $('#div_table');
    $('.table-add').click(function () {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
        $TABLE.find('tbody').append($clone);
        re_order_no();
    });

    $('.table-remove').click(function () {
        $(this).parents('tr').detach();

        if ($('#table_main tr').length <= 9) {
            $('.table-add').click();
        }
        re_order_no();
    });

    $('#txt_ProducerId').change (function () {
        var producerid = $(this).val().trim();

        $.ajax({
            url:  '/producer/detail/' + producerid,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_ProducerId').val(data.producers.producerid);
                $('#txt_ProducerFirstName').val(data.producers.pfname);
                $('#txt_ProducerLastName').val(data.producers.plname);
            },
            error: function (xhr, status, error) {
                $('#txt_ProducerFirstName').val('');
                $('#txt_ProducerLastName').val('');
            }
        });
    });

    /* search actor id  */
    $('.search_actorid').click(function () {
        $p_code = $(this).parents('td').children('span').html();
        $(this).parents('tr').find('.order_no').html('*');

        $.ajax({
            url:  '/actor/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.actors.forEach(actor => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${actor.actorid}</a></td>
                        <td class='col-4'>${actor.afname}</td>
                        <td class='col-4'>${actor.alname}</td>
                        <td class='hide'>$</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Actor ID');
                $('#model_header_2').text('Actor First Name');
                $('#model_header_3').text('Actor Last Name');
            },
        });
        // open popup
        $('#txt_modal_param').val('actorid');
        $('#modal_form').modal();
    });

    $('.search_producerid').click(function () {
        $.ajax({
            url:  '/producer/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.producers.forEach(producer => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${producer.producerid}</a></td>
                        <td class='col-4'>${producer.pfname}</td>
                        <td class='col-4'>${producer.pfname}</td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Producer ID');
                $('#model_header_2').text('Producer First Name');
                $('#model_header_3').text('Producer Last Name');

            },
        });
        // open popup
        $('#txt_modal_param').val('producerid');
        $('#modal_form').modal();
    });

    $('table').on('focusin', 'td[contenteditable]', function() {
        $(this).data('val', $(this).html());
    }).on('input', 'td[contenteditable]', function() {
        //re_calculate_total_price();
    }).on('keypress', 'td[contenteditable]', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    }).on('focusout', 'td[contenteditable]', function() {
        var prev = $(this).data('val');
        var data = $(this).html();
        if (!numberRegex.test(data)) {
            $(this).text(prev);
        } else {
            $(this).data('val', $(this).html());
        }
    });

    // return from modal (popup)
    $('body').on('click', 'a.a_click', function() {
        //console.log($(this).parents('tr').html());
        //console.log($(this).parents('tr').find('td:nth-child(1)').html());
        var code = $(this).parents('tr').find('td:nth-child(2)').children().html();
        var name = $(this).parents('tr').find('td:nth-child(3)').html();
        var note = $(this).parents('tr').find('td:nth-child(4)').html();
        var option = $(this).parents('tr').find('td:nth-child(5)').html();

        if ($('#txt_modal_param').val() == 'actorid') {
            $("#table_main tbody tr").each(function() {
                if ($(this).find('.order_no').html() == '*') {
                    $(this).find('.actorid_1 > span').html(code);
                    $(this).find('.afname').html(name);
                    $(this).find('.alname').html(note);
                }
            });

        } else if ($('#txt_modal_param').val() == 'producerid') {
            $('#txt_ProducerId').val(code);
            $('#txt_ProducerFirstName').val(name);
            $('#txt_ProducerLastName').val(name);
        } else if ($('#txt_modal_param').val() == 'movieid') {
            $('#txt_MovieId').val(code);
            $('#txt_CopyRightDate').val(name);
            $('#txt_ProducerId').val(note);
            $('#txt_ProducerId').change();

            get_movie_detail(code);
        }

        $('#modal_form').modal('toggle');
    });

    // detect modal close form
    $('#modal_form').on('hidden.bs.modal', function () {
        re_order_no();
    });

    //disable_ui();
    reset_form();

    re_order_no();

    $('#btnNew').click(function () {
        reset_form();

        re_order_no();
    });
    $('#btnEdit').click(function () {
        $.ajax({
            url:  '/movie/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.movies.forEach(movie => {
                    var copyrightdate = movie.copyrightdate;
                    copyrightdate = copyrightdate.slice(0,10).split('-').reverse().join('/');
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${movie.movieid}</a></td>
                        <td class='col-4'>${copyrightdate}</td>
                        <td class='col-4'>${movie.producerid_id}</td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Movie ID');
                $('#model_header_2').text('CopyRight Date');
                $('#model_header_3').text('Producer ID');
            },
        });
        // open popup
        $('#txt_modal_param').val('movieid');
        $('#modal_form').modal();
    });
    $('#btnSave').click(function () {

        var producerid = $('#txt_ProducerFirstName').val().trim();
        if (producerid == '') {
            alert('กรุณาระบุ Producer');
            $('#txt_ProducerId').focus();
            return false;
        }
        var copyrightdate = $('#txt_CopyRightDate').val().trim();
        if (!dateRegex.test(copyrightdate)) {
            alert('กรุณาระบุวันที่ ให้ถูกต้อง');
            $('#txt_CopyRightDate').focus();
            return false;
        }
        if ($('#txt_MovieId').val() == '<new>') {
            var token = $('[name=csrfmiddlewaretoken]').val();

            $.ajax({
                url:  '/movie/create',
                type:  'post',
                data: $('#form_movie').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $('#txt_MovieId').val(data.movie.movieid)
                        alert('บันทึกสำเร็จ');
                    }
                },
            });
        } else {
            var token = $('[name=csrfmiddlewaretoken]').val();
            console.log($('#form_movie').serialize());
            console.log(lineitem_to_json());
            $.ajax({
                url:  '/movie/update/' + $('#txt_MovieId').val(),
                type:  'post',
                data: $('#form_movie').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert('บันทึกสำเร็จ');
                    }
                },
            });
        }

    });

    $('#btnDelete').click(function () {
        if ($('#txt_MovieId').val() == '<new>') {
            alert ('ไม่สามารถลบ Movie ใหม่ได้');
            return false;
        }
        if (confirm ("คุณต้องการลบ Movie ID : '" + $('#txt_MovieId').val() + "' ")) {
            console.log('Delete ' + $('#txt_MovieId').val());
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/movie/delete/' + $('#txt_MovieId').val(),
                type:  'post',
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    reset_form();
                },
            });
        }
    });
    $('#btnPdf').click(function () {
        if ($('#txt_MovieId').val() == '<new>') {
            alert ('กรุณาระบุ Movie ID');
            return false;
        }
        window.open('/movie/pdf/' + $('#txt_MovieId').val());
    });
    $('#btnPrint').click(function () {
        window.open('/movie/report');
    });

});

function lineitem_to_json () {
    var rows = [];
    var i = 0;
    $("#table_main tbody tr").each(function(index) {
        if ($(this).find('.actorid_1 > span').html() != '') {
            rows[i] = {};
            rows[i]["lineitem"] = (i+1);
            rows[i]["actorid"] = $(this).find('.actorid_1 > span').html();
            rows[i]["afname"] = $(this).find('.afname').html();
            rows[i]["alname"] = $(this).find('.alname').html();
            i++;
        }
    });
    var obj = {};
    obj.lineitem = rows;
    //console.log(JSON.stringify(obj));

    return JSON.stringify(obj);
}

function get_movie_detail (movieid) {
    $.ajax({
        url:  '/movie/detail/' + encodeURIComponent(movieid),
        type:  'get',
        dataType:  'json',
        success: function  (data) {
            //console.log(data.movieactor.length);
            reset_table();
            $("#txt_Title").val(data.movie.title)
            $("#txt_Genre").val(data.movie.genre)
            $("#txt_Price").val(data.movie.price)

            for(var i=ROW_NUMBER;i<data.movieactor.length;i++) {
                $('.table-add').click();
            }
            var i = 0;
            $("#table_main tbody tr").each(function() {
                if (i < data.movieactor.length) {
                    $(this).find('.actorid_1 > span').html(data.movieactor[i].actorid);
                    $(this).find('.afname').html(data.movieactor[i].actorid__afname);
                    $(this).find('.alname').html(data.movieactor[i].actorid__alname);
                }
                i++;
            });
        },
    });
}

function re_calculate_total_price () {
    var total_price = 0;
    $("#table_main tbody tr").each(function() {

        var product_code = $(this).find('.project_code_1 > span').html();
        //console.log (product_code);
        var unit_price = $(this).find('.unit_price').html();
        $(this).find('.unit_price').html(((unit_price)));
        var quantity = $(this).find('.quantity').html();
        $(this).find('.quantity').html(parseInt(quantity));
        if (product_code != '') {
                var extended_price = unit_price * quantity
            $(this).find('.extended_price').html(formatNumber(extended_price));
            total_price += extended_price;
        }
    });

    $('#lbl_TotalPrice').text(formatNumber(total_price));
    $('#txt_TotalPrice').val($('#lbl_TotalPrice').text());
    $('#lbl_VAT').text(formatNumber(total_price * 0.07));
    $('#txt_VAT').val($('#lbl_VAT').text());
    $('#lbl_AmountDue').text(formatNumber(total_price * 1.07));
    $('#txt_AmountDue').val($('#lbl_AmountDue').text());
}

function reset_form() {
    $('#txt_MovieId').attr("disabled", "disabled");
    $('#txt_MovieId').val('<new>');

    reset_table();

    $('#txt_Title').val('');

    $('#txt_Genre').val('');
    $('#txt_CopyRightDate').val(new Date().toJSON().slice(0,10).split('-').reverse().join('/'));


    $('#txt_ProducerId').val('');
    $('#txt_ProducerFirstName').val('');
    $('#txt_ProducerLastName').val('');

    $('#txt_Price').val('');
}

function reset_table() {
    $('#table_main > tbody').html('');
    for(var i=1; i<= ROW_NUMBER; i++) {
        $('.table-add').click();
    }
}

function re_order_no () {
    var i = 1;
    $("#table_main tbody tr").each(function() {
        $(this).find('.order_no').html(i);
        i++;
    });
}


function disable_ui () {
    $('#txt_CopyRightDate').attr("disabled", "disabled");
    $('#btn_CopyRightDate').attr("disabled", "disabled");
}

function enable_ui () {
    $('#txt_CopyRightDate').removeAttr("disabled");
    $('#btn_CopyRightDate').removeAttr("disabled");
}



function formatNumber (num) {
    if (num === '') return '';
    num = parseFloat(num);
    return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
//var numberRegex = /^-?\d+\.?\d*$/;
var numberRegex = /^-?\d*\.?\d*$/



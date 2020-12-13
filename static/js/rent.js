var ROW_NUMBER = 5;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


$(document).ready( function () {

    /* create datepicker */
    $("#txt_Date").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $('#btn_Date').click(function() {
        $('#txt_Date').datepicker('show');
    });

    $("#txt_ReturnDate").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $('#btn_ReturnDate').click(function() {
        $('#txt_ReturnDate').datepicker('show');
    });


    /* table add delete row */
    var $TABLE = $('#div_table');
    $('.table-add').click(function () {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
        $TABLE.find('tbody').append($clone);
        re_order_no();
    });

    $('.table-remove').click(function () {
        console.log("Click")
        $(this).parents('tr').detach();

        if ($('#table_main tr').length <= 9) {
            $('.table-add').click();
        }
        re_order_no();
    });

    $('#txt_PaymentCode').change (function () {
        var payment_code = $(this).val().trim();

        $.ajax({
            url:  '/payment/detail/' + payment_code,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_PaymentCode').val(data.payments.payment_code);
                $('#txt_PaymentMethod').val(data.payments.name);
            },
            error: function (xhr, status, error) {
                $('#txt_paymentMethod').val('');
            }
        });
    });    

    $('#txt_CustomerID').change (function () {
        var customerid = $(this).val().trim();
        $.ajax({
            url:  '/customer/detail/' + customerid,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_CustomerID').val(data.customers.customerid);
                $('#txt_CustomerFirstName').val(data.customers.cfname);
                $('#txt_CustomerLastName').val(data.customers.clname);
                $('#txt_CustomerPhone').val(data.customers.cphone);
                $('#txt_CustomerEmail').val(data.customers.cemail);
            },
            error: function (xhr, status, error) {
                $('#txt_CustomerFirstName').val('');
                $('#txt_CustomerLastName').val('');
                $('#txt_CustomerPhone').val('');
                $('#txt_CustomerEmail').val('');
                console.log
            }
        });
    });

    /* search Movie ID  */
    $('.search_payment_code').click(function () {
        console.log('Click payment')
        $.ajax({
            url:  '/payment/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.payments.forEach(payment => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${payment.payment_code}</a></td>
                        <td class='col-5'>${payment.name}</td>
                        <td class='col-3'></td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Payment Code');
                $('#model_header_2').text('Payment Method');
                $('#model_header_3').text('Note');
                console.log()
            },
        });
        // open popup
        $('#txt_modal_param').val('payment_code');
        $('#modal_form').modal();
    });

    $('.search_movieid').click(function () {
        console.log("Click")
        $p_code = $(this).parents('td').children('span').html();
        $(this).parents('tr').find('.order_no').html('*');

        $.ajax({
            url:  '/movie/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.movies.forEach(movie => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${movie.movieid}</a></td>
                        <td class='col-5'>${movie.title}</td>
                        <td class='col-3'>${movie.genre}</td>
                        <td class='hide'>${movie.price}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Movie ID');
                $('#model_header_2').text('Title');
                $('#model_header_3').text('Genre');
            },
        });
        // open popup
        $('#txt_modal_param').val('movieid');
        $('#modal_form').modal();
    });

    $('.search_customerid').click(function () {
        $.ajax({
            url:  '/customer/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.customers.forEach(customer => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${customer.customerid}</a></td>
                        <td class='col-5'>${customer.cfname}</td>
                        <td class='col-3'>${customer.clname}</td>
                        <td class='hide'>${customer.cphone}</td>
                        <td class='hide'>${customer.cemail}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Customer ID');
                $('#model_header_2').text('Customer First Name');
                $('#model_header_3').text('Customer Last Name');

            },
        });
        // open popup
        $('#txt_modal_param').val('customerid');
        $('#modal_form').modal();
    });

    // $('.search_userid').click(function () {
    //     console.log('Click saleperson')
    //     $.ajax({
    //         url:  '/saleperson/list',
    //         type:  'get',
    //         dataType:  'json',
    //         success: function  (data) {
    //             let rows =  '';
    //             var i = 1;
    //             data.salepersons.forEach(saleperson => {
    //                 rows += `
    //                 <tr class="d-flex">
    //                     <td class='col-1'>${i++}</td>
    //                     <td class='col-3'><a class='a_click' href='#'>${saleperson.userid}</a></td>
    //                     <td class='col-5'>${saleperson.sfname}</td>
    //                     <td class='col-3'>${saleperson.slname}</td>
    //                     <td class='hide'></td>
    //                 </tr>`;
    //             });
    //             $('#table_modal > tbody').html(rows);

    //             $('#model_header_1').text('Saleperson ID');
    //             $('#model_header_2').text('Saleperson First Name');
    //             $('#model_header_3').text('Saleperson Last Name');

    //         },
    //     });
    //     // open popup
    //     $('#txt_modal_param').val('userid');
    //     $('#modal_form').modal();
    // });

    $('table').on('focusin', 'td[contenteditable]', function() {
        $(this).data('val', $(this).html());
    }).on('input', 'td[contenteditable]', function() {
        //re_calculate_total();
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
        re_calculate_total();
    });

    // return from modal (popup)
    $('body').on('click', 'a.a_click', function() {
        console.log($(this).parents('tr').html());
        //console.log($(this).parents('tr').find('td:nth-child(1)').html());
        //console.log($(this).parents('tr').find('td:nth-child(1)').html());
        var code = $(this).parents('tr').find('td:nth-child(2)').children().html();
        var name = $(this).parents('tr').find('td:nth-child(3)').html();
        var note = $(this).parents('tr').find('td:nth-child(4)').html();
        var option = $(this).parents('tr').find('td:nth-child(5)').html();
        var option1 = $(this).parents('tr').find('td:nth-child(6)').html();
        if ($('#txt_modal_param').val() == 'movieid') {
            $("#table_main tbody tr").each(function() {
                if ($(this).find('.order_no').html() == '*') {
                    $(this).find('.movieid_1 > span').html(code);
                    $(this).find('.title').html(name);
                    $(this).find('.unitday').html("1");
                    $(this).find('.unitprice').html(option);
                }
            });

            re_calculate_total();
        } else if ($('#txt_modal_param').val() == 'payment_code') {
            $('#txt_PaymentCode').val(code);
            $('#txt_PaymentMethod').val(name);
        } else if ($('#txt_modal_param').val() == 'customerid') {
            $('#txt_CustomerID').val(code);
            $('#txt_CustomerFirstName').val(name);
            $('#txt_CustomerLastName').val(note);
            $('#txt_CustomerPhone').val(option);
            $('#txt_CustomerEmail').val(option1);
        } else if ($('#txt_modal_param').val() == 'receiptno') {
            $('#txt_RentNo').val(code);
            $('#txt_Date').val(name);
            $('#txt_CustomerID').val(no
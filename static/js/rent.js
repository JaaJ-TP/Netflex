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
        var option2 = $(this).parents('tr').find('td:nth-child(7)').html();
        if ($('#txt_modal_param').val() == 'movieid') {
            $("#table_main tbody tr").each(function() {
                if ($(this).find('.order_no').html() == '*') {
                    $(this).find('.movieid_1 > span').html(code);
                    $(this).find('.title').html(name);
                    // $(this).find('.unitday').html("1");
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
            $('#txt_ReturnDate').val(option1);
            $('#txt_PaymentMethod').val(option2);
            $('#txt_CustomerID').val(note);
            $('#txt_CustomerID').change();
            // $('#txt_SalepersonFirstName').val(option);
            // $('#txt_SalepersonLastName').val(option1);

            get_rent_detail(code);
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
    re_calculate_total();

    $('#btnNew').click(function () {
        reset_form();

        re_order_no();
        re_calculate_total();
    });
    $('#btnEdit').click(function () {
        $.ajax({
            url:  '/rent/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.rents.forEach(rent => {
                    var rent_date = rent.date;
                    rent_date = rent_date.slice(0,10).split('-').reverse().join('/');
                    var rent_duedate = rent.duedate;
                    rent_duedate = rent_duedate.slice(0,10).split('-').reverse().join('/');
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${rent.receiptno}</a></td>
                        <td class='col-5'>${rent_date}</td>
                        <td class='col-3'>${rent.customerid_id}</td>
                        <td class='hide'>${rent.total}</td>
                        <td class='hide'>${rent_duedate}</td>
                        <td class='hide'>${rent.paymentmethod}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Rent No');
                $('#model_header_2').text('Rent Date');
                $('#model_header_3').text('Customer ID');
            },
        });
        // open popup
        $('#txt_modal_param').val('receiptno');
        $('#modal_form').modal();
    });

    $('#btnSave').click(function () {

        var customerid = $('#txt_CustomerFirstName').val().trim();
        if (customerid == '') {
            alert('กรุณาระบุ Customer');
            $('#txt_CustomerID').focus();
            return false;
        }
        var payment_code = $('#txt_PaymentMethod').val().trim();
        if (payment_code == '') {
            alert('กรุณาระบุ Payment');
            $('#txt_PaymentCode').focus();
            return false;
        }
        var rent_duedate = $('#txt_ReturnDate').val().trim();
        if (!dateRegex.test(rent_duedate)) {
            alert('กรุณาระบุวันที่ ให้ถูกต้อง');
            $('#txt_ReturnDate').focus();
            return false;
        }
        if ($('#txt_RentNo').val() == '<new>') {
            var token = $('[name=csrfmiddlewaretoken]').val();

            $.ajax({
                url:  '/rent/create',
                type:  'post',
                data: $('#form_rent').serialize() + "&lineitem=" + lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $('#txt_RentNo').val(data.rent.receiptno)
                        alert('บันทึกสำเร็จ');
                    }
                },
            });
        } else {
            var token = $('[name=csrfmiddlewaretoken]').val();
            console.log($('#form_rent').serialize());
            console.log(lineitem_to_json());
            $.ajax({
                url:  '/rent/update/' + $('#txt_RentNo').val(),
                type:  'post',
                data: $('#form_rent').serialize() + "&lineitem=" + lineitem_to_json(),
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
        if ($('#txt_RentNo').val() == '<new>') {
            alert ('ไม่สามารถลบ Rent ใหม่ได้');
            return false;
        }
        if (confirm ("คุณต้องการลบ Rent No : '" + $('#txt_RentNo').val() + "' ")) {
            console.log('Delete ' + $('#txt_RentNo').val());
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/rent/delete/' + $('#txt_RentNo').val(),
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
        if ($('#txt_RentNo').val() == '<new>') {
            alert ('กรุณาระบุ Rent No');
            return false;
        }
        window.open('/rent/pdf/' + $('#txt_RentNo').val());
    });
    $('#btnPrint').click(function () {
        window.open('/rent/report');
    });

});

function lineitem_to_json () {
    var rows = [];
    var i = 0;
    $("#table_main tbody tr").each(function(index) {
        if ($(this).find('.movieid_1 > span').html() != '') {
            rows[i] = {};
            rows[i]["lineitem"] = (i+1);
            rows[i]["movieid"] = $(this).find('.movieid_1 > span').html();
            rows[i]["title"] = $(this).find('.title').html();
            rows[i]["unitday"] = $(this).find('.unitday').html();
            rows[i]["unitprice"] = $(this).find('.unitprice').html();
            rows[i]["extendedprice"] = $(this).find('.extendedprice').html();
            i++;
        }
    });
    var obj = {};
    obj.lineitem = rows;
    console.log(JSON.stringify(obj));

    return JSON.stringify(obj);
}

function get_rent_detail (receiptno) {
    $.ajax({
        url:  '/rent/detail/' + encodeURIComponent(receiptno),
        type:  'get',
        dataType:  'json',
        success: function  (data) {
            reset_table();
            //console.log(data.rentlineitem.length);
            $("#txt_PaymentMethod").val(data.rent.paymentmethod)
            $("#txt_PaymentCode").val(data.rent.payment_code)
            $("#txt_PaymentReference").val(data.rent.paymentref)


            for(var i=ROW_NUMBER;i<data.rentlineitem.length;i++) {
                $('.table-add').click();
            }
            var i = 0;
            $("#table_main tbody tr").each(function() {
                if (i < data.rentlineitem.length) {
                    $(this).find('.movieid_1 > span').html(data.rentlineitem[i].movieid);
                    $(this).find('.title').html(data.rentlineitem[i].movieid__title);
                    // $(this).find('.unitday').html(data.rentlineitem[i].unitday);
                    $(this).find('.unitprice').html(data.rentlineitem[i].unitprice);
                }
                i++;
            });
            re_calculate_total();
        },
    });
}

function re_calculate_total () {
    var total = 0;
    $("#table_main tbody tr").each(function() {

        var movieid = $(this).find('.movieid_1 > span').html();
        var unitprice = $(this).find('.unitprice').html();
        $(this).find('.unitprice').html(((unitprice)));
        // var unitday = $(this).find('.unitday').html();
        // $(this).find('.unitday').html(parseInt(unitday));
        
        // if (movieid != '') {
        //         var extendedprice = unitday * unitprice
        //     $(this).find('.extendedprice').html(formatNumber(extendedprice));
        //     total += extendedprice;
        // }
        var miliisecondsPerDay = 24*60*60*1000;
        // if($('#txt_ReturnDate').val() != '') {
        //     var ReturnDate = $('#txt _ReturnDate').datepicker('getDate');
        // }
        // else {
        //     var ReturnDate = $('#txt_RentDate').datepicker('getDate');
        // }
        var ReturnDate = $('#txt_ReturnDate').datepicker('getDate');
        var RentDate = $('#txt_Date').datepicker('getDate');
        var unitday = (ReturnDate - RentDate)/miliisecondsPerDay;
        $(this).find('.unitday').html(parseInt(unitday))
        if (movieid != '') {
            if (unitday < '1'){
                    var extendedprice = (unitday * unitprice)+20
                $(this).find('.extendedprice').html(formatNumber(extendedprice));
            }
            else{
                    var extendedprice = (unitday * unitprice)
                $(this).find('.extendedprice').html(formatNumber(extendedprice));
            }
            total += extendedprice;
        }
});

    $('#lbl_Total').text(formatNumber(total));
    $('#txt_Total').val($('#lbl_Total').text());
}

function reset_form() {
    $('#txt_RentNo').attr("disabled", "disabled");
    $('#txt_RentNo').val('<new>');

    reset_table();

    $('#txt_Date').val(new Date().toJSON().slice(0,10).split('-').reverse().join('/'));
    $('#txt_ReturnDate').val(new Date().toJSON().slice(0,10).split('-').reverse().join('/'));

    $('#txt_CustomerID').val('');
    $('#txt_CustomerFirstName').val('');
    $('#txt_CustomerLastName').val('');
    $('#txt_CustomerPhone').val('');
    $('#txt_CustomerEmail').val('');

    $('#txt_PaymentMethod').val('');
    $('#txt_PaymentReference').val('');

    $('#lbl_Total').val('0.00');

    $('#lbl_Total').text('0.00');

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
    $('#txt_Date').attr("disabled", "disabled");
    $('#btn_Date').attr("disabled", "disabled");

    $('#txt_ReturnDate').attr("disabled", "disabled");
    $('#btn_ReturnDate').attr("disabled", "disabled");
}

function enable_ui () {
    $('#txt_Date').removeAttr("disabled");
    $('#btn_Date').removeAttr("disabled");

    $('#txt_ReturnDate').removeAttr("disabled");
    $('#btn_ReturnDate').removeAttr("disabled");
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
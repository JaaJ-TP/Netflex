
var ROW_NUMBER = 5;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


$(document).ready( function () {

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
        var option1 = $(this).parents('tr').find('td:nth-child(6)').html();
        var option2 = $(this).parents('tr').find('td:nth-child(6)').html();
        if ($('#txt_modal_param').val() == 'customerid') {
            $('#txt_CustomerID').val(code);
            $('#txt_CustomerFirstName').val(name);
            $('#txt_CustomerLastName').val(option);
            $('#txt_CustomerPhone').val(option1);
            $('#txt_CustomerEmail').val(option2);

            get_customer_detail(code);
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
                        <td class='col-4'>${customer.cfname}</td>
                        <td class='col-4'>${customer.clname}</td>
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
    $('#btnSave').click(function () {
        if ($('#txt_CustomerID').val() == '<new>') {
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/customer/create',
                type:  'post',
                data: $('#form_customer').serialize(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $('#txt_CustomerID').val(data.customer.customerid)
                        alert('บันทึกสำเร็จ');
                    }
                },
            });
        } else {
            var token = $('[name=csrfmiddlewaretoken]').val();
            console.log($('#form_customer').serialize());
            $.ajax({
                url:  '/customer/update/' + $('#txt_CustomerID').val(),
                type:  'post',
                data: $('#form_customer').serialize(),
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
        if ($('#txt_CustomerID').val() == '<new>') {
            alert ('ไม่สามารถลบ Customer ใหม่ได้');
            return false;
        }
        if (confirm ("คุณต้องการลบ Customer ID : '" + $('#txt_CustomerID').val() + "' ")) {
            console.log('Delete ' + $('#txt_CustomerID').val());
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/customer/delete/' + $('#txt_CustomerID').val(),
                type:  'post',
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    reset_form();
                },
            });
        }
    });
    $('#btnPrint').click(function () {
        window.open('/customer/report');
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

function get_customer_detail (customerid) {
    $.ajax({
        url:  '/customer/detail/' + encodeURIComponent(customerid),
        type:  'get',
        dataType:  'json',
        success: function  (data) {
            reset_table();
            $("#txt_CustomerFirstName").val(data.customer.cfname)
            $("#txt_CustomerLastName").val(data.customer.clname)
            $("#txt_CustomerPhone").val(data.customer.cphone)
            $("#txt_CustomerEmail").val(data.customer.cemail)
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
    $('#txt_CustomerID').attr("disabled", "disabled");
    $('#txt_CustomerID').val('<new>');

    reset_table();

    $('#txt_CustomerFirstName').val('');
    $('#txt_CustomerLastName').val('');
    $('#txt_CustomerPhone').val('');
    $('#txt_CustomerEmail').val('');
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



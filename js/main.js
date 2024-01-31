$(function () {
    if (window.innerWidth >= 768) {
        $('html').niceScroll({
            cursorcolor: '#9d88ea', // Change cursor color in hex.
            cursorwidth: 6, // Cursor width in pixel (you can also write "5px").
            cursorborderradius: 10, // Border radius in pixel for cursor.
            scrollspeed: 40, // Scrolling speed.
            zindex: 9999 // Change z-index for scrollbar div.
        });
    }

    // Cache selectors
    let navH = $('nav').innerHeight(),
        homeH = $('.header').innerHeight(),
        navOverlay = $('nav .overlay'),
        flyingFrom = $('.plan-book .input .from'),
        flyingTo = $('.plan-book .input .to'),
        departure = $('.plan-book .input .departure'),
        returnDate = $('.plan-book .input .return'),
        fillAlert = $('.alert.fill'),
        samePAlert = $('.alert.same-place'),
        beforeDAlert = $('.alert.before-date'),
        sameDAlert = $('.alert.same-date'),
        activeAlert = false;

    $(window).scroll(function () {
        //  Add or remove navbar overlay depended on widnow scroll Y.

        window.scrollY >= navH ? navOverlay.addClass('show') : navOverlay.removeClass('show');
        $('section').each(function (e) {
            if ($(this).offset().top - 200 <= window.scrollY) {
                $('.nav-link').eq(e).parent().addClass('active').siblings().removeClass('active');
            }
        });

        //  Show or hide go up button depended on widnow scroll Y.
        window.scrollY >= homeH ? $('.go-up').addClass('active') : $('.go-up').removeClass('active');
    });

    // Create function that scroll to the section you've clicked on its name.
    $('nav .nav-link, .header .btns button , .footer-link ul li').on('click', function () {
        let dataset = $(this).data('class');
        $('html,body').animate(
            {
                // dateset  = .plan
                scrollTop: $(`${dataset}`).offset().top - navH
            },
            900
        );
    });
    // Create function that scroll to top when you click on go up button.
    $('.go-up').click(() => {
        $('html,body').animate(
            {
                scrollTop: 0
            },
            900
        );
    });
    $('.navbar-nav .nav-link').click(function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
    });
    $('.plan-book ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('.navbar-toggler').click(() => navOverlay.addClass('show'));

    new WOW().init({
        mobile: false // trigger animations on mobile devices (default is true).
    });
    $('#datepicker,#datepicker1').datepicker({
        dateFormat: 'dd-mm-yy',
        duration: '',
        minDate: 0,
        showAnim: 'slideDown'
    });
    $('#currency').selectmenu();

    // Get The API's of Airports form the json file.
    $.ajax({
        url: 'airports-names.json',
        dataType: 'json',
        cache: false,
        success: function (data) {
            let names = [];
            $.each(data, function (index) {
                airportName = `${data[index].name}, ${data[index].city} , ${data[index].country}  `;
                names += airportName;
            });
            let namesAr = names.split('  ');
            $('#city1,#city2').autocomplete({
                source: namesAr
            });
            flyingFrom.blur(() => (namesAr.includes(flyingFrom.val()) ? true : flyingFrom.val('')));
            flyingTo.blur(() => (namesAr.includes(flyingTo.val()) ? true : flyingTo.val('')));
        },
        error: function () {
            return false;
        }
    });
    $('.book-type .hotel-icon').click(function () {
        $('.book-flight').fadeOut(100);
        $('.car-rental').fadeOut(100);
        setTimeout(() => {
            $('.book-hotel').fadeIn(100);
        }, 200);
    });
    $('.book-type .book-flight-icon').click(function () {
        $('.book-hotel').fadeOut(100);
        $('.car-rental').fadeOut(100);
        setTimeout(() => {
            $('.book-flight').fadeIn(100);
        }, 200);
    });
    $('.book-type .car-rental-icon').click(function () {
        $('.book-flight').fadeOut(100);
        $('.book-hotel').fadeOut(100);
        setTimeout(() => {
            $('.car-rental').fadeIn(100);
        }, 200);
    });
    $('.plan-book .search .btn').click(function () {
        checkPlace();
        checkDate();
    });
    let checkPlace = function () {
        if (flyingFrom.val() == '' && flyingTo.val() == '') {
            addBorder(flyingFrom, flyingTo);
            showAlert(fillAlert);
        } else if (flyingFrom.val() == '' || flyingTo.val() == '') {
            if (flyingFrom.val() == '') {
                addBorder(flyingFrom);
            } else {
                addBorder(flyingTo);
            }
            showAlert(fillAlert);
        } else if (flyingFrom.val() === flyingTo.val()) {
            addBorder(flyingFrom, flyingTo);
            showAlert(samePAlert);
            flyingFrom.add(flyingTo).val('');
        }
    };
    let checkDate = function () {
        if (departure.val() == '' && returnDate.val() == '') {
            addBorder(departure, returnDate);
            showAlert(fillAlert);
        } else if (departure.val() == '' || returnDate.val() == '') {
            if (departure.val() == '') {
                addBorder(departure);
            } else {
                addBorder(returnDate);
            }
            showAlert(fillAlert);
        } else if (departure.val() === returnDate.val()) {
            addBorder(departure, returnDate);
            showAlert(sameDAlert);
            departure.add(returnDate).val('');
        } else if (departure.val() >= returnDate.val()) {
            addBorder(departure, returnDate);
            showAlert(beforeDAlert);
            departure.add(returnDate).val('');
        }
    };
    let addBorder = function (e1, e2) {
        e1.add(e2).addClass('border border-danger');
        setTimeout(() => {
            e1.add(e2).removeClass('border border-danger');
        }, 4800);
    };
    let showAlert = function (type) {
        if (activeAlert == false) {
            type.fadeIn(200).delay(5000).fadeOut(1000);
            activeAlert = true;
            setTimeout(() => {
                activeAlert = false;
            }, 6000);
        }
    };
    $('.guest .plus').on('click', function () {
        let num = $(this).prev(),
            dataMaxValue = $(this).parent().parent().find('.age').data('max-value');
        num.text() < dataMaxValue && num.text(+num.text() + 1);
        num.text() == dataMaxValue && $(this).addClass('disabled');
        num.prev().removeClass('disabled');
    });
    $('.guest .minus').click(function () {
        let num = $(this).next();
        num.text() >= 1 && num.text(num.text() - 1);
        num.text() == 0 && $(this).addClass('disabled');
        num.next().removeClass('disabled');
    });
    $('.discover .card').click(function () {
        if (window.innerWidth <= 991) {
            $(this).addClass('active').parent().siblings().find('.card').removeClass('active');
        }
    });
    $('.discover .card').hover(function () {
        $(this).removeClass('active');
    });
    // Remove Loading Page
    $('.preloader img, .loader').fadeIn(500);
    setTimeout(() => {
        $('body').removeClass('is-loading');
        $('.preloader').fadeOut(500);
    }, 500);
});
VanillaTilt.init(document.querySelectorAll('.discover .card'), {
    max: 7, // max tilt rotation (degrees)
    speed: 300 // Speed of the enter/exit transition
});

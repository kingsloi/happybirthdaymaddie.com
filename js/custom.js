(function($) {

    "use strict";

    $(document).ready(function() {

        /* Hero height for full and half screen
        ==================================================================================== */
        var windowHeight = $(window).height();
        $('.hero').height(windowHeight - 60);

        $(window).resize(function() {
            var windowHeight = $(window).height();
            $('.hero').height(windowHeight - 60);
        });

        /* Responsive Menu - Expand / Collapse on Mobile
        ==================================================================================== */
        function recalculate_height() {
            var nav_height = $(window).outerHeight();
            $("#navigation").height(nav_height - 60);
        }

        $('#menu-toggle-wrapper').on('click', function(event) {
            recalculate_height();
            $(this).toggleClass('open');
            $("body").toggleClass('open');
            $('#navigation').slideToggle(200);
            event.preventDefault();
        });

        $(window).resize(function() {
            recalculate_height();
        });

        /* Main Menu - Add active class for each nav depending on scroll
        ==================================================================================== */
        $('section').each(function() {
            $(this).waypoint(function(direction) {
                if (direction === 'down') {
                    var containerID = $(this).attr('id');
                    /* update navigation */
                    $('#navigation ul li a').removeClass('active');
                    $('#navigation ul li a[href*=#' + containerID + ']').addClass('active');
                }
            }, {
                offset: '60px'
            });

            $(this).waypoint(function(direction) {
                if (direction === 'up') {
                    var containerID = $(this).attr('id');
                    /* update navigation */
                    $('#navigation ul li a').removeClass('active');
                    $('#navigation ul li a[href*=#' + containerID + ']').addClass('active');
                }
            }, {
                offset: function() {
                    return -$(this).height() - 60;
                }
            });
        });

        /* Scroll to Main Menu
        ==================================================================================== */
        $('#navigation a[href*=#],#navigation-dotted a[href*=#]').on('click', function(event) {
            var $this = $(this);
            var offset = -60;

            $.scrollTo($this.attr('href'), 650, {
                easing: 'swing',
                offset: offset,
                'axis': 'y'
            });
            event.preventDefault();

            // For mobiles and tablets, do the thing!
            if ($(window).width() < 1025) {
                $('#menu-toggle-wrapper').toggleClass('open');
                $('#navigation').slideToggle(200);
            }
        });

        /* Scroll to Element on Page -
        /* USAGE: Add class "scrollTo" and in href add element where you want to scroll page to.
        ==================================================================================== */
        $('a.scrollTo').on('click', function(event) {
            var $target = $(this).attr("href");
            event.preventDefault();
            $.scrollTo($($target), 1250, {
                offset: -60,
                'axis': 'y'
            });
        });

        /* Main Menu - Fixed on Scroll
        ==================================================================================== */
        $("#home-content").waypoint(function(direction) {
            if (direction === 'down') {
                $("#main-menu").removeClass("gore");
                $("#main-menu").addClass("dole");
            } else if (direction === 'up') {
                $("#main-menu").removeClass("dole");
                $("#main-menu").addClass("gore");
            }
        }, {
            offset: '1px'
        });

        /* PARALAX and BG Video - disabled on smaller devices
        ==================================================================================== */
        if (!device.tablet() && !device.mobile()) {

            /* SubMenu */
            $('#main-menu ul > li').on({

                mouseenter: function() {
                    $(this).children('ul').fadeIn(300);
                },
                mouseleave: function() {
                    $(this).children('ul').fadeOut(300);
                }

            });

            $('.hero,#background-image,.parallax').addClass('not-mobile');

            $('section[data-type="parallax"]').each(function() {
                $(this).parallax("50%", 0.5);
            });

            /* fixed background on mobile devices */
            $('section[data-type="parallax"]').each(function(index, element) {
                $(this).addClass('fixed');
            });
        }

        /* Family - equal heights
        ==================================================================================== */
        $('.my-family .row').each(function() {
            var highestBox = 1;
            $('.column', this).each(function() {
                if ($(this).outerHeight() > highestBox)
                    highestBox = $(this).outerHeight();
            });
            $('.column', this).height(highestBox);
        });


        /* SlideShow
        ==================================================================================== */
        $('.hero-slideshow').each(function() {
            var $slide = $(this);
            var $img = $slide.find('img');

            $img.each(function(i) {
                var cssObj = {
                    'background-image': 'url("' + $(this).attr('src') + '")'
                };

                if (i > 0) {
                    cssObj['display'] = 'none';
                }

                $slide.append($("<div />", {
                    'class': 'slide'
                }).css(cssObj));
            });

            if ($img.length <= 1) {
                return;
            }

            setInterval(function() {
                $slide.find('.slide:first').fadeOut('slow')
                    .next('.slide').fadeIn('slow')
                    .end().appendTo($slide);
            }, 5000);
        });

        /* Isotope Portfolio
        ==================================================================================== */
        var $container = $('.gallery-wrapper');
        $container.isotope({
            itemSelector: '.block',
            layoutMode: 'sloppyMasonry',
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });

        $('#gallery-filter a').on('click', function() {
            $('#gallery-filter li.active').removeClass('active');
            $(this).parent().addClass('active');

            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

        /* Instagram Script - change Tag to yours and update ClientId
        ==================================================================================== */
        var instagramTag = '13802239'; // Add Instagram Tag here
        var instagramClientId = '630b5c9d2cab44e08fb9d014cf00b2b6'; // Add ClientId here
        var $instagramSection = $('#future');
        var max_tag_id = false;

        var getInstagramByTag = function() {

            $.ajax({
                url: "https://api.instagram.com/v1/users/" + instagramTag + "/media/recent",
                data: $.extend({}, {
                    client_id: instagramClientId,
                    count: 23,
                }, (max_tag_id ? {
                    max_tag_id: max_tag_id
                } : {})),
                type: "GET",
                dataType: "jsonp",
            }).done(function(resp) {

                var img = [];

                $.each(resp.data, function() {
                    if (this.type != 'image') {
                        return;
                    }
                    if (this.caption != null) {
                        if (this.caption.text != null) {
                            var title = this.caption.text;
                        }
                    } else {
                        var title = "";
                    }
                    img.push(
                        $("<a href='" + this.link + "' target='_blank'></a>").append(
                            $("<img>", {
                                src: this.images.thumbnail.url,
                                title: title
                            })
                        )
                    );
                });

                if (typeof resp.pagination.next_max_tag_id != 'undefined') {
                    max_tag_id = resp.pagination.next_max_tag_id;
                } else {
                    $instagramSection.find('.load-more').fadeOut();
                }

                $instagramSection.find('.instagram-images').append(img);
            });
        };

        getInstagramByTag();

    });

})(jQuery);
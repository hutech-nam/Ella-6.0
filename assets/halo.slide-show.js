(function ($) {
	var halo = {
	    initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if (self.find('.item-video').length) {
                      var tag = document.createElement('script');
                      tag.src = "https://www.youtube.com/iframe_api";
                      var firstScriptTag = document.getElementsByTagName('script')[0];
                      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }

                    if(auto_playvideo) {
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-current .item ');
                            player = currentSlide.find("iframe").get(0);

                            if (currentSlide.hasClass('slide-youtube')) {
               
                               var id = currentSlide.find('iframe').attr('id');
                               var video_id = currentSlide.find('iframe').data('video-id');
                               if (control === "play"){
                                    postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "playVideo"
                                   });
                                  self.slick('slickPause');
                                   $(player).on('ended', function() {
                                     postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                     });
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });
                                }
                               else {
                                  postMessageToPlayer(player, {
                                     "event": "command",
                                     "func": "pauseVideo"
                                   });
                               }
                               
                               var player1;
                               function onPlayerReady(event) {
                                 event.target.playVideo();
                               }

                                // when video ends
                               function onPlayerStateChange(event) { 
                                 if(event.data === 0) {
                                    postMessageToPlayer(player, {
                                       "event": "command",
                                       "func": "playVideo"
                                    });            
                                   self.slick('slickPlay');
                                   self.slick('next');
                                 }
                               }
                               function onYouTubePlayerAPIReady() {
                                    player1 = new YT.Player(id, {
                                      videoId: video_id,
                                      events: {
                                        'onReady': onPlayerReady,
                                        'onStateChange': onPlayerStateChange
                                      }
                                    });
                               }
                               
                               onYouTubePlayerAPIReady();

                            } else if (currentSlide.hasClass('slide-video')) {
                               video = currentSlide.find("video").get(0);

                               if (video != null) {
                                 if (control === "play"){
                                   video.play();

                                   self.slick('slickPause');
                                   $(video).on('ended', function() {
                                     self.slick('slickPlay');
                                     self.slick('next');
                                   });

                                 } else {
                                   video.pause();
                                 }
                               }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);
                        });

                        self.on("beforeChange", function(event, slick) {
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"pause");

                            self.on("mouseenter focus", function (event, slick) {
                                $('.home-slideshow .slideshow').addClass('over_hover');
                            });
                        });

                        self.on("afterChange", function(event, slick) {
                            $('.item.slick-slide:not(.slick-current) .fluid-width-video-wrapper .video').css('display', 'none');
                            $('.slick-current .fluid-width-video-wrapper .video').css('display', 'block');
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"play");
                            if( $("video").prop('muted') ) {
                                $("video").prop('muted', true);
                            } else {
                                $("video").prop('muted', true);
                            }
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplay-speed'),
                            arrows: self.data('arrows'),
                            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 7.75 1.34375 L 6.25 2.65625 L 14.65625 12 L 6.25 21.34375 L 7.75 22.65625 L 16.75 12.65625 L 17.34375 12 L 16.75 11.34375 Z"></path></svg></button>',
                            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 7.75 1.34375 L 6.25 2.65625 L 14.65625 12 L 6.25 21.34375 L 7.75 22.65625 L 16.75 12.65625 L 17.34375 12 L 16.75 11.34375 Z"></path></svg></button>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: false,
                                    dots: self.data('dots'),
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };
        }
	}
	halo.initSlideshow();
})(jQuery);

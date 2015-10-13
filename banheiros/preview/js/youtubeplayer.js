(function () {

    if (!window.console) {
        window.console = {
            log: function () {}
        }
    }

    var yt_video_id = 'nDz-Hu_-l0A';

    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. E esta função é executada assim que a API fica pronta,
    // inserindo o play na tag que tiver o id passado como primeiro parâmetro do construtor YT.Player

    window.onYouTubeIframeAPIReady = function () {
        $(function () {
            $('#video-modal').find('> a').click(function (e) {
                e.returnValue = false;
                e.preventDefault();

                $('#video-modal').addClass('hidden');
                if (typeof window.myGaugePlayer == 'object' && typeof window.myGaugePlayer.stopVideo == 'function') {
                    window.myGaugePlayer.pauseVideo()
                }
            });
            $('#neve-play').find('a').click(function (e) {
                e.returnValue = false;
                e.preventDefault();
                $('#video-modal').removeClass('hidden');
                if (typeof window.myGaugePlayer == 'object' && typeof window.myGaugePlayer.playVideo == 'function') {
                    window.myGaugePlayer.playVideo()
                } else {
                    window.myGaugePlayer = new YT.Player('youtube-player', {
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            modestbranding: 1,
                            rel: 0,
                            color: 'white'
                        },
                        videoId: yt_video_id,
                        events: {
                            'onStateChange': function (e) {
                                Gauge.onPlayerStateChange(e);
                                var thisPlayer = e.target;
                                var playerState = thisPlayer.getPlayerState();
                                if (playerState === YT.PlayerState.ENDED) {
                                    $('#video-modal').addClass('hidden');
                                }
                            },
                            onReady: function (e) {
                                e.target.playVideo();
                                var video_data = e.target.getVideoData();
                                var label = video_data.video_id + ':' + video_data.title;
                                dataLayer.push({
                                    event: 'gauge.youtube',
                                    action: 'start',
                                    label: label
                                })
                            }
                        }
                    });
                }
            });


        });

    }

}).call(this);

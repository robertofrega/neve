(function() {
  var onPlayerPercent;

  this.Gauge = this.Gauge || {};

  this.Gauge.onPlayerStateChange = function(my_event) {
    var label, playerState, thisPlayer, video_data;
    thisPlayer = my_event.target;
    playerState = thisPlayer.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
      setTimeout((function() {
        onPlayerPercent(thisPlayer);
      }), 1000);
    }
    video_data = thisPlayer.getVideoData();
    label = video_data.video_id + ':' + video_data.title;
    if (playerState === YT.PlayerState.PLAYING && thisPlayer.gtmLastAction === 'pause') {
      dataLayer.push({
        event: 'gauge.youtube',
        action: 'play',
        label: label
      });
      thisPlayer.gtmLastAction = 'play';
    }
    if (playerState === YT.PlayerState.PAUSED) {
      dataLayer.push({
        event: 'gauge.youtube',
        action: 'pause',
        label: label
      });
      thisPlayer.gtmLastAction = 'pause';
    }
  };

  onPlayerPercent = function(thisPlayer) {
    var currentPercentage, currentTime, duration, label, video_data;
    if (thisPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      duration = thisPlayer.getDuration();
      currentTime = thisPlayer.getCurrentTime();
      currentPercentage = void 0;
      if (duration - currentTime <= 1.5) {
        currentPercentage = 1;
      } else if (currentTime / duration > 0.95) {
        currentPercentage = 0.95;
      } else {
        currentPercentage = (Math.floor(currentTime / duration * 4) / 4).toFixed(2);
      }
      if (!thisPlayer.lastPercentage || currentPercentage > thisPlayer.lastPercentage) {
        video_data = thisPlayer.getVideoData();
        label = video_data.video_id + ':' + video_data.title;
        thisPlayer.lastPercentage = currentPercentage;
        dataLayer.push({
          event: 'gauge.youtube',
          action: currentPercentage * 100 + '%',
          label: label
        });
      }
      if (thisPlayer.lastPercentage !== 1) {
        setTimeout((function() {
          onPlayerPercent(thisPlayer);
        }), 1000);
      }
    }
  };

}).call(this);

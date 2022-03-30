
export default class VideoManager {
	private static mInstance: VideoManager = null;
	private mVideoPlayer: any = null;

	public static getInstance() {
		if (!VideoManager.mInstance) {
			VideoManager.mInstance = new VideoManager();
		}
		return VideoManager.mInstance;
	}

	init(args: any, complteCB?: Function, errorCb?: Function): boolean {
		if (this.mVideoPlayer) {
			return false
		}

		if (window["wx"]) {
			/**
				x	number	0	否	视频的左上角横坐标
				y	number	0	否	视频的左上角纵坐标
				width	number	300	否	视频的宽度
				height	number	150	否	视频的高度
				src	string		是	视频的资源地址
				poster	string		是	视频的封面
				initialTime	number	0	否	视频的初始播放位置，单位为 s 秒
				playbackRate	number	1.0	否	视频的播放速率，有效值有 0.5、0.8、1.0、1.25、1.5
				live	boolean	false	否	视频是否为直播
				objectFit	string	'contain'	否	视频的缩放模式
				controls	boolean	true	否	视频是否显示控件
				autoplay	boolean	false	否	视频是否自动播放
				loop	boolean	false	否	视频是否是否循环播放
				muted	boolean	false	否	视频是否禁音播放
				enableProgressGesture	boolean	false	否	是否启用手势控制播放进度
				showCenterPlayBtn	boolean	false	否	是否显示视频中央的播放按钮
			*/
			this.mVideoPlayer = window["wx"].createVideo(args)
			if (!this.mVideoPlayer) {
				return false
			}

			if (complteCB) {
				this.mVideoPlayer.onEnded(complteCB)
			} else {
				this.mVideoPlayer.onEnded(function () {
					this.release()
				}.bind(this))
			}
			if (errorCb) {
				this.mVideoPlayer.onError(errorCb)
			} else {
				this.mVideoPlayer.onEnded(function () {
					this.release()
				}.bind(this))
			}
			this.mVideoPlayer.requestFullScreen()
		}
		return true
	}

	isPlay() {
		return this.mVideoPlayer != null;
	}

	play() {
		if (this.mVideoPlayer) {
			if (window["wx"]) {
				this.mVideoPlayer.play()
			}
		}
	}

	stop() {
		if (this.mVideoPlayer) {
			if (window["wx"]) {
				this.mVideoPlayer.stop()
			}
		}
	}

	pause() {
		if (this.mVideoPlayer) {
			if (window["wx"]) {
				this.mVideoPlayer.pause()
			}
		}
	}

	release() {
		if (this.mVideoPlayer) {
			if (window["wx"]) {
				this.mVideoPlayer.destroy()
				this.mVideoPlayer = null;
			}
		}
	}

}

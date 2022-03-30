import LocalDB from "./LocalDB";



let convertPath = function (path: string, url: string, asset?: boolean): any {
    return path + "/Sound/" + url
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class AudioManager extends cc.Component {
    @property({
        type: cc.AudioClip,
        displayName: "默认按钮点击音效",
    })
    private mDefaultClickAudioClip: cc.AudioClip = null;
    private static mInstance: AudioManager = null;
    private mIsSilent: boolean = null;
    private mSoundVolume: number = null;
    private mOriSoundVolume: number = null;
    private mSoundEffects = null;

    private mBgmUrl = null;
    private mBgmAudioID: number = null;
    private mBgmVolume: number = null;
    private mOriBgmVolume: number = null;

    onLoad() {
        AudioManager.mInstance = this;
        this.init()
    }

    onDestroy() {
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.checkAddDefaultClickClip, this)
        AudioManager.mInstance = null
    }

    public static getInstance() {
        return AudioManager.mInstance;
    }

    init(): void {
        //cc.audioEngine.setMaxAudioInstance(20);
        //cc.audioEngine.setMaxWebAudioSize(300);

        this.mIsSilent = LocalDB.getBool('cfg_audio_silent', false)
        this.mOriBgmVolume = this.mBgmVolume = LocalDB.getInt('cfg_music_vol', 1)
        this.mOriSoundVolume = this.mSoundVolume = LocalDB.getInt('cfg_sound_vol', 1)
        if (this.mOriBgmVolume == 0) {
            this.mOriBgmVolume = 1
        }
        if (this.mOriSoundVolume == 0) {
            this.mOriSoundVolume = 1
        }
        this.mBgmUrl = null;
        this.mBgmAudioID = -1;
        this.mSoundEffects = {}

        this.setMusicVolume(this.mBgmVolume)
        this.setSoundVolume(this.mSoundVolume)

        //按钮默认的按钮点击音效
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.checkAddDefaultClickClip, this)
        //cc.director.on("prefab_button_def_click", this.checkAddDefaultClickClip, this)
        //解决ios h5 反复且后台没有声音
        cc.game.on(cc.game.EVENT_GAME_INITED, () => {
            cc.game.on(cc.game.EVENT_SHOW, () => {
                if (cc.isValid(cc.sys["__audioSupport"].context)) {
                    cc.sys["__audioSupport"].context.resume();
                }
            });

            cc.game.on(cc.game.EVENT_HIDE, () => {
                if (cc.isValid(cc.sys["__audioSupport"].context)) {
                    cc.sys["__audioSupport"].context.suspend();
                }
            });
        })
    }

    checkAddDefaultClickClip(node) {
        if (this.mDefaultClickAudioClip) {
            const check = comps => {
                comps.map(comp => comp.node)
                    .filter(node => !node.getComponent(cc.AudioSource))
                    .forEach(node => {
                        const source = node.addComponent(cc.AudioSource);
                        source.clip = this.mDefaultClickAudioClip;
                        source.volume = this.mSoundVolume;
                        source.mute = this.mIsSilent;
                        node.on('click', () => {
                            if (cc.isValid(source) && !this.mIsSilent) {
                                source.volume = this.mSoundVolume;
                                source.play()
                            }
                        });
                    });
            }
            node = node || cc.director.getScene();
            check(node.getComponentsInChildren(cc.Button));
        }
    }

    playDefaultClickClip() {
        if (!this.mIsSilent && this.mDefaultClickAudioClip) {
            cc.audioEngine.playEffect(this.mDefaultClickAudioClip, false)
        }
    }

    preload(path: string | string[], game?: string) {
        let arry: string[] = typeof path == "string" ? [path] : path;
        let dir = game ? ("Games/" + game) : "Common";
        for (const fp of arry) {
            let url = convertPath(dir, fp)
            cc.resources.load(url, cc.AudioClip, (err, audioClip) => {
                console.log("==>" + typeof audioClip);
            })
        }
    }

    release(path: string | string[], game?: string) {
        let arry: string[] = typeof path == "string" ? [path] : path;
        let dir = game ? ("Games/" + game) : "Common";
        for (const fp of arry) {
            cc.resources.release(convertPath(dir, fp))
            //cc.audioEngine.uncache(convertPath(dir, fp));
        }
    }

    releaseAll() {
        cc.audioEngine.uncacheAll();
    }

    //背景乐相关
    playMusic(name: string, game?: string, isLoop = true, callback: Function = null): void {
        let bgmurl = convertPath(game ? ("Games/" + game) : "Common", name);
        if (!bgmurl) {
            return
        }

        if (this.isSilent() || this.mBgmVolume == 0) {
            cc.audioEngine.stopMusic();
            return;
        }

        if (this.mBgmUrl == bgmurl) {
            return
        }

        this.mBgmUrl = bgmurl
        //上一段设置成0，切换到下一段背景音乐的时候，声音设置>0的时候，播放的还是上一段背景音乐
        // if (this.isSilent() || this.mBgmVolume == 0) {
        //     return;
        // }
        cc.resources.load(bgmurl, cc.AudioClip, null, (err, clip: cc.AudioClip) => {
            if (!err) {
                let audioID = cc.audioEngine.playMusic(clip, isLoop);
                if (audioID >= 0) {
                    this.mBgmAudioID = audioID
                    if (callback) {
                        cc.audioEngine.setFinishCallback(this.mBgmAudioID, function (id, name) {
                            this.mBgmUrl = null
                            this.mBgmAudioID = -1
                            callback && callback(id, name)
                        }.bind(this.mBgmAudioID, name))
                    }
                } else {
                    this.mBgmUrl = null
                    callback && callback(-1)
                }
            } else {
                this.mBgmUrl = null
                callback && callback(-1)
            }
        })
    }

    stopMusic() {
        if (this.mBgmAudioID != -1) {
            cc.audioEngine.stop(this.mBgmAudioID);
            this.mBgmAudioID = -1
        } else {
            cc.audioEngine.stopMusic();
        }
        this.mBgmUrl = null
    }

    isMusicPlaying() {
        return cc.audioEngine.isMusicPlaying()
    }

    getMusicVolume(): number {
        return this.mBgmVolume;
    }

    setMusicVolume(v): void {
        if (this.mBgmAudioID > 0) {
            cc.audioEngine.setVolume(this.mBgmAudioID, v);
            cc.audioEngine.resume(this.mBgmAudioID);
        }

        this.mBgmVolume = v;
        cc.audioEngine.setMusicVolume(v)
        LocalDB.set('cfg_music_vol', v)
    }

    switchMusic(on): void {
        if (this.isSilent()) {
            return
        }
        if (on) {
            if (this.mBgmVolume == 0) {
                this.mBgmVolume = this.mOriBgmVolume;
                cc.audioEngine.setMusicVolume(this.mBgmVolume)
                if (this.mBgmVolume > 0) {
                    if (this.mBgmAudioID > 0) {
                        cc.audioEngine.resume(this.mBgmAudioID)
                    } else if (this.mBgmUrl) {
                        cc.resources.load(this.mBgmUrl, (err, clip: cc.AudioClip) => {
                            if (!err) {
                                this.mBgmAudioID = cc.audioEngine.playMusic(clip, true);
                            }
                        })
                    }
                }
                LocalDB.set('cfg_music_vol', this.mBgmVolume)
            }
        } else {
            if (this.mBgmVolume > 0) {
                this.mOriBgmVolume = this.mBgmVolume;
                this.mBgmVolume = 0
                cc.audioEngine.setMusicVolume(this.mBgmVolume)
                if (this.mBgmAudioID > 0) {
                    cc.audioEngine.pause(this.mBgmAudioID)
                }
                LocalDB.set('cfg_music_vol', this.mBgmVolume)
            }
        }
    }

    playSound(name: string, game?: string, isLoop?: boolean, callback?: Function): void {
        if (this.isSilent()) {
            return
        }
        if (this.mSoundVolume > 0) {
            let dir = game ? ("Games/" + game) : "Common";
            let url = convertPath(dir, name)
            cc.resources.load(url, cc.AudioClip, null, (err, audio: cc.AudioClip) => {
                if (!err) {
                    let efid = cc.audioEngine.playEffect(audio, isLoop);
                    if (efid > 0) {
                        this.mSoundEffects[name] = efid
                        cc.audioEngine.setFinishCallback(efid, function (id, name) {
                            callback && callback(id, name)
                            this.mSoundEffects[name] = null
                        }.bind(this, efid, name))
                    } else {
                        callback && callback(-1)
                    }
                } else {
                    callback && callback(-1)
                }
            })
        }
    }

    stopSound(name?: string, force?: Boolean) {
        if (this.mSoundEffects[name]) {
            cc.audioEngine.stopEffect(this.mSoundEffects[name])
        } else if (force) {
            this.stopAllSound()
        }
    }

    stopAllSound() {
        this.mSoundEffects = {}
        cc.audioEngine.stopAllEffects()
    }

    setSoundVolume(v): void {
        this.mSoundVolume = v;
        cc.audioEngine.setEffectsVolume(v)
        LocalDB.set('cfg_sound_vol', v)
        if (v == 0) {
            this.stopAllSound()
        }
    }

    getSoundVolume() {
        return this.mSoundVolume
    }

    switchSound(on): void {
        if (this.isSilent()) {
            return
        }

        if (on) {
            if (this.mSoundVolume == 0) {
                this.mSoundVolume = this.mOriSoundVolume;
                cc.audioEngine.setEffectsVolume(this.mSoundVolume)
                cc.audioEngine.resumeAllEffects()
                LocalDB.set('cfg_sound_vol', this.mSoundVolume)
            }
        } else {
            if (this.mSoundVolume > 0) {
                this.mOriSoundVolume = this.mSoundVolume;
                this.mSoundVolume = 0
                cc.audioEngine.setEffectsVolume(this.mSoundVolume)
                cc.audioEngine.pauseAllEffects()
                LocalDB.set('cfg_sound_vol', this.mSoundVolume)
            }
        }
    }

    pauseAll(): void {
        if (this.isSilent()) {
            return
        }
        cc.audioEngine.pauseAll();
    }

    resumeAll(): void {
        if (this.isSilent()) {
            return
        }
        cc.audioEngine.resumeAll();
    }

    //静音
    silent(): void {
        if (this.isSilent()) {
            return;
        }
        this.pauseAll();
        this.mIsSilent = true;
        LocalDB.set("cfg_audio_silent", true)
    }

    //还原
    resume(): void {
        if (!this.isSilent()) {
            return;
        }
        this.mIsSilent = false;
        this.resumeAll();
        LocalDB.set("cfg_audio_silent", false)
    }

    isSilent(): boolean {
        return this.mIsSilent;
    }
}

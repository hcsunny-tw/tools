function getTaipeiDateString() { 
        return new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'); 
    }
    
    function showToast(msg, actText, actCb) {
        const c = document.getElementById('toastContainer'); 
        const t = document.createElement('div'); t.className = 'toast-msg';
        t.innerHTML = `<span>${msg}</span>` + (actText ? `<button class="btn sm" style="background:#fff;color:#333;border:none;flex-shrink:0;">${actText}</button>` : ''); 
        c.appendChild(t); 
        if(actText && actCb) { t.querySelector('button').onclick = ()=>{ actCb(); t.remove(); }; }
        setTimeout(()=> {
            t.style.animation = 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse';
            setTimeout(()=>t.remove(), 300);
        }, 4000);
    }

    let audioCtx = null;
    function resumeAudio() { 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume(); 
        return audioCtx;
    }

    function playSuccessSound() {
        const ctx = resumeAudio(); const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(523.25, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.5);
    }
    
    function playCoinSound() {
        const ctx = resumeAudio(); const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(987.77, ctx.currentTime); o.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.3);
    }

    function playTickSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime; const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(800, now); o.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now + 0.05);
    }

    function playStarSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
        o1.type = 'sine'; o1.frequency.setValueAtTime(1318.51, now); 
        g1.gain.setValueAtTime(0.2, now); g1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        o1.connect(g1); g1.connect(ctx.destination); o1.start(now); o1.stop(now + 0.4);
        
        const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
        o2.type = 'sine'; o2.frequency.setValueAtTime(1567.98, now + 0.1); 
        g2.gain.setValueAtTime(0.2, now + 0.1); g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        o2.connect(g2); g2.connect(ctx.destination); o2.start(now + 0.1); o2.stop(now + 0.5);
    }
    window.playStarSound = playStarSound;
    window.playTickSound = playTickSound;
    window.playSuccessSound = playSuccessSound;
    window.playCoinSound = playCoinSound;
    window.showToast = showToast;

    function playTimerTickSound() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(880, now); 
        g.gain.setValueAtTime(0.2, now); 
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        o.connect(g); g.connect(ctx.destination);
        o.start(now); o.stop(now + 0.1);
    }
    window.playTimerTickSound = playTimerTickSound;

    function playTimerVictoryMusic() {
        const ctx = resumeAudio(); const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const times = [0, 0.15, 0.3, 0.45];
        
        notes.forEach((freq, i) => {
            const o = ctx.createOscillator(); const g = ctx.createGain();
            o.type = 'square'; 
            o.frequency.setValueAtTime(freq, now + times[i]);
            g.gain.setValueAtTime(0.15, now + times[i]);
            
            if (i === notes.length - 1) {
                g.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 1.2);
                o.start(now + times[i]); o.stop(now + times[i] + 1.2);
            } else {
                g.gain.exponentialRampToValueAtTime(0.01, now + times[i] + 0.15);
                o.start(now + times[i]); o.stop(now + times[i] + 0.15);
            }
            o.connect(g); g.connect(ctx.destination);
        });
    }
    
window.playTimerVictoryMusic = playTimerVictoryMusic;

// 🔮 幻獸召喚池設定 (Bubble Check 100隻像素萌寵)
const gachaPool = [{"id": 1, "name": "灰虎斑", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABMUlEQVR42u2YsYrCQBCG/4iNvY149VXxbbQT0Yc4rrUVX0FQxM68jVbWd4iQ3jLXOOAtWSe7UUTn/7ol2Qw7/87+swEIIYQQQgghhDyHpOqL3fZncT3+zQ9JTMB7fUdovLoCzdAJP8sVAOBjMi5iAl7Nv8sC7CkgTOezf+P9bgcASHu90vGjsKfAIj/VClh3/vsr4J7Tai18fZfWhOx933MtXlV/aJhz4v5oePN00TIup1O23tCJSxXQasCX2WAfuSjlgzWgKROrhJt5X6a1nSDz7DixrLiqT2i9kJZ5UdjXY2XrTWG7Gx10WgCA7fFc+jy0K3UzL4hfZOZrIFSJ2MyHOjUV8OFmXjJbdc+bceLmowO4tZB6HFwcOrQ7tauAe+poNzP+lajbjcbemUMxVwN/sDOXPxAao7MAAAAASUVORK5CYII="}, {"id": 2, "name": "橘虎斑", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLklEQVR42u2YsQ4BQRCGf3KFB9CR6ES8iVat4DFodDwGhVrrTUR0EheNUqGQUMgkbG7N7R4R5v+6ze7e5Obf2X/uAEIIIYQQQggh36GUd2Gt2rw+jtPjthQT8F3PEcq/rkASumE/mwMA6oP+NSbgw/63vIA9BYTNpPE0Xq9TAEC7Xcscfwp7CpwO40IBi+7/fwXce1qjNdpl1oScfd+8Fi+vP5TNOfGyl7y8XbSMy+3UXVzoxJkKaDXgy2woopQP1oCmTKwSbuZ9mdZOguyz48Tyxnl9QuuFtMyLwr4eq7u4r7PbjVY6UwDAeTXMnA/tSt3MC+IXwM54DYQqEZv5UKemAj7czEtm8555M06cfDqAWwubyWuHDu1O7Srg3jralxn/ShTtRmO/mUMxVwM3TO+VugtrCWoAAAAASUVORK5CYII="}, {"id": 3, "name": "三花貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABKElEQVR42u2XvQ3CMBCFHxEFAyAaUCpEkxVoEGKLFLAEBQOwBhTswRQ0iIaIn4YB6EKBjKJTjH9IhCK/r4tyjnXv/HwXgBBCCCGEEELIf2jZBva7o7z4fH0cWz4bVvUdRdT0CrRdF1w2WwDAYDHPfTYsrK8kgfAqgPvyreS6BwB4pvuv4dPxrNYEouBuIaW8xLUS5+zGW6jUA/Ke1qEUH8YJAOCUlsd93meH0kro9rOtTHgeUErqkIqb4ugBXw/oMClvux89YFLKVWl59k1Km06CWhfOLKQy/tUjtsrLji87/TBO8kCnUUc6u4lXn3lKz6ySwD1QF7oOb9upWQHbqfXzT4y3JwYr/KR8eJ3YdSr17dCu02njKxBVqaCccxqVQOM8UBfBeeAFW3h9jaNsJPYAAAAASUVORK5CYII="}, {"id": 4, "name": "賓士貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVR42u2YsRLBQBCGNxmPQGGEkkKp0um8Bh4Mr6HTqZQKyoRJwTucwtxMctzcZd0h7v+6S3K52f1v/9uECAAAAAAAAADAd4hsH+w0+6I4vtxOEWdBV++RxHVXoFF1wnm1JiKiZD4TnAUL850EEJ4Ckm6v/RMBxMG5kKvMZ2kOF3pZA6pPm5guh0REtFkcWPd169kqgxrY7belcdIaPPz+eixdH48mqAEvNfB00iqZr9oboQZsM8U9D+TeN2XatBPkvHB6IRnxuzVim3kLhUXY3aj0f9Xfuegyr9ZMuDXgSwlT5k3nARTwteeDOYk/roDO37ndae0VcBZAluZaz8ZfCRfdqKvvBW6P9LcK3AFS1HVEGjm1fAAAAABJRU5ErkJggg=="}, {"id": 5, "name": "粉蝴蝶結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABL0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIqg//9B/7/7z/wn1g+uYBpqAcUI7EKpUXUUELr6ZtbjMTGBAMDA8O5c+cYGBgYGIyMjBgYGBgYZFrTSDJnNAZgMfBk/gJICCYm4FX/pHoWSkjD+AwqbBD6zi+IAwodRnYMsJCr8c6jq3jlf8DUpV9F4XPsPY0SMyO+FCI5Bn44m1JkIaX6h38MoJf3hEDKLogRc9z+kCWPyz5i64eRVw8QKn1U5LQZSFE34mtiivMAqfXDaB6gVmuU1JBGT/uEQppQSoDpGzk1MczHlOYRYkOeiFLs/8hujVIb4Ap59DwzcvPAQIU8ofpgNAYGKuRHY4DabSVyW6dDPgao5gEVOW2cZfaQ8MCgb41Sq79Abhtp2MYAAG2Cjew3f7TjAAAAAElFTkSuQmCC"}, {"id": 6, "name": "藍領結灰貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABWElEQVR42u2YMU7DUAyG/1Y9AhssXZjaM9AjMDBWqEhcAbGyIq4QiarKmIEjwBnaiaULDEi9QxiCUWvF+CVphcD/t0RPiWPFv/3sF4AQQgghhBBCyO/QS33w+Oi03F6/b157bRzu6z1C/68rMGhq8PY4BwCcXM3KNg637PfyAfEUEO4e7nfWq+USADAaj2vXhyKeAtnmo5PDrvb/XwG9T7u1cHNbWxOS+9Z9z19qf+iH68QXl9Mfdxcv4rI7FYucnbhWAa8GrMg27iNfSlmwBjxlRInn4TkAYLJ+qrXT93XkrUh7mSB2cTqxfLEVGYl0flatpy9olePyflHYmrGKRV7GnkavZ1XEMd/N/WxdXSdq34czlerIC9IvivA14CmRKSVSzwNWzqd2aipgoSP/XQuJOR+mEw8O7UDXwsiYpaRDN51O4yqgdx3vZMa/El2n0bZn5qaEq4FPJ2GdQK06EYIAAAAASUVORK5CYII="}, {"id": 7, "name": "紅圍巾橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u2XPQ4BQRzF32622IZKR6ITV9GJE3AMGh130HAC0bmEA4hOQjQSCYrtVmNkTTAfOwjzft1mZ+a/+97+PxYghBBCCCGEEPIdAt2F5VItzV5v96vAJqDtOelplgJAUGjerQ9/3YHIdMNmPAEAVDrt1CZgZj9MlMdh9NAJ/xwQLAfVzyTpVWnmgOC86+cKaLtfVv5/HZDrtIp6b/0yJ1T3n8XT7Q+hd51YVX1UisvrbDs6c8BVf/A+ByLdNxdKHaex0wdQxVPt86cKmVYjgXCs2Eq0qo9ptfN3Go0bQwBAMu8aOWHqrFD6b3MgynuAygnx7d9YmCmv6gd0wJa8ytMB17OS7XTqrwNy1dH9D3CNv7PQu/AuBy4aEYvUjbY48wAAAABJRU5ErkJggg=="}, {"id": 8, "name": "黑貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA70lEQVR42u2Yyw3CMBBExxF0wAXxOdID3UAHlEIH0A09cExAudABh3CyFEWs/NEKY+28WxQ71u541usAhBBCCCGEEELK4GIHrha7Yfz8fN1dzoJa3/E0tSswS53wuFwBAOvjYchZcDRfJQB7Cng22+VfBNCYq0Jame/anlXoqwemdTrE7fwGAOxP86z30nqxytAD0t6OHWfeAy7VA9pVSIIeCCmTq8Q081KmQzvBz7PTC/mIU8+J1D2ecOIPtrtRbaTMS9XKngdKZT50HlCBUpmnAtp36dzutHoF1ALo2j7YYfKvhKYHpGz/WoXqFfgA4mJsoP9r9FoAAAAASUVORK5CYII="}, {"id": 9, "name": "小花白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABF0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIag//9B/7/7z/wn9rmMg31gGEhVqG0iBpK6D19c4uR2JBnYGBgYAjugvAZIHyZ1jSSzBmNARh4Mn8BAwMDA4NMYgJR6RkW0k8YZkEEVNhG8wBFMQADdx5dJUn9DyjNsff0aAxQFAM/nE0pspBS/cM/BtDLe0JARU4bb54gJI/LPmLrhyEfA4yk1sSESh9CIY6ubrQmpjQPUFo/jOYBckOK1JBGT/uEQppQSoDpGzk1MczHlOYRYkOeiFLs/8hujVIb4Ap59DwzcvPAQIU8ofpgNAYGKuRHY4DabSVyW6dDPgao5gEVOW2cZfaQ8MCgb41Sq79Abhtp2MYAAH6yd/AwY4/vAAAAAElFTkSuQmCC"}, {"id": 10, "name": "灰白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCklEQVR42u2YQQ6CQAxFi/EIupK1XscjYOIVCFu2xiuYyBG8jq5xYeQOuDCTwCTYocNEnf63G6A000+nLUQAAAAAAAAAAL5D4vrgarFuu+t7c0skDqd6j2H27wrMxxrU54qIiNJd1kocduwn2YA+BQzl8fATG9CnwKl5eDn0tY9fAfucZnMhLz7mBHd/yJ9rfYhPgaGdD0Wqfl5763S56V3fZ9v3t19dyCfSyAHnSmspMrY3UpcD4m5UWonNqSTNOdtOTyU2O/bNEdfIcwqXedHq7ka58106qdmRt3NGbw6EUoKLPFcPoECob15vNxoabm4Y253qVcA+dbjJC38lfLvRqeYFaY8UrQIvMnh5AuTL9aYAAAAASUVORK5CYII="}, {"id": 11, "name": "紅領結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR42u2XLw7CMBTGvxFOQFBAphbMNCdAYRA7AZwMTjCBQXECNIagCKAIlgmSoZosDVu7tmSMfj+3tK/N+17fnwGEEEIIIYQQQpoh0N047I/z4vf1fgxMLnR1jqDT9gh06xpcVmsAwGi5yE0uLNg7ccC/CAhO54OZ4W7v1AH/IpBNJ1YX2tr/fwTkOq0iCuPKnFCtl92n2x863nViVfVRKS7vYye2zQHb/sAcMFVKKP1IEgBAL00/2snr4u2rlFa9BGHnTycWHpcpI5QebDcAgNtsrnWeRbXL/Z5GBfLbz56vypyo22fknPE3B76FSnlVP2AEmlKeEXA9K5lOp62PgDMHojAurdmtcODnp1FX/wu6M5c3EXgDteh6YGh6HO0AAAAASUVORK5CYII="}, {"id": 12, "name": "鈴鐺黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABB0lEQVR42u2YTQrCMBCFJ8XewI34s9QLiOA5vEC9gUfxBvY2gngBXbZKQVy5dRE3Boo0TBJGa8n7dqVNh3kvM5mWCAAAAAAAAABAOyjXB4f9qa5fX+9nFRJQ6j2GpOsO9HwXXHY5ERGN1pkOCVhbL5JAfA4YxpPBXySQRNeFpJQviwpdqLEGPvs0x377JCKi5SYNum+L5+oMasC2t12fi74GlG8NSHchG6gBzpnDfBYUcHE8OSnN7QSzLp5ZyGRslFndHs19P3/3/SwN2uMeJ76Oexq1wSnve87YulV8NfAtOOW58wAOtKU8HJD+lg6dTjvvgFgCZVGxEyb+SkjWgE3tX7vQeQdesmxybdL+7foAAAAASUVORK5CYII="}, {"id": 13, "name": "暹羅貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFklEQVR42u2XsQoCMRBE58RO7OzsbbTUUgT/Q0SwsvNL7KwEEf9DEEsttbG3sxNrrRZ0uSW5EDkk87qDS0JmspMNQAghhBBCCCGkHDLfH5uN1uvz+3a/ZiELxppHqPy7A9WiAwadOgBgf/5Wsvj4R5QNpOeAcDmugsbNJvOoG6gkl0KhymvavSlTKLcGdE67zvJzdAIAbIaH3P/Guz4AoLbtAgCW64XXer7OsAZ0qki+S94LWnnWgOWAqwasFLLyXSuvHbBgDbicCb0PtPKW0q6TIOPS6YVkx773hO98lvI6xTTSDafbjcbGUt56N6RXA2Up77oP6EBZytOBWG9p6aGKKp9eL+R7dl3vgNhv5HQd+BXJOfAGTuOAImVonuUAAAAASUVORK5CYII="}, {"id": 14, "name": "藍圍巾虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNElEQVR42u2YsQ7BUBSG/0ofwGDDamLwLsam4SHEahWvICFi9C4kNZkZJB36BgycpJpe59I2wv2/7aa9PXr+859zCyCEEEIIIYQQ8h082xubjc41vT7HR++TgGU9R6j9ugL+uxtOyxUAoDUaXj8JmNpfygu4p4Awnc+e1ocoAgB0e73cdVW4p8AivhQKWHT//yuQ7dOqF8aTXE9I7Zuua/Fs50PNuUk8CIOX3UXLuHSn7XrDSZyrgOYBU2bfniMPpUw44wHf9s1FmU3SL/UHaPG0fe50oWxmNC9It9m3QwBAUN891b6WeXm+6YwlXczd06iGZGyf3Nead0zKSqa3/+qByhSQWg0yA3tqWfO2k5oKaB7IKmJb8+5O4qq8IIp0DfNDmw9UoOiXGf+VKPssVBXOeeAG3jiShO0MwLMAAAAASUVORK5CYII="}, {"id": 15, "name": "橘白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAAzfa5AeFB0ZeDHx5Xk+RhZTqH/4xgF5OEwIaVQ/x5glC8rjsI7Z+GH4xgMvnuELqyeubKHwZUXUU8Sep0LQ/242BkpAezQNE17RoMUJq22jE5QGyW6Pk1sSwUoncPIeub+TUxDAfU5pHiA15QjGsUcXwf2S3RnlSd+Et38ntqaGHPHqeGbl5gFYxQSjkCdUHozFAqzQ/clujtAaE+g2ktk5HbgyglzqEel6joxKUtkap1V8gt400bGMAABNdd+M82mgGAAAAAElFTkSuQmCC"}, {"id": 16, "name": "黑白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2YPQ6CQBCFB6I30MKIlnoAKwsTjqI38CjeQI9iY6g4gJaisdAbWGCx2YSsTliWxb95Xwfssux7zA8QAQAAAAAAAAD4DIHtwH5nlBePz7dD4LKgr/towl93oFV1wmm9ISKiaDHPXRYszPeyAXkOaAbD3ldsIBSXhXwpnx0vyEIvY8DM02UkqzsREU2Xbafr3Hq2zvyfA9zOWWdmO6V0qg6j7ljl++veGBhTHaURA9aV9kn5ar2RuBhw7kZd64HO/84xZ8yT0wvpHdeNEVvlLRzOZXejSbpVFXYSe3kQTnkzZuTGQFNOlClfVg/gQFPvvNxutGm4/O76hSbXATPraAXf/bdCrgNcheTOwwGGB0aGdHpmMHycAAAAAElFTkSuQmCC"}, {"id": 17, "name": "藍花白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR42u2XOw6CQBiEB+MR7DRURAtqT2Bp4xH0JHAQEz2CF7Aj8QQWGiujnYmthcla4BaQ4D4NIvM1BNhlszP7PwAIIYQQQggh5MskmRBJJoTv73aaLkxXd2C/Nyyod70dA13lASANp/mD9/1yNjL6Dh2QXFZrAMBgMdc6z1JpbA4AgPS+y58zBiwdkJzOe8MZz/yyZRZyc+AxGTst6Dr//x0o53sVURh/jAnV+6r1dOtD4x0ITCuxKvuoFC+PYyV2jQHX+sAYsFXKvBIXz75KadVJkPPaU4nljl1jRFd5jSwm2t2N+qZK+XLMtDcG6lJeVQ/oQF3K0wHfvZJtd9p4B7xtIArjypzdiA38fDfq63/Btkf6Wwde5Ml52Ki6iJYAAAAASUVORK5CYII="}, {"id": 18, "name": "紅結三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABaElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIC4KmH7/+nHr7/ieXTCzAN9YBlJFahtIjafwYGBoZTJuoMDAwMDOfOnWNgYGBgMDIygsjv2MxIijnwmHtzi3FExwALsQphIS+VXQkRmNrOwMDAwGB25iY8DyDzcYEn8xcwMDAwMMgkJozmAZJiABayT56XQWIiCCJ+Z91VFHV30PQ527iOlkJULYWetIlhlf8Rsx+vfvSYePjo2WgphDUPoJfTuAAsxFXktCFpPwa7Orj8o6tYYwKXfcTGzMjLA7CQxAXQQ5yQutE8QG4ewAUIhTyx9o3mAUIhRWpIo6d9QiFNKCXA9I2cthDMx5TmEWJDHr3GR6/pVeS0/4+sGCAXcCxxJKue+YGeZ6q0R3geoBXAVcMTW1OPxgCxrVZ4n5gBkidkqhgoCvmRVxOT2iolt4YmtXU65GOAiZohiN7OGR0bpWUeoBUYcXkAABBwl6e5q9JrAAAAAElFTkSuQmCC"}, {"id": 19, "name": "眼鏡虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIUlEQVR42u2YsQ6CMBCGD+MjuOnsBO+kD2FcWY2vYKIhjLwNTs46mPAOOOAlSLhc25QYvf9bSNOWpvf3ej8QAQAAAAAAAAD4DonrwOVi3fbbj+aWhCwY6z3M7NcVmPtOuJ8vRES02m7akAV786NswJ4CTH48fLSvdU1ERGmWjbanwp4Cp+bZKbDbj/anb2WqouyewwED5aCAdk9754agjGtd8K0P/6eAtHOOFN8uuXCWWQGpn+ejEkteSMuBPNItouWKmRwIdqOhSgwjr+WcppCdSsw7dq0TmhfSIs8KSx6rKsrWthvV8HWlw8gzkqeylwO+hEa+d8ad6gEU0HJA8kDambfrRqfOhVRxsb7uFApo3wH4KxHLjcb6Znb1XGYUeAFGkpDA93uiDAAAAABJRU5ErkJggg=="}, {"id": 20, "name": "紳士帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLUlEQVR42mNgGAWjYBSMglEwCkbBwAFGWhlspRf1nxh1xy4to8gNTEM9BkY9MOqBke4BFloZfFRRmLhi8NIIjwGiy2BpETWUcv3pm1uMlJT/1KoPRl4MPJm/gIGBgYFBJjGBLAvR9eOKydFSiBCQlZMcrQcGJA9QK+QfP3o+mgew5gH08p4QOD7hNwMDAwODZQErWfK47CM2ZoZfDODyOc6YsT0KCemzEK6MqDqkvH99E02hAwMlIT2aB4iuaTFCnrQ21ojLA2S3RsmtD2DlP9l5Dk3fyGkLwXxMaR4hNuSJiOH/I7s1evzsAUgNa+xAFYfgCnn0PDNy8wCtYoJQyBOqD0ZjgFZpfuS2RmkNcJXv5PbQRgd3kUMQV5k9OipBzTkyarWFSG0jDdsYAACGy32k+KabcAAAAABJRU5ErkJggg=="}, {"id": 21, "name": "長毛白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABEElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA3ceXSVP497TVPXAyIuBH86mFFlIqf7hHwPo5TQhkLILYsQctz9kyeOyj9j6gWnY1sT///9HCRkZUXWiSh8VOW2S1D15fRPVQYyMjCMqDzCSmgfILv9xxAAuMJoHCMUMuTGBHvK4QppQSoDpGzk1MczHpNYTpKZxmPlElGL/R3ZrlNoAV8jjKq1GXh4YqJAnVB+MxsBAhfxoDFC7L01qyA+bGKCaB1TktAm2MAe1BwZ9a5TcPjO12kjDNgYAgxxsHUrEBfEAAAAASUVORK5CYII="}, {"id": 22, "name": "皇冠橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABUUlEQVR42u2YsQ4BQRCG50Sh0elIdKLX6RU6j8Bj0FDxDhoeQafwEFrRSU40EgWFbhVuxV2sf+3eCbvzdbd3m737Z/+dmSNiGIZhGIZhmJ9BnBdCnBcCPrduCrFuCttxW3L/Lnj+WXkiIjpNY9dBsROgSMQGRo1onMQ3PuDvIxC88sAr5culWkzRcFUyWrDSOsau98dtgDz5bie444FHSMCeD2fzSMmu0YKP+b0u6SiPPOleBHTZjKvZmjNS2j8PIC6HodWCn85HnnQvAsnzHlEf7N56At1XrYfyg7uZWIVUCp0+SPHkc7pKsweyyg/sAVOlTDOx3PtIabQT5Dx/MrH8YluP6CqPT7F7x+dvNVpoT4iI6Lrsp/IiKuWTnvHXA1lFAikvleaOLG0+VV7VG3ME0qqVVNUp6o39jUDy1NHtA2z/UvhbjabVL5jWSM72Azcnt8DP7kUinQAAAABJRU5ErkJggg=="}, {"id": 23, "name": "黑框眼鏡貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8UlEQVR42u2XQQoCMQxFM+IR3Onac+khSrfdilcQ9FyudSHMHepCCkMhTlMDdZr/dsNMpySf5CdEAAAAAAAAAADaMJR+uN3s4/T5Od6Hmgu1/pNYLV2BtfTA43ojIqLd8RBrLpycVwnAngKJcD79RQD2FLiMr48Czn9VhntPysr1p0Dep8W1wWW+0Bek/tCfAlzkeaa4LpQUKO1ScGL1GhB2GfM1UD2N1jpx3qVKa45TyI4Tp4h/rZHSzM8pHJyPtqdRbbjMc85urwZaZX7OD6BAq8xDAe1ZSZr5bhRQCyA4L97GsBNLplGtfUF7Q1u8Am8+Imo/RxbwZwAAAABJRU5ErkJggg=="}, {"id": 24, "name": "小鴨帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBklEQVR42u2YPQrCQBCFX0QrWxsxWomlvZCTeABrj2LtATyJYG8pqfzBxtbKYi0kiIubn3EkkHlfG2aHeY/JzC5ACCGEEEIIsUqkdZBbT93XBIt99M8CWmYcGPQmHwpfbgeRslrnNMaBdtWA83YMAIgTOEnCd3zKHhA54CtZN3YdmM3vorjdpksHch3w/9OFiq4eL0eWHdH3UL6y86F5DoQqDynlK3s6XgEAw1E/V3lOYq0e8MmUl+5G5npAvI1KJ7G/A1XtOT/OziTOKv61R8oqX+Rwtg3b3YW0CSkfujfY64G6lC+aB3SgLuXpgPZduqryjXFArYA4SdXeevg2KtnftTDXA0/tvWp929tciQAAAABJRU5ErkJggg=="}, {"id": 25, "name": "鯊魚帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHElEQVR42u2YLw7CMBjF3wgeQzAIHOEEaBSWAwzJKTgAZyABicOMG6A5AeBIQIEYCX6oEmgo/bOGZev7uWbrmr23r99bAUIIIYQQQipDnKRZnKTZv9arlV2wWtmdKL0DkemN7Wb3Q83L7Ri5LOjrOZVxoG47YbDcAQC2k77T9/02nzXg5IDgfD0AAMabOwBgNWpYjbkL5XXgsRgCAOavMYzGaK3pwE8H5H1aR296AgDsZx2n66r1TPtD9RxQvblKKVlZWXGV8uzEvmpA54htNgquBpzTqMg0tsgZyLbm5HnhdGLxxnlrxFR5ncMiDYebhXyjUl713xBeDRSlvK4f0IGilKcDrqj2d1vleTb6TUFfZz08G3XJ774IrgaeHOmJGK+5C8kAAAAASUVORK5CYII="}, {"id": 26, "name": "青蛙帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABF0lEQVR42u2YIQ7CMBiF3xaOgMMSFAeYwcENOAUGRbBYgsJwit2AOQwHQC1YHHcogvwhaVL6tzRZRt9nEPQf6Xu89W0AIYQQQgghJFeK0IH1fWUAoK4aAMDj2aquMRpODAAsr3MAwHF8KlJsoOy7AwPtQlFQ+CjZquZlvX09rYN0wEYyYDvjW287wQzEDqZWkg6EMr0souZuszMd+OqA9q4i7Dbb9+dhH/W96/e050OZTReyu4wrAz7FJQOhXYoZUGfCoby2YzEDoW00tkP5lPb9E2Qun5NYdvxrRrTK+xyuK5i8u1BqXMrbmck3A10p7zsP6EBXytOB1M/Sse209w4k20BdNc57Nt9KpHw7naoLhXakv3XgBfg7drX/rN5PAAAAAElFTkSuQmCC"}, {"id": 27, "name": "船長貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABU0lEQVR42u2WvUoDQRSFvw0WPkBIk5BqsXALTS+CiG+RQmt9gnQ2eQLzBr6FhSBYq4UWISCGaCFbWKYQ1kJHyLC7MzvZFMu9X7k7P8w5c+ZeUBRFURRFURRFKlHVCXuH51nZ/8erBwD2Lwal6zzdTaI6DtAS40C3vZMBtHdPatk4fbkB4D2dRqId2PIe2IkB+Epf69n4bz3SKeqAD9+fMwAW487K9+XwtnTe8cFqZu4vxwD0zk7RVyjkFbIdCHXibf6hr1BuBozSLozicT8BYDbMH/f/f/6c60TRfr7OyMuAUbIIW3HXOM1AaAaKcCnvu59mwKVUVaXtu+9S2nUTzDw5vZA58boZ8VXe1XPF/SST5UAo29dHQXVmaWdmlAjPwKYoqvC+lVod8O1aDQt+M9EbsZby8ipx1a40tEJX7U4b70CrTgXtPqdRB2hcBjaFuAz8ANTchZy/uWSAAAAAAElFTkSuQmCC"}, {"id": 28, "name": "海盜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIElEQVR42u1ZMQrCQBCchBT2io2FnYiC9voCn6SNnT5Df+ELtFdQxE5QBImdhV2srjBw3l1yieDOdAfZbDKzs7shAEEQBEEQBEH8CoFrQK8zSHwk3h02gY/7hGIUsGV+u18DAPrdYSlKyFGgUWslAFCt17wkftxjAMA1PlGBUrpOUV6Q54HLYgkAeN6mmRK2J+ePs3gPRK4Btswrpo+z5tez+Ekc6WrdtaYVswo65m3z2XpDXhfSMWlSRHcdu1BeD6RhYp4eyOuBrEy7TmJTJag4OZNYvXFej9gyb+5iSGTuQgqV0RwA8FqNvTyIjnndziTPA0UpYWLeNA+oQFE1L2YSl66Arr9n3U7lKpDuOrbfAb4Rivs/4GsXct2R/laBNxKSh8AKJldKAAAAAElFTkSuQmCC"}, {"id": 29, "name": "巫師貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYklEQVR42mNgGAWjYBSMglEwCqgIqqJu/K+KuvGfXvYxDfUAYxrqMTHkY4CFmiE+rJLQsPEArfPCkI8BRmqn/daOIgYGBgaG6oo+rOrblmkwjsYAOTEgLaKGEtLxbpsosnjhLj8GBgYGhqdvbjGOxsBgKN/JzRsjLw88mb+AgYGBgWHOm5co8lcuX2ZgYGBg0NHVxcqHgRQRcQYGBgYGmcSE0TxAVlsIPeTprX/4xwB6eU8INJSWQ+juThRxWNrHJU/IPmLzxsgrhULiYrCWLoRiBL20WrNoyWgphDUGCOUBXCFLKoDFFC4wmgcIxQy5MYEe8rhCmlBKgOkbOTUxzMfE1hO42kLEhjwshnG1sdYsWvJ/dFwIHyDUKiUU8jAAqy/WjPg8QCogN+RJralHY4BQHkCPEWLT/IipiVlobQF6XtDBUYPDamhSW6ejMUBsz4xhdHSaSqPTpPaZSQUjLg8AAK+prN15/RzvAAAAAElFTkSuQmCC"}, {"id": 30, "name": "太空貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABVElEQVR42mNgGAWjYBSMglEwCkbBKBi5gJFcjfdffP1Pjj5FCW5GanqAacTEACzEFcS5IBoZGRmpEXOUxsjwjwFqhTwh88mNieEbA+ghIy2ihpJ2n765RVaI4TKH3JgY8jHAQqqGJ/MXMDAwMDDIJCaQVQ8g6R+tB8iKARiQlZMcFB4YeTFgWV9JkYWU6h/+MYBeTqPz0cHxCb8hIVvASpY8LvuIrWeGXwwg+RwlJHDGhO1RSEifhXBlRNUh5f3rm2gKHbBqx2XfaB4gNg9g1LQYIU9a22jE5QGi+wM2OoZUqYkfP3qOwj9y5TzWnhmhmIfF0PCviUkNGWIBLAQVJbix5gkiYvj/yG6NHj97AFLDGjtQxSG4Qh49z4y8PEDrmCAU8oTqg9EYoFWaH7mtUVoDXOU7qSE/bGKAah54/Og5zjJ7dFSCmjM01GoLEWojjZgYAAD6Ipm6XJqwqAAAAABJRU5ErkJggg=="}, {"id": 31, "name": "柴犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8OTuLgYGBgYGGWW3/+RYiKSfKh4YeTEAA2cbVQaFB0ZeDLxckkWRhZTqH3YxQLEHjOvvMBjX3yFbfjQPUGrAkwf7UPgyCk4o4k/ioWl/YdpoDNAkBmAhKx4/CxLi0SlY5UfzALVbo+TWxOglEqw1CjOf1NbpyMkD6CFFKUA3DxajxvUMJMXEyK2JxeNnwUue0dboQNYDsFggtbzHTPt3GEZLIXoA9PqD3JAfLYVGPTDQeQC91IGlZXqPVoyc1iiuVim1wIgthQBDgF22kC3JgQAAAABJRU5ErkJggg=="}, {"id": 32, "name": "柯基", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GTPLAYGBgYGGZe0/+RYiKSfKh4YeTEAA1d7tAaFB0ZeDHy8MIEiCynVP+xigGIPaJdcY9AuuUa2/GgeoNSAJ69vovBlRNVRxJ/EQ9P+wsDRGKBJDMBClj9+PSTEo1Owyo/mAWq3RsmtidFLJFhrFGY+qa3TkZMH0EOKUoBuHixGtUsYSIqJkVsT88evh5c8o63RgawHYLFAanmPmfavMYyWQvQA6PUHuSE/WgqNemCg8wB6qQNLy/QerRg5rVFcrVJqgRFbCgEAFhBePsZHU60AAAAASUVORK5CYII="}, {"id": 33, "name": "馬爾濟斯", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0ElEQVR42u2YzwqCQBCHNXyEbsKeliD2EL7/Q0gHCaRT0K13sNMcXFzKbUynvu+44owzP3X+FAUAAAAAAACsQzn3hnp/GDQc3x99qWFn97MKpDJ9vXUqjr0LKsqYV6BKZf58aUfnp2OzyANM+BnmKGFeAQIwH4B3IflHeef63ytQfWogrguSbTnXqhtUYirx2t1orEiuEnHmJeNin17oVf+uPQ+IPVHUu0AvRACmKnEuE+8+E9lXSPVOuVsKPmIC2EoAS09edKPau1GtXal5BZ4CtVJM5JpDXAAAAABJRU5ErkJggg=="}, {"id": 34, "name": "紅貴賓", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8UlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDel2ZCVUsDupi+E+NmBl+MQAL+b5oeRTxoqUPaeIATHsgMUNsTAz5GBj1wJD3QFDXGYagrjNky4/WA5QacGhWFArfLm0ZivihWWoMDAwMDG/u3BqNAZLaQqTWxCIqaljFcYU8rnwx4mpiRnJboeS2idBDHhbiMPNH20KE2u/U7g/AzIPFKKyVOtoWGvXAUKmJyQWYaf/MaI+MLgC9/iA35Ecz8agHBpsHaN3zGm2NUntslFpjpUM+BgDjdlvrOHyA4wAAAABJRU5ErkJggg=="}, {"id": 35, "name": "哈士奇", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjVcPb6eQYGBgYGY03D/+RYiKSfKh4YeTEAAyFJWVjFJ3TmMzAwMDAUlE+kiwdGXgy0d8+myEJK9Y/GADp4YwVJ8yLHJmJN++jyo3mA2jGwxB/K8IeEtIyoOgMDAwPDk9c3UdQVHBsthWgTA7A0Dyv/MUKexvUB04htjeKqiQmBNfOmMWBrjcLMJ7V1OnLyAHpIUQrQzYPF6Jp500iKiSEfA2R7YEJnPrzkGZIeGDb1ALntfyxpn2G0FKIHQK8/yA350VJo1AMDnQfQSx1YWia3jTTaGiW3VUotMGJLIQBxMmAlYvfyUAAAAABJRU5ErkJggg=="}, {"id": 36, "name": "臘腸", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDWl6KhUpWYzef1JgZfjEAC3l+nh8o4h+/cNDEAej2wGKG2JgY8jFAsQe6/MQYuvzEyJYfLYUoNcA6zAvC2LSALPnRGKDUgKOrtsHTOgMDA0P4jGcMDAwMDCszpFDkR/MAqW0hUmtiXCVN2aZXWMUfPvvDMFoTk9IaRY8RcttE6CEPC3GY+aNtIULtd2r3B2DmIWJ0tC006oGhVROTC9DTPqx0Gi2FaA3Q6w9yQ340E496YKDzAHrrE9YPoN640WhrlLZjo9QaKx3yMQAAl7pX59ZCe1oAAAAASUVORK5CYII="}, {"id": 37, "name": "米格魯", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8klEQVR42u2YsQ3CMBBFLygjxBWu8Rp0NEyDxBRIzJAhaOhYA2qoyA6hOiSMT06ck4LNf6Vjn+X/k7uLiQAAAAAAAAAAzEM1dsGyWfUaGz+6W6URZ1GsA5LS9+dVZWNrnIoz2TtQS8oft83H+O7UERHReb8OBtocLsFxaT7zvQ/1Y5woz4GhSIrH5sUc+bssVE9VnrOJlJ385+/1rYMDk74BqS74imvVDVRiVOK5u1HfkVQnfOVZcY6PXijWv2v/D3A8dtQah15IFe3eBw5oEXj3UQeSlNOqyKm3FNk7gAMUcwBrnNhhwoFfvBvVuivN3oEXXl9lXDvbY5gAAAAASUVORK5CYII="}, {"id": 38, "name": "大麥町", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA90lEQVR42u2YPQ7CMAyFHcQR2EAtQ8XSK7Chnhqx9QosiAEQbNwhTJFaS5Hz4woa3re1VZ3ovcR2QgQAAAAAAAAA4DuY2B/Wq53VGPj1vhiNOItiHfApfX2cVQZuqlbFmdk7sPQpX283o/f323P0fNh3RER06o9ZE+DjEJGNcaI8B0KJVV7LMTjgyya+7CR9hwO5AbiyXPGplC/XgUH+tRqOSPD68neV2KR2oalrm/dATnEXH72Q1L+HngekysvjOUebqkUvpIJ2zwMHcnF7gme1wdpHHYiqB0653D4/VXnsASnbTHUCgwOhJzPUgV+/G9W6K529Ax+dtHS6GW+uRwAAAABJRU5ErkJggg=="}, {"id": 39, "name": "黃金獵犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/ElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJD+uoKC6pYrB3B8J8aMTP8YgAW8vtaJFDEnWpe0MQBmPZAYobYmBjyMTDqgSHvAe2IEwzaESfIlh+tByg14O6RIhS+sk0fivjdI1YMDAwMDD+eHBuNAZLaQqTWxBwykJBmn/6JgYGBgeFnJh/ekMeVL0ZcTcxIbiuU3DYResjDQhxm/mhbiFD7ndr9AZh5sBiFtVJH20KjHhgqNTG5ADPtnxjtkdEFoNcf5Ib8aCYe9cBg8wCte16jrVFqj41Sa6x0yMcAAM44XXRG76RHAAAAAElFTkSuQmCC"}, {"id": 40, "name": "邊境牧羊犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABC0lEQVR42u2YOxKCQBBEG0tvoIHlJ9QDGBlYxZE8ikcisYg4gIZ+ygBvYIABTjK1KywuItgv47fLTi8zPQCEEEIIIYQQQpohcH1gMlxkPia+3o+Bj3F6bVeg7xrp2Xz8dsA4iQAA61VYNHfmQ5nuKSCR15E+n261vIBB0cxFidYrwAX8bBYqS7x75FlnOzBmH32dCvhWAJv9K//nh9PREgBwSQ/qxpAKOHkh10osFVhjq8i2uvJ3lTio6kKLPJENHXmJuIxPL1Tk3333AwbvRS9UrgInkTXz0At9oyfWlbZEB2bMQrL35TyzUN3YOr2qfynY0HABTX0DOuvIXq7qkajAp64SNf8/6qwCT30+YsgVzZ1yAAAAAElFTkSuQmCC"}, {"id": 41, "name": "俄羅斯藍貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA+0lEQVR42u2YMQ7CMAxFXcQBGNhgRhwIMcPCxMBhMmWBGeUeLBwAMcPGwA3CFKlEipI6lgLJf1vVupb/l2O3RAAAAAAAAAAAytClPjibLmz/+vm6d5yEUu9xjP7dgfHQgMfxRERE8+3GchL24kUKaM8Bx2q3/4kC2nPgcLlmJcyNr98B/5yOMVnfiIjofV6y7ofypc6H+hwIVR5SylfWaPV1SoWUxySW6oHc+dB8D7C3Ue4kdj3C7Tk/rp1J7CrO7ZFU5WMOG61s29uoNCHl/Z5ptwdKKR+bB3CglPJwQHpXGqp8NQ6IFWC0Cp7Z+CshsY1KfS9wd6RqHfgAOSBs2JPszg8AAAAASUVORK5CYII="}, {"id": 42, "name": "蝴蝶結白狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u1XuwrCQBCcSAo/wE5JFQRJIaa18Wu0tra2ttavsbGNWIggVqKdH2B3FrJCQvTyOMXkZrp7sMvO3N7uAgRBEARBEARBWA+1WCu1WKus63/x16g68U4aMwAQRREAIAzD58XpyAGAdqtrRIXr7ehk8Vd7Bdwk8xK5rDvzcez8PhkacdxcbmL2L7MV0vzrlKhfDsgb3x22sf1+bwAAOJ33Rhz7XoBPfiRHap8DDKDyAfhe8HrPRc6tV8AtayD5Kwnbsm/q17KnDiTrgY7xsnXgXY9EBXSKFFUiybwwLvatU8DN27+bngfEnijqe4FiL8QAqlSJiyLl7YO/0C/wrnfKyzyTmAH8WwDfnrzYjermBFO9kXUKPABTMJo+rW0QqQAAAABJRU5ErkJggg=="}, {"id": 43, "name": "巴哥", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCF9dkcZVSw29uiiSswM+RhgwRXy8nJSKOIPHz3Da9DDBw+wissrKODVh24PAwPDf1JiYvjFALmAUEjTCgz5GGCiRmmCq0QhRn7ExwDFeUBfR4uBgYGBIalkCwMDAwPDxSvXUMRh9GgM0LomhsUAOpjX4zNaE1OlNYoeI+S2idBDHhbiMPNH20KE2u/U7g/AzIPFqLFH18hqC416YNi0RsntWyOl/dEeGV0Aev1BbsiPZuJRDww2D9C65zXaGqX22Ci1xkqHfAwAAPbJVwJoXNOpAAAAAElFTkSuQmCC"}, {"id": 44, "name": "雪納瑞", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/ElEQVR42u2WMQoCMRBF/4pHsLMXa/EcdoJo5xXsJWy/V7BTBDvPIXYLi72dd1irgTVG2cSsbsx/XcJkwszPTAYghBBCCCGEEPIbkrqG/d6grK6vt0vicqEvP0IndAW6tgc2hx0AYDmdly4XVs57CSA+BYSVWrcigPgUyPMCALCYTR72t/uj0b6uHRWwRTKZqfRtTYyG40ZrJl4FhHNxMmZc9qUGfL99KqDXgmRaV6SpzP+NAs7TqGtXka6lT6Pi33Y6jacG9Ex9iu5PFM1UaqVE8AowgOD/AVcMbx/sQt9A/z9cM88iZgBtCyBT6dOcQwV8TqOvplJfRNuF7jkGXZSnM+1UAAAAAElFTkSuQmCC"}, {"id": 45, "name": "博美", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVR42u2XMQ6CMBSGX41HcLMzJzAurN7CicR4CA7AIYyJF3HtQtzcmOvmHcpAaqBKSluiSP9vg9I27//pe69EAAAAAAAAAAB+Axv64XqVqPbz41kxnw3HWkez+HcHlq4T5O1ERER8c1Q+G7bmjxJAfA68lLxsJxFAhA7cz2E7hs6fmwPWAJTIlRJ5b8bhWUk8K8l33LZ+vGdgqCpS5F3F06LzXopdM1BdrU4TEbG0YHCgrYTVCa1s0igt94fP47amzFH52Tjg3Y36VmIzI+luVK/v2p3GU4lNpUIx19OO8oycnJh/JUYAU70PhPL+75eELPQNzPrhqzwOMQKYWgC2mxccCO1G+7rSsYg2C9V5vmvqgKWJrgAAAABJRU5ErkJggg=="}, {"id": 46, "name": "比熊", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2YvQrCMBSFT8XBB3BTOhVBOohdXXwanZ2dnTvXp3FxrTiIIE6imw/gFocSocGfJK1iyPm2tOSGe06Se1uAEEIIIYQQQmpGpCsh0pXQHdvScF2owHRCp90zUu08XwIA8jwHACRJUiw8Gwd1JOC8A01TpY+nnVbgVrYGANymo0L5DKWxQLH/u4tJad7legj8PgNS+e1+U3o+6A+NHPhEFMZ4t46uE847wAScTyAK48d+tnnPOlA1gHorSbXl87puLf96oaqVWLcOqLAS6zpi64SqvFRcxvfOAe1bSFWqKmo86WgUxoK9EBNwqRLb8mTvg7fQL3jVO5kqz0PMBP4tgW9/ebEbtf03atobeefAHWKoc9qCieECAAAAAElFTkSuQmCC"}, {"id": 47, "name": "小花貴賓", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/ymx8En1LIjFhQ6M1PAA01CPARZSQ3pdmQlZFpmxpkEYwV0MDAwMDP8ZDvxnYGBgkGlNQ1H39M0txpEdA7CQ74uWRxEvWvqQIotO/YakfbO1ZQzIIY9pD8N/UmJi+OYBWgFYTFALDPkYoNgDQV1nGIK6zpAtP1oPUGrAoVlRKHy7tGUo4odmqTEwMDAwvLlzazQGSGoLkVoTi6ioYRXHFfK48sWIq4kZyW2FktsmQg95WIjDzB9tC+EC6CFFKUA3DxajQV0jrC006oER1xpFL9UQaf/MaI+MLgC9/iA35Ecz8agHBpsHaN3zGm2NUmtslFDbaMTFAABA42Zzdw+CyQAAAABJRU5ErkJggg=="}, {"id": 48, "name": "吉娃娃", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9klEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GTNIgYGBgYGmZC4/+RYiKSfKh4YeTEAA6dWJQwKD4y8GHj2bx9FFlKqf9jFAMUeMAtbwGAWtoBs+dE8QKkBd87NQuGrGKWhiN85Z8XAwMDA8O7OsdEYoEkMwEJWSMUKa4zQKuSHTQyQ3RoltyZGL5FgrVGY+aS2TkdOHkAPKUoBunmwGDULW0BSTIzWxKMeGOh6gFyAJe0zjJZC9ADo9Qe5IT+aiUc9MNg8QOue12hrFFerlFpgxJZCAO98WUxkQU5NAAAAAElFTkSuQmCC"}, {"id": 49, "name": "約克夏", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABL0lEQVR42u2XMW7CQBBFn6O06SgiRXEZegvRIKWMaGhwm5P4AJyEFg6QMhINstyTkggpRbocwCnQFrushb2YKIb/urHlseZ/r2cGhBBCCCGEECKQ3XhS7saTsm7cNjddFzBq+sBD78mr5nrQB6AoCgCSJAFgmG/8zn1/RHIAuG2q9GI2sOLH5Q8An9O7vfIkVrymb8WGNKNsw5nLc8Aon74828q/vXsTuMoei10O37N3pq4TnXdABXS+gDTLSbM8+L76wKkJVvOpFY9el9b11TwG4Gu7lQONZqG6ndhwH8fe61XKV52Lq+vEUegUWuVEnb+WT3GTX7NQ5eblKHXyJufkM46aKVWzkAroSicO5fDbz7WR/Qlu/whVXodYBfy3As69eWkaPbYntDUbXZ0Dv1gWeztTwOlxAAAAAElFTkSuQmCC"}, {"id": 50, "name": "騎士犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8ElEQVR42u2YsRHCMAxFFS4jxBWu8RCswB0zUGceambgjhUYAmqoyA6hUhEFHbHRkTj5r3Ri6/x/IskmAgAAAAAAAAAwDkXshHW1aS0CP5t7YbHOarYOaEo/XjeTwN4FE2eyd6DUlD/uqs54fWmIiOh82HbG96froEByHtOPQ22ME/NzYChDlZfva04sNguVvyrP2UTLTvI5z6+VLAQHYpHKS8Wt6gYqMSrx2N2odCTVCak8K87roxf61r9bnwd4PXbUu7CsXggbyL4Sp/Lh28eJ7C9ovVPqLQV+YmxgKhvwLqgdJhyY4t2o1V1p9g68AZ4dYr0bFm6VAAAAAElFTkSuQmCC"}, {"id": 51, "name": "藍領巾虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNklEQVR42u2XLQ7CQBCFX5saPA40V8CQVHAJVPkRJGgOQ4Lgp4ozoCDBcAUcCTg8hlDUkLbpZra0DYGZz5AFtsvOmzczAIqiKIqiKIqiKMp3cGy/2Ki3ovj6ejs5nxxY1nMI99cV8PJuuCxXAIDmcBB9cmBsfykXkKcAsdiEifV+fwAA+H4nc/3m/iz1AvIU2NaK3bno/v9XIF2nOUa9INMTlPumz7nzbPuDK64T9yfj7OrCKJKuVuvZXDtxpgKcB0yRzQspZUKMBzzbm5Myodcu9Qdw53H75FShdGQ4L1C1OXenAIDgcUzkPhd5er5pxqIqJnca5aCIkU6cd0zKUqTp9e88UJkClKuBn3x/Z5nztp1aFeA8kFbENuflduKqvECKcFNs3ulUFbD9Z1YVcmehqhDngRfrFZD30BpZ1QAAAABJRU5ErkJggg=="}, {"id": 52, "name": "花花三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABRElEQVR42u2XIY7CQBiFH4QQDkAwNKgG0ytgCOEEWARrOARuBQgMfs2u2HuA4QgYgoEU1B4ANyuaIXTSYWZKK5p5n5t2ps28N6//X4AQQgghhBBCSkZsdkJsdqLo59arLkzDdmK33U+pd/071myVBwBM1skYyThYzp2eQwck8fcPACD4mFmdZ6l0jK/kQthkBp6puWYgXnVS1+/T7ct1o8E4Nd5/rqSDzEAhDuR14ny50YHMr5D6vdchFQ97EQDgNM2e97h/OWQ6oXufrTP+ZUAqqUNV3DSPGcibAR0m5W3fxwyYlHJVWj37JqVNJ0Gu86cblTt+NyO2ypt6rrAXCT//B1xp/Q5z1Zm7mplF5HkGykJX4W0rNR2w7Vof/9RIMhEs8Jby/lVi1640b4V27U4r70C9SAXVPqdSG6hcBsrCuwz8A7m6j79ZUAOnAAAAAElFTkSuQmCC"}, {"id": 53, "name": "瞇眼奶油貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA7klEQVR42u2XPQ7CMAyF3YojsMHMUtbeB6QeC6ncp2tZmGFjYUcKk6VSKUrqWAqp37dFimvZL/4pEQAAAAAAAACAPFSxF3fbg5uen697JXGo9R2mLl2BzVKDR38lIqL9+eQkDif2KgHYU4C5DReZ4agbgD0F3sdPksNU+/UrMO/TPpq2+6mFpeeQv9j5UJubxKHu48u07x4msbQGtOYDakCaKekk5rcfynToJbCdnUnMEafWSGzmI7qYs72NauPL/Lxm7NZArsyH5gEUyJV5KKC9K0m30+IVUAugaTtvzy4igL/fRrX+F6Q70moV+AIHMnClYArS1wAAAABJRU5ErkJggg=="}, {"id": 54, "name": "紅圍巾黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2YTQrCMBSEp6JbVyKIP0u9gBQ8hxfQG3gUb6AX8ByCeAFd+kNBXLl1UVeBIj6bxOdPzXy70qSPvMlM0wKEEEIIIYQQQr5DZDuwWeum2evjeRv5FNR6jqFUdAXKrhMOszkAoDUepT4FM/NVFhCeAoZ2p/ETCygFl0Jand/vEqbQQw/c53Qey+kVADCYVLzuS/VslaEHpL1tOy54D0SuHtBOIQl6QFJm1e+pFI7Xm6edztsJZl44Cvi+kRf1KgBgeLpYpY9r2oV7GnXFKBEL6SN1Xkqrv/HA2xUwe9/VU7Zvairgy6udpwLa39K+p9PCK6C2gP0uyT1h8q+Epgekbn9ahcIrcANXQnadjjg0rAAAAABJRU5ErkJggg=="}, {"id": 55, "name": "大蝴蝶結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA3ceXSVP497TVPXAyIuBH86mFFlIqf7hHwPo5TQhoCKnjTdPEJLHZR+x9QPTiKuJCZU+hEIcXd1oTUxpHqC0fhjNA+SGFCykOWYehZTv6dZY9aHLw9I+oZAmlBJg+kZOTQzzMa6QgYU0Q4E9hJ5wkCjzKCjt/o/s1ii8bYOe9r//gdA48gSp9Qx6nhm5eYBWgFDIE6oPRmNgoEJ+NAao3VYit3U65GOAah5QkdPGWWYPCQ8M+tYotfoLxLa5RkwMAADSa3ecoQRLMQAAAABJRU5ErkJggg=="}, {"id": 56, "name": "小雞頭灰貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABEElEQVR42u1YMQ6CQBDcMz7BTmLpA3wGr9DGHxBaWuMXTPQVxndYGiuChQl/OApDIhhYvN2IcDMdgWNzMzc7myMCAAAAAAAA1GDT0No0tL+qNxk6YVNN5omIgtW98mwWZwMFWmC0FfjAJXsV2l4NFJAoMJ8tKww/8psTo1r/8bcLZccTEREFm7VTr39bDw+IciDZ7/5iA/4pcMifooLS9eNXoN6nWS9EcasnuPdN9brmg39JzHUfjvH6d0hiqQek+QAPuDLlmsTl2eeY5k5Cuc6fJC53LPVIV+Y7dDGLWwlNNDFf94y/HuiLeS4PoEBfzEMB7VnJdTodvAJqG0iiuLFn41ZC83Zaaxb6dkYarQIF0q1/NBoPzNkAAAAASUVORK5CYII="}, {"id": 57, "name": "圓眼鏡橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42u2YvQrCMBSFT0sHcXar4Cbim7j6BPoYiuAi+hj6BK6+iYibYHFxFHEQ6mKghNakaevfPd9Wkts09+T+pAAhhBBCCCGEkM/g2U4MG+04+Ryd957LgmW9R+H/ugJBXoPjcgUAaA4HscuCCftSNiBPAcVu3vqKDchT4HKaAgC21yh1vFsPX48/7alAlgJ6njbRn90BAOtJkOp5fdx2Pdv64IurxKbs0xkfkGceK3HRGChaHxgDrp5yrcTq7Js8bToJyk5OJVY7Lhojtp43ZzHEsrvRWm8BALhtRqV8SJbn9ZiRGwNVKWHyvKkeUIGqzryYSvx2BbLyu2t3KlcBPevY3gP4V8K1Gy3rvuDaI/2tAg+Lv3kuE1HPgQAAAABJRU5ErkJggg=="}, {"id": 58, "name": "耳機三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABZElEQVR42u2XrW4CURCFz24q+gAEU4IiFazgBRCQpgkSV8GKonkDHoA3QIMAUYcnBERfAQTBlJSqikrcIjaXwGR3790fUmDmMyvuX+6Ze2ZmAUEQBEEQBEEQBOF/sEwnPuWePQCovU0yOXjx0QQA7H7XVpp97FuPwIPpRKX8qPEHACi03xMd+D0YAgBc+PuN+2VIBOK8WVTyvpI9/7t355HrXqqv0fulxL7bLNTqrLwgxZTylLiR+Nr+ICirjftli7cHVL7XoRQvFR0AwMYNnncc3y4jPUHPN60P9xeBk5t7Jm9dKRumOB2ffU7P5kWczzQL6TxAFU1KWATiRsJm142mjQRVPkxp3UtQ6/j0QurGpnXCdL8w5WnFp9mvVHQ8XhFIyuOoHstjylt76pmuw9wDl4IqT7OVrh5IBEy71uM/MXxPFLpIpTy/Sqx7s1n1Ruy6UTtLBXUd5lVf4OY8cCnYeeAAXW+LzaTwmKQAAAAASUVORK5CYII="}, {"id": 59, "name": "青圍巾黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2YTQrCMBCFX4viBdyIPyvxDh7Evd5AETyEIHoD3XsQ7yBdtUo3XkBc1I2BIsYmcfyped+uNOmQefMmSQFCCCGEEEIIId8hMB3YrPey/PPxtA9cAkp9RxGWXYGK7YTDegMAaI2GmUvA3HyRBfingKLdafzEAkLvupBU5pM4ZRd66IH7Pl3EbnUBAPTHVaf3unimytADuto2Hee9BwJbD0h3IR30gE6Z7nYuEjgazJ5muqgS1Dx/FHDdkWuLCQDgPF0adR/bbufvadQWpQRutW+aeV23+hsPvF0BVfu2njLdqamAK69mngpI36VdT6elV0BsAUmcFp4w+VdC0gO6bH9ahdIrcAVap3VpEj/ZxgAAAABJRU5ErkJggg=="}, {"id": 60, "name": "乳牛貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2XMQ7CMAxF3YojsIGYEAtIcBIWBlY4GawMLOycgAUkWBATgo07hClSGmHipKkgyn9b1KaW/fsdhwgAAAAAAAAAwG8opC922gNlrp+vaxESMNZ3NGXqCrR8NzxWayIi6i4XKiSgsT9KAvkpoBlPRpX1dreRbdwfoiZQZteFbvdLlMD93hBd6KMH7D4trSSnjOs5F0+qDDwgrfhsOq90K3iAU8DlgdhdiAMecCkTqoRdea7Srj9B78tnFtIZ+54Tvv+43e3s7mUoqfKeRl3oykmnVe6cOR3PX70DBTik9wOu8tKTGgqEeqJu5fM7iZu6mdW9oSWvQBmzgq4J868TSM4DTZGdB9773H0Ao09poQAAAABJRU5ErkJggg=="}, {"id": 61, "name": "魔女貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPElEQVR42mNgGAWjYBSMglEwCqgIorw2/I/y2vCfXvYxDfUAYxrqMTHkY4CFmiE+rJLQsPEArfPCkI8BRmqn/aUzZjEwMDAwRGekYVW/bFsA42gMkBMD0iJqKCFtb9ZFkcUHT5UxMDAwMDx9c4txNAYGQ/lObt4YeXngyfwFDAwMDAxz3rwky8IUEXEGBgYGBpnEhNE8QFZbiNyQp5b+4R8D6OU9IdBQWg6huzvJksdlH7F5Y/jFAC6f4wqpJ69vovBlRNVRxFMSAiBpf8EGBkpCejQPEAvQY4TUNtaIywNkt0ZxlSrEllrk5jl0fSOnJob5mNI8QmzIE4rhhtLy/6PjQtQEuEIePc+M3DwwUCFPqD4YjYGBCvnRGCAXEOo3kNo6HR2dRg5BXGX26PwANUenqdUWIrWNNGxjAACcXIyr+X9aZQAAAABJRU5ErkJggg=="}, {"id": 62, "name": "小紅帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9UlEQVR42u2YPQ7CMAyFXxADExMbAxtwANSDcBwOwHE4COoBKBsDGxMTW5kikKWQn1qKqN+3VY0b+T25dgIQQgghhBBCCKmDS124XKz77+f74+pKNtT6jmfy7w5McwPOuw0AoGnRl2z4ie9UErDngFSyNnYdmO9fRXHP04wO/HRA/qdjbA83AMDluCp6H9ovtT+Mz4FQ5iGlpLJS8ZDy7MRaNRBzJHc2MlcDxdNoaSeWM1Buzck4O53YZzy0RlKVjznsp2G7s5A2IeVD5wZ7NVBL+Vg/oAO1lKcD2mfpXOVH44BaAk3bqd31mHLADb3b1MZcDbwBWlxp7tNX4C8AAAAASUVORK5CYII="}, {"id": 63, "name": "飛行員貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u2XMQrCMBSG/4qDB+im4KYeRARvoeDu4qIH0MErCLp5BBcPom6Cbq6CW10MlNCSNL4q+v5vS9M0zfvzv7wAhBBCCCGEEEK+Q+T7Yj1uJen29XaKQiaU+o6h8usKVIsOuKw3AIDGcJAAwGh/BACsuu3M9+3+1HiRBehTYLmdAADGvRgAcH89N20bu9+Ml6KiLgsd5k2RiTuzM7NQpgfsPO0byTxlXP158/kqQw8UjTg9IO0Bm6JZih4IjVToeWD2vivSrp1gxumphcyK3/WIb+TdWQyJzmrUUOsvAACP3VTkR/Iib3tGrwfKUsIVedd5QAXK2vNqTuKPK+C6NxStTvUqYGcd33uANHqqUan7QmiN9LcKPAFnYH/zDNNf1gAAAABJRU5ErkJggg=="}, {"id": 64, "name": "貝雷帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPUlEQVR42u2YPQ4BQRzF34rCAURDVKLZXqURkWjcQMElFA7gGhRuoNG5gFZBNMRH4wC6VchsmOyaj92NbOb92p3Zyb43b/7/HYAQQgghhJDccu0Pgmt/EPxr/ULeBfRsFDcZX12vPDqQhgNp7fPWdv/93sfBc9qBoqlyl/kCAFAbj6wWTDrfXQdC7pO3krMKAOA53Pwc3m33WAdSOYWq5WbwqbyMqROn842nUGQGhNIqhOKNug8AOA6jx4XPz7tIJ+LW03XGvQwIJeOQFVeNYwZsMxCHSnnd9ZgBlVKmSst7X6W0aieIee70QuKLk2ZEV3m54suVvlH3A0e7UUNKy45VnXnKmZn6jmcgK+IqvG6lpgO6XWv4T4x3JmpTJFLe3Zs53a7UtkKbdqe5d6CQpoJyn8Pb6SwzkBXOZeAFYZqGYNzbCsgAAAAASUVORK5CYII="}, {"id": 65, "name": "花冠貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQElEQVR42u2XIU/EMBiGnyMogsQQCBgCp9EkYIE/cRg89iAhZ7B4zN2vAAsKR4K7EMyREQwShSmiLOEalm5dydj1fdy6tUvfd+/XbyCEEEIIIYQQohk6ZR9cWdo0P6+zhw27wNr11BrDsTEAvYXDX++blwMDsLr9DMDr+1Onzgbm2u7AfNUJ2ekVVsHjacVv7uz4zhYAZ7nil7cGYLS/awce77/X+bQOneyRtAOVM5ANRwB8vJ0HvXBxeWCdOuopA0EZCFU+1vzZd8Ct9z66/QkA44v1oPtF7yubjfSqUJGSZRV3n1MVqpsBF5/yykCsbrSq0u6371Pa9yXk89I5ifMd181IWeX9VQyTZi/0VxQp72Ym3Qw0pbzvPJADTSkvB2L3SqHdaesdiLaBbn9SWLNbsYF/343G+l8I7ZFm1oEvNQGFAI6ZIosAAAAASUVORK5CYII="}, {"id": 66, "name": "毛帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCklEQVR42u2YOw6CQBRF7xiWgLHQWrfjEjRhAxaEltZYuAESXYLrsdbChD1AgdOQTObjQwJzT0PBfO+b95kBCCGEEEIImQ3Nl3/Nt5i6YMq3w7V6iKh7yvaKFgCQuDZcp1vRc63He9dPRR9wjS6DLEApRR9wYbPcAQBetzsAoKo/QRNm6aob73hgHvCygCZUean+87eAb7wv86L7Xs5B/03zueaHePKAVsqkpKvi/XbRZ+JEuuaxKU8f+NUHQpXun32b0raToPvFk4n1jqXuBTblHaJYE2ctNBQm5fs+E68PjKW8LR/QAmMpTwtI10qh1enkLSC2gTIvjDGbr9OSr9PSb6Sh94DZWKAFmyl1l9QS1zAAAAAASUVORK5CYII="}, {"id": 67, "name": "天使貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIElEQVR42u1ZOQ7CMBBcRzwBKiJKKEKbT/AKkPIsJHgFn6CFAkoEFTT0SKYAI7LCmNiOIrIzZZL1yjN7jBQiAAAAAAAAuVCxDtKHif6YYLBSdV4gEa8AZ94wbnsOBYB/7YF+d1iq6dNl71XTsc5pTQ90qgYcF0siIkpnU+2T8C0eU8hLAYPteu4XuMEeCFPgOr4FJQyNb78CfE67kOXF155wvbfl+3U/JOI2sWv6uBjn33GmtdZlF6uUQg/UuR94vrQ3emzs866kiE2JRKwb9d3EpvZf3ujJNIdRwgbTO3I2sblxaI/w83hpV5h2WrYbjQ0b87xn5PZAU8y7PBEUaIp5KBDbK1VlvjUKRLtAlhfWmY3/AzH/D8TyQi6PJEaBO8VgfgLKF6mkAAAAAElFTkSuQmCC"}, {"id": 68, "name": "小惡魔貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA7JykoPCA0wjrhSiVsg/fvR8tBTCmgfQy2lC4LhvNAMDAwOD5ealZMnjso/YmBnNA7jSNrHq0EO6KmoDSoy0LQtgHFkxQCgPULsUwgXi3boYiIkJphHbGiU3JtBDHj2kYWDhrjK85sDyzsiJAWrVyIRqYFJLu5HbGqU2wBXyuEqrYZMHWAZ7yBNqE43GwECF/GgMULsvTW4PbcjHANU88PjRc4ItzNFRCWrmAVyhTe9YGPIxAAAUc3GeW2CFQwAAAABJRU5ErkJggg=="}, {"id": 69, "name": "聖誕貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjFTASKqGpx6+/6npAOkdmxkp0c801GOAheiQElGjasibnbmJEqPkxgTTiMkD/////08TBzAyMiKbD+OP5gF0ICOqzsDAwMDwZP4CBgYGBgbL+kqyLDze2A4xLzEBa0yM5gFCpZCsnCRVLH786DmkFHpza7QeoKi8Pz7hNyRPFLCSJY/LPmJjZvjFAC6f44wZ26OQkD6LVlq9vomm0IGBkpAezQPEAsyQJ6+NNWLyACO5IUVufQAr/8nOc2j6Rk5bCOZjavULCIU8ETH8f2TFAEYNe/YApIY1dqBO3xhHyKPnmZGbB2gVE4RCnlB9MBoDtErzI7c1SmuAq3wnt4c25GOAah54/Og5zjJ7SHhgyIxOU3uMlNIe2pCPAQD1O38Emsk5wgAAAABJRU5ErkJggg=="}, {"id": 70, "name": "小獅子貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2CgACO5Gk9W6P8nR595x0VGanqAacTEALkhTusYGf4xAAv5oDnfUcSfvrlFVshJi6ihxOS6FE6KYmLIxwALqWn+yfwFDAwMDAwyiQlk5Qkk/VjtIzUmhm8MEAJX51gNCg+MvBj4+HcWRRZSqn/41wPo5TShtK+dcgxvnsAlDxPHBYitZ4ZvTYxeD8BqYkKlD6EYQVcHq4nJbRuN5gFywWgeoLQ1Sm5MoIc8rtYooZQAi6HhXxOTGjLEAlgImndgz4OESzGG/yO7NUptgCvkcZVWIycPDHTIE6oPRmNgoEJ+NAao3ZcmNeSHTQxQzQPaKccItjBHRyWoMT9ArbYQpf2AYRMDAJvhgqlqvjdcAAAAAElFTkSuQmCC"}, {"id": 71, "name": "藍圍巾哈士奇", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjVcPb6eQYGBgYGY03D/+RYiKSfKh4YeTEAAyFJWYPCAyMvBtq7Z1NkIaX6h10MUOyBN1b5DG+s8smWH80DlBqwxB/K8IeEsoyoOgMDAwPDk9c3UdQVHBuNAdrEQEH5RAYGBgaGCZ352EMeKj+aB6jVGnVYc5MqFh8IUUdpjcLMJ7V1OnJiAD0miG0LvfGC5A2RbZC8sGbeNKwhDzMPXX60FMIFYKUOsaUMLCYYoCE8WgpRmgfILe/XoMUAuWl/NA9QqydHbsiP9gdGPTDQeQC91IGlZXqPVozceoDaYMSWQgBKgmQZ8vlq1gAAAABJRU5ErkJggg=="}, {"id": 72, "name": "飛行員柴犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJElEQVR42u2XPQrCQBCFX4JHCFhoISh6gNxAxEPYpBHByiMEa28QbLyGiDfwAEoEi1gIttax0BFdLdxkQwj7vm7/Ztl5uzOzACGEEEIIIYSQcnD+ndjwuul7+3w9OFk2NGVHcKuuQE13QXJcAwCa7WEKAOPNHgCwHPR+zlfH39YbOYB9CiymIwDAbOgBAG7PfmmrqOOy3hSudVFoN+8Y2dgPY0YhIwfww/jlzSzjjEJ5DSSn7Ue72ep/9CfBo/+ymlCBQhQQz9aD6KciRXne3jwgZM0HakSSPCD2dfOCPW9A9VReVHuiqB9CSwl7M3E9iF6Rp9KlROXzgKigG++/73626pQK6KLmj7z/Av4HeICy3oAadeQum/ozsxr9tyo1hbVR6A4y2W0Tp4St7wAAAABJRU5ErkJggg=="}, {"id": 73, "name": "粉領結貴賓", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA+klEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCF959FVqlisIqdNlZgZ8jHAgivkL14/jyKur2lIEwdgsec/KTEx5GNg1AND3gMqcto4SxRi5Ed8DLBQagB6vQALbZg4teqN0Zp4tCYe6NYoeozAYoJj5lEGBgYGhh/p1lj1ocujhzwsxGHmj7aFCLXfceUNWEgzFNhD6AkHSTIPFqMqctojqy1EcT2Akfa//4HQOPLEaD1A7RggF2BJ+6M9MroAXG0nckcpRvsDox4YLB6gdc9rtDVK7bFRao2VDvkYAADUf1/j2qVHdwAAAABJRU5ErkJggg=="}, {"id": 74, "name": "笑咪咪黃金", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJD+uoKC6pYrB3B8J8aMTP8YgAW8vtaJFDEnWpe0MQBmPZAYobYmBjyMTDqgSHrAe2IEwzaESfI5o/GAKF6gBCA1QccMlYMDAwMDHePQGhlmz4ovwhN/WgeIK0tRGpNDIsJ9umfGBgYGBh+ZvIxMDAwMPx4cgxnHhqtiUlpjaLHCLltIvSQh4U4zPzRthCh9ju1+wMw82AxCmuljraFRj0w2GtiSgFm2j8x2iOjC0CvP8gN+dFMPOqBweYBWvW4RlujtBobpdZY6ZCPAQBXWWF74CBD9gAAAABJRU5ErkJggg=="}, {"id": 75, "name": "伯恩山犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJUlEQVR42u2YPQrCQBCFX0RbKxXEn9IcQBFEBO8g3s9evIONCKIH0NIfBLWytYhF3CJDYrLJBjF5HwgJa2bNvN15swKEEEIIIYQQQn6DpftAo9JxTEx8eRwsE3EK/65AUTfTrXb9a8D1bgkAGHTHYXM7JpTJngIq8zLTp+M1lR/go6ijo8TfK5D4BWZT9xN3nFUoaQB7+HIv5iXf6iPHqYBpBTBafeq/e9us2gCA830vvjimAlq9kK4TKweWBDlykK/kzokt3S5007ONTNzf7j0ZV/GpQFQlwrpSxaJWBgBMbk/P2peZV/HkOH3AQN/vUaJvuKvN7x6QThtVCVn/46597gFTJ7C4meeJjC/w6z0gq45ay1EdmgokVSCon0/r/6PMKvAGMeZq3nInrU4AAAAASUVORK5CYII="}, {"id": 76, "name": "傑克羅素", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9UlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCH95PVNqlgsI6pOlZgZ8jHAgivk+3xEUMSLtrwhy4KdpQ545THtYfhPSkwM+RiguQfcuw8wuHcfGLoeoHseILc0wVU64ZRfoD4aA1SJAfSQRQ9xatUbIycGYOUvrDwmOUaiU0hSj16/jLiamJHcVii5aRu9DQQLcZj5o20hQu13avcHYObBYlRGVH20LTTqgSFVE5MLsKT90R4ZXQCuthO5oxSjmXjUA4PFAzKi6jjHekZjYDCOjVJrrHTIxwAAw+ZfPOqxkNEAAAAASUVORK5CYII="}, {"id": 77, "name": "頭巾柴犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8OTuLgYGBgYGGWW3/+RYiKSfgYGBgeG/f9x/BgYGBsaNixhHZAyQnAeeWFtQ1wFkhvzIzQMv3d5QxWLj+jujeYCsGMAVkmcbVciSH80DlBrw5ME+FL6MghOK+JN4aN5ZmEYTD4zGACxkxeNnYY0RWoX8yK2JYQBXqUJsqYXeGoWZT2rrdOTkAfSQohSgmweLUeN6BpJiYsjHANkeEI+fBS95hqQHhk09AIsFUst7zLR/h2G0FKIHQK8/yA350VJo1AMDnQfQSx1CPa/RGKC0NYqrVUotMGJLIQCxFmn6MUIFwwAAAABJRU5ErkJggg=="}, {"id": 78, "name": "小花白狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/ymx8En1LIjFhQ6M1PAA01CPARZSQ/rOo6tkWcQx8yiEEdzFwMDAwPCf4cB/BgYGBpnWNBR1T9/cYhxRMcCIK+QvXj+PIq6vaUhRDKDHBCzkcdlDbEwM3zxAK/Aj3RrCaKWOeUM+Bij2gIqcNoOKnDbZ8qP1AKUGoJdKsNCGiVNaao28eoBWNTG2vIENjNbExMYIuTGBHvKwEIeZP+JigOhSCD2kKAXo5sFiVEVO+/+IaguNemDEtUbRSzWktM8wWgrRA+BqO5Ea8qOZeNQDg80DtO55jbZGqTU2SqhtNOJiAADex14JQhaAQAAAAABJRU5ErkJggg=="}, {"id": 79, "name": "澳洲牧羊犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLklEQVR42u2YMQ6CMBiFH8YDOOiks44aL+ABGOQAJE5egLAbduMFnEh6ABYP4AUMjjrrpIM3wAFrQiMqWKLI+yagoeX/X+n/WoAQQgghhBBCyHcwsr7QbnYjHQMfz3tDRz+1v1UgLdOz+ULLwJ7raFGm9ArU0zLfHwwTz7fhJnEfCAEAsGz7ow9Qx0GIKIsS/6fAu2TNvC7FqIDKumECAEaX1dN2yy4mACogxvIqznSn1QMAHE47AMD01rr0qcB7CtzX39t6/IqlH8/96cRMZF5tT0OtL5WrxEZeF5rXE6keSGZc9k8v9Mq/694PyP6kop7rVMsLFRZAIMTd/5QygNJU4rxu9cHc546sUOT/oNaPvJmnAkXv4CqjgLYAPNdJPethHfjFs1FdZ6WlV+AKB5NspjiHal4AAAAASUVORK5CYII="}, {"id": 80, "name": "滑雪狗狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DYgP9QQC/7mIZ6gDGSquGphy9VQld6x2bG0RhgYGBgITrERNSomq5h5j19c4txNA8QW7rQxAGMjIyjeYAYICOqzsDAwMDwZM8sBgYGBoaPFyaQZSG/QQHEPJe00XqApBiAAXJDnlr6R2PA//56FH5DIpSej109bnn10RggKwY2KgailirykBg50IBWWr2+iVef9mgeIDMGMEqVhZCQ5Y9fjzXkYfKj/QFK20LordGrPVpkWahdcg21fwFtjZLbOh05eQA9pCgF6ObBYlS7hIGkmBjyMTDqgSFfD1DaJ0ak/WsMo6UQPQB6/UFuyI9m4lEPDDYPaJdcw2jnjMYALUanqT1Git42GnExAAByU2Ifn8MtAgAAAABJRU5ErkJggg=="}, {"id": 81, "name": "牛仔狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2CgACO5GlcW2P8nR1/4hIOM1PQA01CPgVEPDDRgIVWDtIjafwYGBoZDV56TZSFM/9M3txhHYwBfKURuKUMpILWUGn55AJZGL97/iCK+8Og3BgYGBob6MDmqWNy46hEDAwMDQ7w1F0V5ZLQYHfXAQHugcdUjeHomR360JqbUgKMrslD41hHTUMTdgiDiu9ZtGY0BkmpiWHmMDnDVA25BPljFcYU8rnxBahuJacT0yNBjhNwaGT3kYSFObit15JRC6CFFKUA3DxajjasYRttCox4YUjUxuQAz7T9iGC2F6AHQ6w9yQ340E496YLB5gNY9r9HWKKF+ArXaRiMuBgAq12Vgp1Yt9AAAAABJRU5ErkJggg=="}, {"id": 82, "name": "雨衣狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/UlEQVR42u2YrQ7CMBSFz8g8ZsEwjWAJAoncM+0xeCYkEkHCBBoMqeEJhrokXFjStQ376flkl7W797T33BUghBBCCCGEENIPSdcXltmqCbHw3VyTEPPMJqtAc941vXzQ5phEpUDatsefp8XHeFHVAIDbIQuycF4aAMBlv/65vu0ZmZ4CtmiFbJlvH0EDGL0C3gEUVf0+Hy7Po1cg9Z1AVxHJtozr51TA1onbeh7xAd8qJD7g2yPNoulGtSKujqwzLxnv6sDxVSGdqVD/AzKfKJqXiKsXYgCjd2JXvve+AavQP9D+4Zp5HmIGMLQA8tK0dphUYIh3o6HuSkevwAsMZlpWLsAVNgAAAABJRU5ErkJggg=="}, {"id": 83, "name": "探險狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjFTASKqGExuq/lPDYouANkZqmMM01GNg1AODNg9Ii6ihpPUZbXY0cUBG1SEU/tM3txhHdgzAQn5fiwSKuFPNCwYGBgaGqyssqGKxdsQJBnz2EBsTo5l41AMD7QHtiBPw9EyO/IiPARZKDbh7pAiFr2zThyJ+94gVAwMDA8OPJ8dGY4CimhgGcNUDHDJWWMVxhTyufDFaExMbI+TWyOghDwtxmPkjLgaILoXQQ4pSgG4eLEa1Ixj+j7aFRj0wlGpicgFm2j/BMFoK0QOg1x/khvxoJh71wGDzAK17XqOtUUL9BGq1jUZcDAAAF71dJEPaaykAAAAASUVORK5CYII="}, {"id": 84, "name": "水手狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABAUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN/////08VixkZGalhDtOwjQFpETWUkFaJ3kUTB9xZ6obCf/rmFuPIjgFYyO9rkUARd6p5wcDAwMBwdYUFVSzWjjjBgM8eYmNiyMfAqAeGvAe0I07A0zM58iM+BlgoNeDukSIUvrJNH4r43SNWDAwMDAw/nhwbjQGKamIYwFUPcMhYYRXHFfK48sVoTUxsjJBbI6OHPCzEYeaPuBgguhRCDylKAbp5sBjVjmD4P9oWGvXAUKqJyQWYaf8Ew2gpRA+AXn+QG/KjmXjUA4PNA7TueY22Rgn1E6jVNhpxMQAA8OhdILOw24gAAAAASUVORK5CYII="}, {"id": 85, "name": "派對狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABKUlEQVR42mNgGAWjYBSMglEwCkbBMAL/6zf9/1+/6T+97GMaDXI0EH3g///oA/9HY2DUA0MFsFAz7TMwMDAsUfKGCED5Sx0YGUdjgJoxIC2ihreEibm3lSj1T9/cYhyNAQYGBkZSQ/rOo6so/JRTkEicY/YHqzm45FXktBmoETPDLwZgIX/x+nkUcX1NQ6wxQC6AxQAue4iNidGKbNQDA+0BFTltnCUKMfKjNTGlBqCXSrDQholTq9QaOTEAK3/1NQ3J6lU9iU5hYGBgYPhBpHpYuT9aE5PaCiU3baOXSLAQh5k/4mKA6FIIPaQoBejmwWJURU77/2hbaNQDQ3FUgty+NVLaZxgthegBcLWdyB2lGM3Eox4YLB6gdc9rtDVK7NgopW2jERcDAK4NdQR/It4iAAAAAElFTkSuQmCC"}, {"id": 86, "name": "眼鏡米格魯", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA70lEQVR42u2XPQ7CMAyFXcQR2onO5BpsLJwGiVMgcYYeogsb14AZJnqHMrlqDVbb4PKTvG+MFFvxS/wcIgAAAAAAAAAA3yEZu2GRLmuLxLfqkljEmQWrgFbp6/1skjjPnIkyf6/AXKv8YZN21rdlRUREx92qs77enwYlkvuY5zxUj1EiPAX64Io3d7hwL9+IdsebN1Q4QhfyUcC3u0xFvApofsAKWPkFnBhO/CvTqFTEVwlZea44x8cs1De/W/8HOF7LwTELmaJNofCBd//EVl1ITq/oQlMjlfOtfDAK4ADBHCDP3Md/Y3H7gDXRdqEHv1tfW+/rrVwAAAAASUVORK5CYII="}, {"id": 87, "name": "花環狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABU0lEQVR42u2XPUsDQRCGnwuprK1isAq2gkUKEWxCQOwUUqfyF9iIbSQg/gKrrS3sVBAbIVhYCJZKypjK2laLOIFdPM/kzo+471PO7Afzzs7uLAghhBBCCCGE+B2SSScszC+9AgzuagBUV/qev9N7AKA9t/mh3+Yli+dJEQGU/m0GTOmQwf4xAMPlGwAuK3sjxS+uPbtRuV8FwG2sA9Acdj179WDHG//0/JjEnQFT/vSo4dm3dq8AuD1pF7JxveX4bJ+vZmLmM6AAZj6AesuNz/M0/ugzUM67QHgrmdpmL+rW0kucpnjedyAkupc4tQZCJSwj1sOwfTjqffprXm+T1gvZePdy9u5x3j5pGY+3BrJqw2rButFxl1nreUqbPTz7ofK2XujXO5BFqLDVRJOueqEfycC05D37ykDRvdOkyus/oAD+WgDf/fNSL5T1T8hLtLfQG0J5fwhtuvgiAAAAAElFTkSuQmCC"}, {"id": 88, "name": "墨鏡狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBklEQVR42u2YsQrCMBRFb8XdpU46K9ivUdzdXASnfoaT4OLmLvo1FnTWyS5+QR0kSFJKTHlq29wzJiRp3s3ruwlACCGEEEIIIeQ/BK4DeuEgk1j4ll4CiXladVeg7Rrp02oksnAUI5NQpnkKqMgf5qHWPtmmX/mA/DovZT5Vork5YD/DCQBgulgDAPabpZYjtn4p/FVAoSJrKlPUL42/Cqiz3JkdtfZ+dwgAuN7PWvtjN6YCTl7ItRKbStgib+aKt5U4KOtCy/7PzciriKv56YVs/l36PqDme1dwz7wQN1B7L1SW/NlPeCP7CWb9KBt5JjE3ULUNRHFS6DCpQBXfRqXeSmuvwBMilGROKHAbfgAAAABJRU5ErkJggg=="}, {"id": 89, "name": "護目鏡狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDuj5MDoXPV7abgYGBgeFTlytWc3DJN65i+E+NmBl+MQAL+XhrLhTxhUe/MTAwMDB8+PANNYShNLo4sfKY9kDsJzYmhm8ewAUEBFBDDJa20cWJlR/xpRDFHmhc9YihcdUjsuVH6wFKDTi6IguFbx0xDUXcLQgivmvdltEYIKktRGxNDANuQT5YxXGFPK58MeJqYkZyW6G4YoKYUgtbiMPMH20LEWq/U7s/ADMPFqOwVuqIaQuNemDI18TkAsy0/2i0R0YXgF5/kBvyo5l41AODzQO07nmNtkapPTZKrbHSIR8DAA2ab39EiWMMAAAAAElFTkSuQmCC"}, {"id": 90, "name": "恐龍帽兜狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DIgf/nrf7/P2/1n1w+tQDTUA9IFmoZxGh4jBEfn1ZgyMcAyaEkLaJGlXT89M0txtEYwJcHcIV0yAkXqli8xoLhPzViZvjFACzkr66wQBHXjjhBEwdg2gOJGWJjYuTWA40PvpClr16BZ7QeoKoHtCNO4M0fhORH6wHqlyInUMTR5UdjgFAMwMpfWHlMaYwQk4dGdE3MSG4rlNw20RqLPVhDHGb+aFuIUPud2v0BmHmwGIW1UkdMW2jUA8NmVILcvjUi7e8Z7ZHRBaDXH+SG/GgmHvXAYPPAGos9GO2c0RgYzGOj1BorHfIxAAC/Q3VBe7LGVQAAAABJRU5ErkJggg=="}, {"id": 91, "name": "國王黑貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQElEQVR42u2YOxKCMBCGN46WdjSOj9ILWElv7xHwBh7BI1jb6BHoPYAlvaXi2DBjQWmxNsAYh7jhJUL26whhMvy7/2YTAIZhGIZhGIb5GzB0EUMXyXmejejZWHS8KJ2mC959Vx4AAB476Vn0l4KKhDSwmUXjgL/4gcZHQKR5IE35oTWVFPWPVq4FR4tAer4FZ0F58lsmtMcDSUiInPf3h0hJJ9eCyfcrB3SUpzzZvgjoMp4MqjVnpHTrPSB0J8ZVqCzlr5e7VhUyZydW1XuK0/YJAADzdS/Xe9V6upFhD6hyW3ee8R4QWT1QdhVSwR6gIpM3Ep/Kq5SmMiH+zpxeKP7jrPtE1hzPsOOj2d1o2aiUV1Ur8zxQl/Kx0nwiq1t51dnYnJ24qpOZbnfKHtBVsKrbCnNu5or281SfD3w7LfMCN1a6FpumcasAAAAASUVORK5CYII="}, {"id": 92, "name": "粉花白貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIklEQVR42u2YLw7CMBjF3whHwEGmCAYLJ0BhOAMEQ4IlQRI8lgRD4AzznACNISgCjgPgiig1C03/JsvY+5kmW7uu7/Xr920AIYQQQgghhDgiVpkQq0wU/R61sgtZt+3YbHQEADzmG3lhupNOQLqQrEeJy3MUz9c1oQNO9Bqy3c8AAK3t4qeyOh6Hoxw3GTMG/Bz48l4OAQC3b2vN6cxTKMiB96AfNGHo+P93wPY0UbTTroyF+8Xrvm4+2/xQegcS10ysU9JW8Xw/ZuLQGMhjUp4xEBoDvkrn975JadNOUOOqk4nVikNjxFZ5i1NMVLsajY1O+XzMVDcGilLelA/oQFHK04HYtZJvdVp6B6ItoJ12tWc2/43GqEZjfS/41kh/68AHdAh0nRk3yxQAAAAASUVORK5CYII="}, {"id": 93, "name": "鈴鐺銀虎斑", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPklEQVR42u2Xv04CQRDGP4g1icYOS8MbWEt1pfEJUO4JCKXUtpd7ApE3MJRU+BrGUjsjrd1RDcHNTmb3uIuR/X7d5nZusvPNn12AEEIIIYQQQsjf0And2D8fVPvrz6+3Th2HTf1H6P53BU5iDT7mzwCAi/F9Vcfhnn0jB0hPAeHpZflr/bpeAwCuh0Pvesfmu9EDpKfA6vTsIIeH2h+/Am6ftshvb7w1Ibmvfbf8hc6HbnKT+G4y9XcXQxG3Wy3KgpPYq4BVA1pkYxGlNFgDljKXs1Uth++PWVCkrUwQu3QmsZxYIvNw9ePdl/VyAMBsOfJ2qzww8lJr2h1rURZVWjWgRcjCjaB0H1cB7b9at0qvBmJR3wOBOR86qamAhht5iayV87F3JCoQWwvWLTb2dkoFQl9mbZHuJG6L5GpgC0hNlONH84yCAAAAAElFTkSuQmCC"}, {"id": 94, "name": "星星三花", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABXklEQVR42u2YMW7CQBBFv1GKNHSIJhYSEkrjK6RBUXoOQAGXoOAAOUQaUuQA3IBcggaliWWgQaKgodsU1iJ5xLC7xkYiM6+zsBftn/3zxwYURVEURVEURQzmMDfmMDdVrde4d0Eebqk8AGD/UbiOmoNIdAW8d//Uei6c2/VuFV1Tibg7uWoduR7IZp8AgHg8KtdJvtuVbkBgF9rmZzd7z5U8DhcXb399eat1A/+vC3H92XYhqzwltBK/6Ua7UMEDXFLafs0p3uskAICf4fk/OP2eLs9WguZLaM7I84BVkoMq7rpPvAci18xDcSnri60Ah1wP+E6jZStBleeUdp0E+5ycWcju2KVM6Hqc8jTxadL3OonRd2IfHr/6QR6z3jpSz0wT4R6oCy7haVJzE4JWwAXtHhlyT8RTBCnPfU+Sk8ShU2nZhObyQT3gq2DVlTkdFeYbqlwP1EXoG9rdV+APxyCxyJ4bovcAAAAASUVORK5CYII="}, {"id": 95, "name": "獨角獸貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABTElEQVR42mNgGAWjYBSMglEwCkbBKBgFVAP/b3j9/3/D6z+97GMa6gGG4YH/nzf8//95w/8h64GhBliQQ56BgYGB4f0sFD4jbwAjKQZ+vPBsNAZIAYzY8gC2kJcWUUPJF0/f3GLEVQoxMDAwMGpswypPrDmE3DN8YwAXgIXck/kLGBgYGBhkEhPIshBdP86YRMuTDIJpDNhiYviUQqSCO4+ukqdx72nikgY0pId9HiA5Bn44m1JkIan6CdVDwy8G0MtpQoBj5lFIyKZbkyWPyz5C9cPIrQcIlT4qctoMpKgjNqRH8wCt6ofRPEBuSJFbE8PSPqGQJpQSYPpGTk0M8zGleYTYkCeiFPs/sluj1Aa4Qh49z4zcPDBQIQ8LaVz9gtEYoFfI4xqvGjk1ManlNLk1NKFRitE8QGk/gOykMuJH5qjVXyC3jTRs+wMAfAqyJK39tGoAAAAASUVORK5CYII="}, {"id": 96, "name": "星空貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2XMQ7CMAxFfyuOwAYzCxdA4g7lCrB0qVgYOQQL6sICVyh3qMQFWJjLhrhCGVBQhRqSJkEI+b+talwrtr/tAoQQQgghhBBCfkNke3DQH9XN5+vtErk4DPUdRfzvGeh1Naj2BwDAcDGvXRw27INcQF4GFLPpEQCQ704AgCydWFreg14gFteFVOR9KcqEXahVA+992kS+XT01sNw4vdf5s80MNaCrbdtz1ICvBnTz4aUBw5ygBly3SNd5oGrfFGlTJSg7ObuQurGvRmwjX53XH7VTlEktexvVTubO22n7nMnSds3I1YAtvpHvOqmZga7aKMZhIi9vEutq1rXrhNpOqQEVedv/gNDI1cC3EKeBB6YjggukDs1bAAAAAElFTkSuQmCC"}, {"id": 97, "name": "月亮貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJ0lEQVR42u2XOw7CMAyGHcQRGJCoOlUsndnYuAUTXIJDcAmYuAUbGzMLYkIgMXAAtjBFqiIZmzSlNPa3Va3r2H/9KICiKIqiKIqitIXhPjgajG31+v48mxCHsd7j6HVdgf63BrfNFgAAsuXChjis2EcJQJ4Cjsv1FGa4P0YNQJ4Cr9mklsO69ukr4PdpjCIvP9YGdZ/yx50P6SmARe5nCutCLvPcLqWTOLQGYs0H8TUQvI2GTmK/O3FrDlNIziR2EdetEW7mKYWLvLSyt9HYYJnHJrq8Gmgr89Q8UAXayny6Ctjb2gIAmGxlmnBIbbF+5qnzdF6BaAEUeYn27E4E8HfbKPbtxdqFqB2JW4vp/w+4TPz8YMwuKOePzPE4zBtRZDjdGZFd6A2HtoRPM8TMfwAAAABJRU5ErkJggg=="}, {"id": 98, "name": "粉翅膀貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42u2XPQ7CMAyFnYoVJpjIDPepegA4GRwAcR+YYYIJDhAGmqoNCklTo9L6fVvVOJb96p8SAQAAAAAAAADoBxV7cDlfmfrz9X5WKQ657rFkQ1dg0tbgstsTEZHebkyKw5o9SwDyFKgyeTimGT4frAEIVGA66+axq/3oFXD7dAhd5F9rIvTe5y92PmTiJnGo+4Qy7p5zM22MaSiilFKogV/OB9efXqzf99xODUV8SmRit9HUSWy//eqeMtMf50olfNjakTOJbcRda8S9z/20W3Q7I3sb5caXebdm5NZAX5kP7URQoK/MQwHuXalt5kejAFsAusi9PXsQAfz9Nsr1vxC7I4lR4AUVkm8Rk3FyTQAAAABJRU5ErkJggg=="}, {"id": 99, "name": "花冠三花", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABaElEQVR42u2XIU/DQBzF35YJgiYYlqoGRB16CRCCAL7CxDB47MBgZvEYJvYZQAKC4EgQJITM0BQUH2DBHOJ2C730uLt2C2nu/Vyvd9fce339/wsQQgghhBBCCPkfGq4T11bWxe/r7CmWG0TXuT2uXoUAgN7yYeF9kR4IAGhvjgEAH19vjSoHaNbdgZbvguz0ElLB47ziN/dyvLMBADhTil/cCQAY7m/JgefH6T7f0qGTbQTtgHcGssFqbnzSvf1z3W5nL3f9cD6QTh31mIG5OFDWiff0kw4UfoX0770JpXgcJQCAcbd43ux++lLohOl5rs6ElwGlpAldcds8ZqBsBkzYlHd9HjNgU8pXaf3dtyltexPUunC6UXXiqhlxVd7Wc8VRIsL8H/BlabRTqs5M9Mz0k8AzsChMFd61UtMB16519k8NmYl2H5WUD68S+3alZSu0b3daewea81RQ73NqdYDaZWBRBJeBH8TxleQfxnyvAAAAAElFTkSuQmCC"}, {"id": 100, "name": "國王橘貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DIgf/nrf7/P2/1n1JxSgHTUA9IFmrEBIpAgzFUnOE/PTww5GOAkViF0iJqKCH6ZLcIWRbKuL5B4T99c4txNA+QAp7MXwANyQSyLITrT0wYzQMUlUI32uQHhQdGXgx8eV5PkYWU6h/+MYBe3hMCGlUP8eYJQvK47CO2fhh5NTGh0odQiKOrG62JKc0DlNYPo3mA1JB6cqWKKhbL6LThDWlCKQGmb/jHwA0rL5SQcL51h6K2EKz02aumgip+bBsjOaXdyG2Ncni2MzAwMDD82F5JFYfgCnlYSA/bPEDxqASlMYErTxFbU4/GALmA0pAfjQFqt5XQ6weNN7dG+8R4AXqpQ2w/YHRUgloxgKuGxCU+GgM4AAB6q4wD3bBfuAAAAABJRU5ErkJggg=="}];
const SUMMON_COST = 10;

    
const levelConfig = [
    { lv: 1, exp: 0, coins: 0, rank: "🌱 迷路的小村民", color: "#9ca3af" },
    { lv: 2, exp: 10, coins: 5, rank: "🪵 木劍小勇者", color: "#86efac" },
    { lv: 3, exp: 30, coins: 10, rank: "🛡️ 銅牌小護衛", color: "#22c55e" },
    { lv: 4, exp: 60, coins: 10, rank: "🐾 森林小遊俠", color: "#0ea5e9" },
    { lv: 5, exp: 100, coins: 15, rank: "🗡️ 鐵甲小騎士", color: "#3b82f6" },
    { lv: 6, exp: 140, coins: 15, rank: "🦅 飛鷹小偵探", color: "#6366f1" },
    { lv: 7, exp: 180, coins: 20, rank: "🐺 灰狼小戰士", color: "#8b5cf6" },
    { lv: 8, exp: 220, coins: 20, rank: "🧙🏻‍♀️ 見習魔法師", color: "#a855f7" },
    { lv: 9, exp: 260, coins: 20, rank: "🦄 獨角獸騎士", color: "#d946ef" },
    { lv: 10, exp: 300, coins: 30, rank: "🌟 星星守護者", color: "#ec4899" },
    { lv: 11, exp: 350, coins: 30, rank: "🔥 烈焰小法師", color: "#f43f5e" },
    { lv: 12, exp: 400, coins: 30, rank: "💧 水波小精靈", color: "#ef4444" },
    { lv: 13, exp: 450, coins: 30, rank: "🌪️ 狂風小飛俠", color: "#f97316" },
    { lv: 14, exp: 500, coins: 30, rank: "⚡ 閃電小超人", color: "#ea580c" },
    { lv: 15, exp: 550, coins: 40, rank: "❄️ 冰雪魔法使", color: "#f59e0b" },
    { lv: 16, exp: 600, coins: 40, rank: "🦁 獅鷲小騎士", color: "#eab308" },
    { lv: 17, exp: 650, coins: 40, rank: "🏹 神準小獵人", color: "#ca8a04" },
    { lv: 18, exp: 700, coins: 40, rank: "⚔️ 雙劍小達人", color: "#14b8a6" },
    { lv: 19, exp: 750, coins: 40, rank: "🛡️ 聖光小衛兵", color: "#06b6d4" },
    { lv: 20, exp: 800, coins: 50, rank: "👑 城堡守衛隊長", color: "#0284c7" },
    { lv: 21, exp: 860, coins: 50, rank: "🐉 飛龍馴獸師", color: "#2563eb" },
    { lv: 22, exp: 920, coins: 50, rank: "🦖 恐龍小霸王", color: "#4f46e5" },
    { lv: 23, exp: 980, coins: 50, rank: "🌋 火山探險家", color: "#7c3aed" },
    { lv: 24, exp: 1040, coins: 50, rank: "🌌 星空小旅人", color: "#9333ea" },
    { lv: 25, exp: 1100, coins: 50, rank: "🌠 彗星觀測者", color: "#c026d3" },
    { lv: 26, exp: 1170, coins: 50, rank: "🏅 青銅大師", color: "#db2777" },
    { lv: 27, exp: 1240, coins: 50, rank: "🥈 白銀大師", color: "#e11d48" },
    { lv: 28, exp: 1310, coins: 50, rank: "🥇 黃金大師", color: "#ea580c" },
    { lv: 29, exp: 1380, coins: 50, rank: "💎 鑽石大師", color: "#d97706" },
    { lv: 30, exp: 1450, coins: 50, rank: "🏆 榮耀大師", color: "#65a30d" },
    { lv: 31, exp: 1530, coins: 50, rank: "🧚 森林精靈王", color: "#16a34a" },
    { lv: 32, exp: 1610, coins: 60, rank: "🦅 鳳凰守護者", color: "#059669" },
    { lv: 33, exp: 1690, coins: 60, rank: "🦄 幻獸大師", color: "#0d9488" },
    { lv: 34, exp: 1770, coins: 60, rank: "⚡ 雷神小勇士", color: "#0891b2" },
    { lv: 35, exp: 1850, coins: 60, rank: "☀️ 太陽神官", color: "#0284c7" },
    { lv: 36, exp: 1940, coins: 60, rank: "👑 傳說中的勇者", color: "#4f46e5" },
    { lv: 37, exp: 2030, coins: 60, rank: "🌌 宇宙大探險家", color: "#7c3aed" },
    { lv: 38, exp: 2120, coins: 60, rank: "🌟 銀河守護神", color: "#be185d" },
    { lv: 39, exp: 2210, coins: 60, rank: "🐉 萬獸之王", color: "#e11d48" },
    { lv: "Max", exp: 2300, coins: 100, rank: "✨ 全班的超級英雄", color: "#ffd700" }
];
    
const thresholds = levelConfig.slice(1).map(config => ({
    exp: config.exp,
    coins: config.coins,
    rank: `${config.rank} (Lv.${config.lv})`
}));
function getRankHtml(exp) {
    let currentLevel = levelConfig[0];
    for (let i = levelConfig.length - 1; i >= 0; i--) {
        if (exp >= levelConfig[i].exp) {
            currentLevel = levelConfig[i];
            break;
        }
    }
    return `<span class="rank-text" style="color:${currentLevel.color}; font-weight:bold;">Lv.${currentLevel.lv} ${currentLevel.rank}</span>`;
}
    window.getRankHtml = getRankHtml;

    let currentSortBy = 'no'; 
    let currentSortAsc = true;

    const firebaseConfig = {
      apiKey: "AIzaSyA0UhDKqcsChUa8OZWxZUmuFdKATfgiL8E",
      authDomain: "homework-hc906.firebaseapp.com",
      projectId: "homework-hc906",
      storageBucket: "homework-hc906.firebasestorage.app",
      messagingSenderId: "1051903125085",
      appId: "1:1051903125085:web:b205f868669ea7d5c34fb4",
      measurementId: "G-V0BEG0TVJY"
    };

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
    import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

    let app, db, auth;
    try { 
        app = initializeApp(firebaseConfig); 
        db = getFirestore(app); 
        auth = getAuth(app); 
    } catch (e) { 
        alert("Firebase 初始化錯誤，請檢查 Config"); 
    }

    let currentUser = null;
    const defaultData = {
        roster: [ { no: 1, name: "勇者A", exp: 0, coins: 0, group: 1 }, { no: 2, name: "法師B", exp: 0, coins: 0, group: 1 }, { no: 3, name: "弓手C", exp: 0, coins: 0, group: 2 } ],
        assignments: [],
        teachers: ["公會長"],
        questSettings: { "國語": ["國語習作", "國語考卷"], "數學": ["數學習作", "數學考卷"] },
        attendance: {}, 
        discipline: null,
        expLogs: [], 
        settings: { },
        coinPresets: {
            plus: [ { v: 1, l: '作業優良' }, { v: 3, l: '超級優秀' }, { v: 1, l: '準時' } ],
            minus: [ { v: -1, l: '上課吵鬧' }, { v: -1, l: '未帶物品' } ]
        }
    };
    let data = JSON.parse(JSON.stringify(defaultData)); 
    let saveTimeout = null;
    let currentAssignmentId = null;
    let pickerTarget = null;
    let newAssignmentAssignedIndices = []; 
    let isBatchMode = false;
    let isBatchExpMode = false;
    let targetAssignmentIdToDelete = null; 
    let tempQuestSettings = {};
    let currentFilter = { teacher: 'all', subject: 'all' };
    let lastRosterState = null; 
    const APP_SCALE = 1;
    
    setInterval(() => {
        const timeStr = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
        const fc = document.getElementById('fcTime');
        if (fc) fc.innerText = timeStr;
    }, 1000);

    window.switchView = function(id) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('show'));
        const target = document.getElementById(id);
        if(target) { target.classList.add('show'); renderAll(); }
    }

    function updateSaveStatus(status, message = '') {
        const ind = document.getElementById('saveStatusIndicator'); if(!ind) return;
        if (status === 'pending' || status === 'uploading') ind.innerHTML = `<span style="color:var(--primary)"><i class="bi bi-cloud-arrow-up"></i> ${message || '處理中...'}</span>`;
        else if (status === 'local') ind.innerHTML = `<span style="color:#ea580c" title="已存在本機，稍後自動上傳雲端"><i class="bi bi-device-hdd"></i> 待同步</span>`;
        else if (status === 'success') ind.innerHTML = `<span style="color:var(--success)"><i class="bi bi-cloud-check"></i> 已同步</span>`;
        else ind.innerHTML = `<span style="color:var(--danger)"><i class="bi bi-exclamation-triangle"></i> ${message}</span>`;
    }

    let isDirty = false;
    let lastSyncedState = { core: '', assignments: '', attendance: '', logs: '' }; 

    function triggerAutoSave() {
        if (currentUser) {
            localStorage.setItem(`guild_backup_${currentUser.uid}`, JSON.stringify(data));
        }
        isDirty = true;
        updateSaveStatus('local');

        clearTimeout(saveTimeout); 
        saveTimeout = setTimeout(() => {
            syncToCloud();
        }, 15000); 
    }

async function syncToCloud() {
        if (!currentUser || !isDirty) return;
        updateSaveStatus('uploading', '雲端同步中');
        try { 
            const cleanData = JSON.parse(JSON.stringify(data)); 
            
            const coreData = { roster: cleanData.roster, teachers: cleanData.teachers, questSettings: cleanData.questSettings, discipline: cleanData.discipline, settings: cleanData.settings, coinPresets: cleanData.coinPresets };
            const assignData = { assignments: cleanData.assignments };
            const attData = { attendance: cleanData.attendance };
            const logsData = { expLogs: cleanData.expLogs };

            const promises = [];
            
            const coreStr = JSON.stringify(coreData);
            const assignStr = JSON.stringify(assignData);
            const attStr = JSON.stringify(attData);
            const logsStr = JSON.stringify(logsData);

            let needsPublicUpdate = false; 

            if (lastSyncedState.core !== coreStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "core"), coreData));
                lastSyncedState.core = coreStr;
                needsPublicUpdate = true;
            }
            if (lastSyncedState.assignments !== assignStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "assignments"), assignData));
                lastSyncedState.assignments = assignStr;
                needsPublicUpdate = true;
            }
            if (lastSyncedState.attendance !== attStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "attendance"), attData));
                lastSyncedState.attendance = attStr;
            }
            if (lastSyncedState.logs !== logsStr) {
                promises.push(setDoc(doc(db, "users", currentUser.uid, "data", "logs"), logsData));
                lastSyncedState.logs = logsStr;
            }

            if (needsPublicUpdate || promises.length > 0) {
                const publicSummary = cleanData.roster.map((s, i) => {
                    const debts = [];
                    cleanData.assignments.forEach(a => {
                        if(!a.archived) {
                            const indices = a.assignedIndices || 'all';
                            if (indices === 'all' || indices.includes(i)) {
                                const st = (a.statuses || [])[i] || 0;
                                if (st === 0 || st === 2) { 
                                    debts.push({ title: a.title, st: st, subject: a.subject || '一般', date: a.date });
                                }
                            }
                        }
                    });
                    // 🌟 這裡新增了 exp 與 coins 資料
                    return { no: s.no, name: s.name, exp: s.exp || 0, coins: s.coins || 0, debts: debts };
                });

                promises.push(setDoc(doc(db, "public_boards", currentUser.uid), { 
                    lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                    summary: publicSummary 
                }));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            isDirty = false;
            updateSaveStatus('success'); 
        } catch (e) { 
            console.error(e);
            updateSaveStatus('error', e.code === 'permission-denied' ? '權限不足' : '儲存失敗');
        }
    }

    document.getElementById('btnRefreshData').addEventListener('click', async () => {
        const btn = document.getElementById('btnRefreshData');
        btn.disabled = true;
        if (isDirty) {
            await syncToCloud(); 
        } else {
            await loadDataFromFirebase(); 
        }
        showToast("🔄 資料已與雲端同步完成");
        btn.disabled = false;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && isDirty) {
            syncToCloud();
        }
    });
    window.addEventListener('beforeunload', (e) => {
        if (isDirty) {
            syncToCloud();
            e.preventDefault();
            e.returnValue = ''; 
        }
    });

    async function loadDataFromFirebase() {
        if (!currentUser) return;
        updateSaveStatus('pending', '讀取中');
        try {
            const coreRef = doc(db, "users", currentUser.uid, "data", "core");
            const assignRef = doc(db, "users", currentUser.uid, "data", "assignments");
            const attRef = doc(db, "users", currentUser.uid, "data", "attendance");
            const logsRef = doc(db, "users", currentUser.uid, "data", "logs");

            const [coreSnap, assignSnap, attSnap, logsSnap] = await Promise.all([
                getDoc(coreRef), getDoc(assignRef), getDoc(attRef), getDoc(logsRef)
            ]);

            if (coreSnap.exists()) {
                const coreData = coreSnap.data();
                data.roster = coreData.roster || defaultData.roster;
                data.teachers = coreData.teachers || defaultData.teachers;
                data.questSettings = coreData.questSettings || defaultData.questSettings;
                data.discipline = coreData.discipline || null;
                data.settings = coreData.settings || {};
                data.coinPresets = coreData.coinPresets || defaultData.coinPresets;

                data.assignments = assignSnap.exists() ? (assignSnap.data().assignments || []) : [];
                data.attendance = attSnap.exists() ? (attSnap.data().attendance || {}) : {};
                data.expLogs = logsSnap.exists() ? (logsSnap.data().expLogs || []) : [];

                lastSyncedState = {
                    core: JSON.stringify(coreData),
                    assignments: JSON.stringify(assignSnap.data() || {}),
                    attendance: JSON.stringify(attSnap.data() || {}),
                    logs: JSON.stringify(logsSnap.data() || {})
                };
            } else {
                const oldDocSnap = await getDoc(doc(db, "users", currentUser.uid, "data", "guildData"));
                if (oldDocSnap.exists()) {
                    const loadedData = oldDocSnap.data();
                    data.roster = Array.isArray(loadedData.roster) ? loadedData.roster : defaultData.roster;
                    data.assignments = Array.isArray(loadedData.assignments) ? loadedData.assignments : [];
                    data.teachers = Array.isArray(loadedData.teachers) && loadedData.teachers.length > 0 ? loadedData.teachers : defaultData.teachers;
                    data.questSettings = loadedData.questSettings || JSON.parse(JSON.stringify(defaultData.questSettings));
                    data.attendance = loadedData.attendance || {};
                    data.discipline = loadedData.discipline || null;
                    data.settings = loadedData.settings || {};
                    data.expLogs = Array.isArray(loadedData.expLogs) ? loadedData.expLogs : [];
                    data.coinPresets = loadedData.coinPresets || JSON.parse(JSON.stringify(defaultData.coinPresets));
                    
                    isDirty = true;
                    setTimeout(() => syncToCloud(), 3000); 
                } else {
                    data = JSON.parse(JSON.stringify(defaultData));
                }
            }

            data.roster.forEach(r => { 
                if(typeof r.exp === 'undefined') r.exp = 0; 
                if(typeof r.coins === 'undefined') r.coins = 0; 
                if(typeof r.maxExp === 'undefined') r.maxExp = r.exp; 
                if(typeof r.group === 'undefined') r.group = 1; 
                if(typeof r.pets === 'undefined') r.pets = [];
                if(typeof r.activePet === 'undefined') r.activePet = null; 
            });
            
            onDataLoaded(); updateSaveStatus('success');
        } catch (error) {
            console.error("🔥 Firebase 讀取失敗:", error);
            let errMsg = "⚠️ 資料庫連線失敗！\n\n【錯誤代碼】 " + (error.code || "無") + "\n【錯誤訊息】 " + (error.message || error);
            alert(errMsg);
            data = JSON.parse(JSON.stringify(defaultData)); 
            onDataLoaded();
            updateSaveStatus('error', '連線失敗 (離線模式)');
        }
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user; 
            document.getElementById('loginOverlay').style.display = 'none'; 
            document.getElementById('mainApp').style.display = 'flex'; 
            
            const emailDisp = document.getElementById('userEmailDisplay');
            if(emailDisp) emailDisp.innerHTML = `<i class="bi bi-person-circle"></i> <span class="nav-text">${user.email.split('@')[0]}</span>`;
            
            initApp();
        } else {
            document.getElementById('loginOverlay').style.display = 'flex'; 
            document.getElementById('mainApp').style.display = 'none';
        }
    });

    document.getElementById('btnLogin').addEventListener('click', () => signInWithPopup(auth, new GoogleAuthProvider()));
    document.getElementById('btnLogout').addEventListener('click', () => { if(confirm("確定要登出？")) signOut(auth).then(() => window.location.reload()); });

    function initApp() {
        const color = localStorage.getItem('hwColor') || 'guild';
        document.documentElement.setAttribute('data-color-theme', color);
        document.querySelectorAll('.theme-option').forEach(el => el.classList.toggle('active', el.dataset.theme === color));

        const isDark = localStorage.getItem('hwTheme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.getElementById('darkModeToggle').checked = isDark;

        switchView('view-dashboard');
        loadDataFromFirebase();
    }

    function renderClassStars() {
        if (!data.settings) data.settings = {};
        const stars = data.settings.classStars || 0;
        const headerText = document.getElementById('classStarCountText');
        const adminText = document.getElementById('adminClassStarCount');
        if (headerText) headerText.innerText = stars;
        if (adminText) adminText.innerText = stars;
    }

    function onDataLoaded() {
        const today = getTaipeiDateString();
        if (!data.attendance || !data.attendance[today]) {
            document.getElementById('attendanceReminderModal').classList.add('show');
        }


        populateTeacherDropdowns(); 
        updateSubjectDropdown(); 
        resetNewAssignmentState();
        checkAndResetDiscipline(); 
        renderCoinDropdowns(); 
        renderClassStars(); 
        renderAll(); 
        renderChecklists(); 
    }

// ⭐ 更新常駐側邊欄的函式
    function updatePersistentSidebar() {
        if (!data || !data.roster) return;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const todayStr = getTaipeiDateString();
        const clearedStudents = []; 
        const helpStudents = [];
        
        // 重新計算名單
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        // 若有開啟隱藏今日再訂正功能，則排除
                        if (typeof hideTodayRedo !== 'undefined' && hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++;
                    }
                }
            }
            if (pendingCount === 0) clearedStudents.push(s.no);
            if (pendingCount >= 5) helpStudents.push(s.no);
        });
        
        clearedStudents.sort((a,b) => a - b); 
        helpStudents.sort((a,b) => a - b);
        
        // 渲染至畫面
        const psClearedList = document.getElementById('psClearedList');
        const psHelpList = document.getElementById('psHelpList');
        
        if (psClearedList) {
            psClearedList.innerHTML = clearedStudents.length > 0 
                ? clearedStudents.map(n => `<span class="num-badge" style="width:28px; height:28px; font-size:14px; background:var(--success); color:#fff;">${n}</span>`).join('') 
                : '<span style="font-size:12px;opacity:0.6;">無</span>';
        }
        if (psHelpList) {
            psHelpList.innerHTML = helpStudents.length > 0 
                ? helpStudents.map(n => `<span class="num-badge" style="width:28px; height:28px; font-size:14px; background:var(--danger); color:#fff;">${n}</span>`).join('') 
                : '<span style="font-size:12px;opacity:0.6;">無</span>';
        }
    }

    // ⭐ 修改後的 renderAll 函式
    function renderAll() {
        const v = document.querySelector('.view.show'); if(!v) return;
        if (v.id === 'view-dashboard') renderDashboard();
        else if (v.id === 'view-student-status') renderStudentStatus();
        else if (v.id === 'view-roster') renderRosterEditor();
        else if (v.id === 'view-attendance') initAttendanceView();
        if (document.getElementById('quickSidebar') && document.getElementById('quickSidebar').classList.contains('show')) {
            window.renderQuickSidebar();
        }
        // 加入這一行：每次重新渲染畫面時，都更新左側常駐欄
        updatePersistentSidebar(); 
    }
    window.renderAll = renderAll;

    function logAction(sidx, delta, type, reason) {
        if(!data.expLogs) data.expLogs = [];
        data.expLogs.push({
            time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            name: data.roster[sidx].name,
            delta: delta > 0 ? '+' + delta + ' ' + type : delta + ' ' + type,
            reason: reason
        });
        if(data.expLogs.length > 2000) data.expLogs.shift();
    }

    function changeExp(sidx, delta, reason = '系統調整', silent = false) {
        if (!data.roster[sidx]) return;
        const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        const oldExp = data.roster[sidx].exp || 0;
        const maxExp = data.roster[sidx].maxExp || oldExp; 

        data.roster[sidx].exp = oldExp + delta;
        if (data.roster[sidx].exp < 0) data.roster[sidx].exp = 0;
        const newExp = data.roster[sidx].exp;
        
        logAction(sidx, delta, 'EXP', reason);
        
        if (!silent) {
            playSuccessSound();
            const msg = delta > 0 ? `✨ ${data.roster[sidx].name} 獲得 ${delta} EXP！` : `💔 ${data.roster[sidx].name} 失去 ${Math.abs(delta)} EXP...`;
            
            showToast(msg, "復原", () => {
                data.roster[sidx] = oldState;
                if(data.expLogs && data.expLogs.length > oldLogsLength) {
                    data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                }
                triggerAutoSave(); renderAll();
            });
            triggerAutoSave(); renderAll();
        }

    if (delta > 0) {
        thresholds.forEach((t) => {
            if (maxExp < t.exp && newExp >= t.exp) {
                data.roster[sidx].coins = (data.roster[sidx].coins || 0) + t.coins;
                logAction(sidx, t.coins, '金幣', `晉升 ${t.rank} 獎勵`);
                
                setTimeout(() => {
                    showToast(`🌟 恭喜 ${data.roster[sidx].name} 晉升為【${t.rank}】！獲得 ${t.coins} 枚金幣！`);
                    playSuccessSound();
                    renderAll();
                }, 1500); 
            }
        });

        data.roster[sidx].maxExp = Math.max(maxExp, newExp);
        }
    }
    window.changeExp = changeExp;

    function changeCoin(sidx, delta, reason = '手動調整', silent = false) {
        if (!data.roster[sidx]) return;
        const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        if (typeof data.roster[sidx].coins === 'undefined') data.roster[sidx].coins = 0;
        data.roster[sidx].coins += delta;
        
        logAction(sidx, delta, '金幣', reason);
        
        if (!silent) {
            playCoinSound();
            const msg = delta > 0 ? `✨ ${data.roster[sidx].name} ${reason} 獲得 ${delta} 金幣！` : `💔 ${data.roster[sidx].name} ${reason} 失去 ${Math.abs(delta)} 金幣...`;
            
            showToast(msg, "復原", () => {
                data.roster[sidx] = oldState;
                if(data.expLogs && data.expLogs.length > oldLogsLength) {
                    data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                }
                triggerAutoSave(); renderAll();
            });
            triggerAutoSave(); renderAll();
        }
    }
    window.changeCoin = changeCoin;

    window.checkAllClearAndCheer = function(a) {
        const indices = a.assignedIndices === 'all' ? data.roster.map((_, i)=>i) : a.assignedIndices;
        if (indices.length === 0) return;
        
        const allClear = indices.every(i => {
            const st = (a.statuses || [])[i] || 0;
            return st === 1 || st === 3;
        });
        
        if (allClear && !a.cheered) {
            a.cheered = true;
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'] });
            if (window.playStarSound) { 
                window.playStarSound(); 
                setTimeout(()=> { if(window.playTimerVictoryMusic) window.playTimerVictoryMusic(); }, 400); 
            }
            showToast(`🎉 狂賀！【${a.title}】全員繳交完成！`);
            triggerAutoSave();
        } else if (!allClear && a.cheered) {
            a.cheered = false;
            triggerAutoSave();
        }
    };

    function updateStatus(aid, sidx, newStatus) {
        const a = data.assignments.find(i => i.id == aid);
        if(a) {
            if(!a.statuses) a.statuses = Array(data.roster.length).fill(0);
            if(!a.earnedExp) a.earnedExp = {}; 

            const oldStatus = a.statuses[sidx] || 0;
            const oldState = JSON.parse(JSON.stringify(data.roster[sidx]));
            const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
            const currentEarned = a.earnedExp[sidx] || { handIn: 0, complete: 0 };

            a.statuses[sidx] = newStatus;

            const todayStr = getTaipeiDateString();
            const isSameDay = (todayStr === a.date);
            const d1 = new Date(a.date.replace(/-/g, '/'));
            const d2 = new Date(todayStr.replace(/-/g, '/'));
            const diffDays = Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

            const newEarned = { handIn: currentEarned.handIn, complete: 0 };

            if (newStatus !== 0) {
                if (currentEarned.handIn === 0 && isSameDay) newEarned.handIn = 1;
            } else {
                newEarned.handIn = 0; 
            }

            if (newStatus === 3) {
                if (currentEarned.complete === 0) newEarned.complete = (diffDays <= 1) ? 2 : 1;
                else newEarned.complete = currentEarned.complete; 
            }

            const oldTotal = currentEarned.handIn + currentEarned.complete;
            const newTotal = newEarned.handIn + newEarned.complete;
            const deltaExp = newTotal - oldTotal;

            a.earnedExp[sidx] = newEarned; 

            if (deltaExp !== 0) {
                let reason = `更新任務 [${a.title}]`;
                if (deltaExp > 0) {
                    if (newEarned.complete > 0 && currentEarned.complete === 0) reason = (diffDays <= 1) ? `迅速討伐 [${a.title}]` : `完成討伐 [${a.title}]`;
                    else reason = `準時回報 [${a.title}]`;
                } else {
                    reason = `任務退回 [${a.title}]`;
                }

                changeExp(sidx, deltaExp, reason, true); 
                
                if (deltaExp > 0) {
                    playSuccessSound();
                    showToast(`🎉 ${reason}！${data.roster[sidx].name} 獲得 ${deltaExp} EXP`, "復原", () => {
                        a.statuses[sidx] = oldStatus;
                        a.earnedExp[sidx] = currentEarned;
                        data.roster[sidx] = oldState;
                        if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                        triggerAutoSave(); renderAll();
                    });
                } else {
                    showToast(`⚠️ ${reason}！${data.roster[sidx].name} 收回 ${Math.abs(deltaExp)} EXP`, "復原", () => {
                        a.statuses[sidx] = oldStatus;
                        a.earnedExp[sidx] = currentEarned;
                        data.roster[sidx] = oldState;
                        if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                        triggerAutoSave(); renderAll();
                    });
                }
                
                triggerAutoSave(); 
                renderAll();
                
            } else {
                triggerAutoSave(); renderAll();
            }

            window.checkAllClearAndCheer(a); // ⭐ 檢查是否達成全員繳交
        }
    }
    window.updateStatus = updateStatus;

    function toggleStatus(aid, idx) {
        resumeAudio();
        const a = data.assignments.find(x => x.id == aid); if(!a) return;
        let s = (a.statuses || [])[idx] || 0;
        s = (s + 1) % 4; 
        updateStatus(aid, idx, s);
    }
    window.toggleStatus = toggleStatus;

    function renderDashboard() {
        const list = document.getElementById('sideAssignmentList'); list.innerHTML = '';
        
        let assignments = data.assignments.filter(a => {
            if (a.archived) return false;
            const matchT = currentFilter.teacher === 'all' || a.teacher === currentFilter.teacher;
            const matchS = currentFilter.subject === 'all' || (a.subject ? a.subject === currentFilter.subject : a.title.includes(currentFilter.subject));
            return matchT && matchS;
        }).sort((a,b) => a.date < b.date ? 1 : -1);

        if (assignments.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:var(--muted); font-size:13px;">沒有符合的委託</div>';
            document.getElementById('dashEmptyState').style.display = 'flex'; 
            document.getElementById('dashDetailPanel').classList.remove('show'); 
            return;
        }

        assignments.forEach(a => {
            const el = document.createElement('div'); 
            el.className = 'side-item' + (currentAssignmentId === a.id ? ' active' : '');
            
            const indices = a.assignedIndices || 'all';
            const total = indices === 'all' ? data.roster.length : indices.length;
            const completed = (a.statuses || []).filter((s, i) => s === 3 && (indices === 'all' || indices.includes(i))).length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            const color = progress === 100 ? 'var(--success)' : 'var(--primary)';

        let hasStatus1 = false; let allStatus0 = true; let assignedCount = 0; let missingCount = 0;   
            for (let i = 0; i < data.roster.length; i++) {
                if (indices === 'all' || indices.includes(i)) {
                    assignedCount++; const st = (a.statuses || [])[i] || 0;
                    if (st === 1) hasStatus1 = true; 
                    if (st !== 0) allStatus0 = false; 
                    if (st === 0) missingCount++; 
                }
            }

            let gradeBadge = assignedCount === 0 ? `<span style="color: #9ca3af; background: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">無對象</span>` : 
                             hasStatus1 ? `<span style="color: #ea580c; background: #ffedd5; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">未批改</span>` : 
                             allStatus0 ? `<span style="color: #4b5563; background: #e5e7eb; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">未清點</span>` : 
                             `<span style="color: #166534; background: #dcfce7; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">批改完</span>`;
            let missingBadge = assignedCount > 0 ? (missingCount > 0 ? `<span style="color: #be123c; background: #ffe4e6; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">缺${missingCount}</span>` : `<span style="color: #1d4ed8; background: #dbeafe; padding: 2px 4px; border-radius: 4px; font-size: 11px; font-weight: bold;">缺0</span>`) : '';

            el.innerHTML = `
                <div class="side-item-title" style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                    <span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${a.title}">${a.title}</span>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">${missingBadge} ${gradeBadge}</div>
                </div>
                <div class="side-item-meta muted" style="display: flex; justify-content: space-between; margin-top: 4px;">
                    <span>${a.date}</span><span>${a.teacher}</span>
                </div>
                <div style="margin-top:6px; display:flex; align-items:center; gap:6px; font-size:12px;">
                    <div style="flex:1; height:6px; background:rgba(0,0,0,0.1); border-radius:3px; overflow:hidden;">
                        <div style="width:${progress}%; height:100%; background:${color}; transition: width 0.5s;"></div>
                    </div>
                    <span>${completed}/${total}</span>
                </div>
            `;
            
            el.onmouseenter = (e) => window.showAssignmentTooltip(e, a);
            el.onmouseleave = () => window.hideAssignmentTooltip();
            el.onmousemove = (e) => window.moveAssignmentTooltip(e);

            el.onclick = () => { currentAssignmentId = a.id; renderDashboardDetail(a.id); renderDashboard(); };
            list.appendChild(el);
        });
        if(assignments.length > 0 && !currentAssignmentId) {
            currentAssignmentId = assignments[0].id;
        }
        if(currentAssignmentId) renderDashboardDetail(currentAssignmentId);
    }

    window.openQuickDebtMenu = function(e, sidx, oldDebtsString) {
        e.stopPropagation();
        
        let oldDebts = [];
        try { oldDebts = JSON.parse(decodeURIComponent(oldDebtsString)); } catch(err) {}

        const menu = document.getElementById('quickDebtMenu');
        const studentId = String(sidx);
        
        if (menu.classList.contains('show') && menu.dataset.currentSidx === studentId) {
            menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = ""; return;
        }
        
        menu.dataset.currentSidx = studentId;
        const list = document.getElementById('quickDebtList');
        
        list.innerHTML = ''; 
        
        const student = data.roster[sidx];

        document.getElementById('quickDebtTitle').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>【${student.name}】待清舊帳</span>
                <i class="bi bi-x-circle-fill btn-close-debt" onclick="document.getElementById('quickDebtMenu').classList.remove('show'); document.getElementById('quickDebtMenu').dataset.currentSidx='';" style="cursor: pointer; font-size: 18px; color: var(--danger);"></i>
            </div>
        `;
        
        oldDebts.forEach(debt => {
            const item = document.createElement('div'); item.className = 'quick-debt-item';
            const stLbl = debt.st === 2 ? '<span style="color:#c62828; font-size:11px;">(再訂正)</span>' : '<span style="color:#888; font-size:11px;">(未交)</span>';
            
            item.innerHTML = `
                <div style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; font-weight:bold;" title="${debt.title}">${debt.title} ${stLbl}</div>
                <button class="btn sm" style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background: var(--primary); color: #fff;"><i class="bi bi-check-lg"></i> 完成</button>
            `;
            
            item.onclick = (evt) => {
                evt.stopPropagation(); window.updateStatus(debt.id, sidx, 3);
                menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = "";
            };
            list.appendChild(item);
        });

        menu.style.display = ''; menu.classList.add('show'); 
        let x = e.clientX + 10; let y = e.clientY + 10;
        const rect = menu.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 10;
        if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 10;
        menu.style.left = x + 'px'; menu.style.top = y + 'px';
    };

    function renderDashboardDetail(id) {
        const a = data.assignments.find(x => x.id == id); if (!a) return;
        document.getElementById('dashEmptyState').style.display = 'none';
        document.getElementById('dashDetailPanel').classList.add('show');
        document.getElementById('dashDetailTitle').innerHTML = `
            <span class="badge" style="background:var(--primary); color:#fff; font-size:14px; padding:2px 8px; border-radius:4px;">${a.subject || '一般'}</span> 
            ${a.title}
            <button class="btn sm ghost icon-only" title="編輯名稱" onclick="window.editAssignmentTitle(${a.id})" style="border:none; color:var(--muted);"><i class="bi bi-pencil-fill"></i></button>
        `;

        // ⭐ 產生小組一鍵繳交按鈕
        const groupActions = document.getElementById('groupQuickActions');
        groupActions.innerHTML = '<span style="font-size:13px; font-weight:bold; color:var(--primary); align-self:center; margin-right:4px;"><i class="bi bi-people-fill"></i> 小組回報：</span>';
        const groups = [...new Set(data.roster.map(s => s.group || 1))].sort((x, y) => x - y);
        
        groups.forEach(g => {
            const btn = document.createElement('button');
            btn.className = 'btn sm ghost group-submit-btn';
            btn.innerText = `第 ${g} 組交`;
            btn.onclick = () => {
                let changed = false;
                data.roster.forEach((st, i) => {
                    if ((st.group || 1) === g) {
                        const isAssigned = (a.assignedIndices === 'all') || (a.assignedIndices && a.assignedIndices.includes(i));
                        if (isAssigned) {
                            const oldStatus = (a.statuses || [])[i] || 0;
                            if (oldStatus === 0 || oldStatus === 2) {
                                window.updateStatus(a.id, i, 1);
                                changed = true;
                            }
                        }
                    }
                });
                if (changed) {
                    showToast(`✨ 第 ${g} 組已全數設為「已回報」！`);
                }
            };
            groupActions.appendChild(btn);
        });
        
        const grid = document.getElementById('dashGridContainer'); grid.innerHTML = '';
        data.roster.forEach((s, i) => {
            const isAssigned = (a.assignedIndices === 'all') || (a.assignedIndices && a.assignedIndices.includes(i));
            const st = a.statuses[i] || 0; 
            const div = document.createElement('div'); div.className = `seatItem ${!isAssigned ? 'not-assigned' : ''}`;
            
            let oldDebts = [];
            if(isAssigned) {
                (data.assignments || []).forEach(otherA => {
                    if (otherA.id !== a.id && !otherA.archived) {
                        const otherIndices = otherA.assignedIndices || 'all';
                        if (otherIndices === 'all' || otherIndices.includes(i)) {
                            const otherSt = (otherA.statuses || [])[i] || 0;
                            if (otherSt === 0 || otherSt === 2) oldDebts.push({ id: otherA.id, title: otherA.title, st: otherSt });
                        }
                    }
                });
            }

            let badgeHtml = oldDebts.length > 0 ? `<div class="debt-badge" title="有 ${oldDebts.length} 項未完成的舊任務" onclick="window.openQuickDebtMenu(event, ${i}, '${encodeURIComponent(JSON.stringify(oldDebts))}')">${oldDebts.length}</div>` : '';

            div.innerHTML = `
                <div style="position: relative; flex-shrink: 0;">
                    ${badgeHtml}
                    <div class="seat s${st}" onclick="window.toggleStatus(${id}, ${i})">${s.no}</div>
                </div>
                <div class="seatName">
                    <span style="display:inline-flex; align-items:center; gap:3px;">${s.name}${(() => {
                        const rawPid = s.activePet || (s.pets && s.pets.length ? s.pets[s.pets.length - 1] : null);
                        const pid = rawPid && String(rawPid).startsWith('p') ? parseInt(String(rawPid).slice(1)) : rawPid;
                        const pet = pid ? gachaPool.find(p => String(p.id) === String(pid)) : null;
                        return pet ? `<img src="${pet.sit}" class="pixel-pet" style="width:20px; height:20px; object-fit:contain; vertical-align:middle;" title="夥伴：${pet.name}">` : '';
                    })()}</span><br>
                    <span style="font-size:10px; color:var(--muted);">⭐ ${s.exp||0} 💰 ${s.coins||0}</span>
                </div>
            `;
            
            grid.appendChild(div);
        });

        document.getElementById('btnDeleteCurrent').onclick = () => {
            targetAssignmentIdToDelete = id; 
            document.getElementById('deleteTargetTitle').innerText = a.title; 
            document.getElementById('deleteChoiceModal').classList.add('show');
        };
    }

    document.getElementById('rangeSize').addEventListener('input', (e) => { 
        document.documentElement.style.setProperty('--seat', `${e.target.value}px`); 
        document.documentElement.style.setProperty('--seat-font', `${Math.max(10, Math.floor(e.target.value * 0.3))}px`); 
    });

    function checkAndResetDiscipline() {
        const today = getTaipeiDateString();
        if (!data.discipline || data.discipline.date !== today) { 
            data.discipline = { date: today, statuses: {} }; 
            triggerAutoSave(); 
        }
    }

    document.getElementById('selStudentSort').addEventListener('change', (e) => {
        currentSortBy = e.target.value;
        currentSortAsc = true;
        document.getElementById('btnSortDirection').innerHTML = '<i class="bi bi-sort-numeric-down"></i>';
        renderStudentStatus();
    });
let hideClearStudents = false;
document.getElementById('btnToggleClearStudents').addEventListener('click', (e) => {
    hideClearStudents = !hideClearStudents;
    e.currentTarget.innerHTML = hideClearStudents ? '<i class="bi bi-eye"></i> ' : '<i class="bi bi-eye-slash"></i> ';
    e.currentTarget.style.color = hideClearStudents ? 'var(--primary)' : 'var(--muted)';
    renderStudentStatus();
});
    let groupDebtsBySubject = true;
    document.getElementById('btnToggleDebtSort').addEventListener('click', (e) => {
        groupDebtsBySubject = !groupDebtsBySubject;
        e.currentTarget.innerHTML = groupDebtsBySubject ? '<i class="bi bi-tags-fill"></i> ' : '<i class="bi bi-tags"></i> ';
        e.currentTarget.style.color = groupDebtsBySubject ? 'var(--primary)' : 'var(--muted)';
        renderStudentStatus();
    });

    let hideTodayRedo = false;
    document.getElementById('btnToggleTodayRedo').addEventListener('click', (e) => {
        hideTodayRedo = !hideTodayRedo;
        e.currentTarget.innerHTML = hideTodayRedo ? '<i class="bi bi-calendar-x-fill"></i> ' : '<i class="bi bi-calendar-check"></i> ';
        e.currentTarget.style.color = hideTodayRedo ? 'var(--danger)' : 'var(--muted)';
        renderStudentStatus();
    });
    
    document.getElementById('btnSortDirection').addEventListener('click', (e) => {
        currentSortAsc = !currentSortAsc;
        const isNum = currentSortBy === 'no' || currentSortBy === 'exp' || currentSortBy === 'coins' || currentSortBy === 'debts';
        e.currentTarget.innerHTML = `<i class="bi bi-sort-${isNum ? (currentSortAsc?'numeric-down':'numeric-up-alt') : (currentSortAsc?'down':'up')}"></i>`;
        renderStudentStatus();
    });

    function renderStudentStatus() {
        const todayStr = getTaipeiDateString(); 
        const con = document.getElementById('studentStatusContainer'); 
        con.innerHTML = '';
        
        const tb = document.getElementById('batchExpToolbar');
        if (isBatchExpMode) {
            tb.classList.add('show');
            document.getElementById('btnToggleBatchExp').innerHTML = '<i class="bi bi-x-lg"></i> 取消加扣分';
            document.getElementById('btnToggleBatchExp').classList.add('warn');
        } else {
            tb.classList.remove('show');
            document.getElementById('btnToggleBatchExp').innerHTML = '<i class="bi bi-magic"></i> 加扣分模式';
            document.getElementById('btnToggleBatchExp').classList.remove('warn');
        }

        if (isBatchMode) {
            document.getElementById('btnBatchExport').style.display = 'inline-block';
            document.getElementById('btnBatchSelectAll').style.display = 'inline-block';
            document.getElementById('btnToggleBatchMode').innerHTML = '<i class="bi bi-x-lg"></i> 取消列印';
            document.getElementById('btnToggleBatchMode').classList.add('warn');
        } else {
            if (!isBatchExpMode) document.getElementById('btnBatchSelectAll').style.display = 'none';
            document.getElementById('btnBatchExport').style.display = 'none';
            document.getElementById('btnToggleBatchMode').innerHTML = `<i class="bi bi-printer"></i> 批量列印卷軸`;
            document.getElementById('btnToggleBatchMode').classList.remove('warn');
        }

        checkAndResetDiscipline();

        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const clearedStudents = []; const helpStudents = [];
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                    if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++;
                    }
                }
            }
            if (pendingCount === 0) clearedStudents.push(s.no);
            if (pendingCount >= 5) helpStudents.push(s.no);
        });
        clearedStudents.sort((a,b)=>a-b); helpStudents.sort((a,b)=>a-b);

      const overviewCon = document.getElementById('studentStatusOverviewContainer');
        if (!isBatchMode && !isBatchExpMode) { 
            overviewCon.style.display = 'block';
            overviewCon.innerHTML = `
                <div class="status-overview">
                    <div class="overview-card success" style="flex: 3;"><div class="overview-icon-bg"><i class="bi bi-trophy"></i></div><div class="overview-header"><i class="bi bi-trophy-fill"></i> 討伐全冠王 (${clearedStudents.length})</div>
                        <div class="overview-nums">${clearedStudents.length > 0 ? clearedStudents.map(n => `<span class="num-badge">${n}</span>`).join('') : '<span style="font-size:12px;opacity:0.6;">💪 尚無人達成</span>'}</div>
                    </div>
                    <div class="overview-card danger" style="flex: 1.8;"><div class="overview-icon-bg"><i class="bi bi-bandaid"></i></div><div class="overview-header"><i class="bi bi-bandaid-fill"></i> 需補血成員 (欠款≥5)</div>
                        <div class="overview-nums">${helpStudents.length > 0 ? helpStudents.map(n => `<span class="num-badge">${n}</span>`).join('') : '<span style="font-size:12px;opacity:0.6;">✅ 全員健康</span>'}</div>
                    </div>
                </div>
            `;
        } else {
            overviewCon.style.display = 'none';
            overviewCon.innerHTML = '';
        }

        let studentDataList = data.roster.map((s, i) => {
            let debts = [];
            data.assignments.forEach(a => {
                if(!a.archived) {
                    const indices = a.assignedIndices || 'all';
                    if(indices === 'all' || indices.includes(i)) {
                        const taskSt = (a.statuses||[])[i] || 0;
                        if(taskSt === 0 || taskSt === 2) {
                            if (hideTodayRedo && taskSt === 2 && a.date === todayStr) return;
                            debts.push({ id: a.id, title: a.title, st: taskSt, date: a.date, subject: a.subject || '其他' });
                        }
                    }
                }
            });
            return { s: s, i: i, debts: debts, debtCount: debts.length };
        });
        if (hideClearStudents) {
        studentDataList = studentDataList.filter(item => item.debtCount > 0);
        }
        studentDataList.sort((a, b) => {
            let valA, valB;
            if (currentSortBy === 'no') { valA = a.s.no; valB = b.s.no; }
            else if (currentSortBy === 'exp') { valA = a.s.exp || 0; valB = b.s.exp || 0; }
            else if (currentSortBy === 'coins') { valA = a.s.coins || 0; valB = b.s.coins || 0; }
            else if (currentSortBy === 'debts') { valA = a.debtCount; valB = b.debtCount; }
            
            if (valA < valB) return currentSortAsc ? -1 : 1;
            if (valA > valB) return currentSortAsc ? 1 : -1;
            return a.s.no - b.s.no; 
        });

// 🌟 優化 1：建立 DocumentFragment 暫存 DOM 節點，避免頻繁觸發畫面重繪
        const fragment = document.createDocumentFragment();
        const grid = document.createElement('div');
        grid.className = 'student-status-grid';
        
        // 🌟 優化 2：宣告變數記錄上一次點選的卡片索引，用於 Shift 區間選擇
        let lastSelectedIndex = -1;
        
        // 注意這裡加入了 loopIndex
        studentDataList.forEach((item, loopIndex) => {
            const { s, i, debts } = item;
            const st = (data.discipline && data.discipline.statuses) ? (data.discipline.statuses[i] || 0) : 0;
            const avatarBg = st === 0 ? '#22c55e' : st === 1 ? '#eab308' : '#ef4444';
            
            let sortedDebts = [...debts];
            if (groupDebtsBySubject) {
                sortedDebts.sort((a, b) => {
                    const subA = a.subject || '其他';
                    const subB = b.subject || '其他';
                    if (subA !== subB) return subA.localeCompare(subB, 'zh-TW'); 
                    if (a.title !== b.title) return a.title.localeCompare(b.title, 'zh-TW');
                    return a.date < b.date ? 1 : -1; 
                });
            } else {
                sortedDebts.sort((a, b) => a.date < b.date ? 1 : -1); 
            }

            let tasksHtml = sortedDebts.map(t => {
                let statusSpan = t.st === 2 ? `<span class="pill p-orange" style="transform:scale(0.85); transform-origin:right center; margin:0;">再訂正</span>` : `<span class="pill p-gray" style="transform:scale(0.85); transform-origin:right center; margin:0;">未交</span>`;
                let subjTag = groupDebtsBySubject ? `<span style="font-size:10px; background:var(--tbl-head); color:var(--primary); padding:2px 4px; border-radius:4px; margin-right:4px;">${t.subject}</span>` : '';
                
                return `<div class="task-item-hover" style="font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; justify-content:space-between; gap:4px; cursor:pointer; padding:4px 0; border-bottom:1px dashed rgba(0,0,0,0.1);" onclick="window.toggleCardTaskStatus(event, ${t.id}, ${i})"><span style="flex:1; overflow:hidden; text-overflow:ellipsis;" title="${t.title}">${subjTag}🔸 ${t.title}</span> ${statusSpan}</div>`;
            }).join('');

            const badgeHtml = (debts.length > 0 && !isBatchExpMode) ? `<div class="debt-badge" style="top:5px; right:0px;" onclick="window.openQuickDebtMenu(event, ${i}, '${encodeURIComponent(JSON.stringify(debts))}')">${debts.length}</div>` : '';
            
            const printBtnHtml = (debts.length > 0 && !isBatchMode && !isBatchExpMode) ? `<i class="bi bi-printer" style="position:absolute; top:12px; right:12px; cursor:pointer; color:var(--muted); font-size:16px; padding:4px; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--muted)'" onclick="window.printSingleStudent(${i})" title="列印卷軸"></i>` : '';
            
            const checkboxTypeClass = isBatchMode ? 'batch-export-checkbox' : 'batch-exp-checkbox';
            const checkboxHtml = (isBatchMode || isBatchExpMode) ? `<input type="checkbox" class="${checkboxTypeClass}" data-sidx="${i}">` : '';

            const card = document.createElement('div');
            card.className = 'd-student-card' + ((isBatchMode || isBatchExpMode) ? ' selectable' : '');
            card.style.alignItems = 'flex-start';
            card.style.textAlign = 'left';
            
            card.innerHTML = `
                ${checkboxHtml}
                ${printBtnHtml}
                <div style="display:flex; width:100%; gap:10px; align-items:center;">
                    <div style="position:relative; flex-shrink:0;">
                        ${badgeHtml}
                        <div class="d-avatar" onclick="window.cycleTrafficLight(${i})" style="background:${avatarBg}; width:48px; height:48px; font-size:22px;">${s.no}</div>
                    </div>
                    <div style="flex:1; min-width:0; padding-right:20px;">
                        <div style="font-weight:900; font-size:20px; display:flex; align-items:baseline; gap:4px; flex-wrap:wrap;">
                            ${s.name} ${getRankHtml(s.exp||0)}
                        </div>
                        <div style="font-size:14px; margin-top:4px; font-weight:bold; color:var(--muted); display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <span style="white-space:nowrap;">⭐ <span style="font-size:17px; color:var(--primary);">${s.exp||0}</span></span>
                            <span style="white-space:nowrap;">💰 <span style="font-size:17px; color:#b45309;">${s.coins||0}</span></span>
                            <button class="btn sm ghost" style="border-radius:14px; padding:2px 8px; font-size:12px; color:#1b8a97; border:1.5px solid #8be1e6; background:#f0fdfe; white-space:nowrap; margin-left:auto; display:inline-flex; align-items:center; gap:4px;" onclick="event.stopPropagation(); window.openSummonModal(${i})" title="打開扭蛋機與萌寵圖鑑">
                                <span style="display:inline-flex; flex-direction:column; width:12px; height:12px; border-radius:50%; border:1.2px solid #1b1426; overflow:hidden;"><span style="height:50%; background:#dff3ff;"></span><span style="height:50%; background:#ff6b7d;"></span></span>
                                扭蛋
                            </button>
                        </div>
                        ${(s.pets && s.pets.length > 0) ? `<div style="margin-top:6px; display:flex; gap:4px; flex-wrap:wrap; align-items:center;">
                            ${(() => {
                                const counts = (s.pets || []).reduce((acc, pid) => {
                                    const normId = String(pid).startsWith('p') ? parseInt(String(pid).slice(1)) : pid;
                                    acc[normId] = (acc[normId] || 0) + 1;
                                    return acc;
                                }, {});
                                const entries = Object.entries(counts);
                                const rawActive = s.activePet || entries[entries.length - 1]?.[0];
                                const activeId = rawActive && String(rawActive).startsWith('p') ? parseInt(String(rawActive).slice(1)) : rawActive;
                                entries.sort((a, b) => (String(a[0]) === String(activeId) ? -1 : String(b[0]) === String(activeId) ? 1 : 0));
                                return entries.slice(0, 6).map(([pid, count]) => {
                                    const pet = gachaPool.find(p => String(p.id) === String(pid));
                                    if (!pet) return '';
                                    const isPartner = String(pet.id) === String(activeId);
                                    const rarityCol = pet.rarity === 3 ? '#f5a524' : (pet.rarity === 2 ? '#a57bff' : '#e5e7eb');
                                    const petImgSrc = pet.sit || pet.img;
                                    return `<span onclick="event.stopPropagation(); window.openSummonModal(${i}, 'book', ${pet.id})" style="background:${isPartner ? '#f0fdfe' : 'var(--bg)'}; border:1.5px solid ${isPartner ? '#2fb0bb' : rarityCol}; border-radius:10px; padding:1px 5px; font-size:11px; display:inline-flex; align-items:center; gap:2px; cursor:pointer;" title="${pet.name}${isPartner ? ' (代表夥伴)' : ''}">
                                        ${petImgSrc.startsWith('data:') ? `<img src="${petImgSrc}" class="pixel-pet" style="width:22px; height:22px; object-fit:contain;">` : petImgSrc}
                                        ${count > 1 ? `<small style="font-size:10px; color:var(--primary); font-weight:900;">x${count}</small>` : ''}
                                    </span>`;
                                }).join('') + (entries.length > 6 ? `<span onclick="event.stopPropagation(); window.openSummonModal(${i}, 'book')" style="font-size:11px; font-weight:900; color:#1b8a97; cursor:pointer; padding:0 4px;">+${entries.length - 6}</span>` : '');
                            })()}
                        </div>` : ''}
                    </div>
                </div>
                
                <div style="width:100%; margin-top:8px; border-top:1px solid rgba(0,0,0,0.05); padding-top:4px; display:${isBatchExpMode ? 'none' : 'block'};">
                    ${tasksHtml || '<div style="color:#888; font-size:12px; text-align:center; padding: 10px 0;">🎉 無欠交作業</div>'}
                </div>

                <div style="display:${isBatchExpMode ? 'flex' : 'none'}; width:100%; align-items:center; gap:4px; margin-top:8px; padding-top:8px; border-top:1px dashed var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeCoin(${i}, -1, '手動扣款')" style="padding:2px 6px;">-1</button>
                    <input type="number" id="scCoinInput_${i}" style="width:40px; padding:2px; text-align:center; font-size:12px;" placeholder="$$">
                    <button class="btn sm ghost icon-only" onclick="window.changeCoin(${i}, 1, '手動獎勵')" style="padding:2px 6px;">+1</button>
                    <button class="btn sm icon-only" onclick="window.applySingleCustomCoin(${i})" style="padding:2px 6px;"><i class="bi bi-check-lg"></i></button>
                </div>
            `;
            
            if (isBatchMode || isBatchExpMode) {
                card.onclick = (e) => {
                    if (e.target.closest('.btn') || e.target.closest('.debt-badge') || e.target.closest('.d-avatar') || e.target.tagName.toLowerCase() === 'input') return;
                    
                    const isSelecting = !card.classList.contains('selected');
                    
                    // 🌟 實作 Shift 多選邏輯
                    if (e.shiftKey && lastSelectedIndex !== -1) {
                        const start = Math.min(lastSelectedIndex, loopIndex);
                        const end = Math.max(lastSelectedIndex, loopIndex);
                        const allCards = grid.querySelectorAll('.d-student-card');
                        
                        for (let j = start; j <= end; j++) {
                            const targetCard = allCards[j];
                            if (isSelecting) {
                                targetCard.classList.add('selected');
                            } else {
                                targetCard.classList.remove('selected');
                            }
                            const cb = targetCard.querySelector('.' + checkboxTypeClass);
                            if (cb) cb.checked = isSelecting;
                        }
                    } else {
                        // 單次點擊切換
                        card.classList.toggle('selected');
                        const cb = card.querySelector('.' + checkboxTypeClass);
                        if (cb) cb.checked = card.classList.contains('selected');
                    }
                    
                    // 更新最後一次點擊的索引
                    lastSelectedIndex = loopIndex;
                };
            }

            grid.appendChild(card);
        });
        
        fragment.appendChild(grid);
        con.innerHTML = ''; // 清空舊內容
        con.appendChild(fragment); // 一次性掛載，減少 Reflow/Repaint
      
    }

    window.applySingleCustomCoin = function(idx) {
        const val = parseInt(document.getElementById(`scCoinInput_${idx}`).value);
        if(!isNaN(val) && val !== 0) {
            window.changeCoin(idx, val, '手動調整');
        }
    };

    window.toggleCardTaskStatus = function(e, aid, sidx) {
        e.stopPropagation();
        const a = data.assignments.find(x => x.id == aid); if(!a) return;
        const currentStatus = a.statuses[sidx] || 0;
        
        if (currentStatus === 2) {
            if (confirm(`【${data.roster[sidx].name}】的「${a.title}」\n是否已完成並改為「討伐成功」？`)) {
                updateStatus(aid, sidx, 3);
            }
        } else {
            pickerTarget = { idx: sidx, aid: aid };
            const picker = document.getElementById('statusPicker');
            picker.style.top = (e.clientY + 10) + 'px'; 
            picker.style.left = (e.clientX + 10) + 'px'; 
            picker.classList.add('show');
        }
    };

    document.getElementById('btnGreenAllExpPlus').addEventListener('click', () => {
        let count = 0;
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        const todayStr = getTaipeiDateString();
        
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++; 
                    }
                }
            }
            
            if (pendingCount === 0) { 
                window.changeExp(i, 1, '綠燈全體獎勵', true); 
                count++; 
            }
        });
        
        if (count > 0) { 
            playSuccessSound(); 
            triggerAutoSave(); 
            renderAll(); 
            showToast(`✨ 綠燈全體 (${count}人) 獲得 +1 EXP！`, "復原", () => {
                data.roster = oldRoster;
                if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                triggerAutoSave();
                renderAll();
                showToast("已復原綠燈加分操作！");
            });
        } else {
            showToast("🥺 目前還沒有人達成綠燈條件喔！");
        }
    });
    
    document.getElementById('btnAllClearedPlus').addEventListener('click', () => {
        let count = 0;
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;
        
        const activeAssigns = (data.assignments || []).filter(a => !a.archived);
        
        data.roster.forEach((s, i) => {
            let pendingCount = 0;
            for (let a of activeAssigns) {
                const indices = a.assignedIndices || 'all';
                const todayStr = getTaipeiDateString();
                if (indices === 'all' || indices.includes(i)) {
                    const st = (a.statuses || [])[i] || 0;
                    if (st === 0 || st === 2) {
                        if (hideTodayRedo && st === 2 && a.date === todayStr) continue;
                        pendingCount++; 
                    }
                }
            }
            
            if (pendingCount === 0) { 
                changeCoin(i, 1, '全冠王獎勵', true); 
                count++; 
            }
        });
        
        if (count > 0) { 
            playSuccessSound(); 
            triggerAutoSave(); 
            renderAll(); 
            showToast(`🏆 討伐全冠王 (${count}人) 獲得 +1 金幣！`, "復原", () => {
                data.roster = oldRoster;
                if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
                triggerAutoSave();
                renderAll();
                showToast("已復原全冠王加分操作！");
            });
        } else {
            showToast("🥺 目前還沒有人成為討伐全冠王喔！");
        }
    });

    window.cycleTrafficLight = function(sidx) { 
        data.discipline.statuses[sidx] = ((data.discipline.statuses[sidx] || 0) + 1) % 3; 
        triggerAutoSave(); 
        renderStudentStatus(); 
    };

    window.renderCoinDropdowns = function() {
        const sp = document.getElementById('selBatchPlus');
        const sm = document.getElementById('selBatchMinus');
        if(sp && data.coinPresets && data.coinPresets.plus) {
            sp.innerHTML = data.coinPresets.plus.map(p => `<option value="${p.v}|${p.l}">+${p.v} ${p.l}</option>`).join('');
        }
        if(sm && data.coinPresets && data.coinPresets.minus) {
            sm.innerHTML = data.coinPresets.minus.map(p => `<option value="${p.v}|${p.l}">${p.v} ${p.l}</option>`).join('');
        }
    };

    window.applySelectedBatchCoin = function(type) {
        const sel = document.getElementById(type === 'plus' ? 'selBatchPlus' : 'selBatchMinus');
        if(!sel || !sel.value) return;
        const [val, label] = sel.value.split('|');
        window.applyBatchCoin(parseInt(val), label);
    };

    document.getElementById('btnToggleBatchExp').addEventListener('click', () => { 
        isBatchExpMode = !isBatchExpMode; 
        if (isBatchExpMode) isBatchMode = false; 
        
        const btnSelectAll = document.getElementById('btnBatchSelectAll');
        if (isBatchExpMode || isBatchMode) { btnSelectAll.style.display = 'inline-block'; } 
        else { btnSelectAll.style.display = 'none'; }
        
        renderStudentStatus(); 
    });

    window.applyBatchCoin = function(delta, presetReason) {
        const checked = document.querySelectorAll('.batch-exp-checkbox:checked');
        if (!checked.length) { alert("請先勾選學生！"); return; }
        
        const oldRoster = JSON.parse(JSON.stringify(data.roster));
        const oldLogsLength = data.expLogs ? data.expLogs.length : 0;

        checked.forEach(cb => {
            const idx = parseInt(cb.dataset.sidx);
            changeCoin(idx, delta, presetReason, true);
            cb.checked = false; 
        });
        
        playSuccessSound();
        showToast(`✨ 已為 ${checked.length} 名學生套用：${presetReason} (${delta>0?'+'+delta:delta} 金幣)`, "復原", () => {
            data.roster = oldRoster;
            if(data.expLogs) data.expLogs.splice(oldLogsLength, data.expLogs.length - oldLogsLength);
            triggerAutoSave(); renderAll();
        });
        triggerAutoSave(); renderAll();
    };

    window.applyCustomBatchCoin = function() {
        const val = parseInt(document.getElementById('customExpVal').value);
        const reason = document.getElementById('customExpReason').value || '自訂調整';
        if (isNaN(val)) { alert("請輸入分數"); return; }
        window.applyBatchCoin(val, reason);
        document.getElementById('customExpVal').value = '';
        document.getElementById('customExpReason').value = '';
    };

      function generateScrollHTML(studentData, debts) {
        debts.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
        let tasksHtml = debts.map(t => {
            let statusText = t.st === 2 ? '需再訂正' : '尚未繳交';
            let dateText = t.date ? t.date : '無日期';
            let statusColor = t.st === 2 ? '#e65100' : '#d32f2f';
            return `
                <div style="display: flex; align-items: flex-start; border-bottom: 1px dashed #ccc; padding: 6px 0; font-size: 14px; line-height: 1.4;">
                    <div style="width: 14px; height: 14px; border: 1.5px solid #333; margin-right: 8px; border-radius: 3px; flex-shrink: 0; margin-top: 2px;"></div>
                    <div style="flex: 1; font-weight: bold; color: #222;">
                        ${t.title} <span style="color:#666; font-size: 12px; font-weight: normal;">(${dateText})</span> <span style="color:${statusColor}; margin-left: 4px;">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="border: 2px dashed #888; padding: 15px; border-radius: 8px; background: #fff; font-family: 'Microsoft JhengHei', sans-serif; page-break-inside: avoid; width: 100%; box-sizing: border-box; position: relative;">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; text-align: center;">
                    ${studentData.name} 的任務單
                </h2>
                
                <div style="margin-bottom: 15px;">
                    ${tasksHtml}
                </div>
                
                <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 15px;">
                    <div style="font-size: 14px; font-weight: bold;">家長簽名：</div>
                    <div style="border-bottom: 1px solid #000; width: 120px; margin-left: 5px;"></div>
                </div>
            </div>
        `;
    }

    window.printSingleStudent = function(idx) {
        const student = data.roster[idx];
        let debts = [];
        data.assignments.forEach(a => {
            if(!a.archived) {
                const indices = a.assignedIndices || 'all';
                if(indices === 'all' || indices.includes(idx)) {
                    const taskSt = (a.statuses||[])[idx] || 0;
                    if(taskSt === 0 || taskSt === 2) debts.push({ title: a.title, st: taskSt, date: a.date });
                }
            }
        });
        
        if(debts.length === 0) {
            showToast("🎉 該名冒險者目前無欠款，無須列印！");
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>列印任務單</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { margin: 0; padding: 20px; background: #fff; display: flex; justify-content: center; }
                .single-container { width: 100%; max-width: 400px; }
            </style>
            </head><body>
            <div class="single-container">
                ${generateScrollHTML(student, debts)}
            </div>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    };

    document.getElementById('btnToggleBatchMode').addEventListener('click', () => { 
        isBatchMode = !isBatchMode; 
        if (isBatchMode) isBatchExpMode = false; 
        
        const btnSelectAll = document.getElementById('btnBatchSelectAll');
        if (isBatchExpMode || isBatchMode) { btnSelectAll.style.display = 'inline-block'; } 
        else { btnSelectAll.style.display = 'none'; }
        
        renderStudentStatus(); 
    });

    document.getElementById('btnBatchSelectAll').addEventListener('click', () => {
        const cards = document.querySelectorAll('.d-student-card.selectable');
        const cbs = document.querySelectorAll(isBatchMode ? '.batch-export-checkbox' : '.batch-exp-checkbox');
        const allChecked = Array.from(cbs).every(c => c.checked);
        
        cbs.forEach(c => c.checked = !allChecked);
        cards.forEach(card => {
            if (!allChecked) card.classList.add('selected');
            else card.classList.remove('selected');
        });
    });

    document.getElementById('btnBatchExport').addEventListener('click', () => {
        const checked = document.querySelectorAll('.batch-export-checkbox:checked');
        if (checked.length === 0) { 
            alert("⚠️ 請先點選小卡，選取要列印卷軸的冒險者！"); 
            return; 
        }
        
        let printQueue = [];
        
        checked.forEach(cb => {
            const idx = parseInt(cb.dataset.sidx);
            const student = data.roster[idx];
            let debts = [];
            data.assignments.forEach(a => {
                if(!a.archived) {
                    const indices = a.assignedIndices || 'all';
                    if(indices === 'all' || indices.includes(idx)) {
                        const taskSt = (a.statuses||[])[idx] || 0;
                        if(taskSt === 0 || taskSt === 2) debts.push({ title: a.title, st: taskSt, date: a.date });
                    }
                }
            });
            if(debts.length > 0) {
                printQueue.push({ student: student, debts: debts, count: debts.length });
            }
        });

        printQueue.sort((a, b) => b.count - a.count);

        let allHtml = printQueue.map(item => generateScrollHTML(item.student, item.debts)).join('');

        if(!allHtml) { 
            showToast("🎉 勾選的冒險者皆無欠款！"); 
            return; 
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html><head><title>批量列印任務單</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { margin: 0; padding: 0; background: #fff; font-family: "Microsoft JhengHei", sans-serif; }
                .print-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                @media (max-width: 600px) { .print-grid { grid-template-columns: 1fr; } }
            </style>
            </head><body>
            <div class="print-grid">
                ${allHtml}
            </div>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    });
    
    function initAttendanceView() {
        const date = document.getElementById('attDatePicker').value;
        if (!data.attendance[date]) {
            data.attendance[date] = data.roster.map(() => ({ status: 0, note: '' }));
            triggerAutoSave();
        }
        renderAttendanceUI();
    }

    function renderAttendanceUI() {
        const date = document.getElementById('attDatePicker').value;
        const currentData = data.attendance[date];
        const list = document.getElementById('attendanceList');
        list.innerHTML = '';
        
        let stats = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0};

        data.roster.forEach((s, i) => {
            const r = currentData[i] || { status: 0, note: '' };
            if(stats[r.status] !== undefined) stats[r.status]++;
            
            const div = document.createElement('div'); div.className = 'att-card';
            let btns = '';
            
            [{id:0,l:'出席'},{id:1,l:'遲到'},{id:2,l:'早退'},{id:3,l:'病假'},{id:5,l:'事假'},{id:4,l:'公假'}].forEach(o => {
                btns += `<button class="att-btn ${r.status===o.id?'active':''}" data-status="${o.id}" onclick="window.setAttStatus('${date}', ${i}, ${o.id})">${o.l}</button>`;
            });
            
            let noteHtml = '';
            if (r.note) {
                let isTime = /^\d{2}:\d{2}$/.test(r.note);
                let noteColor = isTime ? '#1d4ed8' : 'var(--danger)';
                let noteBg = isTime ? '#dbeafe' : '#fee2e2';
                let noteBorder = isTime ? '#bfdbfe' : '#fecaca';
                let noteIcon = isTime ? 'bi-clock' : 'bi-pencil';
                noteHtml = `<span class="att-note" style="display:inline-block; background:${noteBg}; color:${noteColor}; border-color:${noteBorder}; padding: 4px 8px; border-radius: 12px;"><i class="bi ${noteIcon}"></i> ${r.note}</span>`;
            }

            div.innerHTML = `<div class="att-no">${s.no}</div><div class="att-name">${s.name} ${noteHtml}</div><div style="display:flex; flex-wrap:wrap; gap:4px;">${btns}</div>`;
            list.appendChild(div);
        });

        document.getElementById('statPresent').innerText = stats[0];
        document.getElementById('statLate').innerText = stats[1];
        document.getElementById('statEarly').innerText = stats[2];
        document.getElementById('statSick').innerText = stats[3];
        document.getElementById('statPersonal').innerText = stats[5];
        document.getElementById('statOfficial').innerText = stats[4];
    }

    window.setAttStatus = function(date, idx, status) {
        let note = '';
        if (status === 2 || status === 3) {
            const t = prompt("請輸入備註 (例如：發燒、14:00 早退)：");
            if (t) note = t;
        }
        data.attendance[date][idx] = { status, note };
        triggerAutoSave();
        renderAttendanceUI();
    };

    document.getElementById('btnExportAttendance').addEventListener('click', () => {
        if (!data.attendance || Object.keys(data.attendance).length === 0) {
            showToast("⚠️ 目前沒有任何點名紀錄可以匯出！");
            return;
        }

        const allDates = Object.keys(data.attendance).sort();
        const statusMap = { 0: '出席', 1: '遲到', 2: '早退', 3: '病假', 4: '公假', 5: '事假' };
        
        let csv = "\uFEFF座號,姓名,出席(天),遲到(次),早退(次),病假(天),事假(天),公假(天)";
        allDates.forEach(date => {
            csv += `,${date}`; 
        });
        csv += "\n";

        data.roster.forEach((s, i) => {
            let counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let dailyRecords = [];

            allDates.forEach(date => {
                const record = data.attendance[date][i];
                if (record) {
                    counts[record.status]++; 
                    
                    let text = statusMap[record.status];
                    if (record.note) text += ` (${record.note.replace(/"/g, '""')})`;
                    dailyRecords.push(`"${text}"`);
                } else {
                    dailyRecords.push(`"-"`); 
                }
            });

            csv += `${s.no},${s.name},${counts[0]},${counts[1]},${counts[2]},${counts[3]},${counts[5]},${counts[4]}`;
            if (dailyRecords.length > 0) {
                csv += `,${dailyRecords.join(',')}`;
            }
            csv += "\n";
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `公會出缺勤統計總表_${getTaipeiDateString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`📊 成功匯出點名統計！共統計 ${allDates.length} 天`);
    });

    
    document.getElementById('attDatePicker').addEventListener('change', initAttendanceView);
    document.getElementById('btnSaveAttendance').addEventListener('click', () => { 
    const date = document.getElementById('attDatePicker').value;
    const currentData = data.attendance[date];
    
    if (!currentData.rewarded) {
        let rewardedCount = 0;
        data.roster.forEach((s, i) => {
            if (currentData[i] && currentData[i].status === 0) {
                window.changeCoin(i, 1, '本日出席獎勵', true); 
                rewardedCount++;
            }
        });
        currentData.rewarded = true; 
        
        if (rewardedCount > 0) {
            window.playSuccessSound();
            setTimeout(() => window.showToast(`✨ 已自動為 ${rewardedCount} 位出席冒險者發放獎勵！`), 500);
        }
    }
    
    showToast("✅ 點名已儲存同步！"); 
    triggerAutoSave(); 
    renderAll();
});
    
    document.getElementById('btnGoToAttendance').addEventListener('click', () => {
        document.getElementById('attendanceReminderModal').classList.remove('show');
        document.getElementById('attDatePicker').value = getTaipeiDateString();
        switchView('view-attendance');
    });

    document.getElementById('btnAdminAttendance').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        document.getElementById('attDatePicker').value = getTaipeiDateString(); 
        switchView('view-attendance'); 
    });

    document.getElementById('btnAdminRoster').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        switchView('view-roster'); 
    });

    function renderRosterEditor() {
        const d = document.getElementById('rosterEditor'); d.innerHTML = '';
        data.roster.forEach(s => {
            // ⭐ 編輯名單時加入小組設定
            d.innerHTML += `<div class="roster-item"><input type="number" value="${s.no}" class="roster-no-input"><input value="${s.name}" class="roster-name-input"><input type="number" value="${s.group || 1}" class="roster-group-input" style="width:60px; padding:8px;" title="組別" placeholder="組別"></div>`;
        });
        if (document.getElementById('roster-content-teachers').classList.contains('show')) {
            renderTeacherEditor();
        }
    }

    function renderTeacherEditor() {
        const d = document.getElementById('teacherEditor'); d.innerHTML = '';
        const teachersList = (data.teachers && data.teachers.length > 0) ? data.teachers : ["公會長"];
        
        teachersList.forEach(t => {
            d.innerHTML += `
                <div class="teacher-item" style="display:flex; gap:8px; margin-bottom:8px;">
                    <input value="${t}" class="teacher-name-input" style="flex:1; padding:8px;">
                    <button class="btn sm warn icon-only" onclick="this.parentElement.remove()" title="刪除"><i class="bi bi-trash"></i></button>
                </div>`;
        });
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn sm ghost';
        addBtn.style.marginTop = '8px';
        addBtn.innerHTML = '<i class="bi bi-plus-lg"></i> 新增公會長';
        addBtn.onclick = () => {
            const div = document.createElement('div');
            div.className = 'teacher-item';
            div.style.cssText = 'display:flex; gap:8px; margin-bottom:8px;';
            div.innerHTML = `<input class="teacher-name-input" style="flex:1; padding:8px;" placeholder="輸入公會長名稱"><button class="btn sm warn icon-only" onclick="this.parentElement.remove()" title="刪除"><i class="bi bi-trash"></i></button>`;
            d.insertBefore(div, addBtn);
        };
        d.appendChild(addBtn);
    }

    document.getElementById('btnApplyTeachers').addEventListener('click', () => {
        const inputs = document.querySelectorAll('.teacher-name-input');
        const newTeachers = [];
        inputs.forEach(ip => {
            const val = ip.value.trim();
            if (val) newTeachers.push(val);
        });
        
        if (newTeachers.length === 0) {
            showToast("⚠️ 至少需要保留一位公會長！");
            return;
        }
        
        data.teachers = newTeachers; 
        triggerAutoSave(); 
        populateTeacherDropdowns(); 
        showToast("✅ 公會長名冊已更新");
    });

    document.getElementById('btnAddStudentRow').addEventListener('click', () => {
        const div = document.getElementById('rosterEditor'); const c = div.querySelectorAll('.roster-item').length + 1;
        const d = document.createElement('div'); d.className = 'roster-item';
        // 新增預設組別
        d.innerHTML = `<input type="number" value="${c}" class="roster-no-input"><input class="roster-name-input"><input type="number" value="1" class="roster-group-input" style="width:60px; padding:8px;" title="組別" placeholder="組別">`;
        div.appendChild(d);
    });

    document.getElementById('btnApplyRoster').addEventListener('click', () => {
        const r = [];
        document.querySelectorAll('.roster-item').forEach(d => {
            const no = parseInt(d.querySelector('.roster-no-input').value);
            const name = d.querySelector('.roster-name-input').value.trim();
            const group = parseInt(d.querySelector('.roster-group-input').value) || 1;
            if(no && name) {
                const existing = data.roster.find(x => x.no === no && x.name === name);
                r.push({ no, name, group, exp: existing ? existing.exp : 0, coins: existing ? existing.coins : 0, maxExp: existing ? existing.maxExp : 0, pets: existing && Array.isArray(existing.pets) ? existing.pets : [], activePet: existing ? (existing.activePet || null) : null });
            }
        });
        data.roster = r; triggerAutoSave(); showToast("✅ 名單已更新");
    });

    function renderChecklists() {
        const buildList = (items, cid) => { 
            const container = document.getElementById(cid);
            if(container) {
                container.innerHTML = items.map((item, idx) => `
                    <div class="checklist-item" onclick="this.classList.toggle('done')">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background: #fff; color: var(--primary); display:grid; place-items:center; border: 2px solid var(--primary); font-size:14px;">${idx+1}</div>
                        ${item}
                    </div>`).join(''); 
            }
        };
        buildList(['💧 喝滿水壺', '📚 準備下節課本', '🧹 桌面淨空', '🚻 上廁所'], 'recessChecklist'); 
        buildList(['🗑️ 座位周邊無垃圾', '🪑 椅子靠攏', '📓 聯絡簿帶齊', '🎒 整理背包'], 'dismissalChecklist');
    }

    document.getElementById('btnLoadFromPaste').addEventListener('click', () => {
        const text = document.getElementById('taRosterPaste').value.trim();
        if (!text) {
            showToast("⚠️ 請先在文字框內貼上名單！");
            return;
        }

        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const isReplace = confirm("請問要「取代」現有名單嗎？\n\n[確定]：清空現有名單，完全替換\n[取消]：接續附加在現有名單最後面");

        if (isReplace) {
            data.roster = lines.map((name, idx) => ({ no: idx + 1, name: name, group: 1, exp: 0, coins: 0, maxExp: 0 }));
        } else {
            let startNo = data.roster.length > 0 ? Math.max(...data.roster.map(s => s.no)) + 1 : 1;
            const newRoster = lines.map((name, idx) => ({ no: startNo + idx, name: name, group: 1, exp: 0, coins: 0, maxExp: 0 }));
            data.roster = data.roster.concat(newRoster);
        }

        document.getElementById('taRosterPaste').value = '';
        document.getElementById('detailsRosterPaste').removeAttribute('open');
        renderRosterEditor();
        triggerAutoSave();
        showToast("✅ 名單已成功匯入並自動儲存！");
    });

    document.getElementById('btnCloseRosterPaste').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('detailsRosterPaste').removeAttribute('open');
    });

    window.editAssignmentTitle = function(id) {
        const a = data.assignments.find(x => x.id == id);
        if(!a) return;
        const newTitle = prompt("請輸入新的委託內容：", a.title);
        if(newTitle && newTitle.trim() !== "") {
            a.title = newTitle.trim(); triggerAutoSave();
            renderDashboardDetail(id); renderDashboard();
        }
    }

    const toolTipEl = document.getElementById('assignmentTooltip');
    window.showAssignmentTooltip = function(e, a) {
        if (!a) return;
        const indices = a.assignedIndices || 'all'; const missing = []; const redo = [];
        data.roster.forEach((s, i) => {
            if (indices === 'all' || indices.includes(i)) {
                const status = (a.statuses || [])[i] || 0;
                if (status === 0) missing.push(s.no); if (status === 2) redo.push(s.no);
            }
        });
        if (missing.length === 0 && redo.length === 0) return;
        let html = `<h4>${a.title}</h4><ul>`;
        if (redo.length) html += `<li class="t-redo">再戰：${redo.join(', ')}</li>`;
        if (missing.length) html += `<li class="t-miss">未交：${missing.join(', ')}</li>`;
        html += `</ul>`;
        toolTipEl.innerHTML = html; toolTipEl.style.display = 'block'; moveAssignmentTooltip(e);
    };

    window.moveAssignmentTooltip = function(e) {
        const x = (e.clientX + 15) / APP_SCALE; const y = (e.clientY + 15) / APP_SCALE;
        toolTipEl.style.top = y + 'px'; toolTipEl.style.left = x + 'px';
        const rect = toolTipEl.getBoundingClientRect();
        if((x * APP_SCALE + rect.width) > window.innerWidth) toolTipEl.style.left = ((e.clientX - rect.width - 10) / APP_SCALE) + 'px';
        if((y * APP_SCALE + rect.height) > window.innerHeight) toolTipEl.style.top = ((e.clientY - rect.height - 10) / APP_SCALE) + 'px';
    };
    
    window.hideAssignmentTooltip = function() { toolTipEl.style.display = 'none'; };

    const userBadge = document.getElementById('userEmailDisplay');
    if(userBadge) {
        userBadge.addEventListener('click', () => {
            const list = document.getElementById('adminDebtList'); 
            if (list) {
                list.innerHTML = ''; 
                const debts = [];
                data.roster.forEach((s, idx) => {
                    let c = 0; 
                    data.assignments.forEach(a => { 
                        if(!a.archived) { 
                            const st = (a.statuses||[])[idx]||0; 
                            if(st===0||st===2) c++; 
                        } 
                    });
                    if(c>=5) debts.push({name: s.name, c});
                });
                if(debts.length) debts.forEach(d => list.innerHTML += `<span style="background:#fee2e2;color:#b91c1c;padding:6px 12px;border-radius:20px;font-weight:bold;margin-right:8px;">${d.name} (${d.c})</span>`);
                else list.innerHTML = '<p style="color:var(--success)">目前無人欠款！</p>';
            }
            document.getElementById('adminProfileModal').classList.add('show');
        });
    }

    document.getElementById('btnDownloadArchive').addEventListener('click', () => {
        const arcs = data.assignments.filter(a => a.archived); 
        if(!arcs.length) { alert("無封存資料"); return; }
        let csv = "\uFEFF發布日期,內容,導師," + data.roster.map(s => s.name).join(",") + "\n";
        arcs.forEach(a => { 
            const st = a.statuses || []; 
            csv += `${a.date},"${a.title}",${a.teacher},` + data.roster.map((_, i) => ["未","交","改","完"][st[i]||0]).join(",") + "\n"; 
        });
        const url = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); 
        const el = document.createElement("a"); el.href=url; el.download="封存.csv"; el.click();
    });

document.getElementById('btnExportJSON').addEventListener('click', () => {
    const backupData = JSON.stringify(data, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = getTaipeiDateString();
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdventurerGuild_Backup_${dateStr}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast("💾 備份檔案已產生並下載");
});

document.getElementById('btnImportJSONTrigger').addEventListener('click', () => {
    document.getElementById('ipImportJSON').click();
});


    // ...接續前面的程式碼 (大約在第 1195 行左右)

    document.getElementById('ipImportJSON').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // 基礎格式檢查：確認是否有關鍵欄位
                if (!importedData.roster || !Array.isArray(importedData.roster)) {
                    throw new Error("格式不正確：找不到冒險者名冊資料");
                }

                if (confirm("⚠️ 注意：還原備份將會覆蓋掉目前公會的所有資料（包含等級、任務與點名紀錄）。\n\n確定要繼續嗎？")) {
                    // 更新記憶體中的資料
                    data = importedData;
                    
                    // 強制觸發存檔到 Firebase
                    triggerAutoSave();
                    
                    // 重新初始化整個 App 介面
                    onDataLoaded(); 
                    
                    showToast("✅ 資料還原成功，已同步至雲端！");
                    
                    // 關閉執務室視窗
                    document.getElementById('adminProfileModal').classList.remove('show');
                }
            } catch (err) {
                console.error("還原失敗:", err);
                alert("❌ 還原失敗：檔案內容格式錯誤或已損壞。\n" + err.message);
            }
            // 清空 input 讓下次選同一個檔案也能觸發 change
            e.target.value = '';
        };
        reader.readAsText(file);
    });

    document.getElementById('btnDownloadExpLogs').addEventListener('click', () => {
        if(!data.expLogs || data.expLogs.length === 0) { alert("目前無任何 EXP 異動紀錄"); return; }
        let csv = "\uFEFF紀錄時間,姓名,變動,原因\n";
        data.expLogs.forEach(log => {
            csv += `"${log.time}","${log.name}","${log.delta}","${log.reason}"\n`;
        });
        const url = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); 
        const el = document.createElement("a"); el.href=url; el.download="EXP_異動紀錄.csv"; el.click();
    });

    document.getElementById('btnClearAssignments').addEventListener('click', () => { 
        if(confirm("警告：這將銷毀所有任務與出缺席紀錄！\n確定要繼續嗎？")) { 
            
            const clearExp = confirm("是否要一併【清空】所有冒險者的「經驗值」與「金幣」？\n\n[確定]：連同經驗值、金幣與最高等級一起歸零\n[取消]：只刪除任務，保留現有等級與財產");
            
            data.assignments = []; 
            data.attendance = {}; 
            
            if (clearExp) {
                data.roster.forEach(s => {
                    s.exp = 0;
                    s.coins = 0;
                    s.maxExp = 0; 
                });
                data.expLogs = []; 
                showToast("🔥 已銷毀契約，並將冒險者等級與金幣全部歸零！");
            } else {
                showToast("✨ 已銷毀契約，但為冒險者保留了目前的等級與金幣！");
            }
            
            triggerAutoSave(); 
            renderAll(); 
            document.getElementById('adminProfileModal').classList.remove('show'); 
        } 
    });
    
    document.getElementById('btnResetAll').addEventListener('click', () => { 
        if(prompt("輸入 DESTROY 以重置一切") === "DESTROY") { 
            data.roster = []; data.assignments = []; data.attendance = {}; data.discipline = null; data.expLogs = []; triggerAutoSave(); renderAll(); document.getElementById('adminProfileModal').classList.remove('show'); 
        } 
    });

    ['btnNavDashboard','btnNavStudentStatus'].forEach(id => {
        document.getElementById(id).addEventListener('click', (e) => {
            const map = { 'btnNavDashboard':'view-dashboard', 'btnNavStudentStatus':'view-student-status' };
            switchView(map[e.currentTarget.id]);
        });
    });

    ['teacherFilter','subjectFilter'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('change', (e) => { 
                currentFilter[id.replace('Filter','')] = e.target.value; 
                renderDashboard(); 
            });
        }
    });

    document.getElementById('btnClearFilter').addEventListener('click', () => { 
        currentFilter = { teacher: 'all', subject: 'all' }; 
        document.getElementById('teacherFilter').value = 'all'; 
        document.getElementById('subjectFilter').value = 'all'; 
        renderDashboard(); 
    });

    function populateTeacherDropdowns() {
        const ts = data.teachers || []; 
        const sel = document.getElementById('ipTeacherSelect'); 
        if(sel) { 
            sel.innerHTML = ts.map(t => `<option value="${t}">${t}</option>`).join('') + '<option value="custom">自行輸入...</option>'; 
            document.getElementById('ipTeacherCustom').style.display = sel.value === 'custom' ? 'block' : 'none'; 
        }
        
        const fil = document.getElementById('teacherFilter');
        if(fil) { 
            fil.innerHTML = '<option value="all">所有公會長</option>' + ts.map(t => `<option value="${t}">${t}</option>`).join(''); 
            fil.value = currentFilter.teacher; 
        }
    }
    
    function updateSubjectDropdown() {
        const db = data.questSettings || defaultData.questSettings; 
        const sel = document.getElementById('selSubject'); 
        const fil = document.getElementById('subjectFilter');
        
        if(sel) {
            sel.innerHTML = '<option value="">📂 科目...</option>'; 
            Object.keys(db).forEach(s => { sel.add(new Option(s, s)); });
        }
        if(fil) { 
            fil.innerHTML = '<option value="all">📚 所有科目</option>';
            Object.keys(db).forEach(s => { fil.add(new Option(s, s)); });
            fil.value = currentFilter.subject;
        }
    }

    function resetNewAssignmentState() {
        document.getElementById('ipTitle').value = ''; 
        document.getElementById('selSubject').value = ''; 
        document.getElementById('selPresetTask').innerHTML = '<option value="">📜 常用...</option>';
        document.getElementById('ipDate').value = getTaipeiDateString(); 
        newAssignmentAssignedIndices = []; 
        document.getElementById('assignStatusText').innerText = "發布給：全體冒險者";
        const sel = document.getElementById('ipTeacherSelect'); 
        if(sel && data.teachers && data.teachers.length > 0) { 
            sel.value = data.teachers[0]; 
            document.getElementById('ipTeacherCustom').style.display = 'none'; 
        }
    }

    document.getElementById('btnOpenNewQuestWindowSidebar').addEventListener('click', () => { 
        resetNewAssignmentState(); 
        document.getElementById('panelNewQuest').classList.add('show'); 
    });

    document.getElementById('ipTeacherSelect').addEventListener('change', (e) => {
        document.getElementById('ipTeacherCustom').style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    document.getElementById('selSubject').addEventListener('change', (e) => { 
        const sel = document.getElementById('selPresetTask'); 
        sel.innerHTML = '<option value="">📜 常用任務...</option>'; 
        if(e.target.value && data.questSettings[e.target.value]) {
            data.questSettings[e.target.value].forEach(t => sel.add(new Option(t, t))); 
        }
    });

    document.getElementById('selPresetTask').addEventListener('change', (e) => { 
        if(e.target.value) document.getElementById('ipTitle').value = e.target.value; 
    });

    document.getElementById('btnToggleKeypad').addEventListener('click', () => { 
        const kp = document.getElementById('virtualKeypad'); 
        kp.style.display = kp.style.display === 'none' || kp.style.display === '' ? 'flex' : 'none'; 
    });

    document.getElementById('virtualKeypad').addEventListener('click', (e) => { 
        if(e.target.classList.contains('vk-btn')) { 
            const val = e.target.dataset.val; const ip = document.getElementById('ipTitle'); 
            if (val === 'backspace') ip.value = ip.value.slice(0, -1); 
            else if (val === 'clear') ip.value = ''; 
            else if (val === 'space') ip.value += ' '; 
            else ip.value += val; 
            ip.focus(); 
        } 
    });

    document.getElementById('btnCreate').addEventListener('click', () => {
        let t = document.getElementById('ipTeacherSelect').value; 
        if(t === 'custom') t = document.getElementById('ipTeacherCustom').value.trim();
        const title = document.getElementById('ipTitle').value.trim(); 
        const sub = document.getElementById('selSubject').value; 
        const d = document.getElementById('ipDate').value;
        
        if(!t || !title || !d) { showToast("⚠️ 請填寫完整內容"); return; }
        
        if(!data.teachers.includes(t)) data.teachers.push(t);
        const isAll = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.length === data.roster.length;
        
        data.assignments.push({ 
            id: Date.now(), title, teacher: t, subject: sub, date: d, 
            assignedIndices: isAll ? 'all' : newAssignmentAssignedIndices, 
            statuses: Array(data.roster.length).fill(0),
            cheered: false
        });
        
        triggerAutoSave(); 
        renderAll(); 
        document.getElementById('panelNewQuest').classList.remove('show'); 
        showToast("✨ 新委託已發布！");
    });

    document.getElementById('btnOpenQuestSettings').addEventListener('click', () => { 
        tempQuestSettings = JSON.parse(JSON.stringify(data.questSettings)); 
        renderQuestConfig(); 
        document.getElementById('questSettingsModal').classList.add('show'); 
    });
    
    function renderQuestConfig() {
        const list = document.getElementById('questConfigList'); list.innerHTML = '';
        Object.keys(tempQuestSettings).forEach(sub => {
            const div = document.createElement('div'); div.className = 'quest-config-card';
            div.innerHTML = `<div class="quest-config-header"><span class="quest-config-title">${sub}</span><button class="btn sm warn btn-del-subj" data-sub="${sub}"><i class="bi bi-trash"></i> 移除</button></div><div class="quest-tags">${tempQuestSettings[sub].map((t, i) => `<span class="quest-tag">${t} <i class="bi bi-x-circle-fill btn-del-task" data-sub="${sub}" data-idx="${i}"></i></span>`).join('')}</div><div class="quest-add-row"><input placeholder="輸入新任務名稱..." id="newT_${sub}" style="flex:1; font-size:13px; padding:6px;"><button class="btn sm btn-add-task" data-sub="${sub}"><i class="bi bi-plus-lg"></i> 新增</button></div>`;
            list.appendChild(div);
        });
    }
    
    document.getElementById('questConfigList').addEventListener('click', (e) => {
        if(e.target.closest('.btn-del-subj')) { const s = e.target.closest('.btn-del-subj').dataset.sub; if(confirm(`確定要移除【${s}】科目嗎？`)) { delete tempQuestSettings[s]; renderQuestConfig(); } }
        else if(e.target.closest('.btn-del-task')) { const t = e.target.closest('.btn-del-task'); const s = t.dataset.sub; const i = parseInt(t.dataset.idx); tempQuestSettings[s].splice(i, 1); renderQuestConfig(); }
        else if(e.target.closest('.btn-add-task')) { const s = e.target.closest('.btn-add-task').dataset.sub; const ip = document.getElementById(`newT_${s}`); if(ip.value.trim()) { tempQuestSettings[s].push(ip.value.trim()); renderQuestConfig(); } }
    });
    
    document.getElementById('btnAddSubject').addEventListener('click', () => { const v = document.getElementById('ipNewSubject').value.trim(); if(v && !tempQuestSettings[v]) { tempQuestSettings[v] = []; document.getElementById('ipNewSubject').value=''; renderQuestConfig(); } });
    document.getElementById('btnSaveQuestSettings').addEventListener('click', () => { data.questSettings = tempQuestSettings; triggerAutoSave(); updateSubjectDropdown(); document.getElementById('questSettingsModal').classList.remove('show'); showToast("⚙️ 任務選單設定已儲存"); });

    let currentCoinTab = 'plus';
    let tempCoinPresets = {};

    document.getElementById('btnOpenCoinSettings').addEventListener('click', () => {
        document.getElementById('adminProfileModal').classList.remove('show');
        tempCoinPresets = JSON.parse(JSON.stringify(data.coinPresets));
        currentCoinTab = 'plus';
        updateCoinTabUI();
        renderCoinConfig();
        document.getElementById('coinSettingsModal').classList.add('show');
    });

    function updateCoinTabUI() {
        document.getElementById('btnCoinTabPlus').className = currentCoinTab === 'plus' ? 'btn sm' : 'btn sm ghost';
        document.getElementById('btnCoinTabMinus').className = currentCoinTab === 'minus' ? 'btn sm warn' : 'btn sm ghost';
    }

    document.getElementById('btnCoinTabPlus').onclick = () => { currentCoinTab = 'plus'; updateCoinTabUI(); renderCoinConfig(); };
    document.getElementById('btnCoinTabMinus').onclick = () => { currentCoinTab = 'minus'; updateCoinTabUI(); renderCoinConfig(); };

    function renderCoinConfig() {
        const list = document.getElementById('coinConfigList');
        list.innerHTML = '';
        const arr = tempCoinPresets[currentCoinTab] || [];
        arr.forEach((item, idx) => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; gap:8px; margin-bottom:8px; align-items:center; background:var(--bg); padding:8px; border-radius:6px; border:1px solid var(--tbl-border);';
            div.innerHTML = `
                <span style="font-weight:bold; width: 40px; text-align:center; color:${currentCoinTab === 'plus' ? 'var(--success)' : 'var(--danger)'};">${item.v > 0 ? '+'+item.v : item.v}</span>
                <span style="flex:1; font-weight:bold;">${item.l}</span>
                <button class="btn sm warn icon-only btn-del-coin" data-idx="${idx}"><i class="bi bi-trash"></i></button>
            `;
            list.appendChild(div);
        });
        document.getElementById('ipNewCoinVal').value = currentCoinTab === 'plus' ? '1' : '-1';
    }

    document.getElementById('coinConfigList').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-del-coin');
        if(btn) {
            const idx = parseInt(btn.dataset.idx);
            tempCoinPresets[currentCoinTab].splice(idx, 1);
            renderCoinConfig();
        }
    });

    document.getElementById('btnAddCoinPreset').onclick = () => {
        const val = parseInt(document.getElementById('ipNewCoinVal').value);
        const label = document.getElementById('ipNewCoinReason').value.trim();
        if(isNaN(val) || !label) { alert("請填寫完整分數與原因"); return; }
        if(currentCoinTab === 'plus' && val <= 0) { alert("加分項目請輸入正數"); return; }
        if(currentCoinTab === 'minus' && val >= 0) { alert("扣分項目請輸入負數"); return; }
        
        tempCoinPresets[currentCoinTab].push({ v: val, l: label });
        document.getElementById('ipNewCoinReason').value = '';
        renderCoinConfig();
    };

    document.getElementById('btnSaveCoinSettings').onclick = () => {
        data.coinPresets = tempCoinPresets;
        triggerAutoSave();
        window.renderCoinDropdowns();
        document.getElementById('coinSettingsModal').classList.remove('show');
        showToast("⚙️ 加扣分項目已儲存");
    };

    document.getElementById('btnMarkAllYellow').addEventListener('click', () => { if(confirm("確認全員改為「已回報」？")) updateAllStatus(1); });
    document.getElementById('btnMarkAllOrange').addEventListener('click', () => { if(confirm("確認全員改為「再挑戰」？")) updateAllStatus(2); });
    
    // ⭐ 新增：重新清點事件綁定
    document.getElementById('btnRecountCurrent').addEventListener('click', () => { 
        if(confirm("⚠️ 確認重新清點？\n這會將全員狀態歸零（設為未交），並靜默扣回已領取的 EXP！")) {
            updateAllStatus(0);
        }
    });

    // ⭐ 完美改寫：批量修改狀態邏輯，確保正確靜默發放/收回 EXP
    function updateAllStatus(s) {
        const a = data.assignments.find(x => x.id == currentAssignmentId);
        if(a) { 
            const idxs = a.assignedIndices || 'all'; 
            let changedExp = false;
            
            const todayStr = getTaipeiDateString();
            const isSameDay = (todayStr === a.date);
            const d1 = new Date(a.date.replace(/-/g, '/'));
            const d2 = new Date(todayStr.replace(/-/g, '/'));
            const diffDays = Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

            data.roster.forEach((st, i) => { 
                if(idxs === 'all' || idxs.includes(i)) {
                    if(!a.statuses) a.statuses = Array(data.roster.length).fill(0);
                    if(!a.earnedExp) a.earnedExp = {}; 

                    const currentEarned = a.earnedExp[i] || { handIn: 0, complete: 0 };
                    const newEarned = { handIn: currentEarned.handIn, complete: 0 };
                    
                    if (s !== 0) {
                        if (currentEarned.handIn === 0 && isSameDay) newEarned.handIn = 1;
                    } else {
                        newEarned.handIn = 0; 
                    }

                    if (s === 3) {
                        if (currentEarned.complete === 0) newEarned.complete = (diffDays <= 1) ? 2 : 1;
                        else newEarned.complete = currentEarned.complete; 
                    }

                    const deltaExp = (newEarned.handIn + newEarned.complete) - (currentEarned.handIn + currentEarned.complete);
                    
                    a.statuses[i] = s;
                    a.earnedExp[i] = newEarned;

                    if (deltaExp !== 0) {
                        changeExp(i, deltaExp, `批量變更 [${a.title}]`, true); // true = 靜音，不彈跳獨立通知
                        changedExp = true;
                    }
                } 
            });
            if(changedExp) showToast("⚠️ 狀態已批量變更，並重新結算對應的 EXP");
            window.checkAllClearAndCheer(a); // 檢查是否有全員繳交
            triggerAutoSave(); renderDashboardDetail(currentAssignmentId); renderDashboard();
        }
    }

    document.getElementById('btnConfirmArchive').addEventListener('click', () => {
        const a = data.assignments.find(x => x.id == targetAssignmentIdToDelete);
        if(a) { a.archived = true; triggerAutoSave(); renderDashboard(); }
        document.getElementById('deleteChoiceModal').classList.remove('show');
    });

    document.getElementById('btnConfirmDelete').addEventListener('click', () => {
        data.assignments = data.assignments.filter(x => x.id != targetAssignmentIdToDelete);
        triggerAutoSave(); renderDashboard();
        document.getElementById('deleteChoiceModal').classList.remove('show');
        showToast("已徹底銷毀");
    });

    document.getElementById('btnOpenSettings').addEventListener('click', () => document.getElementById('settingsModal').classList.add('show'));
    
    document.getElementById('themeOptionsContainer').addEventListener('click', (e) => {
        if(e.target.classList.contains('theme-option')) {
            const t = e.target.dataset.theme; 
            document.documentElement.setAttribute('data-color-theme', t); 
            localStorage.setItem('hwColor', t); 
            document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active')); 
            e.target.classList.add('active'); 
        }
    });

    document.getElementById('darkModeToggle').addEventListener('change', (e) => { 
        const t = e.target.checked ? 'dark' : 'light'; 
        document.documentElement.setAttribute('data-theme', t); 
        localStorage.setItem('hwTheme', t); 
    });
    
    document.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', (e) => e.target.closest('.modal-overlay').classList.remove('show')));
    
    document.getElementById('btnOpenAssignModal').addEventListener('click', () => {
        const c = document.getElementById('assignStudentListContainer'); c.innerHTML = '';
        data.roster.forEach((s, i) => { const chk = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.includes(i); const l = document.createElement('label'); l.className = 'assign-student-item'; l.innerHTML = `<input type="checkbox" data-idx="${i}" ${chk?'checked':''}> ${s.no}.${s.name}`; c.appendChild(l); });
        document.getElementById('assignStudentModal').classList.add('show');
    });
    document.getElementById('btnConfirmAssign').addEventListener('click', () => {
        const chks = document.querySelectorAll('#assignStudentListContainer input:checked'); newAssignmentAssignedIndices = Array.from(chks).map(c => parseInt(c.dataset.idx));
        document.getElementById('assignStatusText').innerText = newAssignmentAssignedIndices.length === data.roster.length ? "發布給：全體冒險者" : `發布給：已選 ${newAssignmentAssignedIndices.length} 位`; 
        document.getElementById('assignStudentModal').classList.remove('show');
    });
    document.getElementById('btnAssignSelectAll').addEventListener('click', () => document.querySelectorAll('#assignStudentListContainer input').forEach(c => c.checked=true));
    document.getElementById('btnAssignDeselectAll').addEventListener('click', () => document.querySelectorAll('#assignStudentListContainer input').forEach(c => c.checked=false));

    document.getElementById('btnToggleToolbox').addEventListener('click', function() { 
        document.getElementById('toolboxMenu').classList.toggle('show'); 
        this.classList.toggle('active'); 
    });

    function openTool(id) { 
        const win = document.getElementById(id); 
        if(win) {
            win.classList.add('show'); 
            bringToFront(win);
        }
        document.getElementById('toolboxMenu').classList.remove('show'); 
        document.getElementById('btnToggleToolbox').classList.remove('active'); 
    }
    
    function bringToFront(el) {
        document.querySelectorAll('.tool-window').forEach(w => w.style.zIndex = 5005);
        el.style.zIndex = 5006;
    }

    
['panelRecess', 'panelDismissal', 'panelMarquee', 'panelTimer', 'panelStopwatch', 'panelNumDice', 'panelAlphaDice', 'panelDraw', 'panelDecibel', 'panelBGM', 'panelApple', 'panelHgTimer'].forEach(id => {
        const win = document.getElementById(id);
        if(!win) return;
        
        win.addEventListener('mousedown', () => bringToFront(win));
        
        const header = win.querySelector('.tool-header');
        let isDragging = false, startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = win.getBoundingClientRect();
            win.style.transform = 'none';
            win.style.left = rect.left + 'px';
            win.style.top = rect.top + 'px';
            startX = e.clientX; startY = e.clientY;
            startLeft = rect.left; startTop = rect.top;
            bringToFront(win);
        });
        
        document.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            win.style.left = (startLeft + e.clientX - startX) + 'px';
            win.style.top = (startTop + e.clientY - startY) + 'px';
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
    });

    document.getElementById('btnOpenRecess').onclick = () => openTool('panelRecess');
    document.getElementById('btnOpenDismissal').onclick = () => openTool('panelDismissal');
    document.getElementById('btnOpenMarquee').onclick = () => openTool('panelMarquee');
    document.getElementById('btnOpenTimer').onclick = () => openTool('panelTimer');
    document.getElementById('btnOpenHgTimer').onclick = () => { openTool('panelHgTimer'); if(window.updateHgVisuals) window.updateHgVisuals('none'); };
    document.getElementById('btnOpenStopwatch').onclick = () => openTool('panelStopwatch');
    document.getElementById('btnOpenNumDice').onclick = () => openTool('panelNumDice');
    document.getElementById('btnOpenAlphaDice').onclick = () => openTool('panelAlphaDice');
    document.getElementById('btnOpenDraw').onclick = () => { openTool('panelDraw'); renderWheel(); };
    document.getElementById('btnOpenDecibel').onclick = () => openTool('panelDecibel');
    document.getElementById('btnOpenBGM').onclick = () => openTool('panelBGM');

    document.getElementById('btnOpenApple').onclick = () => { openTool('panelApple'); renderLunchApple(); };

    let lunchApple = { count: 3, status: 'ongoing' };
    let appleTriggered1159 = false;
    let appleTriggered1235 = false;

    function renderLunchApple() {
        const container = document.getElementById('appleContainer');
        const statusText = document.getElementById('appleStatusText');
        
        if (lunchApple.status === 'failed') {
            container.innerHTML = '<span style="animation: shakeBlur 0.5s; font-size: 20cqi;">😢</span>';
            statusText.innerText = '挑戰失敗...蘋果沒了';
            statusText.style.color = 'var(--danger)';
        } else if (lunchApple.status === 'success') {
            container.innerHTML = '🍎🍎🍎';
            statusText.innerText = '🎉 挑戰成功！完美守護！';
            statusText.style.color = 'var(--success)';
        } else {
            container.innerHTML = '';
            for(let i = 0; i < lunchApple.count; i++) {
                const apple = document.createElement('span');
                apple.innerText = '🍎';
                apple.style.cursor = 'pointer';
                apple.style.transition = 'transform 0.1s, opacity 0.2s';
                apple.onmouseover = () => apple.style.transform = 'scale(1.1) rotate(-5deg)';
                apple.onmouseout = () => apple.style.transform = 'scale(1) rotate(0deg)';
                apple.onclick = () => {
                    lunchApple.count--;
                    apple.style.transform = 'scale(0)';
                    apple.style.opacity = '0';
                    setTimeout(() => {
                        if (lunchApple.count <= 0) {
                            lunchApple.status = 'failed';
                            if (window.playTickSound) window.playTickSound();
                        } else {
                            if (window.playTickSound) window.playTickSound();
                        }
                        renderLunchApple();
                    }, 200); 
                };
                container.appendChild(apple);
            }
            statusText.innerText = `保護 ${lunchApple.count} 顆蘋果！`;
            statusText.style.color = 'var(--primary)';
        }
    }

    document.getElementById('btnAppleReset').onclick = () => {
        lunchApple = { count: 3, status: 'ongoing' };
        renderLunchApple();
    };
    document.getElementById('btnAppleTest').onclick = () => {
        lunchApple = { count: 3, status: 'success' };
        renderLunchApple();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        if (window.playStarSound) window.playStarSound();
    };

    setInterval(() => {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();

        if (hh === 11 && mm === 59) {
            if (!appleTriggered1159) {
                lunchApple = { count: 3, status: 'ongoing' };
                renderLunchApple();
                appleTriggered1159 = true;
                appleTriggered1235 = false; 
            }
        } else {
            appleTriggered1159 = false; 
        }

        if (hh === 12 && mm === 35) {
            if (!appleTriggered1235) {
                if (lunchApple.status === 'ongoing' && lunchApple.count === 3) {
                    lunchApple.status = 'success';
                    renderLunchApple();
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                    if (window.playSuccessSound) window.playSuccessSound();
                }
                appleTriggered1235 = true;
            }
        } else {
            appleTriggered1235 = false;
        }
    }, 1000);
    
    const bgmPlayer = document.getElementById('bgmPlayer');
    const bgmVol = document.getElementById('bgmVolume');
    const btnPlayBGM = document.getElementById('btnPlayBGM');
    const btnStopBGM = document.getElementById('btnStopBGM');
    
    if (bgmVol) {
        bgmVol.addEventListener('input', (e) => {
            if (bgmPlayer) bgmPlayer.volume = e.target.value;
        });
    }

    function updateBgmUI() {
        if (!bgmPlayer.paused && bgmPlayer.currentTime > 0) {
            btnPlayBGM.innerHTML = '<i class="bi bi-pause-fill"></i> 暫停';
            btnPlayBGM.style.background = 'var(--accent)'; 
        } else {
            btnPlayBGM.innerHTML = '<i class="bi bi-play-fill"></i> 播放';
            btnPlayBGM.style.background = 'var(--primary)'; 
        }
    }

    window.changeBGM = function(url, btn) {
        if (!bgmPlayer) return;
        
        btnPlayBGM.innerHTML = '<i class="bi bi-hourglass-split"></i> 載入中...';
        
        bgmPlayer.src = url;
        bgmPlayer.volume = bgmVol.value;
        
        bgmPlayer.play().then(() => {
            updateBgmUI();
        }).catch(e => {
            console.log("等待互動後播放", e);
            updateBgmUI();
        });
        
        const btns = document.querySelectorAll('#panelBGM .tool-btn.ghost');
        btns.forEach(b => {
            if (b.id !== 'btnStopBGM') {
                b.style.borderColor = 'var(--tbl-border)';
                b.style.background = 'transparent';
            }
        });
        if(btn) {
            btn.style.borderColor = 'var(--primary)';
            btn.style.background = 'var(--tbl-alt)';
        }
    };

    btnPlayBGM.addEventListener('click', () => {
        if (bgmPlayer) {
            if (!bgmPlayer.getAttribute('src')) {
                const firstSongBtn = document.querySelectorAll('#panelBGM .tool-btn.ghost')[0];
                if (firstSongBtn) firstSongBtn.click();
            } else {
                if (bgmPlayer.paused) bgmPlayer.play();
                else bgmPlayer.pause();
                updateBgmUI();
            }
        }
    });

    if (bgmPlayer) {
        bgmPlayer.addEventListener('play', updateBgmUI);
        bgmPlayer.addEventListener('pause', updateBgmUI);
        bgmPlayer.addEventListener('canplay', updateBgmUI); 
    }

    btnStopBGM.addEventListener('click', () => {
        if (bgmPlayer) {
            bgmPlayer.pause();
            bgmPlayer.currentTime = 0; 
            updateBgmUI();
        }
    });

    document.addEventListener('click', (e) => { 
        if (e.target.closest('.tool-close')) { 
            const win = e.target.closest('.tool-window'); if (win) win.classList.remove('show'); 
        }
        const picker = document.getElementById('statusPicker');
        if (picker && picker.classList.contains('show') && !picker.contains(e.target) && !e.target.closest('div[onclick^="window.toggleCardTaskStatus"]')) picker.classList.remove('show');
        const menu = document.getElementById('quickDebtMenu');
        if (menu && menu.classList.contains('show') && !menu.contains(e.target) && !e.target.closest('.debt-badge') && !e.target.closest('.btn-close-debt')) { menu.classList.remove('show'); menu.style.display = ''; menu.dataset.currentSidx = ""; }
    });

    document.getElementById('btnMqShow').addEventListener('click', () => { 
        const txt = document.getElementById('mqTextInput').value; 
        if(!txt) return; 
        const el = document.getElementById('marqueeText'); 
        el.innerText = txt; 
        el.style.color = document.getElementById('mqColorInput').value;
        el.style.fontSize = document.getElementById('mqSizeInput').value + 'px';
        
        const speed = parseInt(document.getElementById('mqSpeedInput').value);
        
        if (speed === 0) {
            el.style.animation = 'none';
            el.style.paddingLeft = '0';
            el.style.width = '100%';
            el.style.textAlign = 'center';
        } else {
            el.style.animation = 'marquee-anim linear infinite';
            el.style.paddingLeft = '100%';
            el.style.width = 'auto';
            el.style.textAlign = 'left';
            el.style.animationDuration = Math.max(3, 50 - speed) + 's'; 
        }
        
        document.getElementById('topMarquee').style.display = 'block'; 
    });
    
    document.getElementById('btnMqHide').addEventListener('click', () => document.getElementById('topMarquee').style.display = 'none');

    document.getElementById('btnQuickDebtMarquee').addEventListener('click', () => {
        const contactBookTask = data.assignments.find(a => !a.archived && a.title.includes('聯絡簿'));
        
        if (!contactBookTask) {
            showToast('⚠️ 目前看板上沒有名為「聯絡簿」的委託單！');
            return;
        }
        
        let missingStudents = [];
        const indices = contactBookTask.assignedIndices || 'all';
        
        data.roster.forEach((s, i) => {
            if (indices === 'all' || indices.includes(i)) {
                const st = (contactBookTask.statuses || [])[i] || 0;
                if (st === 0 || st === 2) {
                    missingStudents.push(s.no);
                }
            }
        });
        
        const inputEl = document.getElementById('mqTextInput');
        if (missingStudents.length === 0) {
            inputEl.value = '🎉 全班聯絡簿皆已繳交完成！';
        } else {
            inputEl.value = `⚠️ 聯絡簿未交 / 待訂正：${missingStudents.join(', ')} 號，請盡速交至講台！`;
        }
    });

    let timerInt = null; let timerSec = 0;
    function updateTimer() { document.getElementById('timerDisplay').innerText = `${String(Math.floor(timerSec/60)).padStart(2,'0')}:${String(timerSec%60).padStart(2,'0')}`; }
    document.querySelectorAll('.btn-timer-preset').forEach(b => b.addEventListener('click', (e) => { timerSec += parseInt(e.target.dataset.min) * 60; updateTimer(); }));
    
document.getElementById('btnTimerStart').addEventListener('click', (e) => { 
        const ctx = resumeAudio(); 
        const unlockOsc = ctx.createOscillator(); 
        const unlockGain = ctx.createGain();
        unlockGain.gain.value = 0; 
        unlockOsc.connect(unlockGain); 
        unlockGain.connect(ctx.destination);
        unlockOsc.start(); unlockOsc.stop(ctx.currentTime + 0.1);

        const displayBox = document.getElementById('timerDisplay');
        const btn = document.getElementById('btnTimerStart'); 
        
        if(timerInt) { 
            clearInterval(timerInt); timerInt=null; 
            btn.innerHTML=`<i class="bi bi-play-fill"></i> 繼續`; 
            btn.classList.remove('warn');
        } else { 
            const inM = parseInt(document.getElementById('timerInput').value); const inS = parseInt(document.getElementById('timerInputSec').value);
            if (!isNaN(inM) || !isNaN(inS)) { 
                timerSec = (inM || 0) * 60 + (inS || 0); 
                document.getElementById('timerInput').value=''; document.getElementById('timerInputSec').value=''; 
                updateTimer(); 
            }
            
            if(timerSec > 0) { 
                btn.innerHTML=`<i class="bi bi-pause-fill"></i> 暫停`; 
                btn.classList.add('warn');
                
                displayBox.style.backgroundColor = 'var(--bg)'; 
                displayBox.style.color = 'var(--primary)';
                
                timerInt = setInterval(() => { 
                    if(timerSec > 0) { 
                        timerSec--; 
                        updateTimer(); 
                        
                        if (timerSec > 0 && timerSec <= 3) {
                            if (window.playTimerTickSound) window.playTimerTickSound();
                        }
                    } 
                    
                    if(timerSec <= 0) { 
                        clearInterval(timerInt); timerInt=null; 
                        
                        btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; 
                        btn.classList.remove('warn'); 
                        
                        if (window.playTimerVictoryMusic) window.playTimerVictoryMusic(); 
                        showToast("⏰ 時間到！任務結束！"); 
                    } 
                }, 1000);
            } 
        } 
    });
    
    document.getElementById('btnTimerReset').addEventListener('click', () => { 
        clearInterval(timerInt); timerInt=null; timerSec=0; updateTimer(); 
        const btn = document.getElementById('btnTimerStart'); btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; btn.classList.remove('warn');
    });

    let swInt = null, swStart = 0, swElapsed = 0;
    function updateSw() {
        const t = Date.now() - swStart + swElapsed;
        const ms = String(Math.floor((t % 1000) / 10)).padStart(2, '0');
        const s = String(Math.floor((t / 1000) % 60)).padStart(2, '0');
        const m = String(Math.floor((t / 60000))).padStart(2, '0');
        document.getElementById('swDisplay').innerText = `${m}:${s}:${ms}`;
    }
    document.getElementById('btnSwStart').addEventListener('click', (e) => {
        if(swInt) { clearInterval(swInt); swInt=null; swElapsed += Date.now() - swStart; e.currentTarget.innerHTML=`<i class="bi bi-play-fill"></i> 繼續`; e.currentTarget.classList.remove('warn'); }
        else { swStart = Date.now(); swInt = setInterval(updateSw, 10); e.currentTarget.innerHTML=`<i class="bi bi-pause-fill"></i> 暫停`; e.currentTarget.classList.add('warn'); }
    });
    document.getElementById('btnSwReset').addEventListener('click', () => {
        clearInterval(swInt); swInt=null; swElapsed=0; document.getElementById('swDisplay').innerText="00:00:00"; 
        const btn = document.getElementById('btnSwStart'); btn.innerHTML=`<i class="bi bi-play-fill"></i> 開始`; btn.classList.remove('warn');
    });

    function rollDiceBox(boxId, getResultFn) {
        resumeAudio(); const box = document.getElementById(boxId); box.classList.add('dice-rolling');
        let count = 0;
        const intv = setInterval(() => { box.innerText = getResultFn(true); playTickSound(); count++; if(count > 15) { clearInterval(intv); box.classList.remove('dice-rolling'); box.innerText = getResultFn(false); playSuccessSound(); } }, 50);
    }
    document.getElementById('btnRollNumDice').addEventListener('click', () => {
        const min = parseInt(document.getElementById('diceMin').value) || 1;
        const max = parseInt(document.getElementById('diceMax').value) || 6;
        rollDiceBox('numDiceResult', () => Math.floor(Math.random() * (max - min + 1)) + min);
    });
    document.getElementById('btnRollAlphaDice').addEventListener('click', () => {
        rollDiceBox('alphaDiceResult', () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
    });

    document.getElementById('tabBasicDraw').onclick = () => { document.getElementById('tabBasicDraw').classList.add('active'); document.getElementById('tabWheelDraw').classList.remove('active'); document.getElementById('viewBasicDraw').style.display='block'; document.getElementById('viewWheelDraw').style.display='none'; };
    document.getElementById('tabWheelDraw').onclick = () => { document.getElementById('tabWheelDraw').classList.add('active'); document.getElementById('tabBasicDraw').classList.remove('active'); document.getElementById('viewWheelDraw').style.display='block'; document.getElementById('viewBasicDraw').style.display='none'; renderWheel(); };

    document.getElementById('btnLuckyDraw').addEventListener('click', () => { 
        resumeAudio(); const btn = document.getElementById('btnLuckyDraw'); const res = document.getElementById('luckyDrawResult'); 
        if (!data.roster || !data.roster.length) return; if (btn.disabled) return; 
        btn.disabled = true; btn.innerHTML = `<i class="bi bi-arrow-repeat"></i> 轉動中...`; res.classList.add('dice-rolling');
        let c = 0; const intv = setInterval(() => { res.innerText = data.roster[Math.floor(Math.random() * data.roster.length)].name; playTickSound(); c++; if(c>20) { clearInterval(intv); res.classList.remove('dice-rolling'); playSuccessSound(); confetti(); btn.disabled=false; btn.innerHTML=`<i class="bi bi-dice-5-fill"></i> 再次抽出`; } }, 50);
    });

    let currentWheelDeg = 0;
    function renderWheel() {
        const c = document.getElementById('wheelCanvas'); if(!data.roster || !data.roster.length) { c.style.background = '#ccc'; return; }
        const slice = 360 / data.roster.length; let grad = [];
        data.roster.forEach((s, i) => { const color = i % 2 === 0 ? '#FAF0E6' : '#E6D2B5'; grad.push(`${color} ${i*slice}deg ${(i+1)*slice}deg`); });
        c.style.background = `conic-gradient(${grad.join(', ')})`;
    }
    document.getElementById('btnSpinWheel').addEventListener('click', () => {
        if (!data.roster || !data.roster.length) return; resumeAudio(); const c = document.getElementById('wheelCanvas'); const btn = document.getElementById('btnSpinWheel'); btn.disabled=true; document.getElementById('wheelWinnerName').innerText = "轉動中...";
        const spinDeg = Math.floor(Math.random() * 360) + 1440; currentWheelDeg += spinDeg; c.style.transform = `rotate(${currentWheelDeg}deg)`;
        setTimeout(() => { 
            const actualDeg = currentWheelDeg % 360; 
            const idx = Math.floor((360 - actualDeg) / (360 / data.roster.length)) % data.roster.length;
            document.getElementById('wheelWinnerName').innerText = `🎉 ${data.roster[idx].name}`; playSuccessSound(); confetti(); btn.disabled=false;
        }, 4000);
    });

    let micStream = null, audioCtx2 = null, analyser = null, micInt = null;
    document.getElementById('btnToggleMic').addEventListener('click', async (e) => {
        const btn = e.currentTarget; const bar = document.getElementById('decibelBar'); const txt = document.getElementById('decibelText'); const icon = document.getElementById('micIcon');
        if(micStream) {
            clearInterval(micInt); micStream.getTracks().forEach(t=>t.stop()); micStream=null; audioCtx2.close(); audioCtx2=null;
            btn.innerHTML=`<i class="bi bi-play-circle"></i> 啟動偵測`; btn.classList.remove('warn'); bar.style.width='0%'; txt.innerText='已停止'; icon.style.color='var(--muted)';
        } else {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();
                const src = audioCtx2.createMediaStreamSource(micStream); analyser = audioCtx2.createAnalyser(); analyser.fftSize = 256; src.connect(analyser);
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                btn.innerHTML=`<i class="bi bi-stop-circle"></i> 停止偵測`; btn.classList.add('warn'); icon.style.color='var(--danger)';
                
                micInt = setInterval(() => {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0; for(let i=0; i<dataArray.length; i++) sum+=dataArray[i];
                    let vol = sum / dataArray.length; 
                    let pct = Math.min(100, Math.floor((vol / 120) * 100)); 
                    bar.style.width = pct + '%';
                    bar.style.backgroundColor = pct > 80 ? 'var(--danger)' : (pct > 50 ? '#f97316' : 'var(--success)');
                    txt.innerText = pct > 80 ? '太吵了！⚠️' : (pct > 50 ? '有點聲音' : '很安靜');
                }, 100);
            } catch(err) { alert('無法取得麥克風權限！'); }
        }
    });

let isSidebarEditMode = false;

document.getElementById('btnOpenSidebar').addEventListener('click', () => {
    document.getElementById('quickSidebar').classList.add('show');
    document.body.classList.add('sidebar-open'); 
    renderQuickSidebar();
});
document.getElementById('btnCloseSidebar').addEventListener('click', () => {
    document.getElementById('quickSidebar').classList.remove('show');
    document.body.classList.remove('sidebar-open'); 
});

document.getElementById('btnToggleSidebarEdit').addEventListener('click', (e) => {
    isSidebarEditMode = !isSidebarEditMode;
    const btn = e.currentTarget;
    
    if (isSidebarEditMode) {
        btn.innerHTML = '<i class="bi bi-unlock-fill"></i>';
        btn.classList.remove('ghost');
        btn.style.background = 'var(--danger)';
        btn.style.borderColor = 'var(--danger)';
        btn.style.color = '#fff';
    } else {
        btn.innerHTML = '<i class="bi bi-lock-fill"></i>';
        btn.classList.add('ghost');
        btn.style.background = 'transparent';
        btn.style.borderColor = 'var(--text-light)';
        btn.style.color = 'var(--text-main)';
    }
    renderQuickSidebar();
});

window.renderQuickSidebar = function() {
    const list = document.getElementById('quickSidebarList');
    if (!list) return;
    
    list.style.gridTemplateColumns = isSidebarEditMode ? '1fr' : '1fr 1fr';
    list.innerHTML = '';
    
    data.roster.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'qs-item';
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
                <div style="font-weight:900; font-size:13px; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    <span style="color:var(--primary); margin-right:2px;">${s.no}.</span>${s.name}
                </div>
                <div style="display: ${isSidebarEditMode ? 'none' : 'flex'}; gap:6px; font-size:12px; font-weight:bold;">
                    <span style="color:var(--muted);">⭐${s.exp||0}</span>
                    <span style="color:#b45309;">💰${s.coins||0}</span>
                </div>
            </div>
            
            <div style="display: ${isSidebarEditMode ? 'flex' : 'none'}; gap: 8px; margin-top: 6px; width: 100%;">
                
                <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:2px 4px; border-radius:4px; border:1px solid var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeExp(${i}, -1, '速覽手動扣分')" style="border:none; padding:2px 6px; font-size:14px;">-</button>
                    <span style="font-size:12px; font-weight:bold; color:var(--muted);">⭐ ${s.exp||0}</span>
                    <button class="btn sm ghost icon-only" onclick="window.changeExp(${i}, 1, '速覽手動加分')" style="border:none; padding:2px 6px; font-size:14px;">+</button>
                </div>
                
                <div style="flex:1; display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:2px 4px; border-radius:4px; border:1px solid var(--tbl-border);">
                    <button class="btn sm warn ghost icon-only" onclick="window.changeCoin(${i}, -1, '速覽手動扣款')" style="border:none; padding:2px 6px; font-size:14px;">-</button>
                    <span style="font-size:12px; font-weight:bold; color:#b45309;">💰 ${s.coins||0}</span>
                    <button class="btn sm ghost icon-only" onclick="window.changeCoin(${i}, 1, '速覽手動加幣')" style="border:none; padding:2px 6px; font-size:14px;">+</button>
                </div>

            </div>
        `;
        list.appendChild(div);
    });
};

    
    document.getElementById('tabBtnStudents').addEventListener('click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('tabBtnTeachers').classList.remove('active');
        document.getElementById('roster-content-students').classList.add('show');
        document.getElementById('roster-content-teachers').classList.remove('show');
    });

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const targetId = e.currentTarget.dataset.target;
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = content.id === targetId ? 'block' : 'none';
            });
        });
    });

    document.getElementById('btnPlusClassStar').addEventListener('click', (e) => {
        if (!data.settings) data.settings = {};
        data.settings.classStars = (data.settings.classStars || 0) + 1;
        
        if (window.playStarSound) window.playStarSound();
        triggerAutoSave();
        renderClassStars();
        
        const display = document.getElementById('classStarDisplay');
        display.classList.remove('star-pop-anim');
        void display.offsetWidth; 
        display.classList.add('star-pop-anim');
        
        confetti({ 
            particleCount: 80, 
            spread: 100, 
            origin: { y: 0.1 },
            colors: ['#fcd34d', '#f59e0b', '#fbbf24', '#fffbeb'] 
        });

        const emojis = ['✨', '💖', '🥰', '🎉', '🌟', '🤩'];
        const emojiCount = Math.floor(Math.random() * 3) + 3; 
        for(let i = 0; i < emojiCount; i++) {
            const el = document.createElement('div');
            el.className = 'floating-emoji';
            el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = (e.clientX - 30 + Math.random() * 60) + 'px';
            el.style.top = (e.clientY - 30 + Math.random() * 30) + 'px';
            el.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
            document.body.appendChild(el);
            
            setTimeout(() => el.remove(), 1200); 
        }
        
        showToast("🌟 班級星星 +1！繼續保持！");
    });

    document.getElementById('btnMinusClassStar').addEventListener('click', () => {
        if (!data.settings) data.settings = {};
        if ((data.settings.classStars || 0) > 0) {
            data.settings.classStars--;
            triggerAutoSave();
            renderClassStars();
        }
    });

    document.getElementById('btnResetClassStar').addEventListener('click', () => {
        if (confirm("確定要將班級星星歸零嗎？\n(通常在兌換獎勵後使用)")) {
            if (!data.settings) data.settings = {};
            data.settings.classStars = 0;
            triggerAutoSave();
            renderClassStars();
            showToast("🔄 班級星星已歸零！");
        }
    });
    
    document.getElementById('userEmailDisplay').addEventListener('click', () => {
        const firstTab = document.querySelector('.admin-tab-btn[data-target="adminTab-debts"]');
        if (firstTab) firstTab.click();
    });

    document.getElementById('btnAdminRoster').addEventListener('click', () => { 
        document.getElementById('adminProfileModal').classList.remove('show'); 
        switchView('view-roster'); 
    });
    
    document.getElementById('tabBtnTeachers').addEventListener('click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('tabBtnStudents').classList.remove('active');
        document.getElementById('roster-content-teachers').classList.add('show');
        document.getElementById('roster-content-students').classList.remove('show');
        renderTeacherEditor();
    });

    document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (pickerTarget) {
                const newStatus = parseInt(e.currentTarget.getAttribute('data-status'));
                window.updateStatus(pickerTarget.aid, pickerTarget.idx, newStatus);
                document.getElementById('statusPicker').classList.remove('show');
                pickerTarget = null;
            }
        });
    });

    let hgTimerInterval = null;
    let hgTotalSeconds = 60;
    let hgVolumeA = 0; 
    let hgFlipCount = 0;
    let hgIsRunning = false;
    let hgIsFlipping = false;

    const hgSandA = document.getElementById('hg-sand-a');
    const hgSandB = document.getElementById('hg-sand-b');
    const hgStream = document.getElementById('hg-stream');
    const hgDisplay = document.getElementById('hg-time-display');
    const hgTimeInput = document.getElementById('hg-time-input');
    const hgWrapper = document.getElementById('hg-wrapper');
    const hgPlayIcon = document.getElementById('hg-play-icon');
    const hgPauseIcon = document.getElementById('hg-pause-icon');
    const hgBody = document.getElementById('hgTimerBody');

    window.updateHgHourglassScale = function(seconds) {
        const scale = Math.max(0.85, Math.min(1.25, 0.72 + Math.sqrt(seconds) / 28));
        hgWrapper.style.setProperty('--hg-scale', scale);
    };

    window.updateHgVisuals = function(transitionType = 'linear') {
        let amountA = hgTotalSeconds > 0 ? hgVolumeA / hgTotalSeconds : 0;
        let amountB = 1 - amountA;

        let transitionStyle = 'none';
        if (transitionType === 'smooth') {
            transitionStyle = 'top 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (transitionType === 'linear') {
            transitionStyle = 'top 1s linear, height 1s linear';
        }

        hgSandA.style.transition = transitionStyle + ', background 0.4s ease';
        hgSandB.style.transition = transitionStyle + ', background 0.4s ease';

        hgSandA.style.height = `${amountA * 100}%`;
        hgSandB.style.height = `${amountB * 100}%`;

        if (hgFlipCount % 2 === 0) {
            hgSandA.style.top = `${(1 - amountA) * 100}%`;
            hgSandB.style.top = `${(1 - amountB) * 100}%`;
        } else {
            hgSandA.style.top = `0%`;
            hgSandB.style.top = `0%`;
        }

        let displaySecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
        const m = Math.floor(displaySecs / 60).toString().padStart(2, '0');
        const s = (displaySecs % 60).toString().padStart(2, '0');
        hgDisplay.innerText = `${m}:${s}`;
    };

    window.applyHgPreset = function(sec, color, btn) {
        resumeAudio();
        document.querySelectorAll('.hg-pbtn').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
        
        if(color) hgBody.style.setProperty('--hg-sand-color', color);
        
        hgTimeInput.value = sec;
        clearInterval(hgTimerInterval);
        hgIsRunning = false;
        hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
        hgStream.classList.remove('active');

        hgTotalSeconds = sec;
        hgVolumeA = 0; 
        hgFlipCount = 0; 
        
        hgWrapper.style.setProperty('--hg-rot', `0deg`);
        hgStream.style.transform = `translateX(-50%) rotate(0deg)`;
        
        window.updateHgVisuals('none');
        window.updateHgHourglassScale(sec); 
    };

    hgTimeInput.addEventListener('input', () => {
        if (hgIsRunning) return;
        const val = parseInt(hgTimeInput.value);
        if (val > 0) {
            hgTotalSeconds = val;
            hgVolumeA = (hgFlipCount % 2 === 0) ? 0 : val; 
            window.updateHgVisuals('none');
            window.updateHgHourglassScale(val);
            document.querySelectorAll('.hg-pbtn').forEach(b => b.classList.remove('active'));
        }
    });

    window.toggleHgTimer = function() {
        resumeAudio();
        if (hgIsRunning) {
            clearInterval(hgTimerInterval);
            hgIsRunning = false;
            hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
            hgStream.classList.remove('active');
        } else {
            let displaySecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
            if (displaySecs <= 0) { window.flipHourglassPanel(); return; }

            hgIsRunning = true;
            hgPlayIcon.style.display = 'none'; hgPauseIcon.style.display = 'block';
            hgStream.classList.add('active');

            hgTimerInterval = setInterval(() => {
                if (hgFlipCount % 2 === 0) {
                    if (hgVolumeA > 0) hgVolumeA--;
                } else {
                    if (hgVolumeA < hgTotalSeconds) hgVolumeA++;
                }

                window.updateHgVisuals('linear');

                let currentSecs = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
                if (currentSecs <= 0) {
                    clearInterval(hgTimerInterval);
                    hgIsRunning = false;
                    hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
                    hgStream.classList.remove('active');
                    hgDisplay.innerText = "00:00"; 
                    
                    showToast("⏳ 沙漏時間到！任務結束！");
                    if (window.playTimerVictoryMusic) window.playTimerVictoryMusic();
                }
            }, 1000);
        }
    };

    window.resetHgTimer = function() {
        clearInterval(hgTimerInterval);
        hgIsRunning = false;
        hgPlayIcon.style.display = 'block'; hgPauseIcon.style.display = 'none';
        hgStream.classList.remove('active');
        
        const inputVal = parseInt(hgTimeInput.value);
        hgTotalSeconds = isNaN(inputVal) || inputVal <= 0 ? 60 : inputVal;
        hgVolumeA = 0; 
        hgFlipCount = 0;
        
        hgWrapper.style.setProperty('--hg-rot', `0deg`);
        hgStream.style.transform = `translateX(-50%) rotate(0deg)`;
        
        window.updateHgVisuals('none');
        window.updateHgHourglassScale(hgTotalSeconds);
    };

    window.flipHourglassPanel = function() {
        if (hgIsFlipping || hgTotalSeconds <= 0) return;
        resumeAudio();
        hgIsFlipping = true;

        let displaySecsBefore = (hgFlipCount % 2 === 0) ? hgVolumeA : hgTotalSeconds - hgVolumeA;
        hgFlipCount++;
        let newRot = hgFlipCount * 180;
        
        hgWrapper.style.setProperty('--hg-rot', `${newRot}deg`);
        hgStream.style.transform = `translateX(-50%) rotate(${-newRot}deg)`;

        window.updateHgVisuals('smooth');

        setTimeout(() => { hgIsFlipping = false; }, 600);

        if (displaySecsBefore === 0 && !hgIsRunning) {
            window.toggleHgTimer();
        }
    };
// ==========================================
    // ⭐ 左側常駐浮窗：拖曳與收合功能 (支援電腦與平板)
    // ==========================================
    const psSidebar = document.getElementById('persistentSidebar');
    const psHandle = document.getElementById('psDragHandle');
    let isPsDragging = false;
    let psStartX, psStartY, psInitialLeft, psInitialTop;

    // 啟動拖曳
    const startPsDrag = (e) => {
        // 如果點擊的是按鈕，不要觸發拖曳
        if (e.target.closest('#btnTogglePs')) return; 
        
        isPsDragging = true;
        psSidebar.style.transition = 'none'; // 拖曳時取消動畫，讓跟隨更順暢
        
        // 判斷是滑鼠還是觸控
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        psStartX = clientX;
        psStartY = clientY;
        
        const rect = psSidebar.getBoundingClientRect();
        psInitialLeft = rect.left;
        psInitialTop = rect.top;
        
        psHandle.style.cursor = 'grabbing';
    };

    // 拖曳中
    const doPsDrag = (e) => {
        if (!isPsDragging) return;
        // e.preventDefault(); // 避免在平板上拖曳時畫面跟著捲動 (若有需要可解除註解)
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const dx = clientX - psStartX;
        const dy = clientY - psStartY;
        
        psSidebar.style.left = `${psInitialLeft + dx}px`;
        psSidebar.style.top = `${psInitialTop + dy}px`;
        psSidebar.style.bottom = 'auto';
        psSidebar.style.right = 'auto';
    };

    // 結束拖曳
    const stopPsDrag = () => {
        if (!isPsDragging) return;
        isPsDragging = false;
        psHandle.style.cursor = 'grab';
        psSidebar.style.transition = 'background-color .3s, color .3s'; // 恢復背景顏色漸變動畫
    };

    // 綁定滑鼠事件 (電腦端)
    psHandle.addEventListener('mousedown', startPsDrag);
    document.addEventListener('mousemove', doPsDrag);
    document.addEventListener('mouseup', stopPsDrag);

    // 綁定觸控事件 (平板/手機端)
    psHandle.addEventListener('touchstart', startPsDrag, { passive: true });
    document.addEventListener('touchmove', doPsDrag, { passive: true });
    document.addEventListener('touchend', stopPsDrag);

    // 收合/展開按鈕邏輯
    document.getElementById('btnTogglePs').addEventListener('click', function() {
        const wrapper = document.getElementById('psContentWrapper');
        const icon = this.querySelector('i');
        
        if (wrapper.style.display === 'none') {
            wrapper.style.display = 'block';
            icon.className = 'bi bi-arrows-collapse';
            psSidebar.style.minWidth = '55px';
        } else {
            wrapper.style.display = 'none';
            icon.className = 'bi bi-arrows-expand';
            psSidebar.style.minWidth = 'auto';
        }
    });
// ==========================================
// ⭐ Bubble Check 風格：立體扭蛋機與萌寵圖鑑引擎
// ==========================================
let currentSummonStudentIdx = null;
let gachaState = 'idle'; // 'idle' | 'spinning' | 'ready' | 'opening' | 'done'
let pendingDrawResult = null;
let currentBookFilter = 'all';
let currentDetailPetId = null;

const GACHA_RARITY_META = {
    1: { label: '普通', color: '#4fa3ff', weight: 60 },
    2: { label: '稀有', color: '#a57bff', weight: 32 },
    3: { label: '夢幻', color: '#f5a524', weight: 8 }
};
const CAPSULE_COLORS = ['#ff6b7d', '#ffcf3f', '#4fa3ff', '#a57bff', '#4fd6b0'];
const DOME_POSITIONS = [
    [74, 166], [128, 162], [182, 165], [234, 168],
    [52, 206], [102, 202], [154, 207], [206, 203], [254, 208]
];

function darkenHex(hex, ratio) {
    const num = parseInt(hex.slice(1), 16);
    const c = (v) => Math.round(v * (1 - ratio));
    return `rgb(${c(num >> 16)}, ${c((num >> 8) & 255)}, ${c(num & 255)})`;
}

function buildCapsuleSvgMarkup(pet, color, r = 24, hidePet = false, splitIds = false) {
    const l = r * 0.14;
    const o = r * 0.3;
    const bottomPath = `M${-r} ${l}A${r} ${o} 0 0 0 ${r} ${l}A${r} ${r * 0.92} 0 0 1 ${-r} ${l}Z`;
    const topPath = `M${-r} ${l}A${r} ${r * 1.02} 0 0 1 ${r} ${l}A${r} ${o} 0 0 1 ${-r} ${l}Z`;
    const m = r * 1.62;
    const petImg = pet ? (pet.sit || pet.img || '') : '';

    const shadow = `<ellipse cy="${r}" rx="${r * 0.8}" ry="${r * 0.14}" fill="#0b3a44" opacity=".2"/>`;
    const innerRim = `
        <ellipse cy="${l}" rx="${r}" ry="${o}" fill="${darkenHex(color, 0.3)}"/>
        <ellipse cy="${l}" rx="${r}" ry="${o}" fill="url(#cap-inner)"/>
    `;
    const bottomHalf = `
        <path d="${bottomPath}" fill="${color}"/>
        <path d="${bottomPath}" fill="url(#cap-shade)"/>
        <path d="${bottomPath}" fill="url(#cap-side)"/>
        <path d="${bottomPath}" fill="none" stroke="${darkenHex(color, 0.38)}" stroke-width="${r * 0.06}" stroke-linejoin="round"/>
        <path d="M${-r * 0.96} ${l + r * 0.04}A${r} ${o} 0 0 0 ${r * 0.96} ${l + r * 0.04}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${r * 0.07}"/>
    `;
    const topHalf = `
        <path d="${topPath}" fill="url(#cap-glass)" stroke="#fff" stroke-opacity=".9" stroke-width="${r * 0.05}"/>
        <path d="M${-r * 0.7} ${-r * 0.12}Q${-r * 0.64} ${-r * 0.66} ${-r * 0.2} ${-r * 0.82}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${r * 0.08}" stroke-linecap="round"/>
        <circle cx="${r * 0.52}" cy="${-r * 0.56}" r="${r * 0.055}" fill="#fff" opacity=".75"/>
    `;

    if (splitIds) {
        return `
            ${shadow}
            <g id="capSplitBottom" style="transform-box:fill-box; transform-origin:center;">${innerRim}${bottomHalf}</g>
            <g id="capSplitTop" style="transform-box:fill-box; transform-origin:center;">${topHalf}</g>
        `;
    }
    const petMarkup = (!hidePet && petImg && petImg.startsWith('data:'))
        ? `<image href="${petImg}" x="${-m / 2}" y="${l + r * 0.42 - m}" width="${m}" height="${m}" style="image-rendering:pixelated;"/>`
        : '';
    return `${shadow}${innerRim}${petMarkup}${bottomHalf}${topHalf}`;
}

function renderDomeCapsules() {
    const container = document.getElementById('gachaDomeCapsules');
    if (!container) return;
    container.innerHTML = DOME_POSITIONS.map(([x, y], idx) => {
        const samplePet = gachaPool[(idx * 13 + 5) % gachaPool.length];
        const color = CAPSULE_COLORS[idx % CAPSULE_COLORS.length];
        return `<g transform="translate(${x} ${y})" class="dome-cap-group">
            <g class="cap-idle-${idx % 2}">${buildCapsuleSvgMarkup(samplePet, color, 26, false, false)}</g>
        </g>`;
    }).join('');
}

function playCrankSound() {
    try {
        const ctx = resumeAudio();
        const t = ctx.currentTime;
        for (let n = 0; n < 6; n++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 180 + (n % 2) * 40;
            gain.gain.setValueAtTime(0.0001, t + n * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.06, t + n * 0.11 + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + n * 0.11 + 0.06);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t + n * 0.11);
            osc.stop(t + n * 0.11 + 0.07);
        }
    } catch (e) {}
}

function playPetCrySound(kind = 'cat') {
    try {
        const ctx = resumeAudio();
        const n = ctx.currentTime + 0.01;
        const r = 0.92 + Math.random() * 0.2;
        const master = ctx.createGain();
        master.gain.value = 0.65;
        master.connect(ctx.destination);

        if (kind === 'dog') {
            [0, 0.22].forEach(offset => {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(420 * r, n + offset);
                osc.frequency.exponentialRampToValueAtTime(190 * r, n + offset + 0.13);
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2200, n + offset);
                filter.frequency.exponentialRampToValueAtTime(700, n + offset + 0.15);
                filter.Q.value = 5;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.0001, n + offset);
                g.gain.exponentialRampToValueAtTime(0.35, n + offset + 0.015);
                g.gain.exponentialRampToValueAtTime(0.0001, n + offset + 0.17);
                osc.connect(filter).connect(g).connect(master);
                osc.start(n + offset);
                osc.stop(n + offset + 0.19);
            });
        } else {
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(680 * r, n);
            osc.frequency.exponentialRampToValueAtTime(1120 * r, n + 0.18);
            osc.frequency.exponentialRampToValueAtTime(960 * r, n + 0.42);
            osc.frequency.exponentialRampToValueAtTime(640 * r, n + 0.62);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, n);
            g.gain.exponentialRampToValueAtTime(0.35, n + 0.05);
            g.gain.linearRampToValueAtTime(0.28, n + 0.45);
            g.gain.exponentialRampToValueAtTime(0.0001, n + 0.65);
            osc.connect(g).connect(master);
            osc.start(n);
            osc.stop(n + 0.68);
        }
    } catch (e) {}
}

function getStudentOwnedMap(student) {
    const map = {};
    (student.pets || []).forEach(pid => {
        const normId = String(pid).startsWith('p') ? parseInt(String(pid).slice(1)) : pid;
        map[normId] = (map[normId] || 0) + 1;
    });
    return map;
}

function updateGachaHeaderAndStats() {
    if (currentSummonStudentIdx === null || !data.roster[currentSummonStudentIdx]) return;
    const student = data.roster[currentSummonStudentIdx];
    const ownedMap = getStudentOwnedMap(student);
    const uniqueCount = Object.keys(ownedMap).length;
    const totalPool = gachaPool.length;

    document.getElementById('summonStudentName').innerText = `${student.no}. ${student.name}`;
    document.getElementById('summonStudentCoins').innerText = student.coins || 0;
    document.getElementById('gachaBookProgress').innerText = `${uniqueCount}/${totalPool}`;
    document.getElementById('gachaOwnedStat').innerText = uniqueCount;
    document.getElementById('gachaBannerSubText').textContent = `共有 ${totalPool} 隻可愛夥伴・目前已收服 ${uniqueCount} 隻`;

    const activeId = student.activePet || (student.pets && student.pets.length ? student.pets[student.pets.length - 1] : null);
    const normActiveId = activeId && String(activeId).startsWith('p') ? parseInt(String(activeId).slice(1)) : activeId;
    const partnerPet = normActiveId ? gachaPool.find(p => String(p.id) === String(normActiveId)) : null;
    const previewImg = document.getElementById('summonPartnerPreview');
    if (partnerPet && (partnerPet.sit || '').startsWith('data:')) {
        previewImg.src = partnerPet.sit;
        previewImg.style.display = 'block';
    } else {
        previewImg.style.display = 'none';
    }

    const lastStatEl = document.getElementById('gachaLastDrawnStat');
    if (student.pets && student.pets.length > 0) {
        const lastRaw = student.pets[student.pets.length - 1];
        const lastId = String(lastRaw).startsWith('p') ? parseInt(String(lastRaw).slice(1)) : lastRaw;
        const lastPet = gachaPool.find(p => String(p.id) === String(lastId));
        if (lastPet) {
            const imgHtml = (lastPet.sit || '').startsWith('data:')
                ? `<img src="${lastPet.sit}" class="pixel-pet" style="width:20px; height:20px; vertical-align:middle;">`
                : (lastPet.img || '🐾');
            lastStatEl.innerHTML = `最近抽中 ${imgHtml} <b>${lastPet.name}</b>`;
        }
    } else {
        lastStatEl.innerText = '尚未抽過扭蛋';
    }

    const mainBtn = document.getElementById('btnDoSummon');
    if (gachaState === 'spinning') {
        mainBtn.disabled = true;
        mainBtn.innerText = '扭扭扭…';
    } else if (gachaState === 'ready') {
        mainBtn.disabled = false;
        mainBtn.innerText = '✨ 點扭蛋打開！';
    } else if (gachaState === 'opening') {
        mainBtn.disabled = true;
        mainBtn.innerText = '開蛋囉！';
    } else {
        const canAfford = (student.coins || 0) >= SUMMON_COST;
        mainBtn.disabled = !canAfford;
        mainBtn.innerText = canAfford ? `轉一下把手 (${SUMMON_COST} 💰)` : `金幣不足 (需 ${SUMMON_COST} 💰)`;
    }
}

window.resetGachaMachineView = function() {
    gachaState = 'idle';
    pendingDrawResult = null;
    document.getElementById('gachaDroppedCapsule').style.display = 'none';
    document.getElementById('gachaRevealOverlay').classList.remove('show');
    document.getElementById('gachaRevealInfo').style.display = 'none';
    updateGachaHeaderAndStats();
};

window.switchGachaTab = function(tab) {
    document.getElementById('tabGachaMachine').classList.toggle('active', tab === 'machine');
    document.getElementById('tabGachaBook').classList.toggle('active', tab === 'book');
    document.getElementById('gachaViewMachine').style.display = tab === 'machine' ? 'flex' : 'none';
    document.getElementById('gachaViewBook').style.display = tab === 'book' ? 'flex' : 'none';
    if (tab === 'book') {
        renderGachaBookGrid();
    }
};

window.openSummonModal = function(sidx, initialTab = 'machine', focusPetId = null) {
    const student = data.roster[sidx];
    if (!student) return;
    currentSummonStudentIdx = sidx;
    renderDomeCapsules();
    window.resetGachaMachineView();
    window.switchGachaTab(initialTab);
    document.getElementById('gachaPetDetailOverlay').classList.remove('show');
    document.getElementById('summonModal').classList.add('show');
    if (initialTab === 'book' && focusPetId) {
        window.openGachaPetDetail(focusPetId);
    }
};

window.handleMainGachaBtn = function() {
    if (gachaState === 'ready') {
        window.openDroppedCapsule();
    } else if (gachaState === 'idle') {
        window.triggerGachaSpin();
    }
};

window.triggerGachaSpin = function() {
    if (gachaState !== 'idle' || currentSummonStudentIdx === null) return;
    const student = data.roster[currentSummonStudentIdx];
    if (!student) return;

    if ((student.coins || 0) < SUMMON_COST) {
        showToast('⚠️ 金幣不足！快去完成委託賺取金幣吧！');
        return;
    }

    window.changeCoin(currentSummonStudentIdx, -SUMMON_COST, '扭蛋召喚', true);

    const ownedMap = getStudentOwnedMap(student);
    const rand = Math.random() * 100;
    const rarity = rand < 8 ? 3 : (rand < 40 ? 2 : 1);
    const candidates = gachaPool.filter(p => p.rarity === rarity);
    const poolToUse = candidates.length > 0 ? candidates : gachaPool;
    const chosenPet = poolToUse[Math.floor(Math.random() * poolToUse.length)];
    const isNew = !ownedMap[chosenPet.id];
    const newCount = (ownedMap[chosenPet.id] || 0) + 1;

    if (!Array.isArray(student.pets)) student.pets = [];
    student.pets.push(chosenPet.id);
    if (!student.activePet) student.activePet = chosenPet.id;

    pendingDrawResult = { pet: chosenPet, isNew, count: newCount };
    gachaState = 'spinning';
    updateGachaHeaderAndStats();
    triggerAutoSave();
    renderAll();

    playCrankSound();
    const knob = document.getElementById('gachaDialKnob');
    knob?.animate?.([{ transform: 'rotate(0deg)' }, { transform: 'rotate(720deg)' }], {
        duration: 1050,
        easing: 'cubic-bezier(.45, 0, .3, 1)'
    });

    const machineWrap = document.getElementById('gachaMachineShakeWrap');
    machineWrap?.animate?.(
        [0, -3, 3, -2.5, 2.5, -1.5, 1, 0].map(d => ({
            transform: `translate(${d}px, ${-Math.abs(d) * 0.5}px) rotate(${d * 0.35}deg)`
        })),
        { duration: 1050 }
    );

    document.querySelectorAll('#gachaDomeCapsules .dome-cap-group').forEach((gEl, idx) => {
        gEl.firstElementChild?.animate?.([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${(idx % 3 - 1) * 4}px, -9px) rotate(${(idx % 2 ? 1 : -1) * 16}deg)` },
            { transform: `translate(${(idx % 3 - 1) * -3}px, 2px) rotate(${(idx % 2 ? -1 : 1) * 10}deg)` },
            { transform: 'translate(0, 0) rotate(0deg)' }
        ], { duration: 340, iterations: 3, delay: idx * 20 });
    });

    setTimeout(() => {
        gachaState = 'ready';
        updateGachaHeaderAndStats();

        const capColor = GACHA_RARITY_META[chosenPet.rarity]?.color || '#4fa3ff';
        const droppedBtn = document.getElementById('gachaDroppedCapsule');
        const droppedSvg = document.getElementById('gachaDroppedCapsuleSvg');
        droppedSvg.innerHTML = buildCapsuleSvgMarkup(chosenPet, capColor, 23, true, false) +
            `<text x="0" y="-3" text-anchor="middle" font-size="16" font-weight="900" fill="#fff" stroke="#4a2e22" stroke-width="1.2" paint-order="stroke">?</text>`;
        droppedBtn.style.display = 'block';

        droppedBtn.animate?.([
            { transform: 'translate(-50%, -190%) scale(0.75)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.08, 0.9)', opacity: 1, offset: 0.45 },
            { transform: 'translate(-50%, -82%) scale(1)', offset: 0.68 },
            { transform: 'translate(-50%, -50%) scale(1.03, 0.96)', offset: 0.85 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
        ], { duration: 820, easing: 'ease-in-out' });
    }, 1080);
};

window.openDroppedCapsule = function() {
    if (gachaState !== 'ready' || !pendingDrawResult) return;
    gachaState = 'opening';
    updateGachaHeaderAndStats();

    const { pet, isNew, count } = pendingDrawResult;
    const rarityInfo = GACHA_RARITY_META[pet.rarity] || GACHA_RARITY_META[1];
    document.getElementById('gachaDroppedCapsule').style.display = 'none';

    const overlay = document.getElementById('gachaRevealOverlay');
    const petImgEl = document.getElementById('gachaRevealPetImg');
    const splitSvg = document.getElementById('gachaSplitCapsuleSvg');
    const infoBox = document.getElementById('gachaRevealInfo');

    infoBox.style.display = 'none';
    petImgEl.src = pet.sit || '';
    splitSvg.innerHTML = buildCapsuleSvgMarkup(pet, rarityInfo.color, 25, true, true);
    overlay.classList.add('show');

    const topHalf = document.getElementById('capSplitTop');
    const bottomHalf = document.getElementById('capSplitBottom');
    topHalf?.animate?.([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: 'translate(0, -4px) rotate(-10deg)', offset: 0.25 },
        { transform: 'translate(-24px, -62px) rotate(-52deg)', opacity: 0 }
    ], { duration: 680, delay: 120, easing: 'ease-out', fill: 'forwards' });

    bottomHalf?.animate?.([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: 'translate(0, 4px)', offset: 0.25 },
        { transform: 'translate(0, 48px)', opacity: 0 }
    ], { duration: 680, delay: 120, easing: 'ease-in', fill: 'forwards' });

    petImgEl.animate?.([
        { transform: 'translateY(22%) scale(0.35)', opacity: 0.5 },
        { transform: 'translateY(22%) scale(0.35)', opacity: 1, offset: 0.25 },
        { transform: 'translateY(-10%) scale(1.18)', offset: 0.68 },
        { transform: 'translateY(0) scale(1)', opacity: 1 }
    ], { duration: 900, easing: 'cubic-bezier(.3, 1.4, .4, 1)', fill: 'forwards' });

    setTimeout(() => {
        gachaState = 'done';
        updateGachaHeaderAndStats();

        const rarityBadge = document.getElementById('gachaRevealRarity');
        rarityBadge.innerText = rarityInfo.label;
        rarityBadge.style.background = rarityInfo.color;
        document.getElementById('gachaRevealNo').innerText = `No.${String(pet.id).padStart(3, '0')}`;
        document.getElementById('gachaRevealName').innerText = pet.name;
        document.getElementById('gachaRevealKind').innerText = `種類：${pet.kind === 'dog' ? '狗狗 🐶' : '貓咪 🐱'}　品種：${pet.name}`;
        document.getElementById('gachaRevealBadge').innerText = isNew ? '🎉 收藏成功！新夥伴！' : `收藏成功・第 ${count} 隻`;

        infoBox.style.display = 'flex';
        playStarSound();
        playPetCrySound(pet.kind);
        if (typeof confetti !== 'undefined') {
            confetti({ particleCount: pet.rarity * 45 + 30, spread: 85, origin: { y: 0.55 } });
        }
    }, 820);
};

window.playCurrentPetCry = function() {
    if (pendingDrawResult && pendingDrawResult.pet) {
        playPetCrySound(pendingDrawResult.pet.kind);
    }
};

window.setPartnerPetFromReveal = function() {
    if (currentSummonStudentIdx === null || !pendingDrawResult) return;
    const student = data.roster[currentSummonStudentIdx];
    student.activePet = pendingDrawResult.pet.id;
    playPetCrySound(pendingDrawResult.pet.kind);
    showToast(`💖 已將【${pendingDrawResult.pet.name}】設為 ${student.name} 的代表夥伴！`);
    triggerAutoSave();
    updateGachaHeaderAndStats();
    renderAll();
};

window.setGachaBookFilter = function(filter) {
    currentBookFilter = filter;
    document.querySelectorAll('#gachaViewBook .gacha-filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderGachaBookGrid();
};

function renderGachaBookGrid() {
    const grid = document.getElementById('gachaBookGrid');
    if (!grid || currentSummonStudentIdx === null) return;
    const student = data.roster[currentSummonStudentIdx];
    const ownedMap = getStudentOwnedMap(student);
    const activeId = student.activePet || (student.pets && student.pets.length ? student.pets[student.pets.length - 1] : null);
    const normActiveId = activeId && String(activeId).startsWith('p') ? parseInt(String(activeId).slice(1)) : activeId;

    const list = gachaPool.filter(p => currentBookFilter === 'all' || p.kind === currentBookFilter);
    grid.innerHTML = list.map(pet => {
        const count = ownedMap[pet.id] || 0;
        const unlocked = count > 0;
        const isPartner = unlocked && String(pet.id) === String(normActiveId);
        const rarityInfo = GACHA_RARITY_META[pet.rarity] || GACHA_RARITY_META[1];
        const imgSrc = pet.sit || '';

        return `<div class="gacha-book-item ${unlocked ? '' : 'locked'} ${isPartner ? 'active-partner' : ''}" onclick="${unlocked ? `window.openGachaPetDetail(${pet.id})` : ''}">
            <span style="align-self:flex-start; font-family:monospace; font-size:9px; font-weight:800; opacity:0.5;">No.${String(pet.id).padStart(3, '0')}</span>
            <div style="position:relative; width:48px; height:48px; display:flex; align-items:center; justify-content:center;">
                ${imgSrc.startsWith('data:')
                    ? `<img src="${imgSrc}" class="pixel-pet" style="width:46px; height:46px; object-fit:contain; ${unlocked ? '' : 'filter:brightness(0) opacity(0.22);'}">`
                    : `<span style="font-size:28px; ${unlocked ? '' : 'filter:grayscale(1) opacity(0.25);'}">${pet.img || '🐾'}</span>`
                }
                ${!unlocked ? `<span style="position:absolute; font-size:16px; font-weight:900; opacity:0.4;">?</span>` : ''}
            </div>
            <span style="font-size:11px; font-weight:800; width:100%; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${unlocked ? pet.name : '？？？'}</span>
            ${count > 1 ? `<span style="position:absolute; top:3px; right:6px; font-size:10px; font-weight:900; color:#ff6b7d;">×${count}</span>` : ''}
            ${unlocked ? `<span style="position:absolute; bottom:5px; right:6px; width:6px; height:6px; border-radius:50%; background:${rarityInfo.color};"></span>` : ''}
        </div>`;
    }).join('');
}

window.openGachaPetDetail = function(petId) {
    if (currentSummonStudentIdx === null) return;
    const student = data.roster[currentSummonStudentIdx];
    const ownedMap = getStudentOwnedMap(student);
    const pet = gachaPool.find(p => String(p.id) === String(petId));
    if (!pet || !ownedMap[pet.id]) return;

    currentDetailPetId = pet.id;
    const rarityInfo = GACHA_RARITY_META[pet.rarity] || GACHA_RARITY_META[1];
    document.getElementById('detailPetNo').innerText = `No.${String(pet.id).padStart(3, '0')}`;
    const rBadge = document.getElementById('detailPetRarity');
    rBadge.innerText = rarityInfo.label;
    rBadge.style.background = rarityInfo.color;
    document.getElementById('detailPetImg').src = pet.sit || '';
    document.getElementById('detailPetName').innerText = pet.name;
    document.getElementById('detailPetMeta').innerHTML = `種類：${pet.kind === 'dog' ? '狗狗 🐶' : '貓咪 🐱'}<br>已收集數量：<b>×${ownedMap[pet.id]}</b>`;

    const isPartner = String(student.activePet) === String(pet.id);
    const partnerBtn = document.getElementById('btnSetPartnerFromDetail');
    partnerBtn.disabled = isPartner;
    partnerBtn.innerText = isPartner ? '✓ 目前代表夥伴' : '設為代表夥伴';

    document.getElementById('gachaPetDetailOverlay').classList.add('show');
    playPetCrySound(pet.kind);
};

window.closeGachaPetDetail = function() {
    document.getElementById('gachaPetDetailOverlay').classList.remove('show');
};

window.playDetailPetCry = function() {
    const pet = gachaPool.find(p => String(p.id) === String(currentDetailPetId));
    if (pet) playPetCrySound(pet.kind);
};

window.setPartnerPetFromDetail = function() {
    if (currentSummonStudentIdx === null || !currentDetailPetId) return;
    const student = data.roster[currentSummonStudentIdx];
    const pet = gachaPool.find(p => String(p.id) === String(currentDetailPetId));
    if (!pet) return;
    student.activePet = pet.id;
    playPetCrySound(pet.kind);
    showToast(`💖 已將【${pet.name}】設為 ${student.name} 的代表夥伴！`);
    triggerAutoSave();
    updateGachaHeaderAndStats();
    renderGachaBookGrid();
    window.openGachaPetDetail(pet.id);
    renderAll();
};

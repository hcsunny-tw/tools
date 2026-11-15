// 🛡️ 防 XSS：所有要塞進 innerHTML 的使用者文字（姓名、委託標題、原因…）都先經過這裡
function escapeHtml(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
window.escapeHtml = escapeHtml;

function getTaipeiDateString() { 
        return new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'); 
    }
    
    function showToast(msg, actText, actCb) {
        const c = document.getElementById('toastContainer'); 
        const t = document.createElement('div'); t.className = 'toast-msg';
        t.innerHTML = `<span>${escapeHtml(msg)}</span>` + (actText ? `<button class="btn sm" style="background:#fff;color:#333;border:none;flex-shrink:0;">${escapeHtml(actText)}</button>` : ''); 
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

// 🔮 幻獸召喚池設定 (Bubble Check 100隻像素萌寵：含坐下、走路4格、抓癢2格完整圖檔)
const gachaPool = [{"id": 1, "name": "灰虎斑", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABMUlEQVR42u2YsYrCQBCG/4iNvY149VXxbbQT0Yc4rrUVX0FQxM68jVbWd4iQ3jLXOOAtWSe7UUTn/7ol2Qw7/87+swEIIYQQQgghhDyHpOqL3fZncT3+zQ9JTMB7fUdovLoCzdAJP8sVAOBjMi5iAl7Nv8sC7CkgTOezf+P9bgcASHu90vGjsKfAIj/VClh3/vsr4J7Tai18fZfWhOx933MtXlV/aJhz4v5oePN00TIup1O23tCJSxXQasCX2WAfuSjlgzWgKROrhJt5X6a1nSDz7DixrLiqT2i9kJZ5UdjXY2XrTWG7Gx10WgCA7fFc+jy0K3UzL4hfZOZrIFSJ2MyHOjUV8OFmXjJbdc+bceLmowO4tZB6HFwcOrQ7tauAe+poNzP+lajbjcbemUMxVwN/sDOXPxAao7MAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+UlEQVR42u2bvU7DMBSFbxELOwuCmQX6MEiwVYgOrGxV16yIV0CCnb5NmZhBCKk7Y5kstVZuHcc/xfH3LVUSubk5Vs9xrlwRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAog1EtD3p6fL7ePP5afYz2+T218V/1P2BqoGYOa3PQz5dXERE5m96tA8fjoAPQnwQAEqAGB7Vpnh63jt+XSxERuRyPW49TObqvA6N/XL1JACABSnLQvs5peF79BN0/dLyp3+h3P71C/4Tjbb2b2XyrfhIASIASHNT1S9a6HE4nnc1bHdU4p3bddT+tro36paQEK1V/82nqtesnAYAEKMFBu6KNM/ex18Z2XXa92lo7VR8d/fPqTwIACVCTg7q6IppT2uMXno5tr/2150b/vPqTAEAC1OSgvmj99OvbSev50P47+ufVnwQAEmBIDurqTtj94Fy4nBP996M/CQAkwJAcNDaaE/qeryXBStOfBAASoAYH1bg5Odp5/e37t+gJRn8SACBdApTuoBeTh539bt/9+fa41Gv10vS332XEoZtrHpqO47V3FxIASICaHVRzJt9uhz2ub9++NAeNrbfv/ytC55EEABIgh7NKpP3vqZ0+1j740ERJPQ+5dY+tW6x5JAEApOeuxTYX0c7n/j7moZtutetOAkDV/AFSylwMztzvbAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABqklEQVR42u2aPU7DQBBGJ4iGngZBTZUchx4OEaVNi7gCEihKR24TKmoihJSeMhRoJGMx2Z/Y3p3wXhNZzno/y/PNzo4tAgAAAAAAAAAAAAAAAHDMjGL/eHl+vWseb7Zvo5wJu7pOqXm71n9CDJblNHXA+9OziIhc3d3uciZsjC9yw7XpxwHeHKDMH+5/Hb+u1yIiMp5M/jxOzbF9rw1d68/VjQO8OeBx+3nQhNZ4jSCNzPl01osTutZ/qG4cUJsD2nWumUOns705dbVY/vwa52NzdGpEldafqhsH1OYA64lpZGl1YEWERpZ1XsdbObR9ndQ1YGj97AP+2xoQqotDuVLHW7k1N/K96scB3taAUI5MrT5yI9nS6U0/DvCyE9YnFltnh3opej2tl61cbPVoVotl0v6gVv04wGs39ObiTEREXj6+9lYLsZFk7QfaO9Ku3kTVoh8HeHVAKJJi++ntyGnkyEHeGZfWjwO8OyB2xxnbAxoq8mvRjwOO1QFWLh0HupClI39o/TjAqwPaVYPVY0n9KmIoatGPA8TJt6Gp71xz6XsNqE0/DijMN4u4aKhHAGPmAAAAAElFTkSuQmCC"}, {"id": 2, "name": "橘虎斑", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLklEQVR42u2YsQ4BQRCGf3KFB9CR6ES8iVat4DFodDwGhVrrTUR0EheNUqGQUMgkbG7N7R4R5v+6ze7e5Obf2X/uAEIIIYQQQggh36GUd2Gt2rw+jtPjthQT8F3PEcq/rkASumE/mwMA6oP+NSbgw/63vIA9BYTNpPE0Xq9TAEC7Xcscfwp7CpwO40IBi+7/fwXce1qjNdpl1oScfd+8Fi+vP5TNOfGyl7y8XbSMy+3UXVzoxJkKaDXgy2woopQP1oCmTKwSbuZ9mdZOguyz48Tyxnl9QuuFtMyLwr4eq7u4r7PbjVY6UwDAeTXMnA/tSt3MC+IXwM54DYQqEZv5UKemAj7czEtm8555M06cfDqAWwubyWuHDu1O7Srg3jralxn/ShTtRmO/mUMxVwM3TO+VugtrCWoAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB/klEQVR42u2bPU4DMRCFJygFDR1dkKBCUTqOwRUQBTTcIWno4BhwAlpuEqF0KxHRUFLQhcqCODvreP0THH9fE+2unJ19Vt7zjhwRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAog0EtDzo6Pl/9PV5+Lga7/J7a+K/6HzA1UDPD2hz0/elZRERObm9WgeNx0D3QnwQAEqAGB7V5ezhdO57PlyIiMpmMWo9TObqvA6N/XL1JACABSnLQvs5p+Pq4D7p/6HhTv9Hv6G6B/gnH23qPZ7JWPwkAJEAJDur6JWtdDhfjWdPqqMY5teuu+2l1/dbfSEkJVqr+5tPUa9dPAgAJUIKDbos2ztzHXhvbddn1amvtVH109M+rPwkAJEBNDurqimhOuTm+8XJse+2vPTf659WfBAASoCYH9UXrp79cD1vPh/bf0T+v/iQAkAD75KCu7oTdD86FyznRfzf6kwBAAuyTg8ZGc0Lf87UkWGn6kwBAAtTgoBqHl4+d179fp0VPMPqTAADpEqB0Bz27uJKufrd47s+3x6Veq5em/8a7jEw7dXPNg0t317sLCQAkQM0OqjmTb7fDHte3b1+ag8bW2/f/FaHzSAIACZDDWSXS/vfUTh9rH3xooqSeh9y6x9Yt1jySAADSc9dim4to53N/H/OwnW61604CQNX8AEwRSTsmE/FGAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABrklEQVR42u2aMU7DMBSGXxEDB2ArEhuqehPWngCOQRe2cgwYegduUlVslahYGBkYKpUFi2Ll1XbqxH7R902NUsd/1f9/dl4iAgAAAAAAAAAAAAAAADBkRrFfHF/e7A+Pt59vozYT5rpOqXlz6z/Dg2U5Tx3w/vwiIiJX93f7NhMejC/yg2vTTwKsJcCxXlz/O16ttiIiMp2OG49Ta2zXa0Nu/W11kwBrCfj6eDxpQm28c5Bz5mQunSQht/5TdZOA2hLg73M1JvPN0Zo6W+5+P20az8fW6FRHldafqpsE1JYA7R9zznK7A80RzlnaeTdeq6H+dVLXgL71cx8gA+sFhWpoai0P1eBczreqnwRYWwNCNTJ199HWyZpOa/pJgJU7YfePxe6zQ70Udz23X9ZqtdajmS3Tei+16icBVruhF7dPIiLy/frQeD62q+g7M3RHmutJVC36SYDVBIScFNtP953zVyN3vTwzLq2fBFhPgIbvnNgeUF/Or0U/CRhqArRaul4cv8Ms7fy+9ZMAqwnwdw1ajyX1rYi+qEU/CRAj74amPnNtS9drQG36SUBhfgDos2Cx7zWhlAAAAABJRU5ErkJggg=="}, {"id": 3, "name": "三花貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABKElEQVR42u2XvQ3CMBCFHxEFAyAaUCpEkxVoEGKLFLAEBQOwBhTswRQ0iIaIn4YB6EKBjKJTjH9IhCK/r4tyjnXv/HwXgBBCCCGEEELIf2jZBva7o7z4fH0cWz4bVvUdRdT0CrRdF1w2WwDAYDHPfTYsrK8kgfAqgPvyreS6BwB4pvuv4dPxrNYEouBuIaW8xLUS5+zGW6jUA/Ke1qEUH8YJAOCUlsd93meH0kro9rOtTHgeUErqkIqb4ugBXw/oMClvux89YFLKVWl59k1Km06CWhfOLKQy/tUjtsrLji87/TBO8kCnUUc6u4lXn3lKz6ySwD1QF7oOb9upWQHbqfXzT4y3JwYr/KR8eJ3YdSr17dCu02njKxBVqaCccxqVQOM8UBfBeeAFW3h9jaNsJPYAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACJklEQVR42u2aO04DMRRFXxBIQI1oQFSIhiVAgxC7SAGboKChYxtQsIsI0bAFGkRDxKdhAXShQI7Iyzj+xHYm43M6yHjGcy3f+2yPCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAe9Wl50Z+tg9P/vj++X3iLvUxtt1X+FoYGaWa3NQd9v70REZPfifDRnexy0A/qTAEAC1OCgY74u//pxsy0iIj/9x5mXnx6fZXX0UAdG/7R6kwBAAiyTg8Y6p431+5OZ7/HwNJh4j6PrqyT9fx0+i4jIxuYa+mfUX+u9v3c40X8SAIRzgICZZJxHE+pEb8PPoF2Ihpnc2F7vckzVwMo5zX3MfTX6d/Mepv82bP1y9R/9y+pPAgBrgJAZrB1nPEP7EjSDXc+LrTFt7cxztFNq59H91b+bmjTUwWP36dE/r/4kALAGiKkBbbhqOn1d6RrU1S9fzPN9ia390T+v/iQAsAaIqUFTzXDf5/k6qKsGTUXsbkwqPdA/jf4kAJAAXXJQ1+6EOQmctxY1/TQnmb41q6vmRv+y+pMAQAJ0yUFLk8sx0b+M/iQAkAA1OCigPwkA0LYEWDT6RFHvd0vkSWPqk8+uYFvLxI6Db3vb2oUEABIAB512ptDdDt0u9b59Wx00td6+X6e6rvMdRxIASIASziqZvn1J7fSpvoOfN1Fyj0Np3VPrlmocSQAAifxqsclFbP8vfT/GwU+32nUnAaBqfgHxqE64CfYRNgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABlUlEQVR42u2ZMU4DMRBFJxEFB0A0iagQTa5AE0W5RQq4BEUOwDWg4B6cggbREAWQEAdIFwqwtDtSyI5jY8/qvS5a7+6P8v+MxxEBAAAAAAAAAAAAAAAA6DODrgtHJxfb5ue3r+dBzAtTPafUe1PrH+LBshxZb1jf3YuIyPj6ahvzwsb9Rb5wbfpJgLcEyMfNjxNuT0VEZLN4/HP57HIeVWOz9YZM+mN1kwBvu6DgHI3VSa+r99YuIjz/ZfUkIiLnZ5Oku6Rc+gOxuklAbT1A73N3MV5+th2waF8PTtAO6VpTG44y1dbS+q26SYC3HhB+4V0E53Rdp52jr6fuAbXpJwFee8C+Ghi7/lDne9NPAryehlqdYq2d+7AmpFb9JMDLWZCeWA8lPC/slzV6YtWTqnU+qFU/CXB3Gmrk+GFqcmaoqRtdU5cTKfFPWm79JKDvCYidUFNPwrXqJwF9T4Du/muZ/p5Gigvn59ZPArxMwtZTxdgJM7fza9NPAgozTOmArucgNVJKPwnw2gNy8V89oBb9JKAw3+c/H8S0VfL2AAAAAElFTkSuQmCC"}, {"id": 4, "name": "賓士貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVR42u2YsRLBQBCGNxmPQGGEkkKp0um8Bh4Mr6HTqZQKyoRJwTucwtxMctzcZd0h7v+6S3K52f1v/9uECAAAAAAAAADAd4hsH+w0+6I4vtxOEWdBV++RxHVXoFF1wnm1JiKiZD4TnAUL850EEJ4Ckm6v/RMBxMG5kKvMZ2kOF3pZA6pPm5guh0REtFkcWPd169kqgxrY7belcdIaPPz+eixdH48mqAEvNfB00iqZr9oboQZsM8U9D+TeN2XatBPkvHB6IRnxuzVim3kLhUXY3aj0f9Xfuegyr9ZMuDXgSwlT5k3nARTwteeDOYk/roDO37ndae0VcBZAluZaz8ZfCRfdqKvvBW6P9LcK3AFS1HVEGjm1fAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACC0lEQVR42u2bMU7DMBiFXxFHgAFRGGFgYGDq1o1rALdggkuwAtfoxsbUkYGOQMVA71CGKhK1auLYjhPX37dUTeLYeZb/Z/9OJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyINBKQ96uHey/Pt/vpgNurxPafRV/x26Bkpmt7QI+vX0LEkaXl8tA8sTQbdAfxwAcIASIqjJ0fFBL+bETSMw+sfVGwcAHCCnCOobOStGd7dB9YeWr9pf6TdfzNC/xfKm3pLW2o8DgNgH8BtJQXx+fDfKQpj128qbWY66yHn5eCZJmty8bbzedr6q34atXXXtR/+0+uMAwBqgyQh2HaGu5231+c4xbeVs9dyfP6x+p6v/w/3TVbbk533tuonGitlO1zw9+rerPw4AOEDJEdTEbHes+lzn/uifVn8cAHCAkiPo6GKsPuXh0T+t/jgAiH2ADvLQSpS/7stz5NrubdcfBwDWAGqW380yguYO+rcDDgA4QMm8Tl/+Pe+bpYA89McBAAcoOYJWO6cy8ujmcTnm381ybc/Vc9PfXMvY+sHcd5Dj/oStP2xrFxwAxD6A/PO45shzHbmuI9n3/fm69tsihO8XT2a5unoUacc4tB9S6R5bt1j9iAMADhAjgjade7V1v1TftnZdT6huXekeW7dQfXEAAN8RuukNP9vx1PejH9x0K113HACK5hclDwkpWZ3PfAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABbklEQVR42u2YO47CQAyGDeIIbIF4lMsBtqLbo8DJ4Ch0VByALWFXFOwdQoEiJSNFxBPDjOH7Oshj/mj8e2yLAAAAAAAAAAAAAAAAALwyvbY3joefRfX33/9PL2ZBq/ekWtdaf58YTMtA+8DveiMiIpPVsohZsPJ8kg/OTT8O8OaAkuls9NBc/eizwVp/rG4c4K0Ksoqc0/FcqyLC94fXrSLUWn/oKK1uHJDbGRDWudoIaHtdkaNVuTW1fq1uHJCbA5p2LIyscqd3+23tvsnH/FYvXw61/xdf36rcHHsGPFs/fcC7ngGNnWIQOdp6vGv1400/DvA6DY2tp7XVhzbXe9OPA7zMgsKOtSuVCC4iZzWq/iBX/TjA6zS0rJ+71sdNs6B7ObXrjCgX/TjAqwOsIsm6E/amHwd4d4AYz+efFfm56McB7+aApvrYS+Rb68cBiTHbgNPx3HoOkiOp9OMAcTINtZq3W085vevHAYm5ApjPBqjujGfkAAAAAElFTkSuQmCC"}, {"id": 5, "name": "粉蝴蝶結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABL0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIqg//9B/7/7z/wn1g+uYBpqAcUI7EKpUXUUELr6ZtbjMTGBAMDA8O5c+cYGBgYGIyMjBgYGBgYZFrTSDJnNAZgMfBk/gJICCYm4FX/pHoWSkjD+AwqbBD6zi+IAwodRnYMsJCr8c6jq3jlf8DUpV9F4XPsPY0SMyO+FCI5Bn44m1JkIaX6h38MoJf3hEDKLogRc9z+kCWPyz5i64eRVw8QKn1U5LQZSFE34mtiivMAqfXDaB6gVmuU1JBGT/uEQppQSoDpGzk1MczHlOYRYkOeiFLs/8hujVIb4Ap59DwzcvPAQIU8ofpgNAYGKuRHY4DabSVyW6dDPgao5gEVOW2cZfaQ8MCgb41Sq79Abhtp2MYAAG2Cjew3f7TjAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACIElEQVR42u2bP0sDMRjG3xMVdXZTnIqLW8G9IPg5FETnzs7O7iLo5xCE7kK3LtJJ6uYHEBHOoUR60bSXf3dN8/stJW3Te/OEPE8vTUUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWhPJ2UJa3g7JuG9LUfw2pIWeKmCtYRKTo94o67djs7R5W3OL947WwGcdwOBQRkW63KyIi+zeXVp/ThoOiPwkAECYBUndQVf/k4XF6/fOzue+fXN9V6lRt6WxOH8dfgoOmrz8JAFmzbtthZgWXPitYtYt+r5WBj99Gc1//VO+7GlXaW88vlXH5OqKtA6O/m/4mvUkAIAFSclBX5/yt6+TYSzDf/qp+pd/2zgb6R+yv6905OKrUTwIACZCCgy5ayabdkkVcPE0luD/9dnrddD1TXTP1S0oJlqr+6lHVq9dPAgAJkIKD1sXUz3QdvS7lzMopTHX71ll3vx/94+pPAgAJkLOD2u6uuF5P/+5vGjf6N6s/CQAkQM4O2tQ4SbDl1J8EAOE0qMM+cFsscqBlHUeqda+6/iQAcA8gFvu7+i9qqThP6qB/HEgAyBoWALAAALgHyBT9VKbraU1Tv7Z3bVK5l3Gdh7r9TfcuJACQADjoX2ey3e3Q+4X+5XNZHTS03rb/r/CdRxIASIAmnFUinX0J7fShzsH7JkrseWha99C6hZpHEgBAHM90/Ocipueb/jzmoZ5uuetOAkDW/ADgaXUfe/HBjgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABnElEQVR42u2ZMUvEMBzF34mIH8BN6VRcuhXcD/wiuujs7Ox8u4t+EeF2odstcpOcmx/gcKlDydBA2iRNm/zJ+y1HaNo+yHv/Jv8DCCGEEEIIIYQQQgghhBBCPGk327bdbFvbca76T2iVuKxsJ15eXPdW++f3a2XrJABomgYAUNc1AODq5cHpOVNJVT8TIC0Bh7f3zgH3d4PzD8+vPaeoMcqz7nf/1wl4Wi+agNT0MwGROfW9cf+9G7x+VPMed73x+cdnz1kmp879bQit31c3EyAtAcfbm0kvNN2vHKScWRbVLEkIrX+qbiYgtQTo+2UTZVEN1tSx67Y12tVRsfW76mYCUkuAacV0Z5kcoZxj6xi9hurPcf0GLK0f7AVl+g3w3V+Pzfd1vlT9TACEdkN9a6Tr7sO11kvTzwRIOQmrFZtaY/Xnqf2yay12PR+kqp8JkNoNDYXuTNuautQ/aXPrZwJyT0Dok7A0/UxArgnI3flMQK4JGOtCpu780PqZgMgEW4CyqKz7ICkSSz8TACHd0FD99tBdTun6mYDI/ANf80ikyGTw5QAAAABJRU5ErkJggg=="}, {"id": 6, "name": "藍領結灰貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABWElEQVR42u2YMU7DUAyG/1Y9AhssXZjaM9AjMDBWqEhcAbGyIq4QiarKmIEjwBnaiaULDEi9QxiCUWvF+CVphcD/t0RPiWPFv/3sF4AQQgghhBBCyO/QS33w+Oi03F6/b157bRzu6z1C/68rMGhq8PY4BwCcXM3KNg637PfyAfEUEO4e7nfWq+USADAaj2vXhyKeAtnmo5PDrvb/XwG9T7u1cHNbWxOS+9Z9z19qf+iH68QXl9Mfdxcv4rI7FYucnbhWAa8GrMg27iNfSlmwBjxlRInn4TkAYLJ+qrXT93XkrUh7mSB2cTqxfLEVGYl0flatpy9olePyflHYmrGKRV7GnkavZ1XEMd/N/WxdXSdq34czlerIC9IvivA14CmRKSVSzwNWzqd2aipgoSP/XQuJOR+mEw8O7UDXwsiYpaRDN51O4yqgdx3vZMa/El2n0bZn5qaEq4FPJ2GdQK06EYIAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACGklEQVR42u2bMU4CQRSGH8YjaCWNjTZyBj0CJpbEQKJHILS0xiuQSEFpwRH0DFjZ0Ghhwh2w0EngZYdh2Jldhvm+huxuZvftP+H/d19mRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA0audzo2cnFcnX7e/HZqPM8ubGv+h8xNZAzx7k56NfLWEREmr3usuR4HPQA9CcBgATIwUE1w+ente2P2UxERK5arcLtWI7u68DoH1ZvEgBIgJQcdFfnNIwWP6WuX3a8qd/o99i7Rf+I47Xew/5grX4SAEiAFBzU9U+2dTmcTtofFDqqcU7bcdf1bHWt1C8pJViq+ptfU6+unwQAEiAFB90W2zhzHf1srOvS9dqetWP10dG/Wv1JACABcnJQV1fE5pR6/KunY+tnf9t9o3+1+pMAQALk5KCat/O2iIjczKfic/zuvlOoR9n+O/pXqz8JACTAITmoqzuh+8G6zsn133bnPazQLudE/3r0JwGABDgkB/VFO+No/r/fMc7mkLFWj6J/HP1JACABcnBQGw/d9sbjo/F0rycQ/YUvwgBqS4DUHbR5ermx3+27Pl+Pc/Xlc9Nfv8vodwzfeXDp7np3IQGABMjZQW3O5Nvt0ON8V3Wm6qCh9fb9vqLsPJIAQAJU4awSaP17bKcPtQ6+bKLEnoeqdQ+tW6h5JAEAZMdVi0UuYttf9fmYh+10y113EgCy5hey6n1+RCGvFwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABy0lEQVR42u2aPU7DQBCFJ4gj0EFDQ5WcgRyBA1AEiStEadMirmCJKHKZgiPAGUJFkwYKpNwhFNZIziiDdzfr3Z3wvsaynPW+yO/N/thEAAAAAAAAAAAAAAAAAAAAAJwyA9cfXl7c7Nrn39vPQUiHse6Tq9/Y+s/gwbyc+zb4elkQEdHVw2QX0mGrfZY/XJp+JMBaApj589Pe+cd6TUREw9Ho4Llvje17bIitP1Q3EmAtAdX256gOtfbsIHbmfDrrJQmx9R+rGwkoLQFynqvW0Onsz5q6WtbNUbnuWqN9HZVbv69uJKC0BGhPjJ3FswPNEews7Tq312qovI/vGJBaP9YB/20M6JoXd9VKbq/V1lDnW9WPBFgbA2SNfLu+IyKi8eb1YAfyupx9hDpZ02lNPxJgZSXMT0x7suyU+rY5v393ux/Pl7VarO3RrJa11/qgVP1IgNXd0MdJ4xha7NfOatMcx3LerMw+pDO7VqSx3kSVoh8JsJoA6aRKOMl1P106p1Ujk7wzzq0fCbCeANcVp+seUCrnl6IfCTjVBGi1dNixC5nb+an1IwFWEyBnDdo+uu9XEakoRT8SQEa+DfV95xpK32NAafqRgMz8AgLxdKrPGRYcAAAAAElFTkSuQmCC"}, {"id": 7, "name": "紅圍巾橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u2XPQ4BQRzF32622IZKR6ITV9GJE3AMGh130HAC0bmEA4hOQjQSCYrtVmNkTTAfOwjzft1mZ+a/+97+PxYghBBCCCGEEPIdAt2F5VItzV5v96vAJqDtOelplgJAUGjerQ9/3YHIdMNmPAEAVDrt1CZgZj9MlMdh9NAJ/xwQLAfVzyTpVWnmgOC86+cKaLtfVv5/HZDrtIp6b/0yJ1T3n8XT7Q+hd51YVX1UisvrbDs6c8BVf/A+ByLdNxdKHaex0wdQxVPt86cKmVYjgXCs2Eq0qo9ptfN3Go0bQwBAMu8aOWHqrFD6b3MgynuAygnx7d9YmCmv6gd0wJa8ytMB17OS7XTqrwNy1dH9D3CNv7PQu/AuBy4aEYvUjbY48wAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACGElEQVR42u2brU4DQRSF7xJETVE4mgCG1GJ4BxxBosDwCCTU4OAJMBhwOMKD8ACkrgkEQ0ICFbjFdAIMnc7uzs8yO99nGtrOzp0z5Zzd260IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkQZHLQtdWt8qffz+/jouYxyk/7ksRkaK/V+T4Qfuv+i/hAZAzy7k56NP1jYiIDI4OS8fxUqduebtyWgf6h9GfBAASIAcH1Xk8X49zkTWrU69bOXFdJ0d/P/pzDQDQJAHa/g8ebJ44HW/6ctbKeN35lX794zH6Bxyv9J7eXsq85CUBgARIwUGV8yjnG45k7jm03uWwMRxNFjqq7XXTfKa6vuufJJVgqeqvHlW9ev0kAJAAKThoVUzjTPPoden12s61m9ZZtU+P/mH1JwGABMjZQV27K1Xn08/9TetG/7j6kwBAAuTkoO93PS/CherDo39c/UkAIAG65KC2c92dh9/9YBtqvSv7n07z25wT/dvRnwQAEqBLDhoKX+voeoKlpj8JACRADg5qord7YXnHaSc2Gv1JAAD/CZC6g25sH8iifrfU7Kro40J3W1LT/8/dmbP6TLrZ9sGmu+3ahQQAEiBnBzU5U91uhz7O9RvdVBzUt951f1/huo8kAJAAMZxVAt374tvpfd0H75ooofchtu6+dfO1jyQAgDS8a3Gei5iej3089qGabrnrTgJA1nwB6DlIvmEnSqcAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABmUlEQVR42u2ZMU7DMBhGvyKGLjCxgcSGehU2xAngGHRhgzuwwAkQG5fgAIgNCcSChAQM3cLkqrJq7MRx4h/e26qS5JP43m/HlQAAAAAAAAAAAAAAAAD+MpPUP9zdOWhWP7++P026PLDrfZqvu0aSJltHgz63dP4NOjgum20veLm+kSTtnZ40XR64cr3aNEcfV72YUFt+DLBmgOPxYr9IIDdj3Wx1Tcltfun8fu7lIhvJjwHWDPh+O896YOh61yDXzNlca03Ipe/8sdy+CT4YUJsB/j43xGz+/OtMjX2fOqNDjUrdpw+dv21uDKjNgNB/zG9WqBGuOamN8Weof5+2b6xD588FA6yuAX3tr/tqvtX8GGBtDfi8nQ4SLNbkUE5r+TFARn4PiO1aQrjGbR8v1s7IUFNi9++6VtSWHwOsnoZODy8lSYv7s1ZNCs3C2PtA6qy3lh8DrBqQ2iQ3O5c8lH0TtpYfA6wbkLtPHqv5teTHgP9mQOwUsvbm950fA6wa4O8ahj5Hz6WW/Bggo2dBpSi9BtSWHwNG5gdbnDs5x4WAOQAAAABJRU5ErkJggg=="}, {"id": 8, "name": "黑貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA70lEQVR42u2Yyw3CMBBExxF0wAXxOdID3UAHlEIH0A09cExAudABh3CyFEWs/NEKY+28WxQ71u541usAhBBCCCGEEELK4GIHrha7Yfz8fN1dzoJa3/E0tSswS53wuFwBAOvjYchZcDRfJQB7Cng22+VfBNCYq0Jame/anlXoqwemdTrE7fwGAOxP86z30nqxytAD0t6OHWfeAy7VA9pVSIIeCCmTq8Q081KmQzvBz7PTC/mIU8+J1D2ecOIPtrtRbaTMS9XKngdKZT50HlCBUpmnAtp36dzutHoF1ALo2j7YYfKvhKYHpGz/WoXqFfgA4mJsoP9r9FoAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABv0lEQVR42u3avVHDMBgGYIWDDWg4fkp2YBvYgJaKFdgAtmGHlECOJhtQmILzHTERkf8Ux3qeDhJZzuvz99myQwAAAAAAAAAAAAAAAADgMCxK+aHnp9fV779X6+Vin9spzVTzP3JoKNlxaRX04/klhBDCxd1t1XO8CjqD/HUAdIASKmjT5dXZJK6J21Zg+Q+btw6ADnBIFbRr5azdPD70mr/v+Hr/6/xW66X8RxzfzDuEsLH/OgDBc4BuZ1Iv72+frVYhmvPHxjdXOXZVztenr5/Kcn+y9fuxz+v5Y2L7tWv/5Z83fx0A9wBtzuDUMzT189h8Xa8xY+Ni88QqS10pYvs91jq6/PPmrwOgA5RcQfuurqTOl3rtL/+8+esA6AAlV9CpPQeRf978dQB0gDlV0IRr3Wof86euu8s/b/46ADrAnCroXMl/HDoARXMC4AQA9wCFar5V2FzvDi1XVWLb4/97ma7HIXV87N5FB0AHUEH/VqYOqx0b44Zet59qBR0679S3UxO+l3QcdQB0gEyVNeR4wtm30g/1HvwAHWXU45A796FzG+o46gAQOr61uK2KxP6fe3uOQ1pupeeuA1C0b6JKzs4eUJO3AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABQklEQVR42u2ZTQ6CMBCFi/EIbow/S8+lJ9NzuQQNG++AKxJs0tipA+3Y79sZhD7De9Pp6BwAAAAAAAAAAAAAAADAP9PEfnG3OQ3Tz8/XvUlZUOs5udbV1r/Cg3lZS294XG/OOef2l/OQsuDk/iw/uDT9JMBaAkYOx+2stXruvUFbf6puEmCtC9JyTtf2H12E/3z/upZDtfX7iZLqJgGl7QF+nyt1QOx1QY0W1dbc+qW6SUBpCQi9Md9ZIUeMzol1TKg2p+4BS+vnHFDrHqDVX2s536p+EmB1GppaI6Xdh7TWW9NPAqzMgvwT669MHDwk1mLR+aBU/STA6jRUi9As6FtNXeqftLn1k4DaE6B9EramnwTUmoDanU8Cak3Atylk6c7X1k8CMqP2Arq2j56DlEgu/STA6h4QcouVFJSinwRk5g0bOfKkxHI8IAAAAABJRU5ErkJggg=="}, {"id": 9, "name": "小花白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABF0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIag//9B/7/7z/wn9rmMg31gGEhVqG0iBpK6D19c4uR2JBnYGBgYAjugvAZIHyZ1jSSzBmNARh4Mn8BAwMDA4NMYgJR6RkW0k8YZkEEVNhG8wBFMQADdx5dJUn9DyjNsff0aAxQFAM/nE0pspBS/cM/BtDLe0JARU4bb54gJI/LPmLrhyEfA4yk1sSESh9CIY6ubrQmpjQPUFo/jOYBckOK1JBGT/uEQppQSoDpGzk1MczHlOYRYkOeiFLs/8hujVIb4Ap59DwzcvPAQIU8ofpgNAYGKuRHY4DabSVyW6dDPgao5gEVOW2cZfaQ8MCgb41Sq79Abhtp2MYAAH6yd/AwY4/vAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+UlEQVR42u2bMU7DMBiF/yBAwMxG1Sli6cxeiSNwAVjYOQQLS3cWuAhS984siAm1GwdgC0Mwogbj2HGcOP6+JWpaJ3+elfdixxUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYKdViWVWLZYUS49J/B2khZ3Zj3sEiIsXNvOjjQk+OT7fcY/P+UrjULRd39WepP09ur52OMwQHRX8SAMAvAcbioOuHRxERmVxdNnqeVHWu5b7eUe4LDjoe/UkAIAFycFCd17dnp99/fG0PnlZBHd3VgdF/FVRvEgBIgJQc1Nc5v+s4P2t1/rbtVf1Kv8OjPfTvsL2udzmdbdVPAgAJkIKD2u5k02yJjXI6+9dRbd+bzmeq60f9klKCpaq/2qp69fpJACABUnDQppjamc6j16XXa3vWDj2Pjv5x9ScBgATI2UHbzq40PZ/+7G+6bvSPqz8JACRAzg4a6zpJsGHqTwJA1hS+88B9YXOgoV5HqnWPXX8SABgDiMP8rv5GLRXnSR307wYSALKGGwC4AQAYA2SKvirTd7WmqV3fszapjGV8+6Fpe9PYhQQAEgAH/e1MrrMdervQbz6H6qCh9Xb9f0XbfiQBgASI4azS0dqX0E4fah1820Tpuh9i6x5at1D9SAIAiOeajr9cxLQ/9vHoh2a65a47CQBZ8wkAOy2TEJ1VTgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABhklEQVR42u2ZMU7DMBSGX1FVcQA2qkwRS2ZOwBG4ACzchIWlO0u5CFJ3ZhbEVJWNA3QLQ+qhlkLt5KX2k79vqdKmzl/5/5/tVxEAAAAAAAAAAAAAAAAl2tWmbVebFv3HXGCNtMxDb7y+ujma/Z/fr1moc0RE5P6lu5buevn8FDXOWHLVTwKsJMCxW7+JiMjy8SGoHjqn7OS1e6NeJP3BueknAdYS4Pjefkbdvz+8Xr5/BNXqqdcGbf1DdZMAawnY392OemDf952DnDPrqpkkCdr6x+omAbklwN8v91FXzb819dTnoTU61lGp9cfqJgG5JaBvxnxn9TnCOSfUMX4N9ceJXQPOrZ9zQKlrgNb+Wsv5VvWTgMTMhjpraI2M3X3E1npr+kmAlZOwm7GxNdYfz+2XY2tx7PkgV/0kwGo3VAvfmaE19Vz/pE2tnwSUngDtk7A1/SSg1ASU7nwSUGoCTnUhc3e+tn4SkBi1CairJrgPkiOp9JMAMdIN1eq3a3c5resnAYn5A2rCHKbzpagLAAAAAElFTkSuQmCC"}, {"id": 10, "name": "灰白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCklEQVR42u2YQQ6CQAxFi/EIupK1XscjYOIVCFu2xiuYyBG8jq5xYeQOuDCTwCTYocNEnf63G6A000+nLUQAAAAAAAAAAL5D4vrgarFuu+t7c0skDqd6j2H27wrMxxrU54qIiNJd1kocduwn2YA+BQzl8fATG9CnwKl5eDn0tY9fAfucZnMhLz7mBHd/yJ9rfYhPgaGdD0Wqfl5763S56V3fZ9v3t19dyCfSyAHnSmspMrY3UpcD4m5UWonNqSTNOdtOTyU2O/bNEdfIcwqXedHq7ka58106qdmRt3NGbw6EUoKLPFcPoECob15vNxoabm4Y253qVcA+dbjJC38lfLvRqeYFaY8UrQIvMnh5AuTL9aYAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB20lEQVR42u3bT04CMRzF8WI8gq5krdfRG2CiRyBs2RqvYCJH8Dq6xoWRO+DCTAKNdRjmD5R+vhsyQ0rb1/De9DczIQAAAAAAAAAAAAAAAAAAAAAAAAAA8mBUykSvLq7Xm8efq4/RIX+nNI5V/zNLg5I5L81Bl6+LEEII4/vJumV7DnoC+ksASIASHDRm/vx0FNfETR2Y/t3qLQEgAXJy0H2ds+Jl9dWq/7btq/FX+j3e39G/x/ax3vPpbGv8EgASIAcHrfsnp6octU46nf3rqHXfp/pLjWtj/CGnBMtV/+qzGm88fgkACZCDg+5Kql2qn+X3+9bx+PJm6/zD5PbXORdvoctx7lqnp3+/+ksASICSHbRuPl31F1/7p+ZN/2H1lwCQACU7aMoZD1WHp/+w+ksABO8D7FEHPhR1DnSs88h13KeuvwSAPUBoUN+N76jl4jy5Q/9+kACQACVT1clT7FulQB76SwBIgJIdtLpzmqp3N61Lx+36vlbPTf94LxPvMZquQ53udXsXCQAJULKDppypabUjbtf2jm4uDtq13k3fr2i7jhIAEmAIZw09PfvStdN39Rx820Tpex2G1r1r3bpaRwkAhD2f6fjLRVLnh/4967CbbqXrLgFQND8AdhD50JieLgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABeUlEQVR42u2aMW4CMRBFhyhHgCrU4TocASSugGhpo1whEhwh1wk1FAjuAEVkCSw52bFnY094r0Psrj/a/2fHs4gAAAAAAAAAAAAAAAAA/GcGXQ98Gb5ebj8fzrtBzoJW16m1rrX+JzxYl2ftCfvNVkRExvPZJWfBm/Or/ODW9JMAbwkIrN/feq3VfT8brPXn6iYB3hLwcT4WLZg6PzgoOHO9XPWSBGv9pbpJQGsJiPvcZA1drn6sqb9937VGax1VW79WNwloLQGpOxY7K9zpxWx6d9x4NPnul09f97Vz+9mp9scO1D4D/lo/+4BHfQYkd4qRc7T9eK7zveonAeJ0Gpq7k9R2H9pa700/CfCyEw53rLTGxtcL/bJ2VqPdH7SqnwR4nYaG/rm0P46d2bWmls6IWtFPArwmwMpJ1jthb/pJgPcESOEbpFrOb0U/CXi0BKT6Yy/Ot9ZPArwmIO4aggP6+reENa3oJwHiZBpqNW+3nnJ6108CKnMFW3UaH1NI6cEAAAAASUVORK5CYII="}, {"id": 11, "name": "紅領結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR42u2XLw7CMBTGvxFOQFBAphbMNCdAYRA7AZwMTjCBQXECNIagCKAIlgmSoZosDVu7tmSMfj+3tK/N+17fnwGEEEIIIYQQQpoh0N047I/z4vf1fgxMLnR1jqDT9gh06xpcVmsAwGi5yE0uLNg7ccC/CAhO54OZ4W7v1AH/IpBNJ1YX2tr/fwTkOq0iCuPKnFCtl92n2x863nViVfVRKS7vYye2zQHb/sAcMFVKKP1IEgBAL00/2snr4u2rlFa9BGHnTycWHpcpI5QebDcAgNtsrnWeRbXL/Z5GBfLbz56vypyo22fknPE3B76FSnlVP2AEmlKeEXA9K5lOp62PgDMHojAurdmtcODnp1FX/wu6M5c3EXgDteh6YGh6HO0AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB6ElEQVR42u3bP07DMBTH8VcEA4wVE6BOFUtnTsDEwtATwMngBB1YmDhBZ5aKCVEmxEoHpDJFKg8cx3/ixPH3s1RQuXGfxfulxhUBAAAAAAAAAAAAAAAAAAAAAAAAAORhVMobPT0+3+7+vP5Yjbp8ndL0tf57LA1Ktl9aB327uxcRkbPbm23geDroAOpPAoAEKKGDai+vz34Dn5ZRO7prB6b+y6j1JgFAAuTUQX07Z2VzeRF0/dDx1fyr+h0eHVD/Fsfrek8ns1/zJwFAAuTQQW1/yaZdDpvpZFbbUW3Pm65nmtfO/CWnBMu1/tVjNV89fxIAJEAOHbQp0zjTdfS89Hxt99qx99Gpf9r6kwAgAUruoKG7K02vp+/9Te+b+qetPwkAEqDkDvo5n4uIyHixEJfnvffhSbBe1Z8EAAkwpA5qu9fV+8F6niePDyIi8n51HfX6ts5J/bupPwkAEmBIHdSV7oybr+/ajtoV6t8OEgAkQAkddKioPwkAdJcAudOnMn1Pa5rGpd5t6bua05le69B0vOmzCwkAEoAO+rczue526HGh/9HNpYPGrrfr9ytC15EEAAmQorNKS2dfYnf6WOfgQxOl7XVIXffYdYu1jiQAIJ6nFv/rIqbfp3491qFZ3UqvOwmAov0AOBpBSdB2elQAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABf0lEQVR42u2ZMU7EMBBF/yJOgKhYlCqiSc0JqGi22BPAyeAEW9BQcQJqGkSFFipETbdUllYWJnYywTZ5r1tlbf/I88czjgQAAAAAAAAAAAAAAADwn1nE/nF5fLbb//328bwYsqDVPLnWtdZ/QAzm5TB1wPbmVpJ0en21G7Lg3vgsL1yafhxQmwMcL69PwwY+PEbl2KnPBmv9Q3XjgNoc8HVxPmrB0HgXQS4y26abxAnW+sfqxgGlOcCvc0O0TfdrTu17HpujUyMqt/5U3TigNAeEdsyPrFBEuMiJjRg/h/rzpJ4Bf62fPmCuZ4BVfW0V+bXqxwGq9DbU7fznei1JOtpsfhznP0+tPlJzfW36cUAtnbDbsVCOdZFycn8nSXq/XEXN5+rl1Fyc2h+Uqh8H1HIG9NXtsYSqhL5+YOwZUKp+HFDr9wAZf6u17gdq0Y8D5uqAuUc+DpirA/puIUuPfGv9OCAzZhvQNl30PUiJ5NKPA2rthKdi6jOgNP04IDPfV0ceotIRB+wAAAAASUVORK5CYII="}, {"id": 12, "name": "鈴鐺黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABB0lEQVR42u2YTQrCMBCFJ8XewI34s9QLiOA5vEC9gUfxBvY2gngBXbZKQVy5dRE3Boo0TBJGa8n7dqVNh3kvM5mWCAAAAAAAAABAOyjXB4f9qa5fX+9nFRJQ6j2GpOsO9HwXXHY5ERGN1pkOCVhbL5JAfA4YxpPBXySQRNeFpJQviwpdqLEGPvs0x377JCKi5SYNum+L5+oMasC2t12fi74GlG8NSHchG6gBzpnDfBYUcHE8OSnN7QSzLp5ZyGRslFndHs19P3/3/SwN2uMeJ76Oexq1wSnve87YulV8NfAtOOW58wAOtKU8HJD+lg6dTjvvgFgCZVGxEyb+SkjWgE3tX7vQeQdesmxybdL+7foAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB6klEQVR42u3aMU7jQBjF8S8raKlWSAjYcu+w58gF4Aa0VFyBG8AFOMfegZJdhISoaClCAZaIySgTe2xw5vfvEns84zfye+PPEwEAAAAAAAAAAAAAAAAAAAAAAAAAmAazWm708Ofvxcff90+3s6+8Tm18V/1/mBrUzE5tDvr/6joiIo5OTxY923PQLdBfAkAC1OCgbY5/HXyLNfGmDkz/snpLAEiAKTloV+ds+HNx3qv/vu2b8Tf63T/d0n/A9m29I2Jp/BIA4TtAtyepF//uHjaqQrT7T7VvVznWOeffy5c3ZznbXXl+6njTf4rUuNaNn/7j6i8B4B1gkyc49wnNPZ7qr+saM9Uu1U/KWRqnSI17qDo6/cfVXwJAAtTsoH2rK7n95a796T+u/hIAEqBGB73Z3+t0f/PH50Hr8PQfV38JAAmwTQ6asdZdRETMU1WV6/eqyclu0f5z6+70H1d/CQAJsE0O2pfS464twaamvwSABKjBQWuB/hIA+LoEmBrtXYXtendsWH9PXQ+r32XW6bZuHnLbp95dJAAkAAf97Ewdqh1L7fp+0Z2Kg5bWO3d3asZ5WfMoASABRnLWGGLvS2mnL7UPvkCiDDoPY+teWrdS8ygBgOi4a3GVi6T+H/t65iFPt9p1lwComldMGulEPzpPBwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABaElEQVR42u2YTWoCQRCFS9EbZCMxLpMLhIDnyAXMyeJtBPECZqkJgrjKNovJSjBNmulqauwu5/t2Mj/9ZN6rri4RAAAAAAAAAAAAAAAAgFtmkHrj/d1jc/n76/QxyFnQ6j2l1rXWP8SDZRlpH/h8X4qIyPRt0eQsePF8kT9cm34S4C0BZx5mk05rddd7g7X+XN0kwFsXZOWc/e7wp4sI3x9et3Kotf4wUVrdJKC2PSDsc7UOSL2uqNGq2lpav1Y3CagtAbEvFjor5oizc1IdE6vNuXvAtfVzDujrHmDVX1s536t+EuB1Grp+fspa8GWzVXUf2lrvTT8J8DILCk+sr8fvf+9bLX9ERGS+GKc6uMmsxarzQa36SYDXaWiMNue0OTO1pnY1Lb22fhJwawmwmlJaT0Nr1U8C+pqAvjufBPQ1AW1TyNqdb62fBBTG7APsd4fkOUiNlNJPArzuATG3eElBLfpJQGF+AV9K/j4Xl8IUAAAAAElFTkSuQmCC"}, {"id": 13, "name": "暹羅貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFklEQVR42u2XsQoCMRBE58RO7OzsbbTUUgT/Q0SwsvNL7KwEEf9DEEsttbG3sxNrrRZ0uSW5EDkk87qDS0JmspMNQAghhBBCCCGkHDLfH5uN1uvz+3a/ZiELxppHqPy7A9WiAwadOgBgf/5Wsvj4R5QNpOeAcDmugsbNJvOoG6gkl0KhymvavSlTKLcGdE67zvJzdAIAbIaH3P/Guz4AoLbtAgCW64XXer7OsAZ0qki+S94LWnnWgOWAqwasFLLyXSuvHbBgDbicCb0PtPKW0q6TIOPS6YVkx773hO98lvI6xTTSDafbjcbGUt56N6RXA2Up77oP6EBZytOBWG9p6aGKKp9eL+R7dl3vgNhv5HQd+BXJOfAGTuOAImVonuUAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACGUlEQVR42u2bsU7DMBRFXxFbxcbGzlJGOiIk/gOhSp269UvYmJAQqsRnICpGGGFhZ2OrmGFAlohby/az4zT1OVurOHZu9O5NXhIRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADoB4NaDvTo8Pjn/+/Pr49Bl/upjW3Vf49TAzWzX5uDnp8ciIjI8q25jvjxKxx0B/QnAYAEqMFBbd5fblXjZpN5VkePdWD0n2fVmwQAEqBPDqp1TsPN3XXS/Gb8aDxNWr9x4ocn9G9Tf1tvk5xm/SQACM8BIipJ6zw2poJDnWS9klcbx9tdDpdzGif8vnwVEZH7i+eN2189nomIyHBxGuVArnX51o/+ZfUnAYB7gJgKtq8ltRXsm097jekaZ89j1jGb/K1rtpCGMxinGHquXXP30dG/rP4kAJAANTro+nHMG+sO7VqEzhd67Y/+ZfUnAYAukOYuPrS/7Krg2D66tnvSVhdFlP133/rRv6z+JACQALvkoNt6HLF9d/Qvoz8JAEIXSML7u6PxtJMKTnWevoP+7UACQNVQAEABAHAPUCl2P1z7xZRrXFddm77cy/h08z2vcG0X+tyCBADhOYDo+7h25YVWbmgl2/+ndiF877Vrv3iyx6W+/1/qPJTSPbduuc4jCQAkQA4H1b4zknt/pb5t7XqeVN260j23bqn6kgAA2grd9Oai6//S++M8hOlWu+4kAFTNL9CtQ2bCkv0GAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABdUlEQVR42u2aMU4DMRBFJ4iWjo4+TWhTcxakVHScJF2qSJyFmjY09HR0HAAqS2Sk0XqMvfZk3+uijb0/0v/j2dmIAAAAAAAAAAAAAAAAAFwyq9wv3t2uf/5+/vz6WJXcsNY+ve5bW/8VHuzLtXfBw/2NiIi8ns6d4F//3eUHj6afBERLQOL97Vi07unxOavGtj4bausv1U0ConVBpc7RbLa7sy5C76+v1+qCauvXifLqJgGjnQG6z/U6wLqeuofDy95Vozfbnau29tbv1U0Cop8BuitI/XFyTEI7J9eBrc+A3vpJwGgJmKqhVhdh9cdWzUwOqe38aPpJQNRpaGk/7e0+LLwJGVU/CYgyC9JPrP8l7Zf6ZTGmjhZpmpmbhFH1k4Co09BaaGdq51hz97nepLXWTwKWnoAp54zi9Fb6ScBSE7B055OApSbAmkZGcX5t/SRAgsyCcmvf1BxdMt8R96rdc+snAVET0PrJcq7/iPbWTwI68wv/eyRFISPt5QAAAABJRU5ErkJggg=="}, {"id": 14, "name": "藍圍巾虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNElEQVR42u2YsQ7BUBSG/0ofwGDDamLwLsam4SHEahWvICFi9C4kNZkZJB36BgycpJpe59I2wv2/7aa9PXr+859zCyCEEEIIIYQQ8h082xubjc41vT7HR++TgGU9R6j9ugL+uxtOyxUAoDUaXj8JmNpfygu4p4Awnc+e1ocoAgB0e73cdVW4p8AivhQKWHT//yuQ7dOqF8aTXE9I7Zuua/Fs50PNuUk8CIOX3UXLuHSn7XrDSZyrgOYBU2bfniMPpUw44wHf9s1FmU3SL/UHaPG0fe50oWxmNC9It9m3QwBAUN891b6WeXm+6YwlXczd06iGZGyf3Nead0zKSqa3/+qByhSQWg0yA3tqWfO2k5oKaB7IKmJb8+5O4qq8IIp0DfNDmw9UoOiXGf+VKPssVBXOeeAG3jiShO0MwLMAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACAElEQVR42u2bPU4DMRCFJ4gDUNBBTUUKLkGPRBkhUnCEKG0aCsQVkKCg5C4UoaIFCqQU3GCpLGWHNV6vfxLH39dEm8jr2WflPceaiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQBmMannQo8OTZv36a/U+2uR9amNb9d9jaaBm9mtz0M/HJxEROZ5eN4HjcdAd0J8EABKgBgfVLO7vWtdvy6WIiJyOx53XqRzd14HRP67eJACQACU56FDnNDysvoPmDx1v6jf63Uwv0D/heK33YjZv1U8CAAlQgoO6vsm2Uw6nk87mnY5qnNP2uWs+W11r9UtJCVaq/ubV1KvrJwGABCjBQftiG2fm0XtjXZeu17bXTnWOjv559ScBgASoyUFdpyI2p9TjXzwdW+/9bc+N/nn1JwGABKjJQZ9/zqIId3k16dQj9Pwd/fPqTwIACbBLDuo8nbg9b/o4pcE87+TgtV3nh9/8LudE/83oTwIACbBLDpoK/Rw2h0zVPYr+afQnAYAEqMFBh6Kds1TQnwQAyJ8A2+6guitzaLembVzfvXot+v/TnTloHfqOt/12IQGABMBB/zqT72mHHufb1Vmqg8bW2/f/FaHrSAIACZDDWSVS/3tqp4/VBx+aKKnXIbfusXWLtY4kAIAM7FrschHb+7nvxzr006123UkAqJpfovBsOvCJiTIAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABpElEQVR42u2aO04DMRCGJ4gDUNABLVVScJ8IwSGitNsiroAEQim5C5GSihoKpBS5QSiikcIqg9f78IvvayJr4/Uf7fwz3nFEAAAAAAAAAAAAAAAAAEpm1PSLF+fXu8Px1+Zj1GbBvu4Ta92+9Z8Qg3E59Z3w+fwiIiKX93e7NgsezI/yg1PTjwNyc4BSPT78Gq9XKxERGU8mR8e+OXbo2tC3/ra6cUBuDnjafHda0JqvEaSRWc3mgzihb/1ddeOA1BxQ3+eaOXQ2/zOnvr0u9p/G9aY52jeiYuv31Y0DUnOA9cQ0snR3YEWERpZ1XedbObR+H98aEFo/7wH/rQa49sWuXKnzrdzaNvJz1Y8DcqsBi+2NxOheNtWZm34cIJmcB7h2LdZuYXl1KyIi07P3oznSihS9v9Wj0X26b61ITT8OyLUb6kKf+HK7H1u5tx5JrjfSUCdpofTjgFIdoLluWtt2V46c3DXH56YfB5ReA3x7QLEjP7R+HFCqA6yz1rGjCxk78kPrxwGlOMDqo/v+KyIWsfTjAMm0FzQUQ9eA1PTjgMj8AINEVNF9AU1QAAAAAElFTkSuQmCC"}, {"id": 15, "name": "橘白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAAzfa5AeFB0ZeDHx5Xk+RhZTqH/4xgF5OEwIaVQ/x5glC8rjsI7Z+GH4xgMvnuELqyeubKHwZUXUU8Sep0LQ/242BkpAezQNE17RoMUJq22jE5QGyW6Pk1sSwUoncPIeub+TUxDAfU5pHiA15QjGsUcXwf2S3RnlSd+Et38ntqaGHPHqeGbl5gFYxQSjkCdUHozFAqzQ/clujtAaE+g2ktk5HbgyglzqEel6joxKUtkap1V8gt400bGMAABNdd+M82mgGAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB4klEQVR42u2bMU7DMBSGXxEjbDBRiQ16kp4DhnKILmxcggHOwUmgW6UgBhjZy4IFMThOYjvJ6/u+pUoix/Zv9f+Tl0QEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0MLMy0bOTi93v7dePzWzM81hjqvofsDRgmUNrDlo9PIqIyPz6apfYHgfdA/1JACABLDioz/Pd+SSuibs6MPrn1ZsEABJAk4P2dU7H59ttUv+p7d34nX7HNxv0L9je13uxltr4SQAgATQ4aOyfHKpyxFist42OGjse6i80rp/xb0VTgmnV3/268frjJwGABNDgoG0JtQv1U72/1Lbnp5e1/dXq2znvl5JznG3r9OhfVn8SAEgAyw4am0+u/vxr/9C80X9Y/UkAIAEsO2jIGceqw6P/sPqTACB8D9CjDjwWMQea6jy0jnvf9ScBgHsA6VDf9Z+oaXEe7aB/GUgAIAEsc7R6ajzet0oBOvQnAYAEsOyg7smpBOrd0rEu7bcrfa2uTf8/9zKybNQttg4x3WP3LiQAkACWHTTkTF2rHX671Ce6Whw0t95dv69IXUcSAEiAIZxVCr37ktvpc70Hn5oopddhaN1z65ZrHUkAAOn5Tsd/LhLaP/T5WId2ulnXnQQA03wBGJUElo/hXfQAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABfElEQVR42u2asU4CQRCGB0NJiZUkdMiT+Bxa+BI0dryEhT4HTyJ0JhoLLO2xMJvAJis3u3PsDnxfR7i7/cn9/9zsHCIAAAAAAAAAAAAAAAAA58yg64E349lu//Pn92aQs6DVdWqta63/Cg/WZag94ePlVUREJg/3u5wF986v8oNb008CvCUg8Lac9lqr+342WOvP1U0CvCXg5+upaMHU+cFBwZnzhfSSBGv9pbpJQGsJiPvcFPPF+7819dj3XWu01lG19Wt1k4DWEpC6Y7Gzwp0ePa4Ojptc3/71y9v1Ye18vutU+2MHap8Bp9bPPuBSnwHJnWLkHG0/nut8r/pJgDidhubuJLXdh7bWe9NPArzshMMdK62x8fVCv6yd1Wj3B63qJwFep6Ghfy7tj2Nndq2ppTOiVvSTAK8JsHKS9U7Ym34S4D0BUvgGqZbzW9FPAi4tAan+2IvzrfWTAK8JiLuG4IC+/i1hTSv6SYA4mYZazdutp5ze9ZOAyvwCSbQSX/vTRz0AAAAASUVORK5CYII="}, {"id": 16, "name": "黑白貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2YPQ6CQBCFB6I30MKIlnoAKwsTjqI38CjeQI9iY6g4gJaisdAbWGCx2YSsTliWxb95Xwfssux7zA8QAQAAAAAAAAD4DIHtwH5nlBePz7dD4LKgr/towl93oFV1wmm9ISKiaDHPXRYszPeyAXkOaAbD3ldsIBSXhXwpnx0vyEIvY8DM02UkqzsREU2Xbafr3Hq2zvyfA9zOWWdmO6V0qg6j7ljl++veGBhTHaURA9aV9kn5ar2RuBhw7kZd64HO/84xZ8yT0wvpHdeNEVvlLRzOZXejSbpVFXYSe3kQTnkzZuTGQFNOlClfVg/gQFPvvNxutGm4/O76hSbXATPraAXf/bdCrgNcheTOwwGGB0aGdHpmMHycAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB90lEQVR42u2aPU7DQBCFJwhuAEVEoIQDUKVAylHgBrRUXIEbwFFoUKocgJRAlILcgCIU1kpkyeL1/sWb+b7OsTc7fiu/Z48tAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdTDQcqKnxxfr39uL1Xywy//RRl/1P2BpQDOH2hz08+lZRERGtzfryPE46B7oTwIACaDBQW3Ozoe9uCfu6sDon1ZvEgBIgJocNNQ5DeOH+6j5Y8eb+o1+i9Uc/TOOt/UWkY36SQAQ3gOEXUlRfLwvO3Uh7Pld4+0uR5tzTh+/G2e5O9p6vGu/md+Fq662+tG/rP4kAPAM0OUK9r1Cffe75gu9x3SNc57X9WtT56zZHJ1cNt2SrzfrwImkrNO3T4/+efUnAYAE0OygNn/rTjOf770/+pfVnwQAEkCzg46vJtKnPjz6l9WfBADhPcAO+tBSqH/dl/Oote59158EAJ4BpFt/t0oHrR30zwMJACSAZqazl3/3h3YpoA79SQAgATQ7qHlzKo5+t3TsS9vjct+r16a//Sxj6nPp1rYObbq3PbuQAEACaHZQlzMFdDs2xsW+0a3FQVPr7ft1qsdxXutIAgAJUMhZJce3L6mdPtV38AkSJes6lNY9tW6p1pEEAJDAbzq2uYjr99L/xzr46aZddxIAVPMDud/oD8LSbDoAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABcUlEQVR42u2aPW7CQBCF1yhHCAXCpIQDUKXjKOFkyVHoUuUAScmPUoQ7mCKyZK+0imd37N0J39eB/x7yvN03I5wDAAAAAAAAAAAAAAAA+M9UQ09cPq6b7ufL9auKeaDWfXI9V1v/jBrMy4P0gvPrm3POuXr/0sQ8sHN9lh9cmn4cYM0BLaunxahr9dh7g7b+WN04wFoK0qqc0/G7lyL8+/vHtSpUW7/vKKluHFDaHuDnXGkFDD0uWKNFa2tu/VLdOKA0B4TemF9Z7Zt+/zj0zqvnm9+8/PPZ+/55uxOtzbF7wNT66QPudQ8Idope5UjzeGr6saYfB1idhsbmaWn6kK711vTjACuzIL9jTaVTwU3krEbUH5SqHwdYnYa2+Tk1H4dmQX+tqakzolL04wCrDtCqJO1O2Jp+HGDdAU55Pj9V5ZeiHwfcmwNC+dhK5WvrxwFWHeCnhrYCxvq3hDal6McBVh0Q6vCGTgNzU4p+HJCZG6opBgU7/7iyAAAAAElFTkSuQmCC"}, {"id": 17, "name": "藍花白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR42u2XOw6CQBiEB+MR7DRURAtqT2Bp4xH0JHAQEz2CF7Aj8QQWGiujnYmthcla4BaQ4D4NIvM1BNhlszP7PwAIIYQQQggh5MskmRBJJoTv73aaLkxXd2C/Nyyod70dA13lASANp/mD9/1yNjL6Dh2QXFZrAMBgMdc6z1JpbA4AgPS+y58zBiwdkJzOe8MZz/yyZRZyc+AxGTst6Dr//x0o53sVURh/jAnV+6r1dOtD4x0ITCuxKvuoFC+PYyV2jQHX+sAYsFXKvBIXz75KadVJkPPaU4nljl1jRFd5jSwm2t2N+qZK+XLMtDcG6lJeVQ/oQF3K0wHfvZJtd9p4B7xtIArjypzdiA38fDfq63/Btkf6Wwde5Ml52Ki6iJYAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+0lEQVR42u2bMU7DMBiF/yAYYO4GylTB0JmtGyMLR4CTtNwDCY7ABdgq9QQMICYEGxIrA1IYgiVqMIkdx4nt71uipnL951l5L3ZcEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgERZrKpqsaoqlEhL/y2khZzZDnkHi4hczotiiAvdnxxuuMfr22NhU/eyPK1PfH++Ojuy+p0xOCj6kwAAbgmQioO+XN+IiMjBxXmr50lVp9w+iIjI8n1dn8dBk9CfBAASIAcH1Xl6vrds8Vkf7vw6uq0Do79fvUkAIAFiclBX51R8nBx36r9re1W/0m93bwf9e2yv6z0tZxv1kwBAAsTgoE13smm1pIlpOfvXUZu+N/VnqutH/RJTgsWqvzqqevX6SQAgAWJw0LaY2pn60evS62161va9jo7+YfUnAYAEyNlBu66utO1Pf/Y3XTf6h9WfBAASIGcHDfcehAQbo/4kAGRN4boOPBRNDjTW64i17tT1JwGAOYBYrO/qb9RicZ7YQf9+IAEga7gBgBsAgDlApui7Ml13a5raDb1qE8tcxnUc2rY3zV1IACABcNDfzmS72qG38/3mc6wO6ltv2/9XdB1HEgBIgBDOKj3tffHt9L72wXdNlL7HIbTuvnXzNY4kAIA47un4y0VM50P/HuPQTrfcdScBIGu+AJakNWMfhV+8AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABiUlEQVR42u2ZMU7DMBSGXxFHYANlimDIzAkYWTgCnKQ9CBIcgQuwVeIEDCCmim6VWBmQ0iH1UEuhdvJS+8nft1RNG+ev/P/P9qsIAAAAAAAAAAAAAACAEvNl286XbYv+fU6wRlpOQ794fna5N/vrzecs1DkiIovqtruwe/94dxU1zlhy1U8CrCTA8f30LCIiFw/3QfXQOUVePkREZPHz1l1P9INz008CrCXA8bV6j7zjr3t5DavVU68N2vqH6iYB1hLwe3M96oF99zsHOWfWVTNJErT1j9VNAnJLgL9f7qOumn9r6qHPQ2t0rKNS64/VTQJyS0DfjPnO6nOEc06oY/wa6o8TuwYcWz/ngFLXAK39tZbzreonAYmZDXXW0BoZu/uIrfXW9JMAKydhN2Nja6w/ntsvx9bi2PNBrvpJgNVuqBa+M0Nr6rH+SZtaPwkoPQHaJ2Fr+klAqQko3fkkoNQEHOpC5u58bf0kIDFqE1BXTXAfJEdS6ScBYqQbqtVv1+5yWtdPAhKzBeqvIHZh+vqZAAAAAElFTkSuQmCC"}, {"id": 18, "name": "紅結三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABaElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjAIC4KmH7/+nHr7/ieXTCzAN9YBlJFahtIjafwYGBoZTJuoMDAwMDOfOnWNgYGBgMDIygsjv2MxIijnwmHtzi3FExwALsQphIS+VXQkRmNrOwMDAwGB25iY8DyDzcYEn8xcwMDAwMMgkJozmAZJiABayT56XQWIiCCJ+Z91VFHV30PQ527iOlkJULYWetIlhlf8Rsx+vfvSYePjo2WgphDUPoJfTuAAsxFXktCFpPwa7Orj8o6tYYwKXfcTGzMjLA7CQxAXQQ5yQutE8QG4ewAUIhTyx9o3mAUIhRWpIo6d9QiFNKCXA9I2cthDMx5TmEWJDHr3GR6/pVeS0/4+sGCAXcCxxJKue+YGeZ6q0R3geoBXAVcMTW1OPxgCxrVZ4n5gBkidkqhgoCvmRVxOT2iolt4YmtXU65GOAiZohiN7OGR0bpWUeoBUYcXkAABBwl6e5q9JrAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACjklEQVR42u2aPU9UQRSG3yWSgLWxAENFsLDbGBtpiDGhoaGmgNqeRBs7/QXWWljb2JAQQkNFzHYWmm0kCzT8ALq1WM/GHe5kZi5zh2Xv83T3+9x3cs57Zu6VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAppTzza3h+ebWMHYb2qH/HEMDbaaTksGStHzwvROzPW0sP1obStLp86eSpF6vJ0nqdrtKidvuM9bl6nenVAVF//z64wCAA7Spgi69eStJuvj0UZL04scv/f9etu1j8PmLJOnJ3m7R+NG/Gf1xAGg1D2JPtAy1DJaTwZbhqRlcCotrcLk/eo/t0f7+t58T5/Wd616tv260osdWMPRvRm8cAHCA+1RBUytniIWvG5Kk653jyuNHJ4cT7/Hy/bss8ffPRrotPpxH/wb1d/VeXXk2ET8OAGIVKCGTBh8eVx73ZbCvEv05u0iaxVdkcuX17irHjR74X/wWr93H7uviHrf3sPi9qx6euELxo39Z/XEAYA6QksFuxRln6I6SMjj0vLo9pu86e45bKd3K48brHreeNLWCpzot+pfRHwcA5gB1ekAfoZ7OPa90DxqKKxZ7fix1e3/0b1Z/HACYA9TpQXNleOzzYitoqAfNRd3VmFx6oH8e/XEAwAFmqYKGVifsS+Bte1GL075kxvasoZ4b/cvqjwMADjBLFbQ0TVVM9C+jPw4AOEAbKiigPw4AMG0OcNe4XxTd9W7V/NKY+8vnrOCby9Qdh9jrfXMXHABwACrozcqUutrhXpd73X5aK2huvWP/Tg2dFzuOOADgACUqqxr69yV3pc/1H/xtHaXpcSite27dco0jDgCgmn8tVlUR3/7S92Mc4nRru+44ALSav7rluI+W+WA0AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAB2klEQVR42u2ZIU/DQBzFXxcEH4AgYEEREHMNQWEWQjIzg54AjSdhHwA+ARoEGoPB4QmpQ0BqWDpICB9grojumvVC2d2t7d0t7+fauzav2Xv3v/8NIIQQQgghhBBCCCGEEEIImTLu9dNxr5+qXlO/Gi1ayy6B6sTNtZ0UAJ73dgEAURQBAMIwzMYfHwKd9+TO+3kPmvhQV/UzAZZZUZ0onLNxdpHduL4CAOy/vOVr6Ox1GcnNLQCgfXrS6Ie6qp8J8CUBwhnJ13nmpOPsfnz/WpgXS88dHhwZrdVV14a69ZvqZgJ82wUll+t/jk8GT/8+LzvpY/RZ2EWI98ejzJHbW51Kd0l16c+TY6ibCXCtBsj73DLaw++iAwbFceEE2SGqa+qMo7TWVtv6dXUzAb7VAPELlyGcozpPdo48XnUNcE0/E+BrDZi3BprOX9T5vulnAnyrAaZO0V0756GbEFf1MwG+nAXJHeuiiPeJ/bKM3LHKnapuf+CqfibAlwSYsnrX1XKmWFMn8po67MDGP2l162cClj0Bph1q1Z2wq/qZgGVPgFz9E3Snp5Hwwvl162cCfOmEdU8VTTvMup3vmn4mwDKtKh2geg7iIrb0MwG+1oC6aKoGuKKfCbDML35DU/ZZwwRnAAAAAElFTkSuQmCC"}, {"id": 19, "name": "眼鏡虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIUlEQVR42u2YsQ6CMBCGD+MjuOnsBO+kD2FcWY2vYKIhjLwNTs46mPAOOOAlSLhc25QYvf9bSNOWpvf3ej8QAQAAAAAAAAD4DonrwOVi3fbbj+aWhCwY6z3M7NcVmPtOuJ8vRES02m7akAV786NswJ4CTH48fLSvdU1ERGmWjbanwp4Cp+bZKbDbj/anb2WqouyewwED5aCAdk9754agjGtd8K0P/6eAtHOOFN8uuXCWWQGpn+ejEkteSMuBPNItouWKmRwIdqOhSgwjr+WcppCdSsw7dq0TmhfSIs8KSx6rKsrWthvV8HWlw8gzkqeylwO+hEa+d8ad6gEU0HJA8kDambfrRqfOhVRxsb7uFApo3wH4KxHLjcb6Znb1XGYUeAFGkpDA93uiDAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB8klEQVR42u2bMU7DMBSGXxFHYIOZqT0MEiNCdOAIVdesiCsggRBjb1Mm5jIg9Q7t0FqiJo/EiePEed+3REnq1P6t/r/z5IoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAeTKwM9PLievf7/Hv7NenzOdYYqv5nTA1Y5tyag25e30RE5Gr+sGvZHgcdgf4kAJAAFhzUp3h+Ojn/XK9FRGQ6m5Wed+XooQ6M/nH1JgGABMjJQZs6p+Nl+3Po/2JZen96HNfq/eNw9D/gjbtp/51+j/Mb9O9Qf1/vYrE86T8JACRADg5a9UvWqhzBzqqMq25VRauulPRfckqwXPV3R9dfv/8kAJAAOThoXbR27nvc2rhQnND1X7vv2ndVR0f/tPqTAEACWHLQqqpIUbFGdu1XgY7tr/21caN/Wv1JACABLDloKFo9/fb+rvR62/o7+qfVnwQAEmBMDlpVnfDrwamock7070d/EgBIgDE5aGw0Jwy9biXBctOfBAASwIKDWgX9SQCA/hJg6Ph7Z5ru1tTapV6rD51/dmc2moe67bV3FxIASAAc9K8zhVY7/HZtd3Xm4qCx9Q79f0XbeSQBgARI4azS0f732E4fax9820Tpeh5S6x5bt1jzSAIASMNdi2Uuol1P/TzmoZ5u1nUnAcA0e+Y/RN4Omr3PAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABoUlEQVR42u2aMU7DMBSGXxFHYIOZKb0THKLqmhVxhUqgqmNuUyZmGJB6h3YollKrT46N4xeH71uqKHHyV/n/Z+clIgAAAAAAAAAAAAAAAABzZjH0wPu7x2N/+/vwuUi5YK7zWF03t/4bPGjLbeyAr7d3ERF5eH46plywN97kD09NPwmoLQGO9vXlYvtjvxcRkWa5vLodW2PHnhty60/VTQJqS8Dm8HN20Gp9dX/z66xuuzv/+gd4zvMd5JzZrtajJCG3/r/qJgFTS4C/zo2urYqzUmt0rKOs9cfqJgFTS4B2x5yz3OqgVWq5c5C2343Xaqh/ntg5oLR+ngP+2xwQWhdrzvHHd8rxqc6vVT8JqG0OCNXIXKuMkJM1nbXpJwG1PAm7OzZ0nR3qpbjzufWyVou1Hk233UU9H0xVPwmotRsaYmhX0XemX5u1nszY3dJS+knAXBMwtJ/uO6dXI4u+M7bSTwLmPgfE9oCsnV9aPwmYawK0WtoEupDWzi+tnwTMJQFajyX2qwgrrPSTAKnk29Bc71wl8Y2WjPSNqLV+EmDMCbCGU+R+dwPLAAAAAElFTkSuQmCC"}, {"id": 20, "name": "紳士帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLUlEQVR42mNgGAWjYBSMglEwCkbBwAFGWhlspRf1nxh1xy4to8gNTEM9BkY9MOqBke4BFloZfFRRmLhi8NIIjwGiy2BpETWUcv3pm1uMlJT/1KoPRl4MPJm/gIGBgYFBJjGBLAvR9eOKydFSiBCQlZMcrQcGJA9QK+QfP3o+mgew5gH08p4QOD7hNwMDAwODZQErWfK47CM2ZoZfDODyOc6YsT0KCemzEK6MqDqkvH99E02hAwMlIT2aB4iuaTFCnrQ21ojLA2S3RsmtD2DlP9l5Dk3fyGkLwXxMaR4hNuSJiOH/I7s1evzsAUgNa+xAFYfgCnn0PDNy8wCtYoJQyBOqD0ZjgFZpfuS2RmkNcJXv5PbQRgd3kUMQV5k9OipBzTkyarWFSG0jDdsYAACGy32k+KabcAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACXUlEQVR42u2cP07DMBSHXxCcABgQBYkFNhamIiH1BuxMcAAkViaugMQBYGLnBiylC1260Y0/hYHegKEMIQMmJo7jOHH9fVubOH75RX4/+7mNCAAAAAAAAAAAAAAAAAAAzBcJEuSzv3s0MznvYXSLhgHrv4DUEDOLZFAyaMw64QAgDAAABgAAawD4ob+1bHReMkKrkPXHAUDYB6iB2eGpURUiubvyUoVYX9n+Fc9kOk6qVE+k5dUU9McBANw5QOgZNIv/7fpGREQ6J8dW11Hb63TAwcLQHwcAoQpkNwJzM83z+2MrM6jKxuZao8JnGbHs/aO/W71xAMABQsqgtpkzo3txXqn/qu2z+DP9JtMx+tfYXtVbRH7FjwOAUAWyG0mVeH35KDUHVfvXtVerJUWZc3D5lWaWs6Xc83XHs/516OIqih/9/eqPAwBrgDIj2HSEmh7X9Wc7x9S1097XQT+Nc5h+7KzupNWSzyflxJ64jNO03o/+9eqPAwAOEHMGVfkbt5v+TOf+6O9XfxwAcICYM2h3rydtqsOjv1/9cQAQ9gEaqEOLp/p1W+4j1LjnXX8cAFgDSLn6bpAZNHTQX3grBABvhXDMYHj/73HbKgWEoT8OADhAzBk02zkVpY6ufi+G9Xe1Xd1z9dD0V9cyuueg7juI4f6E7nno1i44AAj7AGJfx1VHnunINR3Jtr+fL3w7gSZD2P7jSW1X1I842jGu+hx86e5aN1fPEQcAHMBFBi0796rrer7+29p0P1V1a0p317pV1RcHALAdoXm/8NN97/t6PAcz3WLXHQeAqPkGz8sygcaDQecAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABm0lEQVR42u2bPU7DQBCFx4gbAEVEQKKBjoYKKs5BBSeDinPQABVNOiiToBRwh1CgSHilFZ79sWfi75Wx4zx53tt9M9qIAAAAAAAAAAAAY0JT68FX5zfrLve9zB4biy+mL/47aHBYUAAKQAEABRgvdms9+Plkr1sMm9l8MX3xxwFe+oDD/dNWLv78/mhy8nPf/YBV/jjAmwOW9w8iIjK9u036wfD7MSXWcoA1/jjAawo6Op5UVWptZ5Tmn8obB3jbA0opZzFftdbQ8Pnh9VIKLc0/dJSWNw6wtgeEeVmrgK7XFWu0am0dmr+WNw6w5oBYxUJlbSr9+vbUum96cPabl7/eW59fXlyr1ubUPaBv/sI0dKR7QLRTDJSjzeO56ccbfxzgdRqamqe16UO71nvjjwO8zILCjjUXfxS8TpzVqPoDq/xxgNdp6CY/5+bj2CzovzU1d0ZkhT8O8H4qIldJpTthb/xxwLaeC7KufCv8ccDYHBDLx16UX5o/DpAtOZy7mK86z0EsYij+OECc/Ues1Cyl1JTTO38cMDB+ANPbGFBVjsMsAAAAAElFTkSuQmCC"}, {"id": 21, "name": "長毛白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABEElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA3ceXSVP497TVPXAyIuBH86mFFlIqf7hHwPo5TQhkLILYsQctz9kyeOyj9j6gWnY1sT///9HCRkZUXWiSh8VOW2S1D15fRPVQYyMjCMqDzCSmgfILv9xxAAuMJoHCMUMuTGBHvK4QppQSoDpGzk1MczHpNYTpKZxmPlElGL/R3ZrlNoAV8jjKq1GXh4YqJAnVB+MxsBAhfxoDFC7L01qyA+bGKCaB1TktAm2MAe1BwZ9a5TcPjO12kjDNgYAgxxsHUrEBfEAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB7klEQVR42u3bPU7cQBjG8TEiRaihAlFFpEjNCSJxDiJxLCQ4B1JOQJ2CiCqCKjlACiRTREbshNH6Y+xldn7/ZuXdHfv1M/Lz2O/OhgAAAAAAAAAAAAAAAAAAAAAAAAAAKIOmlhM93D9pX28//vnZbHI/tfFe9d8xNaiZ3doc9OHqOoQQwtG383bieA66BfpLAEiAGhw05v7Xj3EDv99mdfShDkz/26x6SwBIgJIcdKxzdvz9ejrp+FPHd/V3+n3c+0D/GcfHen86/rJSvwSABCjBQdddyakuxzoubv5JcHn2NOrz1PFSdb2qP5SUYKXq37129cb1SwBIgBIctC/duLZtV/Z7dPD5ze/HdXXO3DlFqu6Xrsrvu5XtpmmanP1++s+rvwSABNhGB03Vm7u7Eh8n5ajxvX/KYem/rP4SAMFq0AH3oKP7zxFDuyB9HbRvF2NTrKuf/svqLwEgAbbJQd/reZRa97brLwEQdIFC//5u/ItaKc5TOvSfBwmAqnEBwAUAeAaolLgfPna1Zmrcprs2pTzLjJ2HvuNTzy4SABKAg/7vTEO7HfG4oas6S3XQ3HoP/X/F1HmUAJAASzhryLT+fW6nn7oOPleizD0PS+ueW7dc8ygBgDByTcdbLpJ6f+n9mYd+utWuuwRA1TwDJo4B88foIy0AAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABdUlEQVR42u2aPU4DMRCFJ4gjQEW01QqKrTkBFwkng4twgtQUICoUKuhJEcmpLIVVkh177bWH/b4uSmy/ld8b/2xEAAAAAAAAAAAAAAAAAP4zC+0Pb65u3eHnr5/3RcyAqfopNW5q/Rd4sCyXoQ02T88iIrJ8XLmYAQ/aF3ng2vSTAGsJ8Hx8vsY1fFmramzutSG1/ljdJMBaArYP96MGPNXeO8g7s226LElIrX+sbhJQWwL6+9xTtE13tqYOfa+t0aGOKq0/VDcJqC0Bfsacc3+ctLy+UznCO0frGD/O9nd3tJ/QNWBq/ZvvNzmmn12Q9TWg75hc++tUzreqnwSI0dvQ2JNk6O5jqNZb108CrJyE/Yxp99na/vx+ObQWh54PatVPAqzehqai70xtTZ3qTVpu/SRg7gkYck4tTs+lnwTMNQFzdz4JmGsChm4ha3d+av0koDDJJqBtOvU9SI2U0k8CxMhtaOg717Eny6n+I1paPwkozB5m+BDMK91zVAAAAABJRU5ErkJggg=="}, {"id": 22, "name": "皇冠橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABUUlEQVR42u2YsQ4BQRCG50Sh0elIdKLX6RU6j8Bj0FDxDhoeQafwEFrRSU40EgWFbhVuxV2sf+3eCbvzdbd3m737Z/+dmSNiGIZhGIZhmJ9BnBdCnBcCPrduCrFuCttxW3L/Lnj+WXkiIjpNY9dBsROgSMQGRo1onMQ3PuDvIxC88sAr5culWkzRcFUyWrDSOsau98dtgDz5bie444FHSMCeD2fzSMmu0YKP+b0u6SiPPOleBHTZjKvZmjNS2j8PIC6HodWCn85HnnQvAsnzHlEf7N56At1XrYfyg7uZWIVUCp0+SPHkc7pKsweyyg/sAVOlTDOx3PtIabQT5Dx/MrH8YluP6CqPT7F7x+dvNVpoT4iI6Lrsp/IiKuWTnvHXA1lFAikvleaOLG0+VV7VG3ME0qqVVNUp6o39jUDy1NHtA2z/UvhbjabVL5jWSM72Azcnt8DP7kUinQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACU0lEQVR42u2cL0/DQByG3xIEZg4HCWDILMHNI3DTqGH4CCSbYQoSPgIGPgKOb4Ajs2SGLBnBkCBA4IpZRzh2vXa9dv3zPGbJdbf++t76vtdbOwkAAAAAAAAAAAAAAAAAAAAAAAAAAKA0hJ/3Yfh5HzrfN+qE4agTZm2Hauu/xpBBk1lfdAZLUtDqBq4zWJKCg8cgS7tP55EkfdwsdRxzhoezdoWrclD0L05/EgBIgDo4aFSnre6tzf1k9QyfYjebn/P6Pg68ODr6r0R/EgBIgDo4qHkcNqa3d5Kk7aPeUoLN+5/2vM6J0X81+pMAQALUwUHT8ny5U4o5senA6J+P/tt756wCATgToOwOanPOpHy9XWSqK21/m/NH+rXOxuifY//I+SO92gP9qZ8EABKgCg5qOqd5JqdeLZnRHkxiHdW13bY/W12/9U9UpQSrqv7Ra1SvWT8JACRAFRw0KbZ+tv2YdZn1uubay9aphOv06J+v/iQAkABNdtCsqytJ92fO/W3Hjf7F6k8CAAnQZAct2+8g6F+s/iQAkAB1clDXXNdcDy4Kl3Oi/2r0JwGABKiTg9YV9BfPBAOU5m7QurBxfBW7/fuh72U/05drSVLQ6vKtK5H+JACQAE120N2DE8WtdyvlqorZL2q3PZHUNP3/XcuoH6ubaxxcus+vXc74VwgA/wlQdQe1OVPa1Q6zn+91+7I6qG+90z5fkXUcSQAgAYpwVuV074tvp/d1H3zWRMl7HIrW3bduvsaRBADQknctLnIRW3vRn8c4JNOt6bqTANBofgAd5dyo6nL6EwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABzklEQVR42u2asU7DMBCGL6gDC1s3KrGh7mzdGbrxCOUx6AITvAMLPEI3Bh6ia9UNqYilEkMZ2MxSV+Qk43NsY5/yf1vSJvml/P/5bIcIAAAAAAAAAAAAAAAAeonZLYzZLYz3f8uJMcuJiT3fd/1HsFxZBr+dQ0REn4+t4+bkqvE5qXXi7mJ/nsx/J1ejfiSgMI3LSdw5p8PzliM2r8NODxxdblvH79t1I3G2z8la9SMBtYwBh0h4nLZ5et47YdbpgYfrr2dZaro2/UhAbQmQsro/yyLI1mrrlNAxoJR+q9uOCVL9SIC2BHx93EY90HW9dZB15nhOWZyfWr9LN08C5gFaEsD7ZRfj+dufNdX3u7RGc0dJa3Ep/aG6kYDaEuB6Y9xZLkdY50gdw2sov4/U+aX0E9aCejoGpOqvUzlfq34kQNsYEFsjeXfR1ckundr0IwFaZsL2jcXWWH4/2y+H1uLQ+UGt+pEArauhx9MHIiL6frlJ4iTffEBa67XpRwK0JiCVk6Qz4Vz7AqX1IwHaE0CRO0hS54TuDWvRjwT0LQG+VUje3eTeGy6tHwnQmgDeNeReR0/t/Fr0IwFU2behudfbu+5ope5eatGPBBTmB3HVqMpbLafjAAAAAElFTkSuQmCC"}, {"id": 23, "name": "黑框眼鏡貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8UlEQVR42u2XQQoCMQxFM+IR3Onac+khSrfdilcQ9FyudSHMHepCCkMhTlMDdZr/dsNMpySf5CdEAAAAAAAAAADaMJR+uN3s4/T5Od6Hmgu1/pNYLV2BtfTA43ojIqLd8RBrLpycVwnAngKJcD79RQD2FLiMr48Czn9VhntPysr1p0Dep8W1wWW+0Bek/tCfAlzkeaa4LpQUKO1ScGL1GhB2GfM1UD2N1jpx3qVKa45TyI4Tp4h/rZHSzM8pHJyPtqdRbbjMc85urwZaZX7OD6BAq8xDAe1ZSZr5bhRQCyA4L97GsBNLplGtfUF7Q1u8Am8+Imo/RxbwZwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABuklEQVR42u3bPU7DMBgGYBdxBDaYuQ83oANHqLp2RVwBCc7FDANS71AGFAlMTfPj/Lh+ngUBSuN8Vr43cdIQAAAAAAAAAAAAAAAAACjDqpYDvb66Pfz8/WP/tprzc2qz1PpfmBpqdllbB31/eQ0hhHCzvj8M3F4HPYP6SwAkQA0dNLZ7elzENXHXDqz+eestAZAAJXXQvp2z8bz//B7/ZvvvcaX+HwYedzP+Zj8P6zv1H7H+cb13m+2v8UsAJEAJHfTUmZxa5ejcWVPjbrmqEhKrK0fGH0pKsFLr3/xsxhuPXwIgAUrooG2ltov3k7qGbsbf9ho79zq6+k9bfwmABNBB+6+utN1ffG2eOm71n7b+EgAJUGMHDQt9kqn+09ZfAhB8H6DHOvBcTnWgpR5HqeM+9/pLANwDdFktiJ+oldJ5Sqf+45AAVM0JgBMA3ANUKn53pu/bmqnt5l61KeVepu88tN0+de8iAZAAOujfztR1tSPeLveTz6V20Nz17vr9iqHzKAGQAFN01jDSuy+5O32u9+CHJsrY8zB13XPXLdc8SgAIPd/pONZFUn+f+vPMQ7u61V53CUDVvgAGPuusnPt6twAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABV0lEQVR42u2aQQrCMBBFR/EI7nTtufQQ4tateAVBz+VaF4J30IUESiC2SadOxr63E037Jf9PJmlFAAAAAAAAAAAAAAAAAP6ZSdcfLuarV/Pz/XmdlNxQ6zpW99XWP8WDtsxyB9zOFxERWW7Wr5IbNsab/OHa9JMAbwkI7I+HQWv10GuDtv5S3STAWwJOz8fHQdvdV2elvpeE84KDGuMHSYK2/r66SUBtCYj73OzamnJOYY3OdZS1/lzdJKC2BKRmLHZWqosIDuraZcQ1NL5O7hrwa/3sA1gD+vXXWs73qp8EeFsD+tbIrl1Gm5NTOr3pJwFedsJhxvrW2Ph6oV/OrcW5+4Na9ZMAr6ehWsTOTHUVXWu9N/0kYOwJ0N4Je9NPAsaagLE7nwSMNQFtp5C1O19bPwkwRm0C9tud2tMwE2cb6ScB4uTdUK3z9tInWkO9I2qtnwQY8wY97QOexhRHLQAAAABJRU5ErkJggg=="}, {"id": 24, "name": "小鴨帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBklEQVR42u2YPQrCQBCFX0QrWxsxWomlvZCTeABrj2LtATyJYG8pqfzBxtbKYi0kiIubn3EkkHlfG2aHeY/JzC5ACCGEEEIIsUqkdZBbT93XBIt99M8CWmYcGPQmHwpfbgeRslrnNMaBdtWA83YMAIgTOEnCd3zKHhA54CtZN3YdmM3vorjdpksHch3w/9OFiq4eL0eWHdH3UL6y86F5DoQqDynlK3s6XgEAw1E/V3lOYq0e8MmUl+5G5npAvI1KJ7G/A1XtOT/OziTOKv61R8oqX+Rwtg3b3YW0CSkfujfY64G6lC+aB3SgLuXpgPZduqryjXFArYA4SdXeevg2KtnftTDXA0/tvWp929tciQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB5ElEQVR42u3bsU7cQBSF4btRUtGmQSFUCKWiR8qT8ADUPAp1HoAnQaKnXFGRRDS0VCmWArlg2Ml67bG9s/7+ZqVdzfr6jOYc+3ocAQAAAAAAAAAAAAAAAAAAAAAAamNBgjdWv85WawW6vKfRHuv/ifSQADNw0G9fT9/V9/d5uZjyf+aWYLuqvwTArPlcauW1dZqpHfTP7UlERBz9jFW/8Q875aD0lwDAcAlQu4Pm6pj6mnhbB6Z/Wb0lACRATQ7a1TlTzi9eOo27uzkoUn+j3+LHkv4D6p/q3SRnU78EgASowUE3reRcl2NjPdf/3s7n6kun33PHy9VV6hqc/u30bz6betP6JQAkQA0O2pbcuNxx0rp+Pz5FRMT348P/1j1UH53+4+ovASAB5uygKU3dpY+XXvvnzpv+4+ovASAB5uigffv5Q/Xh6T+u/hIA4X2ADn3gqdjkQLt6HrXWve/6SwC4B4gt+rvpE7VanKd26B/eCQYsAMACACbeDbovpLsyu+7WzI2bumtTy71M13loOz537yIBIAE46Edn2rbbkY7r+0S3Fgctrfe271f0nUcJAAkwhrPGQHtfSjt9qX3wfRNl6HkYW/fSupWaRwkARMc9HetcJPf92P9nHtrpNnfdJQBmzSvnpOZPSfMDRAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABb0lEQVR42u2avW7CMBSFb1C3riyItFPVkb1SnoQH4KH6ADwJUveOFVML6tKVOUwRioUhdm7i3Pr7NoRsn+Bzrn+ICAAAAAAAAAAAAAAA/HcKrY7q91V9dYDNZ2Hhh0ilf4YHjSRgOX9tOeT49xXlDK1+Uo2rrZ8EJOYhtMFh9yIiImUldcyAl/b7JA88Nf0kwFoCXCcMVauHXhu09cfqJgFWE/C2PkW1+9g+3nSQW6OHSoKW/r66ScDUEuDuc338fP+2Pj89L4K+D92tdHVUav2huknA1BLgmzHXWT5HNM7p6hi3hjY0++zQNWBs/ZwDcl0DfMTW+r7Ot6qfBIjR29DYk6R7h+JzUGytt6afBFg5CTcz1rfGuv35biXvOTT0fDBV/STA6l2QFq4zu9bUsf5JG1o/Ccg9AdonYWv6SUCuCcjd+SQg1wT49sdWnK+tnwQkRm0Cymqf7F0fy/pJgBh7O1rrLkXrltO6fhKQmDM5wveFf4WRvAAAAABJRU5ErkJggg=="}, {"id": 25, "name": "鯊魚帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHElEQVR42u2YLw7CMBjF3wgeQzAIHOEEaBSWAwzJKTgAZyABicOMG6A5AeBIQIEYCX6oEmgo/bOGZev7uWbrmr23r99bAUIIIYQQQipDnKRZnKTZv9arlV2wWtmdKL0DkemN7Wb3Q83L7Ri5LOjrOZVxoG47YbDcAQC2k77T9/02nzXg5IDgfD0AAMabOwBgNWpYjbkL5XXgsRgCAOavMYzGaK3pwE8H5H1aR296AgDsZx2n66r1TPtD9RxQvblKKVlZWXGV8uzEvmpA54htNgquBpzTqMg0tsgZyLbm5HnhdGLxxnlrxFR5ncMiDYebhXyjUl713xBeDRSlvK4f0IGilKcDrqj2d1vleTb6TUFfZz08G3XJ774IrgaeHOmJGK+5C8kAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACBElEQVR42u2bMU7DMBiFXxE7HRALAxviBMxMrHQvIwNn4ACcAQlGOrGUGzBzAmBDggmGVmIvUxA1teo4vxMcf9+CUuTkz7P8XuP8lQAAAAAAAAAAAAAAAAAAAAAAAAAAAHrDeDpbjKezBUqUof8GkkPJbOCg/boP9CcBAIIZpFi5v48no+HgP9zo7vb+Ul3vny+DLs+T0jnRnwQAsE2A3B20uu7RzaMk6eHsMOo87vi260d/W/1JACiazQYrcGGxgrvi7eNZknR6P5ck3Z5s1Tq2csS6Dob+c1O9SQAgAXJy0FjndPm6PpYkXf0cK+hYO3em34UnoyH6J9R/xbPHUv0kAJAAOTjoupXs2+VYx8HFqyTp6XIv6v++6/nqsvoOjv5h+ld/q3rd+kkAIAFycNBQfON813Hrcuv11Z1qHx3929WfBAASoGQHXXc/VtcLfYOJ/u3qTwIACVCig5433M+v6lHinh/0T6s/CQCiGzRiH7grmnYBdnUfudbdd/1JAOAZQDX2d903ark4T+6gv/hNMAALAIAFANBxN2hfcLsyY7s1feO63rXJ5Vkmdh5Cx/ueXUgAIAFw0L/OVHe3wx3X9I1uLg5qrXfd31c0nUcSAEiANpxViXpfrJ3eqg++aaKknoe2dbfWzWoeSQAARfZ0rHIR3+dtn495CNOtdN1JACiab0MCa0D4iOQ2AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABkklEQVR42u2aO04DMRRFbyJ6GkRDQYdYQepUtCwglClYAwtgDUhQ0tGEHaRmBYQOCSoogkQfKiNiyYzt8eB5zDmdNb8b+d7nTywBAAAAAAAAAAAAQAazxXozW6w36I9jjGXqMiYJdfWTgMqMYm882DvacsPr+9Mo54Ol3lPru6X1k4DK7KQ+ML15kCQt55Os+vjj+So/uG/6SYC1BDhe3laSpLP7D0nS7eluUrupxnY9NpTWn6ubBFhNwOf1iSTp6rutqLb27351kF+ju0pCKf1tdZOAviXAn+eGOL543mo/Xh4mXU+drcQ6qrb+VN0koG8JCPWY76yQI5xzYh3j11CHm2enjgF/rZ91wFDHgBC5tb6t863qJwHWxgDXw+dez8cSu4fS5OSQTmv6SYCVlbDrsbY11n9faFdy2uDQ1PVBX/WTAKt7QaXwnRmaVcTWemv6ScDQE1B6JWxNPwkYagKG7nwSMNQEhObHVpxfWj8J0D85G7qcT6qd9bGsnwTIyNnQUvvtuf9odXVGtLZ+ElCZL+A1PlgWAV1oAAAAAElFTkSuQmCC"}, {"id": 26, "name": "青蛙帽兜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABF0lEQVR42u2YIQ7CMBiF3xaOgMMSFAeYwcENOAUGRbBYgsJwit2AOQwHQC1YHHcogvwhaVL6tzRZRt9nEPQf6Xu89W0AIYQQQgghJFeK0IH1fWUAoK4aAMDj2aquMRpODAAsr3MAwHF8KlJsoOy7AwPtQlFQ+CjZquZlvX09rYN0wEYyYDvjW287wQzEDqZWkg6EMr0souZuszMd+OqA9q4i7Dbb9+dhH/W96/e050OZTReyu4wrAz7FJQOhXYoZUGfCoby2YzEDoW00tkP5lPb9E2Qun5NYdvxrRrTK+xyuK5i8u1BqXMrbmck3A10p7zsP6EBXytOB1M/Sse209w4k20BdNc57Nt9KpHw7naoLhXakv3XgBfg7drX/rN5PAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB70lEQVR42u2bMU7DQBBFfxBHoKNFVBwgDR3cgFPQUCFaWkRFwylyA9LRcAAqREvHHUKBVhEDK6/Xa8fDvNdYSrzx7N/4f3u9lgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwBuLaB2+er/cSNJquZYkfXy+FWlweHC8kaSLlzNJ0sPR44K/j3/99xgSiMx+FAdNx09s63grap/2t79X2v/oCTZX/UkAIAEiOWgiOajtV9f+th8kmG/9SQAgASI4aJcj7srRax0Y/dvoTQIACeDJQVtdu548n1e1ez19alJ/32t49K/T3+q9WupH/SQAkAAeHLTrTM7NlnRxe33zvb2/q/o+d7xcXdv61/KUYF71T9tUr62fBAASwIODlpJrlzuOrcvWm6t7aJ2l8/3oP67+JACQAJEdtKs/rY5nr/1z/Ub/afUnAYAEiOigQ+fzx5qHR/9p9ScBQLwRVjEPvCv6roOfSz+81v3f9ScBgHsA9ZjftU/UvDiPd9B/HEgACA0nAHACAHAPEBS7KrN2tWau3VzewJr7vUztOJS2z927kABAAuCgv52p72yHbTf0ia4XB22td9/3K4aOIwkAJMAUzqqR1r60dvpW6+CHJsrY4zC17q11azWOJACAKtd0/OUiuc+n/j3GoUy36LqTABCaL5EBF8lBafg2AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABgklEQVR42u2avU1DMRSFTyJGoKNFVAyQhg42YAoaKkRLi6homCIbQEeTAagi2nTsECoLYcni+tkv9sXf10WxrfPkc65/ZAkAAAAAAAAAAAAAAP47i9wOt583e0lar94kSbuvrWmMk+OzvSRdby4lSc+nL4sWH9yb/iUebMuRtWFwQODHCVtT/9A+Hs/qwFJ61U8CvCQgJtTQ2Fl/tY+d1Ipe9JMArwmYy8mHWhtq65+qmwR4TcD5+9Wkfh8Xr6Z99nqlWZNQS3+pbhLQWwKsu4KHu/vfv58es/631uhcR7XWn6ubBPSWgNSMxc5KOSI4x+qYuIbG++7cNeDQ+jkHjLoGJGvrxFpf6nyv+kmAtzUgzLA2ZXcwpU5O6fSmnwR4OQmHGSutsfF4Yb+ce1eTez7oVT8J8HoXVIvYmaldhbXWe9NPAkZPQO2TsDf9JGDUBIzufBIwagJS+2Mvzq+tnwQ0ZlnznY31nqRHWuknAXL2OrrWXUruLedcb0Rb6ycBjfkGO2cUQlEnDoMAAAAASUVORK5CYII="}, {"id": 27, "name": "船長貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABU0lEQVR42u2WvUoDQRSFvw0WPkBIk5BqsXALTS+CiG+RQmt9gnQ2eQLzBr6FhSBYq4UWISCGaCFbWKYQ1kJHyLC7MzvZFMu9X7k7P8w5c+ZeUBRFURRFURRFKlHVCXuH51nZ/8erBwD2Lwal6zzdTaI6DtAS40C3vZMBtHdPatk4fbkB4D2dRqId2PIe2IkB+Epf69n4bz3SKeqAD9+fMwAW487K9+XwtnTe8cFqZu4vxwD0zk7RVyjkFbIdCHXibf6hr1BuBozSLozicT8BYDbMH/f/f/6c60TRfr7OyMuAUbIIW3HXOM1AaAaKcCnvu59mwKVUVaXtu+9S2nUTzDw5vZA58boZ8VXe1XPF/SST5UAo29dHQXVmaWdmlAjPwKYoqvC+lVod8O1aDQt+M9EbsZby8ipx1a40tEJX7U4b70CrTgXtPqdRB2hcBjaFuAz8ANTchZy/uWSAAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACWklEQVR42u2asU4jMRRFbxBIQI1oQFQRBSlY+hUSQvwFBdTwEzT5AvgD/gKhlVa7NWwBBUJCIKBAKSgpkELlIgbHHueNl2TOKZOMx3Md3/vmzUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADButJp2weubB/1h318eX0iSfhxuDB3n3++TFn+f8dd/iiUBEqABDrq0sNqXpIW1HZPxetdnkqSn3k2LBBtf/UkAaDTTVXdwjJjz+OOVctDpxbYk6bV3ZzqeejdFHRT9bfUnAYAEaIKDvr/cSpIeu4sDn7/t/hp63PbPwZr171FXkrS8v2fi6KkOjP6j6R/SmwQA0QWqsIOsd3DVGjS3dg3NP/c67h+eR5r/7cOVJGlufqaF/vXp7+vdXukMHEcCAAkwDg4a28mp3RI3fzdfN44b18f/3l2Hm3+I0Lxi80f/svqTAEAXKKff/GkH76rSDo6dL7c/HTrOncd3St95/Pn635//OctycOt+P/p3eBIMUPweIFSrhXZw7Hela9DYvFJx508lt/ZH/3r1JwGAe4CcGtRqh6eeL9VBYzWoFbndGCs90N9GfxIASIBJctBYd6K90ulb1KJunrOnW5Vq1ljNjf5l9ScBgASYJActTV2Oif5l9CcBgARogoMC+pMAAN8tAf43/hNFv9+tzCeN1k8+J4XQvUzuOqQeH7p3IQGABMBBPztT1W6Hf5x13/67Oqi13qlvp8Z+l7qOJACQACWcVTW9+2Lt9FbvwY+aKHWvQ2ndrXWzWkcSAECZby1+5SKhz0uPxzqk6dZ03UkAaDQffyt2QL8DVP8AAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABx0lEQVR42u2aMUoDQRiFX4KFBwhpDFbBwhRqL0IQb5FCaz1BOpucQG/gLSwEwVottAgBMUSLsIVlCiE2GXAHsrszO7vz/+F9ZXZ29i157/9nhgUIIYQQQgghhBBCCCGEELLpNFxvODi5XGZdf7l5BgAcXh1lzvP6eNuI8cLS9DfpQSUJ2GntLQGgtX8W5MHJ+z0A4CsZ15IEqfqZgMhsFR7Y7gIAfpKPMA9ezYdkXM+LCtXPBGhJwO98AgCYjdqp3xeDh8z7To/TNffpegQA6FycZ9bq0L2hav2+upkAbasg20G+TvqcfqdWEWb+yfQNANDd7QVdJVWl3+CrmwmQ1gOMU/LoDOdpBwzS140TbIfYTlrHP0c51dbY+l11MwHaeoD5h9dhnFN0nO0c+3roHiBNPxOgtQfk1UDf8WWdr00/E6CtB/g6xbV25uGaEKn6mQAtZ0H2jrUsZj6zXrbJO7Nx3R9I1c8EaEmAL9t3fSdnmpq6sGvqsFeqB0jVzwRsegJ8d6ihd8JS9TMBm54Au/vP0F+dRkKF86vWzwRo+zKu6Kmi7w6zaudL088ERKYZ0gFFz0EkEks/E6C1B1RFXT1Ain4mIDJ/s8Ev3wDDB5EAAAAASUVORK5CYII="}, {"id": 28, "name": "海盜貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIElEQVR42u1ZMQrCQBCchBT2io2FnYiC9voCn6SNnT5Df+ELtFdQxE5QBImdhV2srjBw3l1yieDOdAfZbDKzs7shAEEQBEEQBEH8CoFrQK8zSHwk3h02gY/7hGIUsGV+u18DAPrdYSlKyFGgUWslAFCt17wkftxjAMA1PlGBUrpOUV6Q54HLYgkAeN6mmRK2J+ePs3gPRK4Btswrpo+z5tez+Ekc6WrdtaYVswo65m3z2XpDXhfSMWlSRHcdu1BeD6RhYp4eyOuBrEy7TmJTJag4OZNYvXFej9gyb+5iSGTuQgqV0RwA8FqNvTyIjnndziTPA0UpYWLeNA+oQFE1L2YSl66Arr9n3U7lKpDuOrbfAb4Rivs/4GsXct2R/laBNxKSh8AKJldKAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACEklEQVR42u2bP07DMByFXxADCxMVCwNMqAIJxAon4AocgDu0CxscA27BCWAHCYS6IYGQUNkY2MrkoQbH+eO4dfx9S5W2dn5+Tt9zrFQCAAAAAAAAAAAAAAAAAAAAAAAAAIB0KXIb8MHe8SxEP4/P9wWXT/r6rzAlQAJk4KBV6354upMkHe6fJD0O9CcBAMIlQOoOujXYnUnSxuYgSH9fn1NJ0vt0UpBg6epPAgAJ0GcHDbVmXrSTon83+pMAQALk5KBv1zeSpO+Pi0b9DMevc8dNHdTU42uP/mH0d+lNAkDWrFZ1hmVx0KrO6aJq3abOl8vt0uOmTmj6WT+foH+H+tt6D8eaq58EABIgBQf1/ZLt79V1RNOvwVW3qy4bV11tEwT96+lvXk29dv0kAJAAKThoVVztXOex67LrddXdtk6f06J/HP1JACABcnZQ33hCnc92ZNe40T+u/iQAkAA5O2iscZJgy6k/CQAkQJ8c1LfWtfeDY+FzTvRfjP4kAJAAfXLQvoL+3UACAAmQM2unV6Wf/9yOuEp6rD8JACRAzg66c3Smsv1u1dxVsdt1vVZPTf8/9zIalermmwef7r57FxIASICcHdTlTHV3O+x2offtl9VBQ+td9/8VbeeRBAASIIazqqNnX0I7fajn4NsmStfzEFv30LqFmkcSAEANn1r8z0Vc78fuj3moplvuupMAkDW/di9SkayHkv4AAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABmUlEQVR42u2bsUoDQRRFb8TC3mBjYSeioL1+gZ+kjZ1+hv6FX6C9giJ2giJI7CzsYjWIA3F3Zl9232PP7ZZkMzfsPe/NvBAJIYQQQgghhBBCCCGExqBJ6Q37u4dzi4XvH28nQ3xhb/5XyGAQAtom5+7hRpJ0sHfkigSv/iEgCgGb0+25JK1vTE0W/vyYSZLeZs+9EODVPwR4J8Bq1zBUL/DuHwKi9YDXyytJ0tf7WdWCO6cvf67zGprWse4Ny/Zf6xsCBtZq6Q1tk5OS8nS+9e91ntDf17UUEqz9d/UNAd4ISE+0tBamBDQlqa1qEzW0/1LfEOCNgEVPLE+WVWLyGpp/TmkP6Nu/mIaOtAc01cDa99cmP6p/CIjWA7rWyHz3UZvkRT6j+YeAKCfhfObRVenz0n65tBaXng+8+oeAaLOgpLXjC0nS9/WJSZKazgNta300/xAQlQCrJFmfhKP5h4DoBKjjL1RDJd+LfwgYGwFNU0jvybf2DwFRCch3DX3P0bvKi38IULD/B1jNUkqnnNa7Fy/+IWBg/QCqTjkSzEZ1WQAAAABJRU5ErkJggg=="}, {"id": 29, "name": "巫師貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYklEQVR42mNgGAWjYBSMglEwCqgIqqJu/K+KuvGfXvYxDfUAYxrqMTHkY4CFmiE+rJLQsPEArfPCkI8BRmqn/daOIgYGBgaG6oo+rOrblmkwjsYAOTEgLaKGEtLxbpsosnjhLj8GBgYGhqdvbjGOxsBgKN/JzRsjLw88mb+AgYGBgWHOm5co8lcuX2ZgYGBg0NHVxcqHgRQRcQYGBgYGmcSE0TxAVlsIPeTprX/4xwB6eU8INJSWQ+juThRxWNrHJU/IPmLzxsgrhULiYrCWLoRiBL20WrNoyWgphDUGCOUBXCFLKoDFFC4wmgcIxQy5MYEe8rhCmlBKgOkbOTUxzMfE1hO42kLEhjwshnG1sdYsWvJ/dFwIHyDUKiUU8jAAqy/WjPg8QCogN+RJralHY4BQHkCPEWLT/IipiVlobQF6XtDBUYPDamhSW6ejMUBsz4xhdHSaSqPTpPaZSQUjLg8AAK+prN15/RzvAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACVElEQVR42u2bMUoDQRiFX8QjBCy0FgtzDUtBsAqiBvQCQojEJo2iCJ5AUBsrK0uvEYtgrYWQO8RqIJlk3N3s7mRn5/ua4K7/5t835L31dyIBAAAAAAAAAAAAAABEQr89mvTbowlKxKH/GpJDzKzhoPW6D/QnAQBSs17mJ1iSbl53GqE4Tt2epdGfBADwkwB1nZyE4qToTwIAZKbhy4Gq6qB239e3F5Kkq8uHoO8D/UkAgPITIBQH3Wxuz/R5svee63ovH/uSpJ/xV4MEC1d/EgBIgDo7qK/pSNnOiv7l6E8CAAkQk4N+Pz1Lkh7HvzPnP4dDSdJuq7XwZ8NZc0OStNU5zeWgpp+kevQvRn+X3iQAiP8Ep3CGqjhoWud0Yfftu970P7i/kySddw7Qv8R6W+9BtzfTPwkAJEAIDpr0SXZNS5IYdHuavq7BOKfrfNL7ufqa6l8hJVio+ptX06/dPwkAJEAIDpoWV515H/vZ2O7L7tc+b+rz9pl23o/+5epPAgAJEJOD2lOROUd1OKVd/5bRse1nf9d9o79f/UkAIAFictCsuObph8dHC4+7fp8Eq6b+JACQAHVy0KTphD0P9kWSc6L/avQnAYAEqJODFo3LCbMejyXBQtOfBAASIAYHjRX0JwEAVpcAVcfelbnsbk1Xne9n9arzz+7MpdYhbb3rbxcSAEgAHHTembJOO+y6Zef2oTlo0Xpn/X5F3nUkAYAE8OGsKmj/e9lOX9Q++LyJUvY6+Na9aN2KWkcSAEBL7lpc5CKu476vxzqk0y123UkAiJo/UY/FF8dgk3cAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAB5UlEQVR42u2avUoDQRSFT4KPELDQWiyS17D0AdKo4BMIIRKbbRRF8AkENQSrVJa+RiyCtRZC3iEWOuAOe5ns38yd8ZwmhM3uHtjz3TtzswBFURRFURRFUVRNTYbL9WS4XNP/ZuoyMmHVJQlh/ZOAwNpqMjGx966kShCl5AGwF5AA1eo0XTsvr88AABfnd4W/v3re72iu/b79k4BYCNjp7eWScnTwUuvGT6+HAIDP1bsXIrT6JwHaCfC1gmmrN2j3TwJi6wEfD48AgPvVV+7422IBAOgPBoXfjU572wCA3ZPjwhpq7tN0b2jbf1XfJACRzYLs5DR1vklQdnsDAMhG41ZIaNp/Xd8kQBsB9npZUjYa57//JsBoPp39fArHndevmKjQ/sv6JgHaCJCemEmWWR1IiTDJko6b86Uaal+nbA/w7R+cBf2zHmCvi6Ua6Dpfqq1Vkx+rfxIQWw9w1ciyq4+qSZZ8xuafBMSyE7ZnHi5JsxT7ema9LNViaUYzn85K7Q+0+icBqbwXJK0WNk2StB+wd6SuWh+bfxKQKgGu5Eg74T810ut/xqH8k4DUe0DZGVDo5Pv2TwJSJUCqpX3HFDJ08n37JwGpECDNWFyrCC0K5Z8EILK3ozedpVRV2z1Am38SEFjfmCyT18z+93cAAAAASUVORK5CYII="}, {"id": 30, "name": "太空貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABVElEQVR42mNgGAWjYBSMglEwCkbBKBi5gJFcjfdffP1Pjj5FCW5GanqAacTEACzEFcS5IBoZGRmpEXOUxsjwjwFqhTwh88mNieEbA+ghIy2ihpJ2n765RVaI4TKH3JgY8jHAQqqGJ/MXMDAwMDDIJCaQVQ8g6R+tB8iKARiQlZMcFB4YeTFgWV9JkYWU6h/+MYBeTqPz0cHxCb8hIVvASpY8LvuIrWeGXwwg+RwlJHDGhO1RSEifhXBlRNUh5f3rm2gKHbBqx2XfaB4gNg9g1LQYIU9a22jE5QGi+wM2OoZUqYkfP3qOwj9y5TzWnhmhmIfF0PCviUkNGWIBLAQVJbix5gkiYvj/yG6NHj97AFLDGjtQxSG4Qh49z4y8PEDrmCAU8oTqg9EYoFWaH7mtUVoDXOU7qSE/bGKAah54/Og5zjJ7dFSCmjM01GoLEWojjZgYAAD6Ipm6XJqwqAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACd0lEQVR42u2cMU7DMBSGXxAsdAVRREF0gYUFMSGB1Lk3YIMbsDJxBW4AGzfozII69QB0QQIqkOjKxFCGyAJMTRLbceTk+5YqbWM//8bvT18cRAAAAAAAAAAAAAAAAAAAAAAAoA4kTR3449vHzOa8bruV8GdTH/0XmArAARqQQVW822vL6cCTJPEx7qrHg/5u48EBAAeocwb1FXdW+7GMA/1xAID8DhBrBtXb3VjZ+ZX5JtOxVX+mdsoeB/qXoz8OAI1msegKVq++VrBqP9S19Mv1jYiIdM5OZ47nB6maoH+5+uMAgAPUMYNmsbm1Xmn/tpkc/f3qjQMADhBTBnW9Bj68vHDq3/V8Fb/SbzIdo3+J5+t6i8iv+HEAwAFiyKBZK9lU5dCPdYZXn2lc50tWn5v6M8Wl4n9+epWYHCxW/X/ENzd+HABwgBgyaF70Fa+OjeM4vk/jHKWHndXdtFry/qB9sVeoP9drbPQPoz8OADhAkzOozt+4/fSnX/ubxon+YfXHAQAHqGMG7bZbIvK9x+Vob39+VeSgJy51+NvBQERETvp9L/V59A+rPw4AwvMAkr0rUa1g33cg9RWcRVYGsqhnB8E2bvQvV38cAPgNIMX+i4DXFRwq88QK+pcLDgA4QJMZju7+/dy2SgFx6I8DAA7Q5Ayq7pyKVkfX35ec9Xf9vLKrHbHpr995Ns1D3l2zpu/p82H67YIDgHAfQOzruPrKs93vnrc9X3tVTBnCdjekfl5WP+LpySzXeQilu2/dfM0jDgA4gI8MWvTaq6z2Qj3bWnU/rrpVpbtv3Vz1xQEAbFfovJ2DpvdDt8c85NOt6brjANBovgD/2KsjaqVSFQAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABwUlEQVR42u2bPU7DQBCFZxEVtESACAgaaGgQFRIFdW5AByeDo9BRcQDSICWgIEFLDUW0kndkk/2ZZGfi97rEXutZO9/u81gmgiAIgiAIgiAIgiAIgvoilzvw7fPnN2fcyd6203DjWvxvoAaNEOAr5nh3az7QOSdReasiQqt/EKCdAKnKWXT9ZZGg3T8I0EoAn9mDndNg7fv4HmfNeNd1pEmw4h8EVNZm6oD3h0ciIhre32Xl6Mb4KjeszT8IsEaA1+HR/lIM+TU2d42u7R8ErHsKkqqc6WTWmiJuR6PW41IpSNo/JyrVNwjQtgfwnMt/L6qA2ONc1+cXwXmN85P2hFr+W86L8g0CtBHQmLFgBnkl+Zl+fnkKxg8HZ/O8/PUa/H91efNvxXZVYOoesGr/SEF93QM6nxRZ5aTm8dL0Y80/CLDyPsCnlNInydT0EbHWm/YPArT3gnh/O3VNjU0rGb2aqJyt3T8IsNoN9fm5NB/znB67ppZ2S7X4BwFWCZCqJOknYWv+QYB1AqjwzVetytfiHwT0jYCufGyl8qX9gwBak5fy08ksug+iUbX8gwAy9oWMVC+ltMtZml60+AcBlfUHV8dUdmNrozUAAAAASUVORK5CYII="}, {"id": 31, "name": "柴犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8OTuLgYGBgYGGWW3/+RYiKSfKh4YeTEAA2cbVQaFB0ZeDLxckkWRhZTqH3YxQLEHjOvvMBjX3yFbfjQPUGrAkwf7UPgyCk4o4k/ioWl/YdpoDNAkBmAhKx4/CxLi0SlY5UfzALVbo+TWxOglEqw1CjOf1NbpyMkD6CFFKUA3DxajxvUMJMXEyK2JxeNnwUue0dboQNYDsFggtbzHTPt3GEZLIXoA9PqD3JAfLYVGPTDQeQC91IGlZXqPVoyc1iiuVim1wIgthQBDgF22kC3JgQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB70lEQVR42u3bQU7CQBTG8YfxCCaawMJEwwW4gQsv4YKNYaGHIF7DHYmncGG8gBcgmLgoCxPvgAs7iR0oUzrTltf3/+0otA7fhPfaaRUBAAAAAAAAAAAAAAAAAAAAAAAAAOgwsPJFh2fjzf/X65/loMvjWHOs+Z8wNbDs1FoFzT5fRURkdHW7idyfCtqD/OkAoANYqKC+j6drlRNG/mnRAUAHsFRBv18eOt3fPxevew5O/mnypgOADqCpgsZWTt9kvtpbUUPv1x2/O97F45L8G8zfz3syl8L46QCgA2iooKFfcl3Z11vh9ejyprA9m+aVczFLPP6VaOpgWvN343Pj9cdPBwAdQEMFbWxVIh/X+fT5b7x39zvfr3pnVQKrNq4ipzqHJv+4/OkAoANYrqBb4xznGxbvKtbhyV+4EwxI0/8P4K8CdCW2AnX1PbSOu+/50wHANYBErKdqqTzakb/wNChwdKtA2rnVk+DqBHqZPx0AdADLFdTdOZWS9W458Pl8f7+mz9W15b91LSOzvbmF5iGUe+jahQ4AOoDlClpWmQ5d7fD3q3qHVXsFTZ13WW7+3w99ruo80gFAB2ijskrksyhtVfq6la7sOKmem089D23nnjq3VPNIBwCk5jMdu6pI2fa2j8c8VMvNeu50AJj2C8Au1+gq2vvaAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABeklEQVR42u2aMW7CQBBFh4gjRHIRF0hEXIAbpOASFDQRBZdAuYa7SJyCghvkAhFIFKaIlDuQAo0ERiT2ete7E97rDF7vRzt/dnaMCAAAAAAAAAAAAAAAAMB/plf3xqfH0fH8+vD92XOZ0NdzYs3rW/8DMRiXftMB5W4tIiL5cHJ0mfBsfJQfnJp+HGDNAcrH23PQXB16b/Ct31U3DrDmgK/VotWEt8ZrBGlkjpcSxAm+9bfVjQOs7gHj5fbXnPrX93VzdCgnhNLfVDcOsF4FZbPi4vN88HKql/eby9z5Pq+V+6sRGKoa8qWfc8C9OqAaGRpJ5fS1UeR0Hfmp6ccBYrQb6nqSrFt9+HZAqvpxgJU9QFe0Gkmu6PO0Xg7VW0pdPw6IjPMCZLPiqoa2RCr6cYD1c4BGUdOT4nUXsdv6PxX9OMC6A6Tlm6hYkZ+KfhzAJswCgMU9oFo1aC4MfaIVz13Q2PpxgBjpht7qKornXo10/B/R2PpxQGR+ACl04mj/tXThAAAAAElFTkSuQmCC"}, {"id": 32, "name": "柯基", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GTPLAYGBgYGGZe0/+RYiKSfKh4YeTEAA1d7tAaFB0ZeDHy8MIEiCynVP+xigGIPaJdcY9AuuUa2/GgeoNSAJ69vovBlRNVRxJ/EQ9P+wsDRGKBJDMBClj9+PSTEo1Owyo/mAWq3RsmtidFLJFhrFGY+qa3TkZMH0EOKUoBuHixGtUsYSIqJkVsT88evh5c8o63RgawHYLFAanmPmfavMYyWQvQA6PUHuSE/WgqNemCg8wB6qQNLy/QerRg5rVFcrVJqgRFbCgEAFhBePsZHU60AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB7UlEQVR42u3bP1LCQBTH8Ydjr4VWUuuMVN7BC1BTYOF4Ao5hYW3nCbyAh7CRGaljhY0nwMLsjFkIG7KbPy/v++kIJC6/Hd5LNlEEAAAAAAAAAAAAAAAAAAAAAAAAAKDDyMoXvTi73Px//fW9GnV5HGv6mv8RUwPLjq1V0OztWURExrcPm8j9qaADyJ8OADqAhQrq+3i8Vjlh5J8WHQB0AEsV9Of9qdP9/XPxuufg5J8mbzoA6ACaKmhs5fRNFsu9FTX0ft3xu+Od3q3Iv8H8/bwnCymMnw4AOoCGChr6JdeVrT8Lr8fnV4Xt2TyvnC/TxONfiqYOpjV/Nz43Xn/8dADQATRU0MZWJfJxncxf/8Y7u9/5ftU7qxJYtXEVOdU5NPnH5U8HAB3AcgXdGudNviEw7r6sw5O/cCcYkKb/H8BfBehKbAXq6ntoHffQ86cDgGsAiVhP1VJ5tCN/4WlQoHerQNq51ZPg6gQGmT8dAHQAyxXU3TmVkvVuOfD5fH+/ps/VteW/dS0j0725heYhlHvo2oUOADqA5QpaVpkOXe3w96t6h1V7BU2dd1lu/t8Pfa7qPNIBQAdoo7JK5LMobVX6upWu7DipnptPPQ9t5546t1TzSAcApOYzHbuqSNn2to/HPFTLzXrudACY9gtPv9ld65ahPAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABdklEQVR42u2aMW7CQBBFh4ieJqlwDVK4Ri5ATeEm4gQcgyJ1Ok7ABXKINESC2lTQ5AROEY0ERiT2ete7A+91Bq/3o50/OztGBAAAAAAAAAAAAAAAAOCW6dW9cfg4Kk+v98ddz2VCX8+JNa9v/Q/EYFz6TQcUH+8iIpK9zEuXCU/GR/nBqenHAdYcoGyWz0Fzdei9wbd+V904wJoDvj/fWk14bbxGkEbmZCFBnOBbf1vdOMDqHjBZfP2ZU//7vm6ODuWEUPqb6sYB1qugQb4++zx7Gv/Wy4ftee5cTWvl/moEhqqGfOnnHHCvDqhGhkZSMXttFDldR35q+nGAGO2Gup4k61Yfvh2Qqn4cYGUP0BWtRpIr+jytl0P1llLXjwMi47wAg3x9UUNbIhX9OMD6OUCjqOlJ8bKL2G39n4p+HGDdAdLyTVSsyE9FPw5gE2YBwOIeUK0aNBeGPtGK5y5obP04QIx0Q691FcVzr0Y6/o9obP04IDI/sHXkWJRcSOwAAAAASUVORK5CYII="}, {"id": 33, "name": "馬爾濟斯", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA0ElEQVR42u2YzwqCQBCHNXyEbsKeliD2EL7/Q0gHCaRT0K13sNMcXFzKbUynvu+44owzP3X+FAUAAAAAAACsQzn3hnp/GDQc3x99qWFn97MKpDJ9vXUqjr0LKsqYV6BKZf58aUfnp2OzyANM+BnmKGFeAQIwH4B3IflHeef63ytQfWogrguSbTnXqhtUYirx2t1orEiuEnHmJeNin17oVf+uPQ+IPVHUu0AvRACmKnEuE+8+E9lXSPVOuVsKPmIC2EoAS09edKPau1GtXal5BZ4CtVJM5JpDXAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABtklEQVR42u3csU7DMBSFYRfBADMbEhNCQgyI938IxICQEBMSG+9QJg+YWkkdO42T7x9bxb0+rs9JrtyGAAAAAAAAAAAAAAAAAAAAAAAAAADog93WJnxzfb+vMc73z8fO16d//c8sCSTACh00V+fn11uV8e9uHxc1L/qXzUsCYNOcn3AH71s4U6z79f3lz+tPD89NBDzwOfua86B/W/0lACTAGh00dNINSedJ/3n1lgCQAGvYyVO7Cbl766H3S+uP411eXdC/of6p3vHZJ9YvASABenDQoZ1cSlpXWm8r58/1selfV/9YX6w3rV8CQAL04KDH7vjYzZg6nyFy3Zm0j586f617aPpP018CIDgLtKCzHEPOUOqg6T3sqRhbP/3n0V8CQAKs0UGXNo9e6167/hIAQRdoQj+1F+fpHfq3QQJg09gAsAEAzwAbJe2Hl57VyV136q5NL88ypesw9vrcs4sEgATgoP+d6dhuR3pdrX9vWLqD1tY7p1vul3NT11ECQALM4ayh8f/c1HL6UqfLjVPr3HztdZhb99q61VpHCQCEwjMdh1wk9/rc41mHcbptXXcJgE3zC11w0w1s5mTtAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABMUlEQVR42u2aMQrCQBBFNyI2tnZCqiBICvH+hxALEcRKsPMOsRrQ4CJLZjM7yXtlgu6X+X93MiYEAAAAAAAAAAAAAAAAgClTpX5gu9l1Ggs/X7fK4geXpn+BBwtNQMwp98dFZeGmbrM6y4t+EmDMMuac8/X0df2wP2YR8GOdbkgSvOknAaUlwBrZo5u67Sy7pVTW6xVd0KwS0O8C+t3Fv/vWScilP1U3CfCagJgjxDmpju/vofI9uc4Abf08CU8lAeI46We1nDWW873pJwGlngH9CsoT5tA9MjZD0caLfhLgpQsSR2nP06Vfzt11lKqfBBhDASgAZ0Cw/G/2Y3YSPE0/tfSTgLklIDZ19OJ8bf0kgEOYAsAUCtDU7WhznhxY6ScBYabvhgajd0VL008CjHkDlpy19l8prWQAAAAASUVORK5CYII="}, {"id": 34, "name": "紅貴賓", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8UlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDel2ZCVUsDupi+E+NmBl+MQAL+b5oeRTxoqUPaeIATHsgMUNsTAz5GBj1wJD3QFDXGYagrjNky4/WA5QacGhWFArfLm0ZivihWWoMDAwMDG/u3BqNAZLaQqTWxCIqaljFcYU8rnwx4mpiRnJboeS2idBDHhbiMPNH20KE2u/U7g/AzIPFKKyVOtoWGvXAUKmJyQWYaf/MaI+MLgC9/iA35Ecz8agHBpsHaN3zGm2NUntslFpjpUM+BgDjdlvrOHyA4wAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB30lEQVR42u3cMVLCQBQA0MXxCHQWNg4ncMbOQ1hq7wEsOISFB6DX0kNQcwLGxsKOO2DhbEFgBZJNYJP3OuMk/v3r/p+skRAAAAAAAAAAAAAAAAAAKMNoaAO+Gk/WOa7zs1qO/PqUn/8LU8KQXfa1gqbi/JzeZrn+w2tYn9O45L/euHQAdIA+VdAY99vT9cbxl/fvVhK4/XP+xpVrHPLfbv51AHSAPlbQUMhuSHWc8t9tvnUAdIA+rOT698KLf++t932/bvzxenfTpfy3mP9qvuOzT4xfB0AHKKGC7lvJdc1njxtf3z9/bByfzyYhhBBWX8vM8S9CSR2s1PzH+GK81fh1AHSAEirosSs+7mbsE+Ma30x2jmdf3Kndmeo+frXy57qHlv9m+dcBCN4GzfCXyLiCUys8dW96qKYVtHoPeyqHxi//3eRfB0AH6GMFPbdxlBp33/OvAxDsAjXYTy2l8pRO/tuhAzBoFgAWAHgGGKjqfnjdd3VS551616aUZ5m683Do+alnFx0AHUAF3a5Mx+52VM/L9ekN515Bc+c7lbfUf841nUcdAB2gi8oaWv6cm1yVvm6lS10n13vzueeh67znzluuedQBINR8p2NXFUkd7/p65uGwvA097zoAg/YL2F/nVbk4Wt4AAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABW0lEQVR42u2aMW7CQBBFx1GOQCoKKCKfgDqHcBn6HICCQ7jIAeiTMoeg9gkQDQWd72CKMEJ2lIDRbmbHfq9CRmg/mv93x2OLAAAAAAAAAAAAAAAAAAyZrO8PppO8CbHwsd5lFn84Nf0PeNCWx75O+VovgixclNLEdJYX/SQgtQSoc96Xs9b11cchioCf63w7694keNNPAlI9A6zQPVr3WKtuqS/z6dP504EuaBQJKMrqz+7i2vfWSYilv69uEuA1AVrpyXPeuv7y9ikiItvNa+t6vd/duIe2HRjrDAitnzvhoSRAHaf97DXUGeoka+d7008CUj0DuhXUO0ytcLcruHWP7HYXsfCinwR46YLUUaHn6dovh5pSetNPAoyhABSAM0Asn81eZieVeJp+htJPAsaWgN+mjl6cH1o/CeAQpgAwhAIUZfVvc54YWOknATLSd0PF6F3R1PSTAGNOF5bQ2VPyE9gAAAAASUVORK5CYII="}, {"id": 35, "name": "哈士奇", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjVcPb6eQYGBgYGY03D/+RYiKSfKh4YeTEAAyFJWVjFJ3TmMzAwMDAUlE+kiwdGXgy0d8+myEJK9Y/GADp4YwVJ8yLHJmJN++jyo3mA2jGwxB/K8IeEtIyoOgMDAwPDk9c3UdQVHBsthWgTA7A0Dyv/MUKexvUB04htjeKqiQmBNfOmMWBrjcLMJ7V1OnLyAHpIUQrQzYPF6Jp500iKiSEfA2R7YEJnPrzkGZIeGDb1ALntfyxpn2G0FKIHQK8/yA350VJo1AMDnQfQSx1YWia3jTTaGiW3VUotMGJLIQBxMmAlYvfyUAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB9UlEQVR42u3bO07DQBSF4RPEEkIFNYgS0bGJNKyAkgZ3LAEBDW5okKgoWUc6RImghorsIRRhJDLY8mPGj5v5vwpCHCZ3xLn2jZEAAAAAAAAAAAAAAAAAAAAAAAAAADZMUnmju9P95d/vvxYfkyFfJzVjrf8WW4OUbaeWoC9vr5Kk48OjZeDxJOgG1J8OADpACgnqOz07L3z87vpCkpRd5qPcMOofFx0AdICUEvTq9mHQ4/1z8bbn4NQ/Tr3pAKADWErQ0OT0LU5WiTmd54XJ6f88VvK7BM9vMurfYf39ej8/3q+tnw4AOoCFBK36S27rafb7xWy1zr2dA0nS5/f72vOyuWKvX5Y6mNX6u/W59frrpwOADmAhQbviEtNNT/6tu2Ka4n+yqoqpjUv+WOfQ1D+s/nQA0AFSTtC666w7h6eD2ao/HQDi/wFaTAGGEppAQ70Pq+ve9PrTAcA1gALmqVaSxzrqL+4GBUY3BbLOTU9iTSdgq/50ANABUk5Q98mpSubdajiX9o/r+lzdWv39axn/GqPpPlTVverahQ4AOkDKCVqWTE2nHf5xdT9htZ6gsetdVjf/91c9r+4+0gFAB+gjWRV4L0pfSd826cpeJ9Z987H3oe+6x65brH2kAwBqeU9HUYqUPd7367EP9eqWet3pAEjaD56W6HqVsanWAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABe0lEQVR42u2aPU4DMRCFXxBHgIrUIErEVTgBJU3oOAKKaEKTBiknyFUQJYKaVHCHUI20mKyU9c/aA9/X7Wa9fpHnjcdeSwAAAAAAAAAAAAAAAAB/mcm+D54cnW6715uv90lMh7neU6vf3PoPiMG6HA5t8Pz6Ikm6PL/YxnTYaV/lD7emHwd4c4BxdX2z8/5iPpMk3d49JuXq0nNDbv2xunGANwfcPzwlddjX3iLIInO9WhZxQm79qbpxgNc5YL1a7sypljv7fh+ao0s5oZT+obpxgPcqyKoGY3p8Jkn6+Hz7cb+vqghzaBihpaqhXPpZB/xXB4SRYZE0NHLGjvzW9OMAbw6wEQ5Hft8cGVYXY9OafhzgxQGW08L98FjsfVYvD10nxPbXmn4cUJnoAVjMZ79qaE+0oh8HeF8HpO6fd/ZORq3/W9GPA7w7QIlfompFfiv6cQCTMAMAHueAsGro22NplVb04wA5ORvadzZSmfdqNPIZ0dr6cUBlvgF9kujN2zBASQAAAABJRU5ErkJggg=="}, {"id": 36, "name": "臘腸", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDWl6KhUpWYzef1JgZfjEAC3l+nh8o4h+/cNDEAej2wGKG2JgY8jFAsQe6/MQYuvzEyJYfLYUoNcA6zAvC2LSALPnRGKDUgKOrtsHTOgMDA0P4jGcMDAwMDCszpFDkR/MAqW0hUmtiXCVN2aZXWMUfPvvDMFoTk9IaRY8RcttE6CEPC3GY+aNtIULtd2r3B2DmIWJ0tC006oGhVROTC9DTPqx0Gi2FaA3Q6w9yQ340E496YKDzAHrrE9YPoN640WhrlLZjo9QaKx3yMQAAl7pX59ZCe1oAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB80lEQVR42u3cMU7cQBQG4EdEkSJSGkQBRbpcIjdIQQlX4AQ5BCegpE1Kitwgl0iXgi0QDRIFBRIUyIp22BFmPPYy9vdVaK01M7+Z97zD7kYAAAAAAAAAAAAAAAAA0IadpU34cO/rY43zXN383fHn037+H1wSlmx3rhU0N84vB7uVfsPm829rXvIvm5cOgA4wpwrajfvzp/u1x2/vPo4SYPp7unnVmof8x81fB0AHmGMF7evsaD8iIn5cXhcdH1op03nKf5z8c3nrAOgALVXQ3Eou9e34+/MPlxdFx0vH393LX93If8z807zTDqcDoAO0UEFfW8ml/vz6vVYpT85XERHx8/Rg7Xjtyv9v9RAtdbBW8/8/vs3j1wHQAVqooKUr/jXdvXE3/m7c6fGc3O5Muo+fVv5a99DyH5a/DkB4N2iF/0R2Kzi3wlNvvQceWkFf3sNuR9/xy3+a/HUAdIA5VtD3No9Wxz33/HUAwi7QoP3UNipP6+Q/Dh2ARbMAsADAa4CFSvfDS9+rk3vetndtWnktU3od+j4/99pFB0AHUEFfVqa373asP6/Wtze89wpaO+9cbrlPzg29jjoAOsA0lTVG/Z6bWpW+tNLlzzPtZ2z7jm/q3GvnVus66gAQhe/p2FRFco9PfT7XoV9uS89dB2DRngCDadXYON3sLwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZUlEQVR42u2aPW4CMRCFh2gLChQoEAUp0nGctFwhJ8ghOAFXoOU46VKEAtFEokiBBEUyxVoseI1hPPB95S6s38rv+We8IgAAAAAAAAAAAAAAAAD3TKftH16Gk32Ohr83nx2LFy5N/xMetKVq65TXcZWp6ePPz+UsL/pJQGkJUOf0e7+16z/b7lUEhO2os1KT4E0/CSh1Dohl9jYSEZGP5TrpfvMYfVkSbq1/8Nz7T9qOVZDrfcC5MVQd+rXanVxdxN4P21Enhb+LTYKV/lTdJMDrHKCO0DFSmc5XIiKyeB/XrseOoanOt9bPTvjeakFtd5Khk845Rx3eNLZe6nwv+kmAl2po6KjUmkrs6iL32F+qfhLgZRWkPZq/nv73vHxVSl/6SYAxdAAdwBwglmezYW3G6qzYSj8JeLQE3Grd70U/CWASpgPA4xzQVEe/9o5WMp8FW+snAfKg34aK0beipeknAcYcAJtU2BzI/eADAAAAAElFTkSuQmCC"}, {"id": 37, "name": "米格魯", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8klEQVR42u2YsQ3CMBBFLygjxBWu8Rp0NEyDxBRIzJAhaOhYA2qoyA6hOiSMT06ck4LNf6Vjn+X/k7uLiQAAAAAAAAAAzEM1dsGyWfUaGz+6W6URZ1GsA5LS9+dVZWNrnIoz2TtQS8oft83H+O7UERHReb8OBtocLsFxaT7zvQ/1Y5woz4GhSIrH5sUc+bssVE9VnrOJlJ385+/1rYMDk74BqS74imvVDVRiVOK5u1HfkVQnfOVZcY6PXijWv2v/D3A8dtQah15IFe3eBw5oEXj3UQeSlNOqyKm3FNk7gAMUcwBrnNhhwoFfvBvVuivN3oEXXl9lXDvbY5gAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB3UlEQVR42u3cMU7DMBjFcQdxhDLBTK/BxsJpkDgFEmfgECxsXANmmOAOZTISbqy0iZPGye8/hsZ8fq7faz65DQEAAAAAAAAAAAAAAAAAAAAAAAAAUAfN2iZ8ubnelRjn6+ej8fapX/8zSwIJsEAHzdX5+f1eZPyri+2s5kX/fvOSAFg15yfcwbsxnCnW/XS3+Xf9/uUnhBDC68NN6323j2+t13Ovj+z/n7ArOQ/6j6u/BIAEWKKDdpGrt+t1XfM51inTedJ/HP1zeksASICaHDS3k/vWHbsJuc/W6d//7n/eDqo/jtc0Df1H1D/VOz77xPolACRADQ7atZP7ktad1luq69JSf6gpwWrVP9YX603rlwCQADU46LE7PnYzhs6ni9id6erjp85fqstC/2H6SwAEZ4FmdJajyxn6Omj6GfZUHFo//afRXwJAAizRQec2j1rrXrr+EgBBF2hAP7UW56kd+o+DBMCqsQFgAwCeAVZK2g/ve1Ynd9+puza1PMv0XYdD7889u0gASAAOuu9Mx3Y70vtK/XrD3B20tN453XLfnBu6jhIAEmAKZw0j/85NKafv63S5cUqdmy+9DlPrXlq3UusoAYDQ80xHm4vkrk89nnU4TLe16y4BsGp+AW/YByXqnUHDAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZ0lEQVR42u2aPY7CMBCFB7RHIBWpN9ego6HmIEicAokr7B5im+224RBQQwV3CAUygoAVsrEz4/B9Zf78kN+zx8YiAAAAAAAAAAAAAAAAAH1m0PSF8eizDNHw4bQbaPxga/qHeNBoAnxO2R+3QRrOsyKqs1LRTwKU+fA5Zz0b3V1f/JxEROR3OXn6oenq7+l13/OOx3akbJOE1PSTAGsJeBWfY+qeq3OUG6PzrChjVkuh9c+/NpcEeOYGEtCXBDhHVKuAanXhu3911HehkoTY+pvqJgGpzgG+eto5p2m97cbQ6ndizQGh9bMSZiX8v5Wkb+xt6/xU9JMAq3NAtQedo9qOkXnDOlkC7VZa1U8CUqmCnKNC76e7ejl21WFVPwlIdR3wKnV7P9aJrZ8E9D0BdXX6zd6J6n/FWvpJQKqnIkKvKLtyvjX9JEAZOoAOoAOCjYVd7fPEQEs/CXjXs6GidFbUmn4SoMwZ0uzW/WwFxhoAAAAASUVORK5CYII="}, {"id": 38, "name": "大麥町", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA90lEQVR42u2YPQ7CMAyFHcQR2EAtQ8XSK7Chnhqx9QosiAEQbNwhTJFaS5Hz4woa3re1VZ3ovcR2QgQAAAAAAAAA4DuY2B/Wq53VGPj1vhiNOItiHfApfX2cVQZuqlbFmdk7sPQpX283o/f323P0fNh3RER06o9ZE+DjEJGNcaI8B0KJVV7LMTjgyya+7CR9hwO5AbiyXPGplC/XgUH+tRqOSPD68neV2KR2oalrm/dATnEXH72Q1L+HngekysvjOUebqkUvpIJ2zwMHcnF7gme1wdpHHYiqB0653D4/VXnsASnbTHUCgwOhJzPUgV+/G9W6K529Ax+dtHS6GW+uRwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB7UlEQVR42u3csU7DMBDGcRfBADMbCBgQC6/AhnhqxMYrsCAGQLDxDmHKUIPb1LmkTfP7b21l9+5zc19ytpoSAAAAAAAAAAAAAAAAAAAAAAAAAGAaLOaW8NnpTRMxz/fP68LPZ/r6H1gScIA9rKClON8+X0Lmv7643am86F+XFwfArDnc4hXcDFGZ2rgvr86X3v94/1p6fX/3kFJK6en5sVce+feklJrIPOg/rP4cABxgHyvoOjaNOyrfXOc8T/oPo39Jbw4ADjClClq6kvt2E0r31us+r42/ne/45Ij+A+qf690++7TxcwBwgClU0HVXci15XHm8Q1X+Uh+b/rH6t/G18ebxcwBwgClU0IodziYin3Xk3ZlSHz+v/FH30PTvpz8HAAfYxwpa6q9HkecZ1WWh/7j6cwAkp0ErugDRdL2C+95D1+bRt8JvK276r46bA4ADzKGCbhp/33jz8WPHT/9u+nMAJF2gEe4pt336Mg181iZ6PP3H0Z8DgAPMuYLmZ3Jqz+qUxo29E7vr+q84m1O1Dl3Hl55dOAA4gAr6tzJt2u3Ix0XvfO5qBY3Wu6Rb153lTdeRA4ADjHQ6MA35PzdRlb620pXmiTo3H70OY+serVvUOnIAIFXu6P1XRUrvjz2fdeim29x15wCYNb+aTkZcdWq1agAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABaUlEQVR42u2aPW4CMRCFB8QR0oEgBaLhCnQoh44QDeIKaaIUAUHHHZbKElgyu9ba6xnzfR0g1m/l9+zxjwgAAAAAAAAAAAAAAABAzYxi/zD9WDUpGr7efkclXlib/jEeVJqAkFP+zj9JGl7O11mdZUU/CSjMJOScxefs6fvT/+Xp83bzJSIi++OulwC/HRFp+iTBmn4SoC0BXYl1TlfHuTF6OV83Oaul1Pr3h++XcwMJqC0Bfk/71UXb723kTkIu/bG6SYDVBIQc4ZwT63g3hvrPyTUHpNbPSriWBDw4rknprKGcb00/CdA6B/g96FaYfcfI2DpZEu1WatVPAqxUQc5RXffT21aO7nmuXs5ddWjVTwKsrgNS77VoYyj9JKDWBITGVL8qedg7KXpWXEo/CRCjtyJcz/c9WRra+dr0kwDrc0DIOanOXEtVO0PpJwG1VEH+Hou1dUAp/STgXe+GSqG7otr0k4DC3AHKlfDWatcCwgAAAABJRU5ErkJggg=="}, {"id": 39, "name": "黃金獵犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/ElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJD+uoKC6pYrB3B8J8aMTP8YgAW8vtaJFDEnWpe0MQBmPZAYobYmBjyMTDqgSHvAe2IEwzaESfIlh+tByg14O6RIhS+sk0fivjdI1YMDAwMDD+eHBuNAZLaQqTWxBwykJBmn/6JgYGBgeFnJh/ekMeVL0ZcTcxIbiuU3DYResjDQhxm/mhbiFD7ndr9AZh5sBiFtVJH20KjHhgqNTG5ADPtnxjtkdEFoNcf5Ib8aCYe9cBg8wCte16jrVFqj41Sa6x0yMcAAM44XXRG76RHAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+ElEQVR42u3csU7DMBCA4StCggkxMCDBhsTCCyDEhHgIJFYWVmZGZlZegadgqqq+AEulbkViYGKCqQyRh7i4SZxLmrP/b6NVwvmM7xI3VAQAAAAAAAAAAAAAAAAAAAAAAAAAYMMotwEfHZwuNc7z8TUb8edjP/9bTAlytp1qBQ3F+f56rnL+sxtZDmlc5D9uXHQA0AFSqqAu7renw9LrV4+fnSRw9fcU49IaB/nvNv90ANABUqygYmQ3xB8n+e8333QA0AFSWMnx18LTtdfWVe/Hxu/Ot389I/8d5t/Pt7v3cfHTAUAHsFBBq1ZyrPn4ofTzyeVz6fX5+EJERH4WE+X4p2Kpg1nNv4vPxevHTwcAHcBCBW264t1uRhUX1+5xEefi9k5ERH6990NCuzP+Pr5f+bWuocl/u/zTASA8DarwSaRbwTsv38UKvt9bu4KbXgO3raD+Neym1I2f/PeTfzoA6AApVtChjcNq3Knnnw4AYReoxX6qlcpjHfnvBh0AWWMBgAUAcA+QKX8/PPZZndBxm961sXIvEzsPdY8P3bvQAUAHoIKuVqamux3+cVrf3jD0Cqqd71DeQv8513Ye6QCgA/RRWaXj77nRqvSxlS50Hq3n5rXnoe+8a+dNax7pAIBEPtPxXxUJvd73+ZiHennLPe90AGTtD8aO7CYYgFoJAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABYUlEQVR42u2aMUoDURRFb8TCBQgKsRAUm9mAiFVWMWCbFaS2tHYdrsJKZDZgI9hFSOECtEqK5BHGgMmEP77/Zs6pwg/h3/Du/f/lZSQAAAAAAAAAAAAAAACALjNo+oHh8dU8xcafX+8Djy+cm/4DPOjLYVOnvD1dJ9m4KDVv01lR9JOA3BJgznl+OK2tj+5nrQjY3GfprH2TEE0/Ccj1DvDCzmg7Y726paacXJ6vXs3ognqRgKKs/uwutr3vnYS29DfVTQKiJsAqfXR2U1u/uH2UJH28TGrr39PXHc/QugPbugNS6+eXcFcSYI6zfnYb5gxz0vRuLEn6cXJ+NP0kQEGmob9nK/vOVHbtPlKf/bnqJwFRuiCraOp5uvXLqaaU0fSTAGcoAAXgDpDnf7Pr2UmlSNPPVPpJQN8S8F99fxT9JIBLmAJAFwpQlNXGnCQSXvpJgHr6bKicnhXNTT8JcGYBmC3NzMG3RREAAAAASUVORK5CYII="}, {"id": 40, "name": "邊境牧羊犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABC0lEQVR42u2YOxKCQBBEG0tvoIHlJ9QDGBlYxZE8ikcisYg4gIZ+ygBvYIABTjK1KywuItgv47fLTi8zPQCEEEIIIYQQQpohcH1gMlxkPia+3o+Bj3F6bVeg7xrp2Xz8dsA4iQAA61VYNHfmQ5nuKSCR15E+n261vIBB0cxFidYrwAX8bBYqS7x75FlnOzBmH32dCvhWAJv9K//nh9PREgBwSQ/qxpAKOHkh10osFVhjq8i2uvJ3lTio6kKLPJENHXmJuIxPL1Tk3333AwbvRS9UrgInkTXz0At9oyfWlbZEB2bMQrL35TyzUN3YOr2qfynY0HABTX0DOuvIXq7qkajAp64SNf8/6qwCT30+YsgVzZ1yAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB8klEQVR42u2cO1LDMBRFbxjYARQMnxIWQEXBTJbEUlgSDZOKBZASyFCQHVCYIqiIxi/SyLKxpHO6fOw8XUX3Os+xJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKINFawO+OL3pcuxns10v+PqUr/8RUwItc1yrg1p1Xl2fH9xu9fosSbq/W4Y+opvTuNA/bVwkAJAANTmoq9uv8+P9axQBe/Toco4D/cfVnwQAEqBGB1Uh3RB/nOg/rd4kAJAANazkVFZPP7tj5seT3mNn//Vc9Tvn3WzX6D+i/j2Julc/CQAkQAkOGlrJyTy8/HVPdg8vz24lSZ/fb94bl1nrz3VMj/6KPd/RWz8JACRACQ6auuJDOMd0/XO/7lA/3XJyv4/vO3+2Lgv6D9KfBADxb9AMZyLdCrZWeOzKVaBfneqgVn99amLrR/9p9CcBgASo0UHnNo5S665dfxIARBdoWD+1COcpHfQfBxIASICWsboniuxDQ9n6kwBAArTsoO7MqYx+txL75LFXcLWmv/9bxtVn6Raah5Duod8uJACQAC07qOVMCd2Ove1y3b1h7g6aW29LN+vKuaHzSAIACTCRs2rM+9zkcvpUpzuwn1lcYxvroP9dV6xuueaRBABQ4n86+lzEen7q/TEPcbq1rjsJAE3zC5nqzfkKuz/QAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABSklEQVR42u2aPY7CMBCFJ4gjLAUCtoQDUNFxdDoqDrCU+yMKuIOpLIGFCd5k8Ax8X5kI8pDfi59tRAAAAAAAAAAAAAAAAABemab0A5OPeejjwX+nfVPjB1vTP8CDdRmWOmX2Ob77hdvdRkREVst127ODprO86CcB1hIQnZM65ef7oCLghiNDlyR4008CrM4BtbhwVKjZlp4FCfCagPSdGp0b20PuvpUkaOkv1U0CvCYgjnTszZHpaCEiIr/Hr6vrD/Tqmw7VmgO09TMHiPO9oNKVZOqkNudEh+f6elfne9FPArzshqaOKm01be1D+91vVT8J8NKC4ogq7KeHLo70rp8EeN2K2O422ebgASv6SYDXM+H/rhRzLUJ75WtVPwl4t/OAZ/V+L/pJAJMwAwAe54C0NeR2B61iRT8JeJUzYVH+/03fWNFPAipzBmW605qfFffxAAAAAElFTkSuQmCC"}, {"id": 41, "name": "俄羅斯藍貓", "kind": "cat", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA+0lEQVR42u2YMQ7CMAxFXcQBGNhgRhwIMcPCxMBhMmWBGeUeLBwAMcPGwA3CFKlEipI6lgLJf1vVupb/l2O3RAAAAAAAAAAAytClPjibLmz/+vm6d5yEUu9xjP7dgfHQgMfxRERE8+3GchL24kUKaM8Bx2q3/4kC2nPgcLlmJcyNr98B/5yOMVnfiIjofV6y7ofypc6H+hwIVR5SylfWaPV1SoWUxySW6oHc+dB8D7C3Ue4kdj3C7Tk/rp1J7CrO7ZFU5WMOG61s29uoNCHl/Z5ptwdKKR+bB3CglPJwQHpXGqp8NQ6IFWC0Cp7Z+CshsY1KfS9wd6RqHfgAOSBs2JPszg8AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABwElEQVR42u3bvy4EURQH4LPiARQ6avFAoqZRiXgKvUSloRbvofEAoqZTeINVTbKGm53/O3fv9zWC3J0752bPb+fObAQAAAAAAAAAAAAAAAAAeViUcqIH+0fL1d8/v94Xm3yd0sy1/juWhpLtltZBPx4eIyLi8Pxs2XO8DroF9ZcASIASOmjdycXlLD4Tt+3A6j9svSUAEiCnDtq1c1auX157Hb/v+Gr+Vf1ub67Uf8Tx9Xo/39/9mr8EQALk0EHXvZNTuxzr7J2+RUTE99Nxp/+njpea18r8I6cEy7X+1c9qvvX5SwAkQA4dtKnUuNRx6vOqOnPVKVLzHmsfXf2nrb8EQAKU3EH77q40PV79s3/qvNV/2vpLACRAyR10bvdB1H/a+ksAwvcBOuwDb8q6DjTX88h13ttefwmAa4Bosb9bv6OWS+fJnfqPQwJQNG8AvAHANUCh6k9ldn1aMzVu07s2uVzLdF2HpuNT1y4SAAmgg/7tTG13O+rjhr7zOdcOOnS9236/ou86SgAkwBSdNUZ69mXoTj/Uc/B9E2XsdZi67kPXbah1lAAQHZ/p+K+LpP4+9etZh2Z1K73uEoCi/QCfPPdat0zu3QAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABWUlEQVR42u2auw3CMBRFDWIEOqiZiAGgoaJgmFRpYIDsQcME1NCxA1SWkCWT2HmO/fA5HQLbF/ne509iDAAAAAAAAAAAAAAAAMA/Mxv6w9Vy8/7+/HzdZzEDSvWTa1xp/XM8mJdFaIPH+WKMMWa9371jBvxqn+UPl6afBGhLgGV7OCat1anXBmn9sbpJgLYEnK63UQP62lsHWWd2bZMkCdL6x+omAaUlwN3n+uja5mdN7ft+aI0OdVRu/aG6SUBpCfDNmOssnyOsc4Y6xq2hbj+ha8DU+jkH1LoGSO2vpZyvVT8J0LYGjK2R7u4i1sk+ndr0kwAtJ2E7Y2NrrNuf3S+H1uLQ80Gp+kmA1ttQKVxn9p1Ip36Sllo/Cag9AdInYW36SUCtCajd+SSg1gT03UKW7nxp/SQgM2IT0LXN4HuSEsmlnwQYJe+GSt23xz7RSvWOaG79JCAzH/xABcyrJFa6AAAAAElFTkSuQmCC"}, {"id": 42, "name": "蝴蝶結白狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u1XuwrCQBCcSAo/wE5JFQRJIaa18Wu0tra2ttavsbGNWIggVqKdH2B3FrJCQvTyOMXkZrp7sMvO3N7uAgRBEARBEARBWA+1WCu1WKus63/x16g68U4aMwAQRREAIAzD58XpyAGAdqtrRIXr7ehk8Vd7Bdwk8xK5rDvzcez8PhkacdxcbmL2L7MV0vzrlKhfDsgb3x22sf1+bwAAOJ33Rhz7XoBPfiRHap8DDKDyAfhe8HrPRc6tV8AtayD5Kwnbsm/q17KnDiTrgY7xsnXgXY9EBXSKFFUiybwwLvatU8DN27+bngfEnijqe4FiL8QAqlSJiyLl7YO/0C/wrnfKyzyTmAH8WwDfnrzYjermBFO9kXUKPABTMJo+rW0QqQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACLklEQVR42u2cMU/CQBiG3xpN1NlNwkRICAOBxMnFH8Iss7MzM7P+GhZXjIMxMU5GN9nd6kDOwElte1xbrn2eDaR3H+/le9/r2SABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABURDybx/FsHmd9Hdp86F/MfAe0DjSZaL1jJCm6uYqyvPbRwUXMZ65bLBaSpNFopPVxzs+6Xlzo8+s1yjJf1XqgPwkAkJ4AdXXQ1vRakvRxey9J+p5cehHu+O5B28YnwcLSnwQAEqBODmoc8unlceP9QW8oSXp7f/ZSf6fd13/zGIdtWoKFpj8JAI3m8DcKrD3mcnyx6rDxqsNapoMnfjrYOI/p4KVxkGnX62nHvmJ0Nk6F/uXqTQIArCdA6J28614yaW+a9nfX+s14J6dH6F+g/rbenXZ/o34SAEiAEBw0rZNdseuy6y3K+c086F+s/qY+U69dPwkAJEAIDpq34we9Yezj+6Rhzp2THNMe1+jjaw+N/rvpTwKA+E9whg5y7dC0vWteZ3B1UHsPWxVZ60f/cvQnAYAEqKOD7tv3CLXuuutPAoA4BdrhPDUU5wkd9C8GEgAaDQ0ANAAA9wANxT4Pd31WJ+m6qk9tQrmXcV2HrNcn3buQAEAC4KB/nSnvaYd9na9fb9h3B/Wtd5Ju9vxpn8u6jiQAkABlOKtyPvNSldO7Ol3SOL6em/e9DmXr7ls3X+tIAgDI8ZmObS6S9H7Z47EO2XRruu4kADSaH4s9zD34YdtnAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABiElEQVR42u2aMUvDUBSFT0RE6OqmZApC6VCa1cVfo7Ozs3Nn/TVdXCMOIoiT6OYPcIuDXDChlSR9L+89+31bmjbvwD3nvptHJQAAAAAAAAAAAAAA2Bnq5aqul6u663Vs66Wqfw/rhSVbV1lJqqpKklSW5c8Xr84zSTo+OnXioo/Pl6zLekOcmZJ+EhCY/bZzrHJ2fXJz0bj/dXnmZOHD2/vG89+v77Ru/a5OSlU/CYhtD7Ae+fj80Ph8Pl1Ikl7fnpwsXOQz/bWO9di+pKafBMSyB8SCObTIZ/U2SRibyeRg0O9IQKoJsB7Ydm7X+6GT4Et/X90kINUEbHKEOaev49s91J7jaw9wrX8oJCC2BJjj5tNF7dJZYzk/Nf0kINY9oF1Be8Pctke2pwtfpKKfBKQyBZmjXJ+n27zse+qIVT8JCAwFoADsAUGwXvzr7EQpnX660k8Cdi0Bm04dU3G+a/0kgE2YAsB/KECRz0Y75/FBKP0kQJH9L6jr/CvPp5e+5/dY9JOAwHwDBlNF51RzbPsAAAAASUVORK5CYII="}, {"id": 43, "name": "巴哥", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCF9dkcZVSw29uiiSswM+RhgwRXy8nJSKOIPHz3Da9DDBw+wissrKODVh24PAwPDf1JiYvjFALmAUEjTCgz5GGCiRmmCq0QhRn7ExwDFeUBfR4uBgYGBIalkCwMDAwPDxSvXUMRh9GgM0LomhsUAOpjX4zNaE1OlNYoeI+S2idBDHhbiMPNH20KE2u/U7g/AzIPFqLFH18hqC416YNi0RsntWyOl/dEeGV0Aev1BbsiPZuJRDww2D9C65zXaGqX22Ci1xkqHfAwAAPbJVwJoXNOpAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB/klEQVR42u3cMU7cQBTG8QfiCCkiIgFVigiJghwiBadAHCHKIaKcgVNQ5BIpkBAF1RIpqbjDUk2xA8Mae+zdWf/+zUq2ZvbNNzvvs59nHQEAAAAAAAAAAAAAAAAAAAAAAAAAaIO9uQ3404fPyxr9/Ht62PPzaV//fVMCDrCDGbQU55/fP6r0f/7t51aNi/79xsUBMGsONriCl2NkphT38dHhyvHHv//fbPe4WLx6/Pjk5M12+fdExLLmOOg/rv4cABxgFzPoe1kX51jXyPk46T+t3hwAHKClDFpayUOrCaVr63Xn+8af+vv49Yr+I+qf653ufVL8HAAcoIUMum4l9+Xs9EtERFx+v4mIiNu7+5Xj6bN25i/VselfV/8UX4o3j58DgAO0kEF7POHs9MT0+tfFSvx5vOl8sfpSqM7kdfw889e6hqb/MP05AMJeoApPItMKLq3wrns5SgzNoPk17KboGj/9p9GfA4AD7GIG3bZxtBr3ruvPARCqQAPqqa1kntah/zhwAMwaCwAWAOAeYKbk9fC+e3VK7TZdtWnlXqbvPHRtX7p34QDgADLoy8z03mpH3q7W2xu2PYPW1rukW+mfc0PnkQOAA0y0OzDGfM9NrUzfN9OV+qm1b772PEyte23das0jBwCi556O17JI6fjU/ZmHbrrNXXcOgFnzDCO34VMKNSMlAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABaklEQVR42u2aMW7CQBBFxxFHSEWk4CoFikThS7jIEahyhiiHsDhBihyBKgWXoIgUUVABElS5g6lWwiswtll7ds17jSVb9n5r5u+OZy0CAAAAAAAAAAAAAAAA0Geiujc8Pb7kLgbe/68jjRf2Tf8DOeipAy5lynLx6WTgJM1azaxQ9OMAZQaXMmf0PCyc3+4OpQ/abjZnz4/iuPQ+exwRyW9xQmj6cYBvDmjKtUypipmjkzTLu6yWbtU//5qWrg04oG8OsCNtVxfXrms7oS39dXXjgFAdYCL9/vFTOP7+rUREZPI6bjSH2hnY1hrgWj9fwn1xwEnGVeqZfM/eChlkZ4653lXmh6YfB0gg3VC7t9K0p1K1+nA99/uqHweEUgWZiLrup5t62VWXMjT9OEAZAkAAWANEc2/2pHeiulespR8H3JsDuqr7Q9GPA1iECQD0IQBJmtXeD/UJLf04QO7031BR+lfUN/04QJkju5DQiK3AbbIAAAAASUVORK5CYII="}, {"id": 44, "name": "雪納瑞", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/ElEQVR42u2WMQoCMRBF/4pHsLMXa/EcdoJo5xXsJWy/V7BTBDvPIXYLi72dd1irgTVG2cSsbsx/XcJkwszPTAYghBBCCCGEEPIbkrqG/d6grK6vt0vicqEvP0IndAW6tgc2hx0AYDmdly4XVs57CSA+BYSVWrcigPgUyPMCALCYTR72t/uj0b6uHRWwRTKZqfRtTYyG40ZrJl4FhHNxMmZc9qUGfL99KqDXgmRaV6SpzP+NAs7TqGtXka6lT6Pi33Y6jacG9Ex9iu5PFM1UaqVE8AowgOD/AVcMbx/sQt9A/z9cM88iZgBtCyBT6dOcQwV8TqOvplJfRNuF7jkGXZSnM+1UAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB2ElEQVR42u3bsU7bQBgA4D+oj8DWHTFXPEe3ShUwde4EO4qy8wrdQJW68RyIDSnqztZ3CNNJcMSNsS9Ojvu+LZbt/P5P/v/4fIkAAAAAAAAAAAAAAAAAoA6zVi708+HR6uXnp39/Z7s8T2v2Nf8HhoaWfWqtgv76cxsRET++na5GHq+CfoD86wDoAC1U0Nzl/KrKAZP/snQAdICWKujj4zIiIs6+f321/eb33dr9++439Lf40N/g8l8m3zoAOkBNFXRs5czjuJ4v/ltRvxyfFK24Kf50vouf5/K/xfzn+b6eL17FrwOgA9RQQTfdyUM9LO/Xxpu2pwpaqnK+iD9q6mC15j/Fl+LN49cB0AFqqKDbkuJKcebXsynu/M3qplmbVLFLvYGV/3H51wHQAVquoENnR/ZlHl7+w5tgiG3/HyCfBdiVsRVoV9dRa9wfPf86AJ4BYsR8ai2Vp3byH1aDghsA3ACwJ+8BapevyRm6VqfruFrX7U/9LDN0HPoe3/XsogOgA6igbyvTe2c78uP6vmGtvYKWzndX3vLv37Rf33HUAdABpqisMXItylSVfmil6zpPqXXzpcdh6ryXzlupcdQBIAau6VhXRbq2T30+49Avb63nXQegac8UQvLHs8S6DgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABXUlEQVR42u2asW7CMBCGj4pHYGOvmBHPwVYJtRuvwI6i7HkFNlClbn2OqlukqHs33iFMJ4UIUGLsnA3ftyCQHf/I958vJ4sAAAAAAAAAAAAAAAAAPDKjrgOnk9e6+f3/+DdyWdDXc6zW9a3/hRi0Zdx3wu7rICIi67f32mXBxnyTPxybfhyQmgOUTbYNmqtDnw2+9bvqxgGpOaAsKxER+Vgtz37ff35fHN91nEaQRmaR5UGc4Fv/vbpxQKpnwHy2uJlTiyw/++ybc0M7IZT+vrpxQOpVUDtHamT9Vj9Oub8dgaGqIV/6eQ94Vge0I0MjqW/kDB35senHAak54FpV0DVH6nwrYtOPA1JxgOa0dj/cFX2e1suhekux68cBxrABbABngAkXuoiD1v+x6McBz+YA6zff2PTjAA5hNgAeYQOKLDfv86SoHwdIIndDr92NFM+9mqHviFrrxwHGnACKS97F+i4NmgAAAABJRU5ErkJggg=="}, {"id": 45, "name": "博美", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABD0lEQVR42u2XMQ6CMBSGX41HcLMzJzAurN7CicR4CA7AIYyJF3HtQtzcmOvmHcpAaqBKSluiSP9vg9I27//pe69EAAAAAAAAAAB+Axv64XqVqPbz41kxnw3HWkez+HcHlq4T5O1ERER8c1Q+G7bmjxJAfA68lLxsJxFAhA7cz2E7hs6fmwPWAJTIlRJ5b8bhWUk8K8l33LZ+vGdgqCpS5F3F06LzXopdM1BdrU4TEbG0YHCgrYTVCa1s0igt94fP47amzFH52Tjg3Y36VmIzI+luVK/v2p3GU4lNpUIx19OO8oycnJh/JUYAU70PhPL+75eELPQNzPrhqzwOMQKYWgC2mxccCO1G+7rSsYg2C9V5vmvqgKWJrgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+ElEQVR42u2cMU7DMBiF/yCOwEbmngCxdO2KOABTJcQheoAeAiFxAY7AmqViY8uIwoa4QhgqS8SJsR0cp46/b0tTu3+elfcSx6kIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkQZHLgV5erNrf259fdTFnP7lxqvqfMTSQM+e5OWjz9igiIuXVQ/vP9jjoAvQnAYAEyMFBe3U8Xyc5YOgfFhIASICcHFTen+Ztr12Lj70GR/8wepMAQAKk5KC+ztlWu1ZEpLx9Gdxfbg9/Oqptv+q/WO8Ln/pVf8VNjf4T6q/rXW6lUz8JACRACg5qO5NN/Vqvpatdt971vvN5U22OO+pXJ53cneggKSVYqvqr+lS9ev0kAJAAKTioL6of63GoulbHOpu7++H9FpRD609a9Vkb5ci2a2j0j6M/CQAkwBIdVD8OU7+9Ojdq23Ee/vtjknl59I+jPwkAwvsA4j9/PRe+DnQqx5Fq3UvXnwQA7gFcMM2npuI8qYP+wmpQAE4AAE4AgJnfB1gK+poc37U6tnbJrtuPfC8zdhxc25vuXUgAIAFw0L4z+c526O2sTz4X4qCh9Tbppv++7Xuu40gCAAkQw1nF8X9q5nb6sU5n6mdsokw9DrF1D61bqHEkAQBk5JqOIRcxfR67P8bBTbfcdScBIGt+ALHGIFy0/ZZtAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABfElEQVR42u2aMW7CMBiF/6AeoVs9c4KqC2v3Lt2YIqEeggNwiAqJC7Cwd2WJurExorChXiEdwIgU0SSOHdvh+yZIsP2Q34vtH0QAAAAAAAAAAAAAAAAA+kxS94NPj8Pi8v3+sE1MBrTVj69xbesf4EG/PDRtkH9/ioiIev4oTAa8aO/lC4emnwTEloCzExYvTp/VrtcG2/pNdZOA6BKwmbcb8UZ77SDtTJWKmyRY1t9WNwkIPQHFelqIiKi3Zem6SrN/n6lV96v6t5UE1/rz1fvxxc/OSDcJCDUB2jmVu4jha9k5o9nx/npabrD9arQr0Q5s6/yu9HMO6FsCktEsqeOkszNOTsrHk2bOOT07bTk/Nv0kQCKthpqeJOvuPmzv/0PVTwJiOQnrGf3rJFN0f3q/7Kq2FLp+EuAZJoAJYA3wwnUVMev0N+JQ9JOAe0tAV/v+WPSTABZhJgD6MAEqza7qJDHhSz8JkEiqobeqimK5VtP1f0R96ycBnvkF6XXsH8KSuSkAAAAASUVORK5CYII="}, {"id": 46, "name": "比熊", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2YvQrCMBSFT8XBB3BTOhVBOohdXXwanZ2dnTvXp3FxrTiIIE6imw/gFocSocGfJK1iyPm2tOSGe06Se1uAEEIIIYQQQmpGpCsh0pXQHdvScF2owHRCp90zUu08XwIA8jwHACRJUiw8Gwd1JOC8A01TpY+nnVbgVrYGANymo0L5DKWxQLH/u4tJad7legj8PgNS+e1+U3o+6A+NHPhEFMZ4t46uE847wAScTyAK48d+tnnPOlA1gHorSbXl87puLf96oaqVWLcOqLAS6zpi64SqvFRcxvfOAe1bSFWqKmo86WgUxoK9EBNwqRLb8mTvg7fQL3jVO5kqz0PMBP4tgW9/ebEbtf03atobeefAHWKoc9qCieECAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACCElEQVR42u2csU7DMBiELwgkYGYDdaqQUAdEVxaeBmZmZubO8DQsrEUMCAkxIdh4ALYweaipGzuxHZx835ZUTv6c5TvHSSMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMhHrxUNeLh9p3G8rUfwupYcxUKUewJFXXF5XPdi4OD46DXOPz5l6StFwuJUnz+Vx91I3+afQnAYAEGKKDuup8/3jxar979yhJ+rk637h9dHu50u7r+60iwcrRnwQAEmBIDmrqfn59Wtl/enIWVH8T08lMm84T6zrQP63+JACMmu3QEeyLcRrXtnGeNeepc8yl+8bobF8n+ufVmwQAEmAII7nrXNI1N236vW395nh7+zvon1B/W+/pZLZSPwkAJEAJDto0ktti12XXm8r5zXnQP63+pj5Tr10/CQAkQAkOGjrizWpG1+tpwrU6Y6/j284faw6N/t30JwFAPAlO8CTSd+4a6gxtHdSew/aFb/3on0d/EgBIgCE66H+7jlLrHrr+JACIVaAO66mlOE/poH8aSAAYNQwAYAAAcA8wUuz18Lbv6rja9b1qU8q9TNt+8G3vunchAYAEwEH/OlPoaofdLvTrDaU6aGy9Xbq5/jnXtR9JACABcjirIn3nJrXTt3U613FivTcfux9y6x5bt1j9SAIAqOU7HetcxLU/9/HoBz/dxq47CQCj5heqFUkxME3coAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABgUlEQVR42u2aMUvDQBiG34iI0NVNyRSEkqE0q4u/RmdnZ+fO9dd0ca04iCBOops/wO0cwoENxPRirneXPs+WliRv+d73vsvXSAAAAAAAAAAAAAAAAD0xi5Uxi5XZ9nhf9R9glbBkriecnpw7Vf3j9l6StF6vJUlVVdU3vrnMQvzg2PSTgMAcujrl7f15qwsfLx8kSd/XF7Vzlto4NqrXz7O7q43zPr9eM59Oj00/CYitB1jnPL08bnw+m86dHNRFkZf66z59k5CafhIQaw8IhXVokZdmyJ7gm8nkiF3QXiXAroFtu4uu70MnwZd+V90kINUEtDnCOsfV8c011F7HVw8YWj9PwmNJgHXcbDo3QzprV85PTT8JiLUHNCtonzD/u0Y2dxe+SEU/CUhlF2Qd5TpP77qe3S/73nXEqp8EBIYCUAB6gEL+N/trdqKUpp9D6ScB+5aAtqljKs4fWj8JoAlTABhDAYq83Nmcxweh9JMAjfzdUPWcXsbybqhv/SQgMD9Oi/kQd/r2gwAAAABJRU5ErkJggg=="}, {"id": 47, "name": "小花貴賓", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/ymx8En1LIjFhQ6M1PAA01CPARZSQ3pdmQlZFpmxpkEYwV0MDAwMDP8ZDvxnYGBgkGlNQ1H39M0txpEdA7CQ74uWRxEvWvqQIotO/YakfbO1ZQzIIY9pD8N/UmJi+OYBWgFYTFALDPkYoNgDQV1nGIK6zpAtP1oPUGrAoVlRKHy7tGUo4odmqTEwMDAwvLlzazQGSGoLkVoTi6ioYRXHFfK48sWIq4kZyW2FktsmQg95WIjDzB9tC+EC6CFFKUA3DxajQV0jrC006oER1xpFL9UQaf/MaI+MLgC9/iA35Ecz8agHBpsHaN3zGm2NUmtslFDbaMTFAABA42Zzdw+CyQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACEElEQVR42u2cMU7DMBSGXxHcoBtILKgnQGVDnKFssHeHIQszSwYO0B02OAPqiHqCiAUJtt6AIQyVJeLWJLWdlBd/39SmTfr8u/5/x00jAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOhik1uDD4agM2f/zbrYS7uZiwNdHv/57dAmkzH5fHdRV50t26nW88cF09eAyFxGRUl5LEZGj+2nlfV/LYkCC6dGfBAASoE8Oaup+uD6ubL99/AgS6u175Zzj50x+173+OVLGbAf6t6s/CQAkQB8dtC1MO2LNke12on87+rv0JgGABNDkoK6R7MskX/w5t6573bd+c7yzrED/FvW39Z7k1YQjAYAE0OCgdSPZl/nsqvL8fPpU2T6fjUREZPleRK5/IZoSTKv+pj5Tr10/CQAkgAYH3XbEm9WMOkxdw5PRxvbU1e1anbHX8W3njzWHRv8w/UkAEK4GjfBLpBnBrhHumps2JdRB7TnsrmhaP/p3oz8JACRAHx30v7VDa919158EAGEVKGA9VYvzaAf924EEgKRhAAADAIBzgESx18N9r9Vx7bfrVRst5zK+/dB0f9e5CwkAJAAOuu5M26522PuF3r1Bi4PG1tulm+ufc6H9SAIACdCFs0pL97mJ7fS+Tuc6Tqzr5mP3Q9e6x9YtVj+SAADieU3HJhdxbe/6ePRDM91S150EgKT5AZVKEXyGQH/WAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABkUlEQVR42u2aMU7DQBBFxwhuEKogQYFyApQScQbTQe8eijTUNC44QHro4AwoZZQTRDSRoMsNKExhRsFGieOsN7trv1dZTuL90fy/O15bBAAAAAAAAAAAAAAAAKDNRHV/0O8NMpMBPx/G+cB3V5GLP+yb/gM86JbDuk55G13sNNDwKMkPrlMREcnkPRMROXlMCt/7Ws4jm073TT8J8C0B6pyn29PC+fvnhdFA0+987hy+juSvc/6PI5lJEkLTTwJ8XQNsoU5ah87RcWqWhH3rP+sf/x4t6II6kYA4nW3sLqo+r8J2Emzpr6ubBISaAK1073xQOH+ZvIiIyGR8Uzi//JhvvN5qDi060NYa0LR+7oTbkgB1nPazVagz1EmunR+afhLg6xpQrqDeYWqFy13BtnNkubuwRSj6SUAoXZA6ynQ/vXw97Zd33aUMXT8JcAwFoACsAeLy2exq78Tuna+v+klA1xKwbtcxFOc3rZ8EsAhTAGhDAeJ0trd9Hhu40k8CpGPvhsqWu5e+vhvatH4S4JgfQjzl5SNVCeQAAAAASUVORK5CYII="}, {"id": 48, "name": "吉娃娃", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9klEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GTNIgYGBgYGmZC4/+RYiKSfKh4YeTEAA6dWJQwKD4y8GHj2bx9FFlKqf9jFAMUeMAtbwGAWtoBs+dE8QKkBd87NQuGrGKWhiN85Z8XAwMDA8O7OsdEYoEkMwEJWSMUKa4zQKuSHTQyQ3RoltyZGL5FgrVGY+aS2TkdOHkAPKUoBunmwGDULW0BSTIzWxKMeGOh6gFyAJe0zjJZC9ADo9Qe5IT+aiUc9MNg8QOue12hrFFerlFpgxJZCAO98WUxkQU5NAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABxUlEQVR42u3bMTI0QRgG4I9yAiUjVA4gEAj/MyihEjmEo4iUUDmDUCBwgL82RKQcAdFU2WbMmOmd3dbPk+0yo/frmu+d7WkRAAAAAAAAAAAAAAAAAJRhrZYPur219/759dPL/7Vlnqc2q1r/dVNDzTZq66CPN1cREbFzdPI+8ngd9A/UXwIgAWrooKn769MiJ0z985IASICaOujz2+1Sj0/vxYfeg6t/nnpLACRASR10bOdMHRxf/thRu34+dPzN+bb/nav/Auuf1vvg+HJu/BIACVBCB+26koeaPVzMvd7dP5t7f/ZwGBERr7O73OOPkhKs1Po342vGm45fAiABSuigi9KMa3P38NvP0zXu9MlqdKzaNB051z20+o+rvwRAAtTcQfuOc1XX4dU/PAmGpSVAKR20bTVgKovqnOo/rv4SAAmgg64+9Q+7QcEFAC4AWLFVoFKle3KG7tVpO67UfftTf5cZOg99j2/77iIBkAA66NfO9NvVjvS4vk9YS++guevdVrf073f9Xt95lABIgCk6a4zcizJVpx/a6drOk2vffO55mLruueuWax4lAMTA/xD6rou0vT/1+cxDv7rVXncJQNU+AM/16Lk9sVtaAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABWklEQVR42u2avQ3CMBBGD8QEiA5KxAAUKZgDpURUDEUVUSJmoKSgYABECVSIEYDKElj8JMHO2fBelxDHH7r7zhfLIgAAAAAAAAAAAAAAAAC/TC3vg+1W73p/fThta2UmdPUerXld66+Tg7o0ig7YL2YiItIZjq5lJrwbr/KHQ9OPA2JzgGE9H3ut1b7XBtf6y+rGAbE54HhZfjXhq/Emg0xmJmnmxQmu9X+rGwfEugYkafa2pn76PW+N9uUEX/qL6sYBsXdBze7g4X63PxERkd1m+nD/vFvlqv12Bvrqhlzp5zvgXx1gZ4bJpKKZU3Xmh6YfB8TmABNhO/J5a6TdXVRNaPpxQCwOMDXN3g8vi3mf6Zd97S2Frh8HKEMACABrgApPdhEr7f9D0Y8D/s0B2l++oenHASzCBAB+IQBJmqnv88SoHwdIJGdDX52NFMd7NVWfEdXWjwOUuQE3a9hPL1iJQQAAAABJRU5ErkJggg=="}, {"id": 49, "name": "約克夏", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABL0lEQVR42u2XMW7CQBBFn6O06SgiRXEZegvRIKWMaGhwm5P4AJyEFg6QMhINstyTkggpRbocwCnQFrushb2YKIb/urHlseZ/r2cGhBBCCCGEECKQ3XhS7saTsm7cNjddFzBq+sBD78mr5nrQB6AoCgCSJAFgmG/8zn1/RHIAuG2q9GI2sOLH5Q8An9O7vfIkVrymb8WGNKNsw5nLc8Aon74828q/vXsTuMoei10O37N3pq4TnXdABXS+gDTLSbM8+L76wKkJVvOpFY9el9b11TwG4Gu7lQONZqG6ndhwH8fe61XKV52Lq+vEUegUWuVEnb+WT3GTX7NQ5eblKHXyJufkM46aKVWzkAroSicO5fDbz7WR/Qlu/whVXodYBfy3As69eWkaPbYntDUbXZ0Dv1gWeztTwOlxAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACMUlEQVR42u3bsU7CQBzH8R/G1c3BhMgoe0OMiYmjYWGB1dmH8AF8ElZZXIyjCQsh7DJiSBzcfAAczA09emlpr6XXfj/bocD//s39/+U4JAAAAAAAAAAAAAAAAAAAAAAAgMBsh6PddjjaZR2jWfk/4RKgzTo+VrAkdd9eO1nGx9Y9v0qsJotBX5K0Wq0kSVEUSZKul5/J8/5Zd+pSQck/HQCopgOEUkFdcb48D2Ljy9mvJOlrfJZpbEyelrWaF/nPNy86AFrt1PcKjhTFxgv1HStYuzIqk4l7cn8Xj/v9I/H/7bjSxrb99/mfl695kP9y808HAB2giRW07kye7XmS/2rzTQcAHaAJKzkvs5tg31tn/Xve+M3r3TyuyX+J+bfzbT77mPjpAKADhFBB01ZyXvPpODa+fZjFHp9Pe5Kk783Gc/xLhdTBQs2/ic/Ea8dPBwAdIIQKeuiKN7sZaUxcF71e4nzS4nbtztj7+Hbl93UPTf6L5Z8OAHEWqMA3kYZZwa4V7ro3zapoBbXvYY8la/zkv5r80wFAB2hiBa3bPEKNu+n5pwNA7AIV2E8NpfKEjvyL3wQDLACABQC09DRoWfe2cux3K+c+edq+fVu5z+bkuw5Zn+/67EIHAB2ACrpfmQ7d7bCf5/omt2kV1He+XXlz/XKu6HWkA4AOUEVl1YFnXo5V6fNWOtfr+Do37/s6VJ1333nzdR3pAIBynulIqiKux6t+Pa5Dtry1Pe90ALTaH1hMZJw9GliOAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABoklEQVR42u2asU7DMBRFbxErGwMSoiPdo4oFCTGhLl2aDfEl+QC+hJV+ACMSSxVlh7GoEgMbEmsYygPZpCSO4j47vWdzqja3evfaz04AQgghhBBCCCGEEEIIIYSQGlaTabmaTMumY+o32aOFdBm4fuH48LTSDYvxCABQFAUAIEkSAMBZ/lztvPeXgcYfDk0/E6DMvqtT7m/Hxvhk/gEAeJ0drJ2DxBgvMDLGQpqh9OmsWPQzAaElQJyTXl2Yznl4rPwB2xl1Y5u/91k7q20SYtPPBIS6Bmghc7TMsVrdkivXl5+SAHZBO5GANMv/7S7qPtdOgi/9rrqZgFgTIJU+Gg6N6+c3cwDA093MuP62XDaaQ20H+loDutbPnXBfEiCOk362DnGGOEnb+bHpZwJCXQPsCv7sML8rbHcFTedIu7vwRSz6mYBYuiBx1KZTxrYOlX7ZdZ/Q9n6h6WcClGEBWACuAdB8Nvt7dpIjptPPrvQzAbuWgE2njrE4v2v9TAAXYRaA9KEAaZZv7ZzHB1r6mQD05N1QdHx6ue13Q7X0MwHKfAF+hBYB0K5a8AAAAABJRU5ErkJggg=="}, {"id": 50, "name": "騎士犬", "kind": "dog", "rarity": 1, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA8ElEQVR42u2YsRHCMAxFFS4jxBWu8RCswB0zUGceambgjhUYAmqoyA6hUhEFHbHRkTj5r3Ri6/x/IskmAgAAAAAAAAAwDkXshHW1aS0CP5t7YbHOarYOaEo/XjeTwN4FE2eyd6DUlD/uqs54fWmIiOh82HbG96froEByHtOPQ22ME/NzYChDlZfva04sNguVvyrP2UTLTvI5z6+VLAQHYpHKS8Wt6gYqMSrx2N2odCTVCak8K87roxf61r9bnwd4PXbUu7CsXggbyL4Sp/Lh28eJ7C9ovVPqLQV+YmxgKhvwLqgdJhyY4t2o1V1p9g68AZ4dYr0bFm6VAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB3ElEQVR42u3csVHDMBjFcZljhFBBDUOwAnfMQJ15qJmBO1ZgCKihIjuESkWU6OwoshPZv39pYvHpKXov/k5JCAAAAAAAAAAAAAAAAAAAAAAAAACANuiWNuHb1f22xji/m+/O26d9/a8sCSTADB00V+fP31eV8e9uHi5qXvQvm5cEwKK5PuMO3o7hTLHu16fVzvX1xyaEEML7y+PO9ee3z0HjpvdF9v9P2NacB/3H1V8CQALM0UH7GFp3+vrcPEqdMp0n/cfRP6e3BIAEaMlBczu5tO7YTch9tk7/Hu9fZ7oQQ+uP43VdR/8R9U/1js8+sX4JAAnQgoP27eRS0rrTemt1XQ7UH1pKsFb1j/XFetP6JQAkQAsOeuyOj92MU+fTR+zO9PXxU+ev1WWh/2n6SwAEZ4Eu6CxHnzOUOmj6GfZcDK2f/tPoLwEgAebooJc2j1brnrv+EgBBF+iEfmorztM69B8HCYBFYwPABgA8AyyUtB9eelYnd9+5uzatPMuUrsPQ+3PPLhIAEoCD7jvTsd2O9L5av95w6Q5aW++cbrlvzp26jhIAEmAKZw0j/85NLacvdbrcOLXOzddeh6l1r61brXWUAEAoPNNxyEVy16cezzoM023puksALJp/X2gHkflCUPkAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABUUlEQVR42u2avQ3CMBBGL4gRkgrXZAhWQGIG6sxDzQxIrMAQUENFdgiVJWJkKSE2Z4f3yvz5i+4+39mJCAAAAAAAAAAAAAAAAMCcKcbesCrXXYiBH+2t0Hjh1PQvyMFEHeDLlPvzGmRgU9VRMysX/ThAmaUvcw7bsne8ObciInLab3rHd8fLoIHc+yyf40g3xQm56ccBqTlgKEMzx73el0nuHG2quovZLYXWb883ntqAA+biABtptwtwuwvf+aGZEssJsfWP1Y0Dcq0Bvn7aZs7Yftudk+1zYtWA0PpZCbMS/m4l6Zt7p2Z+LvpxQKo1wI2gzaipc6QZ2SdLoN3KVPXjgFy6IJtRoffTbb8cu+tIVT8OUIYAEABqgGh+m33bO1H9VqylHwf8mwNirXxz1Y8DKMIEAOYQAFPVP9vniYGWfhwgf/pvqCj9K5qafhygzAvlR9GpVm+b4AAAAABJRU5ErkJggg=="}, {"id": 51, "name": "藍領巾虎斑", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNklEQVR42u2XLQ7CQBCFX5saPA40V8CQVHAJVPkRJGgOQ4Lgp4ozoCDBcAUcCTg8hlDUkLbpZra0DYGZz5AFtsvOmzczAIqiKIqiKIqiKMp3cGy/2Ki3ovj6ejs5nxxY1nMI99cV8PJuuCxXAIDmcBB9cmBsfykXkKcAsdiEifV+fwAA+H4nc/3m/iz1AvIU2NaK3bno/v9XIF2nOUa9INMTlPumz7nzbPuDK64T9yfj7OrCKJKuVuvZXDtxpgKcB0yRzQspZUKMBzzbm5Myodcu9Qdw53H75FShdGQ4L1C1OXenAIDgcUzkPhd5er5pxqIqJnca5aCIkU6cd0zKUqTp9e88UJkClKuBn3x/Z5nztp1aFeA8kFbENuflduKqvECKcFNs3ulUFbD9Z1YVcmehqhDngRfrFZD30BpZ1QAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACKUlEQVR42u2bsUpDMRSGT6WLu5uCmz6CDkIdBF/AodNVOwg+jLPgYLWTg08gCBZcfASddXN3kdYp0pvemJvc3Ng037fIVdJ78of8f3qIIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAadXCa6vrY1nX3++Hzr/Ofn5Mai6r/C0kDOdHNz0PfhjYiIbJyeTBuOx0GXQH8SAEiAHBxU5/puVHoej59FRKTX26t8/uVrEtTRXR0Y/SdB9SYBgARIyUF9nVPxsNpszzcdr+pX+h0e7KJ/i+N1vQf9olQ/CQAkQAoOatvJpi6HjUG/qHRU5Zymv9veZ6prpn5JKcFS1V/9VPXq9ZMAQAKk4KB1MY1T79HPxnpder2ms3ZbfXT0j6s/CQAkQE4OOtcVsXRXTONvL6+cHFs/+5vmjf5x9ScBQLgN6rCDbTvU9ewqjn1vm4PanGn//jVI/ZuPF5WOZuy/a/O2OT36x9GfBAC+A7icQUfdnSAvPj4/89rBvqh5PR1tT12cVM23+H4p1+npuDbnRP+4+pMAQAIsk4O2hT4Pk0OGdk70b1d/EgBIgBwc1BfdOVMF/UkAgPgJsOgOqvfDfW9rmsaF6tsvi/5/3M70Woe6403fXUgAIAFw0Hlncu126ONcb3Wm6qCh9Xb9/4qm60gCAAkQw1kl0P33tp0+1D34ponS9jrE1j20bqHWkQQAEM9731UuYvp97M9jHerplrvuJABkzQ8JfWzRmEA1NwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABpklEQVR42u2ZPU7DQBSEJygNPR3UcAQaJBdcgSKVBbkCh0Gi4CcVZ6BKJBquQIcEHT0NIlQPxcaP3bXX2X2r+Zpo46w9kWfe/gGEEEIIIYQQQgghhBBCCCGElMzE94f7e4frzfb7x8ukzwNj3SfVc2Pr36EH0zIN7fB2ewcAOLg4X/d54Eb/JH84N/1MgLUECDcPi0Z7tXoCAFTVSWf7l89vrxo79tgQW39f3UyAtQQ87g57Z1p/cZA4cz6rR0lCbP1DdTMBuSWgPc/VmM/qf2vq/dV147N93bdGhzoqtf5Q3UxAbgnQ3pg4S2YHmiPEWdp16a/V0PZ9QseAbevnOgCF7QW5amhoLXfV4FjOt6qfCbA2Biymx0ixe+mr05p+JsDKeYBr1qLNFl5PLwEA9ddzZ43UnCL31/ZoZH4eOlbkpp8JKDUBQrvmLs+OOp3rWg/41npr+pkAq+cBLqTW1VXz+6XDkUNrvDX9TECpCWifJPnuAaV2/rb1MwGlJkA7a/1zxhppD8iqfiaglARou4OaY3IjlX4mwOpKeCzGHgNy088EJOYHTa9UW7ZjL+QAAAAASUVORK5CYII="}, {"id": 52, "name": "花花三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABRElEQVR42u2XIY7CQBiFH4QQDkAwNKgG0ytgCOEEWARrOARuBQgMfs2u2HuA4QgYgoEU1B4ANyuaIXTSYWZKK5p5n5t2ps28N6//X4AQQgghhBBCSkZsdkJsdqLo59arLkzDdmK33U+pd/071myVBwBM1skYyThYzp2eQwck8fcPACD4mFmdZ6l0jK/kQthkBp6puWYgXnVS1+/T7ct1o8E4Nd5/rqSDzEAhDuR14ny50YHMr5D6vdchFQ97EQDgNM2e97h/OWQ6oXufrTP+ZUAqqUNV3DSPGcibAR0m5W3fxwyYlHJVWj37JqVNJ0Gu86cblTt+NyO2ypt6rrAXCT//B1xp/Q5z1Zm7mplF5HkGykJX4W0rNR2w7Vof/9RIMhEs8Jby/lVi1640b4V27U4r70C9SAXVPqdSG6hcBsrCuwz8A7m6j79ZUAOnAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACWklEQVR42u2avS4FQRiG3xUEtWicqE40LoGCiCvQKmj0GjWFU2j0GhLuQoSCS9CIhvhpXIBuFScjMYyZHbPj2H2e7pz9+/adzPt+O7sSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQykPLsvy4LJEiWbpP4S00GaGc85gSSq2Fou/uNHpydlP7vH0eltUqVur+/3f6v/u7G1WOs8gOCj6kwAAcQnQFAd9PDqWJHU21oP6SVPnow77f3RHhYM2R38SAEiANjjoBy/b/Xp6U5Kkt7WLH3dfXliRJM2f7EiSrnd7SR29qgOjfy+p3iQAtJqi6gwyM9cQOoMNZgZ3NtajetBY53TVH3sf9w/Pv6r/7uFGkjQ+MVKgf33623p3Z+Y+HUcCAAnwHxzUN5NdqyVfemir9zTnMee1sbeb+zD1u3DV5asf/fPqTwIAq0BVZrDtOB8zdE2VZrDverHr067jzHVsp7Sdx67X3n5+dRbl4LHr/ehfr/4kAPAMENMDuvD1dPZ+uXtQX12hmOuHEtv7o3+9+pMAwDNATA+aaoaHXi/UQX09aCpiV2NS6YH+afQnAYAEaJKD+lYnujNzZYpe1NQ5drpUqWf19dzon1d/EgBIgCY5aG7qckz0z6M/CQAkQBscFNCfBAAYtAT4a+w3ivZ6tyLfNKZ+89kUXM8yseMQerzr2YUEABIAB/3qTFVXO+zjUq/bD6qDptY79OtU336h40gCAAmQw1lV07cvqZ0+1Xfwv02Uuscht+6pdUs1jiQAgCK/WvzORVz/5z4f4xCmW9t1JwGg1bwDs7SUnIOh+HEAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABtklEQVR42u2ZMU4DMRBFJxFCHADREFEhmlyBJkKcgDYFNBwiHQUpaNLTQME9SJMjpEE0RAsF4gDplmIZCVtZdsdr45nov867zuZH+/+M7RABAAAAAAAAAAAAAAAAAABEopzNy3I2L6HfpQ9r5GWn7cTD/RPn7b9/vfTaOoeIiC7uqjFV48Htteg5XdGqHwmwkgCmeHgkIqLB1WWreshOKei+unC8m/UHa9OPBGSmJ62hxfTAub4eP//5ubPTc2e8uJmyAzfWUP6e2L0htf5Q3UiA9QSEOult9bHRQa+rZVVqj4ZRV0mp9DOhupEAbasgf71cuzqYfLoOGLv32Qm+Q3wn1fHLUaLamlu/VDcSYK0H8Buug53Tdp7vHP9+7B6gTT8SYLUHNNXA0PldnW9NPxJgrQeEOkVaO5uQJkSrfiTAymmov2PtCj+P18s+TWc20v2BVv1IgLX/A6TsPY1EzuSauvZr6mTYqQdo1Y8EbHsCQneosXfCWvUjAdueAL/7FzT6OY0kE85PrR8JsLITlp4qhu4wUztfm34kIDP9mA5oew6ikVz6kQCrPSAV/9UDtOhHAjLzDZcORCbs3EUqAAAAAElFTkSuQmCC"}, {"id": 53, "name": "瞇眼奶油貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA7klEQVR42u2XPQ7CMAyF3YojsMHMUtbeB6QeC6ncp2tZmGFjYUcKk6VSKUrqWAqp37dFimvZL/4pEQAAAAAAAACAPFSxF3fbg5uen697JXGo9R2mLl2BzVKDR38lIqL9+eQkDif2KgHYU4C5DReZ4agbgD0F3sdPksNU+/UrMO/TPpq2+6mFpeeQv9j5UJubxKHu48u07x4msbQGtOYDakCaKekk5rcfynToJbCdnUnMEafWSGzmI7qYs72NauPL/Lxm7NZArsyH5gEUyJV5KKC9K0m30+IVUAugaTtvzy4igL/fRrX+F6Q70moV+AIHMnClYArS1wAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABtUlEQVR42u3bu07DMBQGYBfxAAxssLCwlLUrzwJSHwsJ3ocVFmbYWNiRyhQJDFZuzsX4+xbUSk6cE+X8xElDAAAAAAAAAAAAAAAAAKAMm1oO9Oz08vD989v7y2bJ7dRmrfU/cmqo2XFtHfT1/iGEEML57c1h5Hgd9B/UXwIgAWrooLHnx7thA5/ydvS+HVj989ZbAiABSuqgQztn4+Pqc9T+x45v5t/U7+TiWv0nHB/Xe7vb/5i/BEAClNBB267k1CpHyna3D9H2en1u219qXvH21H/a+jd/m/nG85cASIASOmhXqXHxfuJ5tM0z9T937nV09Z+3/hIACVBjB821utJ1f3F9Uset/vPWXwIgAWrsoGGpJ5kSbFX1lwAEvwcYsA68lLYOtNbjKHXe/73+EgD3AKHH+m78RK2UzlM69Z+GBKBqLgBcAOAeoFLxW5lD39ZMjVt61aaUe5mh56Hr+NS9iwRAAuigvztT39WOeFzuJ59r7aC569339xVjz6MEQALM0VnDRO++5O70ud6DH5soU5+Hueueu265zqMEgDDwnY6/ukjq+7m35zx0q1vtdZcAVO0LkWcc53VHIrAAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABWElEQVR42u2avQ7CIBSF0fgIbjq71LXvo0kfy0Tfx1UXZ91c3E10IjEkWKC3wpXv24wCx3DO5ac1BgAAAAAAAAAAAAAAAOCfmYT+cDFfvT4/3+6XScqAUv3kGlda/xQP5mUW2+C6PxhjjFluN6+UAT/aZ/nDpeknAdoSYDkfd2kNT2E1duy1QVp/qm4SoC0Bj/Vz0IC+9tZB1plN242SBGn9Q3WTgNIS4O5zfTRt97W29n0fWqNjHZVbf6xuElBaAnwz5jrL5wTrnFCnuzXU7Sd2Dfi1fs4Bta4BUvtrKedr1U8CtK0BQ2ukb3cR62SfTm36SYCWk7CdsaE11u3P7pdja3Hs+aBU/SRA622oFK4zfbuK0FqvTT8JqD0B0idhbfpJQK0JqN35JKDWBPTdQpbufGn9JCAzYhPQtF3wPUmJ5NJPAoySd0Ol7ttTn2iN9Y5obv0kIDNvjM4FoFRlQ+QAAAAASUVORK5CYII="}, {"id": 54, "name": "紅圍巾黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2YTQrCMBSEp6JbVyKIP0u9gBQ8hxfQG3gUb6AX8ByCeAFd+kNBXLl1UVeBIj6bxOdPzXy70qSPvMlM0wKEEEIIIYQQQr5DZDuwWeum2evjeRv5FNR6jqFUdAXKrhMOszkAoDUepT4FM/NVFhCeAoZ2p/ETCygFl0Jand/vEqbQQw/c53Qey+kVADCYVLzuS/VslaEHpL1tOy54D0SuHtBOIQl6QFJm1e+pFI7Xm6edztsJZl44Cvi+kRf1KgBgeLpYpY9r2oV7GnXFKBEL6SN1Xkqrv/HA2xUwe9/VU7Zvairgy6udpwLa39K+p9PCK6C2gP0uyT1h8q+Epgekbn9ahcIrcANXQnadjjg0rAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB8UlEQVR42u3aPU7cQBjG8RdE2lQoUpSQkiMgcQ4ukNyANlWukBuEC3AOGk5AyYeQEFXaFEuBLAXDaMf2eFjv/P7drj2e8TPy84xfTwQAAAAAAAAAAAAAAAAAAAAAAAAAYBnstHKjX/YPV///vnu82nnP67TGpuq/a2rQMnutOejtn7OIiPj64/tqYnsOugX6SwBIgBYctM/Bt88bsSYe6sD0L6u3BIAEWJKDjnXOjuNfPyf1P7V9N/5Ov7vHK/rP2L6vd0S8GL8EQPgOMO5JmsTN9f2gKkS//1T7fpVjnXNe/P737CynH948P3W86z9Falzrxk//uvpLAHgHGPIE5z6hucdT/Y1dY6bapfpJOUvnFKlxz1VHp39d/SUAJEDLDjq1upLbX+7an/519ZcAkAAtOej5p49FhDuJOnt+6D+v/hIAEmCbHHTdWvfoMgbV07v7PXn4GzXq7vSvq78EgATYJgedi1L3se0JtjT9JQAkQAsOOnqtvLDx0l8CAJuTAJvuOP1dhf16dwysv6euJ8FeVblWObqtm4fc9ql3FwkACcBBXzvTiGrHi3ZTv+guxUFL6527OzXjvKx5lACQAJWcNebY+1La6Uvtgy+QKLPOQ23dS+tWah4lABAjdy2+5SKp/2tfzzzk6da67hIATfMEa+z21ChKCZkAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZUlEQVR42u2ZTW7CMBCFDeqaFUKqWlhyBC7CBejJ6AV6k56AJT9CQqy4QFhZAksjMtYk9pDv26GQ+KG8NzM2IQAAAAAAAAAAAAAAAAC8M6O2X/yaLpvHz6frbpSzoNVzSq1rrX+MB8vyob3huP0NIYTw/bNpchZ8uL/ID65NPwnwloDIfPHZaa3uujdY68/VTQK8TUFWzjnsz09TRPr89LqVQ631p4nS6iYBtfWAdM7VOqDtdUWNVtXW0vq1uklAbQmQ3ljqLMkR0TltHSPV5twe0Ld+9gFD7QFW87WV873qJwHeesDfbGKy8CqZMrROlnR6008CvJwFxTe2+g+qHWV03Ppyk2pkk1mLVfuDWvWTAK+noVqik9LaKZ0FSTvSvv9J61o/CXj3BMTa2ddO2Jt+EjCUHuDN+X3pJwFDS8CrU8janW+tnwQUxuwFHPZnceb1QCn9JMBrD5Dc4iUFtegnAYW5A+HnC64/YslBAAAAAElFTkSuQmCC"}, {"id": 55, "name": "大蝴蝶結白貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA3ceXSVP497TVPXAyIuBH86mFFlIqf7hHwPo5TQhoCKnjTdPEJLHZR+x9QPTiKuJCZU+hEIcXd1oTUxpHqC0fhjNA+SGFCykOWYehZTv6dZY9aHLw9I+oZAmlBJg+kZOTQzzMa6QgYU0Q4E9hJ5wkCjzKCjt/o/s1ii8bYOe9r//gdA48gSp9Qx6nhm5eYBWgFDIE6oPRmNgoEJ+NAao3VYit3U65GOAah5QkdPGWWYPCQ8M+tYotfoLxLa5RkwMAADSa3ecoQRLMQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB4UlEQVR42u3bMS8EQRgG4CEkqHVEJRq1SqHwR6i0fopWxR9RKFRqjaiETk8hOcVlE4axt7tze7c3z9NsuMzt3DfxvWuMEAAAAAAAAAAAAAAAAAAYhqVSPujW5t7o+9evb49Ls3yf0sxr/ZctDSVbKa2DvlxdhxBC2D49GXUcr4MuQP0lABKghA4ae3p+aDfw5j5rR2/agdX/Pmu9JQASYEgdtG3nrHwcH3S6f9fx1fyr+q1vrKr/FMfH9d7d2f8xfwmABBhCB637SU7tctTZ3dn/t6PWvZ66X2pe3+YfhpRgQ61/da3mG89fAiABhtBBJ5Ual7pPPK94vnXP2rn30dW/3/pLACRAyR206+7KpPeLn/1Tn1v9+62/BEAClNxB1y7vxrsjZ4ehyeut9+El2FzVXwIgARapg9Y968b7wfE8w/nR+Hpxm/X+dZ1T/WdTfwmABFikDtrUr875/jm+JjrqrKj/dEgAJEAJHXRRqb8EgNklwNDFpzLbntZMjet7t2Xe/XM6s9U6TDo+9buLBEAC6KC/O1PT3Y54XNe/6A6lg+aud9P/r+i6jhIACdBHZw1TOvuSu9PnOgffNVGmvQ591z133XKtowSA0PLU4l9dJPX9vt/POkxWt9LrLgEo2hd/KDY5WUgQvwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABgElEQVR42u2ZsU7DMBCGr6hDH4CNKlPUJXMnBgZeBKauPEpXJngRBoZOzCyIqSobD9CtDJWlysKNnVywj3zfUlWp7b/y/ec7RwQAAAAAAAAAAAAAAADgPzOJ/eHV5eJw+v3r+2PSZUGteXKtq63/ghjMyzR1wO7pWURE5vd3hy4LnozP8odL048DrDnA8bl97zbw5S0qxw59Nmjr76obB1hzwP522WvB0HgXQS4y66oZxAna+vvqxgGlOcCvc0PUVXM2p7Y9j83RqRGVW3+qbhxQmgNCO+ZHVigiXOTERoyfQ/15Us+Av9ZPHzDWM0CrvtaKfKv6cYAYvQ11Oz973Bzr49X1r+P856nVR2qut6YfB1jphN2OhXKsixR5uDl+rl+j5nP1cmouTu0PStWPA6ycAW11eyyhKqGtH+h7BpSqHwdYfR8gyu9qtfsBK/pxwFgdMPbIxwFjdUDbLWTpka+tHwdkRm0D6qqJvgcpkVz6cYDVTngohj4DStOPAzLzA5KlHEpeQ2icAAAAAElFTkSuQmCC"}, {"id": 56, "name": "小雞頭灰貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABEElEQVR42u1YMQ6CQBDcMz7BTmLpA3wGr9DGHxBaWuMXTPQVxndYGiuChQl/OApDIhhYvN2IcDMdgWNzMzc7myMCAAAAAAAA1GDT0No0tL+qNxk6YVNN5omIgtW98mwWZwMFWmC0FfjAJXsV2l4NFJAoMJ8tKww/8psTo1r/8bcLZccTEREFm7VTr39bDw+IciDZ7/5iA/4pcMifooLS9eNXoN6nWS9EcasnuPdN9brmg39JzHUfjvH6d0hiqQek+QAPuDLlmsTl2eeY5k5Cuc6fJC53LPVIV+Y7dDGLWwlNNDFf94y/HuiLeS4PoEBfzEMB7VnJdTodvAJqG0iiuLFn41ZC83Zaaxb6dkYarQIF0q1/NBoPzNkAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACC0lEQVR42u2cP07DMBjFXxBHYKNiQhyAY3TjBnQoN6i6dkVcAQlOgTgFAyNiqsKA1DuEAUWiBpN/juOv/v2WSq3cfHmW33McJxIAAAAAAAAAAAAAAAAAAAAAAMABUm3nVbWdVyiRh/5HSA45czzGCJak4uypsOY8kjS7fD+I80B/EgCgkWKsEVy+nMuSE3nnnc/l93ncvBaWHBT9SQCA+AmQqoOenlzs1fexeyum/J/cEixV/UkAEKtAAUZe27nm1A5aPjxKkmaL62pg+6QcFP1JAIDx7wNYdVCXzd2tUpgTd3Vg9A+rNwkAJIAlB+3rnDX3u89Bxx/avq6/1m+5uEL/Edu7em9W6736SQAgASw4aNNI9q1yNDrpav2vozb97juer64f9ctSglnVv/6s63XrJwGABLDgoG3xtfMdx63Lrbdprh16HR394+pPAgAJkLODDl1daXs8d+7vO2/0j6s/CQAkQM4Omtp9EPSPqz8JAOJ5gB7rwFPR5ECpnofVug9dfxIAuAZQh/Vd946aFeexDvqLt0IAMAAAGAAAib4Zzhrursy+uzV97aZetbFyLdO3H9q29127kABAAuCgv52p62qH2y70nc9UHTS03l2frxjajyQAkAAxnFUj7X0J7fSh9sEPTZSx+yG27qF1C9WPJACAeu7p+MtFfN/H/j/6oZ1uuetOAkDWfAFjokUmckc88wAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABkElEQVR42u2aQU7DMBBFJ4gjsKNiyQE4Rk8BG24QZZtt1SsgwSkQ52CJWFVlgdQ7hAWyRI1CYntSe/B7u6qK8yP/Px5bFgEAAAAAAAAAAIhk2K2HYbce0D+PMyyTl3NN54iIrG7ej343V8+NFefn0E8CMtNoO+gXL/vvF92/NhYScGr9JMBKAi4vro8c8nF4i3KE1ji53qutnwRY64L2j08iIrK6u43qlX88n+WDS9NPAqzuA/rtZtFavfTaoK0/VjcJsJaAh8Nn0gvHnncOcs7s226RJGjrT9VNAkpLgN/njtbQtvuzpk79P7dGhzoqt/5Q3SSgtASMzZjvrDFHOOfMdYxfQ/1xQteAU+tnH1DrGqDVX2s536p+EmBtDUitkX53EevkMZ3W9JMAKzthN2OpNdYfz/XLobU4dH9Qqn4S8F9uRaQ6aWo/MLfWW9NPAmpPgPZO2Jp+ElBrAmp3PgmoNQFTp5ClO19bPwnIjNoE9G03+5ykSGdn0k8CxNjtaK2zlNBTzqXuiObWTwIy8wWM3jADwV1ipQAAAABJRU5ErkJggg=="}, {"id": 57, "name": "圓眼鏡橘貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42u2YvQrCMBSFT0sHcXar4Cbim7j6BPoYiuAi+hj6BK6+iYibYHFxFHEQ6mKghNakaevfPd9Wkts09+T+pAAhhBBCCCGEkM/g2U4MG+04+Ryd957LgmW9R+H/ugJBXoPjcgUAaA4HscuCCftSNiBPAcVu3vqKDchT4HKaAgC21yh1vFsPX48/7alAlgJ6njbRn90BAOtJkOp5fdx2Pdv64IurxKbs0xkfkGceK3HRGChaHxgDrp5yrcTq7Js8bToJyk5OJVY7Lhojtp43ZzHEsrvRWm8BALhtRqV8SJbn9ZiRGwNVKWHyvKkeUIGqzryYSvx2BbLyu2t3KlcBPevY3gP4V8K1Gy3rvuDaI/2tAg+Lv3kuE1HPgQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB8klEQVR42u3bsUrDQBzH8V+lgwhubhV0EnHzMVwdnXTxHSqCi9TH0Cfo6ptI6SZYXBxFHIS6eGCvvVzSXK653PeziMa06S/6/6VnlAAAAAAAAAAAAAAAAAAAAAAAAAAAaejl8kIHe0fz/5/PPqa9TT5Obtqa/xanBjnr5zZB3x6fJEn7V5fzmvszQTuQPw0AGiCHCWqbjA5acU1cdQKTf9i8aQDQAClN0HUnp/H5fidJevmardx+sjMo3v63f93jN/ntXk/Jv8H87byPb7Rw/DQAaIAUJqjvN9m1yuFzfv8jSRrf9lcet73dt6oix+rK8vG/KqUGSzV/89Ecr338NABogBQmaFmu/eznMZNyMlr8PjOZzaSwt4c6zrLr9OTfbP40AGiAnCdo3dWVss9nX/u7Xjf5x82fBgANkOMEVUv/kkn+cfOnAUADdGmC+q517fXgWHyTk/w3kz8NABqgSxO0q8i/GTQAaICcbZ89FG7/fh7yU9Lh/GkA0AA5T9DD0wsVrXer4qqKvV/T1+qp5b/0XkbDwtx858GXu++9Cw0AGiDnCeqaTFVXO+z9Qq/bt3WChs676v9X1D2PNABogBiTVQ3d+xJ60oe6D75uozR9HmLnHjq3UOeRBgC05l2Lq6aI6+uxH4/zUC633HOnAZC1XygtE6+jZesIAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABhElEQVR42u2avUoDQRSFTySFWNtFsJPgm9j6BPoYBsFG9DH0CWx9ExE7wWBjKWIhxMaBZHBMZuduZq75vm7ZzMwJe86dn10JAAAAAAAAAAAAAAAA4D8zWPWHo92D2fz19O1p0GVAq35qjWutfwsP1mWY2+Dl5laStHd6Musy4Fz7Kn+4Nf0kwFsCAo9X+73W6r7nBmv9XXWTAG8JeH+9kCQ9fEx/vX+4M/r7/k/7lIOCM8cT9ZIEa/2luklAawmI17kpji+/Fq7vzocLzkndz63RuY6qrT9XNwloLQGpJxY7K7WKGE+es1YZcQ2N+8mdA9atn33Aps4BVutrK+d71U8CvM0BpTUytC91ckqnN/0kwMtOODyx0hob9xfWy7m1OHd/0Kp+EuD1NHT76FqS9Hl/ZuKkZfuBVWu9N/0kwGsCrJxkvRP2pp8EeE+ACt8g1XJ+K/pJwKYlYNkpZOvOt9ZPArwmIF41rPscvZRW9JMAOfk21Oq8vesbrb6+Ea2tnwRU5hsrtB7oEvNVngAAAABJRU5ErkJggg=="}, {"id": 58, "name": "耳機三花", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABZElEQVR42u2XrW4CURCFz24q+gAEU4IiFazgBRCQpgkSV8GKonkDHoA3QIMAUYcnBERfAQTBlJSqikrcIjaXwGR3790fUmDmMyvuX+6Ze2ZmAUEQBEEQBEEQBOF/sEwnPuWePQCovU0yOXjx0QQA7H7XVpp97FuPwIPpRKX8qPEHACi03xMd+D0YAgBc+PuN+2VIBOK8WVTyvpI9/7t355HrXqqv0fulxL7bLNTqrLwgxZTylLiR+Nr+ICirjftli7cHVL7XoRQvFR0AwMYNnncc3y4jPUHPN60P9xeBk5t7Jm9dKRumOB2ffU7P5kWczzQL6TxAFU1KWATiRsJm142mjQRVPkxp3UtQ6/j0QurGpnXCdL8w5WnFp9mvVHQ8XhFIyuOoHstjylt76pmuw9wDl4IqT7OVrh5IBEy71uM/MXxPFLpIpTy/Sqx7s1n1Ruy6UTtLBXUd5lVf4OY8cCnYeeAAXW+LzaTwmKQAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACYklEQVR42u2brU4DQRSFTwkkgCYYCIogiuABQEAICRKHoAI0b4AhGN4ADaIVODwhIOARQJAaGkAhkLgiyhC67OzOzG63P/t9pknb3d490zln9nYqAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAcFApy4XOzSy1JWl99yqX891d7kiS3j6eK3yNhlf/MYYGysx4WRzU1F3f/pQkzR/sB53n9fxCklRT53yNsyoJNsT6kwBAApTBQY3jaWW2U8dp5/Grdpt43ObaVvL5Mjq6qwOjfzb9bXqTACC6QB4zyMxcg+8Mfjg57XIw3zWoq3PuHT614xwjWn/odby03hW3Jm+cVSsu9Tdbj5KkqemJCvr3Tv+o3osLy13XTQIA9wA+MzjKZH0jcQbf3F93zeDV46PEz7E5aMxMjnUi8740TL3GEZq1+Pf9vv7zubY1aZpD2pwI/Xurv3k09UbrJwGABBgGB3Xlz3Ftl7WmqctWb/R146g2B8/aV0f/YvUnAYAEGEUHDe3TR+uVa387xcFtXQj076/+JACI3wE81qC+M9RGWhck1EFd++9ZMd0X3352Wv3oX6z+JABwD+CyBnTtTrgS+otgKLZ+cCimTpsT+To/+vdHfxIASIBRctCi6ZVjon8x+pMAQAKUwUEB/UkAgEFLgH4T7Ye77tZUSp887779qJCwOzNoHFyPt927kABAAuCg/53Jt9sRPS7vvv2gOmjeett0c/3fge84kgBAAhThrMq4/70op89hH3wuidLrcSha97x1y2scSQAABe77jnMR2/NFn49xcNOt7LqTAFBqvgHyroA5lL/nUwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAB4UlEQVR42u2YrU4DQRSFzzYIHoBgaKoKohW8AIKGkCBxCFaA5g36AJjqOhIQrcDhCQHBKxRBMDQFQRDIukUs07CT/ZnZn9mZzflM0+x09zR7zr13BiCEEEIIIYQQQgghhBBCCCGkyXiqC7c2dgIA2D+5K+XBT7fHAICP71fPxB+1VX+LHqyXNdWFwjmTox8AQPv8LNcDF9c3AAAf4f2m456RP2qrfibAlQSImofdzdAJl+Hn0n9M/d3B3mH6/RJqddm9oWr9eXUzAbZOQacXL0HcGxfOkdF10vv8E3FTydVoGwDQ7fQLTRmm9efVzQTY1gNELcuiPfyKfH/zo9eFE1bX57NYJ03HPS/y3NEssr7b6WvVVtP6V70gp24mwLYE/HtjQVqtlB0jO0c4Qebh+T6yTtRqUUPl++j2ANP6i+6smQDbpqCsGprkDF2SnFZ0+nFNPxPg2mloUSclTRdJ1xVqvdP6mQBXzoLEG1Ods1XvJ+ZlGXnHKu9UdfcHtupnAlxJQF7WJwMtZ4qaupRr6rBfqAfYqp8JaHoCVKeTsvcDruhnApqeALn7LzD4O42EE86vWj8T4MpOOKvmlXW2UrXzbdPPBNRMq0wHqJ6D2Ehd+pkAV3tAVZjqAbboZwJq5hf4EjcxWXfARAAAAABJRU5ErkJggg=="}, {"id": 59, "name": "青圍巾黑貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2YTQrCMBCFX4viBdyIPyvxDh7Evd5AETyEIHoD3XsQ7yBdtUo3XkBc1I2BIsYmcfyped+uNOmQefMmSQFCCCGEEEIIId8hMB3YrPey/PPxtA9cAkp9RxGWXYGK7YTDegMAaI2GmUvA3HyRBfingKLdafzEAkLvupBU5pM4ZRd66IH7Pl3EbnUBAPTHVaf3unimytADuto2Hee9BwJbD0h3IR30gE6Z7nYuEjgazJ5muqgS1Dx/FHDdkWuLCQDgPF0adR/bbufvadQWpQRutW+aeV23+hsPvF0BVfu2njLdqamAK69mngpI36VdT6elV0BsAUmcFp4w+VdC0gO6bH9ahdIrcAVap3VpEj/ZxgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+0lEQVR42u2aPU4DMRCFJwjEBWgQhApxBw5CDzcAISFR0SMhuAH0HCR3SAlENLlARLEUyBJxMop/xmYXf1+X7Hrtfda+5521CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADINRKzd6sHfS/f49m09Hf3md1uir/ltMDbTMdmsO+vH8IiIihxfnXWZ7HPQf6E8CAAnQgoP6jI/2e7EmjnVg9LfVmwQAEmBIDprqnI7Tu9us/nPbu/E7/WbzKfoXbO/rLSJL4ycBQPgOkPYkZfH+9hlVhfD719r7VY5Nzjl5+vpxlsudtedrx13/Gtq4No0f/evqTwIA7wAxT3DoExp6XOsvdY2ptdP60ZzFOYU27lJ1dPSvqz8JACRAyw6aW10J7S907Y/+dfUnAYAEaMlBdx+uTIQbXz9KjT0/6F9WfxIAhO8AEU5x/Hpv0vEi8QmOrV/n1tOdYy0yHcdq3Ohvqz8JALwDSEx99+xmkA6ai9V9pIL+ZfQnAYAEaMFBa6+V+wb6kwAA9ROg747j7yr0690SWX/XrkeCrXwn6EJ02zQPoe21dxcSAEgAHHTVmRKqHUvtcr/oDsVBrfUO3Z0acF7QPJIAQAJUclYpsffF2umt9sEbJErReaitu7VuVvNIAgBI4p6OdS6i/V/7esxDmG6t604CQNN8A4F0+pls7mh1AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABXElEQVR42u2ZvQ3CMBCFDUJiARrET8lG9DACQmILxAgwF2UCSsMCVFAFgSVDbC6xL/m+DoXED+W9O58xBgAAAAAAAAAAAAAAAKDN9Kp+cTJaPN4/X2/nXsiCUs+Jta60/j4ejMvA94bL8WSMMWa6Xj1CFny7P8oPTk0/CdCWgJLZfFxrra67N0jrD9VNArTtgqSck2fFxy7Cfr59Xcqh0vrtRPnqJgGp9QB7n+vrgKrXPWq0V22Nrd9XNwlILQGuN2Y7y+WI0jlVHeOqzaE9oGn9zAFd7QFS+2sp52vVTwK09YDhfiOz8nL3l5NdOrXpJwFaJuHQibJ03H17+DoB+9bi0F6Rmn4SoPU01JdX7bVqp+ssyDWRNv1PWt36SUDbE1DWzqYmYW36SUBXeoA25zelnwR0LQG/TiFTd760fhIQGbEXkGeFc8+rgVj6SYDWHuByi5YUpKKfBETmCQcIBJW1NL2kAAAAAElFTkSuQmCC"}, {"id": 60, "name": "乳牛貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABDElEQVR42u2XMQ7CMAxF3YojsIGYEAtIcBIWBlY4GawMLOycgAUkWBATgo07hClSGmHipKkgyn9b1KaW/fsdhwgAAAAAAAAAwG8opC922gNlrp+vaxESMNZ3NGXqCrR8NzxWayIi6i4XKiSgsT9KAvkpoBlPRpX1dreRbdwfoiZQZteFbvdLlMD93hBd6KMH7D4trSSnjOs5F0+qDDwgrfhsOq90K3iAU8DlgdhdiAMecCkTqoRdea7Srj9B78tnFtIZ+54Tvv+43e3s7mUoqfKeRl3oykmnVe6cOR3PX70DBTik9wOu8tKTGgqEeqJu5fM7iZu6mdW9oSWvQBmzgq4J868TSM4DTZGdB9773H0Ao09poQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACAElEQVR42u2bvU4CQRSFL0YLrO00VIQGE218AnobC1t9Mm0pbOx9AmobY2W08wHssDCbLCOXnbvzA8N8X0OA3N07Z7LnLLODCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlMGgloGenkyW7fdf32+DbR6nNnZV/wOmBmrmsDYH/Xx4FBGRs/u7ZWA9DroH+pMAQALU4KAuF5fnK++fnud+hS+LqI5udWD0X0TVmwQAEqAkB+3rnA0/s6u/fmdzCakP7f/941VERIbHR+ifUH9X7/FoutI/CQAkQAkO2nUla6scXYxHU2kf1/q9dj6tr1b/UlKClap/89r06/ZPAgAJUIKD+qLVaedx+3L7bV5vrm/X3mvHXkdH/7z6kwBAAtTsoF3j6Vpl8T2fe++vjRv98+pPAoCwG9RwRWlXqBXrKoivg/quYsRGc1ht3FanR/80+pMAQALsk4OmGodvf7vWN/pv7psEABKgBge19h/ar1ufu3/099OfBADhOUCGe0rrlRzqAKGEnndbfaO/rZ4EABKgZgd118P77tbU6lKt2pSq/4bdmb3mwbde++1CAgAJgIP+dybraodbF7onphQHja239f8VofNIAgAJkMNZJdHuwdhOH2sffGiipJ6H3LrH1i3WPJIAANLzid46F9E+z3085sFPt9p1JwGgan4B9gdddu3hbpMAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABfElEQVR42u2ZPW4CMRBGDcoR0iWiitKARE6ShoKWnCxpU9CkzwloiJQ0ERWCjjuQytJiYfkns7Zn9V63MrY/tPONx7PGAAAAAAAAAAAAAAAAAAyZUewP724fz93n4+l3lLOh1Dq19pXWPyYG63KTOuHw+maMMeb+ZXXO2bAzv8ofbk0/DtDmAMv8aXbxvP54j5v4uYnKsX2fDdL6c3XjAG1V0G7/I7Lxw2R6UUW467vjUlWQtH5Lrm4c0NoZ4Na5qREQOx6iE1FJubW2/lTdOKA1B/jemBtZvoiwkeOOL56XV6sNX27OPQNK6+ceMLQqKJRDpasIqcjXqh8HaO2G5kZSavWRmuu16ccBWnpB7o31v9j1bL3sy9W+6iP1ftCqfhygtRsawr55E+g2+npBlq/t99Xc2ne3tJR+HDBUB8TeGKVvwtr044ChOiCUU1uN/NL6cYCWm3BfX5ZKR35r+nFAZcaSERDbB2mRWvpxgNYzoC9KnQGt6McBlfkDSr0jflLO5NsAAAAASUVORK5CYII="}, {"id": 61, "name": "魔女貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPElEQVR42mNgGAWjYBSMglEwCqgIorw2/I/y2vCfXvYxDfUAYxrqMTHkY4CFmiE+rJLQsPEArfPCkI8BRmqn/aUzZjEwMDAwRGekYVW/bFsA42gMkBMD0iJqKCFtb9ZFkcUHT5UxMDAwMDx9c4txNAYGQ/lObt4YeXngyfwFDAwMDAxz3rwky8IUEXEGBgYGBpnEhNE8QFZbiNyQp5b+4R8D6OU9IdBQWg6huzvJksdlH7F5Y/jFAC6f4wqpJ69vovBlRNVRxFMSAiBpf8EGBkpCejQPEAvQY4TUNtaIywNkt0ZxlSrEllrk5jl0fSOnJob5mNI8QmzIE4rhhtLy/6PjQtQEuEIePc+M3DwwUCFPqD4YjYGBCvnRGCAXEOo3kNo6HR2dRg5BXGX26PwANUenqdUWIrWNNGxjAACcXIyr+X9aZQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACOklEQVR42u2cMU7DMBiFXyuOUMRAZ7gBK3snWMvSSgVxgdK1K3ABhJDoAnMndlZuAHMZEL1DGVCkNmDFSew0jr9vqZrKye9n5b3EcSMBAAAAAAAAAAAAAABEQr83X/V78xVKxKF/G8khZto4aLP6gf4kAIA1Oz7PYEl6fjlpheI4TbuWRn8SAKCaBGjqzEkoTor+JABAblpVOVBdHTRd99PdvSTp7PIi6H6gPwkA4D8BQnHQ/c7BRp3HRzel9vf6diVJ+lx+tEiwcPUnAYAEaLKDVjU74ttZ0d+P/iQAkAAxOejicSZJelh+FdrPqLMnSeoOB6UcNKknqz36u9HfpDcJAOJJsIUz1MVBbZ3TRNG6XbVP6p/eXkuSzoen6O+xfVrv6XiyUT8JACRACA6adSabZkuymI4nWt9v3t9NxzPVtVa/QkqwUPVPPpN60/WTAEAChOCgtpjamY6z+H7f+N7dPdzYPhqc/DrnbC6XddrO96O/X/1JACABYnbQrP64Ol762t/Ub/SvVn8SAEiAmB3U5Iy29cjzmh/096s/CQBiLVCBeeBtkeVAde1HqHU3XX8SALgHUI753fQTtVCcJ3TQX7wXCIATAIATAKDm7wYNhfSqzKKrNU3ttj1rE8q9TNFxsG1vunchAYAEwEH/OlPe2Y50u7JPdENxUNd65/1/RdlxJAGABKjCWeVp7Ytrp3e1Dr5sovgeh6p1d62bq3EkAQBUcE3Hfy5i2l71/hgHO91i150EgKj5AZ2GeJSf5CbkAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABu0lEQVR42u2aPU7DQBCFXyKOEESR1HADWvpUqUMTpAhxAePWLXABhJBIQ2pX9LTcAOpQIHKH0ODCli2vd9feGfu9Lop/nuT3zeyOFqAoiqIoiqIoinLUcp4elvP0QP9mGjMyYTUmCWH9k4DAOvKZGO29q1cliBLyAdgLSIBojXzXztfHJwDA5c116fXbt8VIcu3v2j8J0ELAdHKaS8rF+b3Ti98/bgEA3/uvToiQ6p8ESCegqxVMW71Bun8SoK0H7F42AIDn/Y/VC9eTEwDA7GpVWkOz9/juDW37t/VNAqBsFmSbnLr7swQlD3cAgCSKWyHBt39X3yRAGgHF9XKVkijO//5PgOn/tc+3TFRo/019kwBpBFR9sWKysi+9Xi1y182OzwAAu9/PfO3cpEa1v5jApj2ga//gLGigPaBKxeSY1kzX5Gv1TwK0TkObrmpsVx9Na702/yRAy064OPNwVfa8bL1cV1tLkthofyDVPwnoy7kg1yTV7Qdce4BU/yRg6AT43glr808ChkrA0JNPAoZKQNX6WEvyffsnAejJ6egkio3nICKTHcg/CYCy09G+Zim+ppza/ZOAwPoDWX5BZpmp/l0AAAAASUVORK5CYII="}, {"id": 62, "name": "小紅帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9UlEQVR42u2YPQ7CMAyFXxADExMbAxtwANSDcBwOwHE4COoBKBsDGxMTW5kikKWQn1qKqN+3VY0b+T25dgIQQgghhBBCCKmDS124XKz77+f74+pKNtT6jmfy7w5McwPOuw0AoGnRl2z4ie9UErDngFSyNnYdmO9fRXHP04wO/HRA/qdjbA83AMDluCp6H9ovtT+Mz4FQ5iGlpLJS8ZDy7MRaNRBzJHc2MlcDxdNoaSeWM1Buzck4O53YZzy0RlKVjznsp2G7s5A2IeVD5wZ7NVBL+Vg/oAO1lKcD2mfpXOVH44BaAk3bqd31mHLADb3b1MZcDbwBWlxp7tNX4C8AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABuklEQVR42u3bMU7DMBQG4FfEwMTE1oENOADiIByHA3AcZs6AOAB0Y2BjYmIrUyRksNokTlLj71sQIDfOs/r+xE0jAAAAAAAAAAAAAAAAAKjDqpUTXZ9dbH/+/v6xWS35Oq051PofWRpadtxaB326voyIiJvn2I4b/6qD/oP6SwAkQAsdNDePpa+J+3Zg9S9bbwmABKipgw7tnKnT269B4z4fTorMv6vf+nGj/hPWP613l5zd/CUAEqCGDrrrnZzb5djl6u4tIiJe7s8H/T93vNy8Sl2Dq/9+9e9+dvNN5y8BkAA1dNB95cbljpPOK51vbt5T7aOr/7z1lwBIgJY76K7zKXW89No/d97qP2/9JQASoMUOOnY/f6p9ePWft/4SgPB9gAH7wEvZ1YEO9Txqnfd/r78EwD1A9NjfTT9Rq6Xz1E79pyEBaJo3AN4A4B6gUelTmUOf1syNW3rXppZ7maHrsO/43L2LBEAC6KC/O1Pf3Y503NhPdGvpoKXr3ff7FWPXUQIgAeborDHRsy+lO32p5+DHJsrU6zB33UvXrdQ6SgCIgc90/NVFcn+f+/Wsw351a73uEoCmfQNdSeQnR2SxnAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZUlEQVR42u2aPXLCMBCF15kUqajSpUhHcgDGB+E4OQDHyUE8PkCcLkU6Kio6qDQEzSiW5DXyou/rPCDrMXpv9YNEAAAAAAAAAAAAAAAAAO6ZJvaLL8/r09/n3/13k9Oh1ntK9aut/wEPluUxtUG3eRMRkbaXU06Hl/ZDkR+8NP0kwFoCfCfMVavnnhu09efqJgFWE7DaHrPaHT6f/nWQX6PnSoKW/qm6ScDSEuCvc0O8f/xcPX/tXpM+T12txDqqtP5U3SRgaQkIjZjvrJAjnHNiHePXUIdbZ6fOAbfWzz6g1jkgRG6tn+p8q/pJgLU5wI1wJ3k7ydgzlDEnh3Ra008CrOyE3YhNrbH++0KnkmNnNan7g6XqJwFWz4K08J0ZWlXE1npr+klA7QnQ3glb008Cak1A7c4nAbUmILQ+tuJ8bf0koDBqA9D2Q7G7Ppb1kwAxcjdU67w99x+tue6IltZPAgpzBknk/DFuAL6GAAAAAElFTkSuQmCC"}, {"id": 63, "name": "飛行員貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42u2XMQrCMBSG/4qDB+im4KYeRARvoeDu4qIH0MErCLp5BBcPom6Cbq6CW10MlNCSNL4q+v5vS9M0zfvzv7wAhBBCCCGEEEK+Q+T7Yj1uJen29XaKQiaU+o6h8usKVIsOuKw3AIDGcJAAwGh/BACsuu3M9+3+1HiRBehTYLmdAADGvRgAcH89N20bu9+Ml6KiLgsd5k2RiTuzM7NQpgfsPO0byTxlXP158/kqQw8UjTg9IO0Bm6JZih4IjVToeWD2vivSrp1gxumphcyK3/WIb+TdWQyJzmrUUOsvAACP3VTkR/Iib3tGrwfKUsIVedd5QAXK2vNqTuKPK+C6NxStTvUqYGcd33uANHqqUan7QmiN9LcKPAFnYH/zDNNf1gAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACIklEQVR42u2bsUrDQBzGv4qDUNy6KeikXZ1dHKTgKzgpiODkUoT2ARR0chd08xEEdXXxCdRN0K1rwa0OelDPXC9JL2mb+/2WkFwvuXzXfF/ybyoBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBsUIvlRJcaa4Ph9c/eW22S+4mNadV/jqmBmJmPzUE/rm8kScv7ewNJOnh8lSRdba8nft5uH+qPg1ZAfxIASIAYHNRwcduWJB23GpKk/u92s25jt5v+oRw9qwOjfzuo3iQAiCpQhivIvlL7J0+SpPr5ZvIV7Gi/vO/lugfN65ym38vpShDhmt13hRjH4uFDDf2L098+rt2PBACeAbJwtFX/u+G59bO0t3vajQPldZBmV4lOZFc50jqJy5l87a7jucZlOxH6F6u/WZrx2uMnAYAEmAUHTYurn+s49rjs8fruWUPX0dG/XP1JACABYnZQ3/mEOp6rCoH+k9WfBAASIGYHLes8SbDp1J8EABKgSg7qu9e168FlkfaXS/QvV38SAEiAKjloVUH/YiABgASImYWds5HtX3cdviUV1p8EABIgZgdd3djVqHq3MlZV7H5F36vPmv7/nmXUGambbx58uvueXUgAIAFidlCXM2Wtdtj9Qtftp9VBQ+ud9f8V484jCQAkQBnOqoLefQnt9KHegx83UYqeh7J1D61bqHkkAQCU863FJBdxbS97f8xDOt1i150EgKj5Bt1QNmw0Fs53AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABkUlEQVR42u2aPU4DMRCFXxAFB0hHJDrgIAiJWxCJnoYGDgAFV0CCjiPQcJBAhwQdLRJdaLAIFqtde2fXHvJ93cZ/L8q88dhZCQAAAAAAAAAAAAAAAOA/M+nacXu6u1x9fnt/nuQsaDVPqXWt9W8Qg2XZTB3wensnSZrNj5eSdPL4JEm6Odj7s3/cvjK+yBeuTT8O8OaA6/szSdLp4VSS9PH9eXiOidvD+LYcO9TeMJT+XN04wFsVtLjcMVl4/+LlVxURzx+3W1VB1voDubpxQG17QFznpkZA1/Y2fiJKSbm1tP5U3TigNgc0/WJxZDVFRIicrhHTlJtz94Cx9XMOWNc9oC0H5vbvW/14048DvO0BfXNkXF3kRnKTTm/6cYCXu6D4xNqXMF+ol1Nzcer5oFb9OMDbbWhg6+hKkvT5cG4SSW3nga653pt+HODVAVaRZH0S9qYfB3h3gIzv58eK/Fr044B1c0DbLWTtkW+tHwd4dUBcNYx9j96XWvTjADl5K8Lqvj33H62h3hEtrR8HFOYLq5coOY6/8jwAAAAASUVORK5CYII="}, {"id": 64, "name": "貝雷帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPUlEQVR42u2YPQ4BQRzF34rCAURDVKLZXqURkWjcQMElFA7gGhRuoNG5gFZBNMRH4wC6VchsmOyaj92NbOb92p3Zyb43b/7/HYAQQgghhJDccu0Pgmt/EPxr/ULeBfRsFDcZX12vPDqQhgNp7fPWdv/93sfBc9qBoqlyl/kCAFAbj6wWTDrfXQdC7pO3krMKAOA53Pwc3m33WAdSOYWq5WbwqbyMqROn842nUGQGhNIqhOKNug8AOA6jx4XPz7tIJ+LW03XGvQwIJeOQFVeNYwZsMxCHSnnd9ZgBlVKmSst7X6W0aieIee70QuKLk2ZEV3m54suVvlH3A0e7UUNKy45VnXnKmZn6jmcgK+IqvG6lpgO6XWv4T4x3JmpTJFLe3Zs53a7UtkKbdqe5d6CQpoJyn8Pb6SwzkBXOZeAFYZqGYNzbCsgAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACVklEQVR42u2arU4DQRSFbwkkgCaYEhTB4DFgCCGp6RtUwEsgMDheowjeAENCCAaJRUAwNBQMD4ArAoakl07npzNDt/t9st2dnT2TOefOzIoAAAAAAAAAAAAAAAAAAAAAAAAAAABUln6rPei32gOUqKf+cwwB1JlGihksItK8umxUxXFCrp/290J/EgCgXAJU1UFT1Znb94/D7X48NUiw6upPAgAJUAcHba5sDkREXrvnIiKydnQY1Y6+v1T/0T+P/iQA1Jr5UOdIPYOL83783Y+zVRER+ezcjr18f/cgqyP6Ohj659GbBAASoEoOGuqcLhYv9sa+x83d9dB77JyeJOn/c+9BRESWlhfQP6P+Wu+N9a2h/pMAIOwChazif5xHE+pEL723oFX8iJk88n5znbUGVs5p2jHtavT/5j1M/23Y+uXqP/qX1Z8EANYAITNYO87vDO1I0Ax2PS+2xrTdZ56jnVI7j+6v/t/UpKEOHpq06F9GfxIAWAPE1IA2XDWdvq50Derqly/m+b7E1v7on1d/EgBYA8TUoKlmuO/zfB3UVYOmInY3JpUe6J9GfxIASIBZclDX7oQ5CZy0FjX9NCeZvjWrq+ZG/7L6kwBAAsySg5Yml2Oifxn9SQAgAergoID+JADAtCXAf6NPFPV+t0SeNKY++ZwVbGuZ2HHwvd+2diEBgATAQf86U+huh74v9b79tDpoar19v051Xec7jiQAkAAlnFUyffuS2ulTfQc/aaLkHofSuqfWLdU4kgAAEvnV4igXsf1euj3GwU+3uutOAkCt+QL8iHRYXRM2OwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABtklEQVR42u2aMU4DQQxFvREFB0A0iagQTXoqmgghpckNUsAlKHIArgEFN6Ch4wK0FCAaogQkxAHSLQUYsZZgx7MzGTv6r93J5Ev7vz2ehAgAAAAAAAAAAAAAAABAAMvxpF6OJzX0x9GDhcpSxThGs75/e1NZc7wl/UiAlwSkqpOH94/NfT+eKovOX5d+JKAwW9o3v7i8IiKiwdlp1Bd2/XxX51rTjwR4ScAPb+dfTrjYJSKi1fTu3+XHRyeq7fs7B3XW3pBJf6xuJMDLKYjfMDtHonXSy/y1cYrg/Z/nD0REtL83THpKyqWfidWNBFjrAeyUNgaz96YDps3n7ATpkNCa+stRqtpaWr9WNxLgrQfwG/4Ldk7oOukc+Tx1D7CmHwnw2gPaamDs+q7O96YfCfDWA2Kdoq2dbWgTYlU/EuDlLkhOrF3h/fi8LJETq5xUtfOBVf1IgLvbUCXb1yOVM7mmrmRNnQ2L/JKWWz8SsOkJiJ1QU0/CVvUjAZueANn9FzT6vo0kF87PrR8J8PbPuNBbxdgJM7fzrelHAgrTS+mA0HsQi5TSjwR47QG5WFcPsKIfCSjMJ7+GMWXcARimAAAAAElFTkSuQmCC"}, {"id": 65, "name": "花冠貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQElEQVR42u2XIU/EMBiGnyMogsQQCBgCp9EkYIE/cRg89iAhZ7B4zN2vAAsKR4K7EMyREQwShSmiLOEalm5dydj1fdy6tUvfd+/XbyCEEEIIIYQQohk6ZR9cWdo0P6+zhw27wNr11BrDsTEAvYXDX++blwMDsLr9DMDr+1Onzgbm2u7AfNUJ2ekVVsHjacVv7uz4zhYAZ7nil7cGYLS/awce77/X+bQOneyRtAOVM5ANRwB8vJ0HvXBxeWCdOuopA0EZCFU+1vzZd8Ct9z66/QkA44v1oPtF7yubjfSqUJGSZRV3n1MVqpsBF5/yykCsbrSq0u6371Pa9yXk89I5ifMd181IWeX9VQyTZi/0VxQp72Ym3Qw0pbzvPJADTSkvB2L3SqHdaesdiLaBbn9SWLNbsYF/343G+l8I7ZFm1oEvNQGFAI6ZIosAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACL0lEQVR42u2bvS8EQRyG3xOV0GmE0AhqtYQW/8RprtciEQlaveb8FRQaEolOovPVkBONUqVZxd5e3LjJ7cfsuL15nkbsZXZm3vF73925IQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQDWohTLR6cmF6Pfvrbv5WIDZ8y4Nmg9RJEn1sc2en0dvG5EkzSy/SJLeP59q/BlVV/8RlgZCZjQ0B23tniruv9E93ovr+PrKoiRpLxnvyVUkSWfrq/GF+9v2fb7j+W2vkWAV1p8EAN4BsjhQp4KP4go+vHlUVwW3r5sVn1Rw/TmuYL10Krjm00FbzTNJ0tfHfq77jE8dxPPcqhdy0GQ8adujfzH9bXqTAEACVMlBszqn2e7heM6JcEs7r3IxjonGZQ39y9Pf7NdsRwIAu0BZyOs8Rdv/rWT1dCJztyStk9icqd/ntv5s4zKdCP3L1T/5mYzXHD8JACRAFRw0LbZ2tn7McZnj7ffM6nofHf396k8CAAkQsoP2m4+r/my7EOj/v/qTAEAChOygvuZJgg2m/iQAkADD5KD9nnXN/WBfpP3mEv396k8CAAkwTA46rKB/OZAAEDQUAFAAALwDBIp5KjPvaU1bO9/P6lV9l8m7Dmnb295dSAAgAXDQv86UdbfDbOd6335QHdS13ln/v6LoOpIAQAL4cFaVdPbFtdO7OgdfNFHKXgffurvWzdU6kgAAynlqsZeL2K77vh/rkE630HUnASBofgDxwVuRYBV+wAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABs0lEQVR42u2ar0/EMBzF3xEUQWIIBAyBaTQJWOCfOAweO0jIGSwec/dXgAWFI8FdCObICAaJwhRRmrDmlq5dt7bsfdx+dW/Ze9/+2ABCCCGEEEIIIYQQQgghhBBC/jODuieurWyLv9vF05ZsYOO21MZ4KgQADJeO5x4Xb0cCANZ3XwEA758vgy4eNFb9C/RgWBZtLyjObyAdcFp2zN2D3L+3AwC4UI65vhcAMDnclzueH3/b+ZYOOzvo9IFj088EpNYHFOMJAODr49LphsurI+m0k+HcGqru47tvaFu/q24mILU+wNU5puuVg6ZXmwCALEcrSfCtv6luJiC2BOjj5SqyfFbaVg6oe9yEq6NC67fVzQTEloCqN6Y7q8oRyjl1HaPXUL0d2z6ga/1NYQJS7QNMNdD1fFfnp6qfCUitD2haI/XRhauTq3Smpp8JSGUmrK95NEW1p8bLtrXYdn4Qq34mILW1IN/ozjTNSE21PjX9TEDfE+B7Jpyafiagrwnou/OZgL4mwLQKGbvzfetnAgLj7QVk+az2OkmMhNLPBCCR/4J8rbe7ftFq6x/R0PqZgMD8AOh9NpEhn1vcAAAAAElFTkSuQmCC"}, {"id": 66, "name": "毛帽貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCklEQVR42u2YOw6CQBRF7xiWgLHQWrfjEjRhAxaEltZYuAESXYLrsdbChD1AgdOQTObjQwJzT0PBfO+b95kBCCGEEEIImQ3Nl3/Nt5i6YMq3w7V6iKh7yvaKFgCQuDZcp1vRc63He9dPRR9wjS6DLEApRR9wYbPcAQBetzsAoKo/QRNm6aob73hgHvCygCZUean+87eAb7wv86L7Xs5B/03zueaHePKAVsqkpKvi/XbRZ+JEuuaxKU8f+NUHQpXun32b0raToPvFk4n1jqXuBTblHaJYE2ctNBQm5fs+E68PjKW8LR/QAmMpTwtI10qh1enkLSC2gTIvjDGbr9OSr9PSb6Sh94DZWKAFmyl1l9QS1zAAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACB0lEQVR42u2cMU7DMBiFnxFHKGKgMxwHuAEVZYeh6poVMcABiugR4DgwlwHRO5SlkYrBauL8cePm+xYkip3fz/J7iWMqAQAAAAAAAAAAAAAAAAAAAAAAAAAA7A2rNSjRD/0PkBz6jGtjBUuSc851ccCPs1cTd7kbX7iuOij6kwAAlTi0XsFPz2+V/i61g54MTldt9Pe5/HBdclD0JwEA7BMgdwddfL+b9nd7fa71vTYJlrH+JACIXaAauwvmBSSy0NLxFi9zSdJs+RXVz3hwLEkajq7UxEHrOjD6N9M/pDcJADwDVGF4dKY2VnDqe9fYuq3al/UXD/eSpJvRJfq32N7Xu5hMf9VPAgAJkIODblvJsbslxWSqzX7rfh66XqiujfqVU4Llqn/5s6zXr58EABIgBwetSqhd6Dp+XX69obqb1mm134/+vAkGsEuAvjnotvFYXc+/9w+NG/3T6k8CAAnQZwdNNU4SrJv6kwAgzgJF7APvim0O1NVx5Fr3vutPAgDPAKqxv+u/UcvFeXIH/cW3QgCwAABYAAA7Og26b/inMmNPa4ba7XrXJpdnmdh5qNo+9OxCAgAJgIP+daa6ux1+O+s3n111UGu96/5/RdN5JAGABEjhrEr0fTdNnd7qHHzTRGl7HlLrbq2b1TySAACKPNPxn4uEfp+6P+ahmm59150EgF7zA3TZLNKLe3FPAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABgElEQVR42u2aPU4DMRCFx4gjBFGEmlyHI4CUC1Cstt02SsEFIoUjcB5qKJByByiIi1ha+Sde2yN/XxftrvdFfm/GtlYEAAAAAAAAAAAAABL4PYP+MG6wTF1M7ANvh48s7njdPpkaf7g1/SSgMrehN65Xj1nroh3v+/RZJAmt6icBWnrAUisDY4wptbppUT8J0NIDHu42IiLydXwXEZHD6SfphdvV/f94L89Fe8PS+lN1kwAtCbCkOsf3vHXQtN+JiMg0jIskIbf+a3WTgNYSELpenobx8vfZAaHXveMnOqq2/ljdJKC1BMzNmOusOUdY54Q6xq2h7jixPaC0fuEsqNMe4KuBqfenOl+rfhKgrQdcWyPd1UWqk+d0atNPArTshO2M5TpXt+PZ9XJsLY7dH7SqnwRoOwvKjetM347UV+u16ScBvScg905Ym34S0GsCenc+Ceg1Ab5TyNadn1s/CahMtgmYhjH4nKRJZ1fSTwJE2dfRub+xLL3DbU0/CajMH+/8HM+/5LtMAAAAAElFTkSuQmCC"}, {"id": 67, "name": "天使貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIElEQVR42u1ZOQ7CMBBcRzwBKiJKKEKbT/AKkPIsJHgFn6CFAkoEFTT0SKYAI7LCmNiOIrIzZZL1yjN7jBQiAAAAAAAAuVCxDtKHif6YYLBSdV4gEa8AZ94wbnsOBYB/7YF+d1iq6dNl71XTsc5pTQ90qgYcF0siIkpnU+2T8C0eU8hLAYPteu4XuMEeCFPgOr4FJQyNb78CfE67kOXF155wvbfl+3U/JOI2sWv6uBjn33GmtdZlF6uUQg/UuR94vrQ3emzs866kiE2JRKwb9d3EpvZf3ujJNIdRwgbTO3I2sblxaI/w83hpV5h2WrYbjQ0b87xn5PZAU8y7PBEUaIp5KBDbK1VlvjUKRLtAlhfWmY3/AzH/D8TyQi6PJEaBO8VgfgLKF6mkAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACB0lEQVR42u2bMU7DMBSGnxEHYICJCokFhrJ25QCcAqQeCwlOwQUYWWGACaEywdIdyQzIEnnUJLGdpLa/b6mUyvHLb+X/E8cWAQAAAAAAAAAAAAAAAAAAAACAEjBI8IN9u7AbBTq6Q6OC9d9BeiABKnZQXber13ccBy1LfxIASAActJxnZ/QnAQCYBdIc7p80HPH988VMeZ7a2Fb9SQComt3aHHR1cysiIrOrSxvZHgctQH8SAEiAGhxU8/RwHdbwMa2j93Vg9E+rNwkAJEBODhrqnI712VdU/7HtXf1Ov73jc/QfsL3We75YNuonAYAEyMFB2+5k3yxHG/PF8l9Hbfvf15+vrl/1S04Jlqv+7tfVq+snAYAEyMFBu+Jr5+tH16XrbXvW1v1Za10/VkTEGGNi5unRf1j9SQAgAWp20NjZFd3f7OBURERWH8+N61m/3jf08emM/uPqTwIACVCzgw51na7e2LU66D+s/iQACPsBAuaBp6LNgbb1OnKtu3T9SQDgHUB6zO/qL2q5OE/uoL+wJxiAGwCAGwBg4v0ApaBXZYau1vS1m3rWJpd3mdBx6Nre9+5CAgAJgIP+daa+sx26Xeovn9vqoKn17ru/InYcSQAgAcZwVhlo7Utqp0+1Dj42UYYeh7F1T61bqnEkAQAkcE3HJhfxHR/7fIxDN91q150EgKr5BoFIYnRgym5kAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABnElEQVR42u2bsU7DMBRFHcTOAlMrxARDWDPyA3wFSPksJPgKfoIVBhhRmWDpjmQGsAQWxrHzEvuRc8ZWjm/re5/tV9UYAAAAAAAAAABYCo3Ug+zzuf11gsPbRsMXUUr/Dh5UngDfOc4xoddrd/7c+kkAAGjYA1b7xz9q4svbU1ZNlHpOqXml9bMHFGY3dcDm+sYYY8z68sLmTPhtfJEPXJt+EqAtAY6Hu6u8gffDauzUe4O0/lzdJEBbAran76MmDI13DnLObLt+kiRI6x+rmwTUlgD/nBui7fo/a2rs/aE1OtVRpfWn6iYBtSUgtGK+s0KOcM4Z6hi/hjr2js6ybppz6w/eF14fP1sNTcMe8C/3AKnzdaj2OgdZa+2Xk0T3gFr0kwCjtBuaWyNjpwtX+9cHJ1m1Xpt+EqDlJuxWbGyN9Z/nzsuptTj1flCrfhKgtRsqhe/M2I107l/SptZPApaegJhzanH6VPpJwFITsHTnk4ClJiDWhazd+dL6SUBhxBag7frgmVcDpfSTAKPs/wFSvRSpLqd2/SSgMB9j7CRmrssl1QAAAABJRU5ErkJggg=="}, {"id": 68, "name": "小惡魔貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8GT+AgYGBgYGmcSE/+RYiKSfKh4YeTEAA7JykoPCA0wjrhSiVsg/fvR8tBTCmgfQy2lC4LhvNAMDAwOD5ealZMnjso/YmBnNA7jSNrHq0EO6KmoDSoy0LQtgHFkxQCgPULsUwgXi3boYiIkJphHbGiU3JtBDHj2kYWDhrjK85sDyzsiJAWrVyIRqYFJLu5HbGqU2wBXyuEqrYZMHWAZ7yBNqE43GwECF/GgMULsvTW4PbcjHANU88PjRc4ItzNFRCWrmAVyhTe9YGPIxAAAUc3GeW2CFQwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB7UlEQVR42u3aO07EMBCA4QniCDSIR8kduAAdEjUUwDGgoaOg4QjQQI1ET8sV0JbAimbvEAoUKTE7xG/W8f91+/DaO5FnHMciAAAAAAAAAAAAAAAAAAAAAAAAAIAyNLX80a2Nvbb/er6YNf/5O7VZ1fivcWlQs/XaMujn3b2IiGyfn7WB7cmgE4g/FQBUgBoyqGlnd3Ml1sSuGZj4x403FQBUgJIyqG/m7OxfXQT1H9q+G38Xv/liRvwTtjfjLSKD8VMBIDwH8JtJQT7ev5x2Icz+tfbmLsdY5nw9PPnJLM8PS7+vfd71r9HGNTZ+4p83/lQAcA/gMoNtZ6jt51p/vmtMrZ3Wj5ZZukyhjVvr7/L4qe2vNa8fj5qQfXrinzb+VABwDxBzDWrOYNc1aG8GS38Gp1qDhq6hNacHN4PXL2+3Xmtv4p82/lQAUAHIoPmMjZ/4540/FQBUgCll0FX9H6WOe+rxpwJAeA4gTvu7RWbQ0hH/NKgAqBoTAEwAgHuASpn74eaTTnE8n6/9Hv6+l/G9DrbttXsXKgCoAGTQ35nJY7dj0M71VGepGTR2vG1Pp1p8z+o6UgFABciUWSXG+ffUmT7WOfgIFSXpdcgd99hxi3UdqQCAeJ7pWJZFtPdz/x7XwS5utcedCoCqfQNdWAewjVN6tgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABa0lEQVR42u2ZPW7CQBCFhyhHSBPlp4w4R05AnYocIQ1FDpBrJDTU1ByF0gTRcAdTICSz0iY7Zuzdwd/XIGR79yHe25ldiwAAAAAAAAAAAAAAAABcM6PUGx/uXurm9+1+PWozodU4uea11n+DB/Nyq33g9/tHREQe36d1mwkbz2f5waXpJwHeEnDi6fm+07W669pgrb+tbhLgrQuycs6m2p11EeH44XUrh1rrDxOl1U0CSqsBYZ+rdUDqdcUarVpbc+vX6iYB11YDTs5JvS/msNfxh4iIfC0mvdaAvvWTAK81wKq/jq694+PH59uy1iTBm34S4PU0tG0/nbp2zlezP8fR7g9K1U8CvJwFhTvWS2k4+Gy8eTVLdahqf1CqfhLg9TTUithZUGzN7ftNWtf6ScDQE/Cfc0pxelf6ScBQEzB055OAoSYg1h97cb61fhKQGbM/YFPtoj2vB3LpJwFea0DMLV5SUIp+EpCZAwd69+NtbYl0AAAAAElFTkSuQmCC"}, {"id": 69, "name": "聖誕貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABNklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjFTASKqGpx6+/6npAOkdmxkp0c801GOAheiQElGjasibnbmJEqPkxgTTiMkD/////08TBzAyMiKbD+OP5gF0ICOqzsDAwMDwZP4CBgYGBgbL+kqyLDze2A4xLzEBa0yM5gFCpZCsnCRVLH786DmkFHpza7QeoKi8Pz7hNyRPFLCSJY/LPmJjZvjFAC6f44wZ26OQkD6LVlq9vomm0IGBkpAezQPEAsyQJ6+NNWLyACO5IUVufQAr/8nOc2j6Rk5bCOZjavULCIU8ETH8f2TFAEYNe/YApIY1dqBO3xhHyKPnmZGbB2gVE4RCnlB9MBoDtErzI7c1SmuAq3wnt4c25GOAah54/Og5zjJ7SHhgyIxOU3uMlNIe2pCPAQD1O38Emsk5wgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACNklEQVR42u2bMU7DMBSG/yC4AQyohREOgITUAakjC3eAG7AyISZWbgB3YGGEAZWBsrcjFDHADRjCEEUCqyau4yQYf9/WVraff9fvT54TCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYiNLbcKv+wd5yP56N9cZf6N49V9iSSBlllPJoL3VraBx7z5OfujR1jzQP6z+OADgAClk0Nn7JGx/5U1UlmWSlOd5/v0zDhaH/jgAiCqQA+UOCx5Ayxl0dnklSRqcnnj1Mzo7lyT1jw6LDPoxzerE49oe/evpb9MbBwAcIKYMumjmNNttbK4HEe7l+U0h4nh4usvQvzn9zXHNdjgA4AAxZNCqnexaLTHjH118Fhn1eGV+xrT8Xo5vwxZXVfzo367+OACIc4Aa9WbfHVw1nm91xdbOOq+9+yLOcfGxv7at+XXroULGGarej/5TngUCCOYAqWVQ1TyxdB3P9dof/dvVHwcAHCDlDDrYGXrNM1Q1Bv271R8HAHEO0EEdWi2fwHY9j1jj/u/64wDAPYAWq+9GmUFjB/2bAQcAHCBlRuPbX3/3rVJAHPrjAIADpJxBy5NTGXV083s51t/Ndk1fq8emv3kvY1sH89xBjucTtvWw3bvgACDOAeRfxzV3nuvOdd3Jvs/PV75ZZckQdd94MvtxzURdrUNbuofWLdQ64gCAA4TIoIteezXVX9Pvtv6Vcerq1pXuoXWrqy8OAOC7Q+c94Wf7vu3+WAc33VLXHQeApPkC5ztHfzmWw1EAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABoElEQVR42u2aP07DMBTGnxFHgAHxZ4QDICF1Y2ThDnAMJsTEMeAOLIxsXeAAZWypOsAdzIAspVasxslL4ld+v61N63yRv8/v2YoIAAAAAAAAAAAAAABsOy73D8ura68p4PD1xQ35wKXp38GD47LbeKb3TlWdc/E+W3Nk30koVT8JsFIDvPe+FwHOuer44bM2peonAVZqwNH+mYiIfD09i4jI5P6u1Q2nD49/493e1DoprNXLn0/VJPStP4xPDdjWGhCceXxyoHLjxXwlVafH48fXtbogbf2BtrpJQGk1oGm/nHJA0+ubqPw+qyaMrT9XNwkoLQGpGYudFWZ6+vFW3218z9a+n5xfZq3NbWvA0Pq7QgKs1oAUsXMy1kyV7seafhJgbR/Qtqtp233krvXW9JMAK2dB8Y61KxUH+yZraw1Z+4NS9ZMAKwmICf1z1/44dRa0aU3tekZUin4SYDUBWk7S3glb008CrCdAlM/nh3J+KfpJwH9LQKo/tuJ8bf0kYGTUJmAxXzU+BymRsfSTADH2drT2O5baO1xr+knAyPwCFA4Xb1VXh1oAAAAASUVORK5CYII="}, {"id": 70, "name": "小獅子貓", "kind": "cat", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABHUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2CgACO5Gk9W6P8nR595x0VGanqAacTEALkhTusYGf4xAAv5oDnfUcSfvrlFVshJi6ihxOS6FE6KYmLIxwALqWn+yfwFDAwMDAwyiQlk5Qkk/VjtIzUmhm8MEAJX51gNCg+MvBj4+HcWRRZSqn/41wPo5TShtK+dcgxvnsAlDxPHBYitZ4ZvTYxeD8BqYkKlD6EYQVcHq4nJbRuN5gFywWgeoLQ1Sm5MoIc8rtYooZQAi6HhXxOTGjLEAlgImndgz4OESzGG/yO7NUptgCvkcZVWIycPDHTIE6oPRmNgoEJ+NAao3ZcmNeSHTQxQzQPaKccItjBHRyWoMT9ArbYQpf2AYRMDAJvhgqlqvjdcAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACEElEQVR42u2cMU7DMBSGXxELGwMbzCwdGJE4BeIEIOUQHIEzoEpwAo5RiZGBpXPZWJiYEEyWiMvDju3Ycfx9C1Kpk5ff+P+bF1MRAAAAAAAAAAAAAAAAAAAAAAAAAACol0WrF/58e/YdMu787mXBn8189N9jKoAEaMBBQ+ud2/WgPwkAMDwBanVQU/fV6rP3+tv7Jui8x0enPR2euoOs14H+afUnAaBp9kuvYHP81E6kOeb24VFERE5uroMc9dd4yXkd6D+O/iQAkABzdlCN19VFUeGNE2tOjv559CYBgASoyUFdzuni4+s+6vyx4039Rr/Dyw36jzje1nvZSa9+EgBIgBoc1LWS7ffZXRONZbf+11Fdv7fPoznkbv1rqSnBatXf/DT12vWTAEAC1OCgvphxdhdFux67Lrte12dt8yRSEj1ZRf+8+pMAQAK07KCx3RXNQbXjGn00h0X/vPqTACDsBvVYQan7z0O7IL4O6tvFKIWrfvTPqz8JANwD+OwydDnT1J9kav3gqTg/+pfRnwQAEmBODjpX0H8cSABoGhYAsAAAuAdoFLsfHrpbUxtXuu9dy71M6Dz4jtfuXUgAIAFw0F1nGtrtsMel7ttP1UFT663ppv3fQew8kgBAAuRwVvH8nprSTh+7Dz5Voow9D7l1T61bqnkkAQAkcN/3Xy6ivZ77eMyDn26t604CQNP8ANEwXVI8I10mAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABpklEQVR42u2bMU4DMRBFJ4iGng5qKLZAVEQcgxMQaQ/BETgDigQn4BiRKCnSUENHQ5UKJU0GEYvgtdfOjuP3y0SOf7T/jccTRQQhhBBCCCGEEEIIIYRq0Ch24cvdxTJm3dX968jCF7fi/4AMFkJAbGKsEGHVPwRYJ0CTczNdbLz+8fkW9eRPjs82kvjcHmUlwbp/CBhYh6E18/3xSURETie3UTX11/o/90tFQin+IcAqAT7Np9dZDGmNja3RQ/vnDNh3Ar6+H3pt6FuvyWxayUJCLv/n48s1wYsg3xBgjQCtwW7f7KppZ//WVN/77k1S952P+5Gwa/+6T6xvCLBGgD4xt492E7UtEZqcrl2G7qM11P2c0DNg1/71JkwXVNsZkKq/TpX8Uv1DgNUzYNs0MbRG+rqPrlNHn89S/UOA9ZuwO93zPdnQbkX75dBa3LXPtu4fAkqdhqaSJunnJuy5kfb9RcuafwionQBfcqwkPZd/CKiVgNqTDwG1EuCbQlpPfmr/ECB78qN80846z0ksaij/ECCF/T8g1SwldMqZunux4h8CBtYKdXczhUCm1E4AAAAASUVORK5CYII="}, {"id": 71, "name": "藍圍巾哈士奇", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjVcPb6eQYGBgYGY03D/+RYiKSfKh4YeTEAAyFJWYPCAyMvBtq7Z1NkIaX6h10MUOyBN1b5DG+s8smWH80DlBqwxB/K8IeEsoyoOgMDAwPDk9c3UdQVHBuNAdrEQEH5RAYGBgaGCZ352EMeKj+aB6jVGnVYc5MqFh8IUUdpjcLMJ7V1OnJiAD0miG0LvfGC5A2RbZC8sGbeNKwhDzMPXX60FMIFYKUOsaUMLCYYoCE8WgpRmgfILe/XoMUAuWl/NA9QqydHbsiP9gdGPTDQeQC91IGlZXqPVozceoDaYMSWQgBKgmQZ8vlq1gAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACBElEQVR42u2bsU4CQRRFL8ZPwEpriaWx8xNsaCitLG2g4xOM2khjY2JlaW2tDZ2xNFprJf+ABU4iEybL7swuDO+cCpad5e2dcO/szCABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAetKzc6G57f/r//ffks7XK61hjXfXfomvAMtvWHPT1/U2SdHRwOI1sj4NugP4kAJAAFhzUp3d2nmWHoX9aSAAgASw56MX13Urb+2PxqmNw9E+jNwkAJEBODhrrnD6T474kqT0eVfq8av3OwUdXA/SvUX9f78f727n6SQAgAXJw0KJfclUeun8vurM693Y6kqSvn4+58wZjpa5fOSVYrvq7+ly9fv0kAJAAOThoXQyGM2e8uewvrns4KrWyqoJZG+f8qcbQ6B+nPwkAJIAlB52c9BceP30JNAic38NBN0J/EgBIAAsO6hzrudeZlllJdffbfoqbRUk19kf/tPqTAEACWHLQWOeNvQ/rCbZu+pMAQAJYcNAQbvZEBbMsuYP+JABA+gTI3UHdyqkC890quT/fb1f3vv3c9Pf35vjPGGX7oUj3omcXEgBIAMsOGnKmsrMdfrtlV1hzd9DUeod087+/6Lxl+5EEABKgCWdV5F6Uppy+qtOFrpNq33zqfmha99S6pepHEgBAFf8htMhFQsebvh79sJxu1nUnAcA0vyCx8IP2bn/4AAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABc0lEQVR42u2asVLCQBCGF8dHwEprHUrGt7CmtKKkwc5nsJOGkiegtvcBGEpHa6zgHbCKQ27MTO6yl72V7+tIcrmfyf63u5eIAAAAAAAAAAAAAAAAAPxnBm0vvB7eHk9/fx++BikTat3Hal5t/RfEoC2XsQM2H1sREbkfjY8pE56MN/nDpenHAd4cUDGZzrKu1blzg7b+VN04wFsVpBU569WyVkWE9w/Pa0Wotv7QUbG6cYDXHNAUAW3Pt12j16tllpyQS3+sbhzgvQp6fZnXjt9c3YmIyG7/WTv+9LyIWpu1c0Au/fQB5+qAMDKqSIqNnL4jvzT9OMCbAw4P8z+PP743DGi4XoIqoy9K048DvHTCqR1lFXHDt4VJB1y6fhzgtQqqqoa29fHv2mu09peqHwd4zQGpnaLWLmLXHFCKfhzgvROWjm+i+u58S9OPA4zhAfAAyAHSZRcxXAtzfS0hmXZBrfXjAK99gDZW34ha68cBxvwAkWX2DumPJkoAAAAASUVORK5CYII="}, {"id": 72, "name": "飛行員柴犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJElEQVR42u2XPQrCQBCFX4JHCFhoISh6gNxAxEPYpBHByiMEa28QbLyGiDfwAEoEi1gIttax0BFdLdxkQwj7vm7/Ztl5uzOzACGEEEIIIYSQcnD+ndjwuul7+3w9OFk2NGVHcKuuQE13QXJcAwCa7WEKAOPNHgCwHPR+zlfH39YbOYB9CiymIwDAbOgBAG7PfmmrqOOy3hSudVFoN+8Y2dgPY0YhIwfww/jlzSzjjEJ5DSSn7Ue72ep/9CfBo/+ymlCBQhQQz9aD6KciRXne3jwgZM0HakSSPCD2dfOCPW9A9VReVHuiqB9CSwl7M3E9iF6Rp9KlROXzgKigG++/73626pQK6KLmj7z/Av4HeICy3oAadeQum/ozsxr9tyo1hbVR6A4y2W0Tp4St7wAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACMklEQVR42u2asUoDMRzGv4qbi0NBwQ6Cog/QsZtIF9/AwS5SEAc31+Kqk6u4+BpF3Dr6AJYKDnUQunauQw20sfGuvdzVNL/fIpf0zv994b4vl5wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhUIrlRnfKB6PJ489Bt7TM68TGf9V/jaGBmFmPzUH7721JUmWvPpKk8+c3SdLj8eHM39v9E+fjoCugPwkAJEAMDmq4uziVJF3Vy5Kk4U+7Obax+835ywL9/epPAoBYBZpj7mg/qcPrjiRp47Y2+wl29N+3B4XOQU39rzf7Xq5XbfW8zMXTno/+2fR36U0CAO8A83BW25xu6JyM/9rtCf3GgfJ2zrRO4nKmpP6sTrh92UX/HPW39a62NFU/CQAkQAgOmvQkL7yq8vEydVzZPZpq7zfG7V9PTc/19xRSgoWqv6nP1GvXTwIACRCCg+aFqWur8TDzfpLqtndWXdjO72sOjf7Z9CcBgASI2UHT1umqhwQLW38SAMRO8BJ28pa9A1v0fYRa96rrTwIA7wDKsJ4aivOEDvrnAwkAJEDMmNUTX6sTEJb+JACQADE7qNk5lWO9W3OuS9vn5T1XD03/X+8yav6pW9I4JOme9O5CAgAJELODupxp3tUO+7y0O6yhO6hvvV262f8/6Xdpx5EEABKgCGdVxm9RinL6RZ3OdR1f3837Hoeidfetm69xJAEAtOA3HbNcxNVe9PUYh3S6xa47CQBR8w2MRBvQ7rvK5gAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABjUlEQVR42u2aMUoEMRSG/xWPsLCFWwiKHsAbiOwhbLYRwcojiLU3WGy8hog38ACKgoUWgq31WmhwJ7rMJCaTPP2+biaT5B/y/uQlRAIAAAAAAAAAAAAAAAD4ywy6frg23JovPj+/3g1iOkzVTql+U+tfIQbLshpa4enhUpI03pjMJeng6laSdL63/eP3fvlC/SI/XJt+HGDNAWdH+5Kk48lQkvT2+d49+/jlrn7bHJtrbcilP1Y3DrCWBd2cbibpeOfkvpFF+O375amyoNT6HbG6cYC1NaAtArqWt/EVUcqyJuTSH6obB1h1gBvp0XTWeD9e3/3Ilx+vG+9fLg6D5ubUa0Au/ewD/qsD/MhwkRQaOX1Hfm36cYA1B7gR9ke+6xzpZxd9U5t+HGDFAf6O9be49ly+nGqHak0/DihM9ACMprNvObQlatGPA6zvA1wUhe4Uc59+WtGPA6w7QJFnMKV2vrXpxwEswgwAWFwD/Kxh2RlLrdSiHwfIyK2IZXcjlfisRj3fES2tHwcU5h3evvXebVfZxAAAAABJRU5ErkJggg=="}, {"id": 73, "name": "粉領結貴賓", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA+klEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCF959FVqlisIqdNlZgZ8jHAgivkL14/jyKur2lIEwdgsec/KTEx5GNg1AND3gMqcto4SxRi5Ed8DLBQagB6vQALbZg4teqN0Zp4tCYe6NYoeozAYoJj5lEGBgYGhh/p1lj1ocujhzwsxGHmj7aFCLXfceUNWEgzFNhD6AkHSTIPFqMqctojqy1EcT2Akfa//4HQOPLEaD1A7RggF2BJ+6M9MroAXG0nckcpRvsDox4YLB6gdc9rtDVK7bFRao2VDvkYAADUf1/j2qVHdwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+UlEQVR42u3cMUsDMRjG8VQU1NlNcBJBHMTZwY/j6kdx9eM4OIuDCOIkuLnrINSh3GDaeNc0d+3d/f5LoeXSN0+a58mlaUMAAAAAAAAAAAAAAAAAAAAAAAAAAPSDydg6fHhwMi3Rzsfn68THp//6bxkSSIABOmiqzrf35yLtHx+dbVS/6J/XLwmAUbO9xhk8bcOZqrqfXh7/PH9+etGKgAveZ1qyH/RvV38JAAkwRAcNPdkNiftJ/271lgCQAEOYyavuJqTW1nWv59Zftbe3v0P/FvWP9a7ufar6JQAkQB8ctG4m5xLXFdfblvOn9rHpX1b/qr6q3rh+CQAJ0AcHXXbGV7sZq/anjtTuTLyPHzt/qTU0/VfTXwIgOAu0QWc56pwh10HjNWzF7t1DCCGE7+vLhdfVvZ7b77r66d+N/hIA7gGanAlJOVLuDF7X2jTeDYjrDDdXs8fb+6Lvv6xz0r8b/SUAJMAQHbQpc8759TN7LLTmHGuC9UV/CQAJMAYHHSr0lwDAeE6DlibeD889q5O6ruvdlk3nn7M5WePQ9PrUvYsEgATgoPPOtOxuR3xdqX9v2HQHLa13Srem34ssO44SABKgC2cNLf/PTSmnz3W6VDulzs2XHoeudS+tW6lxlABAyPyF0CIXST3fdXvGoZluY9ddAmDU/ALpUA4jsjo8PAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZklEQVR42u2asWoCQRCGRwkSsE0XsJJAsJDUKfI4tj6KrY+TwjpYiCBWgl36pAichQzo6hIPd50d7/uaAw/3ftn/n5sbTwQAAAAAAAAAAAAAAADgnmnV/cLz00uV4sLb71XL4geXpr+NBwtNQMwp680iyYX7vUFWZ3nRTwKMeYg5Z778Ovp8+PqWRcCZ61TXJMGbfhJQWgKs0Rrd7w0qy26pLt1uhy6oUQkIu4Cwu/jvvHUScumvq5sEeE1AzBHqnLqOD2uorpPrHpBaP0/C95IAdZz2s6mcdSvne9NPAkq9B4Q7qE+YYY18nM5EROR39H52nfB8bIaSGi/6SYCXLkgdFZsyqlNk/LE/Tj4vWk/75dxdR6n6SYD3WdBJ7fz52x8jNbU0rPWTgKZOQ7UWH8xOxNP0M5V+EtC0BMSmjl6cn1o/CTCGDWAD2ABJ9Q/TreY8ObDSTwKkoe+GitG7oqXpJwHG7ADG3tEi2VLEAQAAAABJRU5ErkJggg=="}, {"id": 74, "name": "笑咪咪黃金", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJD+uoKC6pYrB3B8J8aMTP8YgAW8vtaJFDEnWpe0MQBmPZAYobYmBjyMTDqgSHrAe2IEwzaESfI5o/GAKF6gBCA1QccMlYMDAwMDHePQGhlmz4ovwhN/WgeIK0tRGpNDIsJ9umfGBgYGBh+ZvIxMDAwMPx4cgxnHhqtiUlpjaLHCLltIvSQh4U4zPzRthCh9ju1+wMw82AxCmuljraFRj0w2GtiSgFm2j8x2iOjC0CvP8gN+dFMPOqBweYBWvW4RlujtBobpdZY6ZCPAQBXWWF74CBD9gAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB/ElEQVR42u3csU4UQRgH8A9jgpWhsDDBzsTGFyCEyvAQJrY2tNaW1ra+gk9hZQwvQENCB4kFlZVWWBxT3ODI7e7scrP7+zWEg1tm/st8396wXAQAAAAAAAAAAAAAAAAAbdhZ2oT3n726qXGcq+vzHb8+7ef/yClhyR7PtYKWxnn29aDK8V+/jZttmpf8+81LB0AHmFMFTeP+9un52uNvPv4cJcC7P2c1r1rzkP+4+esA6ABzrKDRyG5IPk/5T5u3DoAOMIeV3P0a+HTtmrrr50PHn46zd3wu/xHzz/NOr33S+HUAdIAWKuh9K7mrdJwnLw4jIuLi++rjy6PPt59/yL4/qlb+lIf8x80/jS+NNx+/DoAO0EIF7bri027GfX5f/libx+W79xER8Sf7eklpdybfx88r8dBraPnXyV8HINwNWuEvkWkF7375tVrBJ0//u4K7XgMPraD5NexD2XT88p8mfx0AHWCOFXTb5tHquOeevw5A2AUasJ/aSuVpnfzHoQOwaBYAFgB4DbBQ+X5433t1Ss976F2bVl7L9D0Pmz6/9NpFB0AHUEHvVqauux3582q9e8O2V9DaeZdyK/3n3NDzqAOgA0xRWWPk97mpVen7VrrScYbeNz/WeZg699q51TqPOgBEz3s6/lVFSo9PfTznYbPclp67DsCi/QWVPP+SPdctLwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABYklEQVR42u2aMUoDURRFb8TCBQgKWgiKzWxAxMpVDNi6AmtL66zDVViJZANpBLsIKVyAqZJCXzEjmkz43/ffzDlV+CGZG969/7+8GQkAAAAAAAAAAAAAAACgz4y6fuBo/3yZ4sLvH68jjx9cmv4dPOjLblenTB8vkly4qrXM6awo+klAaQkw5zw9HDbWr+/nWQT8vM6Xs7ZNQjT9JKDUM8AL26Ntj/XqlrpycHby/WpOFzSIBFT1ZI2D/37fOwm59HfVTQKiJsAqvXd82Vg/vRpLkt6e7xrrn7OXDffQpkNznQGp9fNPuC8JMMdZP7sOc4Y5aXZzK0laODk/mn4SoCDT0PZsZduZSru7aH9Prr2/VP0kIEoXZBVNPU+3fjnVlDKafhLgDAWgAJwB8rw32569RJl+ptJPAoaWgP/q+6PoJwEcwhQA+lCAqp78ehcpAl76SYAG+myonJ4VLU0/CXBmBWGNzczEM0spAAAAAElFTkSuQmCC"}, {"id": 75, "name": "伯恩山犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJUlEQVR42u2YPQrCQBCFX0RbKxXEn9IcQBFEBO8g3s9evIONCKIH0NIfBLWytYhF3CJDYrLJBjF5HwgJa2bNvN15swKEEEIIIYQQQn6DpftAo9JxTEx8eRwsE3EK/65AUTfTrXb9a8D1bgkAGHTHYXM7JpTJngIq8zLTp+M1lR/go6ijo8TfK5D4BWZT9xN3nFUoaQB7+HIv5iXf6iPHqYBpBTBafeq/e9us2gCA830vvjimAlq9kK4TKweWBDlykK/kzokt3S5007ONTNzf7j0ZV/GpQFQlwrpSxaJWBgBMbk/P2peZV/HkOH3AQN/vUaJvuKvN7x6QThtVCVn/46597gFTJ7C4meeJjC/w6z0gq45ay1EdmgokVSCon0/r/6PMKvAGMeZq3nInrU4AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACJUlEQVR42u2cvU7DMBSFbxGsTICE+BnJA4CQEELqOyB2Ho294h1YEBKCB6AjUCFBJ1aGMAQPteLadW5CHH/fQkubcH2Mz0lv0ogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAajHIb8N7WUamxn9l8OuLfJ33915gSyJn1oTqoq86Dw92l2z0834mIyNnx2Pcnyj6NC/3jxkUCAAkwJAc1ddt1vr1+tCJgjR6l5jjQv139SQAgAYbooKHcXFU/rydxrzd1Snuc6N+O/i69SQAgAVJyUNdKjqU4/6keTDZqj53t17XqN847m0/Rv0X9axJ1oX4SAEiAFBzUt5Kjubj/655UT/e3CxERef96sd44Vq1f65ge/SX0fEdt/SQAkAApOGjsivdhHNP0z+26ff10l5PbfXzb+dW6LOjfSH8SAISrQRXORJoV7FrhoStXPP3qWAc143k8KVSEu/z8jtoutH7070Z/EgBIgCE66KrXqri43dlsVK923eivqz8JAEIXaIVP96dPkqSDNkVrHE27K+ivqz8JACRADg4qnuvnxdOnTh30JwEA9BMgdQc1Z07F0e+WyD556De4ctPfPlNs6nPp5psHn+6+zy4kAJAAOTuoy5kiuh0L22ndvaHvDqqtt0s31zfnms4jCQAkQEfOKm3e50bL6WOdbsl+yj7cSS7UQf+7rlDdtOaRBACQyGs66lzE9fuu98c8hOmWu+4kAGTNLz2a/GUgAowMAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABf0lEQVR42u2aPU4DMRCFJ4iaCpAQPyU5AGglOu6A6DkaPeIOdEgoHCApCQgJqLiAKdAUWeHY3l1nZ9D3NZE2if0iv2eP7YgAAAAAAAAAAAAAAAAA/GcmpV843D0NQ3T89rWYjPGDrenfwoPjsl3qlOOTg7UNPj4/iIjIxdllqu9Q01le9JMAawlQ57Sdsnx5ryLgD0eGPknwpp8EWF0Dcrm9/n29uev2/hpHhU1US0Prpwryvg9IzaH6vD2npubcVHsx9HO5SbCiP1c3CfC6BujIa92sHO1NRUTk9XO+8jyjru7lfGv6WQO8nwWV7iTbTko5JzaHDuV8L/pJgJfTUHXU0/l0kI6b2bxqArzoJwFeqiAd0WYmIad+V+73d0RE5OrjO+aQovak5/m9Nf0kwOs+oODcfMVJTaVTSa/6SYDXO+GuO8XYGUvtna9V/STA+31A3xukTTnfqn4SMDIMAAPAGtCJdtWQe8NlBSv6SYDXBMT+Z7M0stP1op8EjMwPk1377ROV0yYAAAAASUVORK5CYII="}, {"id": 76, "name": "傑克羅素", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9UlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TsI0BXCH95PVNqlgsI6pOlZgZ8jHAgivk+3xEUMSLtrwhy4KdpQ545THtYfhPSkwM+RiguQfcuw8wuHcfGLoeoHseILc0wVU64ZRfoD4aA1SJAfSQRQ9xatUbIycGYOUvrDwmOUaiU0hSj16/jLiamJHcVii5aRu9DQQLcZj5o20hQu13avcHYObBYlRGVH20LTTqgSFVE5MLsKT90R4ZXQCuthO5oxSjmXjUA4PFAzKi6jjHekZjYDCOjVJrrHTIxwAAw+ZfPOqxkNEAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB4UlEQVR42u3cMU7DMBjF8QRxhDLBTK/BxsINWDkAQuopKiGOwCFY2LgGzDDRO5QBZcCtaeI4ad38/gtSS8znZ/xe8mFaVQAAAAAAAAAAAAAAAAAAAAAAAACAMqinNuHz2eU6xzhfq4/ar0/5+p9YEkiAI3TQWJ2f3+9Zxr84mx/UvOifNi8JgElzuscdvB7CmZq6H29mf15/eFkljfe6uPr3/c2fU61zzoP+w+ovASABjtFBc3G9fGs1j1SnDOdJ/2H0j+ktASABSnLQ2E7u202I3VtH33+e96q/Ga+ua/oPqH+od/Ps09QvASABSnDQXTs5lbCusN5cXZct9VclJVip+jf1NfWG9UsASIASHLTrjm+6GZ3nc3vX6ftj3Zmwjx86f657aPr3018CoHIWKOdfIu+Xv1+fFklnOXY5XaqDhvew+6Jt/fQfR38JAAlwjA56aPMote5j118CoNIF6tFPLcV5Sof+wyABMGlsANgAgGeAiRL2w1PP6sSu23fXppRnmdR1aHt97NlFAkACcNBNZ+ra7Qivy/XpDYfuoLn1jukW+8+5vusoASABxnDWauDPucnl9KlOFxsn17n53Oswtu65dcu1jhIAqBLPdGxzkdjrY49nHdrpNnXdJQAmzQ8B6eo0hjF3VgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABTUlEQVR42u2aMRIBMRSGH+MItrK1vYZOo9ZoncCMU5hxBQ6h0WkcgpqKO6zCZIaYIGS9ZH1faYf85r0/+T0RAQAAAAAAAAAAAAAAAKgzDd83dNrdMsTCx/O+ofGFY9PfpAcjdYCrUw6nXZCF86yotLNS0Y8DlGm5Omc+aN+9PlmdP1pgPe09ff64jpTfOCE1/TggNgeEpj/bvNVJ9h6dZ0WpmZZ89Q8X26sDHGcDDqibA+wUYKeLV89lWag6oSr9vrpxQKoOcOVp0zm+edvsofbnVHUGhNbPL+G6OMB0nMmz3p01Gqt2fmr6cYAkMg21Zyuf7pHvpo/Qe3+s+nFAKinIVDT0PN3k5apTR6z6cYAyFIACcAaI5n+zN7MTiWH6+Wv9OODfHPCr3J+KfhzAIUwBoA4FyLPCeVcmBbT04wD507uhonRXNDb9OECZC8UgycICHkE2AAAAAElFTkSuQmCC"}, {"id": 77, "name": "頭巾柴犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkViF0iJq/5H5T9/cYiTHQmqZAwNMQz0GWEjV8OTuLgYGBgYGGWW3/+RYiKSfgYGBgeG/f9x/BgYGBsaNixhHZAyQnAeeWFtQ1wFkhvzIzQMv3d5QxWLj+jujeYCsGMAVkmcbVciSH80DlBrw5ME+FL6MghOK+JN4aN5ZmEYTD4zGACxkxeNnYY0RWoX8yK2JYQBXqUJsqYXeGoWZT2rrdOTkAfSQohSgmweLUeN6BpJiYsjHANkeEI+fBS95hqQHhk09AIsFUst7zLR/h2G0FKIHQK8/yA350VJo1AMDnQfQSx1CPa/RGKC0NYqrVUotMGJLIQCxFmn6MUIFwwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACB0lEQVR42u2aP07DMByFXxBHQAKJDkggLtAFiY2hKzegWxcOUXENNrgBKwM34AIVSAxhQOodwoIlYmqcxHaK8fdtSRvnl2flPf+JBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeVCV8qCHe6fN9+P39araZjul8Vf136FroGR2S3PQ+vVRkjQ5njWB10uSmsurRpKqh/uKBMtPfxIAmAP0cQ77DQx9g+vzM43poOZ+0QRMXDf6p9WfBAASoCQHfb45idLedPkS5KCmnq5jcPQP09+lNwkAYhWoBx+zddQ3uO8svq9zdq3D5Uy+34c6v2nv4HqF/gn1t/WeLtWqnwQAEiAHB/W9yUOp355ax5Oji9b5ev7lvHeLqGNgowv6p9Xf1GfqtesnAYAEyMFBU2Hq2p/fbnweX932zqoL2/ljjaHRP0x/EgBIgJIdtGudrnpIsLz1JwFA7ARvYScvdNUj9GvIsZ8j17r/u/4kADAHUMB6ai7OkzvonwYSAEiAkjGrJ7FWJyAv/UkAIAFKdlCzcyrHerd6rkvb16Ueq+em/4+5jBa/6ubrB5/uvrkLCQAkQMkO6nKmvqsd9nVdd1hzd9DYert0s+/v+1/XfiQBgAQYw1kV+C3KWE4/1Olc7cT6bj52P4yte2zdYvUjCQCggd90bHIR1/mx26MfuulWuu4kABTNJz+IA4fA7q3eAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABk0lEQVR42u2aMUoEMRiF34hHELZwC8HFC9gIdhbTegO38xriNbbTG9ha2Ak2XkAULNZC2DuMhf6yExnZiZlJfvm+bpiZ5EHeS/6ESAAAAAAAAAAAAAAAAAD/mWrTD3d3Dpr157fVUxXTYap2cvWbWv8WHszLdt8fli+3kqTpft3EdLj2vySpOT1rJKm6uR4lCaXpJwHe1oDl8VFaAYFzrJ/Ua8PQ+mN1kwBva8B7vUrS8eHFc2sOnd4/SJIeL2df7zVIEobSb+321U0CvCUgdIBhzt30fdccGn4/VBJS6f9Obj2L0k0CvCbARnoyX7QdsXfyWS+/3rXn3qvzX6uTLgcOtVNOpf+vkACvCQidYU7q65yxnV+afhLgLQE2wuHIbzpHhtXF2JSmnwR4SYDNaWG9Hou1Z/VyV52dilL1k4DMRA/AZL74UUN7ohT9JMD7PsBc1HenGO6Ax67/S9FPArwnQJFnMLl2vqXpJwEswgwAeFwDwqqh64ylVErRTwLk5F5Q191IJT6r0ch3RHPrJwGZ+QBtX/Q9aQvOdwAAAABJRU5ErkJggg=="}, {"id": 78, "name": "小花白狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/ymx8En1LIjFhQ6M1PAA01CPARZSQ/rOo6tkWcQx8yiEEdzFwMDAwPCf4cB/BgYGBpnWNBR1T9/cYhxRMcCIK+QvXj+PIq6vaUhRDKDHBCzkcdlDbEwM3zxAK/Aj3RrCaKWOeUM+Bij2gIqcNoOKnDbZ8qP1AKUGoJdKsNCGiVNaao28eoBWNTG2vIENjNbExMYIuTGBHvKwEIeZP+JigOhSCD2kKAXo5sFiVEVO+/+IaguNemDEtUbRSzWktM8wWgrRA+BqO5Ea8qOZeNQDg80DtO55jbZGqTU2SqhtNOJiAADex14JQhaAQAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB9UlEQVR42u3cvy4EURTH8TNCglpHttpIZAtRa7yDd6DWaNTbeAOeRrO1KEQiKqHzALpRrJuYa4+ZvX9mnbnfTyXLzN77G3POzDVWBAAAAAAAAAAAAAAAAAAAAAAAAABgQ1XahHd39uuY7d+ubufBXZxU/PrYz3+NQ4KSrQ+1gmrjfHl9DNrf5s1s/sXptYiI1HJXi4jsTc8aP/f+8VzRwezkTwcAHWBIFdSN++HpvvH64cFRVFCf58ff87iUn+Ne8D51ynmQf9786QCgAwyxgubi5iHTNNfI/jzJP0/+Wt50ANABLFVQ7UwONR5N/ry2bvt+6Pjd/ra2N8g/Y/5+3uPRpDF+OgDoABYqaNuZHMoflz/eXJXfvQ/5583fjc+N1x8/HQB0AAsVdNkz3q1mxM6njbY646/j+5U/1TU0+cflTweA8DRoD3+J1K5Nl60MoRXUv4Zdla7jJ/9+8qcDgA4wxAr63+ZhddxDz58OAGEVKGI91UrlsY7886ADoGicAOAEALgHKJS/Hh76rI623apXbazcy4Qeh67ba/cudADQAaigvyvTsqsd/naxn95gpYKmzlvLTfvPudjjSAcAHaCPyiqZPucmdaUPrXTaflI9N5/6OPSde+rcUh1HOgAggc90LKoi2ut974/j0C230nOnA6BoX7i6/tqhmeMBAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABdUlEQVR42u2aMU7DQBBFxwghpLTpQK4spMhFlJqGO3AHqKmp03ADOA0NNaJASCgVgo4D0C2FNRJZYYLjneyu/V5lxYn3R/u/ZzyJCAAAAAAAAAAAAAAAAMCQKbp+4Gh64vos+H591yx8dVbE+MKp6d/Dg3HZ7+qU1dvzVgsd3j40B+c3IiLi5N6JiBwvL9be9/H5Wlg6PTX9JCC1GqDOeXp5XHt9Plv0cpDvJHVO2zrbJiE3/SQg1RpgxdflaXOw/P28OrQqaxeyJljrn0wO6IJGlYCqrP/sLjad34R1Eqz0d9VNAnJNQJsj1DldHe/fQ/U6VjUgtH6ehIeSAHXcfLZwIZ21K+fnpp8EpFoD/B3UJ8y+90i/u7AiF/0kIJcuSB3Vd57uX0/7ZeuuI1X9JCAybAAbQA2QmL/N/pidSIrTT2v9JGBsCWibOubi/ND6SQBFmA2AIWxAVdY7m/NYEEs/CZCR/TdU/jm9TPW/oaH1k4DIfANGHc1sYEyoFQAAAABJRU5ErkJggg=="}, {"id": 79, "name": "澳洲牧羊犬", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLklEQVR42u2YMQ6CMBiFH8YDOOiks44aL+ABGOQAJE5egLAbduMFnEh6ABYP4AUMjjrrpIM3wAFrQiMqWKLI+yagoeX/X+n/WoAQQgghhBBCyHcwsr7QbnYjHQMfz3tDRz+1v1UgLdOz+ULLwJ7raFGm9ArU0zLfHwwTz7fhJnEfCAEAsGz7ow9Qx0GIKIsS/6fAu2TNvC7FqIDKumECAEaX1dN2yy4mACogxvIqznSn1QMAHE47AMD01rr0qcB7CtzX39t6/IqlH8/96cRMZF5tT0OtL5WrxEZeF5rXE6keSGZc9k8v9Mq/694PyP6kop7rVMsLFRZAIMTd/5QygNJU4rxu9cHc546sUOT/oNaPvJmnAkXv4CqjgLYAPNdJPethHfjFs1FdZ6WlV+AKB5NspjiHal4AAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACKklEQVR42u2cMU7DMBiFXxEHYIAJZhhBXIADFIkeoBIs5QCIHbEjLsBUqQdg4QBcAJURZphg4AZlaD3U4CZxfqd1831TaeT09zN5L/1jVQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDzotG3Cu9v7E4vzfH6/d/j3yV//DZYESIA1dNBQnTd39ybnv72+Wql5oX/cvEgAaDWbS7yCJymcydV9eHQ89/7r+GXu78fRSJLU6/drzcP/HI01sZwH+qfVnwQAEmAdHbSIqnVbzdfX2Z8n+qfRP6Q3CQAkQE4OGrqSY3ne6kqSTn6eFh7v9W27I+5e/vLiFP0T6u/r7b77uPpJACABcnDQois5ltGZezWtc2/nQJL08fUmSRrMjj4MzetXTgmWq/6uPlevXz8JACRADg5a+QnnrJtRxMNw6pyD8+5c3f7xEH53JtTH953f6h4a/evpTwIACbCODhrqrxfNoyz+E1mrLgv6N6s/CQBiN2hEF8Casldw3Xvo2HnUdfhl1Y3+i+smAYAEaIODVq2/br3++KbrR/9y+pMAILpADdxTLnv3pRLvtbEej/7N6E8CAAnQZgf19+TE7tUJjUvVtclV/wV7c6LWoez40HcXEgBIABz0rzNV7Xb446x+vWHVHdRa75BuZZ8sV11HEgBIgEZ2Byrt79xYOX2s04XOY7Vv3nodmtbdWjerdSQBABT5RO8/Fwm93/T5WIdyurVddxIAWs0vozROzALfidwAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABhElEQVR42u2aMU7DMBSGXxFHgInOMIK4BgsHqNSJC0TZUXbEBZiQcoAuXAOVEWaY4A5h4VXEkpVEsWO/5Pu2uqr8V/5/+/klIgAAAAAAAAAAAAAAAABzZjX0B2cn502Iib9+PlYp/nBu+o/wYKYJ8Dnl/uExyMRVWUR1lhX9JCAxxz7nXF5dt8bf9q+tz7u6FhGR281mlAB3HtlLMyYJ1vSTgNwS0JehzunrON2jq7JoYlZLofXruJs0EjDXBLhVgFtddH3fRewkxNI/VDcJsJoAXem77U1rfH16ISIin9/vrfGn55dBe7I6MNYZEFo/N+G5JODguL96tgt1hjoptfOt6ScBuZ4B7grqDVNX2K0K+u6Rvh5KaKzoJwFWqiB1VOh+utbLobqU1vSTgMREW4BdXR/6JxaZSj8JsHoTlpHdRt2L//VOkj4rTqWfBMw1Ab5+uq/rmIvzp9ZPApaSgLHPXnM/E6iCln4PqMpisj5PDFLpJwGy0HdDJdG7ornpJwGJ+QXNk/IrifkUMgAAAABJRU5ErkJggg=="}, {"id": 80, "name": "滑雪狗狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DYgP9QQC/7mIZ6gDGSquGphy9VQld6x2bG0RhgYGBgITrERNSomq5h5j19c4txNA8QW7rQxAGMjIyjeYAYICOqzsDAwMDwZM8sBgYGBoaPFyaQZSG/QQHEPJe00XqApBiAAXJDnlr6R2PA//56FH5DIpSej109bnn10RggKwY2KgailirykBg50IBWWr2+iVef9mgeIDMGMEqVhZCQ5Y9fjzXkYfKj/QFK20LordGrPVpkWahdcg21fwFtjZLbOh05eQA9pCgF6ObBYlS7hIGkmBjyMTDqgSFfD1DaJ0ak/WsMo6UQPQB6/UFuyI9m4lEPDDYPaJdcw2jnjMYALUanqT1Git42GnExAAByU2Ifn8MtAgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACMUlEQVR42u2coU4DMRzGvyP4IUBtCcGwhBkE4QkQGEJ4AsCgEXsAHgCBxhCeYCEYBAJNEBhINoMZCgxPMMR2YmXNbr22uXK/n1nG1u5/X9Pva7txEgAAAAAAAAAAAAAAAAAAAAAAAAAAwL9hNAEl6qH/EpJDnclCzGBJyrIsq+IFf+4feHGX5sN9VlUHRX8SACBMAqTqoM3VzZEkPe+0vfS3+9If6/E9yEiwdPUnAaDWLC86g307QiwHHX71/faXR2ikpTb6h9GfBAD2AIucLngvIJKF5o43fLyWJP28Xjn109g+lyS19s6i7gHQP4z+JACwByhCa228e/c9g2PjWrev9q5rcPQv196mNwkAJEBKDlr29OLwozf1/OJ08ngz+/3219ul6n+73JIkrZwM0D+g/qbena6m6icBgARIwUHnzeSi3G0cTa+J18fX83RhrLWNc2uzXaek83e670opwVLVP68vr9esnwQAEiAFBw12KnE7rqtx3JtZd/562W9oTed3XUOjv1/9SQAgAerkoPOuoyh5PSRY2vqTAEAC1MFBbacBsQjlnOhfTn8SAEgAHLT6oL+4KwQAEwCACQBQsVOgVDF/k+P6Wx1bu6p8X1D1vYzrOBRtb9u7kABAAuCgf51p0dMOs53vuzhU1UF9623Tzfz8ee8rOo4kAJAAMZxVke53U9bpXZ3O1o9rooQeh9i6+9bN1ziSAABy/N/QWS5i+3vs/hiHYrrVXXcSAGrNL2Zt+kiKyKOnAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABm0lEQVR42u2aMU7DMBSGfyP2LjDBgoSIRBYOwcCCUE/AxsLCkGMwsLCwcYKqYmHgECxUAiGx0AmWngCG1khJKWlTO7bp901JIzt/9N7v92pZAgAAAAAAAAAAAIAGfE1A/3yskTJhMYsOGB4dO8mOrfs7E+KDY9OPAwKzPnfEN/acrot2vuHnSytOiFU/DkilBvjqDIwxpq3uJkb9OCCVGrC9mUmS3h9uJEmjx6tGL+wcXIznOzxrtTb41t9UNw5IxQGWpplTN95m0NPlviQpL+TFCa71L6sbB6TmgJO3niTp9Tor/b57/ly6r3suZX++x5cTfOtfVDcOSM0B/Z3u+GIS6c5p7/du46OcMaPbbuk+n7GG/jwvBvJRA1zrF3tBK+aAqa5gkhk2k+oyZ9aa6TvzY9WPA1JzgI1wNfJ1mVIdH4rY9OOAVBxg1zRX++p2PtsvVzPSNbHqxwGBIQAEgBoQhOldxHb7/1j044BVc0Dof76x6ccBFGECAP8hAHkxCL7Pk6J+HKDETke7PmOpyt5KamdEl9WPAwLzDe+n6+AjximlAAAAAElFTkSuQmCC"}, {"id": 81, "name": "牛仔狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2CgACO5GlcW2P8nR1/4hIOM1PQA01CPgVEPDDRgIVWDtIjafwYGBoZDV56TZSFM/9M3txhHYwBfKURuKUMpILWUGn55AJZGL97/iCK+8Og3BgYGBob6MDmqWNy46hEDAwMDQ7w1F0V5ZLQYHfXAQHugcdUjeHomR360JqbUgKMrslD41hHTUMTdgiDiu9ZtGY0BkmpiWHmMDnDVA25BPljFcYU8rnxBahuJacT0yNBjhNwaGT3kYSFObit15JRC6CFFKUA3DxajjasYRttCox4YUjUxuQAz7T9iGC2F6AHQ6w9yQ340E496YLB5gNY9r9HWKKF+ArXaRiMuBgAq12Vgp1Yt9AAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACJElEQVR42u2cIU8DMRiGvxEUGkNIkFMI/BJwUwgyATgcAsU/IPsHqPk5mCAIFA6S85CgZkiWEAwGgx1iqbiy5u7aXkfb5zHAkTvat3zv2310iAAAAAAAAAAAAAAAAAAAAAAAAAAAQLx0cp347eXB3Oa+k+unDr826ei/xlJAzqzjoDhozpAAQALkxPZmdy4i8vz26XT/x9cUJ01AfxIAhC6QRQUe7dn9wPuXxce2HdR2j+xK23ts9PerPwkAvAYIWcH7u+qzrXkbDqoc8vX9u3R9XPyIiMjV8Y6XeQwnMxEROetttLJHRf8w+pMAQAKk6KCxdEP0eaJ/WL1JACABUqhkVyc0OWvV923Hr553Ppqif4v663oPJ1IaPwkAJEAMDlpVybYUNxelr3uno9L1/mBx/fHuwfP4ZxJTgsWqvxqfGq8+fhIASIAYHLRpxY+Lbq0+uhpXf3C4dD5V41bdGZNjKnTn97WHRn83/UkAEM4C1aggvZJ0VAWbKty0N62Lq4Pqe9hVUXf86B9GfxIASIAUHfS/zSPWcaeuPwkAQhfIoZ8ai/PEDvoL7wkGoAAAKAAA/iuE172tGPrdYtknr+rb54r5bI7dOtS93/TahQQAEgAH/etMTbsd+n2mv+Sm5qC+9TbpZnrnnOs6kgBAAoRwVml45mVVTm/rdKbn+Do373sdQuvuWzdf60gCAIjlmY5lLmK6Hvp5rEM93XLXnQSArPkFYawH5Kcri5gAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABjUlEQVR42u2boU4DQRCG/xIUuq4JQfESFTgUCgE4PIo3IPcGKDwOTqBQOEj6AE2qMCSXEAwGgy2GCblNLr277rK7ve9TzTab+5uZf3Z2LpUAAAAAAAAAAAAAhsCo78b7y4Nln32n18+jFH54Kvq3yMG4EAACMGy2u26YjPeXkvSy+Oj1QNv//vka5SxITT8OSLUL6tslrIuvLiMX/TggtTPAatz87au2fjv7liRdnex6eXBRVpKk8+mO1xqbm34ckFsXFBrL0KJU1G6pK3uT8e+nii5oEA6wGuhmbtvvYzshlP6uunFArg6wSB8eH9XWp2c3kqTZ3UVt/enhsWUNrWdgqDPAt35uwpt2E7Z+tilzXNxMWpU5luFNtXfdzM9FPw5I9QxwI2gZ1RT5tjXS7S5CkYt+HJBLF2QZ1VRb+2ao9cu+ZjS56ccB4pUkAYABTkOtFv/NTsLefFPVjwOG5oBQN99c9eMADmECAJsQgKKs/m3OE4JY+nGAMvt/gK9ZilZML0P376noxwGR+QGa8NrJBS34RQAAAABJRU5ErkJggg=="}, {"id": 82, "name": "雨衣狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/UlEQVR42u2YrQ7CMBSFz8g8ZsEwjWAJAoncM+0xeCYkEkHCBBoMqeEJhrokXFjStQ376flkl7W797T33BUghBBCCCGEENIPSdcXltmqCbHw3VyTEPPMJqtAc941vXzQ5phEpUDatsefp8XHeFHVAIDbIQuycF4aAMBlv/65vu0ZmZ4CtmiFbJlvH0EDGL0C3gEUVf0+Hy7Po1cg9Z1AVxHJtozr51TA1onbeh7xAd8qJD7g2yPNoulGtSKujqwzLxnv6sDxVSGdqVD/AzKfKJqXiKsXYgCjd2JXvve+AavQP9D+4Zp5HmIGMLQA8tK0dphUYIh3o6HuSkevwAsMZlpWLsAVNgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB2UlEQVR42u3csU7DMBSF4VvEzlKx0JmBSh0YGXmmPgbPxMjIgARDZ1hQF54gTBkwjZomTlo33z+mSnp9XJ/jOG4iAAAAAAAAAAAAAAAAAAAAAAAAAABlMJtag2/mt1WO63xtNzM/n/L1v9AlkABn6KDV20N1FEFXLzMJVo7+EgCT5vJ4I3heDeGgtUP+vF7/Ob5cf0RExOfzPEv1i8dtRES8P93t/P6+Dkv/cfSXAJAA5+ig+0jb15ar+++sc/m0nfQfRv+mdkkASICSHDS3Q9XOmjph28+71l87+Wy1of+A+qd6Lx7jT/0SABKgBAfdN5K7ktaV1juU89dzcPoPq39dX11vWr8EgAQowUEPHfHLdVQ52tPWgfc9sU2dP9ccmv799JcACHuBDthzUo+kvqsQh86B+zpoOoc9Fm3rp/84+ksASIBzdNBTa0epdZ+7/hIAYRWox3pqKc5TOvQfBgmASWMAwAAA3ANMlHQ9vOtenabzjr1qU8q9TNd+aHt+072LBIAE4KD/nenQ1Y70vFxvbzh1B82td5NuTf+c69uPEgASYAxnjYHfc5PL6bs6XdN1cu2bz90PY+ueW7dc/SgBgOi4p2OXizQdH/t6+qGdblPXXQJg0vwCb4vVMivapGwAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABUklEQVR42u2aPU7DQBCFXxA9TUSDawoiUVBS+kw5BmdKSUmBBAV1aJAbTrCpRogVwTHMZnad7yttWfuseW/2x5YAAAAAAAAAAAAAAAAA5sxi6gNXy+vkMfD78LaIeOHa9J/hwUoTkJ7vU4ig20cXZ7WinwQEc76vR34+XX67vlq/SpK2m6XLwF0/SJJeHm5+HP+vPbY1/SSgtgQcSu6wQ7m4+/j1vjm065VKrpa89Y+9FwmYWwKspxp5Lxy7P0bpJJTSP1U3CWg1AfscYc6Z6vi8h9oqo9Qc4K2fnfBcEmCOW62VPJ11LOe3pp8E1DoH5BW0HZ5VeLv53w6yNK3oJwGtrILMUd7n6bZe9jqjaU0/CQiGAlAA5gBFfpv9OjsZQr8VR+knAaeWgHy10JrzvfWTACZhCgBzKEDXD0c75ylBlH4SoBP9N1RB/4rWpp8EBLMD4mK9k7LeKA8AAAAASUVORK5CYII="}, {"id": 83, "name": "探險狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBElEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjFTASKqGExuq/lPDYouANkZqmMM01GNg1AODNg9Ii6ihpPUZbXY0cUBG1SEU/tM3txhHdgzAQn5fiwSKuFPNCwYGBgaGqyssqGKxdsQJBnz2EBsTo5l41AMD7QHtiBPw9EyO/IiPARZKDbh7pAiFr2zThyJ+94gVAwMDA8OPJ8dGY4CimhgGcNUDHDJWWMVxhTyufDFaExMbI+TWyOghDwtxmPkjLgaILoXQQ4pSgG4eLEa1Ixj+j7aFRj0wlGpicgFm2j/BMFoK0QOg1x/khvxoJh71wGDzAK17XqOtUUL9BGq1jUZcDAAAF71dJEPaaykAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACF0lEQVR42u2bvUoDQRSFT8TC0sJC0E6wyQsEEQvxASzzABbWlsFSUlqLT2Ap2FtIkLyATSCdgkQfwC42TrFjxv272Tg739dlQ8Y7Z7znTCa7EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxEYntQmP7wdzi3F6p8MO/z7x67/GkkDKrOOgOGjKkABAArSRna39jFPeDI8kSR+zmcn4D7dnc0k6Hzxlrr99TnDWiPQnAUCcApXoYGusHdTV/Xi1nbl+fPkuSXq565nU3e2P9dffsZoH+i9XfxIA+A5QqIN/nGL5Hax5Cntpp7M/T/RvVm8SAEiANnRyXScMOWve+1Xrd+NtnkzQf4n6+3p3+9mEIwGABIjBQfM6uSrT0UXm9d7hdeb6dHQgSfp6fTauf6yYEixW/V19rl6/fhIASIAYHLRsx7vTjDxcXRu7Bwvnk1e3O3fOO8f3nd9qD43+9fQnAUD8Elygg/xO8nEdHOrw0N60KHUd1N/Droqi9aN/M/qTAEACtNFB/9s8Yq277fqTACBOgWqcp8biPLGD/uKJMAAaAIAGAOCZYNO9rQLn3ap4Tp53bp8q4Xtzqq1D0c+HvruQAEAC4KC/nansaYf/udAvuW1zUGu9Q7qFnpyru44kAJAATTirSt7zsiqnr+p0oXGs7pu3XoemdbfWzWodSQAAVbynY5GLhK43PR7rUEy31HUnASBpvgHiVfqbgnx0XwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABfUlEQVR42u2aP0oDQRTGX8TCAwgKWgiKzV4giFh4Ass9grVlsJSU1h7BMiewEJG9gI1gp5DCA9jFxofM4rqbOM+Zt/v7VcmEMF943/fmT1YEAAAAAAAAAAAAAAD6zmjZL1SzySLGxOOz6SjFD85N/xoeTAsFoACsAT+ys3kY9Mqb6YmJgPPJffD+7f05Sm/1op8E5JYAdc7d1XYwfno5FxGRp9txlImLspLf5lk1Cd70k4DErOcmSB1alLKIuSZYs3Ww9/Vqzi5oEAnQHlh3btfPUyfBSv+yukmA1wRopTd2j4Lx/eNrERF5ebgIxj9eHzv20NCBVmtAbP2chPt+Em7rhXUntTlHHd7Ue//qfC/6SUCua0C9guqopsp37ZH13YUVXvSTAC+7IHVUU29d1aG6X451R+NNPwkQ/pChADDA21Dtxd93J7Yn31z1k4ChJcDq5OtVPwlgEaYA0IcCFGX1b/c8FqTSTwLE2dPRse5SpOX20nr/not+EpCYT9/rzRY74D9rAAAAAElFTkSuQmCC"}, {"id": 84, "name": "水手狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABAUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN/////08VixkZGalhDtOwjQFpETWUkFaJ3kUTB9xZ6obCf/rmFuPIjgFYyO9rkUARd6p5wcDAwMBwdYUFVSzWjjjBgM8eYmNiyMfAqAeGvAe0I07A0zM58iM+BlgoNeDukSIUvrJNH4r43SNWDAwMDAw/nhwbjQGKamIYwFUPcMhYYRXHFfK48sVoTUxsjJBbI6OHPCzEYeaPuBgguhRCDylKAbp5sBjVjmD4P9oWGvXAUKqJyQWYaf8Ew2gpRA+AXn+QG/KjmXjUA4PNA7TueY22Rgn1E6jVNhpxMQAA8OhdILOw24gAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+klEQVR42u2bMU7DMBSGXxADIwMDEmwgll4AVUwI9QyVuAUzIzO3QOIMDEwV6gVYKrqBxMAB2MLkwaYmruM4PPv7tqRK+vy77/8TJxUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdNLUNuG3bNolwTdPw89Gv/w5TAiRAgQ56dHBm1Xl6/TTI97w9zKztj69VQ4Lp0Z8EABKgJAc1dT/fHVr7L28/RUTk9fE8Sd2T+VL++p5U40D/YfUnAaBqdsM7eJapg6XNcS09NkZnd5zon1dvEgBIgBI6ua8T+py16/PY+s359q9W6D+g/q7ek7mdcCQAkAAaHLSrk2NZL26s7ZOLe2v/ejEVEZHv95fE9S9FU4Jp1d/UZ+p16ycBgATQ4KDbdrxZzejC1LV3PN04nq66zbpz1zq+6/yprqHRv5/+JAAIT4IDOsjtJBfTwb4O912bhtLXQd1r2LEIrR/98+hPAgAJUKKD/rdxaK27dP1JABBWgXqsp2pxHu2g/zCQAFA1NADQAADcA1SKux4e+66O77ixV2203MvEzkPo8b57FxIASAAc9Lczbbva4R7ne5JbmoOm1tunm++fc33nkQQAEiCHs8qW77yM5fSxTuc7T6r35lPPQ27dU+uWah5JAACJfKdjk4v49uc+H/MQplvtupMAUDU/bv3uwJA6jKYAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABc0lEQVR42u2aP0oDQRTG34qFBxAMaCEYbPYCIlYWnmHBW1hbWnsLwTNYWEnIBWwkdgopPIDd2PiQWVh3E+c58za/X7WZJcwX3ve9+UNEAAAAAAAAAAAAAAAAAMZMteoXQgghycRVVeX4waXp38KDhSZgf/c4csr08sFEwOLuIvr8/vGSxFle9JOA0hKgznm8mUTj59dLERF5vj9JMnHdzOW3edZNgjf9JCAz26UJUofWjYSUa4I1e9PD76clu6CNSID2wLZzh77PnQQr/avqJgFeE6CV3jk4jcaPzm5FROT16Soa/3ybDeyhsQOt1oDU+jkJj/0k3NcL207qc446vKv3/tX5XvSTgFLXgHYF1VFdlR/aI9u7Cyu86CcBXnZB6qiu3rquQ3W/nOqOxpt+EpAZCkABWAOyoL345+7E9uRbqn4SsGkJsDr5etVPAliEKQCMoQB1M/+3ex4LcuknAeLsv6Gp7lKk5/bSev9ein4SkJkvkifNEmPBFLQAAAAASUVORK5CYII="}, {"id": 85, "name": "派對狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABKUlEQVR42mNgGAWjYBSMglEwCkbBMAL/6zf9/1+/6T+97GMaDXI0EH3g///oA/9HY2DUA0MFsFAz7TMwMDAsUfKGCED5Sx0YGUdjgJoxIC2ihreEibm3lSj1T9/cYhyNAQYGBkZSQ/rOo6so/JRTkEicY/YHqzm45FXktBmoETPDLwZgIX/x+nkUcX1NQ6wxQC6AxQAue4iNidGKbNQDA+0BFTltnCUKMfKjNTGlBqCXSrDQholTq9QaOTEAK3/1NQ3J6lU9iU5hYGBgYPhBpHpYuT9aE5PaCiU3baOXSLAQh5k/4mKA6FIIPaQoBejmwWJURU77/2hbaNQDQ3FUgty+NVLaZxgthegBcLWdyB2lGM3Eox4YLB6gdc9rtDVK7NgopW2jERcDAK4NdQR/It4iAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACTUlEQVR42u2cMUvDQBiGv4iCOrsJHaQI0kFcnHUWf0E79g84OhUnR/+Ao25OBffOLuJQRBEH0c0f4CCcQzzBM2cul0vaS55napM0+fKGe9/L1zYiAAAAAAAAAAAAAAAAAAAAjUaNxkqNxgol2qH/ApID4KA/9CdK9SdKoX879CcBoNUsht7hYP8wfXGCuLMA/UkAgNklQMxzTxGRi42DdMH3+8u9JEGd5upPAgAJ0CYHXV/b/LfDMHi+dtr+7f0xwUHj158EABKgiQ5qO+7Ty/TX++FNKsH57mfmfoZXD5nru53eXJ0X+vudFwkArSapfARb1nc7PanCmXTdd/e3v5Zvb+1k1u+Lrt92nFDngf7V6k8CAPcARUawic15XNdnHEfNY5elqjmyeZ7oX6/eJACQAE0YyWXnkra5ad563/r1/lZWl9C/Qv1NvXX3SNdPAgAJEIOD5o1kX8y6zHqrcn5bFwb9w+qv69P1mvWTAEACxOCgRUe87mYU5bU/FBGRD8ftbd0Zs49vOn+oOTT6l9OfBADhm+AS30SaLB+fpSP49Mhp7lrU6Xwd1JzDzgrX+tG/Hv1JACABmuig83YesdbddP1JABC6QCX6qbE4T+ygv/CfYAAGAAADAIDnAgWd24ql3y2efXLXvj33MtNS18H187Z7FxIASAAc9K8zFe12mJ/Le3pDUxw0tN6uT7HI2871OpIAQALU4azi+Zybup3e1+ls+wn1u/nQ16Fu3UPrFuo6kgAA4vmbjiwXsS2ve39cBzfd2q47CQCt5gtNdlLhaIsEfgAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABl0lEQVR42u2asUrDUBSGT0RcuroJGSQIJUPp4uzuI8Sx79EXcdQXKLh3dpEOIog4iG4+gINwHeoFGxqTm9703pN835akpD/c/z85ObkiAAAAAAAAALADZr4wZr4w6G/GAZbpGcXSmGJpDPpJgApYABZg2Bz6rJ0iIjenl+sTv8e3F0mipfaH0E8CtCXg5Pjs3w7h6vWu0e8/Pp+DJCM2/SQgMImrU17eHjeOZ/frEF2ff2+9T9X1LM2lS2dp0U8CYkuAdc7q6WHj/GQ83eqgtlgHVf1P2yRo008C+vIe4Avr0CzNTchuyZXR6IguaFAJKHcB5dpadz10ErrS76qbBGhNQJUjrHNcHV+uofY+XT0DfOvnTbgvCbCOm4ynrb4KvRczERH5CuR8bfpJQKyzoLrZStsa2bT78F37Y9VPArR0QXZF6+bprvez/XLXXUes+kmA8FGeBYABTkNtLf4zOxFN009f+knA0BKwr75fi34SwEOYBYA+LECW5pV7ZTQQSj8JECXT0KZ7K2XH2UrovaH71k8CAvMDiXj6fQ1iujAAAAAASUVORK5CYII="}, {"id": 86, "name": "眼鏡米格魯", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA70lEQVR42u2XPQ7CMAyFXcQR2onO5BpsLJwGiVMgcYYeogsb14AZJnqHMrlqDVbb4PKTvG+MFFvxS/wcIgAAAAAAAAAA3yEZu2GRLmuLxLfqkljEmQWrgFbp6/1skjjPnIkyf6/AXKv8YZN21rdlRUREx92qs77enwYlkvuY5zxUj1EiPAX64Io3d7hwL9+IdsebN1Q4QhfyUcC3u0xFvApofsAKWPkFnBhO/CvTqFTEVwlZea44x8cs1De/W/8HOF7LwTELmaJNofCBd//EVl1ITq/oQlMjlfOtfDAK4ADBHCDP3Md/Y3H7gDXRdqEHv1tfW+/rrVwAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB3klEQVR42u3cMU7DMBjFcQdxhDLBTK/BxsJpkDgFEmfoIVjYuAbMMNE7lMlIdWvaJk4aJ7//GCnu5+f6veST2xAAAAAAAAAAAAAAAAAAAAAAAAAAAHXQzG3C14vbTYlxvtefja9P/fpfWBJIgAk6aK7Or5+PIuPfXC1HNS/6t5uXBMCsuTzjDt704Uyx7peHxdb1x9d1CCGEt6e7rev3z+9HjZveF9n9nLApOQ/696u/BIAEmKKD5oj1/j1DrpZ7HTb3jPnnwKtlkWfkdJ7070f/nN4SABKgJgfN7eRS5Oou3R2JOjRNQ/8e9U/1ju8+sX4JAAlQg4Me2smnkuumxPpLdVv+qT/UlGC16h/ri/Wm9UsASIAaHPTUHR+7GaXmlSN2Zw718VPn7/oMTf8y+ksABGeBRnSW45AztHXQ9Bn2XBxbP/2H0V8CQAJM0UHHNo9a6566/hIAQReoQz+1FuepHfr3gwTArLEBYAMA3gFmStoPb3tWJ3ffubs2tbzLtF2HY+/PvbtIAEgADrrrTKd2O9L7Sv17w9gdtLTeOd1yv5zruo4SABJgCGcNPf/PTSmnb+t0uXG6npvvax2G1r20bqXWUQIAoeWZjn0ukrs+9HjW4Tjd5q67BMCs+QXWFuhi0fGEXwAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABZ0lEQVR42u2aMXLCMBBF1xmOAFVc42ukS5M6B8kMp2CGK8AhaOhocohQJ1W4g1NkxIwFAoS1aGXeK+2R9T3av16tLAIAAAAAAAAAAAAAAAAwZKrYAc/jaZti4p/9rsrxwtb0PxGDRh0QipTv368kE9eTRjWyStGPAzIzCkXO4m3cuf6x3ouIyGb20rn+Ot9eNZE/znE8j7R9nFCafhxgzQGXcBFzyIGr5mSODeXIQw5enb9fT5pWo1rS0v++/Px3QGAcDhiKA26tDmLRdoKW/ljdOKBUB4TqaRdBsfW2y6H+c7QiP7V+dsLshG/Ltf7zUkV+KfpxgNVvgL+CLqL65shUVZJEdiut6scBpVRBLqJS99NdvaxddVjVjwOGthOWK7uIpaCtHweUeiacqorwu4/aPR9r+nHA0L8Bl3ai94p8q/pxQGZYABaABZBU3cF79XlE6SQsh34c8Kj/hkqmf0Wt6ccBmfkDBnnQSxoH7PwAAAAASUVORK5CYII="}, {"id": 87, "name": "花環狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABU0lEQVR42u2XPUsDQRCGnwuprK1isAq2gkUKEWxCQOwUUqfyF9iIbSQg/gKrrS3sVBAbIVhYCJZKypjK2laLOIFdPM/kzo+471PO7Afzzs7uLAghhBBCCCGE+B2SSScszC+9AgzuagBUV/qev9N7AKA9t/mh3+Yli+dJEQGU/m0GTOmQwf4xAMPlGwAuK3sjxS+uPbtRuV8FwG2sA9Acdj179WDHG//0/JjEnQFT/vSo4dm3dq8AuD1pF7JxveX4bJ+vZmLmM6AAZj6AesuNz/M0/ugzUM67QHgrmdpmL+rW0kucpnjedyAkupc4tQZCJSwj1sOwfTjqffprXm+T1gvZePdy9u5x3j5pGY+3BrJqw2rButFxl1nreUqbPTz7ofK2XujXO5BFqLDVRJOueqEfycC05D37ykDRvdOkyus/oAD+WgDf/fNSL5T1T8hLtLfQG0J5fwhtuvgiAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACXUlEQVR42u2cvy8EQRiG3xOVWoWoRCtRKEQiEblEdCRqlb9Ag5ZIxF+gulqhQyIaiSgUEiVRspVaS8Endu7G3u7OLrv7POXsr2/fufneuW/mTgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgGrQatoLjw5PvkvS892EJGls+il2fPf6QZK0PrTc87hd1xo/a/Hxqb7+A3QJ4AA1zKAWp8vzzpEkKZq6kSRdjGx9xnt+FWs3Ru5nJUmdpXlJUjvaj7WP7W3Ezn95fWzhYNXRHwcAHKBOGdTiPjlcjLWvbF5Kkm6P14MIN7PW0W/PCfUe6F+s/jgANJrBtCPYzTCWUaKp3g+w89tR/DrLPN3P0XsZc+n/Ug1x3xP9y9UbBwAcoA4jOe9c0jc3TTqeNX673+jCNvoXqL+r98xaJxY/DgA4QBUyaNJIzooblxtvUZnfnoP+xepv8Vm8bvw4AOAAVcigaUe8VTPyvk8SVp1JquO7mT/UHBr98+mPAwAOUMcM6quv2wqoVg8kSdHTnH62+1ZS7fzO2+lXPGTQOuiPA4DYC5RmF+LXXpS8I9hWMLNWPbLOod1qhu2l+d4jM3EdJM6i4kb/sPrjAIADNCGD+uIvi6LiR38cAODv1gHcDGNz0rb2UbcE0F9UgQAasxu0qLmhPPVupay/++4HStqbk6kf+r3e990FBwAcgAzanZnSVjvc63y/6a1bBg2tt08338py3n7EAQAHKCOzKuW/H/xVps+a6Xz3CbVvPnQ/lK17aN1C9SMOAKCMK3q9soivvez70Q/96dZ03XEAaDQft8mcRHBQ89QAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABuUlEQVR42u2ZP0sDQRTE58TK2io5UgVbwSKFBGwkIHYRUqfyE6QRW0NA/ARWV1vYqSA2QrCwECyVlDGVte1ZxCfs4oknu9l9ufmVu/dn7nZmb+8tQAghhBBCCCGEEEIIIYQQQsgyk5Q9ob6+kQPA9KkJAEi3Jkb/yfgFANBf2/+xX85LGtdJiAeOTf8KPRhpAsQpNtPjcwDAbPMBAHBbO5o75ubeaBdqz9sAgGxvBwDQmY2M9nR4aBz/9v6auHR67PqZgNgSIM65PNs12ruDOwDA40XfyY1bvQy/3ee/SdCmnwkIzGpsgsShrV6Wu/wm+CZtpFwFVSoBMgfazv1rf+gk+NJfVjcToDUBRY4Q55R1vD2HynV8fQNc6+ef8LIkQBzXHSB36axFOV+bfiYg1m+APYLyhyk1EByczmsnk7ZRGymqpcjx2cfVV0/m9cG06GcCoHQ/QOZKqSZ+VwmbY8Mp0l40R9rX8736iU0/E6C9FmQ7RObUDkYqXkBo/UxAVauhi577Y9XPBFQtAUVVRy3Od62fCQgMB4ADwAGAqx0mexdJE6H0MwFQWguC5+ql7/V7LPqZgMB8AlOhFEjSQG2NAAAAAElFTkSuQmCC"}, {"id": 88, "name": "墨鏡狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABBklEQVR42u2YsQrCMBRFb8XdpU46K9ivUdzdXASnfoaT4OLmLvo1FnTWyS5+QR0kSFJKTHlq29wzJiRp3s3ruwlACCGEEEIIIeQ/BK4DeuEgk1j4ll4CiXladVeg7Rrp02oksnAUI5NQpnkKqMgf5qHWPtmmX/mA/DovZT5Vork5YD/DCQBgulgDAPabpZYjtn4p/FVAoSJrKlPUL42/Cqiz3JkdtfZ+dwgAuN7PWvtjN6YCTl7ItRKbStgib+aKt5U4KOtCy/7PzciriKv56YVs/l36PqDme1dwz7wQN1B7L1SW/NlPeCP7CWb9KBt5JjE3ULUNRHFS6DCpQBXfRqXeSmuvwBMilGROKHAbfgAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+ElEQVR42u3csU7cQBSF4UuUPhSkCjWR4GkSpSdVGiQqHiNVpDR09AieBqRQQwVNnoAUaIodMvLaHi879veXXnn23jM759iz3o0AAAAAAAAAAAAAAAAAAAAAAAAAALTBztIa/rR38FxjnIenux0fn/b1f2dKsGTez9VBS3Xe/DysMv7RWTxvU1/0H9aXBIAEmJODprqvfuytHP96/jSJgK/f56WvWn3Qf1r9JQAkwBwdtNsBbyMi4tvJr4iIuPx9uuKwXa/XukbO+6T/NPqX9JYAkAAtOWhpJQ8l1ZX3VXq9lvMnHXa/39F/Qv1zvdO9T6pfAkACtOCgXSu5L2mcD8fXK8f3P36OiIj7xz8rx/9efKlc/220lGCt6p/qS/Xm9UsASIAWHLTvik+7GV2kulIffesu7c7k+/i584+9hqZ/Hf0lAMLToBW+icydqGsF970GHuug+TXsW7Fu/fTfjP4SABJgjg66bX20Wvfc9ZcACLtAI/ZTW3Ge1qH/NEgALBoLABYA4B5goeT74UOf1Smd99a7Nq3cywydh3XPL927SABIAA762pn67nbk59X694Ztd9Daepd0K/1ybuw8SgBIgE04a0z8Pze1nH6o05XGGfvc/FTzsGnda+tWax4lABADn+n4n4uUjm96PPOwnm5L110CYNH8AxlgCaX2cYhHAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABcElEQVR42u2asU7DMBRFbxE7S2GBuZXo14DY2ViQmPoZTEgsbOwIvoZKZYaJLHxBGeCpslFJA3ZenJwzVYnS3Ojda7/YkQAAAAAAAAAAAAAAAAD6zKjpBYfjySrFjd+ql5HHA3dN/w4e9GW3qVOer4+T3Hg21yqns0rRTwK6lgBzzuPFODh+eldlEfDzPl/O+msSStNPAro6B9SPgQtJ0tnljSTp4fYqGGPrzm9iff3/ktC2/unk4PtXRRc0iAQY5ozYWZvOb0tbSUitv6luElBqAqzSe+dPwfGj/akk6fV9GRz/uD/59f/WY2joxFzOT62fN+G+JMAcZ/1sHeYMc5K380vTTwK6OgfEFbQ3TKtw3A9vO0bGXUYuStFPAkrpgsxRqdfTrV9OtUpZmn4S4AwFoADMAfLcm41XH732ir30k4ChJSDuFkpzfmr9JIBJmAJAHwowmy9aW+dRpj1iD/0kQAP9NlRO34p2TT8JcOYTYcTjp9+eNXcAAAAASUVORK5CYII="}, {"id": 89, "name": "護目鏡狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGklEQVR42mNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMDCAkVQN0iJq/6lh8dM3txipYQ7TUI8BFlJDuj5MDoXPV7abgYGBgeFTlytWc3DJN65i+E+NmBl+MQAL+XhrLhTxhUe/MTAwMDB8+PANNYShNLo4sfKY9kDsJzYmhm8ewAUEBFBDDJa20cWJlR/xpRDFHmhc9YihcdUjsuVH6wFKDTi6IguFbx0xDUXcLQgivmvdltEYIKktRGxNDANuQT5YxXGFPK58MeJqYkZyW6G4YoKYUgtbiMPMH20LEWq/U7s/ADMPFqOwVuqIaQuNemDI18TkAsy0/2i0R0YXgF5/kBvyo5l41AODzQO07nmNtkapPTZKrbHSIR8DAA2ab39EiWMMAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACEElEQVR42u2cIU8DMRiGvxEUgkzgSJD8iWmmUBMEh0PwA7Bklh8wjyMTKNTQ+xOTS3CIBTE7xKhod1+ua3u39fo8hqyX6319S9/3rhwTAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAPOiVNuDLi+tNin6+fxY9fn3y1/+EKYGSOe2qg2p1vtxdWZ/Pn79EROT39aayH+34eCqbYxoX+oeNiwQAEqBLDmrqfhicWe1v87WIiKxWa7u+/59uu+/x3etsr59qHOjfrP4kAJAAXXRQjX7fvp5xRrfd93isU7rjRP9m9Nf0JgGABMjJQbWVHMp4uqy8t/Y9Hlq/6e9xskD/BvV39TbPPqZ+EgBIgBwctG4lhzJ/f7I+D+4nVvtwtG2ffXwmrn8pOSVYrvqb+ky9bv0kAJAAOTjovive7GbUYeoajm4rx1NXt9mdqdvHd50/1T00+sfpTwKA8DZoxF8iDWYFaytcuzf1JdZB3XvYQ+FbP/q3oz8JACRAFx302MaRa91d158EAGEXKGI/NRfnyR30bwYSAIqGBQAsAACeAQrF3Q8PfVdHO+/Quza5PMuEzoPv+dqzCwkAJAAOuutM++52uOel+vaGY3fQ1Hprumn/ORc7jyQAkABtOKs0/D03qZw+1Om0flK9N596HtrWPbVuqeaRBACQwHc6qlxEa2+7P+bBT7fSdScBoGj+AFuVMQm2GE/NAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABiUlEQVR42u2aIU8DMRiG3xEUgkzMLSEo/sQ0KBSC4PD8ACyZ5QfgcWQChQK9P4G8BIdYELNDsGZpoexuXPna2/OY3drc+i7f97ZfeycBAAAAAAAAAAAAAAAAdJle0xuGg6NFGwO/vb/2LP5wbvp3yEFbdptmys35gfd9//pFkvRxe/zj78T6xxMtUmZWKfpxQG4OcJlzOdrz2u+nc0nSbDb3M2T5GbbX7f8+ztf4mzqhNP04INc1IEa/70fczY1he93+2Bzt5ti2q6VU+g+Hg+VVRRXUaQesqoDq1+piXb+1E1Lpb6obB5TqABfpk7NTr310cSdJmj5cee3Pj08151A/A1PtmNvWz05YHTsLqruTdISZtC5zXIbH5t6/Zn4p+nFArmtAGEGXUbHI150jw+oiFaXoxwGlVEEuo9o+T3f1ctN9wqbj5aYfBxhDAAgAa4Asn82uzk4q02fFVvpxwLY5INXOt1T9OIBFmABAFwIwnlT/ds6TAiv9OEBb+m6ojN4VzU0/DjDmE35y7wqFx6AGAAAAAElFTkSuQmCC"}, {"id": 90, "name": "恐龍帽兜狗", "kind": "dog", "rarity": 2, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABA0lEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DIgf/nrf7/P2/1n1w+tQDTUA9IFmoZxGh4jBEfn1ZgyMcAyaEkLaJGlXT89M0txtEYwJcHcIV0yAkXqli8xoLhPzViZvjFACzkr66wQBHXjjhBEwdg2gOJGWJjYuTWA40PvpClr16BZ7QeoKoHtCNO4M0fhORH6wHqlyInUMTR5UdjgFAMwMpfWHlMaYwQk4dGdE3MSG4rlNw20RqLPVhDHGb+aFuIUPud2v0BmHmwGIW1UkdMW2jUA8NmVILcvjUi7e8Z7ZHRBaDXH+SG/GgmHvXAYPPAGos9GO2c0RgYzGOj1BorHfIxAAC/Q3VBe7LGVQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB+0lEQVR42u3coVLDQBSF4S2DROIwCAaDwjFoHgHB2zA8Am+B4BHQDA6FQWFwSHwQTASBnZbN3Sbbfr9racLds7PnbG7SpgQAAAAAAAAAAAAAAAAAAAA0R/d83nXP513pa2yG/jumAtvM7pgVnFJKi9PHRcnruTGsa6510l8CAHELL8qBoj9fi4P945B95PvH62JOCUB/CQDUT4BWHDRX5+XTRcj5788eZjUu+peNSwIg6QJNsoJTV8OZ+rpf7s5+vH9y9VRFwN//53tcUeOgf139JQAkwCY66DJu3j6Ljrs+3AvdIw/HSf86+uf0lgCQAC05aG4ll9I769AJV/17af39Xv726JX+FfUf6t1f+/T1SwBIgBYcdNlKjtsD/6y3lvPn+tj0j9W/r6+vd1i/BIAEaMFB/7vi+27G2PGs6sDL+vhD54/aQ9N/nP4SABJgEx0011+P6oZE3ZGl/7T6SwAkT4MWdAGmYuweeqpxtFr3pusvAeAaYEw/tRXnaR36J98JBiwAwAIAZnInuHWGz+SUPquTO27qrk0r1zKl87Dq8blrFwkACcBBfzvTf7sdw+Oifr1h7g4arXdOt2V3lkvnUQJAAqzDWVPl37mJcvpSp8udJ+q5+eh5WLfu0bpFzaMEAFLhMx1/uUju/XWfzzysptu26y4BsNV8AeH4QYCyEozuAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABaElEQVR42u2arXLCUBCFLwyyEoepqkHVZdA8AqJv0+nbVOQRojs4VE1VDQ6Jvwhmy3A7JJPMXvZu+D4XMiEns+fs/UlCAAAAAAAAAAAAAIAW4m4V424Vhx6j/8wUK9ky0/qjyevXpO24dKz0kwDrwve9YDF/UemD+8OPSUJK008CSh0Dbjlls12r3LiuQszpLC/6SUBpCRDnfH9WV78v37ZZBPy/z9lZQ5PgTT8J8LoO+Pg9Drru/fmp9bz0aOmxuWZL2vq7nosEjC0BaU/t6rnp+S5yJyGX/r66SYDXBNxyhDinr+PTHlpXTdYVs7Z+VsJjSYA4TuazWs66l/O96ScBpY4BaQVlhSkVDgP3VP6uz4wX/STAyyxIHKW9ny7zZa1dSm/6SYAxFIACMAYEy3ezl72TxvRdsZV+EvBoCUhnC96cr62fBDAIUwAYQwHqqrnbPk8OrPSTgPCg34YGo29FS9NPAow5AX2D9HqWZzGSAAAAAElFTkSuQmCC"}, {"id": 91, "name": "國王黑貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQElEQVR42u2YOxKCMBCGN46WdjSOj9ILWElv7xHwBh7BI1jb6BHoPYAlvaXi2DBjQWmxNsAYh7jhJUL26whhMvy7/2YTAIZhGIZhGIb5GzB0EUMXyXmejejZWHS8KJ2mC959Vx4AAB476Vn0l4KKhDSwmUXjgL/4gcZHQKR5IE35oTWVFPWPVq4FR4tAer4FZ0F58lsmtMcDSUiInPf3h0hJJ9eCyfcrB3SUpzzZvgjoMp4MqjVnpHTrPSB0J8ZVqCzlr5e7VhUyZydW1XuK0/YJAADzdS/Xe9V6upFhD6hyW3ee8R4QWT1QdhVSwR6gIpM3Ep/Kq5SmMiH+zpxeKP7jrPtE1hzPsOOj2d1o2aiUV1Ur8zxQl/Kx0nwiq1t51dnYnJ24qpOZbnfKHtBVsKrbCnNu5or281SfD3w7LfMCN1a6FpumcasAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACQklEQVR42u2csU7DMBRFXxCM3VgQBYmFHTHRnb2fUP6ACYmJzkzMLPAJ/QqYUPcuSNCKpRJDRwYzQCqw+ogTO26IzxnTOH69Vu5NX92KAAAAAAAAAAAAAAAAAAAAAAAAAAAANAazGBmzGJnC88Y9Y8Y943sc/rf+GywZpMzmqjtYRCTr9LOiO1hEJDt6yHyOh3QeERF5v630PpYMj7+Pi1mXg6J/PP1JACAB2uCgeZ1a3bvbh271DJ/+fNm+zmw+yYI4OvqvRX8SAEiANjio/T40pnf3IiLSPR1UEmw5/mwQ9JkY/dejPwkAJEAbHLQse/s7jXgmth0Y/evRv3twQRcIoDABmu6gmnO6cnJ16VVX2fGa8+f6zeYT9K9xfO78P/T6VT8JAEnjfBfbzuXL68ublHESe35tfFG3xK7/8ebjy1nOt1aer72ez6+h1VVUP/rH1Z8EAD4DVOo3e97BRfNVfcbUxmnzaM6SO4VWt2+drn169K9XfxIASICUHdS3u+I6n+uzP/rH1Z8EABIgZQdt2vcg6B9XfxIASIA2OajDs65Zx/yufXf0j6s/CQAkQJsctK2gv/CbYIDG7AaFckyfr0VEJOv0EaNB+pMAQAKk7KD2rkK73y0luyra9bRfJKWmv/ZZpuo6uI7nXyEA6kiAtjio7UwVuh2/xoXu2zfVQUPr7bo71eE8p3UkAYAEiOSsEuMbTl+nD7UPPkCi1LoOsXUPrVuodSQBAKTirsVVLqIdj3091sFNt9R1JwEgaT4BgS2zRC8QGNYAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABqklEQVR42u2ZPU4DMRCFZxEtXRrET8kF6NLTc4TkJjkHDRwhPYdITwlBNJEocoChiaPYkmXPrp3x4Pd1+5Psk/a9sWeWCAAAAAAAAAAAAAAAALqE92vm/ZqT923mzJs5Tz3fu/4LWE6Xy1PnEBHR74t3PFw9DykneSdWj4fzxOdOrkX9SIAyQ8xJoXNuZg+eI7bvs1EPvH3aecffu48hx9kpJ1vVjwS0sgYcI5Fw2vb17eCExagHHn+/XFSp6db0IwGtJSCXu/vrKoJcrXZOka4BWvqdbrcm5OpHAlrbBaXecCnnfH3+eLuI8P/D66UcWlp/mCipbiSgtTUg3C9LHZB7XVCjWeIobf1S3UhAawmIvbHQWTFHOOfkOiZWm8euAefWT5gFdboGlNpfl3K+Vf1IgLU+YGonKd19SGu9Nf1IgJVZUNixTuXEwTyyFov6g1b1IwFWp6GliM2CUjW11IxIWz8S0HsCcjvhWt8FtPUjAb0mQOoc6bdhK/qRACudcK0vS7kzlFLOb00/EvBf1oDac/TaNV9LPxJgNQGxDi93GqhNK/qRAGX+AM29iuyDdeFHAAAAAElFTkSuQmCC"}, {"id": 92, "name": "粉花白貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABIklEQVR42u2YLw7CMBjF3whHwEGmCAYLJ0BhOAMEQ4IlQRI8lgRD4AzznACNISgCjgPgiig1C03/JsvY+5kmW7uu7/Xr920AIYQQQgghhDgiVpkQq0wU/R61sgtZt+3YbHQEADzmG3lhupNOQLqQrEeJy3MUz9c1oQNO9Bqy3c8AAK3t4qeyOh6Hoxw3GTMG/Bz48l4OAQC3b2vN6cxTKMiB96AfNGHo+P93wPY0UbTTroyF+8Xrvm4+2/xQegcS10ysU9JW8Xw/ZuLQGMhjUp4xEBoDvkrn975JadNOUOOqk4nVikNjxFZ5i1NMVLsajY1O+XzMVDcGilLelA/oQFHK04HYtZJvdVp6B6ItoJ12tWc2/43GqEZjfS/41kh/68AHdAh0nRk3yxQAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACAUlEQVR42u2bP07DMByFXxAMMHcDdapYusIJmFg4A4gFiRWJsWJnRWKp4AzdOQEzC+qEysYB2MIQIhVTK3Hi/HH8fUukVE5+fpbfaxxHAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIR0tkjT2SJFibj132IoIGa268xgSUruzpIQOro/OkwlaXV9n524fMz6Ibd+5NfJ+fx6T7pyUPSvrz8JACRAVA56NMqO8ytJ0sHDzca6bKyenrN2F+c46AD0JwGABIjBQU2+b08lScvfY2leXr06urMDo79XvUkAIAFCctDKzpnXfXJcz7lqts/rX368SZJ293bQv8H2pt6T8fRP/SQAkAAhOGjRTLatchQxGU+1fl3X3233s9W1Vr9CSrBQ9c+Peb1m/SQAkAAhOGhZbO1s9zHrMuu11d3UOjr6t6s/CQAkQMwOWtQfX/cz//vb+o3+7epPAgAJELODttVPEqyf+pMAEDVJ1XXgrihyoL72I9S6h64/CQA8A8hhfdd8oxaK84QO+otvggGYAABMAICOvwcYCuauzKq7NW3tul61CeVZpuo4lG1ve3YhAYAEwEH/O5PraofZzvebz746qG+9Xb+vqDuOJACQAG04qxra++Lb6X3tg6+bKE2PQ9u6+9bN1ziSAACquKdjk4vYzrd9PcahnG6x604CQNT8AMOXIL/UaF5WAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABl0lEQVR42u2aMU7DMBiFXxBH6AbKFLFkhRMwsXAGKhYkViTGip0ViQXBGbpzAmaWqhMqGwfoZgbXSERYsR0n9o/ft0RtE+tFee+3/acAIYQQQgghhBBCCCGEEEKIBbVYKrVYKuofxh6tlJZ91xMPZkcKADbX9/qLy0ftJGgXVXfnlc84hs+vVTXFjeaqnwmQkoAfjmf6+HQFADh8uPnTGTY2zy/6uvlFmjvOTD8TIC4BO7a3ZwCA9e7ozOubU40de26IrT9UNxMgLQHb05NhzrNcbxy0/ngHADR1O0oSYusfqpsJyC0BrquBpm5/fTYOcP29j1BHpdbvq5sJyC0BtifWdZbNEcY5ro7p1tDuOL5zwNT6uQ8odQ7oq4Gh54c6X6p+JiAxVaizQmuk7+rDt9ZL088ESNkJmyc2tMZ2xzPrZd9a7Ls/yFU/EyC1GxqLrjNda+pUb9LG1s8ElJ6A2DthafqZgFITULrzmYBSE9DXhczd+bH1MwH4J39NbOrWuQ+SI6n0MwEQ0g2N1W+P3eWUrp8JSMw3shEWAN+flLoAAAAASUVORK5CYII="}, {"id": 93, "name": "鈴鐺銀虎斑", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABPklEQVR42u2Xv04CQRDGP4g1icYOS8MbWEt1pfEJUO4JCKXUtpd7ApE3MJRU+BrGUjsjrd1RDcHNTmb3uIuR/X7d5nZusvPNn12AEEIIIYQQQsjf0And2D8fVPvrz6+3Th2HTf1H6P53BU5iDT7mzwCAi/F9Vcfhnn0jB0hPAeHpZflr/bpeAwCuh0Pvesfmu9EDpKfA6vTsIIeH2h+/Am6ftshvb7w1Ibmvfbf8hc6HbnKT+G4y9XcXQxG3Wy3KgpPYq4BVA1pkYxGlNFgDljKXs1Uth++PWVCkrUwQu3QmsZxYIvNw9ePdl/VyAMBsOfJ2qzww8lJr2h1rURZVWjWgRcjCjaB0H1cB7b9at0qvBmJR3wOBOR86qamAhht5iayV87F3JCoQWwvWLTb2dkoFQl9mbZHuJG6L5GpgC0hNlONH84yCAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACIUlEQVR42u2bO04DMRRFXxAFFRKIDmrEBuiQSAVdlB0AswJEyQIoESsIsANEmSrU7IAaOhQkKrpQGSVOHI8/4+DxOU00iZx5cy3f6zw5IgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkAedUh50d2d/Mn398fnWWeX3lMZ/1X+NqYGSWS/NQd/vH0REZO/ifBI4Hgdtgf4kAJAAJTiozuDpeeb6ZTQSEZHjbnfh9R9f46iO7urA6D+OqjcJACRATg7q65yK4dZ20P1Dx6v6lX6nRwfo3+B4Xe+q35upnwQAEiAHB7WtZFOXw0bV7y10VOWcps9t9zPVNVW/5JRgueqvXlW9ev0kAJAAOThoXUzj1H30vbFel16vaa/dVB8d/dPqTwIACVCSg851RSzdFdP4x7tbJ8fW9/6m50b/tPqTACCcBnVYwbYV6rp3Fce+t81B63Yxbl43vOq+PvxZ2mc39t+157Y5Pfqn0Z8EAH4DuOxBFaEr+OzyymsF+2LqB+ucbFYiIjL8HkStp65zon9a/UkAIAHa5KChqLptXQvX90tJsNz0JwGABCjBQUsB/YUEAFhZAuSG3g/3Pa1pGherb98WlpzO9JqHuuNNv11IACABcNB5Z3LtdujjXE915uqgsfV2/X9F6DySAEACpHBWiXT+vWmnj3UOPjRRmp6H1LrH1i3WPJIAAOJ57nuRi5jeT/19zEM93UrXnQSAovkFGc95reuLHiMAAAAASUVORK5CYII=", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABo0lEQVR42u2ZPU7DQBCFJ4gaCUQHJeIapEoZ5QQR+BqpaREn4OcGKGWq5BqIknQIjhCqQYmVwbv2Ovuj72siy1nvs/ze7HgtAgAAAAAAAAAAAAAAAFAyA9c/Xpxfb7aP11/vgzYThrpOrHlD6z/Cg3E59h3w+fwiIiKXd7ebNhNujY9yw6npJwG5JUB5epvvHK+WSxERuRkO9x7/8fPtVGP7XhtC62+rmwTkloDF6VmnCa3x6iB1ZjUZ95KE0Pq76iYBqSWg3udaVJPxvzX19fFh57d+3rVG+zoqtn5f3SQgtQRYT0ydpd2B5Qh1lnVex1s1tH4d3zXg0Pp5D5DC9oKaaqhvLW+qwaGcn6t+EpDbGqBP+Gq2aDXhx/0oiJMtnbnpJwG5fA9o6lqU0UklIiKz+XTvXkq9RlpO0etbezTan/uuFanpJwGlJcDqm9UBVpfQ9D7gWutz008Ccv0e4OscV0d2rfG56ScBpSag7hzXPaDYzj+0fhJQagKsWmrV1K57QLnqJwGlJMDaHWzqIlIhln4SkOubcF/0vQakpp8EROYX1N9XqRz14bEAAAAASUVORK5CYII="}, {"id": 94, "name": "星星三花", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABXklEQVR42u2YMW7CQBBFv1GKNHSIJhYSEkrjK6RBUXoOQAGXoOAAOUQaUuQA3IBcggaliWWgQaKgodsU1iJ5xLC7xkYiM6+zsBftn/3zxwYURVEURVEURQzmMDfmMDdVrde4d0Eebqk8AGD/UbiOmoNIdAW8d//Uei6c2/VuFV1Tibg7uWoduR7IZp8AgHg8KtdJvtuVbkBgF9rmZzd7z5U8DhcXb399eat1A/+vC3H92XYhqzwltBK/6Ua7UMEDXFLafs0p3uskAICf4fk/OP2eLs9WguZLaM7I84BVkoMq7rpPvAci18xDcSnri60Ah1wP+E6jZStBleeUdp0E+5ycWcju2KVM6Hqc8jTxadL3OonRd2IfHr/6QR6z3jpSz0wT4R6oCy7haVJzE4JWwAXtHhlyT8RTBCnPfU+Sk8ShU2nZhObyQT3gq2DVlTkdFeYbqlwP1EXoG9rdV+APxyCxyJ4bovcAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAChUlEQVR42u2cMW4TQRiF30YgkUgukBANVqRIEU2OEBqE6H0AF9BwBIo06VJwBBoocgD3KEqKXCENQopiGWiQKNzQmcIahMcez+x4djbr+b5yvbv+563mvdl/LEsAAAAAAAAAAAAAAAAAAAAAAAAAAADFMJuOZrPpaIYS26H/DpJCyTxoYwZLUtUbVF1zHknS749bMQ70JwEA8iVA2w767MnzhXXj919fa32vqdPU3T94Lxy0+/qTAEAClOSgk0+fJUn9t2/iOglXT1upG/2b0Z8EABKgBAf9x8+5803O5nX8GV6uPf3Vi9eNOnpdJ0f/tHqTAEACdMlBfc5Zt7vx6Pzl2nFcXH9ZGMfx6UmS+r+NbyRJu3sP0b9B/W29D/ePFuonAaBoqtAZbGaScR6buk50N/5Rq5uxYiYvXG/3ufX4nVZ1O2znNPcx97WxPzfjMPW7sMflqx/929GfBADeAdbtFLr6xUszeKhaM9jV307V53Y5qO2UtvPY9dqfmzWpy8GVeKcW/ZvVnwQA3gHqrEFdazXXDPadl2oN6nM0l+PEYr4/FF/d6N+O/iQA8A7wP2bN6ZvJqWZ46PeEOqjreOx4XMR2Y3ygf179SQAgAbbJQeXpC5udwE3XoqZOs5MZumb1rbnRP6/+JACQANvkoLlpyjHRP4/+JACQACU4aNtMbj9IkqreQCUm2H3VnwQAEqBkB7V3FO1+tyJ3Gu3jXfsXiab0d73LxD6H0Otd7y4kAJAAOOiyM9XtdtjXpe7b31cHTa136K9TfeeFPkcSAEiAHM6qDX+LksvpY53OdZ/YRGn6OeTWPbVuqZ4jCQCgyH8HWOUiruO578dzCNOtdN1JACiav9w4x0VCTRobAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAB0UlEQVR42u2aMU7DQBBFx4iChg6lwUJCQjS5Ak2E6DlACrgERQ7AIWig4AC5AVyCBqUhMiAhJIo06UxhRmJHWry79mZnzX9dZMv6kf+fmV0vEQAAAAAAAAAAAAAAAIAI1Kt5Xa/mNfQ3bMESadnepHOIiOjrxvhd7J4XuTg/hn4kIDHOb29/79ioe6+fz0UXJ5WHV52e44tW/UhAbj2gur0jIqLy8iJsEngcJf3D2vQjAdlNQe9N7auuGyespw9/3n56chZUq6P1hkj6Q3UjAdqmINt8y2+YnSPxddLL8s2YIvj5i+UTEREdHYyDpoxN62dCdSMBWnqAbaXH866knH2YDpia19kJ0iGuNfWXo5xqqxb9vrqRgNx6AL9hG+wc1/ukc+T1vnuANv1IgLYEyD0TW43ris1poc7PVT8SkOtuaKiTXGtnG74J0aofCchlL0iuWLvCz+N5WSJXrHKl6jpna9ePBAz9m/DO/cTLmVxT17KmzsbUxxctbfqRgP9yKqJtOmmbp7WeouiqHwkYegJk969o8rMbSV7OSXWeKLZ+JCCXlbDvrmLoCtM23fTlfG36kYCh9ADXffTgqEau+an0IwG59oBYxF7hatOPBCTmG8XbitvmtANVAAAAAElFTkSuQmCC"}, {"id": 95, "name": "獨角獸貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABTElEQVR42mNgGAWjYBSMglEwCkbBKBgFVAP/b3j9/3/D6z+97GMa6gGG4YH/nzf8//95w/8h64GhBliQQ56BgYGB4f0sFD4jbwAjKQZ+vPBsNAZIAYzY8gC2kJcWUUPJF0/f3GLEVQoxMDAwMGpswypPrDmE3DN8YwAXgIXck/kLGBgYGBhkEhPIshBdP86YRMuTDIJpDNhiYviUQqSCO4+ukqdx72nikgY0pId9HiA5Bn44m1JkIan6CdVDwy8G0MtpQoBj5lFIyKZbkyWPyz5C9cPIrQcIlT4qctoMpKgjNqRH8wCt6ofRPEBuSJFbE8PSPqGQJpQSYPpGTk0M8zGleYTYkCeiFPs/sluj1Aa4Qh49z4zcPDBQIQ8LaVz9gtEYoFfI4xqvGjk1ManlNLk1NKFRitE8QGk/gOykMuJH5qjVXyC3jTRs+wMAfAqyJK39tGoAAAAASUVORK5CYII=", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACaklEQVR42u2bvUoEMRSF7ywKKogIVroIgohgY2Olnd1WPoI2+gY+hG+gjT7CVnaWVjY2goggiFoJItvYjYUG3DjXyfzFyeb7ml12yczNCTlnJpMRAQAAAAAAAAAAAAAAAAAAAAAAGEHS216a3vZSlIhD/w6SQ8x0Rs1B00E/TQf9FAdFfxIAIIexrBksIpJM7yRBOZ9xnbeTSv14v35pRT/QnwQA8JcAoTuoqVOre2FuZei69Pn1LrNfM+vz39+uM8/jepyijo7+/6M/CQBRk7jOGNeZZ1YgktXzxKeD5mHO+3R6JiIi3b3dUsex26s6WI4us/tSJAnQ34/+JABwD5B1LecwAzPXertb95lOo83gpq+JNe4fb8o1vLiq9ZrYdjD0b0b/7tIhq0AAuQnQdgfVnNOVj+2NSoIVba85v9Fvcmoc/Rtsb5zf6LW8uDZUPwkAJEAIDmo7pz2TtVWOPCaOL7/qOtgs9b92Pq2uH/VLSAkWqv7m09Rr108CAAkQgoO6orXTzmPXZZzZOIVWd9U6JWe9HP396E8CAAkQs4NWXV1xPZ997a/1G/396k8CAAkQs4N6fw5CgrVKfxIAhN2gBZyiKedzJc+B2tqPUOsedf1JAOAeQAqs79pP1EJxntBBf+GdYIDW7AaFYjw9HJm9NYjRIv1JACABYnZQe1dm2d2aWjvzu/ZGUmz6/7E7s9Q4uLbX7l1IACABcNDfzlR0tcNuV/eTz7Y6aN16F32/ouo4kgBAAvhwVmlo70vdTl/XPviqidL0OPjWvW7d6hpHEgBASu7pyHIR7Xffx2Mc3HSLXXcSAKLmEz2fwdKMPyEgAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABuklEQVR42u2aMU4DMRBFx4iWAokuKFWEkHKTVBwhaThUGjhCKjpOQEODFCGqCKiQUJQDmMpSdsCKx2vHM+x/XbRZ50v7/3g8GyIAAAAAAAAAAAAAADLx65n365mH/jROYJm2/HoAfrfyfrey62Bj+pGAxpzuO4eIiL6Xnc/u7MZJFtw+fzZzvkX9SEBjXMxJ3Dmji6tOXf34enWxLoKIyF0//Hk9dZ1DeqTf16ofCdCWgBjhyb/f3RMR0eVinvWD/P6oE1lNp/Nbyqnp2vUjAVq6IClvm5e8Gx+fkpwanJLbzRxbf9AdEpGqHwmwtgdkO4cxGU87NZSvz6/3pZZ+niipbiRA2x7A+1ypA1Kvp9boyXjqJY5qrV+qGwnQloDYE+POijkiOCfVMbHanLsHHFs/ZkFD3QNK9delnG9VPxJg7RzQ9yQp7T6ktd6afiTAyiyIn1j7EtYL/bK0FkvPB1r1IwFWp6GliM2CDtXUUjOi1vqRgKEnIPUkXOu9QGv9SMBQEyB1Tt//+2jVjwRYOQnXerOUOkMp5Xxt+pGA/7IH1J6j1675rfQjAVb3gNony9rdixb9SEBjfgBkR4/g3us+1wAAAABJRU5ErkJggg=="}, {"id": 96, "name": "星空貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABFElEQVR42u2XMQ7CMAxFfyuOwAYzCxdA4g7lCrB0qVgYOQQL6sICVyh3qMQFWJjLhrhCGVBQhRqSJkEI+b+talwrtr/tAoQQQgghhBBCfkNke3DQH9XN5+vtErk4DPUdRfzvGeh1Naj2BwDAcDGvXRw27INcQF4GFLPpEQCQ704AgCydWFreg14gFteFVOR9KcqEXahVA+992kS+XT01sNw4vdf5s80MNaCrbdtz1ICvBnTz4aUBw5ygBly3SNd5oGrfFGlTJSg7ObuQurGvRmwjX53XH7VTlEktexvVTubO22n7nMnSds3I1YAtvpHvOqmZga7aKMZhIi9vEutq1rXrhNpOqQEVedv/gNDI1cC3EKeBB6YjggukDs1bAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB8klEQVR42u2bMU4DMRBFJ4gTIDqoEUdA4g5wBWhoIhoOQoNCgZDgCuEOSDkDNXQoVwgFMkpMBnttr3fNvNdEm8jx7Lfyf3bWKwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG0wsXKiB/tHq/Xjj8+3yZDfY42x6r/D0oBldq056PvTs4iIHF5erDLH46D/QH8SAEgACw7qc376IiIis4eFiIhMr04iRy6LOnpXB0b/ZVG9SQAgAVpy0FTndEwf9zaPo+vePj61fqff/fwY/XvU39d7/nq2UT8JACRACw4a+iVrXY4Qs7ub77qub5M+1+bT6lqrX1pKsFb1d6+uXr9+EgBIgBYcNBZtnDaPX5dzZucUWt199dHRv67+JACQAJYdVOuu/DhooMsSO5//3187b/Svqz8JACSAZQcNdk2Uuv3zJMHa1J8EAOF5gIQ+8FCEHGgs5+E7byt1W9OfBACuAaRDf9e/o9aKg6bOm0ruePSvoz8JACSABQcd+7zoP8y8JACQAJYd1N+VmbpbUxtXu2szdv3/2J2ZtA6x47VrFxIASAAc9Lczde12+ONy7+i24qCl9e76fEXuOpIAQALUcFbpae9LaacvtQ8+N1H6XofaupfWrdQ6kgAAkrinY5uLaO/X/j7WIU4367qTAGCaL53jLy/3cN3LAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABhklEQVR42u2aMW4CMRBFB5QjpIOaJheIlDvAFZKGhhvkHmnSJFfY3AEpF0iTGjrEFaCyRCyZ9Rh77dm816HF3r9i/sx4FhEAAAAAAAAAAAAAAACAMTOJ/eLsfnG6/Lw//E5Sbphrn1r3za1/SgzW5U67YPfxKSIi85fnU8oNL9ZXeeDW9OMAaw5wrJ6+RETk7f1bREQ268fIlceoHFu6NuTWn6obB1jrglzk3Eq3Xf7pIvz9/eu5uqDc+n1HaXXjgNZqgN/naiMg9npsju62S1Vura1fqxsHtOaA0C/mR1YoIlzkxEZMKDen1oCh9XMO+K81oC8HOvr67FyRb1U/DrA6DU3NkdruQ5vrrenHAVZmQf6J9Vbcfq5f9tn9vF7NvdrzQav6cYDVaWgI7XQxNAvarK/n1FLT0qH144CxOSB+rl7mJGxNPw4YmwP6cmv30Gbk19KPA6ychEM5T/9ONe4NmRT+f1Ar+nGA9RrgImfoOXrurqeWfhxgtQaUYqga0Ip+HFCZMxS2KucSzkn/AAAAAElFTkSuQmCC"}, {"id": 97, "name": "月亮貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABJ0lEQVR42u2XOw7CMAyGHcQRGJCoOlUsndnYuAUTXIJDcAmYuAUbGzMLYkIgMXAAtjBFqiIZmzSlNPa3Va3r2H/9KICiKIqiKIqitIXhPjgajG31+v48mxCHsd7j6HVdgf63BrfNFgAAsuXChjis2EcJQJ4Cjsv1FGa4P0YNQJ4Cr9mklsO69ukr4PdpjCIvP9YGdZ/yx50P6SmARe5nCutCLvPcLqWTOLQGYs0H8TUQvI2GTmK/O3FrDlNIziR2EdetEW7mKYWLvLSyt9HYYJnHJrq8Gmgr89Q8UAXayny6Ctjb2gIAmGxlmnBIbbF+5qnzdF6BaAEUeYn27E4E8HfbKPbtxdqFqB2JW4vp/w+4TPz8YMwuKOePzPE4zBtRZDjdGZFd6A2HtoRPM8TMfwAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAABuUlEQVR42u3bPU7DMBgGYBfBADMbqFPF0pkTcBE4GVyEE3RmQUwINg7AVqZIEDD5c35cP8+CADlxvijf2zhpCAAAAAAAAAAAAAAAAADkYVXKgV6cX+2///7+8byaczulWWr9j5waSnZcWgd9u38IIYRweXe7HzheBz2A+ksAJEAJHbTu5fWp38DHXdKO3rUDq/8uab0lABIgpw7at3NWPm+uB+1/6Phq/lX9Ts9O1H/E8fV6b9bbH/OXAEiAHDpo05UcW+WI2ay3/3bWpv837S82r6btq3/a+lc/q/nW5y8BkAA5dNC2YuPq+4l9hq7m3fYzdup1dPWftv4SAAlQYgdNtbrSdn/1zhw7bvWftv4SAAlQYgcNcz3JlGCLqr8EIPg+QI914Lk0daClHkeu8z70+ksA3AN0WS2oP1HLpfPkTv3HIQEomgsAFwC4ByhU/Z2Zvm9rxsbNvWqTy71M3/PQdnzs3kUCIAF00N+dqetqR31c6iefS+2gqevd9fsVQ8+jBEACTNFZw0jvvqTu9Knegx+aKGOfh6nrnrpuqc6jBIDQ852Ov7pI7O9Tb895aFe30usuASjaF0at8Ne2r8YCAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABlUlEQVR42u2ZPU4DMRCFZxFHoEAi2mpFszUdHbegIpfgEFwCKm5BR0dNg6hQkCg4AN2mshRZMrG9s7ZH+31dlNh+kd8b/4kAAAAAAAAAAAAArIEu9ocXZ5fT4efv348uZ0CtfmqNq63/BA/W5TS1we7xSURENtu7KWfAg/ZV/nBr+kmAtQQ4Pr/e8xq+vEXV2KXXBm39ubpJgLUE/N1czRow1N45yDlz6MdFkqCtf65uEtBaAvx9boihH/+trce+j63RqY6qrT9VNwloLQGhGfOdFXKCc06s0/0a6veTugaU1s85YK1rgNb+Wsv5VvWTADF6G5pbI/3dRchBubXemn4SYOUk7GZsbo31+3P75dRanHo+aFU/CbB6G6qF78zYmlrqJW1p/SRg7QnQPglb008C1pqAtTufBLSagGn3MImIdJv7ruRbbMg5qXqs6ScBlVGbgKEfo+9BWqSWfhIgjd6GhmqX1l3KsZPl3FpuRT8JaP09wM1kcWFKu5jW9ZMAKy9ijp/X20UcdX79XOTk25p+ElCZPc9QMN/PWiYRAAAAAElFTkSuQmCC"}, {"id": 98, "name": "粉翅膀貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABCUlEQVR42u2XPQ7CMAyFnYoVJpjIDPepegA4GRwAcR+YYYIJDhAGmqoNCklTo9L6fVvVOJb96p8SAQAAAAAAAADoBxV7cDlfmfrz9X5WKQ657rFkQ1dg0tbgstsTEZHebkyKw5o9SwDyFKgyeTimGT4frAEIVGA66+axq/3oFXD7dAhd5F9rIvTe5y92PmTiJnGo+4Qy7p5zM22MaSiilFKogV/OB9efXqzf99xODUV8SmRit9HUSWy//eqeMtMf50olfNjakTOJbcRda8S9z/20W3Q7I3sb5caXebdm5NZAX5kP7URQoK/MQwHuXalt5kejAFsAusi9PXsQAfz9Nsr1vxC7I4lR4AUVkm8Rk3FyTQAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAAB20lEQVR42u3bPVLDMBCG4RVDCxVUuIaGQ3CGTA4AJ4MDMNyBQ1BADRVU4QCiADGxgpCtH9vKvk/DAKNY/jzejRVFBAAAAAAAAAAAAAAAAAAAAAAAAADQBqPlRM9Ozu32728fL2bO19FmqfkfcGmg2aG2Cvp6eyciIt3Ntc0cTwXdg/zpAKADaKigO/O4f0gb+LkpWtHHVmDy3xTNmw4AOkBLFTS1cv46Os5LLHO8m7/Lz1xdkn/F8X7e3XrVmz8dAHSAFipo7E4OrXLEdOvVvxU19v/Q8ULz2pq/tNTBWs3f/XTz9edPBwAdoIUKOlRoXOg4/rz8+cbea/vHs9a641gREWOMyVmnJ/+6+dMBQAfQXEFzV1f843WnF9+v8/7cP5/Hp14+oZzJf9r86QCgA2iuoNXO82e+uXt1yL9u/nQACN8HSFgHnkusAi31PFqd977nTwcAzwAyYn3X/0StlcrTOvKvgw4A1bgBwA0A8AyglL8rM3W3Zmjc3Ks2rTzLpF6HoeNDzy50ANABqKC7lWnsaoc/rvQnn0utoKXzHvv9itzrSAcAHWCKyiqV9r6UrvSl9sHndpTa12Hq3EvnVuo60gEASdzT8VcVCf196tfjOgzLTXvudACo9gWnfCDNFk+LywAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABeklEQVR42u2aMVLDMBBF1wwtVFChGgoOwR08PgA5WTgAw32ghgoqOIAoiDIZzQhZ8iqS4ve6TCLre/z/SlpHBAAAAAAAAAAAAAAAAOCUGeb+8Obq1h5+/vh6G3Im1LpOrXm19Z/hwbqcpw543z6JiIjZPNqcCQ/GV7nh1vSTgN4SsHfC80vewJ/vWTW29NqgrT9XNwnoLgEXl8tmDIx3DnLONNNYJgnK+pfqJgGtJcDf54Yw0/hvTY19P7dGpzqqtv5U3SSgtQSEnpjvrJAjnHPmOsavoXse7rNOmsfWH0zC5+tfq2EYWANOcg3Q2l+Haq9zkLXW7pykuga0op8ESKfd0NwaGd1d7Gq/ub7LqvW96ScBvZyE3RNbWmP967n9cmotTj0ftKqfBPTaDdXCd2bsRHrsN2ml9ZOAtScg5pxWnF5KPwlYawLW7nwSsNYExLqQrTtfWz8JqIzaAzDTGNzz9kAt/SRAOumGavXbc99olfqPaG39JKAyv8MiBoqv6EGYAAAAAElFTkSuQmCC"}, {"id": 99, "name": "花冠三花", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABaElEQVR42u2XIU/DQBzF35YJgiYYlqoGRB16CRCCAL7CxDB47MBgZvEYJvYZQAKC4EgQJITM0BQUH2DBHOJ2C730uLt2C2nu/Vyvd9fce339/wsQQgghhBBCCPkfGq4T11bWxe/r7CmWG0TXuT2uXoUAgN7yYeF9kR4IAGhvjgEAH19vjSoHaNbdgZbvguz0ElLB47ziN/dyvLMBADhTil/cCQAY7m/JgefH6T7f0qGTbQTtgHcGssFqbnzSvf1z3W5nL3f9cD6QTh31mIG5OFDWiff0kw4UfoX0770JpXgcJQCAcbd43ux++lLohOl5rs6ElwGlpAldcds8ZqBsBkzYlHd9HjNgU8pXaf3dtyltexPUunC6UXXiqhlxVd7Wc8VRIsL8H/BlabRTqs5M9Mz0k8AzsChMFd61UtMB16519k8NmYl2H5WUD68S+3alZSu0b3daewea81RQ73NqdYDaZWBRBJeBH8TxleQfxnyvAAAAAElFTkSuQmCC", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACiUlEQVR42u2aP2/TQBjGn6AiQeeKpShTRIduzJWgqhiAr9AhLOzMsCBB1+5dYOAztENVAVIRGxIDEn+yEKVMfICKxQzORfja650v56OOf78tTmy/fi7v85zPlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoB30unKhqyu3in8/Tz4NSgH6+xUNXn0tCkkaLj889/ti/KCQpJu3R5Kkk9/fe/yN2qv/FYYGusxS1xx08nRP5fkfV+s9eF9u31iTJD0z9e6+KyTp9f075YbPH6fH+VNe35O7JFiL9ScBgHuAOg406+CXZQe/OP6mSgdPt9sdbzp4+KPsYI1mHdzL6aCTnRuV7afbby/cb2vjXuXzh+c75XU+Gs7loKae0P3Rfz79XXqTAEACtMlB6zqnr/7Y6/g5/jVX/aPxF0nS9eWrPfRvTn9b70F/vbIfCQAkQBsc1NfJrtWSM6sQ0/pNveY45rg29vfmOkz9Llx1+epH/7z6kwAgngPU6GDbcWYduq1aHew7X+zqims/cx7bKW3nseu1vz86Poxy8Nj1fvRvVn8SALgHiJkDuvDN6ezf5Z6D+uoKxZw/lNi5P/o3qz8JANwDxMxBU3V46PlCHdQ3B01F7GpMKj3QP43+JACQAIvkoL7ViUF/vUgxFzV1XnuzWWvO6ptzo39e/UkAIAEWyUFz05Rjon8e/UkAIAG64KCA/iQAwGVLgP+N/UTRXu9W5JPG1E8+FwXXvUzsOITu77p3IQGABMBBzzpT3dUOe7/U6/aX1UFT6x36dqrvd6HjSAIACZDDWdXQuy+pnT7Ve/DzJkrT45Bb99S6pRpHEgBAkW8tnuciru25j8c4hOnWdd1JAOg0fwFag7Sag4irSAAAAABJRU5ErkJggg==", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAAB1klEQVR42u2Zr0/DQBzF3xYEQRMMy9QCYg69BBaCAP6FiWHw2IHBzOIxIPgbQAKC4EgQJITM0BQE4Q9YMDfRXbJeWtq7/rpr3se1d72+Zu/d9+4GEEIIIYQQQgghhBBCCCGEEFJnGmk7rq9uiMVr/6UTDNC+DY1x9S4EAAxXDiPbhXcgAKC1NQEAfP1+NMr4UFv1N+nBalnSfcA/vUTggOOwY+4eg/u9TQDAmXTMxYMAgOv97eDG6/N8nL/AYSc7pX6wbfqZANdqgD9eC92fDu7/fW63txe6fjofB047GkbOofI9edeGovWb6mYCXE+AqZM+ve9IB028NwBAp93NdZVUlH6JqW4mwLZVkLpejqM1+gk7YBBul05QHaI6KY4FR2nNrVXr19XNBLhWA+QvHId0Ttp+qnPU9rxrgG36mQBXa0DSHGjaP6vzXdPPBLh6GqrrFN25MwndhNiqnwlw5TRU3bFmRY4n18sqSWc2uvsDW/UzAa79H6DL8k1fy5lyTp2qc+qom6kG2KqfCah7Akx3qHnvhG3VzwTUPQFq9ffRn59GwgnnF62fCXBlJ6x7qmi6wyza+bbpZwIqppmnA9Keg9hIVfqZAFdrQFGUVQNs0c8EVMwMkmlQdd8FPioAAAAASUVORK5CYII="}, {"id": 100, "name": "國王橘貓", "kind": "cat", "rarity": 3, "sit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABLUlEQVR42mNgGAWjYBSMglEwCkbBKBgFo2DIgf/nrf7/P2/1n1JxSgHTUA9IFmrEBIpAgzFUnOE/PTww5GOAkViF0iJqKCH6ZLcIWRbKuL5B4T99c4txNA+QAp7MXwANyQSyLITrT0wYzQMUlUI32uQHhQdGXgx8eV5PkYWU6h/+MYBe3hMCGlUP8eYJQvK47CO2fhh5NTGh0odQiKOrG62JKc0DlNYPo3mA1JB6cqWKKhbL6LThDWlCKQGmb/jHwA0rL5SQcL51h6K2EKz02aumgip+bBsjOaXdyG2Ncni2MzAwMDD82F5JFYfgCnlYSA/bPEDxqASlMYErTxFbU4/GALmA0pAfjQFqt5XQ6weNN7dG+8R4AXqpQ2w/YHRUgloxgKuGxCU+GgM4AAB6q4wD3bBfuAAAAABJRU5ErkJggg==", "walk": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAwCAYAAABHTnUeAAACFklEQVR42u2bvU7DMBSFbxADA2xsVIIJdWCp2LozsPAAsJSFd2gXOrWPAQvPwBuwoa5Vt0ogFkYGtrA0QjU4Tmrn59bft1Ry5OT2uD3HcRwRAAAAAAAAAAAAAAAAAAAAAAAAAAAAdaSzfprO+qlvO+jWf4ehgJjZ9fkHi4gkvZfEp70NTrTWMD5ftUur3R79SQCA5hJAm4MeHZ4Wq2f8Wuo875+LhATTqz8JACRATA769vAoIiKdi4Ff/9uB4KD69ScBgASIwUFN5pPjVsyJyzow+ofVmwQAEkCTg27qnBlfH/de1/ftn9Wf6Xdwt0D/CvubendHslY/CQAkgAYHdf2TS6+WrOiOlrmO6jpuu56trt/6l6IpwbTqn31m9Zr1kwBAAmhw0KLY+tmuY9Zl1uuaa4deR0f/evUnAYAEiNlBfVdXil7PnPvbvjf616s/CQAkQEwOun91E0S4uTxJo3t+0F/YCwRQ9z1A2x3UNdftnE3SJp6kupwT/ZvRnwQAEmCbHHRbQX/hnWCA1r0TrJ29y2nu8e/nIb+SLdafBAASIGYHPeldS956t5Rcfzf7VT1X16b/n92ZMszVzTUOLt1d9y4kAJAAMTuozZnKrnaY/Xyf6Gpx0NB6l32/wnccSQAgAepwVqlo70topw+1D943Uaoeh7p1D61bqHEkAQBkw12L/7mIrb3u8zEOxXSLXXcSAKLmB3bfRSK0qlCuAAAAAElFTkSuQmCC", "scratch": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAYAAADuFn/PAAABq0lEQVR42u2avW7CMBSFL4ihQ0e2IrFUKHu3rKhDGXiBLvQxmqWd6GOUt+hQ8QysKOqCBOqSkaGbu+BKsWpwYie+VznfhkPiE3LO9U8gAgAAAAAAAAAAAAAAAHAGtUmV2qTKt73r+vuwUlwGIZxUani9O7WTkpLkmPqRgMj0XL94M5yUHLH/HNbqcHRflD4firzXxo1y1Y8ESBsD9u+rkxMWtTr8O/9pEeWGuelHAqTOgrbLcaO1uumxIbT+urqRAGkJOH6/eHVoO187SDszyaiRJITW76sbCeCWAHO+bCPJdmdr6qXjrjW6qqNi66+qGwnglgDbEzOdZXOEdo6rY8waal6n6hjQtn6sA7o6BoSaX4dyvlT9SIC0MeB6/him52zp5WSbTmn6kQBi/j5gm85KT3Kaf3nNEnSNXE9u6b/rutZi11rLXT8SIHU39OrhjYiIfj6eqcldSnNFGupNFBf9SID0f0X4OslWk33XA1L0IwHSE1CX2M7noh8J6FoCLu1C6vl1UuQsf7DQ+pEAqQkwZw1t76P7wkU/EiA1AbYVnq2dG1z0IwGR+QXfCzRUhk6OfgAAAABJRU5ErkJggg=="}];
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
    import { getFirestore, doc, setDoc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; 
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
        const navMap = {
            'view-home': 'btnNavHome',
            'view-dashboard': 'btnNavDashboard',
            'view-student-status': 'btnNavStudentStatus',
            'view-stats': 'btnNavStats'
        };
        ['btnNavHome', 'btnNavDashboard', 'btnNavStudentStatus', 'btnNavStats'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.classList.toggle('active-view', navMap[id] === btnId);
        });
        if (id !== 'view-home' && typeof window.stopMeadowLoop === 'function') {
            window.stopMeadowLoop();
        }
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
            try { localStorage.setItem(`guild_backup_${currentUser.uid}`, JSON.stringify({ savedAt: Date.now(), unsynced: true, data })); } catch (e) { console.warn('本機備份失敗', e); }
        }
        isDirty = true;
        dirtyVersion++;
        updateSaveStatus('local');

        clearTimeout(saveTimeout); 
        saveTimeout = setTimeout(() => {
            syncToCloud();
        }, 15000); 
    }

// ============================================================
    // ☁️ 雲端同步（含版本檢查：多裝置同時編輯時不會默默覆蓋對方）
    // 每份文件帶 _rev；寫入時用 transaction 確認「雲端版本 = 我上次讀到的版本」才寫入。
    // ============================================================
    const DEVICE_ID = (() => {
        try {
            let d = localStorage.getItem('guild_device_id');
            if (!d) { d = Math.random().toString(36).slice(2, 10); localStorage.setItem('guild_device_id', d); }
            return d;
        } catch (e) { return 'dev-' + Math.random().toString(36).slice(2, 8); }
    })();
    let remoteRev = { core: 0, assignments: 0, attendance: 0, logs: 0 };
    let dirtyVersion = 0;          // 每次本機修改 +1，用來判斷「同步途中是否又有新修改」
    let isSyncing = false;
    let syncQueued = false;
    let syncConflictPending = false;

    const syncRef = (key) => doc(db, "users", currentUser.uid, "data", key);

    function buildSyncPayloads(src) {
        const c = JSON.parse(JSON.stringify(src));
        return {
            core: { roster: c.roster, teachers: c.teachers, questSettings: c.questSettings, discipline: c.discipline, settings: c.settings, coinPresets: c.coinPresets },
            assignments: { assignments: c.assignments },
            attendance: { attendance: c.attendance },
            logs: { expLogs: c.expLogs }
        };
    }

    async function guardedWrite(key, payload) {
        const ref = syncRef(key);
        return runTransaction(db, async (tx) => {
            const snap = await tx.get(ref);
            const cur = snap.exists() ? (snap.data()._rev || 0) : 0;
            if (cur !== remoteRev[key]) return { ok: false, key, cur };
            const next = cur + 1;
            tx.set(ref, { ...payload, _rev: next, _device: DEVICE_ID, _updatedAt: Date.now() });
            return { ok: true, key, next };
        });
    }

    async function refreshRemoteRevs(keys) {
        await Promise.all(keys.map(async (k) => {
            const snap = await getDoc(syncRef(k));
            remoteRev[k] = snap.exists() ? (snap.data()._rev || 0) : 0;
        }));
    }

    async function handleSyncConflict(keys) {
        syncConflictPending = true;
        clearTimeout(saveTimeout);
        updateSaveStatus('error', '雲端有較新資料');
        try { localStorage.setItem(`guild_conflict_backup_${currentUser.uid}`, JSON.stringify({ at: new Date().toISOString(), data })); } catch (e) {}
        const useCloud = confirm("⚠️ 偵測到另一台裝置已經更新過資料！\n\n【確定】＝ 載入雲端最新資料\n　　（你這台尚未同步的修改會被捨棄，但已在本機留下備份）\n【取消】＝ 保留我目前的內容，並覆蓋雲端");
        if (useCloud) {
            isDirty = false;
            syncConflictPending = false;
            await loadDataFromFirebase();
            showToast("☁️ 已載入雲端最新資料");
        } else {
            try {
                await refreshRemoteRevs(keys);
                keys.forEach(k => { lastSyncedState[k] = ''; });
                syncConflictPending = false;
                isDirty = true;
                await syncToCloud();
            } catch (e) {
                console.error(e);
                syncConflictPending = false;
                updateSaveStatus('error', '儲存失敗');
            }
        }
    }

    async function syncToCloud() {
        if (!currentUser || !isDirty || syncConflictPending) return;
        if (isSyncing) { syncQueued = true; return; }
        isSyncing = true;
        const versionAtStart = dirtyVersion;
        updateSaveStatus('uploading', '雲端同步中');
        try {
            const payloads = buildSyncPayloads(data);
            const strs = {};
            const changedKeys = [];
            Object.keys(payloads).forEach(k => {
                strs[k] = JSON.stringify(payloads[k]);
                if (lastSyncedState[k] !== strs[k]) changedKeys.push(k);
            });

            const results = await Promise.all(changedKeys.map(k => guardedWrite(k, payloads[k])));
            results.filter(r => r.ok).forEach(r => { remoteRev[r.key] = r.next; lastSyncedState[r.key] = strs[r.key]; });
            const conflictKeys = results.filter(r => !r.ok).map(r => r.key);

            if (conflictKeys.length > 0) {
                isSyncing = false;
                await handleSyncConflict(conflictKeys);
                return;
            }

            if (results.length > 0) {
                const cleanData = JSON.parse(JSON.stringify(data));
                const publicSummary = cleanData.roster.map((s, i) => {
                    const debts = [];
                    cleanData.assignments.forEach(a => {
                        if (!a.archived) {
                            const indices = a.assignedIndices || 'all';
                            if (indices === 'all' || indices.includes(i)) {
                                const st = (a.statuses || [])[i] || 0;
                                if (st === 0 || st === 2) {
                                    debts.push({ title: a.title, st: st, subject: a.subject || '一般', date: a.date });
                                }
                            }
                        }
                    });
                    return { no: s.no, name: s.name, exp: s.exp || 0, coins: s.coins || 0, pets: s.pets || [], activePet: s.activePet || null, debts: debts };
                });
                await setDoc(doc(db, "public_boards", currentUser.uid), {
                    lastUpdated: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                    summary: publicSummary
                });
            }

            if (dirtyVersion === versionAtStart) {
                isDirty = false;
                try { localStorage.removeItem(`guild_backup_${currentUser.uid}`); } catch (e) {}
                updateSaveStatus('success');
            } else {
                // 同步途中使用者又改了東西：保持 dirty，稍後再送
                updateSaveStatus('local');
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => syncToCloud(), 3000);
            }
        } catch (e) {
            console.error(e);
            updateSaveStatus('error', e.code === 'permission-denied' ? '權限不足' : '儲存失敗（稍後自動重試）');
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => syncToCloud(), 30000);
        } finally {
            isSyncing = false;
            if (syncQueued) { syncQueued = false; if (isDirty) syncToCloud(); }
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

            remoteRev = {
                core: coreSnap.exists() ? (coreSnap.data()._rev || 0) : 0,
                assignments: assignSnap.exists() ? (assignSnap.data()._rev || 0) : 0,
                attendance: attSnap.exists() ? (attSnap.data()._rev || 0) : 0,
                logs: logsSnap.exists() ? (logsSnap.data()._rev || 0) : 0
            };

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

                const baseline = buildSyncPayloads(data);
                lastSyncedState = {
                    core: JSON.stringify(baseline.core),
                    assignments: JSON.stringify(baseline.assignments),
                    attendance: JSON.stringify(baseline.attendance),
                    logs: JSON.stringify(baseline.logs)
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
            
            // 💾 上次若在同步前就關閉分頁，這裡提供還原本機備份
            try {
                const raw = localStorage.getItem(`guild_backup_${currentUser.uid}`);
                if (raw) {
                    const bk = JSON.parse(raw);
                    if (bk && bk.unsynced && bk.data && Array.isArray(bk.data.roster) &&
                        JSON.stringify(buildSyncPayloads(bk.data)) !== JSON.stringify(buildSyncPayloads(data))) {
                        const when = new Date(bk.savedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
                        if (confirm(`💾 發現一份尚未上傳雲端的本機備份（${when}）。\n\n【確定】＝ 還原這份備份並上傳\n【取消】＝ 捨棄備份，使用雲端資料`)) {
                            data = bk.data;
                            isDirty = true;
                            dirtyVersion++;
                            setTimeout(() => syncToCloud(), 2000);
                        } else {
                            localStorage.removeItem(`guild_backup_${currentUser.uid}`);
                        }
                    }
                }
            } catch (e) { console.warn('本機備份檢查失敗', e); }

            onDataLoaded(); updateSaveStatus(isDirty ? 'local' : 'success');
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
            if(emailDisp) emailDisp.innerHTML = `<i class="bi bi-person-circle"></i> <span class="nav-text">${escapeHtml(user.email.split('@')[0])}</span>`;
            
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

        switchView('view-home');
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
        if (v.id === 'view-home') renderHomeView();
        else if (v.id === 'view-dashboard') renderDashboard();
        else if (v.id === 'view-student-status') renderStudentStatus();
        else if (v.id === 'view-stats') renderStatsView();
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
                    <span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(a.title)}">${escapeHtml(a.title)}</span>
                    <div style="display: flex; gap: 4px; flex-shrink: 0;">${missingBadge} ${gradeBadge}</div>
                </div>
                <div class="side-item-meta muted" style="display: flex; justify-content: space-between; margin-top: 4px;">
                    <span>${a.date}</span><span>${escapeHtml(a.teacher)}</span>
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
                <span>【${escapeHtml(student.name)}】待清舊帳</span>
                <i class="bi bi-x-circle-fill btn-close-debt" onclick="document.getElementById('quickDebtMenu').classList.remove('show'); document.getElementById('quickDebtMenu').dataset.currentSidx='';" style="cursor: pointer; font-size: 18px; color: var(--danger);"></i>
            </div>
        `;
        
        oldDebts.forEach(debt => {
            const item = document.createElement('div'); item.className = 'quick-debt-item';
            const stLbl = debt.st === 2 ? '<span style="color:#c62828; font-size:11px;">(再訂正)</span>' : '<span style="color:#888; font-size:11px;">(未交)</span>';
            
            item.innerHTML = `
                <div style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; font-weight:bold;" title="${escapeHtml(debt.title)}">${escapeHtml(debt.title)} ${stLbl}</div>
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
            <span class="badge" style="background:var(--primary); color:#fff; font-size:14px; padding:2px 8px; border-radius:4px;">${escapeHtml(a.subject || '一般')}</span> 
            ${escapeHtml(a.title)}
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
                    <span style="display:inline-flex; align-items:center; gap:3px;">${escapeHtml(s.name)}${(() => {
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
                let subjTag = groupDebtsBySubject ? `<span style="font-size:10px; background:var(--tbl-head); color:var(--primary); padding:2px 4px; border-radius:4px; margin-right:4px;">${escapeHtml(t.subject)}</span>` : '';
                
                return `<div class="task-item-hover" style="font-size:13px; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; justify-content:space-between; gap:4px; cursor:pointer; padding:4px 0; border-bottom:1px dashed rgba(0,0,0,0.1);" onclick="window.toggleCardTaskStatus(event, ${t.id}, ${i})"><span style="flex:1; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(t.title)}">${subjTag}🔸 ${escapeHtml(t.title)}</span> ${statusSpan}</div>`;
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
                            ${escapeHtml(s.name)} ${getRankHtml(s.exp||0)}
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
            sp.innerHTML = data.coinPresets.plus.map(p => `<option value="${p.v}|${escapeHtml(p.l)}">+${p.v} ${escapeHtml(p.l)}</option>`).join('');
        }
        if(sm && data.coinPresets && data.coinPresets.minus) {
            sm.innerHTML = data.coinPresets.minus.map(p => `<option value="${p.v}|${escapeHtml(p.l)}">${p.v} ${escapeHtml(p.l)}</option>`).join('');
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
                        ${escapeHtml(t.title)} <span style="color:#666; font-size: 12px; font-weight: normal;">(${dateText})</span> <span style="color:${statusColor}; margin-left: 4px;">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="border: 2px dashed #888; padding: 15px; border-radius: 8px; background: #fff; font-family: 'Microsoft JhengHei', sans-serif; page-break-inside: avoid; width: 100%; box-sizing: border-box; position: relative;">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; text-align: center;">
                    ${escapeHtml(studentData.name)} 的任務單
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
                btns += `<button class="att-btn ${r.status===o.id?'active':''}" data-status="${o.id}" onclick="window.setAttStatus('${date}', ${i}, ${o.id})">${escapeHtml(o.l)}</button>`;
            });
            
            let noteHtml = '';
            if (r.note) {
                let isTime = /^\d{2}:\d{2}$/.test(r.note);
                let noteColor = isTime ? '#1d4ed8' : 'var(--danger)';
                let noteBg = isTime ? '#dbeafe' : '#fee2e2';
                let noteBorder = isTime ? '#bfdbfe' : '#fecaca';
                let noteIcon = isTime ? 'bi-clock' : 'bi-pencil';
                noteHtml = `<span class="att-note" style="display:inline-block; background:${noteBg}; color:${noteColor}; border-color:${noteBorder}; padding: 4px 8px; border-radius: 12px;"><i class="bi ${noteIcon}"></i> ${escapeHtml(r.note)}</span>`;
            }

            div.innerHTML = `<div class="att-no">${s.no}</div><div class="att-name">${escapeHtml(s.name)} ${noteHtml}</div><div style="display:flex; flex-wrap:wrap; gap:4px;">${btns}</div>`;
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
            d.innerHTML += `<div class="roster-item"><input type="number" value="${s.no}" class="roster-no-input"><input value="${escapeHtml(s.name)}" class="roster-name-input"><input type="number" value="${s.group || 1}" class="roster-group-input" style="width:60px; padding:8px;" title="組別" placeholder="組別"></div>`;
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
                    <input value="${escapeHtml(t)}" class="teacher-name-input" style="flex:1; padding:8px;">
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
                        ${escapeHtml(item)}
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
        let html = `<h4>${escapeHtml(a.title)}</h4><ul>`;
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
                if(debts.length) debts.forEach(d => list.innerHTML += `<span style="background:#fee2e2;color:#b91c1c;padding:6px 12px;border-radius:20px;font-weight:bold;margin-right:8px;">${escapeHtml(d.name)} (${d.c})</span>`);
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

    ['btnNavHome','btnNavDashboard','btnNavStudentStatus','btnNavStats'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('click', (e) => {
            const map = {
                'btnNavHome': 'view-home',
                'btnNavDashboard': 'view-dashboard',
                'btnNavStudentStatus': 'view-student-status',
                'btnNavStats': 'view-stats'
            };
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
            sel.innerHTML = ts.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('') + '<option value="custom">自行輸入...</option>'; 
            document.getElementById('ipTeacherCustom').style.display = sel.value === 'custom' ? 'block' : 'none'; 
        }
        
        const fil = document.getElementById('teacherFilter');
        if(fil) { 
            fil.innerHTML = '<option value="all">所有公會長</option>' + ts.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join(''); 
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
            div.innerHTML = `<div class="quest-config-header"><span class="quest-config-title">${escapeHtml(sub)}</span><button class="btn sm warn btn-del-subj" data-sub="${escapeHtml(sub)}"><i class="bi bi-trash"></i> 移除</button></div><div class="quest-tags">${tempQuestSettings[sub].map((t, i) => `<span class="quest-tag">${escapeHtml(t)} <i class="bi bi-x-circle-fill btn-del-task" data-sub="${escapeHtml(sub)}" data-idx="${i}"></i></span>`).join('')}</div><div class="quest-add-row"><input placeholder="輸入新任務名稱..." id="newT_${escapeHtml(sub)}" style="flex:1; font-size:13px; padding:6px;"><button class="btn sm btn-add-task" data-sub="${escapeHtml(sub)}"><i class="bi bi-plus-lg"></i> 新增</button></div>`;
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
                <span style="flex:1; font-weight:bold;">${escapeHtml(item.l)}</span>
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
        data.roster.forEach((s, i) => { const chk = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.includes(i); const l = document.createElement('label'); l.className = 'assign-student-item'; l.innerHTML = `<input type="checkbox" data-idx="${i}" ${chk?'checked':''}> ${s.no}.${escapeHtml(s.name)}`; c.appendChild(l); });
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
                    <span style="color:var(--primary); margin-right:2px;">${s.no}.</span>${escapeHtml(s.name)}
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

    const synthBtn = document.getElementById('btnSynthesizePetFromDetail');
    if (synthBtn) {
        synthBtn.style.display = ownedMap[pet.id] >= 3 ? 'inline-flex' : 'none';
    }

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


// ==========================================
// 🔄 A. 圖鑑內「誤抽退還 (+10金幣)」與「三合一神秘轉生」
// ==========================================
window.refundPetFromDetail = function() {
    if (currentSummonStudentIdx === null || !currentDetailPetId) return;
    const student = data.roster[currentSummonStudentIdx];
    const pet = gachaPool.find(p => String(p.id) === String(currentDetailPetId));
    if (!student || !pet || !Array.isArray(student.pets)) return;

    if (!confirm(`確定要移除【${student.name}】的 1 隻「${pet.name}」，並退還 ${SUMMON_COST} 枚金幣嗎？`)) return;

    // 從學生 pets 陣列移除一隻該寵物 (相容 'p1' 或 1 格式)
    const targetIdx = student.pets.findIndex(pid => {
        const norm = String(pid).startsWith('p') ? parseInt(String(pid).slice(1)) : pid;
        return String(norm) === String(pet.id);
    });
    if (targetIdx === -1) return;
    student.pets.splice(targetIdx, 1);

    // 若代表夥伴被退光了，自動切換成剩餘最後一隻或 null
    const ownedMapAfter = getStudentOwnedMap(student);
    if (!ownedMapAfter[pet.id] && String(student.activePet) === String(pet.id)) {
        if (student.pets.length > 0) {
            const lastRaw = student.pets[student.pets.length - 1];
            student.activePet = String(lastRaw).startsWith('p') ? parseInt(String(lastRaw).slice(1)) : lastRaw;
        } else {
            student.activePet = null;
        }
    }

    window.changeCoin(currentSummonStudentIdx, SUMMON_COST, `退還扭蛋 [${pet.name}]`, true);
    playCoinSound();
    showToast(`🔄 已移除 1 隻【${pet.name}】，並退還 ${student.name} ${SUMMON_COST} 枚金幣！`);

    triggerAutoSave();
    updateGachaHeaderAndStats();
    renderGachaBookGrid();
    if (ownedMapAfter[pet.id] > 0) {
        window.openGachaPetDetail(pet.id);
    } else {
        window.closeGachaPetDetail();
    }
    renderAll();
};

window.synthesizeDuplicatePet = function() {
    if (currentSummonStudentIdx === null || !currentDetailPetId) return;
    const student = data.roster[currentSummonStudentIdx];
    const pet = gachaPool.find(p => String(p.id) === String(currentDetailPetId));
    if (!student || !pet) return;

    const ownedMap = getStudentOwnedMap(student);
    if ((ownedMap[pet.id] || 0) < 3) {
        showToast('⚠️ 需要收集滿 3 隻相同夥伴才能進行三合一神秘轉生喔！');
        return;
    }

    if (!confirm(`✨ 確定要消耗 3 隻【${pet.name}】，進行「三合一神秘轉生」嗎？
(保證獲得一隻尚未解鎖或稀有/夢幻級萌寵！)`)) return;

    // 移除 3 隻該寵物
    let removed = 0;
    student.pets = (student.pets || []).filter(pid => {
        if (removed >= 3) return true;
        const norm = String(pid).startsWith('p') ? parseInt(String(pid).slice(1)) : pid;
        if (String(norm) === String(pet.id)) {
            removed++;
            return false;
        }
        return true;
    });

    // 優先從「尚未擁有」且稀有度 >= 2 的池子挑選，若全齊則從稀有/夢幻池挑選
    const afterMap = getStudentOwnedMap(student);
    let unownedRare = gachaPool.filter(p => !afterMap[p.id] && p.rarity >= 2);
    let unownedAny = gachaPool.filter(p => !afterMap[p.id]);
    let rarePool = gachaPool.filter(p => p.rarity >= 2 && String(p.id) !== String(pet.id));
    const finalPool = unownedRare.length > 0 ? unownedRare : (unownedAny.length > 0 ? unownedAny : rarePool);
    const newPet = finalPool[Math.floor(Math.random() * finalPool.length)] || gachaPool[0];

    student.pets.push(newPet.id);
    student.activePet = newPet.id;

    logAction(currentSummonStudentIdx, 0, '轉生', `3隻[${pet.name}]轉生為[${newPet.name}]`);
    playStarSound();
    playPetCrySound(newPet.kind);
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 } });
    }
    showToast(`🌟 轉生大成功！${student.name} 獲得了【${newPet.name}】！`);

    triggerAutoSave();
    updateGachaHeaderAndStats();
    renderGachaBookGrid();
    window.openGachaPetDetail(newPet.id);
    renderAll();
};

// ==========================================
// ⚡ D. 每日例行作業：聯絡簿 (自動帶入日期 + 頁碼)
// ==========================================
function formatShortDateMD(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    }
    return dateStr;
}

window.updateContactBookPreview = function() {
    const dateVal = document.getElementById('ipDate')?.value || getTaipeiDateString();
    const md = formatShortDateMD(dateVal);
    const pageVal = (document.getElementById('ipContactBookPage')?.value || '').trim();
    const previewEl = document.getElementById('routineContactDatePreview');
    const titleStr = pageVal ? `${md} 聯絡簿 P.${pageVal}` : `${md} 聯絡簿`;
    if (previewEl) previewEl.innerText = titleStr;
    return titleStr;
};

window.StepContactBookPage = function(delta) {
    const ip = document.getElementById('ipContactBookPage');
    if (!ip) return;
    let cur = parseInt(ip.value);
    if (isNaN(cur)) {
        cur = parseInt(localStorage.getItem('hwLastContactPage') || '1');
    } else {
        cur = Math.max(1, cur + delta);
    }
    ip.value = cur;
    localStorage.setItem('hwLastContactPage', String(cur));
    const titleStr = window.updateContactBookPreview();
    const ipTitle = document.getElementById('ipTitle');
    if (ipTitle) ipTitle.value = titleStr;
};

window.quickCreateContactBookQuest = function() {
    let t = document.getElementById('ipTeacherSelect')?.value;
    if (t === 'custom') t = document.getElementById('ipTeacherCustom')?.value.trim();
    if (!t) t = (data.teachers && data.teachers[0]) ? data.teachers[0] : '公會長';

    const d = document.getElementById('ipDate')?.value || getTaipeiDateString();
    const pageIp = document.getElementById('ipContactBookPage');
    const pageVal = pageIp ? pageIp.value.trim() : '';
    if (pageVal) {
        localStorage.setItem('hwLastContactPage', pageVal);
    }
    const titleStr = window.updateContactBookPreview();

    if (!data.teachers.includes(t)) data.teachers.push(t);
    const isAll = !newAssignmentAssignedIndices.length || newAssignmentAssignedIndices.length === data.roster.length;

    const newQuest = {
        id: Date.now(),
        title: titleStr,
        teacher: t,
        subject: '聯絡簿',
        date: d,
        assignedIndices: isAll ? 'all' : [...newAssignmentAssignedIndices],
        statuses: Array(data.roster.length).fill(0),
        cheered: false
    };
    data.assignments.push(newQuest);
    currentAssignmentId = newQuest.id;

    triggerAutoSave();
    renderAll();
    document.getElementById('panelNewQuest').classList.remove('show');
    playSuccessSound();
    showToast(`📓 已一鍵發布【${titleStr}】！`);
};

// 綁定打開「發布新委託」視窗時，自動預填上次聯絡簿頁碼 +1 與今日日期預覽
document.getElementById('btnOpenNewQuestWindowSidebar')?.addEventListener('click', () => {
    const lastPage = localStorage.getItem('hwLastContactPage');
    const pageIp = document.getElementById('ipContactBookPage');
    if (pageIp && lastPage && !pageIp.value) {
        const nextP = parseInt(lastPage);
        if (!isNaN(nextP)) pageIp.value = nextP + 1;
    }
    window.updateContactBookPreview();
});
document.getElementById('ipDate')?.addEventListener('change', () => {
    window.updateContactBookPreview();
});

// ==========================================
// 🏰 獨立登記首頁：全冠王萌寵漫步牧場 (含日夜時段 + 待清休息帳篷) & 極速登記台引擎
// ==========================================
let meadowActors = {};
let meadowAnimFrameId = null;
let meadowLastTime = 0;
let meadowBall = null;
let meadowTimeOverride = 'auto'; // 'auto' | 'morning' | 'noon' | 'evening'
// 🐾 草地動畫效能設定
const MEADOW_ACTIVE_FRAME_MS = 1000 / 30;  // 活動時 30fps（走路只有 4 格，肉眼看不出差別，但省一半運算）
const MEADOW_IDLE_FRAME_MS = 500;          // 午休／減少動態時：每 0.5 秒檢查一次即可
let meadowMaxXCache = 450;
let meadowMeasuredAt = -9999;
const meadowReduceMotionMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
let isSelfCheckinLock = false;   // B. 學生自助繳交鎖 (只准 灰0 <-> 黃1)
let isHomeOnlyUnfinished = false; // 只看未完成座號篩選

function getEffectiveMeadowTimePeriod() {
    if (meadowTimeOverride !== 'auto') return meadowTimeOverride;
    const nowStr = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
    const [hh, mm] = nowStr.split(':').map(Number);
    const totalMin = hh * 60 + (mm || 0);
    // 12:00 ~ 13:30 午休時間：全員趴下睡午覺💤
    if (totalMin >= 12 * 60 && totalMin <= 13 * 60 + 30) return 'noon';
    // 15:30 ~ 18:30 放學夕陽時段
    if (totalMin >= 15 * 60 + 30 && totalMin < 18 * 60 + 30) return 'evening';
    // 18:30 ~ 06:00 夜間星光時段
    if (totalMin >= 18 * 60 + 30 || totalMin < 6 * 60) return 'night';
    return 'morning';
}

window.cycleMeadowTimeMode = function() {
    const order = ['auto', 'morning', 'noon', 'evening', 'night'];
    const nextIdx = (order.indexOf(meadowTimeOverride) + 1) % order.length;
    meadowTimeOverride = order[nextIdx];
    applyMeadowTimeTheme();
    syncMeadowActors();
    const labelMap = {
        auto: '🕒 自動時段跟隨',
        morning: '☀️ 晨間活力草地',
        noon: '💤 午休靜音睡覺模式',
        evening: '🌇 放學夕陽晚霞',
        night: '🌙 夜間星光營地'
    };
    showToast(`切換草原時段：${labelMap[meadowTimeOverride]}`);
};

function applyMeadowTimeTheme() {
    const stage = document.getElementById('meadowStage');
    const sky = document.getElementById('meadowSkyDecor');
    const badge = document.getElementById('meadowTimeBadge');
    if (!stage) return;

    const period = getEffectiveMeadowTimePeriod();
    stage.classList.remove('time-morning', 'time-noon', 'time-evening', 'time-night');
    stage.classList.add(`time-${period}`);

    const autoSuffix = meadowTimeOverride === 'auto' ? ' (自動)' : ' (手動)';
    if (period === 'noon') {
        if (sky) sky.innerHTML = '<span>🌤️</span><span>💤</span><span>🍃</span><span>💤</span>';
        if (badge) badge.innerText = `💤 午休睡覺時段${autoSuffix}`;
    } else if (period === 'evening') {
        if (sky) sky.innerHTML = '<span>🌇</span><span>🐦</span><span>☁️</span><span>🍂</span>';
        if (badge) badge.innerText = `🌇 放學夕陽草地${autoSuffix}`;
    } else if (period === 'night') {
        if (sky) sky.innerHTML = '<span>🌙</span><span>✨</span><span>⭐</span><span>🦉</span>';
        if (badge) badge.innerText = `🌙 星光營地${autoSuffix}`;
    } else {
        if (sky) sky.innerHTML = '<span>☁️</span><span>⛅</span><span>☁️</span><span>🦋</span>';
        if (badge) badge.innerText = `☀️ 晨間活力草地${autoSuffix}`;
    }
}

function isStudentAllCleared(sidx) {
    if (!data || !data.roster) return false;
    const activeAssigns = (data.assignments || []).filter(a => !a.archived);
    const todayStr = getTaipeiDateString();
    let skipTodayRedo = false;
    try { skipTodayRedo = !!hideTodayRedo; } catch (e) { skipTodayRedo = false; }

    for (let a of activeAssigns) {
        const indices = a.assignedIndices || 'all';
        if (indices === 'all' || (Array.isArray(indices) && indices.includes(sidx))) {
            const st = (a.statuses || [])[sidx] || 0;
            if (st === 0 || st === 2) {
                if (skipTodayRedo && st === 2 && a.date === todayStr) continue;
                return false;
            }
        }
    }
    return true;
}

function getStudentPartnerPetObj(student, fallbackIdx = 0) {
    const rawPid = student.activePet || (student.pets && student.pets.length ? student.pets[student.pets.length - 1] : null);
    const pid = rawPid && String(rawPid).startsWith('p') ? parseInt(String(rawPid).slice(1)) : rawPid;
    if (pid) {
        const found = gachaPool.find(p => String(p.id) === String(pid));
        if (found) return found;
    }
    return gachaPool[fallbackIdx % 4] || gachaPool[0];
}

function syncMeadowActors() {
    applyMeadowTimeTheme();
    const stage = document.getElementById('meadowStage');
    const container = document.getElementById('meadowActorsContainer');
    const emptyHint = document.getElementById('meadowEmptyHint');
    const badge = document.getElementById('meadowCrownCountBadge');
    const restPen = document.getElementById('meadowRestPen');
    const restList = document.getElementById('meadowRestList');
    const restCount = document.getElementById('meadowRestCount');
    if (!stage || !container) return;

    const penWidth = restPen && restPen.offsetWidth ? restPen.offsetWidth + 16 : 255;
    const stageWidth = Math.max(220, stage.clientWidth - penWidth - 72);
    const clearedIndices = [];
    const restingIndices = [];

    (data.roster || []).forEach((s, idx) => {
        if (isStudentAllCleared(idx)) {
            clearedIndices.push(idx);
        } else {
            restingIndices.push(idx);
        }
    });

    if (badge) {
        badge.innerText = `👑 ${clearedIndices.length} 位全冠王夥伴散步中`;
    }
    if (emptyHint) {
        emptyHint.style.display = clearedIndices.length === 0 ? 'flex' : 'none';
    }

    // 渲染右側「⛺ 待清休息帳篷」裡睡覺冒泡泡的寵物
    if (restCount) restCount.innerText = `(${restingIndices.length})`;
    if (restPen) {
        restPen.style.display = restingIndices.length === 0 ? 'none' : 'flex';
    }
    if (restList) {
        restList.innerHTML = restingIndices.map(sidx => {
            const st = data.roster[sidx];
            const pet = getStudentPartnerPetObj(st, sidx);
            return `<div class="meadow-rest-item" title="${st.no}.${escapeHtml(st.name)} 還有委託待完成，完成後【${pet.name}】就能跳進草地奔跑！" onclick="window.showRestPetHint(${sidx})">
                <img src="${pet.sit}" class="pixel-pet" alt="">
                <span>${st.no}.${escapeHtml(st.name)}💤</span>
            </div>`;
        }).join('');
    }

    // 移除不再是全冠王的角色
    Object.keys(meadowActors).forEach(k => {
        const numKey = parseInt(k);
        if (!clearedIndices.includes(numKey)) {
            if (meadowActors[k].el) meadowActors[k].el.remove();
            delete meadowActors[k];
        }
    });

    const isNoonNap = getEffectiveMeadowTimePeriod() === 'noon';

    // 新增或更新全冠王角色
    clearedIndices.forEach((sidx, orderIdx) => {
        const student = data.roster[sidx];
        const pet = getStudentPartnerPetObj(student, sidx);
        const hasOwnPet = student.activePet || (student.pets && student.pets.length > 0);

        if (!meadowActors[sidx]) {
            const el = document.createElement('div');
            el.className = 'meadow-pet-actor';
            const spriteEl = document.createElement('div');
            spriteEl.className = 'meadow-pet-sprite';
            const labelEl = document.createElement('div');
            labelEl.className = 'meadow-pet-label';

            el.appendChild(labelEl);
            el.appendChild(spriteEl);
            el.onclick = (e) => {
                e.stopPropagation();
                if (getEffectiveMeadowTimePeriod() === 'noon') {
                    showToast(`🤫 噓～現在是午休時間，${student.name} 的【${pet.name}】正在睡午覺💤`);
                    return;
                }
                window.cheerMeadowActor(sidx, true);
            };
            container.appendChild(el);

            const startX = Math.min(stageWidth - 10, Math.max(10, ((orderIdx * 83 + 25) % stageWidth)));
            meadowActors[sidx] = {
                sidx,
                no: student.no,
                name: student.name,
                pet,
                hasOwnPet,
                x: startX,
                dir: orderIdx % 2 === 0 ? 1 : -1,
                mode: isNoonNap ? 'sit' : (Math.random() < 0.65 ? 'walk' : 'sit'),
                timer: 1.5 + Math.random() * 3,
                frameTimer: 0,
                frameIdx: Math.floor(Math.random() * 4),
                jumpY: 0,
                el,
                spriteEl,
                labelEl
            };
        } else {
            meadowActors[sidx].no = student.no;
            meadowActors[sidx].name = student.name;
            meadowActors[sidx].pet = pet;
            meadowActors[sidx].hasOwnPet = hasOwnPet;
            if (isNoonNap) meadowActors[sidx].mode = 'sit';
        }

        const actor = meadowActors[sidx];
        actor.labelEl.innerHTML = `👑 ${escapeHtml(actor.no)}.${escapeHtml(actor.name)}${isNoonNap ? ' 💤' : ''}`;
        actor.el.title = `${actor.no}.${actor.name} 的夥伴：${pet.name}${hasOwnPet ? '' : ' (見習夥伴)'}`;
        updateActorSpriteVisual(actor);
    });
}

window.showRestPetHint = function(sidx) {
    const s = data.roster[sidx];
    if (!s) return;
    const pet = getStudentPartnerPetObj(s, sidx);
    showToast(`⛺ ${s.no}.${s.name} 的【${pet.name}】正在帳篷休息💤 只要把未交/待訂正委託完成就會衝上草地囉！`);
};

function updateActorSpriteVisual(actor) {
    if (!actor || !actor.spriteEl || !actor.pet) return;
    const pet = actor.pet;
    const isMoving = (actor.mode === 'walk' || actor.mode === 'chase') && !!pet.walk;

    // 1) 決定這一幀要用哪張圖、第幾格
    let sheet, frames, f;
    if (isMoving) { sheet = pet.walk; frames = 4; f = actor.frameIdx % 4; }
    else if (actor.mode === 'scratch' && pet.scratch) { sheet = pet.scratch; frames = 2; f = actor.frameIdx % 2; }
    else { sheet = pet.sit; frames = 1; f = 0; }

    // 2) 只有「圖片 / 格數 / 影格」真的改變時才寫樣式（避免每幀都重解析 base64 圖片）
    const style = actor.spriteEl.style;
    if (actor._sheet !== sheet) {
        style.backgroundImage = `url("${sheet}")`;
        style.backgroundSize = frames === 1 ? '100% 100%' : `${frames * 100}% 100%`;
        actor._sheet = sheet;
        actor._f = -1;
    }
    if (actor._f !== f) {
        style.backgroundPosition = frames === 1 ? '0% 0%' : `${(f / (frames - 1)) * 100}% 0%`;
        actor._f = f;
    }

    // 3) 位置：取整後沒變就不寫
    const bobY = isMoving && (actor.frameIdx % 2 === 0) ? -2 : 0;
    const tx = Math.round(actor.x);
    const ty = Math.round(bobY + (actor.jumpY || 0));
    if (actor._tx !== tx || actor._ty !== ty) {
        actor.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        actor._tx = tx;
        actor._ty = ty;
    }

    // 4) 面向：只有轉向時才寫
    if (actor._dir !== actor.dir) {
        style.transform = `scaleX(${actor.dir === 1 ? -1 : 1})`;
        actor._dir = actor.dir;
    }
}

// 量一次舞台寬度並快取（避免每幀強制重排 layout）
function measureMeadowStage() {
    const stage = document.getElementById('meadowStage');
    const restPen = document.getElementById('meadowRestPen');
    const penW = (restPen && restPen.style.display !== 'none') ? (restPen.offsetWidth + 16) : 0;
    meadowMaxXCache = stage ? Math.max(80, stage.clientWidth - penW - 74) : 450;
}
window.addEventListener('resize', () => { meadowMeasuredAt = -9999; });

function stepMeadowLoop(timestamp) {
    const homeView = document.getElementById('view-home');
    if (!homeView || !homeView.classList.contains('show')) {
        meadowAnimFrameId = null;
        return;
    }

    const isNoonNap = getEffectiveMeadowTimePeriod() === 'noon';
    const reduceMotion = !!(meadowReduceMotionMQ && meadowReduceMotionMQ.matches);
    const forceSit = isNoonNap || reduceMotion;

    // 降頻：活動時 30fps；午休或「減少動態」時 2fps（只負責偵測時段何時結束）
    const minMs = forceSit ? MEADOW_IDLE_FRAME_MS : MEADOW_ACTIVE_FRAME_MS;
    if (!meadowLastTime) meadowLastTime = timestamp;
    const elapsed = timestamp - meadowLastTime;
    if (elapsed < minMs - 2) {
        meadowAnimFrameId = requestAnimationFrame(stepMeadowLoop);
        return;
    }
    const dt = Math.min(0.08, elapsed / 1000);
    meadowLastTime = timestamp;

    if (timestamp - meadowMeasuredAt > 500) {
        measureMeadowStage();
        meadowMeasuredAt = timestamp;
    }
    const maxX = meadowMaxXCache;

    Object.values(meadowActors).forEach(actor => {
        if (forceSit) {
            if (actor.mode !== 'sit') { actor.mode = 'sit'; actor.frameIdx = 0; }
            updateActorSpriteVisual(actor);   // 有快取，靜止時幾乎不碰 DOM
            return;
        }

        actor.timer -= dt;
        actor.frameTimer += dt;

        if (meadowBall && actor.mode !== 'scratch') {
            actor.mode = 'chase';
        }

        if (actor.mode === 'chase' && meadowBall) {
            const targetBallX = Math.min(maxX, meadowBall.x);
            const dx = targetBallX - actor.x;
            if (Math.abs(dx) > 14) {
                actor.dir = dx > 0 ? 1 : -1;
                actor.x += actor.dir * 82 * dt;
                if (actor.frameTimer >= 0.09) {
                    actor.frameTimer = 0;
                    actor.frameIdx = (actor.frameIdx + 1) % 4;
                }
            } else {
                actor.mode = 'scratch';
                actor.timer = 1.6;
            }
        } else if (actor.mode === 'walk') {
            actor.x += actor.dir * 34 * dt;
            if (actor.x <= 8) {
                actor.x = 8;
                actor.dir = 1;
            } else if (actor.x >= maxX) {
                actor.x = maxX;
                actor.dir = -1;
            }
            if (actor.frameTimer >= 0.16) {
                actor.frameTimer = 0;
                actor.frameIdx = (actor.frameIdx + 1) % 4;
            }
            if (actor.timer <= 0) {
                const r = Math.random();
                actor.mode = r < 0.55 ? 'sit' : (r < 0.82 ? 'scratch' : 'walk');
                if (actor.mode === 'walk' && Math.random() < 0.4) actor.dir *= -1;
                actor.timer = 1.8 + Math.random() * 3.2;
                actor.frameIdx = 0;
            }
        } else if (actor.mode === 'scratch') {
            if (actor.frameTimer >= 0.15) {
                actor.frameTimer = 0;
                actor.frameIdx = (actor.frameIdx + 1) % 2;
            }
            if (actor.timer <= 0) {
                actor.mode = Math.random() < 0.65 ? 'walk' : 'sit';
                actor.dir = Math.random() < 0.5 ? 1 : -1;
                actor.timer = 2.0 + Math.random() * 3.5;
            }
        } else {
            if (actor.timer <= 0) {
                const r = Math.random();
                actor.mode = r < 0.65 ? 'walk' : 'scratch';
                actor.dir = Math.random() < 0.5 ? 1 : -1;
                actor.timer = 2.2 + Math.random() * 3.8;
                actor.frameIdx = 0;
            }
        }

        updateActorSpriteVisual(actor);
    });

    meadowAnimFrameId = requestAnimationFrame(stepMeadowLoop);
}

window.startMeadowLoop = function() {
    if (!meadowAnimFrameId) {
        meadowLastTime = 0;
        meadowAnimFrameId = requestAnimationFrame(stepMeadowLoop);
    }
};

window.stopMeadowLoop = function() {
    if (meadowAnimFrameId) {
        cancelAnimationFrame(meadowAnimFrameId);
        meadowAnimFrameId = null;
    }
};

window.cheerMeadowActor = function(sidx, playSound = true) {
    const actor = meadowActors[sidx];
    if (!actor || !actor.el) return;

    if (playSound && actor.pet) {
        playPetCrySound(actor.pet.kind);
    }

    actor.mode = 'scratch';
    actor.timer = 1.8;

    let start = performance.now();
    function jumpStep(now) {
        const p = Math.min(1, (now - start) / 420);
        actor.jumpY = -Math.sin(p * Math.PI) * 18;
        updateActorSpriteVisual(actor);
        if (p < 1) requestAnimationFrame(jumpStep);
        else actor.jumpY = 0;
    }
    requestAnimationFrame(jumpStep);

    const cheerEl = document.createElement('div');
    cheerEl.className = 'meadow-pet-cheer';
    const icons = ['💖', '✨', '🎵', '🌟', '🐾'];
    cheerEl.innerText = icons[Math.floor(Math.random() * icons.length)];
    actor.el.appendChild(cheerEl);
    setTimeout(() => cheerEl.remove(), 950);
};

window.throwMeadowBall = function(targetX = null) {
    if (getEffectiveMeadowTimePeriod() === 'noon') {
        showToast('🤫 午休時間小動物們正在睡覺，下午再丟球陪牠們玩吧！');
        return;
    }
    const stage = document.getElementById('meadowStage');
    const restPen = document.getElementById('meadowRestPen');
    if (!stage) return;
    if (meadowBall && meadowBall.el) {
        clearTimeout(meadowBall.timeoutId);
        meadowBall.el.remove();
    }

    const penW = (restPen && restPen.style.display !== 'none') ? (restPen.offsetWidth + 20) : 0;
    const stageW = Math.max(120, stage.clientWidth - penW);
    const x = targetX !== null ? Math.max(24, Math.min(stageW - 24, targetX)) : Math.floor(40 + Math.random() * Math.max(60, stageW - 80));
    const ballEl = document.createElement('div');
    ballEl.className = 'meadow-toy-ball';
    ballEl.style.left = `${x}px`;
    ballEl.style.fontSize = '24px';
    ballEl.innerText = Math.random() < 0.5 ? '🧶' : '🎾';
    stage.appendChild(ballEl);

    ballEl.animate?.([
        { transform: 'translate(-50%, -95px) rotate(0deg)' },
        { transform: 'translate(-50%, 0px) rotate(180deg)', offset: 0.45 },
        { transform: 'translate(-50%, -26px) rotate(260deg)', offset: 0.68 },
        { transform: 'translate(-50%, 0px) rotate(360deg)' }
    ], { duration: 650, easing: 'ease-out' });

    playTickSound();
    const timeoutId = setTimeout(() => {
        ballEl.remove();
        if (meadowBall && meadowBall.el === ballEl) meadowBall = null;
    }, 3200);

    meadowBall = { x: x - 28, el: ballEl, timeoutId };
    Object.values(meadowActors).forEach(a => { a.mode = 'chase'; });
};

window.handleMeadowStageClick = function(e) {
    if (e.target.closest('.meadow-pet-actor') || e.target.closest('.meadow-rest-pen')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    window.throwMeadowBall(e.clientX - rect.left);
};

// ==========================================
// 🔒 B. 學生自助繳交鎖 & 只看未完成座號篩選
// ==========================================
window.toggleSelfCheckinLock = function() {
    isSelfCheckinLock = !isSelfCheckinLock;
    const btn = document.getElementById('btnToggleSelfCheckinLock');
    if (btn) {
        btn.classList.toggle('student-lock-on', isSelfCheckinLock);
        btn.innerHTML = isSelfCheckinLock
            ? '<i class="bi bi-lock-fill"></i> 🙋‍♂️ 學生自助繳交模式 (只准灰↔黃，防誤觸綠燈)'
            : '<i class="bi bi-person-vcard"></i> 👑 導師批改模式 (點我切換學生自助鎖)';
    }
    showToast(isSelfCheckinLock
        ? '🔒 已開啟【學生自助繳交鎖】：點擊座號只會在「未交(灰) ↔ 已回報(黃)」間切換，防止學生誤點成綠燈！'
        : '👑 已切換回【導師完整批改模式】：可自由循環 灰→黃→橘→綠 四種狀態！');
};

window.toggleHomeOnlyUnfinished = function() {
    isHomeOnlyUnfinished = !isHomeOnlyUnfinished;
    const btn = document.getElementById('btnToggleHomeUnfinished');
    if (btn) {
        btn.classList.toggle('active', isHomeOnlyUnfinished);
        btn.innerHTML = isHomeOnlyUnfinished
            ? '<i class="bi bi-funnel-fill"></i> 顯示全部座號'
            : '<i class="bi bi-funnel-fill"></i> 只看未完成';
    }
    renderHomeView();
};

function renderHomeView() {
    syncMeadowActors();
    window.startMeadowLoop();

    const pillsCon = document.getElementById('homeQuestPills');
    const gridCon = document.getElementById('homeSeatGrid');
    const subBar = document.getElementById('homeQuestSubBar');
    const groupBtnsCon = document.getElementById('homeGroupQuickBtns');
    const progText = document.getElementById('homeQuestProgressText');
    if (!pillsCon || !gridCon) return;

    const activeAssigns = (data.assignments || []).filter(a => !a.archived).sort((a, b) => a.date < b.date ? 1 : -1);

    if (activeAssigns.length === 0) {
        pillsCon.innerHTML = '';
        if (subBar) subBar.style.display = 'none';
        gridCon.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:32px; color:var(--muted); font-weight:bold;">
            📜 目前尚無進行中的委託，請點擊右上角「發布新委託」開始今日任務！
        </div>`;
        return;
    }

    if (subBar) subBar.style.display = 'flex';
    if (!currentAssignmentId || !activeAssigns.some(a => a.id == currentAssignmentId)) {
        currentAssignmentId = activeAssigns[0].id;
    }

    const currentA = activeAssigns.find(a => a.id == currentAssignmentId) || activeAssigns[0];

    pillsCon.innerHTML = activeAssigns.map(a => {
        const indices = a.assignedIndices || 'all';
        let missing = 0;
        let done = 0;
        let total = 0;
        data.roster.forEach((_, i) => {
            if (indices === 'all' || indices.includes(i)) {
                total++;
                const st = (a.statuses || [])[i] || 0;
                if (st === 0) missing++;
                if (st === 3) done++;
            }
        });
        const isActive = a.id == currentA.id;
        const badgeHtml = missing > 0
            ? `<span style="background:#ffe4e6; color:#be123c; padding:1px 6px; border-radius:999px; font-size:11px;">缺${missing}</span>`
            : `<span style="background:#dcfce7; color:#166534; padding:1px 6px; border-radius:999px; font-size:11px;">齊 (${done}/${total})</span>`;

        return `<button class="home-quest-pill ${isActive ? 'active' : ''}" onclick="window.selectHomeQuest(${a.id})">
            <span>${a.subject ? `[${escapeHtml(a.subject)}] ` : ''}${escapeHtml(a.title)}</span>
            ${badgeHtml}
        </button>`;
    }).join('');

    const indices = currentA.assignedIndices || 'all';
    const totalAssigned = indices === 'all' ? data.roster.length : indices.length;
    const completedCount = (currentA.statuses || []).filter((s, i) => s === 3 && (indices === 'all' || indices.includes(i))).length;
    const reportedCount = (currentA.statuses || []).filter((s, i) => (s === 1 || s === 3) && (indices === 'all' || indices.includes(i))).length;
    if (progText) {
        progText.innerHTML = `📅 ${currentA.date} ｜ 已繳交：<b>${reportedCount}/${totalAssigned}</b> ｜ 討伐成功(綠燈)：<b style="color:var(--success);">${completedCount}/${totalAssigned}</b>`;
    }

    if (groupBtnsCon) {
        const groups = [...new Set(data.roster.map(s => s.group || 1))].sort((x, y) => x - y);
        groupBtnsCon.innerHTML = `<span style="font-size:12px; font-weight:900; color:var(--primary);"><i class="bi bi-people-fill"></i> 小組回報：</span>` +
            groups.map(g => `<button class="btn sm ghost" style="padding:3px 10px; font-size:12px;" onclick="window.quickGroupSubmitHome(${currentA.id}, ${g})">第 ${g} 組交</button>`).join('');
    }

    const markYellowBtn = document.getElementById('btnHomeMarkAllYellow');
    if (markYellowBtn) {
        markYellowBtn.onclick = () => {
            if (confirm(`確認將【${currentA.title}】全員設為「已回報」？`)) {
                updateAllStatus(1);
                renderHomeView();
            }
        };
    }

    gridCon.innerHTML = data.roster.map((s, i) => {
        const isAssigned = (indices === 'all') || (indices && indices.includes(i));
        const st = (currentA.statuses || [])[i] || 0;
        const allCleared = isStudentAllCleared(i);
        const partnerPet = getStudentPartnerPetObj(s, i);
        const hasPet = s.activePet || (s.pets && s.pets.length > 0);
        const isDimmed = isHomeOnlyUnfinished && (st === 1 || st === 3);

        let oldDebts = [];
        if (isAssigned) {
            activeAssigns.forEach(otherA => {
                if (otherA.id !== currentA.id) {
                    const otherIdx = otherA.assignedIndices || 'all';
                    if (otherIdx === 'all' || otherIdx.includes(i)) {
                        const ost = (otherA.statuses || [])[i] || 0;
                        if (ost === 0 || ost === 2) oldDebts.push({ id: otherA.id, title: otherA.title, st: ost });
                    }
                }
            });
        }

        const debtBadge = (oldDebts.length > 0 && !isSelfCheckinLock)
            ? `<div class="debt-badge" title="還有 ${oldDebts.length} 項其他未完成委託" onclick="window.openQuickDebtMenu(event, ${i}, '${encodeURIComponent(JSON.stringify(oldDebts))}')">${oldDebts.length}</div>`
            : '';

        return `<div class="home-seat-card ${allCleared ? 'cleared-crown' : ''} ${!isAssigned ? 'not-assigned' : ''} ${isDimmed ? 'dimmed-done' : ''}" onclick="window.handleHomeSeatClick(${currentA.id}, ${i})">
            <div style="position:relative; flex-shrink:0;">
                ${debtBadge}
                <div class="seat s${st}" style="width:48px; height:48px; font-size:18px;">${s.no}</div>
            </div>
            <div style="flex:1; min-width:0;">
                <div style="font-weight:900; font-size:14px; display:flex; align-items:center; gap:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    <span>${escapeHtml(s.name)}</span>
                    ${allCleared ? '<span title="討伐全冠王！夥伴正在草地散步">👑</span>' : ''}
                </div>
                <div style="font-size:11px; color:var(--muted); font-weight:bold; display:flex; align-items:center; gap:4px; margin-top:2px;">
                    ${(hasPet || allCleared) && partnerPet ? `<img src="${partnerPet.sit}" class="pixel-pet" style="width:18px; height:18px; object-fit:contain;">` : ''}
                    <span>⭐${s.exp || 0} 💰${s.coins || 0}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

window.selectHomeQuest = function(aid) {
    currentAssignmentId = aid;
    renderHomeView();
};

window.handleHomeSeatClick = function(aid, sidx) {
    const a = data.assignments.find(x => x.id == aid);
    if (!a) return;
    const wasCleared = isStudentAllCleared(sidx);
    const curSt = (a.statuses || [])[sidx] || 0;

    if (isSelfCheckinLock) {
        // 學生自助繳交鎖：只允許 0(未交) <-> 1(已回報)，若已是 2(再訂正) 或 3(討伐成功) 則提示需由老師批改
        if (curSt === 0) {
            window.updateStatus(aid, sidx, 1);
        } else if (curSt === 1) {
            window.updateStatus(aid, sidx, 0);
        } else if (curSt === 2) {
            showToast('📝 「待訂正」作業請交給老師檢查後，由老師切換為綠燈喔！');
            return;
        } else if (curSt === 3) {
            showToast('✅ 此作業已經討伐成功（綠燈）囉！');
            return;
        }
    } else {
        window.toggleStatus(aid, sidx);
    }

    const nowCleared = isStudentAllCleared(sidx);
    if (nowCleared) {
        setTimeout(() => {
            window.cheerMeadowActor(sidx, !wasCleared);
        }, 60);
    }
};

window.quickGroupSubmitHome = function(aid, groupNum) {
    const a = data.assignments.find(x => x.id == aid);
    if (!a) return;
    let changed = false;
    data.roster.forEach((st, i) => {
        if ((st.group || 1) === groupNum) {
            const isAssigned = (a.assignedIndices === 'all') || (a.assignedIndices && a.assignedIndices.includes(i));
            if (isAssigned) {
                const oldSt = (a.statuses || [])[i] || 0;
                if (oldSt === 0 || (!isSelfCheckinLock && oldSt === 2)) {
                    window.updateStatus(a.id, i, 1);
                    changed = true;
                }
            }
        }
    });
    if (changed) {
        showToast(`✨ 第 ${groupNum} 組已全數設為「已回報」！`);
        renderHomeView();
    }
};

// ==========================================
// 📊 公會榮耀戰報 & 統計中心引擎
// ==========================================
function renderStatsView() {
    const kpiGrid = document.getElementById('statsKpiGrid');
    const subjBars = document.getElementById('statsSubjectBars');
    const groupRank = document.getElementById('statsGroupRanking');
    const topExpEl = document.getElementById('statsTopExpList');
    const topCoinEl = document.getElementById('statsTopCoinList');
    const topPetEl = document.getElementById('statsTopPetList');
    const pendingTable = document.getElementById('statsPendingTasksTable');
    if (!kpiGrid) return;

    const activeAssigns = (data.assignments || []).filter(a => !a.archived);
    let totalTaskSlots = 0;
    let clearedTaskSlots = 0;
    let totalExpAll = 0;
    let totalCoinsAll = 0;
    const classUnlockedPets = new Set();

    const subjMap = {};
    activeAssigns.forEach(a => {
        const sub = a.subject || '一般';
        if (!subjMap[sub]) subjMap[sub] = { total: 0, cleared: 0, reported: 0 };
        const indices = a.assignedIndices || 'all';
        data.roster.forEach((_, i) => {
            if (indices === 'all' || indices.includes(i)) {
                totalTaskSlots++;
                subjMap[sub].total++;
                const st = (a.statuses || [])[i] || 0;
                if (st === 3) {
                    clearedTaskSlots++;
                    subjMap[sub].cleared++;
                }
                if (st === 1 || st === 3) {
                    subjMap[sub].reported++;
                }
            }
        });
    });

    let crownCount = 0;
    data.roster.forEach((s, i) => {
        totalExpAll += (s.exp || 0);
        totalCoinsAll += (s.coins || 0);
        if (isStudentAllCleared(i)) crownCount++;
        (s.pets || []).forEach(pid => {
            const normId = String(pid).startsWith('p') ? parseInt(String(pid).slice(1)) : pid;
            classUnlockedPets.add(String(normId));
        });
    });

    const overallRate = totalTaskSlots > 0 ? Math.round((clearedTaskSlots / totalTaskSlots) * 100) : 100;

    kpiGrid.innerHTML = `
        <div class="stats-kpi-card">
            <div class="stats-kpi-icon" style="background:linear-gradient(135deg, #16a34a, #15803d);"><i class="bi bi-patch-check-fill"></i></div>
            <div>
                <div style="font-size:12px; color:var(--muted); font-weight:bold;">全班委託完勝率 (綠燈)</div>
                <div style="font-size:24px; font-weight:900; color:var(--success);">${overallRate}% <span style="font-size:12px; color:var(--muted);">(${clearedTaskSlots}/${totalTaskSlots})</span></div>
            </div>
        </div>
        <div class="stats-kpi-card">
            <div class="stats-kpi-icon" style="background:linear-gradient(135deg, #eab308, #ca8a04);"><i class="bi bi-trophy-fill"></i></div>
            <div>
                <div style="font-size:12px; color:var(--muted); font-weight:bold;">討伐全冠王人數</div>
                <div style="font-size:24px; font-weight:900; color:#b45309;">${crownCount} <span style="font-size:13px; color:var(--muted);">/ ${data.roster.length} 人</span></div>
            </div>
        </div>
        <div class="stats-kpi-card">
            <div class="stats-kpi-icon" style="background:linear-gradient(135deg, #2fb0bb, #1b8a97);"><i class="bi bi-collection-fill"></i></div>
            <div>
                <div style="font-size:12px; color:var(--muted); font-weight:bold;">全班萌寵圖鑑共創解鎖</div>
                <div style="font-size:24px; font-weight:900; color:#1b8a97;">${classUnlockedPets.size} <span style="font-size:13px; color:var(--muted);">/ ${gachaPool.length} 種</span></div>
            </div>
        </div>
        <div class="stats-kpi-card">
            <div class="stats-kpi-icon" style="background:linear-gradient(135deg, #f97316, #ea580c);"><i class="bi bi-stars"></i></div>
            <div>
                <div style="font-size:12px; color:var(--muted); font-weight:bold;">公會總資產 (EXP / 金幣)</div>
                <div style="font-size:18px; font-weight:900; color:var(--primary);">⭐ ${totalExpAll} <span style="color:#b45309; margin-left:6px;">💰 ${totalCoinsAll}</span></div>
            </div>
        </div>
    `;

    const subjEntries = Object.entries(subjMap);
    if (subjEntries.length === 0) {
        subjBars.innerHTML = '<div class="muted" style="padding:12px;">尚無委託資料</div>';
    } else {
        subjBars.innerHTML = subjEntries.map(([sub, st]) => {
            const pct = st.total > 0 ? Math.round((st.cleared / st.total) * 100) : 0;
            const barColor = pct >= 90 ? '#16a34a' : (pct >= 70 ? '#2563eb' : '#ea580c');
            return `<div class="stats-bar-row">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:900;">
                    <span>📚 ${escapeHtml(sub)}</span>
                    <span style="color:${barColor};">${pct}% 完勝 (${st.cleared}/${st.total})</span>
                </div>
                <div class="stats-bar-track">
                    <div class="stats-bar-fill" style="width:${pct}%; background:${barColor};"></div>
                </div>
            </div>`;
        }).join('');
    }

    const groupMap = {};
    data.roster.forEach((s, i) => {
        const g = s.group || 1;
        if (!groupMap[g]) groupMap[g] = { group: g, count: 0, totalExp: 0, clearedMembers: 0, pets: [] };
        groupMap[g].count++;
        groupMap[g].totalExp += (s.exp || 0);
        if (isStudentAllCleared(i)) groupMap[g].clearedMembers++;
        const pet = getStudentPartnerPetObj(s, i);
        if (pet) groupMap[g].pets.push(pet);
    });
    const groupList = Object.values(groupMap).map(g => ({
        ...g,
        avgExp: g.count > 0 ? Math.round(g.totalExp / g.count) : 0
    })).sort((a, b) => b.avgExp - a.avgExp);

    const medals = ['🥇', '🥈', '🥉'];
    groupRank.innerHTML = groupList.map((g, idx) => `
        <div class="rank-podium-item">
            <span style="font-size:20px; width:28px; text-align:center; font-weight:900;">${medals[idx] || `#${idx + 1}`}</span>
            <div style="flex:1; min-width:0;">
                <div style="font-weight:900; font-size:14px;">第 ${g.group} 小組 <span style="font-size:12px; color:var(--success); margin-left:6px;">(全冠王 ${g.clearedMembers}/${g.count} 人)</span></div>
                <div style="display:flex; gap:2px; margin-top:2px; overflow:hidden;">
                    ${g.pets.slice(0, 6).map(p => `<img src="${p.sit}" class="pixel-pet" style="width:20px; height:20px;">`).join('')}
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:15px; font-weight:900; color:var(--primary);">平均 ⭐ ${g.avgExp}</div>
                <div style="font-size:11px; color:var(--muted); font-weight:bold;">總計 ${g.totalExp} EXP</div>
            </div>
        </div>
    `).join('');

    const renderTopList = (arr, valFormatter) => arr.slice(0, 5).map((item, idx) => {
        const pet = getStudentPartnerPetObj(item.s, item.idx);
        return `<div class="rank-podium-item">
            <span style="font-size:16px; width:24px; font-weight:900; color:var(--primary);">${medals[idx] || `${idx + 1}.`}</span>
            ${pet ? `<img src="${pet.sit}" class="pixel-pet" style="width:28px; height:28px; flex-shrink:0;">` : ''}
            <span style="font-weight:900; font-size:14px; flex:1;">${item.s.no}. ${escapeHtml(item.s.name)}</span>
            <span style="font-weight:900; font-size:14px;">${valFormatter(item)}</span>
        </div>`;
    }).join('');

    const enrichedRoster = data.roster.map((s, idx) => ({
        s,
        idx,
        uniquePets: Object.keys(getStudentOwnedMap(s)).length
    }));

    topExpEl.innerHTML = renderTopList(
        [...enrichedRoster].sort((a, b) => (b.s.exp || 0) - (a.s.exp || 0)),
        it => `<span style="color:var(--primary);">⭐ ${it.s.exp || 0}</span>`
    );
    topCoinEl.innerHTML = renderTopList(
        [...enrichedRoster].sort((a, b) => (b.s.coins || 0) - (a.s.coins || 0)),
        it => `<span style="color:#b45309;">💰 ${it.s.coins || 0}</span>`
    );
    topPetEl.innerHTML = renderTopList(
        [...enrichedRoster].sort((a, b) => b.uniquePets - a.uniquePets),
        it => `<span style="color:#1b8a97;">🐾 ${it.uniquePets} 種</span>`
    );

    const taskHotspots = activeAssigns.map(a => {
        const indices = a.assignedIndices || 'all';
        const missingNos = [];
        const redoNos = [];
        data.roster.forEach((s, i) => {
            if (indices === 'all' || indices.includes(i)) {
                const st = (a.statuses || [])[i] || 0;
                if (st === 0) missingNos.push(`${s.no}.${escapeHtml(s.name)}`);
                if (st === 2) redoNos.push(`${s.no}.${escapeHtml(s.name)}`);
            }
        });
        return { a, missingNos, redoNos, totalPending: missingNos.length + redoNos.length };
    }).filter(t => t.totalPending > 0).sort((x, y) => y.totalPending - x.totalPending);

    if (taskHotspots.length === 0) {
        pendingTable.innerHTML = '<div style="color:var(--success); font-weight:900; padding:8px;">🎉 太棒了！目前所有委託皆已全數討伐完成！</div>';
    } else {
        pendingTable.innerHTML = `<table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
                <tr style="background:var(--tbl-head); text-align:left;">
                    <th style="padding:8px; border:1px solid var(--tbl-border);">日期 / 委託名稱</th>
                    <th style="padding:8px; border:1px solid var(--tbl-border);">未交名單 (灰燈)</th>
                    <th style="padding:8px; border:1px solid var(--tbl-border);">待訂正名單 (橘燈)</th>
                </tr>
            </thead>
            <tbody>
                ${taskHotspots.map(t => `<tr style="background:var(--card);">
                    <td style="padding:8px; border:1px solid var(--tbl-border); font-weight:900; white-space:nowrap;">${t.a.date} 【${escapeHtml(t.a.title)}】</td>
                    <td style="padding:8px; border:1px solid var(--tbl-border); color:var(--danger); font-weight:bold;">${t.missingNos.join('、') || '-'}</td>
                    <td style="padding:8px; border:1px solid var(--tbl-border); color:#ea580c; font-weight:bold;">${t.redoNos.join('、') || '-'}</td>
                </tr>`).join('')}
            </tbody>
        </table>`;
    }
}

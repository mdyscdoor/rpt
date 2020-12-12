//2020 Toya Yukito

document.addEventListener('DOMContentLoaded', function() {
  let config = document.getElementById('config');
  let qWrapper = document.getElementById('q-wrapper');
  let windowWidth = window.innerWidth;

  let isInputMode = true; 
  let soundAgain;
  let jumpFlag = false;
  let startWithThis = false;
  let startWith;
  let endWithThis = false;
  let endWith;
  let NGs = [];
  let NGMode = false;
  let NGCount = 0;
  let showPitch = false;
  let booked = false;
  let playingBGM = false;

  let MylistMode = false;
  let MylistRandList = [];
  let MylistRandCounter = 0;
  let CancelMylistMode = false;
  let MylistQues = [];

  let CourseQues = [];
  let CourseRandList = [];
  let CourseRandFlag = false;
  let CourseCounter = 0;
  let CourseMode = false;

  let courseList = document.getElementById('courseList');


  


  //端末による警告の表示
  if(windowWidth < 1000) {
    let courseListDisplay = document.getElementById('courseList');

    let warn = document.createElement('p');
    warn.className = ('mobile-warning');
    warn.textContent = ('※pc以外のご利用では、ブラウザの仕様により動作が重い場合があります');

    courseListDisplay.appendChild(warn);
  }



  //モードの表示切り替え
  document.getElementById('randomMode').addEventListener('click',function() {
    courseList.style.display = 'none';
    if(windowWidth >600) {
      document.getElementById('randomDetails').style.display = 'flex';
    } else {
      document.getElementById('randomDetails').style.display = 'block';
    }

  });

  document.getElementById('backRand').addEventListener('click', function() {
    courseList.style.display = 'block';
    document.getElementById('randomDetails').style.display = 'none';
  });

  document.getElementById('mylistMode').addEventListener('click', function() {
    courseList.style.display = 'none';
    document.getElementById('mylistDetails').style.display = 'block';
  })

  document.getElementById('listBackBtn').addEventListener('click', function() {
    courseList.style.display ='block';
    document.getElementById('mylistDetails').style.display = 'none';
  });

  document.getElementById('setMode').addEventListener('click', function() {
    courseList.style.display = 'none';
    document.getElementById('courseDetails').style.display = 'block';
  });

  document.getElementById('courseBackBtn').addEventListener('click', function() {
    courseList.style.display = 'block';
    document.getElementById('courseDetails').style.display = 'none';
  });



  //ランダムモードのチェックボックスの制御
  let pitch = document.getElementsByName('pitch');
  let Spitch = document.getElementsByName('Spitch');
  let Ipitch = document.getElementsByName('Ipitch');
  let Epitch = document.getElementsByName('Epitch');

  for(let i=0; i<pitch.length; i++) {
    pitch[i].addEventListener('click', function() {
      if(pitch[i].checked == false && Spitch[i].checked == true) {
        Spitch[i].checked = false;
      }
      if(pitch[i].checked == false && Epitch[i].checked == true) {
        Epitch[i].checked = false;
      }
    });
  }


  for(let i=0; i<Spitch.length; i++) {
    Spitch[i].addEventListener('click', function() {
      pitch = document.getElementsByName('pitch');

      if(pitch[i].checked == false) {
        Spitch[i].checked = false;
      } else {

        for(j=0; j<Spitch.length; j++) {
          if(Spitch[j].checked && j != i ) {
            Spitch[j].checked = false;

          }
        }
      }
    });
  }

  for(let i=0; i<Epitch.length; i++) {
    Epitch[i].addEventListener('click', function() {
      pitch = document.getElementsByName('pitch');

      if(pitch[i].checked == false) {
        Epitch[i].checked = false;
      } else {

        for(j=0; j<Epitch.length; j++) {
          if(Epitch[j].checked && j != i ) {
            Epitch[j].checked = false;

          }
        }
      }
    });
  }

  for(let i=0; i<Ipitch.length; i++) {
    Ipitch[i].addEventListener('click', function() {
    })
  }

  randArr = (arr) => {
    for(let i=0, len = arr.length; i<len; i++) {
      let r = Math.floor(Math.random() * len);
      let tmp = arr[i];
      arr[i] = arr[r];
      arr[r] = tmp;
    }
  };



  //メディアクエリ
  if(windowWidth < 350) {
    let pitchFigure = document.getElementsByClassName('pitch-figure');

    for(let i=0; i<pitchFigure.length; i++) {
      pitchFigure[i].style.display = 'none';
    }
  }








  //ゲームスタート
  let start = function() {

    document.getElementById('btn').style = 'display:none;';
    document.getElementById('btn2').style = 'display:block;';
    config.style.display = 'none';
    qWrapper.style = 'display:block';

    let questions = 5;
    
    let RDuration = 1500;
    let QInterval = 2000;    

    let selected = [];
    

    //連続音数
    let repeat = document.getElementById('repeat').value;

    //一ラウンドの問題数
    questions = document.getElementById('questions').value;
    if(MylistMode) {
      questions = document.getElementById('questionsList').value;
    } else if (CourseMode) {
      questions = document.getElementById('questionsCourse').value;
    } 
    
    
    let pitches = document.getElementsByName('pitch');
    let keys = document.getElementsByClassName('wkey');       //白鍵盤
    //------ここに黒鍵の要素を取得?------//

    //ゲーム中のボタンの要素を取得
    let inputs = document.getElementById('inputs');      
    let play = document.getElementById('play');
    let pause = document.getElementById('pause');
    let bookmark = document.getElementById('heart');
    let light = document.getElementById('light');
    let lightOff = document.getElementById('light-off');

    //問題・答え・結果の初期化
    let getQ = document.getElementById('ques');
    let getR = document.getElementById('result');
    let getA = document.getElementById('ans');
    while( getQ.firstChild ){
      getQ.removeChild( getQ.firstChild );
    }
    while (getR.firstChild) {
      getR.removeChild(getR.firstChild);
    }
    while (getA.firstChild) {
      getA.removeChild(getA.firstChild);
    }

    let ans = [];
    let ansList = [];         //入力した答え
    let ansSolfa = [];     //入力した答えの階名
    let crrAns = [];       //正しい答え
    let crrAnsList = [];
    let score = [];        //得点を加算
    let lastScore = [];    //ラウンドの総得点

    let q = document.getElementById('q');
    let ques = [];         //デバッグ用に問題を表示

    

    for(let i=0; i<Spitch.length; i++) {
      if(Spitch[i].checked == true) {
        startWithThis = true;
        startWith = i + 1;
      }
    }

    for(let i=0; i<Epitch.length; i++) {
      if(Epitch[i].checked == true) {
        endWithThis = true;
        endWith = i + 1;
      }
    }







    //文字列を数列に
    let toNum = function(arr) {
      for (let i=0, len = arr.length; i<len; i++) {
        arr[i] = Number(arr[i]);
      }
    }

    //チェックされた階名を配列にする
    for(let i=0, len = pitches.length; i<len; i++) {
      let pitch = pitches.item(i);

      if(pitch.checked) {
        selected.push(pitch.value);
      }
    }

    if(pitches) {
      selected = [1,2,3,4,5,6,7];
    }

    toNum(selected);



    



    //配列をランダムにする関数
    randArr = (arr) => {
      for(let i=0, len = arr.length; i<len; i++) {
        let r = Math.floor(Math.random() * len);
        let tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
      }

      if(startWithThis === true) {
        console.log('setFirstNote');
        setFirstNote(arr, startWith);
      }

      console.log('--> RandomedArr: ' + arr);
      if(!MylistMode && !CourseMode) {
        jumpArr(arr);
      }
    };





    //一番目の音をを固定する関数
    let setFirstNote = function(arr, note) {
      if(arr.indexOf(note) == -1) {
        arr.shift();
        arr.unshift(note);
      } else {
        if(note == endWith) {
          arr.shift();
          arr.unshift(note);
        } else {
          arr.splice(arr.indexOf(note), 1);
          arr.unshift(note);
        }
      }
    }

    let setLastNote = function(arr, note) {
      if(arr.indexOf(note) == -1) {
        arr.pop();
        arr.push(note);
      } else {
        if(note == startWith) {
          arr.pop();
          arr.push(note);
        } else {
          arr.splice(arr.indexOf(note), 1);
          arr.push(note);
        }
      }
    }

    //この音を必ず含む
    let setThisNote = function(arr, note) {
      if(arr.indexOf(note) == -1) {
        console.log('not including: ' + note);
        let rand = Math.floor(Math.random() * arr.length);
        console.log(arr.splice(rand, 1, note));
      }
    }




    //跳躍を防止する関数
    let jumpArr = (arr) => {
      console.log('called jumpArr');
      for(let i=0, len = arr.length; i<len - 1; i++) {
        let tmpRand = Math.floor(Math.random() * 2);
        let gap = arr[i + 1] - arr[i];

        if(gap > 4) {
          console.log('gap > 4');
          console.log('before arr[i+1] : ' + arr[i+1]);
          console.log('after arr[i+1] : ' + (arr[i+1] - 7));
          arr[i+1] -= 7;
          console.log('ModifiedArr:' + arr);
          if (jumpFlag == true && tmpRand == 1) {
            console.log('jump');
            arr[i+1] += 7;
          }

        } else if (gap == 4 && tmpRand == 1) {
          console.log('gap == 4');
          console.log('before arr[i+1] : ' + arr[i+1]);
          console.log('after arr[i+1] : ' + (arr[i+1] - 7));
          arr[i+1] -= 7;
          console.log('ModifiedArr:' + arr);

        } else if (gap < -4) {
          console.log('gap < -4');
          console.log('before arr[i+1] : ' + arr[i+1]);
          console.log('after arr[i+1] : ' + (arr[i+1] + 7));
          arr[i+1] += 7;
          console.log('ModifiedArr:' + arr);
          if (jumpFlag == true && tmpRand == 1) {
            console.log('jump');
            arr[i+1] -= 7;
          }

        } else if (gap == -4 && tmpRand == 1) {
          console.log('gap == -4');
          console.log('before arr[i+1] : ' + arr[i+1]);
          console.log('after arr[i+1] : ' + (arr[i+1] + 7));
          arr[i+1] += 7;
          console.log('ModifiedArr:' + arr);
        }

        if(arr[i+1] < -6) {
          arr[i+1] += 7;
        }
        if(arr[i+1] > 15) {
          arr[i+1] -= 7;
        }

      }
      console.log('----> TotalModifiedArr:' + arr);
    };


    //1から7の数字に変換
    let convert = function(num) {
      let tmp = num;
      while(tmp < 1) {tmp += 7;}
      if(tmp > 7) {tmp %= 7;}
      if(tmp == 0) {tmp = 7};
      return tmp;
    }


    let convertArr = function(arr) {
      let copy = arr.concat();
      for(i=0, len = copy.length; i<len; i++) {
        copy[i] = convert(copy[i]);
      }

      return copy;
    }


    //度数に応じて階名を表示する関数
    solfa = (note) => {
      let result;
      note = Number(note);
      let tmpNote = convert(note);
      tmpNote = convert(tmpNote);

      if(tmpNote)
      //console.log('note:' + note);
      switch(tmpNote) {
        case 1:
          result = 'ド';
          break;
        case 2:
          result = 'レ';
          break;
        case 3:
          result = 'ミ';
          break;
        case 4:
          result = 'ファ';
          break;
        case 5:
          result = 'ソ';
          break;
        case 6:
          result = 'ラ';
          break;
        case 7:
          result = 'シ';
          break;
        default:
          result = '';
          break;
      }
      return result;
    };


    //度数の配列を階名の配列にする
    solfaArr = (notes) => {
      let tmp = [];
      for(let s=0, lenNotes = notes.length; s<lenNotes; s++) {
        tmp.push(solfa(notes[s]));
      }
      return tmp;
    }








    //音を鳴らす関数に必要なパラメータ
    let countTimeout = 0;   //音を遅延させて鳴らすため
    let isPlaying = false;  //音が現在鳴っているか

 

    //問題の音を鳴らす関数
    let quesSound = function(arr, i) {
      let exist = document.getElementById("soundQ" + arr[i]);
      console.log(arr);
      console.log('arr[i]:' + arr[i]);
      if (exist) {
        document.body.removeChild(exist);
      }

      console.log('→quesSound');
      let audio = document.createElement('audio');
      audio.src = "./sounds/" + arr[i] + ".mp3";
      audio.id = "soundQ" + arr[i];


      //モバイル端末の場合にラグを考慮
      if(windowWidth < 800) {
        document.body.appendChild(audio);
        let currentAudio = document.getElementById("soundQ" + arr[i]);
        document.getElementById("soundQ" + arr[i]).currentTime = 0;
        isPlaying = true;
        currentAudio.play();
  

        const audioListener = function() {
          if ((countTimeout) < arr.length - 1) {
            setTimeout(quesSound, 1, arr, ++countTimeout);
            currentAudio.removeEventListener('ended', audioListener, false);
          } else {
            isPlaying = false;
            countTimeout = 0;
            //console.log('isPlaying: ' + isPlaying);
            clearTimeout();
            console.log('quesSoundExit');
            
            currentAudio.removeEventListener('ended', audioListener, false);
          }
        };

        currentAudio.addEventListener('ended', audioListener, false);


      //pcの場合
      } else {
        document.body.appendChild(audio);
        let currentAudio = document.getElementById("soundQ" + arr[i]);
        document.getElementById("soundQ" + arr[i]).currentTime = 0;
        isPlaying = true;
        currentAudio.play();
        
        currentAudio.addEventListener('ended', function() {
          document.body.removeChild(currentAudio);
        });
  
        if ((countTimeout) < arr.length - 1) {
          setTimeout(quesSound, 500, arr, ++countTimeout);
        } else {
          isPlaying = false;
          countTimeout = 0;
          //console.log('isPlaying: ' + isPlaying);
          clearTimeout();
          console.log('quesSoundExit');
        }
      }


      console.log('←quesSound');
    }




    //〇×の音を鳴らす関数
    let judgeSound = (correct) => {

      //もうあれば消す
      let judge = document.getElementById('judge');
      if(judge) {
        document.body.removeChild(judge);
      }

      let sound = document.createElement('audio');
      if (correct === true) {
        sound.src = './sounds/ok.mp3';
      } else {
        sound.src = './sounds/ng.mp3';
      }

      sound.id = 'judge';
      document.body.appendChild(sound);
      sound.play();

      judge = document.getElementById('judge');
      judge.addEventListener('ended', function() {
        document.body.removeChild(judge);
      });



      
      
    }




    //問題をつくる関数
    let makeQ = (origin) => {
      console.log('→makeQ');
      
      //マイリストモード
      if(MylistMode) {
        if(questions > MylistQues.length) {
          questions = MylistQues.length;
        }
        ques = MylistQues[MylistRandList[MylistRandCounter]];
        MylistRandCounter++;
        if(ques) {
          repeat = ques.length;
        }

      //コースモード
      } else if (CourseMode) {
        if(questions > CourseQues.length) {
          questions = CourseQues.length;
        }
        ques = CourseQues[CourseCounter];
        CourseCounter++;
        if(ques) {
          repeat = ques.length;
        }

      } else {
      
      
        let copy = origin.concat();

        //選択された階名をランダムに
        console.log('beforeRand: ' + copy);
        randArr(copy);

        //音のチェック数が少ない場合に重複を許して問題を拡張
        while (copy.length < repeat) {
          let tmpArr = copy.concat();
          randArr(copy);
          copy = copy.concat(tmpArr);
        }

        //ランダム化した配列を長さに応じてカット、度数の範囲に収める
        ques = copy.slice(0, repeat);

        if(endWithThis === true) {
          console.log('endWith');
          setLastNote(ques, endWith);
          jumpArr(ques);
        }

      }

      console.log('←makeQ');
    }





    //問題を画面に表示する関数
    let showQ = (question) => {
      console.log('←showQ');
      document.getElementById('ques').textContent = '';
      for(let i=0; i<question.length;i++) {
        let getQ = document.getElementById('ques');

        newQ =document.createElement('p');
        newQ.id = 'ques' + (i+1);
       //console.log('questions[i]: ' + questions[i]);
        //console.log('solfa: '+ solfa(questions[i]));
        if(showPitch) {
          newQ.textContent = solfa(question[i]);
        }
        let border = document.createElement('span');
        border.className = 'next';

        if(i>0) {
          getQ.appendChild(border);
        }
        getQ.appendChild(newQ);
      }
      console.log('←showQ');

    };


    //〇×の表示
    let showR = (check,number) => {

      getR = document.getElementById('result');
      newR = document.createElement('p');
      newR.id = 'result' + number;
      newR.className = 'resultPadd';

      //10の倍数で消す
      if(number % 10 == 0) {
        getR.textContent = '';
      }
      if(windowWidth < 800 && number % 5 == 0) {
        getR.textContent = '';
      }
      
      if (check === true) {
        newR.textContent = (number) + '. 〇';
      } else {
        newR.textContent = (number) + '. ×';
      }

      getR.appendChild(newR);
    };












    //ラウンド終了後のリザルトを表示
    let showResultf = () => {



      console.log('called showResultf');
      qWrapper.style = 'display:none;';


      // console.log(crrAnsList.length);
      let resultDisp = document.getElementById('result_final');
      resultDisp.style.display = 'block';


      for (let i=0; i<crrAnsList.length; i++) {
        let resultf = document.getElementById('results_final');
        let newResultf = document.createElement('div');
        newResultf.id = 'resultf' + (i+1);
        newResultf.className = 'resultf';
        resultf.appendChild(newResultf);
      
        let getResultf = document.getElementById('resultf' + (i+1));

        let qNum = document.createElement('span');
        qNum.className = 'qNum';
        qNum.textContent = i+1 + '.';
        getResultf.appendChild(qNum);

        for (let p=0; p<crrAnsList[i].length; p++) {
          let newCA = document.createElement('span');
          newCA.className = 'crrAns';
          newCA.textContent = solfa(crrAnsList[i][p]);
          getResultf.appendChild(newCA);
          if (windowWidth < 700) {
            if(p == 4) {
              let br = document.createElement('br');
              getResultf.appendChild(br);
              let sp = document.createElement('span');
              sp.className = 'qNum';
              getResultf.appendChild(sp);
            }
          }
        }




        if(lastScore[i]  === false)  {


          let br = document.createElement('br');
          getResultf.appendChild(br);
          let joint = document.createElement('span');
          joint.className = 'joint';
          joint.textContent = '→';
          getResultf.appendChild(joint);



          for (let p=0; p<crrAnsList[i].length; p++) {
            let newMA = document.createElement('span');
            newMA.className = 'myAns';
            newMA.textContent = solfa(ansList[i][p]);
            if (p == ansList[i].length - 1) {
              newMA.style.color = 'red';
            }
            getResultf.appendChild(newMA);
            if (windowWidth < 700) {
              if(p == 4) {
                let br = document.createElement('br');
                getResultf.appendChild(br);
                let sp = document.createElement('span');
                sp.className = 'qNum';
                getResultf.appendChild(sp);
              }
            }
          }

        }

        if (windowWidth < 700) {
            let br = document.createElement('br');
            getResultf.appendChild(br);
        }

        let judgeIco = document.createElement('i');
        console.log('score['+ i + ']: ' + lastScore[i]);
        if (lastScore[i] === true) {
          judgeIco.className = 'far fa-circle';
        } else {
          judgeIco.className = 'fas fa-times'
        }


      
        let musicIco = document.createElement('i');
        musicIco.className = 'fas fa-music';
        
        let heartIco = document.createElement('i');
        heartIco.className = 'fas fa-heart';
      
        getResultf.appendChild(judgeIco);
        getResultf.appendChild(musicIco);
        getResultf.appendChild(heartIco);
      }


      NGs = [];
      for (let i=0; i<lastScore.length; i++) {
        if(lastScore[i] === false) {
          NGs.push(crrAnsList[i]);
        }
      }

      if(NGs.length == 0) {
        document.getElementById('NGRedo').style.display = 'none';
        document.getElementById('NGMark').style.display = 'none';
      } else {
        document.getElementById('NGRedo').style.display = 'block';
        document.getElementById('NGMark').style.display = 'block';
      }


      let resultSounds = document.querySelectorAll('.resultf > .fa-music');
      let resultBook = document.querySelectorAll('.resultf > .fa-heart');
      

      let count2 = 0;
      let quesSound2 = function(arr) {
        let i = count2;
  
        console.log('→quesSound');
        let audio = document.createElement('audio');
        audio.src = "./sounds/" + arr[i] + ".mp3";
        audio.id = "soundQ" + arr[i];
  
        document.body.appendChild(audio);
        document.getElementById("soundQ" + arr[i]).currentTime = 0;
        isPlaying = true;
        document.getElementById("soundQ" + arr[i]).play();
        document.getElementById("soundQ" + arr[i]).addEventListener('ended', function() {
          document.body.removeChild(audio);
        });

        if (count2 < arr.length - 1) {
          setTimeout(quesSound2, 500, arr, ++count2);
        } else {
          count2 = 0;
        }
      }

      //ブックマーク
      let bookmarkFunc2 = function(arr) {
        let tmp = JSON.parse(localStorage[0]);
        let parsed = tmp.list;
        let tmpBook = arr.concat();
        console.log(tmpBook);
        for(let i=0; i<tmpBook.length; i++) {
          tmpBook[i] -= 1;
        }

        parsed.push(tmpBook);

        console.log(parsed);
        tmp.list = parsed;

        localStorage[0] = JSON.stringify(tmp);
        document.getElementById('heart').style.backgroundColor = 'rgba(255, 182, 193, 0.5)';
        
        return;
      }


      for (let k=0; k<resultSounds.length; k++) {
        let resultSoundFunc = function() {
          console.log('crrAnsList[k]:' + crrAnsList[k]);
          console.log('xountTimeout: ' + countTimeout);
          quesSound2(crrAnsList[k]);
          
        };
        resultSounds[k].addEventListener('click',resultSoundFunc,false);
      }

      for(let k=0; k<resultBook.length; k++) {
        resultBook[k].style.backgroundColor = 'rgba(255, 182, 193, 0.2)';

        const bookmarkResult = function() { 
          bookmarkFunc2(crrAnsList[k]);
          resultBook[k].style.backgroundColor = 'rgba(255, 182, 193, 0.5)';
        }
        resultBook[k].addEventListener('click', bookmarkResult, false);
      }
      


      console.log('showResultf:ended');
    }
    









    //一問目
    if(NGMode === false) {
      makeQ(selected); 
    } else {
      questions = NGs.length;
      NGCount = 0;
      ques = NGs[NGCount];
      if(ques) {
        repeat = ques.length;
      }
    }


    showQ(ques);
    //console.log(ques);
    q.textContent = ques;

    //生成した問題の音を鳴らす
    countTimeout = 0;
    isPlaying = true;
    //console.log('isPlaying:' + isPlaying);
    quesSound(ques, countTimeout);

    
































    //白鍵の発音処理
    //暫定的にオクターブ違いを無視
    for(let k=0, len=keys.length; k<len; k++) {

      let keyPush = function() {
        if (isPlaying === false) {
          
          //発音準備
          let audio = document.createElement('audio');
          let j = (k+7) % 7 + 1;
          console.log(k-6);
          audio.src = './sounds/' + (k-6) + '.mp3';
          audio.id = 'sound' + (k+1);

          //発音
          document.body.appendChild(audio);
          let play = document.getElementById('sound' + (k+1));
          play.currentTime = 0;
          play.play();

          play.addEventListener('ended', function() {
            document.body.removeChild(audio);
          });



          if(isInputMode) {

            //入力した鍵盤をプッシュし、長さを取得し、表示
            ans.push(j);       
            ansSolfa.push(solfa(j));
            let lenAns = ans.length;                     
            inputs.textContent = ansSolfa;

            //画面幅が小さければ問題を非表示に
            console.log(windowWidth);
            if(windowWidth < 700) {
              document.getElementById('ques').style.display = 'none';
              console.log('nonenonenone');
            }

            let getA = document.getElementById('ans');
            let newA = document.createElement('p');
            newA.id = 'ans' + lenAns;
            newA.textContent = ansSolfa[lenAns - 1];

            let border = document.createElement('span');
            border.className = 'next';

            if (lenAns > 1) {
              getA.appendChild(border);
            }
            getA.appendChild(newA);
            



            



            //問題の終了処理
            if (lenAns >= repeat || ans[lenAns - 1] != convert(ques[lenAns - 1]) ) {
              //console.log('正誤が記録されます');

              //メディアクエリ
              if(windowWidth < 700) {
                document.getElementById('ques').style.display = 'flex';
                console.log('flexflexflex');
                document.getElementById('ans').textContent = '';
              }

              //正誤の記録 
              if (lenAns == repeat && ans[lenAns - 1] == convert(ques[lenAns - 1]) ) {
                score.push(true);
              } else {
                score.push(false);
              }

              judgeSound(score[score.length - 1]);

              showR(score[score.length - 1], score.length);

              //この問題の結果の表示
              crrAns = ques.concat();
              document.getElementById('correct').textContent = crrAns;
              crrAnsList.push(crrAns);
              document.getElementById('myAns').textContent = ans;
              ansList.push(ans);



              //問題の再生成
              if(NGMode === false) {
                makeQ(selected); 
                
              } else {
                NGCount++;
                ques = NGs[NGCount];
                if(ques) {
                  repeat = ques.length;
                }
              }
              document.getElementById('heart').style.backgroundColor = 'rgba(255, 182, 193, 0.2)';
              booked = false;

              //問題を出す。 
              countTimeout = 0;
              isPlaying = true;


              //一定時間後に問題を消す
              setTimeout(function (){
                ans = [];
                ansSolfa = [];
                inputs.textContent = ans;
                let getQ = document.getElementById('ques');
                while( getQ.firstChild ){
                  getQ.removeChild( getQ.firstChild );
                }
                while( getA.firstChild ){
                  getA.removeChild( getA.firstChild );
                }
              },RDuration);




              //全問題終了
              //ラウンド終了の判定も含む
              if(score.length == questions) {
                lastScore = score.concat();
                document.getElementById('scores').textContent = lastScore;
                score = [];
                document.getElementById('result').textContent = score;
                MylistRandCounter = 0;
                startWithThis = false;
                startWith = null;
                endWithThis = false;
                endWith = null;

                setTimeout(showResultf, QInterval);
                document.getElementById('again').removeEventListener('click', againSound, false);
                
                pause.removeEventListener('click', pauseFunc, false);
                play.removeEventListener('click', playFunc, false);
                bookmark.removeEventListener('click', bookmarkFunc, false);
                light.removeEventListener('click', lightFunc, false);
                lightOff.removeEventListener('click', lightOffFunc, false);
                //document.getElementById('btn').removeEventListener('click', start, false);
                keys[k].removeEventListener('click', keyPush,false);
                document.getElementById('btn2').removeEventListener('click', Quit,false);
                

              } else {

               
                q.textContent = ques.toString();


                soundAgain = setTimeout(quesSound,QInterval, ques, countTimeout);
                setTimeout(showQ, RDuration, ques);
              }
            }
          }
        } 

          
        

      }







      //鍵盤イベントの実行と削除
      keys[k].addEventListener('click', keyPush,false);
      document.getElementById('btn2').addEventListener('click', function() {
        keys[k].removeEventListener('click', keyPush,false);
      });

    }




    //もう一度問題を聞く
    //  let again = document.getElementById('again');
    //   again.addEventListener('click', function() {
    //   quesSound(ques, countTimeout);
    //  });
    let againSound = function() {
      quesSound(ques, countTimeout);
    };
    document.getElementById('again').addEventListener('click', againSound, false);




    //一時停止
    let pauseFunc = function() {
      isInputMode = false;
      pause.style.display = 'none';
      play.style.display = 'block';
    };
    pause.addEventListener('click', pauseFunc, false);

    let playFunc = function() {
      isInputMode = true;
      pause.style.display = 'block';
      play.style.display = 'none';
    };
    play.addEventListener('click', playFunc, false);


    //問題の階名を表示する関数
    let lightFunc = function() {
      showPitch = true;
      showQ(ques);
      light.style.display = 'none';
      lightOff.style.display = 'block';
    };
    light.addEventListener('click', lightFunc, false);

    let lightOffFunc = function() {
      showPitch = false;
      showQ(ques);
      light.style.display = 'block';
      lightOff.style.display = 'none';
    };
    lightOff.addEventListener('click', lightOffFunc, false);


    //ブックマーク
    let bookmarkFunc = function() {
      if(booked) {
        return;
      }
      booked = true;

      let tmp = JSON.parse(localStorage[0]);
      let parsed = tmp.list;
      let tmpBook = ques.concat();
      console.log(tmpBook);
      for(let i=0; i<tmpBook.length; i++) {
        tmpBook[i] -= 1;
      }

      parsed.push(tmpBook);

      console.log(parsed);
      tmp.list = parsed;

      localStorage[0] = JSON.stringify(tmp);
      document.getElementById('heart').style.backgroundColor = 'rgba(255, 182, 193, 0.5)';
      
      return;
    }
    bookmark.addEventListener('click', bookmarkFunc, false);







    //中止
    let Quit = function() {
      console.log('exit');
      clearTimeout(soundAgain);
      //document.removeEventListener('click', start, false);                          
      qWrapper.style = 'display:none;';
      document.getElementById('q').textContent = '';
      document.getElementById('inputs').textContent = '';
      document.getElementById('myAns').textContent = '';
      document.getElementById('correct').textContent = '';
      if(windowWidth < 700) {
        document.getElementById('ques').style.display = 'flex';
      }

      lastScore = score.concat();
      document.getElementById('scores').textContent = lastScore;
      score = [];
      MylistRandCounter = 0;
      CourseCounter = 0;
      startWith = null;
      startWithThis = false;
      endWith = null;
      endWithThis = false;
      document.getElementById('heart').style.backgroundColor = 'rgba(255, 182, 193, 0.2)';
      booked = false;

      document.getElementById('result').textContent = score;
      showResultf();
      document.getElementById('btn2').removeEventListener('click', Quit,false);
      document.getElementById('again').removeEventListener('click', againSound, false);
      pause.removeEventListener('click', pauseFunc, false);
      play.removeEventListener('click', playFunc, false);
      bookmark.removeEventListener('click', bookmarkFunc, false);
      light.removeEventListener('click', lightFunc, false);
      lightOff.removeEventListener('click', lightOffFunc, false);

    }
    document.getElementById('btn2').addEventListener('click', Quit,false);


    
    //リザルト画面での音の確認



    
  }; //start





  //自由にならせるキーボード
  let keyboard = function () {
    
    console.log('keyboard');
    let keys = document.getElementsByClassName('wkey');

    //白鍵の発音処理
    //暫定的にオクターブ違いを無視
    for(let i=0, len=keys.length; i<len; i++) {
      keys[i].addEventListener('click', function() {
        
        //発音準備
        let audio = document.createElement('audio');
        let j = i % 7 + 1;
        audio.src = './sounds/' + (i-6) + '.mp3';
        audio.id = 'sound' + (i+1);

        //発音
        document.body.appendChild(audio);
        let play = document.getElementById('sound' + (i+1));
        play.currentTime = 0;
        play.play();
        play.addEventListener('ended', function() {
          let stop = document.getElementById('sound' + (i+1));
          document.body.removeChild(stop);
        });

      });
    }


  };

  


  //自由なキーボード
  keyboard();



  //実行
  document.getElementById('btn').addEventListener('click', start, false);
  document.getElementById('btnRand').addEventListener('click', start, false);


  //マイリストモード
  document.getElementById('listStartBtn').addEventListener('click', function() {
    console.log('clicked');
    MylistMode = true;
    CourseMode = false;

    let mylist = document.getElementsByClassName('Mylist');

    if(!mylist) {
      return 0;
      CancelMylistMode = true;

    } else {
      for(let i=0; i<mylist.length; i++) {

        //チェックされたマイリストを問題にする
        if(mylist[i].checked) {
          //チェックされたローカルストレージを取得
          let checkedList = JSON.parse(localStorage[i]).list;
          console.log('checked localStorage[' + i + ']');
          //ローカルストレージから配列を取得
          for(let j=0; j<checkedList.length; j++) {

            //配列を問題に変換
            for(let k=0; k<checkedList[j].length; k++) {
              checkedList[j][k] += 1;
            }
            MylistQues.push(checkedList[j]);
          }

          console.log('MylistQues: ' + MylistQues);
          console.log(MylistQues.length);

        }
      }

      //チェックされてなければやらない
      if(MylistQues.length == 0) {
        CancelMylistMode = true;
      } else {

        for(let j=0; j<MylistQues.length; j++) {
          MylistRandList.push(j);

        }
        console.log('before MylistRandList: '+ MylistRandList);
        randArr(MylistRandList);
        console.log('after MylistRandList: '+ MylistRandList);

        start();
      }
    }
  }, false);



  //コースモード
  document.getElementById('courseStartBtn').addEventListener('click', function() {
    console.log('clicked');
    MylistMode = false;
    CourseMode = true;
    let reverse = document.getElementById('reverseCourse').checked;
    let random = document.getElementById('randomCourse').checked;
    let courses = document.getElementsByClassName('courses');


      //音のまとまりをつくる関数
    const makeCourseQ = (arr, i) => {
      for (let j=1; j<8; j++) {
        switch(i) {
          case 0:
            arr.push([j, j+1, j+2]);
            if(reverse) {
              arr.push([j+2, j+1, j]);
            }
            break;
          case 1:
            arr.push([j, j+1, j+3]);
            if(reverse) {
              arr.push([j+3, j+1, j]);
            }
            break;
          case 2:
            arr.push([j, j+2, j+3]);
            if(reverse) {
              arr.push([j+3, j+2, j]);
            }
            break;
          case 3:
            arr.push([j, j+1, j+4]);
            if(reverse) {
              arr.push([j+4, j+1, j]);
            }
            break;
          case 4:
            arr.push([j, j+3, j+4]);
            if(reverse) {
              arr.push([j+4, j+3, j]);
            }
            break;
          case 5:
            arr.push([j, j+2, j+4]);
            if(reverse) {
              arr.push([j+4, j+2, j]);
            }
            break;
          case 6:
            arr.push([j, j+2, j+5]);
            if(reverse) {
              arr.push([j+5, j+3, j]);
            }
            break;
          case 7:
            arr.push([j, j+3, j+5]);
            if(reverse) {
              arr.push([j+5, j+3, j]);
            }
            break;
          case 8:
            arr.push([j, j+2, j+4, j+6]);
            if(reverse) {
              arr.push([j+6, j+4, j+2, j]);
            }
            break;
          default:
            break;
        }
      }
      console.log(arr);
    };

    //チェックされたコースから配列に
    for(let i=0; i<courses.length; i++) {
      if(courses[i].checked == true) {
        makeCourseQ(CourseQues, i);
      }
    }

    if(CourseQues && random) {
      randArr(CourseQues);
      CourseRandFlag = true;
    }


    if(CourseQues.length != 0) {
      for(let i=0; i<CourseQues.length; i++) {
        CourseRandList.push(i);
      }
      start();
    } else {
      CourseMode = false;
    }


  });






  //リザルト画面から設定画面へ
  document.getElementById('btn3').addEventListener('click', function() {
    document.getElementById('result_final').style.display = 'none';
    let resultf = document.getElementById('results_final');
    while(resultf.firstChild) {
      resultf.removeChild(resultf.firstChild)
    }
    document.getElementById('q').textContent = '';
    document.getElementById('inputs').textContent = '';
    document.getElementById('myAns').textContent = '';
    document.getElementById('correct').textContent = '';
    // document.getElementById('btn').style = 'display:block;';
    config.style.display = 'block';
    NGMode = false;
    MylistMode = false;
    CourseMode = false;

    MylistRandList = [];
    MylistRandCounter = 0;
    MylistQues = [];

    CourseRandList = [];
    CourseCounter = 0;
    CourseQues = [];
    CourseRandFlag = false;
    document.getElementById('heart').style.backgroundColor = 'rgba(255, 182, 193, 0.2)';
    booked = false;
    // document.getElementById('btn').removeEventListener('click', start, false);
    document.getElementById('btn').addEventListener('click', start, false);
  });

  

  //リザルトからそのままリトライ
  let redoFunc = function() {
    document.getElementById('result_final').style.display = 'none';
    randArr(MylistRandList);
    if(CourseRandFlag) {
      console.log('courseQues randomed');
      randArr(CourseQues);
    }

    CourseCounter = 0;

    let resultf = document.getElementById('results_final');
    while(resultf.firstChild) {
      resultf.removeChild(resultf.firstChild)
    }
    document.getElementById('q').textContent = '';
    document.getElementById('inputs').textContent = '';
    document.getElementById('myAns').textContent = '';
    document.getElementById('correct').textContent = '';
    // document.getElementById('btn').style = 'display:block;';
    config.style.display = 'block';
    // document.getElementById('btn').removeEventListener('click', start, false);
  };


  //リザルト画面からリトライ
  document.getElementById('redo').addEventListener('click', function() {
    NGMode = false;
    redoFunc();
  }, false);
  document.getElementById('redo').addEventListener('click', start, false);

  document.getElementById('NGRedo').addEventListener('click',function() {
    NGMode = true;
    redoFunc();
    start();
  },false);








  //BGM
  document.getElementById('isBGM').addEventListener('click', function() {
    let BGM  = document.getElementById('BGM');
    let playing = document.getElementById('isBGM');
    let on = document.createTextNode('ON');
    let off = document.createTextNode('OFF');
    

    // BGM.currentTime = 0;

    if(playingBGM) {
      BGM.pause();
      playingBGM = false;
      playing.textContent = '';
      playing.appendChild(off);
    } else {
      BGM.play();
      playingBGM = true;
      playing.textContent = '';
      playing.appendChild(on);
    }
  });

  
}); //DOMContentLoaded



























new Vue({
  el:'.rayout',
  data: {
    isModalOpen: false,
    creatingMylist:false,
    editingMylist: false,
    editingExMylist: false,
    editingNumber: null,
    show: true,
    alreadyCreatePitches: false,
    alreadyaddPitches: false,
    validStorageLength: null,
    
    tmpName: '',
    tmpPitchList: [],
    tmpSolfaPitchList: [],
    tmpPitchOrder: [],
    tmpSolfaPitchOrder:  [],
    tmpObject: {},

    pitchEditlist: 0,
    pitchDeletelist: 0,
    listEditlist: 0,
    pitchDeletelist: 0,

    count: 0,
    windowWidth: window.innerWidth,

  },

  methods: {

    createMylist() {
      this.isModalOpen = true;
      this.creatingMylist = true;
      this.editingMylist = false;
      let keyboard = document.getElementsByClassName('keyboard');
      keyboard[0].style.display = 'none';
    },

    cancelCreateMylist() {
      this.isModalOpen = false;
      this.creatingMylist = false;
      this.editingMylist  = false;

      this.tmpPitchOrder = [];
      this.tmpSolfaPitchOrder = [];
      this.tmpPitchList = [];
      this.tmpSolfaPitchList = [];
      this.tmpName = '';
      let keyboard = document.getElementsByClassName('keyboard');
      keyboard[0].style.display = 'flex';
      keyboard[0].style.position = 'relative';
      keyboard[0].style.top = "0";
      keyboard[0].style.left = "0";

    },

    setNewMylistName() {
      if(!this.tmpName) {
        return;
      }

      this.creatingMylist = false;
      this.editingMylist = true;
      this.editingExMylist = false;
      

      let keyboard = document.getElementsByClassName('keyboard');
      keyboard[0].style.display = 'flex';
      keyboard[0].style.position = 'fixed';

      if(this.windowWidth > 800) {
        keyboard[0].style.top = "258px";
        keyboard[0].style.left = "278px";
      } else {
        keyboard[0].style.top = "220px";
        keyboard[0].style.left = "-5%";
        keyboard[0].style.width = "100%";
      }


      tmpSolfaPitchList = [];

      if(!this.alreadyCreatePitches) {
        this.createPitches();
      }
    },


    createPitches() {
      let keys = document.getElementsByClassName('wkey');
      let _this = this;
      this.alreadyCreatePitches = true;

      for(let i=0; i<keys.length; i++) {
        keys[i].addEventListener('click', function() {
          console.log(keys.length);
          console.log(_this.editingMylist);
          if(_this.editingMylist && _this.tmpPitchOrder.length < 9) {
            let degree = i % 7 + 1;

            let result = _this.Solfa(degree);

            _this.tmpPitchOrder.push(i - 7);
            _this.tmpSolfaPitchOrder.push(result);
            console.log(i % 7 + 1);
            console.log(_this.tmpPitchOrder);
          }

        });

      }
    },

    deletePitch() {
      if(this.tmpPitchOrder.length > 0) {
        this.tmpPitchOrder.pop();
        this.tmpSolfaPitchOrder.pop();
      }
    },

    addPitchOrder() {
      if(this.tmpPitchOrder.length > 0) {
        let len = this.tmpPitchList.length;
        this.tmpPitchList[len] = this.tmpPitchOrder;

       
        
        let pitchTable = document.getElementById('newMylistBody');

        let newRow = pitchTable.insertRow();

        let newCell = newRow.insertCell();
        let newText = document.createTextNode(this.tmpSolfaPitchOrder);
        newCell.appendChild(newText);

        newCell = newRow.insertCell();
        newCell.className = 'deletePitches';
        newText = document.createTextNode('削除');
        newCell.appendChild(newText);

        this.tmpPitchOrder = [];
        this.tmpSolfaPitchOrder = [];

        this.count++;
        console.log('this.count: ' + this.count)
        this.deletePitchOrder();

      }


    },


    deletePitchOrder() {
      let _this = this;
      this.count++;
      let count = this.count;
      console.log('deletePitchOrder, count = ' + count);
      this.alreadyDeletePitchOrder = true;
      this.deletePitchList = document.getElementsByClassName('deletePitches');

      for(let i=0; i<this.deletePitchList.length; i++) {
        this.deletePitchList[i].addEventListener('click', function() {
          if(_this.count > count) {return 0;}
          _this.tmpPitchList.splice(i, 1);
          let table = document.getElementById('newMylistBody');
          console.log('i: '+ i);
          table.deleteRow(i);
          console.log('delete' + i);
          console.log('tmpPitchList: ' + _this.tmpPitchList);
          _this.deletePitchList = document.getElementsByClassName('deletePitches');
          console.log('deletePitchList: ' + _this.deletePitchList);
          _this.deletePitchOrder();
          return 0;
        });
      }

      this.deletePitchList = document.getElementsByClassName('deletePitches');
    },





    registerMylist() {
      if(this.tmpPitchList.length > 0 && this.editingExMylist === false) {
        let len = this.validStorageLength;
        console.log('len: ' + len);
        this.tmpObject = {
          id: len + 1,
          name: this.tmpName,
          list: this.tmpPitchList
        };

        localStorage.setItem(len, JSON.stringify(this.tmpObject));
        console.log(JSON.parse(localStorage.getItem('len')));


        this.isModalOpen = false;
        this.editingMylist = false;
        this.creatingMylist = false;

        let keyboard = document.getElementsByClassName('keyboard');
        keyboard[0].style.position = 'relative';
        keyboard[0].style.top = "0";
        keyboard[0].style.left = "0";
 
        this.showMylists();

        this.tmpPitchList = [];
        this.tmpName = '';
        

      } else if(this.tmpPitchList.length > 0 && this.editingExMylist === true) {
        this.tmpObject = {
          id: this.editingNumber + 1,
          name: this.tmpName,
          list: this.tmpPitchList
        };

        localStorage.setItem(this.editingNumber, JSON.stringify(this.tmpObject));
        console.log(JSON.parse(localStorage.getItem('len')));

        this.isModalOpen = false;
        this.editingMylist = false;
        this.editingExMylist = false;
        this.creatingMylist = false;

        let keyboard = document.getElementsByClassName('keyboard');
        keyboard[0].style.position = 'relative';
        keyboard[0].style.top = "0";
        keyboard[0].style.left = "0";
 
        this.show = true;
        this.showMylists();

        this.tmpPitchList = [];
        this.tmpName = '';

      }


    },




    showMylists() {

      let table = document.getElementById('mylistBody');
      table.textContent = '';

      let len = localStorage.length;
      let keyList = [];
      let errKeyList = [];

      //不正なローカルストレージをとりのぞく
      console.log('length: '+ localStorage.length);
      for(let i=0; i<len; i++) {
        keyList.push(localStorage.key(i));
      }
      for(let i=0; i<len; i++) {
        try {
          console.log(i);
          JSON.parse(localStorage[keyList[i]]);
          if(isNaN(JSON.parse(localStorage[keyList[i]]))) {
            console.log('not number error: ' +localStorage[keyList[i]]);
            errKeyList.push(keyList[i]);
          }
        } catch(e) {
          console.log('not JSON error: '+localStorage[keyList[i]]);
          errKeyList.push(keyList[i]);
        }
      }
      for(let i=0; i<errKeyList.length; i++) {
        delete localStorage[errKeyList[i]];
      }

      this.validStorageLength = localStorage.length;




      for(let i=0; i<localStorage.length; i++) {

        let newRow = table.insertRow();
        let object = JSON.parse(localStorage[i]);

        let newCell = newRow.insertCell();
        let newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox';
        newCheckBox.className = 'Mylist';
        newCell.appendChild(newCheckBox);

        newCell = newRow.insertCell();

        let newText = document.createTextNode(object.name);
        newCell.appendChild(newText);

        newCell = newRow.insertCell();
        newText = document.createElement('span');
        newText.className = 'MylistEdit';
        newText.textContent = '編集';
        newText.style.textDecoration = 'underline';
        newCell.appendChild(newText);



        newCell = newRow.insertCell();
        newText = document.createElement('span');
        newText.className = 'MylistDelete';
        if(i == 0) {
          newText.textContent = '';
        } else {
          newText.textContent = '削除';
        }
        newText.style.textDecoration = 'underline';
        newCell.appendChild(newText);

        this.count++;
        this.editingMylist = true;
        if(this.show && i == localStorage.length - 1) {
          this.show = false;
          this.editMylist();
          this.deleteMyList();
        }

      }

    },


    editMylist() {
      this.count++;
      let count = this.count;
      
      let mylists = document.getElementsByClassName('MylistEdit');
      console.log('mylists.length = '+mylists.length);
      let _this = this;

      
      
      for(let i=0; i<mylists.length; i++) {
        mylists[i].addEventListener('click', function() {
          let keyboard = document.getElementsByClassName('keyboard');
          keyboard[0].style.position = 'fixed';

          if(_this.windowWidth > 800) {
            keyboard[0].style.top = "258px";
            keyboard[0].style.left = "278px";
          } else {
            keyboard[0].style.top = "220px";
            keyboard[0].style.left = "-5%";
            keyboard[0].style.width = "100%";
          }

          _this.tmpName = '';
          _this.tmpSolfaPitchList = [];
          _this.tmpPitchList = []; 
          _this.editingNumber = null;
          _this.editingExMylist = true;


          _this.editingNumber = i;
          console.log(_this.editingNumber);
          _this.isModalOpen = true;
          _this.editingMylist = true;


          let object = JSON.parse(localStorage[i]);
          _this.tmpName = object.name;
          _this.tmpPitchList = object.list;


          if(!_this.alreadyCreatePitches) {
            _this.createPitches();
          }
          _this.$nextTick(function() {
            let pitchTable = document.getElementById('newMylistBody');
            pitchTable.textContent = '';

            
            console.log(object.list.length);
            for(let j=0; j<object.list.length; j++) {
              let tmp = [];
              console.log(object.list[j]);
              for(let k=0; k<object.list[j].length; k++) {
                tmp.push(_this.Solfa( (object.list[j][k]) % 7 + 1));
                console.log(object.list[j][k]);
              }
              _this.tmpSolfaPitchList.push(tmp);
            } 
  
            console.log('_this.tmpSolfaPitchList: ' + _this.tmpSolfaPitchList);
  
            for(let j=0; j<object.list.length; j++) {
              let tmp = _this.tmpSolfaPitchList[j];
              
              let newRow = pitchTable.insertRow();
  
              let newCell = newRow.insertCell();
              let newText = document.createTextNode(tmp);
              newCell.appendChild(newText);
      
              newCell = newRow.insertCell();
              newCell.className = 'deletePitches';

              newText = document.createTextNode('削除');
              newCell.appendChild(newText);

      
              this.count++;
              console.log('this.count: ' + this.count)
              this.deletePitchOrder();

            }
            return 0;

          });

          
        })
      }
    },

    deleteMyList() {
      let _this = this;

      this.$nextTick(function() {
        let mylists =document.getElementsByClassName('MylistDelete');
        this.show = true;
        console.log(mylists.length);

        for(let i=0; i<mylists.length; i++) {
          mylists[i].addEventListener('click', function() {
            let len = mylists.length;
            delete localStorage[i];
            localStorage[i] = '1';
            for(let j=i; j<(len - 1); j++) {
              console.log('これをずらす: ' + JSON.parse(localStorage[(j+1)]));
              let tmp = JSON.parse( localStorage[(j+1)] );
              console.log('これをいれる: ' + JSON.stringify(tmp));
              localStorage[j] = JSON.stringify(tmp);
            }

            delete localStorage[len - 1];
            console.log('最後を消す' + localStorage[len - 1]);

            _this.showMylists();
            return 0;

          });
        }

      });
    },



    Solfa(degree) {
      let result;
      switch(degree) {
        case 1:
          result = 'ド';
          break;
        case 2:
          result = 'レ';
          break;
        case 3:
          result = 'ミ';
          break;
        case 4:
          result = 'ファ';
          break;
        case 5:
          result = 'ソ';
          break;
        case 6:
          result = 'ラ';
          break;
        case 7:
          result = 'シ';
          break;
        default:
          result = '';
          break;
      }
      return result;
 
    }


    





  },

  mounted: function() {
      this.showMylists();
        //ブックマークストレージ
    if(!localStorage[0]) {
      let tmpObject = {
        id:1,
        name: "ブックマーク",
        list:[]
      }

      tmpObject = JSON.stringify(tmpObject);
      localStorage[0] = tmpObject;
    }
  }

})


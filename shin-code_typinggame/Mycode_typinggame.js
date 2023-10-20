// 下記は、ランダムな文章をとってくる、API です。
const RANDOM_SENTENCE_URL_API = 'https://api.quotable.io/random'
const $typeDisplay = document.getElementById('typeDisplay')
const $typeInput = document.getElementById('typeInput')
const $timer = document.getElementById('timer')
const typeSound = new Audio('./audio/typing-sound.mp3')
const correctSound = new Audio('./audio/correct.mp3')
const wrongSound = new Audio('./audio/wrong.mp3')

/* inputテキスト入力。合っているかどうかの判定。*/
$typeInput.addEventListener('input', test)

function test(e){
    typeSound.play() // audioフォルダのmp3を再生する。
    typeSound.currentTime = 0
    const sentenceArray = $typeDisplay.querySelectorAll('span') // <span>タグに囲まれた文字列を、抽出
    const arrayValue = $typeInput.value.split('') // テキストエリア内の文字列を、split
    sentenceArray.forEach((characterSpan, index)=>{ // テキストdisplay内の文字列を、全て、if文にかける。
        if(arrayValue[index]==null){ // テキストdisplayに対応した、インデックス番号の、テキストエリアがnullだったら、
            characterSpan.classList.remove('incorrect') // 初期状態を、代入します。
            characterSpan.classList.remove('correct')
        }else if(characterSpan.innerText===arrayValue[index]){ // テキストエリア内の文字列と、合致するか判定。
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        }else{ // テキストエリアがnullでなく、displayの文字と一致しなかった時、不正解の処理をします。
            characterSpan.classList.add('incorrect')
            characterSpan.classList.remove('correct')
            wrongSound.volume = 0.3 // サウンドの音量を調整できます。
            wrongSound.play()
            wrongSound.currentTime = 0
        }
    })
}
// $typeInput.addEventListener('input', test)で、HTMLのテキストエリアに、
// 書き込んだ際の、イベントを追加する。イベントの詳細は、APIから取得した文字列と、一致してるかの判定、
// および処理です。判定に使った、メソッドは、e.dataで、タイプした文字を取得する方法では、
// 削除を押したときの、文字列のカウントは。。まあ、やろうと思えばできるけど、
// 今回使ったのは、テキストエリアの中身を全て、テキストdisplayの文字列と、照らし合わせるメソッドです。
// 具体的には、forEach で、テキストエリアと、displayを、全て抽出して、メソッドの中で照らし合わせます。



/* 非同期でランダム(API)を取得する */
// 非同期処理とは、一つのタスクを実行中であっても他のタスクを実行できる実行方式をいいます
// API を叩くときはfetchを使うらしいです。
// Promiseオブジェクトとは、データをとってくる前の段階です。
function GetRandomSentence(){
    return fetch(RANDOM_SENTENCE_URL_API) // API をとってくる。
    .then((response)=>response.json()) // 取得したAPIを、responseという変数に入れて、json形式に変えます。
    .then((data)=>data.content) // json形式に変えたものを、dataという変数に入れて、data.contentというプロパティを参照する
}

/* ランダムな文章を取得して表示する */
// async と、 await をともに使うことで、Promiseオブジェクトではなく、APIを取得するまで、待つことができます。
async function RenderNextSentence(){ // async -> 非同期
    const sentence = await GetRandomSentence() // await -> APIがデータをとってくるまで、待ちます。

    /* 文章を1文字ずつ分解して、spanタグを生成する。*/
    $typeDisplay.innerText = '' // まずは、テキストdisplayを初期化
    let oneText = sentence.split("") // splitで、文字列を一文字ずつ、配列に格納。
    oneText.forEach((character)=>{ // APIからとってきた文字列を配列にしたのを、forEachで回す。
        const characterSpan = document.createElement('span') // spanタグ生成
        characterSpan.innerText = character // 文字を、spanタグに格納
        $typeDisplay.appendChild(characterSpan) // spanタグを一つずつ、DOM要素タグ内に挿入する。
    })
    // 一つずつの文字列に、cssを当てたいので、文字、それぞれを、<span>タグ内に挿入する。
    // APIからとってきた複数行にわたる文字列を、splitメソッドで、一文字ずつ区切り、配列する。
    // splitメソッドで作った配列を、forEach処理内で作成した、<span>タグ内に、挿入する。
    // 一つずつの文字列を<span>タグで囲んだ、APIから取得した、複数行の文字列を、
    // <id=typeDisplay>タグ内に挿入する。

    /* テキストボックスの中身を消す */
    $typeInput.value = ''
    // リロードした時に、テキストエリアをリセットします。

    /* タイマーのメソッドを呼ぶ。*/
    StartTimer()
}

// タイマーのメソッド。
// グローバル変数も定義されてる。
let startTime
let originTime = 20 // タイマーの設定を、仕様変更できるようにするために、グローバル変数としてセット
function StartTimer(){
    $timer.innerText = originTime
    startTime = new Date() // 現在の時刻をもっている、Dateオブジェクトをインスタンス化します。
    setInterval(()=>{
        $timer.innerText = originTime - getTimerTime()
        if(timer.innerText <= 0){TimeUp()}
    }, 1000)
}
function getTimerTime(){
    return Math.floor((new Date() - startTime) / 1000)
}
function TimeUp(){
    RenderNextSentence() // スタートアップ関数をリロードしてます。
}
// タイマーの設定ですね。
// なんか正味、なにをやっているかわからないというか、
// なんで、こんなわかりずらい方法でやっているんだろう。
// タイマーなんてもっと簡単に作れるだろう。

RenderNextSentence()








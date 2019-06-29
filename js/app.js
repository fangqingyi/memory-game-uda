/*
 * 创建一个包含所有卡片的数组
 */
var pictures = ["fa-user", "fa-user", "fa-tree", "fa-tree",
				"fa-television", "fa-television", "fa-bell", "fa-bell",
				"fa-coffee", "fa-coffee", "fa-cog", "fa-cog",
				"fa-clone", "fa-clone", "fa-heart-o", "fa-heart-o"];
var openCardsArray = [];//定义一个空的数组作为翻开的卡片数组

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */
$(".fa-repeat").click(function(e) {
    newPic = shuffle(pictures);        //卡片数组随机化
    let cardsFrag = document.createDocumentFragment(); //利用Fragment构建新的卡片网格
    for (var i = newPic.length - 1; i >= 0; i--) {
        let cardLi = document.createElement("li");
        cardLi.classList.add("card");//创建类为card的li元素
        let cardFa = document.createElement("i");
        cardFa.classList.add("fa");
        cardFa.classList.add(newPic[i]);//创建类为fa fa-***的i元素
        cardLi.appendChild(cardFa);
        cardsFrag.appendChild(cardLi);//加入到Fragment中
    }
    $(".wangge").empty();//清空原卡片网格
    $(".wangge").append(cardsFrag);//添加随机过的卡片网格
    var isCountTime = false;//定义计时器为未打开状态
    var countMoves = 0;//初始步数为0
    var isGameover = false;
    constructStars();//恢复3星
});

//恢复星级的函数  
function constructStars() {
    let starsFrag = document.createDocumentFragment();//利用Fragment
    for (var i = 0; i < 3; i++) {
        let starLi = document.createElement("li");
        let starFa = document.createElement("i");
        starFa.classList.add("fa");
        starFa.classList.add("fa-star");
        starLi.append(starFa);
        starsFrag.append(starLi);    
    }
    $('stars').empty();
    $('stars').append(starsFrag);
    document.getElementsByClassName("moves").textContent = 3;
}

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//点击卡片后翻开，添加到openCardsArray数组
function openCard(thisCard) {
    thisCard.classList.add("open");
    thisCard.classList.add("show");
    openCardsArray.push(thisCard);
}

//检查两张卡片是否匹配，匹配则添加类match
function isMatching(cardOne, cardTwo) {
    if (cardOne.classList[1] === cardTwo.classList[1]) {//如果匹配，则保留类match
        cardOne.removeClass("open show");
        cardTwo.removeClass("open show");
        cardOne.addClass("match");
        cardTwo.addClass("match");
        openCardsArray.pop();
        openCardsArray.pop();
        cardOne.off('click');                           //匹配成功的卡片去除点击事件
        cardTwo.off('click');
    } else {                                            //如果不匹配，则翻回去
        cardOne.removeClass("open show");
        cardTwo.removeClass("open show");
        openCardsArray.pop();
        openCardsArray.pop();
    }
}

//统计所有卡片是否都已经匹配
function isGameover() {
    const matchCards = document.querySlectorAll(".match");
    if (matchCards.length === 16) {
        return true;
    }
}

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
$(".card").click(function(e){
    if (!isCountTime) {                     //第一步打开计时器
        var seconds = 0;
        $('body').everyTime('1s', 'jishiqi', function() {
            seconds += 1;
        });
        isCountTime = true;
    }
    isGameover();                    //判断游戏是否结束
    if (isGameover) {               //如果游戏结束，则没有点击效果，且停止计时
        $('body').stopTime('jishiqi');
        afterGameover();
        $('#myModal').modal(show);
        return;
    }
    if (openCardsArray.length === 2 ) {     //判断有效点击，如果有卡片正在匹配，则不可点击
        return;
    }
    countMoves += 1;              //有效点击次数+1
    if (countMoves === 23 || countMoves === 28) {      //判断有效点击次数的值，达到23，28步时减少一个星级
        $('.fa-star')[0].remove();
        let movesText = document.getElementsByClassName("moves");
        movesText.textContent = `${$('.fa-star').length}`;  //显示星星的数目
    }
    openCard(this);                  //调用函数翻开卡片
    isMatching(openCardsArray[0], openCardsArray[1]);      //判断卡片是否匹配
});

function afterGameover() {               //修改模态框文本
    const grade = document.createElement("p");
    grade.textContent = `spend ${seconds} seconds, move ${countMoves}, get ${$('.fa-star').length} stars`;//游戏结束后，弹窗显示步数，时间，星级，
    $('modal-body').append(grade);
}
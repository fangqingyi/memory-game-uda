/*
 * 创建一个包含所有卡片的数组
 */
var pictures = ["fa-user", "fa-user", "fa-tree", "fa-tree",
				"fa-television", "fa-television", "fa-bell", "fa-bell",
				"fa-coffee", "fa-coffee", "fa-cog", "fa-cog",
				"fa-clone", "fa-clone", "fa-heart-o", "fa-heart-o"];
var openCardsArray = [];//定义一个空的数组作为翻开的卡片数组
var countMoves = 0;//初始步数为0
var isGameover = false;//判断游戏状态为未完成
var isCountTime = false;//计时器状态为关闭，或者考虑new Date()?
var numOfStars = 3;//初始星星3颗
var startTimeS = 0;//定义初始时间
/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */
$(".fa-repeat").click(function(e) {
    var newPic = shuffle(pictures);        //卡片数组随机化
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
    reStarsMoves();
    countMoves = 0;
    isGameover = false;
    isCountTime = false;
});

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

//一个在游戏结束后重置stars和moves的函数
function reStarsMoves() {
    let starsFrag = document.createDocumentFragment();
    for (var i = 0; i < 3; i++) {
        const starLi = document.createElement('li');
        const starFa = document.createElement('i');
        starFa.classList.add('fa');
        starFa.classList.add('fa-star');
        starLi.appendChild(starFa);
        starsFrag.appendChild(starLi);
    }
    const starsList = document.querySelector('.stars');
    starsList.innerHTML = "";
    starsList.appendChild(starsFrag);
    document.querySelector('.moves').textContent = 0;
}

//点击卡片后翻开，添加到openCardsArray数组
function openCard(x) {
    x.classList.add('show');
    x.classList.add('open');
    openCardsArray.push(x);
}

//检查两张卡片是否匹配，匹配则添加类match
function isCardsMatching(x, y) {
    if (x.firstElementChild.classList[1] === y.firstElementChild.classList[1]) {
        x.classList.add('match');
        y.classList.add('match');
        x.classList.remove('open');
        x.classList.remove('show');
        y.classList.remove('open');
        y.classList.remove('show');
        openCardsArray.pop();
        openCardsArray.pop();
    } else {
        x.style.backgroundColor = "red";
        y.style.backgroundColor = "red";
        x.classList.add('animated');
        y.classList.add('animated');
        x.classList.add('pulse');
        y.classList.add('pulse');
        setTimeout(function() {
            x.classList.remove('open');
            x.classList.remove('show');
            y.classList.remove('open');
            y.classList.remove('show');
            x.classList.remove('animated');
            y.classList.remove('animated');
            x.classList.remove('pulse');
            y.classList.remove('pulse');
            x.style.backgroundColor = "#2e3d49";
            y.style.backgroundColor = "#2e3d49";
            openCardsArray.pop();
            openCardsArray.pop();
        }, 1500);
    }
}

//统计所有卡片是否都已经匹配
function isGameOver() {
    const matchingCards = document.querySelectorAll('.match');
    if (matchingCards.length === 16) {
        isGameover = true;
    }
}

//减去星级,显示点击数的函数
function starsMoves(x) {
    const numOfMoves = document.querySelector('.moves');
    numOfMoves.textContent = x
    if (x ===23 || x === 29) {
        const aStar = document.querySelector('.fa-star');
        aStar.remove();
        numOfStars = document.querySelectorAll('.fa-star').length;
    }
}

//一个结束时的函数显示成绩
function afterGame(x, y) {
    const endTime = new Date();
    const endTimeS = endTime.getTime();
    const spendingTime = (endTimeS - x)/1000;
    const textGrade = "You win the game, spending " + spendingTime + "seconds, " + countMoves + "moves, and get " + y + "star(s)!";
    swal({
        title: "Good job!",
        text: textGrade,
        icon: "success",
        button: "Click the Button Upright to Play Again",
    });
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
const cardWangge = document.querySelector('.wangge');
cardWangge.addEventListener('click', function(eve) {   //监听器放在父元素<ul>上
    if (eve.target.nodeName.toLowerCase() === 'li' && !(eve.target.classList.contains('open'))) { //点击在card上，且card不是open状态
        if (!isCountTime) {                            //打开计时器，获取开始游戏的时间
            const startTime = new Date();
            startTimeS = startTime.getTime();
            isCountTime = true;
        }
        if (openCardsArray.length === 2) {    //在匹配时不能点击
            return;
        }
        if (isGameover) {                 //游戏结束也不能点击
            return;
        }
        countMoves += 1;       //有效点击次数+1
        starsMoves(countMoves);
        openCard(eve.target);
        if (openCardsArray.length === 2) {
            isCardsMatching(openCardsArray[0], openCardsArray[1]);
        }
        isGameOver();
        if (isGameover) {
            afterGame(startTimeS, numOfStars);
        }
    }
});
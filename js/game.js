function Game(row, col, img,callback,success) {
    this.con = document.getElementById('container');
    this.item = [];
    this.gutter=2;
    this.row = row || 3;
    this.col = col || 3;
    this.conwidth = this.con.offsetWidth-this.gutter*(this.col*2);
    this.conheight = this.con.offsetWidth/0.75-this.gutter*(this.row*2);
    this.minwidth = this.conwidth / this.col;
    this.minheight = this.conheight / this.row;
    this.num = this.row * this.col;
    this.arr = [];//初始化数组;
    this.newarr = [];//随机图片数组;
    this.pos = [];//存放位置的
    this.img = img ;
    this.init(callback);
    this.len = this.arr.length;
    this.minIndex = 10;
    this.success=success;
}
Game.prototype.init = function (callback) {
    var that=this;
    this.con.innerHTML = '';
    for (var i = 1; i <= that.num; i++) {
        that.arr.push(i);
    }
    that.newarr = that.arr.slice(0);
    var oFrag = document.createDocumentFragment();
    var image=new Image();
    image.src=that.img;
    image.onload=function(){
        if(callback)
            callback();
    }
    for (var i = 0; i < that.num; i++) {
        var div = document.createElement('div');
        div.style.cssText = 'background:url('+that.img+') no-repeat -' + (i % that.col) * that.minwidth + 'px -' + Math.floor((i) / that.col) * that.minheight + 'px;height:' + that.minheight + 'px;width:' + that.minwidth + 'px;';
        div.style.backgroundSize = that.conwidth + 'px ' + that.conheight + 'px';
        that.item.push(div);
        oFrag.appendChild(div);
    }
    that.con.style.height=that.conheight+that.gutter*2*that.col + 'px ';
    that.con.appendChild(oFrag);

};
Game.prototype.isSuccess = function () {
    for (var i = 0; i < this.len - 1; i++) {
        if (this.newarr[i] != this.arr[i]) {
            return false;
        }
    }
    return true;
};
Game.prototype.startGame = function () {
    this.newarr.sort(function (a, b) {
        return Math.random() > 0.5 ? 1 : -1;
    });
    for (var i = 0; i < this.len; i++) {
        this.pos[i] = [this.item[i].offsetLeft-this.gutter, this.item[i].offsetTop-this.gutter];

    }
    for (var i = 0; i < this.len; i++) {
        var n = this.newarr[i] - 1;

        this.item[i].style.left = this.pos[i][0]+'px';
        this.item[i].style.top = this.pos[i][1]+'px';
        this.item[i].style.backgroundPosition = '-' + (n % this.col) * this.minwidth + 'px -' + Math.floor((n) / this.col) * this.minheight + 'px';
        this.item[i].style.position = 'absolute';
        this.item[i].index = i;
        this.drag(this.item[i]);
    }
}
Game.prototype.drag = function (o) {
    var self = this, near = null;
    var start = function(e){
        e.preventDefault();
        e.stopPropagation();
    };
    var move = function(e){
        e.preventDefault();
        e.stopPropagation();
        near = self.findNear(o);
        if (near) {
            near.className = 'active';
        }
        var disX = e.touches[0].pageX,
            disY = e.touches[0].pageY;
        o.style.left = (disX- o.offsetWidth/2)*0.0625 + 'rem';
        o.style.top = (disY-o.offsetHeight)*0.0625 + 'rem';

    }
    var end = function(e){

        if (near) {
            near.className = '';
            self.move(o, {left: self.pos[near.index][0], top: self.pos[near.index][1]});
            self.move(near, {left: self.pos[o.index][0], top: self.pos[o.index][1]});

            var temp = 0;
            temp = near.index;
            near.index = o.index;
            o.index = temp;

            for (var i = 0; i < self.len; i++) {
                self.arr[i] = (self.item[i].index + 1);
            }
            if (self.isSuccess()) {
                self.tips()
            }
        } else {
            clearInterval(o.timer);
            self.move(o, {left: self.pos[o.index][0], top: self.pos[o.index][1]})

        }
        e.preventDefault();
        e.stopPropagation();
    }
    o.addEventListener("touchstart", start, false);
    o.addEventListener("touchmove", move, false);
    o.addEventListener("touchend", end, false);
};
Game.prototype.move = function (o, json, fn) {
    o.timer && clearInterval(o.timer);
    o.timer = setInterval(function () {
        var bStop = true;
        for (var i in json) {
            var iCur = parseInt(css(o, i));
            var iSpeed = (json[i] - iCur) / 5;
            if(iCur+5>=json[i] && iCur<=json[i]){//模糊匹配坐标
                iCur=parseInt(json[i]);
            }
            if (json[i] != iCur) {
                bStop = false;
            }
            o.style[i] = (iCur + iSpeed) + 'px';
        }
        if (bStop) {
            clearInterval(o.timer);
            typeof fn == 'function' && fn();
        }
    }, 10);
    function css(o, attr) {
        return o.currentStyle ? parseFloat(o.currentStyle[attr]) : parseFloat(getComputedStyle(o, false)[attr]);
    }

};
Game.prototype.tips = function () {
    if(this.success)
        this.success();
    //function updatetime() {
    //    t.innerHTML = tn--;
    //    if (tn < 0) {
    //        //suc.classList.remove('show');
    //        clearInterval(timer);
    //        lv++;
    //        //t = new Game(lv+1, lv);
    //        //t.startGame();
    //    } else {
    //        timer = setTimeout(function () {
    //            updatetime();
    //        }, 1000)
    //    }
    //
    //}
    //
    //updatetime();
};
Game.prototype.checkPZ = function (o1, o2) {
    if (o1 == o2)return;
    var l1 = o1.offsetLeft, t1 = o1.offsetTop, r1 = o1.offsetWidth + l1, b1 = o1.offsetHeight + t1;
    var l2 = o2.offsetLeft, t2 = o2.offsetTop, r2 = o2.offsetWidth + l2, b2 = o2.offsetHeight + t2;
    if (l1 > r2 || t1 > b2 || r1 < l2 || b1 < t2) {
        return false;
    }
    else {
        return true;
    }
};
Game.prototype.findNear = function (o) {
    var iMin = 99999, index = -1;
    for (var i = 0; i < this.len; i++) {
        this.item[i].className = '';
        if (this.checkPZ(o, this.item[i])) {
            var l = dis(o, this.item[i]);
            if (iMin > l) {
                iMin = l;
                index = i;
            }
        }
    }
    if (index == -1) {
        return null;
    }
    else {
        return this.item[index];
    }

    function dis(o1, o2) {
        var c1 = o1.offsetLeft - o2.offsetLeft, c2 = o1.offsetTop - o2.offsetTop;
        return Math.sqrt(c1 * c1 + c2 * c2);
    }
};



var lv = 3;
var c;
var cc;
var successCall = function(){
    var con=$('#container');
    $('.page2').hide();
    clearInterval(cc);
    $('#success-box').addClass('show');
    $('#remain').html(50-$('#cd').html()+'秒');
    var product=JSON.parse(con.attr('data-product'));
    var img=con.attr('data-img');
    $('#success-img').attr('src',img);
    $('.couponCode').html(product.coupon);
    $('.discount').html(product.discount+'折');
    $('.productId').html(product.id);
}
$(function(){
    $('[reset-btn]').on('click',function(){
        resetGame();
        var img=$('#container').attr('data-img');
        clearInterval(cc);
        startGame(img);
    })
    $('[share-btn]').on('click',function(){
        $('.fx').show();
    })
    $('.fx').on('click',function(){
        $(this).hide();
    })
    var resetGame = function(){
        $('.page1').show();
        $('.page2').hide();
        $('#fail-box').removeClass('show');
        $('#success-box').removeClass('show');
        $('#mask').hide();
        $('.top img').removeClass('flash');
    }

    $('.mini li').on('click',function(){
        var img=$(this).attr('data-img');
        var con=$('#container');
        con.attr('data-img',img);
        con.attr('data-product',$(this).attr('data-product'));
        $('.page2').show();
        $('.page1').hide();
        startGame(img);
    })

    var startGame=function(img){
        var con=$('#container');
        clearInterval(c);
        var g = new Game(lv+1, lv,img,function(){
            con.addClass('anime');
            var t=5;
            c=setInterval(function(){
                if(t<=0){
                    g.startGame();
                    setTimeout(function(){
                        $('#container').removeClass('anime');
                    },200);
                    clearInterval(c);
                    playDown(c);
                }else{
                    t--;
                    $('#cd').html(t);
                }
            },1000);
        },successCall);
    };
    var playDown = function(){
        var cd=50;
        clearInterval(cc);
        cc=setInterval(function(){
            if(cd<=10){
                $('.top img').addClass('flash');
            }
            if(cd<=0){
                clearInterval(cc);
                $('#fail-box').addClass('show');
                $('#mask').show();
            }else{
                cd--;
                $('#cd').html(cd);
            }
        },1000);
    }
});

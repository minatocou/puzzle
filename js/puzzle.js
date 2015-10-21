(function ($) {
    $.fn.puzzle= function (opts, callback) {
        return new puzzle(this[0], opts,callback);
    };
    var puzzle = function (ele,opts, callback) {
        this.box=ele;
        this.column=opts.column;
        this.imgPath=opts.imgPath;
        this.createPanel(callback);
    };
    puzzle.prototype = {
        imgPath:null,
        init: function(){
            this.count=this.column? Math.pow(this.column,2) : 3;
            this.width=parseInt($(window).width()-(10+(this.column-1)*5));
            this.setting={
                columns:this.column,
                base:parseInt(this.width/this.column),
                gutter:5,
                callbacks: { reordering: this.reordering , reordered: this.reordered }
            }
        },
        upset: function(call){
            this.positions=[];
            var that=this;
            $(call).find('> *').each(function(){
                that.positions.push({x:$(this).position().left,y:$(this).position().top})
            })
            that.positions.sort(function(){return Math.random()>0.5?-1:1;});
            for(var i in that.positions){
                var item=$(call).find('> *').eq(i);
                item.css('left',that.positions[i].x);
                item.css('top',that.positions[i].y);
            }
            console.log(that.positions);
        },
        reordering : function($elements) {
            //拖动start
        },
        reordered : function($elements) {
            //拖动end
        },

        createPanel: function(callback){
            this.init();
            this.$box=$(this.box);
            this.$box.html('');
            this.$box.width(this.width);
            for(var i=0;i<this.count;i++){
                var x=(i%this.column)*parseInt(this.width/this.column);
                var y=parseInt(i/this.column)*parseInt(this.width/this.column);
                var item=$('<div class="item"></div>').appendTo(this.$box);
                item.css({width:this.setting.base,height:this.setting.base,'backgroundImage':'url('+this.imgPath+')','backgroundPosition':'-'+x+'px '+'-'+y+'px','backgroundSize':'auto '+this.width+'px'})
            }
            var $b=this.$box.gridly(this.setting);
            this.upset($b);
            if(callback){
                callback($b);
            }
        }
    };
})(jQuery);
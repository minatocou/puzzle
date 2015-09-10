(function ($) {
    $.fn.puzzle= function (opts, callback) {
        return new puzzle(this[0], opts,callback);
    };
    var puzzle = function (ele,opts, callback) {
        this.box=ele;
        this.column=opts.column;
        this.imgPath=opts.imgPath;
        this.createPanel();
        if (callback) {
            callback();
        }
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
        reordering : function($elements) {
            //拖动start
        },
        reordered : function($elements) {
            //拖动end
        },
        createPanel: function(){
            this.init();
            this.$box=$(this.box);
            this.$box.width(this.width);
            for(var i=0;i<this.count;i++){
                var x=(i%this.column)*parseInt(this.width/this.column);
                var y=parseInt(i/this.column)*parseInt(this.width/this.column);
                var item=$('<div class="item"></div>').appendTo(this.$box);
                item.css({width:this.setting.base,height:this.setting.base,'backgroundImage':'url('+this.imgPath+')','backgroundPosition':'-'+x+'px '+'-'+y+'px','backgroundSize':'auto '+this.width+'px'})
            }
            this.$box.gridly(this.setting);
        }
    };
})(jQuery);
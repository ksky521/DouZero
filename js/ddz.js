var Tool = {
	isObject: function(obj){
        return typeof obj === "object";
    },
    //判断一个变量的constructor是否是Object
    isPlainObject: function(obj){
        return this.getType(obj) === "Object";
    },
    isDOM: function(obj){
        return obj && obj.nodeType === 1;
    },
    isUndefined: function(obj){
        return typeof obj === "undefined";
    },
    isFunction: function(obj){
        return this.getType(obj) === "Function";
    },
    isNumber: function(obj){
        return this.getType(obj) === "Number";
    },
    isString: function(obj){
        return this.getType(obj) === "String";
    },
    
    isArray: function(obj){
        return this.getType(obj) === "Array";
    },
    getType: function(obj){
        return Object.prototype.toString.call(obj).slice(8, -1);
    }
};


function Poker(){

}
Poker.prototype.pokers = [
	115,103,104,105,106,107,108,109,110,111,112,113,114,
	215,203,204,205,206,207,208,209,210,211,212,213,214,
	315,303,304,305,306,307,308,309,310,311,312,313,314,
	415,403,404,405,406,407,408,409,410,411,412,413,414,
	518,519];
Poker.prototype.huaArray = {
	1:'meihua',//梅花
	2:'fangkuai',//方块
	3:'heitao',//黑桃
	4:'hongtao',//红桃
	5:''//大王
};
/**
 * 获取牌的花色
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.prototype.getHua = function(poker){
	return Math.floor(poker/100);
}
/**
 * 获取牌的花色名称
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.prototype.getHuaStr = function(poker){

		return this.huaArray[this.getHua(poker)];
}
/**
 * 获取牌的牌面大小
 * @param  {[type]} poker [description]
 * @return {[type]}       [description]
 */
Poker.prototype.getPai = function(poker){
	return poker%100;
}
/**
 * 生成随机发牌数组
 * 会清空this.pokers
 * @return {[type]} [description]
 */
Poker.prototype.getRandomPokers = function(){
	var pokers = this.pokers,
		temp = [];
	while(pokers.length){
		temp.push(pokers.splice(random(pokers.length-1),1)[0]);
	}
	return temp;
}
/**
 * 随机从给定的数组中获取一张牌
 * @param  {Array} pokers [description]
 * @return {[type]}        [description]
 */
Poker.prototype.getOneRandomPoker = function(pokers){
	var len = pokers.length;
	if(len){
		return pokers[random(len-1)];
	}
	return false;
}
/**
 * 按照牌面大小排序
 * @param  {Array} pokers [description]
 * @return {[type]}        [description]
 */
Poker.prototype.sort = function(pokers){
	return pokers.sort(function(a,b){
				a = a%100;
				b = b%100;
				return a-b;
			});
}



/**
 * 斗地主游戏规则类
 * 继承自Poker
 */
function Rule(){

	this.getOppoTypes();
}
classExtends(Poker,Rule);

/**
　(1) 单张：前面提到过，大小顺序从3(最小)到大怪(最大)；
　　(2) 一对：两张大小相同的牌，从3(最小)到2(最大)；
　　(3) 三张：三张大小相同的牌；
　　(4) 三张带一张：三张并带上任意一张牌，例如6-6-6-8，根据三张的大小来比较，例如9-9-9-3盖过8-8-8-A；
　　(5) 三张带一对：三张并带上一对，类似扑克中的副路(Full House)，根据三张的大小来比较，例如Q-Q-Q-6-6盖过10-10-10-K-K；
　　(6) 顺子：至少5张连续大小(从3到A，2和怪不能用)的牌，例如8-9-10-J-Q；
　　(7) 连对：至少3个连续大小(从3到A，2和怪不能用)的对子，例如10-10-J-J-Q-Q-K-K；
　　(8) 三张的顺子：至少2个连续大小(从3到A)的三张，例如4-4-4-5-5-5；
　　(9) 三张带一张的顺子：每个三张都带上额外的一个单张，例如7-7-7-8-8-8-3-6，尽管三张2不能用，但能够带上单张2和怪；
　　(10) 三张带一对的顺子：每个三张都带上额外的一对，只需要三张是连续的就行，例如8-8-8-9-9-9-4-4-J-J，尽管三张2不能用，但能够带上一对2【不能带一对怪，因为两张怪的大小不一样】，这里要注意，三张带上的单张和一对不能是混合的，例如3-3-3-4-4-4-6-7-7就是不合法的；
　　(11) 炸弹：四张大小相同的牌，炸弹能盖过除火箭外的其他牌型，大的炸弹能盖过小的炸弹；
　　(12) 火箭：一对怪，这是最大的组合，能够盖过包括炸弹在内的任何牌型；
　　(13) 四张套路(四带二)：有两种牌型，一个四张带上两个单张，例如6-6-6-6-8-9，或一个四张带上两对，例如J-J-J-J-9-9-Q-Q，四带二只根据四张的大小来比较，只能盖过比自己小的同样牌型的四带二【四张带二张和四张带二对属于不同的牌型，不能彼此盖过】，不能盖过其他牌型，四带二能被比自己小的炸弹盖过。
　
　　另外，这次不出并不意味着放弃下次出牌的权利。
　　例如，玩家A(地主)出了3-3-3-9以剔除一些小的牌，B不出，C出了5-5-5-7，A再出K-K-K-J，B再出A-A-A-3，C和A都不出，因此接下来B就能领出任意牌，他出一张4。
　　这里要注意，B可以在第一次就出A-A-A-3，但他宁愿不出来给同伴出牌的机会，让同伴剔除一些小的牌。这时C应尽可能盖过，以免让A再有领出的机会。B再次盖过A后，出了一张很小的牌来给C出牌废牌的机会，当然C也可以出一张大牌来对地主施压。
**/
Rule.prototype.types = {
	'单张': 1,
	'对子': 2,
	'火箭': 2,
	'三张': 3,
	'炸弹': 4,
	'三带一': 4,
	'五张顺子': 5,
	'三带二': 5,
	'六张顺子': 6,
	'三连对': 6,
	'四带二': 6,
	'二连飞机': 6,
	'七张顺子': 7,
	'八张顺子': 8,
	'四连对': 8,
	'二连飞机带翅膀': 8,
	'九张顺子': 9,
	'三连飞机': 9,
	'十张顺子': 10,
	'五连对': 10,
	'二连飞机带二对': 10,
	'十一张顺子': 11,
	'十二张顺子': 12,
	'六连对': 12,
	'四连飞机': 12,
	'三连飞机带翅膀': 12,
	'七连对': 14,
	'五连飞机': 15,
	'三连飞机带三对': 15,
	'八连对': 16,
	'四连飞机带翅膀': 16,
	'九连对': 18,
	'六连飞机': 18,
	'十连对': 20,
	'五连飞机带翅膀': 20
}
/**
 * 根据length反查map
 * @type {Object}
 */
Rule.prototype.oppoTypes = {};
/**
 * 生成反查map
 * @return {[type]} [description]
 */
Rule.prototype.getOppoTypes = function(){
	var obj = this.oppoTypes,
		types = this.types;
	for(var i in types){
		
		if(types.hasOwnProperty(i)){

			obj[types[i]] = obj[types[i]] || [];
			obj[types[i]].push(i);
		}
	}
}
/**
 * 获取牌的类型
 * @param  {[type]} cards [description]
 * @return {[type]}       [description]
 */
Rule.prototype.getType = function(cards){
	var len = cards.length,
		types = this.oppoTypes[len],
		type,back,
		getType;
	if (len && types && types.length) {
		var i = 0;
		
		while ((type = types[i++] )&& (getType = this['is'+type]) ){
			if (back = getType.call(this,cards)) {
				
				return {
					value:back,
					type:type
				};
			}
		}
		return false;
	}
	return false;
}
/**
 * 添加判断牌面类型规则
 * 返回的是最小的一张判断的牌面，
 * 	例如三带一，返回三中的牌面
 */
mix(Rule.prototype,{
	'is顺':function(cards){
		var len = cards.length;
		if(len>1 && len <15){
			var arr = this.sort(cards),
				val1,val2;
			
			for(var i = 0; i < len-1; i++){
				val1 = this.getPai(arr[i]);
				val2 = this.getPai(arr[i+1]);
				
				if(val1!==val2-1){
					return false;
				}
			}
			return this.getPai(arr[0]);
		}
		return false;
	},
	'is连对':function(cards){
		if(cards.length%2!==0){
			return false;
		}
		var arr = this.sort(cards),
				val = this.getPai(arr[0]),
				temp;
		var arr1 = [[],[]];
		for(var i =0 ;i<arr.length;i++){
			arr1[i%2].push(arr[i]);
		}
		

		if(val === this.getPai(arr1[1][0]) && this.is顺(arr1[0]) && this.is顺(arr1[1])){
			
			return val;
		}
		return false;
	},

	'is三连':function(cards){
		if(cards.length%3!==0){
			return false;
		}
		var arr = this.sort(cards),
			val = this.getPai(arr[0]),
			tempArr,
			temp,count = 0,
			val1,
			obj = this.sortPoker(cards);

		tempArr = arr.join(',').split(',');

		while(temp = tempArr.splice(0,3) ){
			if(temp.length === 0){
				break;
			}
			val1 = this.getPai(temp[0]);
			if(val1 === val+count && obj[val1].length===3){
				
			}else{
				return false;
			}
			count++;
		}
		
		return val;
	},
	//下面开始是出牌类型算法

	'is单张': function(cards){
		if(cards.length===1){
			return this.getPai(cards[0]);	
		}
		return false;
		
	},
	'is对子': function(cards){
		var val;
		if(cards.length===2){
			val = this.getPai(cards[0]);
			if(val === this.getPai(cards[1]) ){
				return val; 
			}
		}
		return false;
	},
	'is火箭': function(cards){
		if(cards.length===2){
			var obj = this.sortPoker(cards);
			if(obj[18] && obj[19]){
				return 18;
			}
		}
		return false;
	},
	'is三张': function(cards){
		if(cards.length ===3){
			return this.is三连(cards);
		}
		return false;
	},
	'is炸弹': function(cards){
		if(cards.length === 4){
			var obj = this.sortPoker(cards),
				val = this.getPai(cards[0]);
			if(obj[val].length === 4){
				return val;
			}
		}
	},
	'is三带一': function(cards){
		if(cards.length === 4){
			var obj = this.sortPoker(cards),val;
			for(var i = 0; i < 4; i++){
				val = this.getPai(cards[i]);
				if(obj[val].length === 3){
					return val;
				}
			}
		}
		return false;
	},
	'is五张顺子': function(cards){
		var val;
		if(cards.length === 5 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is三带二': function(cards){
		if(cards.length === 5){
			var obj = this.sortPoker(cards),
				temp,val,len;
			var isTri = false, //是否是三张
				isDouble = false;//是否是对子
			for(var i=0;i<5;i++){
				val = this.getPai(cards[i]);
				len = obj[val].length;
				if(len === 3){
					temp = val;
					isTri = true;
				}else if(len ===2){
					isDouble = true;
				}
				if(isTri && isDouble){
					return temp;
				}
			}
		}
		return false;
	},
	'is六张顺子': function(cards){
		var val;

		if(cards.length === 6 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is三连对': function(cards){
		//33 44 55
		if(cards.length === 6){
			return this.is连对(cards);
		}
		return false;
	},
	'is四带二': function(cards){
		if(cards.length===6){
			//tips:44 5555 或者 5555 66 中间两位比如为四位的，所以
			var arr = this.sort(cards),
				val = arr[2];
			var obj = this.sortPoker(cards);
			if(obj[val] === 4){
				if(obj[arr[0]].length===2 || obj[arr[5]].length===2){
					return val;
				}
			}
		}
		return false;
	},
	'is二连飞机': function(cards){
		if(cards.length ===6){
			return this.is三连(cards);
		}
		return false;
	},
	'is七张顺子': function(cards){
		var val;
		if(cards.length === 7 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is八张顺子': function(cards){
		var val;
		if(cards.length === 8 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is四连对': function(cards){
		if(cards.length === 8){

			return this.is连对(cards);
		}
		return false;
	},
	'is二连飞机带翅膀': function(cards){
		if(cards.length === 8){
			var arr = this.sort(cards),
				obj = this.sortPoker(cards),
				val = this.getPai(arr[2]),
				val1 = this.getPai(arr[5]);
			if(val1===val+1 && obj[val].length ===3 && obj[val1].length===3){
				return val;
			}
		}
		return false;
	},
	'is九张顺子': function(cards){
		var val;
		if(cards.length === 9 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is三连飞机': function(cards){
		if(cards.length === 9){
			return this.is三连(cards);
		}
		return false;
	},
	'is十张顺子': function(cards){
		var val;
		if(cards.length === 10 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is五连对': function(cards){
		if(cards.length === 10){
			return this.is连对(cards);
		}
		return false;
	},
	'is二连飞机带二对': function(cards){
		if(cards.length===10){
			var arr = this.sort(cards),
				obj = this.sortPoker(cards);
			var val = this.getPai(arr[0]),
				val1,
				len = obj[val].length;
			if(len===3){
				//555 666 77 99
				if(this.is对子([arr[6],arr[7]]) && this.is对子([arr[9],arr[8]])){
					//此处还可以用三连飞机，但是还需要再在三连飞机判断中做一遍循环排序
					//所以弃用了
					val1 = this.getPai(arr[4]);
					if(val1 === val+1 && obj[val1].length===3){
						return val;
					}
				}
			}else if(len===2 && this.is对子([arr[0],arr[1]])){
				val = this.getPai(arr[3]);
				len = obj[val].length;
				if(len===3){
					//33 555 666 88
					val1 = this.getPai(arr[6]);
					if(val1 === val+1 && obj[val1].length===3){
						return val;
					}
				}else if(len ===2){
					//33 55 666 777
					val1 = this.getPai(arr[9]);
					if(val1===val+1 && obj[val1].length===3){
						return val;
					}
				}
			}
		}
		return false;
	},
	'is十一张顺子': function(cards){
		var val;
		if(cards.length === 11 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is十二张顺子': function(cards){
		var val;
		if(cards.length === 12 && (val = this.is顺(cards))){
			return val;
		}
		return false;
	},
	'is六连对': function(cards){
		if(cards.length === 12){
			return this.is连对(cards);
		}
		return false;
	},
	'is四连飞机': function(cards){
		if(cards.length ===12){
			return this.is三连(cards);
		}
		return false;
	},
	'is三连飞机带翅膀': function(cards){
		if(cards.length===12){
			var arr = this.sort(cards),
				obj = this.sortPoker(cards),
				val;
			for(var i=0;i<12;i++){
				val = this.getPai(arr[i]);
				//因为三连飞机必须连续，所以排序后的第一个length===3
				//的必然是开始
				if(obj[val].length===3){
					return this.is三连(arr.splice(i,9));
				}
			}
		}
		return false;
	},
	'is七连对': function(cards){
		if(cards.length === 14){
			return this.is连对(cards);
		}
		return false;
	},
	'is五连飞机': function(cards){
		if(cards.length ===15){
			return this.is三连(cards);
		}
		return false;
	},
	'is三连飞机带三对': function(cards){
		if(cards.length===15){
			var arr = this.sort(cards),
				back,val,
				len = 15,
				er = 0,
				obj = this.sortPoker(cards);

			for(var i=0;i<len;i++){
				val = this.getPai(arr[i]);
				if(!Tool.isArray(obj[val])){
					continue
				}
				//因为三连飞机必须连续，所以排序后的第一个length===3
				//的必然是开始

				if(obj[val].length===3 && !back){

					//特殊处理下，去除了9项
					//len需要－9
					back = this.is三连(arr.splice(i,9));
					if(!back){
						return false;
					}
					len-=9;
				}else if(obj[val].length===2){
					er++;
					i++;//跳过，防止第二次计数
					
					continue;
				}else{
					return false;
				}
			}

			if(back && er===3){
				return back;
			}
		}
		return false;
	},
	'is八连对': function(cards){
		if(cards.length === 16){
			return this.is连对(cards);
		}
		return false;
	},
	'is四连飞机带翅膀': function(cards){
		if(cards.length===16){
			var arr = this.sort(cards),
				obj = this.sortPoker(cards),
				val;
			for(var i=0;i<16;i++){
				val = this.getPai(arr[i]);
				//因为三连飞机必须连续，所以排序后的第一个length===3
				//的必然是开始
				if(obj[val].length===3){
					return this.is三连(arr.splice(i,12));
				}
			}
		}
		return false;
	},
	'is九连对': function(cards){
		if(cards.length === 18){
			return this.is连对(cards);
		}
		return false;
	},
	'is六连飞机': function(cards){
		if(cards.length ===18){
			return this.is三连(cards);
		}
		return false;
	},
	'is十连对': function(cards){
		if(cards.length === 20){
			return this.is连对(cards);
		}
		return false;
	},
	'is五连飞机带翅膀': function(cards){
		if(cards.length===20){
			var arr = this.sort(cards),
				obj = this.sortPoker(cards),
				val;
			for(var i=0;i<20;i++){
				val = this.getPai(arr[i]);
				//因为三连飞机必须连续，所以排序后的第一个length===3
				//的必然是开始
				if(obj[val].length===3){
					return this.is三连(arr.splice(i,15));
				}
			}
		}
		return false;
	}
});

/**
 * 智能排序，用于判断牌类型的排序
 * [203,403,405,103]=> [0:[],1:[],2:[],3:[203,403,103],4:[],5:[405]]
 * @param  {Array} cards [description]
 * @return {Array}       [description]
 */
Rule.prototype.sortPoker = function(cards){
	var nc = this.getSortEmptyArray(),
		len = cards.length;

    while(len--){
        var card = cards[len],
             val = this.getPai(card);
        
        nc[val].push(card);
    }
    return nc;
}


Rule.prototype.getSortEmptyArray = function(){
	var arr = [];
	for(var i = 3;i<20;i++){
		arr[i] = [];
	}
	return arr;
}

















//AI算法
//cards一般指用户手上的牌，或者传入判断的牌
//rcards指的是判断的基础牌
var AI = new Rule;
/**
 * 判断出牌是否正确
 * @param  {[type]}  cards  用户出的牌
 * @param  {[type]}  rcards 需要大过的牌
 * @return {Boolean}        [description]
 */
AI.isRight = function(cards, rcards){
	if(arguments.length<2){
		throw new Error('AI.isRight:参数错误');
		return;
	}
	if(cards.length!==rcards.length){
		var type = this.getType(cards),
			len = cards.length;
		if(len===2){
			if(type.type==='火箭'){
				return true;
			}
		}else if(len===4){
			if(type.type==='炸弹'){
				return true;
			}
		}
		return false;
	}
	var type = this.getType(cards),
		rtype = this.getType(rcards);
	if(type.type === rtype.type && type.value > rtype.value){
		return true;
	}

	return false;
}
//机器人自己出牌处理
/**
 * 机器人自己出牌【提示】算法处理
 * @param  {[type]} cards  用户手上所有的牌
 * @param  {[type]} rcards 桌面上的牌
 * @return {[type]}        [description]
 */
AI.auto = function(cards, rcards){
	var rlen = rcards.length,
		back,
		len = cards;

	if(rlen===0){
		//随便出牌，或者出第一手牌
	}else if(len<rlen){
		//如果张数少于所出的牌，那么只能出炸弹或者火箭了
		if(len<2){
			return false;
		}
		back = this['get炸弹'](cards,rtype);
		return back?back:this['get火箭'](cards,rtype);
	}else{
		
		var rtype = this.getType(rcards);
		
		//牌的类型有问题
		if(!rtype){
			throw new Error('牌的类型有问题');
			return false;
		}
		//先处理火箭
		if(rtype.type==='火箭'){
			return false;
		}

		//开始计算，拆牌算法整合到内部
		back = this['get'+rtype.type](cards,rtype);

		if(back){
			return back;
		}

		//如果没有找到，那么就看有没有炸弹和火箭
		if(rtype.type!=='炸弹' || rtype.type!=='火箭'){

			back = this['get炸弹'](cards,rtype);
			return back?back:this['get火箭'](cards,rtype);
		}
		return this['get火箭'](cards,rtype);
	}
}
/**
 * 智能排序算法
 * AI.aiSort([210,209,103,109,308,211,409,213,110,310,410,405,205,104])
 * 转换为=============>
 * [
 *  [3: 103,4: 104,5: 205,8: 308,9: 409,10: 410,11: 211,13: 213],
 *  [5: 405,9: 109,10: 310],
 *  [9: 209,10: 110],
 *  [10: 210]
 * ]
 * 这样找对子，从数组第二项开始找就可以了
 * @param {Object} cards
 */
AI.aiSort = function(cards){
    var nc = this.sortPoker(cards);

	var back = [];
	// console.dir(nc);
	for(var i = 3;i<20;i++){
		var v = nc[i];
		if(v.length){
			
			var m=0,a;

			while(a = v.shift()){
//				console.log(a,m);
				if(!back[m]){
					back[m] = [];
				}

				back[m][i] = a;
				m++;
				
			}
		}
	}
	back.isAI = true;//添加个排序的尾巴
	return back;
}
mix(AI,{
	/**
	 * 用户发牌提示，机器人发牌
	 * @param  {[type]} cards 手上的牌
	 * @return {[type]}       [description]
	 */
	'get发牌':function(cards){
		cards = this.sort(cards);
		var tCards = this.sortPoker(cards);
		var first = cards.join(',').split(',').splice(0,1),
			back,
			cLen = cards.length,
			firstVal = this.getPai(first),
			tLen = tCards[firstVal].length;
		// if(tLen===3){
		// 	if(cLen >= 5 && back = this.get三带二(cards,{type:'三带二',value:2})){
		// 		//三带二
		// 		if(this.getPai(cards[0])===firstVal){
		// 			return back;	
		// 		}
				
		// 	}else if(cLen >= 4 && back = this.get三带一(cards,{type:'三带一',value:2})){
		// 		//三带一
		// 		return back;
		// 	}
		// }else if(tLen===2 && cLen>=6){
		// 	if(back = this.get三连对(cards,{type:'三连对',value:2})){
		// 		return back;
		// 	}
		// }

		return tCards[firstVal];

	},
	/**
	 * 首先判断长度是否符合规范的
	 * @param {Object} cards
	 * @param {Object} obj
	 */
	pLength: function(cards,obj){
		var len = cards.length;
		if(len<this.types[obj.type]){
			return false
		}
		return true;
	},
	/**
	 * 获取相同的牌
	 * @param {Object} cards 传入的是aiSout排序后的数组
	 * @param {Object} val 获取的牌面数值
	 * @param {Object} i 获取的数量
	 */
	getSame:function(cards,val,i){
		if(!cards.isAI){
			cards = this.aiSort(cards);
		}
		var back = [];
		if(!cards[i-1]){
			return;
		}
		while(i--){
			back.push(cards[i][val]);
		}
		return back;
	},
	/**
	 * 删除牌中已经使用过的牌
	 * @param  {[type]} cards      [description]
	 * @param  {[type]} withoutArr [description]
	 * @return {[type]}            [description]
	 */
	getCardsWithout:function(cards,withoutArr){

		if(!Tool.isArray(withoutArr)){
			withoutArr = [withoutArr];
		}
		if(withoutArr.length===0) {
			return cards;
		}
		var filter = this.filter,
			self = this;
		withoutArr.forEach(function(value,index){
			cards = filter.call(self,cards,value)
		});
		return cards
	},
	/**
	 * 过滤不需要的值
	 * @param  {[type]} cards [description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	filter:function(cards,value){
		var self = this;

		return cards.filter(function(element,index,array){
			return self.getPai.call(self,element)!== self.getPai.call(self,value);
		});
	},
	/**
	 * 获取一定数量的相关类型的牌【不顺序，由大到小】
	 * @param  {[type]} cards [description]
	 * @param  {[type]} value [description]
	 * @param  {[type]} num   [description]
	 * @return {[type]}       [description]
	 */
	getByType:function(cards,value,type,num){
		var back = [],temp;
		while(num--){
			cards = this.getCardsWithout(cards,back);
			temp = this['get'+type](cards,{type:type,value:value});
			if(temp){
				back = back.concat(temp);
			}else{
				return false;
			}
		}
		return back;
	},
	/**
	 * 获取顺子，支持三连顺，二连顺，一连顺
	 * 
	 * @param  {[type]} cards 牌数组
	 * @param  {[type]} value 基准牌面，必须大于他
	 * @param  {[type]} index 索引：1一张时候为0,2张时候为1.。。
	 * @param  {[type]} num   获取牌的张数
	 * @return {[type]}       [description]
	 */
	getShun:function(cards,value,index,num){
		index = index || 0;
		num = num || 2;
		if(!cards.isAI){
			cards = this.aiSort(cards);

		}
		
		var start = value+1;
		var arr = cards[index],
			back;
			end = arr.length;
		if(!end){
			return false;
		}

		if(end-start>=num){
			
			for(var i = start; i < end; i++){				
				var count = 0;
				back = [];
				while(count<num){					
					if(arr[i+count] && !(cards[3] && cards[3][i+count])){
						back.push(this.getSame(cards,i+count,index+1));
					}
					count++;
				}
				
				if(back.length===num){		
					//console.log();
					//转换为一维数组，【注意】变成了字符串类型
					return back.join(',').split(',');
				}
			}
		}
		
		return false;
	},
	/**
	 * 从排序后的数组中获取相同的getNum张牌
	 * @param {Object} cards 数组
	 * @param {Object} obj 判断类型的对象
	 * @param {Object} num 需要获取是类型是几张，例如对子是2，单排是1
	 * @param {Object} getNum 一共需要获取多少张牌
	 */
	'get':function(cards,obj,num,getNum){
		var tCards;
		if(!cards.isAI){
			tCards = this.aiSort(cards);
		}else{
			tCards = cards;
		}

		var index = num -1;
		if(!tCards[index]){
			throw new Error('AI.get:没有tCards[index]');
			return false;
		}

		var start = obj.value, 
			tLen = tCards[index].length;
		//不拆牌
		var tBackIndex = 0;
		if(tCards[index+1]){
			
			if (tLen && tLen > start && !(tCards[3] && tCards[3].length)) {
				for (var i = start + 1; i < tLen; i++) {
					if (tCards[index][i]) {
						if(tCards[index+1][i]){
							if(!tBackIndex){
								tBackIndex = i;	
							}
							continue;
						}
						
						return this.getSame(tCards, i, getNum);
					}
				}
			}
		}
		//减少一次循环
		if(tBackIndex){
			return this.getSame(tCards, tBackIndex, getNum);
		}
		//拆牌，但是不拆炸弹
		if (tLen && tLen > start && !(tCards[3] && tCards[3].length)) {
			for (var i = start + 1; i < tLen; i++) {
				if (tCards[index][i]) {
					
					return this.getSame(tCards, i, getNum);
				}
			}
		}
		return false;
	},
	'get单张': function(cards,obj){
		if(this.pLength(cards,obj)){

			var tCards = this.aiSort(cards);
			var back, i = 1;
			while(i<4){
				if(back = this.get(tCards,obj,i,1)){
					return back;
				}
				i++;
			}
			//不拆牌=>
			//拆对子=>
			//拆三连=>
			//不拆炸弹 end
			
		}
		return false;
	},
	'get对子': function(cards,obj){
		if(this.pLength(cards,obj)){
			var tCards = this.aiSort(cards);
			var back, i = 2;
			while(i<4){
				if(back = this.get(tCards,obj,i,2)){
					return back;
				}
				i++;
			}
		}
		return false;
	},
	'get火箭': function(cards,obj){
		if(this.pLength(cards,obj)){
			cards = this.aiSort(cards);
			if(cards[0][18] && cards[0][19]){
				return [518,519];
			}
		}
		return false;
	},
	'get三张': function(cards, obj) {
		if (this.pLength(cards, obj)) {
			var tCards = this.aiSort(cards);
			
			var back, i = 3;
			while(i<4){
				if(back = this.get(tCards,obj,i,3)){
					return back;
				}
				i++;
			}
		}
		return false;
	},
	'get炸弹': function(cards, obj) {
		if (this.pLength(cards, obj)) {
			var tCards = this.aiSort(cards), 
				start = obj.value, 
				tLen = tCards[3];
			if (tLen && (tLen=tCards[3].length) && tLen > start) {
				for (var i = start + 1; i < tLen; i++) {
					if (tCards[3][i]) {
						return this.getSame(tCards, i, 4);
					}
				}
			}
		}
		return false;
		
	},
	'get三带一': function(cards,obj){
		if(this.pLength(cards,obj)){
			var san = this.get三张(cards,obj),
				yi;
			if(san){
				cards = this.getCardsWithout(cards,san);
				//这里value设置为2减少循环，只要3以上就可以
				yi = this.get单张(cards,{type:'单张',value:2});
				if(yi){
					return san.concat(yi);	
				}
				
			}
		}
		return false;
	},
	'get五张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			//console.log(1);
			return this.getShun(cards,obj.value,0,5);
		}
		return false;
	},
	'get三带二': function(cards,obj){
		if(this.pLength(cards,obj)){
			var san = this.get三张(cards,obj),
				er;

			if(san){
				cards = this.getCardsWithout(cards,san);

				er = this.get对子(cards,{type:'对子',value:2});
				if(er){
					return san.concat(er);	
				}
				
			}
		}

		return false;
	},
	'get六张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){

			return this.getShun(cards,obj.value,0,6);
		}
		return false;
	},
	// 33 44 55
	'get三连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,3);
		}
		return false;
	},
	
	'get四带二': function(cards,obj){
		if(this.pLength(cards,obj)){
			var si = this.get炸弹(cards),
				er;
			if(si){
				cards = this.getCardsWithout(cards,si);

				er = this.get对子(cards,{type:'对子',value:2});
				if(er){
					return si.concat(er);	
				}
			}
		}
		return false;
	},
	//333 444
	'get二连飞机': function(cards,obj){
		if(this.pLength(cards,obj)){

			return this.getShun(cards,obj.value,2,2);
		}
		return false;
	},
	'get七张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,7);
		}
		return false;
	},
	'get八张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,8);
		}
		return false;
	},
	'get四连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,4);
		}
		return false;
	},
	'get二连飞机带翅膀': function(cards,obj){
		if(this.pLength(cards,obj)){
			var erlianfeiji = this.get二连飞机(cards,{type:'二连飞机',value:obj.value}),
				wing;

			if(erlianfeiji){
				cards = this.getCardsWithout(cards,erlianfeiji);
				wing = this.getByType(cards,2,'单张',2);
				if(wing && wing.length===2){
					return erlianfeiji.concat(wing);
				}
			}
		}
		return false;
	},
	'get九张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,9);
		}
		return false;
	},
	'get三连飞机': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,2,3);
		}
		return false;
	},
	'get十张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,10);
		}
		return false;
	},
	'get五连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,5);
		}
		return false;
	},
	///================================================================>
	'get二连飞机带二对': function(cards,obj){
		if(this.pLength(cards,obj)){
			var erlianfeiji = this.get二连飞机(card,{type:'二连飞机',value:obj.value}),
				wing;
			if(erlianfeiji){
				cards = this.getCardsWithout(cards,erlianfeiji);
				wing = this.getByType(cards,2,'对子',2);
				if(wing && wing.length===4){
					return erlianfeiji.concat(wing);
				}
			}
		}
		return false;
	},
	'get十一张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,11);
		}
		return false;
	},
	'get十二张顺子': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,0,12);
		}
		return false;
	},
	'get六连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,6);
		}
		return false;
	},
	'get四连飞机': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,2,4);
		}
		return false;
	},
	'get三连飞机带翅膀': function(cards,obj){
		if(this.pLength(cards,obj)){
			var sanlianfeiji = this.get三连飞机(cards,{type:'三连飞机',value:obj.value}),
				wing;
			if(sanlianfeiji){
				cards = this.getCardsWithout(cards,sanlianfeiji);
				wing = this.getByType(cards,2,'单张',3);
				if(wing && wing.length===3){
					return sanlianfeiji.concat(wing);
				}
			}
		}
		return false;
	},
	'get七连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,7);
		}
		return false;
	},
	'get五连飞机': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,2,5);
		}
		return false;
	},
	'get三连飞机带三对': function(cards,obj){
		if(this.pLength(cards,obj)){
			var sanlianfeiji = this.get三连飞机(cards,{type:'三连飞机',value:obj.value}),
				wing;

			if(sanlianfeiji){
				cards = this.getCardsWithout(cards,sanlianfeiji);

				wing = this.getByType(cards,2,'对子',3);
				if(wing && wing.length===6){
					return sanlianfeiji.concat(wing);
				}
			}
		}
		return false;
	},
	'get八连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,8);
		}
		return false;
	},
	'get四连飞机带翅膀': function(cards,obj){
		if(this.pLength(cards,obj)){
			var silianfeiji = this.get四连飞机(cards,{type:'四连飞机',value:obj.value}),
				wing;
			if(silianfeiji){
				cards = this.getCardsWithout(cards,silianfeiji);
				wing = this.getByType(cards,2,'单张',4);
				if(wing && wing.length===4){
					return silianfeiji.concat(wing);
				}
			}
		}
		return false;
	},
	'get九连对': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,1,9);
		}
		return false;
	},
	'get六连飞机': function(cards,obj){
		if(this.pLength(cards,obj)){
			return this.getShun(cards,obj.value,2,6);
		}
		return false;
	},
	'get十连对': function(cards,obj){
		
		return false;
	},
	'get五连飞机带翅膀': function(cards,obj){
		
		return false;
	}
});



























//***********全局函数************************
/**
 * 简单杂糅
 * @param  {Object} p   [description]
 * @param  {Object} obj [description]
 * @return {[type]}     [description]
 */
function mix(p,obj){
	for(var i in obj){
		if(obj.hasOwnProperty(i)){
			p[i] = obj[i];
		}
	}
	
}

/**
 * 类继承
 * @param  {[type]} Parent [description]
 * @param  {[type]} Child  [description]
 * @return {[type]}        [description]
 */
function classExtends(Parent,Child){
	var F = function(){};
	F.prototype = Parent.prototype;
	
	Child.prototype = new F;
	Child.prototype.constructor = Child;
	Child.superClass = Parent.prototype;
	return Child;
}
/**
 * 获取max和min之间的随机数
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
function random(min, max){
	if(arguments.length === 1){
		arguments[1] = arguments[0];
		arguments[0] = 0;
	}
    return Math.floor(Math.random() * (arguments[1]  - arguments[0]  + 1) + arguments[0] );
}
	


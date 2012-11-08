/**
 * 11年，无聊时候写的老版斗地主
 * 也没有写完……
 * @author  ksky521
 */

[].indexOf || (Array.prototype.indexOf = function(v){
       for(var i = this.length; i-- && this[i] !== v;);
       return i;
});

//http://www.inmensia.com/files/solitaire1.0.html
//http://www.inmensia.com/files/pictures/juegos/solitaire/card0~51.png
//http://www.inmensia.com/files/pictures/juegos/videopoker/reverse.png
var Dizhu = function(){
	this.users = ['zhangbozhi','linzhiling','fanbingbing'];
	this.usersCard = {};
	this.lastCards = [];
	this.dizhu = '';
	this.dizhuID = '';
	this.curState = {
		userID:0,//桌面上最后一套牌所属的人uid
		cards:[],//桌面上最后一套牌
		type:'',//当前牌的类型
		sUid:0//目前要出牌的人的uid
	};
	this.pokers = [115,103,104,105,106,107,108,109,110,111,112,113,114,215,203,204,205,206,207,208,209,210,211,212,213,214,315,303,304,305,306,307,308,309,310,311,312,313,314,415,403,404,405,406,407,408,409,410,411,412,413,414,518,519];
	var len = this.users.length;
	while(len--){
		this.usersCard[this.users[len]] = [];
	}
	
};
Dizhu.prototype = {
	constructor:Dizhu,
	types:{
	},
	/**
	 * 获取牌的大小
	 * @param {Object} value
	 */
	getValue:function(value){
		return value%100;
	},
	isSame:function(cards){
		var len = cards.length;
		var j = this.getValue(cards[0]);
		for(var i=1;i<len;i++){
			if(this.getValue(cards[i])!==j){
				return fasle;
			}
		}
		return true;
	},
	isGe:function(cards){
		if(cards.length===1){
			return {
				'c': cards,
				'v': this.getValue(cards[0])
			};
		}
		return false;
	},
	isDui:function(cards){
		if(cards.length===2&&this.isSame(cards)){
			return {
				'c': cards,
				'v': this.getValue(cards[0])
			};
		}
		return false;
	},
	isSan:function(cards){
		if(cards.length===3 && this.isSame(cards)){
			return {
				'c': cards,
				'v': this.getValue(cards[0])
			};
		}
		return false;
	},
	isSanyi:function(cards){
		if(cards.length===4){
			cards = this.pokerSort(cards);
			if(this.isSame(cards.slice(0,3))){
				return {
					'c': cards,
					'v': this.getValue(cards[0])
				};
			}
			
		}
		return false;
	},
	isSandui:function(cards){
		if(cards.length===5){
			cards = this.pokerSort(cards);
            if( this.isSame(cards.slice(0,3)) &&  this.isSame(cards.slice(4,2))){
                return {
                    'c': cards,
                    'v': this.getValue(cards[0])
                };
            }
			return {
				'c': cards,
				'v': this.getValue(cards[0])
			};
		}
		return false;
	},
	isShun:function(cards){
		var len = cards.length;
		if(len>=5){
			cards = this.pokerSort(cards);
			if(this.getValue(cards[0])>14){
                return false;
            }
			if(this.isLian(cards)){
				return {
					'c': cards,
					'v': this.getValue(cards[0])
				};
			}
			
		}
		return false;
	},
	isLian:function(cards){
		var len = cards.length;
		var tmp = cards[0],tma=[tmp];
        for(var i=1;i<len;i++){
            if(cards[i]){
				tma.push(cards[i]);
			}else{
				return false;
			}
        }
		if (tma.toString() === cards.toString() && cards[0]) {
			return true;
		}
		return false;
	},
	isLiandui:function(cards){
		var len = cards.length;
		if(len>=6 && len%2===0){
			cards = this.pokerSort(cards);
			if(this.getValue(cards[0])>14){
				return false;
			}
			var newA = [];
			for(var i=0;i<len;i=i+2){
				if(this.isDui([cards[i],cards[i+1]])){
					newA.push(cards[i]);
				}else{
					return false;
				}
			}
			if (this.isLian(newA)) {
				return {
					'c': cards,
					'v': this.getValue(cards[0])
				};
			}
			
		}
		return false;
	},
	isLiansan:function(){
		var len = cards.length,g = len%3===0?len/3:0;
		if(len>=6 && g){
			cards = this.pokerSort(cards);
			var newA = [];
            for(var i=0;i<len;i=i+3){
				if(this.isSan([cards[i],cards[i+1],cards[i+2]])){
				    newA.push(cards[i]);	
				}else{
					return false;
				}
                
            }
			if (this.isLian(newA)) {
                return {
                    'c': cards,
                    'v': this.getValue(cards[0])
                };
            }
		}
		return false;
	},
	isSanyishun:function(cards){
		var len = cards.length,g = len%4===0?len/4:0;
		if(len>=8 && g){
			cards = this.pokerSort(cards);
            var newA = [],count =0;
            for(var i=0;i<len && count++<g;i=i+3){
                if(this.isSan([cards[i],cards[i+1],cards[i+2]])){
                    newA.push(cards[i]);    
                }else{
                    return false;
                }
            }
            if (this.isLian(newA)) {
                return {
                    'c': cards,
                    'v': this.getValue(cards[0])
                };
            }
		}
		return false;
	},
	isSanduishun:function(cards){
		var len = cards.length,g = len%5===0?len/5:0,index = g*3;
		if(len>=10 && g){
			cards = this.pokerSort(cards);
            var newA = [], count = 0;
            for(var i=0;i<len && count++<g;i=i+3){
                if(this.isSan([cards[i],cards[i+1],cards[i+2]]) && this.isDui([cards[index],cards[index+1]])){
					index = index + 2;
                    newA.push(cards[i]);    
                }else{
                    return false;
                }
            }
            if (this.isLian(newA)) {
                return {
                    'c': cards,
                    'v': this.getValue(cards[0])
                };
            }
		}
		return false;
	},
//	isFeiji:function(cards){
//		if(cards.length>=5){
//			return cards;
//		}
//		return false;
//	},
	isZhadan: function(cards){
		if (cards.length >= 4 && this.isSame(cards)) {
			return {
				'c': cards,
				'v': this.getValue(cards[0])
			};
		}
		return false;
	},
	isHuojian: function(cards){
		if (cards.length === 2) {
			cards = this.sort(cards);
			if (cards[0] === 518) {
				return {
					'c': cards,
					'v': this.getValue(cards[0])
				};
			}
		}
		return false;
	},
	isSier:function(cards){
		var len = cards.length;
		if(len===6){
			cards = this.pokerSort(cards);
			if (this.isSame([cards[0], cards[1], cards[2], cards[3]])) {
				return {
					'c': cards,
					'v': this.getValue(cards[0])
				};
			}
		}
		return false;
	},
	isSisi:function(cards){
		var len = cards.length;
        if(len===8){
            cards = this.pokerSort(cards);
            if (this.isSame([cards[0], cards[1], cards[2], cards[3]]) && this.isSame([cards[4], cards[5]]) && this.isSame([cards[6], cards[7]])) {
                return {
                    'c': cards,
                    'v': this.getValue(cards[0])
                };
            }
        }
        return false;
	},
	pokerSort:function(cards){
		var len = cards.length,tmp={},tmpa = {},cnt=0;
		for(var i= 0;i<len;i++){
			var val = this.getValue(cards[i]);
			if(!tmp[val]){
				tmp[val] = [];
				tmpa[val] = 0;
				cnt++;
			}
			tmp[val].push(cards[i]);
			tmpa[val] = tmpa[val]+1;
		}
		var abc = [],a = {},count=0;
		do{
			for (var n in tmp) {
				if (a[n]) {
					continue;
				}
				var c = n;
				var max = tmpa[n],
				vals = tmp[n];
				for (var m in tmp) {
					if (a[m]) {
						continue;
					}
					var b = tmpa[m];
					if (max < b || max === b && parseInt(c) < parseInt(m)) {
//						console.log(n+"<"+m);
						vals = tmp[m];
						max = b;
						c = m;
					}
				}
				a[c] = 1;
				count++;
//				console.log(a);
				abc = abc.concat(vals);
			}
		}while(count!==cnt);
		return abc;
	},
	getType:function(cards){
		var len = cards.length,type=false;
		
		switch(len){
			case 1:
			type = 'Ge';
			break;
			case 2:
			if(this.isDui(cards)){
				type = 'Dui';
			}else if(this.isHuojian(cards)){
				type = "Huojian";
			}
			break;
			case 3:
			if(this.isSan(cards)){
				type = 'San';
			}
			break;
			case 4:
			if(this.isSanyi(cards)){
				type = 'Sanyi';
			}else if(this.isZhadan(cards)){
				type = "Zhadan";
			}
			break;
			case 5:
			if(this.isSandui(cards)){
				type = "Sandui";
			}else if(this.isShun(cards)){
				type = "Shun";
			}
			break;
			case 6:
			if(this.isShun(cards)){
				type = "Shun";
			}else if(this.isLiandui(cards)){
				type = "Liandui";
			}else if(this.isLiansan(cards)){
				type = "Liansan";
			}else if(this.isSier(cards)){
				type = "Sier";
			}
			break;
			case 7:
			if(this.isShun(cards)){
				type = 'Shun';
			}
			break;
			case 8:
			if(this.isLiandui(cards)){
				type = "Liandui";
			}else if(this.isSanyishun(cards)){
				type = "Sanyishun";
			}else if(this.isShun(cards)){
				type = 'Shun';
			}else if(this.isSisi(cards)){
				type = "Sisi";
			}
			break;
			case 9:
			if(this.isShun(cards)){
				type = 'Shun';
			}else if(this.isLiansan(cards)){
				type = "Liansan";
			}
			break;
			case 10:
			if(this.isLiandui(cards)){
				type = "Liandui";
			}else if(this.isSanduishun(cards)){
				type = 'Sanduishun';
			}else if(this.isShun(cards)){
				type = 'Shun';
			}
			break;
			case 11:
			if(this.isShun(cards)){
				type = "Shun";
			}
			break;
			case 12:
			if(this.isLiandui(cards)){
				type = 'Liandui';
			}else if(this.isSanyishun(cards)){
				type = 'Sanyishun';
			}else if(this.isShun(cards)){
				type = 'Shun';
			}else if(this.isLiansan(cards)){
				type = 'Liansan';
			}
			break;
			case 13:
			if(this.isShun(cards)){
				type = "Shun";
			}
			break;
			case 14:
			if(this.isLiandui(cards)){
				type = 'Liandui';
			}
			break;
			case 15:
			if(this.isSanduishun(cards)){
				type = 'Sanduishun';
			}else if(this.isLiansan(cards)){
				type = 'Liansan';
			}
			break;
			case 16:
			if(this.isLiandui(cards)){
				type = 'Liandui';
			}else if(this.isSanyishun(cards)){
				type = 'Sanyishun';
			}
			break;
			case 17:
			
			break;
			case 18:
			if(this.isLiandui(cards)){
				type = 'Liandui';
			}else if(this.isLiansan(cards)){
				type = 'Liansan';
			}
			break;
			case 19:
			
			break;
			case 20:
			if(this.isLiandui(cards)){
				type= 'Liandui';
			}else if(this.isSanyishun(cards)){
				type = 'Sanyishun'
			}else if(this.isSanduishun(cards)){
				type = 'Sanduishun'
			}
			break;
		}
		return type;
		
		
	},
	sort:function(cards){
		return cards.sort(function(a,b){
				a = a%100;
				b = b%100;
				return a-b;
			});
	},
	robot:function(cards){
		cards = [203,303,404,405,403,518,103,105,109,209,410,311,211,210,310,306,111,112];
		var len = cards.length;
		if(len==0){
			return false;
		}
        
		//var tcards = this.curState.cards,type = this.curState.type;
		var tcards = [210, 110,310,409, 309, 209,204,304,106,306],type='Sanduishun';
		
		var back = this['robot'+type](tcards,cards);
		console.dir(back);
		return back;
	},
	robotSisi:function(zcards,rcards){
		return this.robotAll(zcards,rcards);
	},
	robotSier:function(zcards,rcards){
		return this.robotAll(zcards,rcards);
	},
	robotSanduishun:function(zcards,rcards){
		var rlen = rcards.length,nlen = zcards.length;
		if(rlen<nlen){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var zlen = nlen/5;
		var val = this.getValue(zcards[nlen-1-zlen*2]);
		var cards = newcards[2];
		if (cards) {
			for (var i = val + 1, len = cards.length; i < len; i++) {
				var tmp = cards.splice(i,zlen);
				if(this.isLian(tmp)){
					var ttl = i+tmp.length,back = [];
					var count = 0;
					for(var j=i;i<ttl;i++){
						back = back.concat([newcards[0][i]],[newcards[1][i]],tmp[count++]);
					}
					var b = this.robotGetDui(newcards,tmp,zlen);
					
					if(b){
						return back.concat(b);	
					}
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotSanyishun:function(zcards,rcards){
		var rlen = rcards.length,nlen = zcards.length;
		if(rlen<nlen){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var zlen = nlen/4;
		var val = this.getValue(zcards[nlen-1-zlen]);
		var cards = newcards[2];
		if (cards) {
			for (var i = val + 1, len = cards.length; i < len; i++) {
				var tmp = cards.splice(i,zlen);
				if(this.isLian(tmp)){
					var ttl = i+tmp.length,back = [];
					var count = 0;
					for(var j=i;i<ttl;i++){
						back = back.concat([newcards[0][i]],[newcards[1][i]],tmp[count++]);
					}
					var b = this.robotGetYi(newcards,tmp,zlen);
					
					if(b){
						return back.concat(b);	
					}
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	
	robotLiansan:function(zcards,rcards){
		//基础是到这排的，即：[210, 110, 309, 209, 108,208]
		var rlen = rcards.length,nlen = zcards.length;
		if(rlen<nlen){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var zlen = nlen/3;
		var val = this.getValue(zcards[nlen-1]);
		var cards = newcards[2];
		if (cards) {
			for (var i = val + 1, len = cards.length; i < len; i++) {
				var tmp = cards.splice(i,zlen);
				if(this.isLian(tmp)){
					var ttl = i+tmp.length,back = [];
					var count = 0;
					for(var j=i;i<ttl;i++){
						back = back.concat([newcards[0][i]],[newcards[1][i]],tmp[count++]);
					}
					
					return back;
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotLiandui:function(zcards,rcards){
		//基础是到这排的，即：[210, 110, 309, 209, 108,208]
		var rlen = rcards.length,nlen = zcards.length;
		if(rlen<nlen){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var zlen = nlen/2;
		var val = this.getValue(zcards[nlen-1]);
		var cards = newcards[1];
		if (cards) {
			for (var i = val + 1, len = cards.length; i < len; i++) {
				var tmp = cards.splice(i,zlen);
				if(this.isLian(tmp)){
					var ttl = i+tmp.length,back = [];
					var count = 0;
					for(var j=i;i<ttl;i++){
						back = back.concat([newcards[0][i]],tmp[count++]);
					}
					
					return back;
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotShun:function(zcards,rcards){
		//基础是到这排的，即：[211, 110, 309, 208, 107]
		var rlen = rcards.length,nlen = zcards.length;
		if(rlen<nlen){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var zlen = nlen;
		var val = this.getValue(zcards[zlen-1]);
		var cards = newcards[0];
		if (cards) {
			for (var i = val + 1, len = cards.length; i < len; i++) {
				var tmp = cards.splice(i,zlen);
				if(this.isLian(tmp)){
					return tmp;
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotSandui:function(zcards,rcards){
		var rlen = rcards.length;
		if(rlen<5){
			return this.robotAll(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var val = this.getValue(zcards[0]);
		var cards = newcards[2];
		if(cards){
			for (var i = val + 1, len = cards.length; i < len; i++) {
				if (cards[i] && !newcards[3][i]) {
					var b = this.robotGetDui(newcards,[cards[i]]);
					if(b){
						return [cards[i],newcards[1][i],newcards[0][i]].concat(b);
					}
					break;
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotSanyi:function(zcards,rcards){
		var rlen = rcards.length;
		if(rlen<4){
			return this.robotHuojian(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		var val = this.getValue(zcards[0]);
		var cards = newcards[2];
		if(cards){
			for (var i = val + 1, len = cards.length; i < len; i++) {
				if (cards[i] && !newcards[3][i]) {
					var b = this.robotGetYi(newcards,[cards[i]]);
					if(b){
						return [cards[i],newcards[1][i],newcards[0][i]].concat(b); 
					}
					break;
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotGetYi:function(cards/*排序后的cards*/,c/*不得返回的yi,arr*/,nums){
		nums = nums || 1;
		var back = [];
		var card = cards[0];
		for(var j=0,ll=c.length;j<ll;j++){
			c[j] = this.getValue(c[j]);
		}
		
		
		for(var i = 3,len= card.length;i<len;i++){
			if(card[i] && c.indexOf(i)==-1 && !cards[3][i]){
				//不拆炸弹
				back.push(card[i]);
				
				if(--nums===0){
					return back;	
				}
			}
		}
		return false;
	},
	robotGetDui:function(cards/*排序后的cards*/,c/*不得返回的yi*/,nums){
		nums = nums || 1;
		var card = cards[1];
		for(var j=0,ll=c.length;j<ll;j++){
			c[j] = this.getValue(c[j]);
		}
		var back = [];
		for(var i = 3,len= card.length;i<len;i++){
			if(card[i] && c.indexOf(i)==-1 && !cards[3][i]){
				//不拆炸弹
				back = back.concat([cards[0][i],card[i]]);
				
				if(--nums===0){
					return back;	
				}
			}
		}
		return false;
	},
	robotSan:function(zcards,rcards){
		var rlen = rcards.length;
		if(rlen<3){
			return this.robotHuojian(zcards,rcards);
		}
		//三以上的不在拆牌，用炸弹或者火箭
		var newcards = this.newRobotSort(rcards);
		var val = this.getValue(zcards[0]);
		var cards = newcards[2];
		
		if(cards){
			for(var i = val+1,len = cards.length;i<len;i++){
				if(cards[i] && !newcards[3][i]){
					return [newcards[0][i],newcards[1][i],cards[i]];
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotDui:function(zcards,rcards){
		var rlen = rcards.length;
		if(rlen<2){
			return false;
		}
		var newcards = this.newRobotSort(rcards);
		var val = this.getValue(zcards[0]);
		var cards = newcards[1];
		var chai = [];
		if(cards){
			
			for(var i = val+1,len = cards.length;i<len;i++){
				if(cards[i] && !newcards[2][i]){
					//纯粹的对子，不拆三
					return [newcards[0][i],cards[i]];
				}else if(chai.length===0 && cards[i]){
					//拆三，一个就够了，拆四就不做了，做炸弹用
					chai =[newcards[0][i],cards[i]];
				}
			}
			if(chai.length!==0){
				return chai;
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotGe:function(zcards,rcards){
		var newcards = this.newRobotSort(rcards);
		var val = this.getValue(zcards[0]);
		var cards = newcards[0];
		if(cards){
			for(var i=val+1,len = cards.length;i<len;i++){
				if(cards[i]){
					return [cards[i]];
				}
			}
		}
		return this.robotAll(zcards,rcards);
	},
	robotAll:function(zcards,rcards,type){
		var rlen = rcards.length;
		if (rlen > 4) {
			var a = this.robotZhadan(zcards, rcards, type);
			if (a) {
				return a;
			}
		}
		return this.robotHuojian(zcards,rcards);
	},
	robotZhadan:function(zcards,rcards,type){
		var rlen = rcards.length;
		if(rlen<4){
			return this.robotHuojian(zcards,rcards);
		}
		var newcards = this.newRobotSort(rcards);
		if(newcards[3]){
			var cards = newcards[3];
			if(type==='Zhadan' || type==="Sisi" || type==="Sier"){
				var val = this.getValue(zcards[0]);
				for(var i = val+1,len = cards.length;i<len;i++){
					if(cards[i]){
						return [newcards[0][i],newcards[1][i],newcards[2][i],newcards[3][i]];
					}
				}
				
			}else{
				
				for(var i= 3,len = cards.length;i<len;i++){
					if(cards[i]){
						return [newcards[0][i],newcards[1][i],newcards[2][i],newcards[3][i]];
					}
				}
			}
		}
		return this.robotHuojian(zcards,rcards);
	},
	/**
	 * 机器人出牌为火箭
	 * @param {Object} zcards
	 * @param {Object} rcards
	 */
	robotHuojian:function(zcards,rcards){
		rcards = this.newRobotSort(rcards);
		if(rcards[0][18] && rcards[0][19]){
			return [518,519];
		}
		return false;
	},
	/**
	 * 新机器人的算法排序
	 * 四个数组，主要用的算法
	 * @param {Object} cards
	 */
	newRobotSort:function(cards){
		var nc = [],len = cards.length;
        while(len--){
            var card = cards[len],
                 val = this.getValue(card);
            if(!nc[val]){
                nc[val] = [];
            }
            nc[val].push(card);
			//console.log(nc);
        }
		var back = [];
		//console.dir(nc);
		for(var i = 3;i<20;i++){
			var v = nc[i];
			if(v && v[0]){
//				v = v.sort();
				var m=0,a = v.shift();
				while(a){
					if(!back[m]){
						back[m] = [];
					}
					if(back[m][i]){
						m++;
						a = v.shift();
						continue;
					}else{
						back[m][i] = a;
					}
				}
			}
		}
		
		return back;
	},
	/**
	 * 机器人算法排序
	 * @param {Object} cards
	 */
    robotSort:function(cards){
        var nc = [],len = cards.length;
        while(len--){
            var card = cards[len],
                 val = this.getValue(card);
            if(!nc[val]){
                nc[val] = [];
            }
            nc[val].push(card);
        }
        len = nc.length;
        var arr = [];
        while(len--){
            
            var a = nc[len],ll= typeof a==='object'?a.length:0;
            if(ll!==0){
                if(!arr[ll]){
                    arr[ll] = [];
                }
                if(!arr[ll][len]){
                    arr[ll][len] = [];
                }
				arr[ll][len] = arr[ll][len].concat(a);
                //arr[ll][len].push(a);
            }
        }
		return arr;
	},
	/**
	 * 获取uid的用户的牌的多少
	 * @param {Object} uid
	 */
	getCardNums:function(uid){
		return this.usersCards[this.users[uid]].length;
	},
	/**
	 * 获取牌的花色
	 * @param {Object} value
	 */
	getHua:function(value){
		return Math.floor(value/100);
	},
	
	/**
	 * 随机去牌
	 * 主要用于第一次发牌
	 */
	getRandomCard: function(){
		var pokers = this.pokers;
		if(pokers.length){
			var tmp = Math.floor(Math.random()*pokers.length);
			return pokers.splice(tmp,1);
		}else{
			return false;
		}
	},
	getCards: function(){
		for(var i = 0;i<3;i++){
			this.lastCards[i] = this.getRandomCard()[0];
		}
		var pokers = this.pokers,cards;
		var len = this.users.length;
		
		while(len--){
			var user = this.users[len];
			for(var n=0;n<17;n++){
				var a = this.getRandomCard();
				this.usersCard[user].push(a[0]);
			}
			this.usersCard[user] = this.sort(this.usersCard[user]);
		}
	},
	/**
	 * 第一次随机获取地主
	 */
	getDizhu:function(){
		var dizhu = Math.floor(Math.random()*3);
		this.dizhuID = dizhu;
		this.curState['userID'] = dizhu;
		this.curState['sUid'] = dizhu;
	},
	/**
	 * 设置谁是地主
	 * 传入地主uid
	 * @param {Object} id
	 */
	setDizhu:function(id){
		this.dizhuID = id;
		this.curState['userID'] = id;
	},
	/**
	 * 出牌是否正确
	 * @param {Array} cards
	 */
	isRight:function(cards){
		var type = this.getType(cards);
		if(type && type === this.curState.type){
			cards = this.pokerSort(cards);
			if(cards[0]>this.curState.cards[0]){
				return true;
			}
		}
		return false;
	},
	/**
	 * 过牌
	 */
	guoPai:function(){
		var id = this.curState['sUid'];
		if(++id>2){
			this.curState['sUid'] = 0;
		}else{
			this.curState['sUid'] = id;
		}
	},
	/**
	 * 第一次出牌
	 * @param {Object} uid
	 * @param {Object} cards
	 */
	diyiPai:function(uid,cards){
		var type = this.getType(cards);
		if(type){
			this.curState.type = type;
			this.changeUser(uid,cards);
			return true;
		}
		return false;
	},
	/**
	 * 出牌处理
	 * 
	 * @param {Object} uid 
	 * @param {Array} cards
	 */
	chuPai:function(uid,cards){
		var right = this.isRight(cards);
		if(right){
			
			this.changeUser(uid,cards);
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 交换出牌人
	 * @param {Object} uid
	 * @param {Object} cards
	 */
	changeUser:function(uid,cards){
		this.curState.cards = this.pokerSort(cards);
		this.curState.userID = uid;
		if(++uid>2){
			this.curState['sUid'] = 0;
		}else{
			this.curState['sUid'] = uid;
		}
	},
	cutCards:function(uid,cards){
		var user = this.users[uid];
		var userCards = this.usersCard[user];
		for(var i =0,len=cards.length;i<len;i++){
			var card = cards[i];
			var ind = userCards.indexOf(card);
			userCards.splice(ind,1);
		}
	},
	pushDizhu:function(){
		var user = this.users[this.dizhuID];
		if(user){
			this.usersCard[user] = this.usersCard[user].concat(this.lastCards);
			this.usersCard[user] = this.sort(this.usersCard[user]);
		}
		
	},
	clear: function(){
		for (var a in this) {
			this[a] = null;
		}
	}

};
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
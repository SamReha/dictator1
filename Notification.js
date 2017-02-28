// Singleton
var Notification={
	entries: [],
	observe: function(name,callback){
		Notification.entries.push({name:name, callback:callback});
	},
	notify: function(name,args){
		for(var i=0;i<Notification.entries.length;i++)
			if(Notification.entries[i].name===name)
				Notification.entries[i].callback(args);
	},
};

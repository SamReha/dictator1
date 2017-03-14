var Sound={
	FMOD: {},
	gSystem: null,
	gSound: [],
	gIOSInitialized: false,
	readyCallback: null,
	initOk: false,

	init: function(readyCallback){
		Sound.readyCallback=readyCallback;
		Sound.FMOD['preRun']=Sound.FMODPrerun;
		Sound.FMOD['onRuntimeInitialized']=Sound.FMODMain;
		Sound.FMOD['TOTAL_MEMORY']=64*1024*1024;
		FMODModule(Sound.FMOD);		
	},

	FMODCheckResult: function(result){
	    if(result!==Sound.FMOD.OK){
	        var msg="Error! "+Sound.FMOD.ErrorString(result);
	        console.error(msg);
	        throw msg;
	    }
	},

	FMODPrerun: function(){
	    console.log("FMOD: Prerun...");
	    var folderName="/";
	    var fileName=[
	        "HappyBirthday.mp3"
	    ];
	    var url="sounds/";
	    var result=Sound.FMOD.FS_createPreloadedFile(
	    	"/","HappyBirthday.mp3","sounds/HappyBirthday.mp3",
	    	true,false);
	    // for(var i=0;i<fileName.length;i++){
	    //     var result=Sound.FMOD.FS_createPreloadedFile(folderName, fileName[i], url+fileName[i], true, false);
	    //     console.assert(result===Sound.FMOD.OK, "Can NOT load sound "+fileName[i]);
	    // }
	},

	FMODMain: function(){
	    console.log("FMOD: Main setup...");
	    var outval={};
	    var result;
	    // Create Sound.FMOD system
	    console.log("  Create Sound.FMOD system object.");
	    result=Sound.FMOD.System_Create(outval);
	    Sound.FMODCheckResult(result);
	    //  now we have the system Sound.gSystem
	    Sound.gSystem=outval.val;

	    console.log("  Init FMOD.");
	    //  1024 virtual channels
	    result=Sound.gSystem.init(1024, Sound.FMOD.INIT_NORMAL, null);
	    Sound.FMODCheckResult(result);

	    Sound.FMODInitApplication();
	    var iOS=/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	    if(iOS){
	        alert("For iOS, please touch screen when data has finished loading.");
	        window.addEventListener('touchend', function(){
	            if (!Sound.gIOSInitialized){
	                result = Sound.gSystem.setDriver(0);
	                Sound.gIOSInitialized = true;
	            }
	        }, false);
	    }

	    Sound.initOk=true;
	    console.log("FMOD: now we can start the game loop.");
	    Sound.readyCallback();

	    return Sound.FMOD.OK;
	},

	FMODInitApplication: function(){
	    console.log("FMOD: Loading sounds...");

	    // Create a sound that loops
	    var outval = {};
	    var result;
	    var exinfo = Sound.FMOD.CREATESOUNDEXINFO();

	    exinfo.userdata = 123456;
	    console.log("FMOD.CREATESOUNDEXINFO: userdata = " + exinfo.userdata)

	    result = Sound.gSystem.createSound("/HappyBirthday.mp3", 
	    	Sound.FMOD.LOOP_OFF, null, outval);
	    Sound.FMODCheckResult(result);
	    Sound.gSound[0] = outval.val;
	},

	playSound: function(soundid){
		if(!Sound.initOk)
			return;
	    var channelOut={};
	    var result=Sound.gSystem.playSound(Sound.gSound[soundid], null, true, channelOut);
	    Sound.FMODCheckResult(result);
	    gChannel=channelOut.val;
	    gChannel.setPaused(false);
	},

};
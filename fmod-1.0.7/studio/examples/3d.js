/*==============================================================================
Event 3D Example
Copyright (c), Firelight Technologies Pty, Ltd 2012-2016.

This example demonstrates how to position events in 3D for spatialization.
==============================================================================*/

//==============================================================================
// Prerequisite code needed to set up FMOD object.  See documentation.
//==============================================================================

var FMOD = {};                          // FMOD global object which must be declared to enable 'main' and 'preRun' and then call the constructor function.
FMOD['preRun'] = prerun;                // Will be called before FMOD runs, but after the Emscripten runtime has initialized
FMOD['onRuntimeInitialized'] = main;    // Called when the Emscripten runtime has initialized
FMOD['TOTAL_MEMORY'] = 64*1024*1024;    // FMOD Heap defaults to 16mb which is enough for this demo, but set it differently here for demonstration (64mb)
FMODModule(FMOD);                       // Calling the constructor function with our object

//==============================================================================
// Example code
//==============================================================================

var gSystem;                            // Global 'System' object which has the Studio API functions.
var gSystemLowLevel;                    // Global 'SystemLowLevel' object which has the Low Level API functions.
var gEventInstance = {};                // Global event Instance for the 3d car engine event. 
var gLastListenerPos;
var gLastEventPos;
var gIOSInitialized  = false;           // Boolean to avoid resetting FMOD on IOS every time screen is touched.

// Simple error checking function for all FMOD return values.
function CHECK_RESULT(result)
{
    if (result != FMOD.OK)
    {
        var msg = "Error!!! '" + FMOD.ErrorString(result) + "'";

        alert(msg);

        throw msg;
    }
}

// Will be called before FMOD runs, but after the Emscripten runtime has initialized
// Call FMOD file preloading functions here to mount local files.  Otherwise load custom data from memory or use own file system. 
function prerun() 
{
    var fileUrl = "/public/js/";
    var fileName;
    var folderName = "/";
    var canRead = true;
    var canWrite = false;

    fileName = [
        "Master Bank.bank",
        "Master Bank.strings.bank",
//        "Character.bank",
//        "Music.bank",
//        "UI_Menu.bank",
        "Vehicles.bank",
//        "Surround_Ambience.bank",
//        "VO_Menu_English.bank",
//        "Weapons.bank" 
    ];

    for (var count = 0; count < fileName.length; count++)
    {
        document.querySelector("#display_out2").value = "Loading " + fileName[count] + "...";

        FMOD.FS_createPreloadedFile(folderName, fileName[count], fileUrl + fileName[count], canRead, canWrite);
    }
}

// Called when the Emscripten runtime has initialized
function main()
{
    // A temporary empty object to hold our system
    var outval = {};
    var result;

    console.log("Creating FMOD System object\n");

    // Create the system and check the result
    result = FMOD.Studio_System_Create(outval);
    CHECK_RESULT(result);

    console.log("grabbing system object from temporary and storing it\n");

    // Take out our System object
    gSystem = outval.val;

    result = gSystem.getLowLevelSystem(outval);
    CHECK_RESULT(result);

    gSystemLowLevel = outval.val;
    
    // Optional.  Setting DSP Buffer size can affect latency and stability.
    // Processing is currently done in the main thread so anything lower than 2048 samples can cause stuttering on some devices.
    console.log("set DSP Buffer size.\n");
    result = gSystemLowLevel.setDSPBufferSize(2048, 2);
    CHECK_RESULT(result);
    
    // Optional.  Set sample rate of mixer to be the same as the OS output rate.
    // This can save CPU time and latency by avoiding the automatic insertion of a resampler at the output stage.
    // console.log("Set mixer sample rate");
    // result = gSystemLowLevel.getDriverInfo(0, null, null, outval, null, null);
    // CHECK_RESULT(result);
    // result = gSystemLowLevel.setSoftwareFormat(outval.val, FMOD.SPEAKERMODE_DEFAULT, 0)
    // CHECK_RESULT(result);

    console.log("initialize FMOD\n");

    // 1024 virtual channels
    result = gSystem.initialize(1024, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null);
    CHECK_RESULT(result);

    // This is only relevant to this example that uses 'pixels' to position the event and listener.  Otherwise we would leave it out if the game uses meters as well. (or a predefined unit agreed to with the sound designer)        
    gSystemLowLevel.set3DSettings(1.0, .02, .02); // Distancefactor.  How many pixels in a meter?  We can make something up, lets say 50.  Only affects doppler.  Doppler uses meters per second, so we need to define a meter.
                                                  // Rolloffscale.  Unlike the Low Level API we cant set min/max distance.  The sound designer set it in 'meters'.  We need to scale it to match pixels per meter as well.
    
    // Starting up your typical JavaScript application loop
    console.log("initialize Application\n");

    initApplication();

    // Set up iOS workaround.  iOS does not allow webaudio to start unless screen is touched.
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS)
    {
        alert("WebAudio can only be started if the screen is touched.  Touch the screen when the data has finished loading.");

        window.addEventListener('touchend', function() 
        {
            if (!gIOSInitialized)
            {
                result = gSystemLowLevel.setDriver(0);
                gIOSInitialized = true;
            }

        }, false);
    }

    // Set the framerate to 50 frames per second, or 20ms.
    console.log("Start game loop\n");

    window.setInterval(updateApplication, 20);

    return FMOD.OK;
}

// Helper function to set a vector
function setVector(vector, x, y, z)
{
    vector.x = x;
    vector.y = y;
    vector.z = z;
}
function copyVector(vector_dest, vector_src)
{
    vector_dest.x = vector_src.x;
    vector_dest.y = vector_src.y;
    vector_dest.z = vector_src.z;
}

// Helper function to load a bank by name.
function loadBank(name)
{
    var bankhandle = {};
    CHECK_RESULT( gSystem.loadBankFile("/" + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bankhandle) );
}

// Function to set the 3d position of the listener or an event (by name)
function update3DPosition( objectname, pos, vel)
{
    var attributes = FMOD._3D_ATTRIBUTES();

    setVector(attributes.forward, 0.0, 0.0, 1.0);
    setVector(attributes.up,      0.0, 1.0, 0.0);
    copyVector(attributes.position, pos)
    copyVector(attributes.velocity, vel)

    if (objectname == "listener")
    {
        result = gSystem.setListenerAttributes(0, attributes);
        CHECK_RESULT(result);
    }
    else if (objectname == "event1")
    {
        result = gEventInstance.set3DAttributes(attributes);
        CHECK_RESULT(result);
    }
}

// Called from main, does some application setup.  In our case we will load some sounds.
function initApplication() 
{
    var eventInstanceOut = {};

    var guid = FMOD.GUID();


    console.log("Loading events\n");

    loadBank("Master Bank.bank");
    loadBank("Master Bank.strings.bank");
    loadBank("Vehicles.bank");
    
    // Get the Car Engine event
    var eventDescription = {};
    CHECK_RESULT( gSystem.getEvent("event:/Vehicles/Basic Engine", eventDescription) );
    CHECK_RESULT( eventDescription.val.createInstance(eventInstanceOut) );
    gEventInstance = eventInstanceOut.val;

    CHECK_RESULT( gEventInstance.setParameterValue("RPM", 1000.0) );
    CHECK_RESULT( gEventInstance.start() );

     // Position the listener at the origin
    var attributes = FMOD._3D_ATTRIBUTES();

    setVector(attributes.position, 0.0, 0.0, 0.0);
    setVector(attributes.velocity, 0.0, 0.0, 0.0);
    setVector(attributes.forward, 0.0, 0.0, 1.0);
    setVector(attributes.up, 0.0, 1.0, 0.0);
    CHECK_RESULT( gSystem.setListenerAttributes(0, attributes) );
    
    setVector(attributes.position, 0.0, 0.0, 2.0);
    CHECK_RESULT( gEventInstance.set3DAttributes(attributes) );

    gLastListenerPos = FMOD.VECTOR();
    gLastEventPos = FMOD.VECTOR();

    setVector(gLastListenerPos, 0.0, 0.0, 0.0);
    setVector(gLastEventPos, 0.0, 0.0, 0.0); 
}

// Called from main, on an interval that updates at a regular rate (like in a game loop).
// Prints out information, about the system, and importantly calles System::udpate().
function updateApplication() 
{
    var dsp = {};
    var stream = {};
    var update = {};
    var total = {};
    var result;
    
    result = gSystemLowLevel.getCPUUsage(dsp, stream, null, update, total);
    CHECK_RESULT(result);

    var channelsplaying = {};
    result = gSystemLowLevel.getChannelsPlaying(channelsplaying, null);
    CHECK_RESULT(result);

    document.querySelector("#display_out").value = "Channels Playing = " + channelsplaying.val + 
                                                   " : CPU = dsp " + dsp.val.toFixed(2) + 
                                                   "% stream " + stream.val.toFixed(2) + 
                                                   "% update " + update.val.toFixed(2) + 
                                                   "% total " + total.val.toFixed(2) + 
                                                   "%";
    var numbuffers = {};
    var buffersize = {};
    result = gSystemLowLevel.getDSPBufferSize(buffersize, numbuffers);
    CHECK_RESULT(result) 

    var rate = {};
    result = gSystemLowLevel.getSoftwareFormat(rate, null, null);
    CHECK_RESULT(result);

    var sysrate = {};
    result = gSystemLowLevel.getDriverInfo(0, null, null, sysrate, null, null);
    CHECK_RESULT(result);
    
    var ms = numbuffers.val * buffersize.val * 1000 / rate.val;
    document.querySelector("#display_out2").value = "Mixer rate = " + rate.val + "hz : System rate = " + sysrate.val + "hz : DSP buffer size = " + numbuffers.val + " buffers of " + buffersize.val + " samples (" + ms.toFixed(2) + " ms)";

    var rect;
    var pos  = FMOD.VECTOR();
    var vel  = FMOD.VECTOR();

    rect = document.getElementById("listener").getBoundingClientRect();
    pos.x = rect.left + (rect.width / 2);
    pos.y = 0;
    pos.z = rect.top + (rect.height / 2);
    vel.x = (pos.x - gLastListenerPos.x) / 50;              // setinterval is set to 20ms, so 50 times a second.   We need units moved per second, not per update.
    vel.z = (pos.z - gLastListenerPos.z) / 50;              // setinterval is set to 20ms, so 50 times a second.   We need units moved per second, not per update.
    update3DPosition("listener", pos, vel)
    gLastListenerPos.x = pos.x;
    gLastListenerPos.z = pos.z;

    rect = document.getElementById("event1").getBoundingClientRect();
    pos.x = rect.left + (rect.width / 2);
    pos.y = 0;
    pos.z = rect.top + (rect.height / 2);
    vel.x = (pos.x - gLastEventPos.x) / 50;           // setinterval is set to 20ms, so 50 times a second.   We need units moved per second, not per update.
    vel.z = (pos.z - gLastEventPos.z) / 50;           // setinterval is set to 20ms, so 50 times a second.   We need units moved per second, not per update.
    update3DPosition("event1", pos, vel)
    gLastEventPos.x = pos.x;
    gLastEventPos.z = pos.z;

    // Update FMOD
    result = gSystem.update();
    CHECK_RESULT(result);
}

var Telemetry = {
    live: true,

    // Ensures that the payload has a valid type
    validate: function(type) {
        return ['tutorial_phase_started',
                'tutorial_phase_completed',
                'tutorial_action_taken', // Unimplemented
                'tutorial_action_attempted', // Unimplemented
                'citizen_added_to_building',
                'citizen_removed_from_building',
                'building_added',
                'building_demolished',
                'building_destroyed',
                'private_money_added',
                'minister_hired',
                'minister_fired',
                'turn_completed',
                'game_lost',
                'game_won', // Unimplemented
                'game_restarted'
        ].includes(type);
    },

    // If telemetry is live and the payload type is valid, sends the payload to the server
    send: function(payload) {
        if (!Telemetry.live) return;

        if (!Telemetry.validate(payload.type)) {
            throw "Attempting to send telemetry with invalid type: " + payload.type;
            return;
        }

        // Stamp payload with session ID
        payload.sessionID = Global.sessionID;

        // TODO: Actually send payload to server
        console.log(payload.type, payload);
    },
};
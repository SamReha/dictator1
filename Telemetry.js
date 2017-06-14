var Telemetry = {
    live: false,

    // Ensures that the payload has a valid type
    validate: function(type) {
        return ['tutorial_phase_started', // Unimplemented
                'tutorial_phase_completed', // Unimplemented
                'tutorial_action_taken', // Unimplemented
                'citizen_added_to_building', // Unimplemented
                'citizen_removed_from_building', // Unimplemented
                'citizen_added_to_building', // Unimplemented
                'building_added', // Unimplemented
                'building_demolished', // Unimplemented
                'building_destroyed', // Unimplemented
                'private_money_added', // Unimplemented
                'minister_hired', // Unimplemented
                'minister_fired', // Unimplemented
                'turn_completed', // Unimplemented
                'game_lost', // Unimplemented
                'game_won', // Unimplemented
                'game_restarted' // Unimplemented
        ].contains(type);
    },

    send: function(payload) {
        if (!Telemetry.live) return;

        if (payload.sessionID === null || payload.sessionID === undefined || typeof(payload.sessionID) !== 'number') {
            throw "Attempting to send telemetry with invalid session ID: " + payload.type + ', ' + payload.sessionID;
            return;
        }

        if (!Telemetry.validate(payload.type)) {
            throw "Attempting to send telemetry with invalid type: " + payload.type;
            return;
        }

        console.log(payload.type, payload);
    },
};
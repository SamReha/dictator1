<?php
    function isValidJSON($str) {
        json_decode($str);
        return json_last_error() == JSON_ERROR_NONE;
    }

    $payload_json = file_get_contents("php://input");

    // If the input looks like a good json object, process it and send it to the DB.
    if (strlen($payload_json) > 0 && isValidJSON($payload_json)) {
        // Convert into dictionary
        $payload = json_decode($payload_json, true);

        // Extract type (table name)
        $table = $payload['type'];
        unset($payload['type']);

        // Extract sessionID
        $sessionID = $payload['sessionID'];
        unset($payload['sessionID']);

        // convert payload BACK into JSON now that table and ID have been extracted
        $cleanedPayload =json_encode($payload);

        // Get timestamp
        $timestamp = date("Y/m/d H:i:s");

        // Get ready to access the database!
        $servername = 'mysql.dictatorshipgame.com';
        $username = 'telemetry_system';
        $password = 'please_do_not_hack_me';

        // Try the connection
        try {
            $conn = new PDO("mysql:host=$servername;dbname=dictatorship_db", $username, $password);

            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

            // Write the payload into the appropriate table
            $sql = "INSERT INTO " . $table . " (time, sessionID, data) VALUES ('" . $timestamp . "', '" . $sessionID . "', '" . $cleanedPayload . "')";
            // use exec() because no results are returned
            $conn->exec($sql);
        } catch(PDOException $e) {
            // If connection failed, log it!
            $file = 'telemetry_logs.txt';
            // Open the file to get existing content
            $current = file_get_contents($file);
            // Append the new payload to the file as a string
            $current .= "Failed to connect to " . $servername . ": " . $e->getMessage() . ": " . $timestamp . "\n\n";
            // Write the contents back to the file
            file_put_contents($file, $current);
        }
    } else {
        // If we got a bad payload, log it!
        $file = 'telemetry_logs.txt';
        // Open the file to get existing content
        $current = file_get_contents($file);
        // Append the new payload to the file as a string
        $current .= "Got a bad payload: " . $payload_json . "\n\n";
        // Write the contents back to the file
        file_put_contents($file, $current);
    }

    // // If we're visiting the page, then show the contents of the debug file
    // $file = 'telemetry_debug.txt';
    // echo file_get_contents($file);
?>